## Azure Databricks — Workflows & Jobs

**Databricks Workflows** is the native orchestration service for scheduling and automating workloads inside Databricks. A **Job** is the deployable unit — it can run notebooks, Python scripts, JARs, Delta Live Tables pipelines, dbt projects, and SQL queries.

---

## Job Anatomy

```
Job: daily-sales-pipeline
├── Task 1: ingest_raw         (Notebook task)   → depends on nothing
├── Task 2: transform_silver   (Notebook task)   → depends on Task 1
├── Task 3: aggregate_gold     (Notebook task)   → depends on Task 2
└── Task 4: notify_on_failure  (Notebook task)   → runs only if Task 2 or 3 fails
```

&nbsp;&nbsp;- Jobs define a **DAG of tasks** — tasks with dependencies run sequentially; tasks without shared dependencies run in parallel.  
&nbsp;&nbsp;- Each task can use a different cluster configuration.
<br>

---

## Task Types

| Task Type | Description |
|---|---|
| **Notebook** | Run a Databricks notebook (most common) |
| **Python Script** | Run a `.py` file from a Repo or DBFS |
| **Python Wheel** | Run a packaged Python wheel — good for library-based code |
| **JAR** | Run a compiled Scala/Java JAR |
| **Spark Submit** | Low-level Spark job submission |
| **Delta Live Tables Pipeline** | Trigger a DLT pipeline run |
| **dbt** | Run a dbt project (Databricks native integration) |
| **SQL** | Run a SQL query on a SQL Warehouse |
| **Run Job** | Trigger another job as a sub-task |

---

## Cluster Configuration per Task

Each task can specify:
&nbsp;&nbsp;- **Existing all-purpose cluster** — reuse a running cluster (faster but shared state).  
&nbsp;&nbsp;- **New job cluster** — isolated cluster created for this task, terminated on completion (**recommended for production**).  
&nbsp;&nbsp;- **Existing cluster pool** — acquire VMs from a pre-warmed instance pool.
<br>

---

## Triggers

| Trigger Type | Description |
|---|---|
| **Manual** | Run on demand via UI, API, or CLI |
| **Scheduled (cron)** | Run on a fixed schedule (`0 2 * * *` = daily at 2 AM) |
| **File Arrival** | Trigger when files land in a specific ADLS Gen2 path (via Auto Loader) |
| **Continuous** | Job restarts automatically when it completes — used for streaming jobs |
| **API trigger** | Trigger via `POST /api/2.1/jobs/run-now` from an external system (ADF, Azure Logic Apps) |

---

## Task Dependencies & Conditional Execution

```python
# Databricks Asset Bundle (YAML) — job definition
resources:
  jobs:
    daily_pipeline:
      tasks:
        - task_key: ingest_raw
          notebook_task:
            notebook_path: /Repos/main/pipelines/ingest_raw

        - task_key: transform_silver
          depends_on:
            - task_key: ingest_raw
          notebook_task:
            notebook_path: /Repos/main/pipelines/transform_silver

        - task_key: notify_failure
          depends_on:
            - task_key: transform_silver
              outcome: FAILED
          notebook_task:
            notebook_path: /Repos/main/pipelines/send_alert
```

### Conditional Execution
Tasks can be configured to run based on the outcome of upstream tasks:
&nbsp;&nbsp;- `outcome: SUCCESS` — run only if the dependency succeeded.  
&nbsp;&nbsp;- `outcome: FAILED` — run only if the dependency failed (for error handling / alerting).  
&nbsp;&nbsp;- `outcome: ALL` (default) — run regardless of the dependency outcome.
<br>

---

## Retry Policies & Timeouts

```yaml
- task_key: transform_silver
  max_retries: 3
  min_retry_interval_millis: 60000   # 1 minute between retries
  retry_on_timeout: true
  timeout_seconds: 7200              # fail task after 2 hours
```

&nbsp;&nbsp;- **Retries** — useful for transient failures (network blips, throttling).  
&nbsp;&nbsp;- **Timeout** — prevents hung tasks from blocking the pipeline indefinitely.
<br>

---

## Job Parameters

Pass runtime parameters to all tasks in a job:

```json
{
  "job_id": 123,
  "notebook_params": {
    "start_date": "2024-06-01",
    "environment": "prod"
  }
}
```

Notebooks read these via `dbutils.widgets.get("start_date")`.
<br>

---

## Databricks Asset Bundles (DAB)

**Databricks Asset Bundles** is the official Infrastructure-as-Code framework for deploying Databricks resources (jobs, pipelines, clusters, permissions) as version-controlled YAML:

```yaml
# databricks.yml
bundle:
  name: analytics-pipeline

targets:
  dev:
    workspace:
      host: https://adb-xxx.azuredatabricks.net
    variables:
      environment: dev
  prod:
    workspace:
      host: https://adb-yyy.azuredatabricks.net
    variables:
      environment: prod
```

```bash
# Deploy to dev
databricks bundle deploy --target dev

# Run in dev
databricks bundle run daily_pipeline --target dev

# Deploy to prod (via CI/CD)
databricks bundle deploy --target prod
```

---

## Job Monitoring

&nbsp;&nbsp;- **Runs tab in the UI** — see all historical runs, task durations, status, and logs.  
&nbsp;&nbsp;- **Email / webhook notifications** — configure alerts on job start, success, failure, or duration threshold exceeded.  
&nbsp;&nbsp;- **Databricks system tables** (`system.lakeflow.job_run_timeline`) — query job execution history programmatically.  
&nbsp;&nbsp;- **Azure Monitor** — Databricks emits diagnostic logs to Log Analytics for integration with enterprise monitoring.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Job cluster per task** — production jobs should use job clusters, not all-purpose clusters; they are cheaper, isolated, and auto-terminate.  
&nbsp;&nbsp;- **DAB for CI/CD** — asset bundles replace manual job creation; jobs are code-reviewed and deployed via pipelines.  
&nbsp;&nbsp;- **Task dependencies vs ADF** — for purely Databricks workloads, Workflows is simpler than ADF; use ADF when orchestrating across non-Databricks Azure services (SQL DB, Blob copy, REST APIs).  
&nbsp;&nbsp;- **Retry on transient failure** — always set retries for jobs that interact with external systems (Event Hubs, REST APIs) where brief unavailability is normal.  
&nbsp;&nbsp;- **Conditional failure tasks** — pattern for sending Slack/Teams alerts or creating incidents when a production job fails.
