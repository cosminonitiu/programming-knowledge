## CI/CD for Databricks Notebooks & Pipelines

Production data engineering on Azure Databricks requires the same engineering rigour as application development — version control, automated testing, environment promotion, and reproducible deployments. The standard toolchain is **Git (Azure DevOps Repos or GitHub) + Databricks Asset Bundles + Azure Pipelines (or GitHub Actions)**.

---

## The Problem with Manual Notebook Deployment

| Anti-pattern | Risk |
|---|---|
| Editing notebooks directly in prod workspace | No review, no rollback, no audit trail |
| Copy-pasting notebooks between workspaces | Drift between environments, hard to track what changed |
| Shared all-purpose cluster for all jobs | One user's change breaks another's scheduled job |
| Secrets hard-coded in notebooks | Credential exposure via Git history or notebook sharing |

---

## Solution Stack

```
Developer Laptop
    └── Git (Azure DevOps Repos)
           ↓  Pull Request
    Code Review + Automated Tests
           ↓  Merge to main
    Azure Pipelines (CI/CD)
           ↓  databricks bundle deploy --target prod
    Databricks Workspace (Prod)
```

---

## Databricks Asset Bundles (DAB)

**Databricks Asset Bundles** is the official IaC framework — it packages notebooks, jobs, pipelines, cluster configs, and permissions into a version-controlled bundle.

### Project Structure
```
my-pipeline/
├── databricks.yml          ← bundle root config
├── resources/
│   ├── jobs/
│   │   └── daily_sales_job.yml
│   └── pipelines/
│       └── silver_dlt.yml
├── src/
│   ├── notebooks/
│   │   ├── ingest_raw.py
│   │   └── transform_silver.py
│   └── utils/
│       └── helpers.py
└── tests/
    └── test_helpers.py
```

### `databricks.yml` — Bundle Root
```yaml
bundle:
  name: analytics-pipeline

variables:
  environment:
    default: dev

targets:
  dev:
    mode: development
    workspace:
      host: https://adb-dev-xxx.azuredatabricks.net
    variables:
      environment: dev

  prod:
    mode: production
    workspace:
      host: https://adb-prod-yyy.azuredatabricks.net
    variables:
      environment: prod
    permissions:
      - group_name: data-engineers
        level: CAN_MANAGE_RUN
```

### Job Definition
```yaml
# resources/jobs/daily_sales_job.yml
resources:
  jobs:
    daily_sales_job:
      name: "Daily Sales Pipeline [${var.environment}]"
      schedule:
        quartz_cron_expression: "0 0 2 * * ?"   # daily at 2 AM UTC
        timezone_id: "UTC"
        pause_status: UNPAUSED

      job_clusters:
        - job_cluster_key: main_cluster
          new_cluster:
            spark_version: "14.3.x-scala2.12"
            node_type_id: "Standard_DS3_v2"
            num_workers: 4
            spark_env_vars:
              ENVIRONMENT: "${var.environment}"

      tasks:
        - task_key: ingest_raw
          job_cluster_key: main_cluster
          notebook_task:
            notebook_path: src/notebooks/ingest_raw.py
            base_parameters:
              environment: "${var.environment}"

        - task_key: transform_silver
          depends_on:
            - task_key: ingest_raw
          job_cluster_key: main_cluster
          notebook_task:
            notebook_path: src/notebooks/transform_silver.py
```

---

## Azure Pipelines — CI/CD Pipeline

### `azure-pipelines.yml`
```yaml
trigger:
  branches:
    include:
      - main

stages:
  - stage: Test
    jobs:
      - job: RunTests
        pool:
          vmImage: ubuntu-latest
        steps:
          - task: UsePythonVersion@0
            inputs:
              versionSpec: '3.11'
          - script: |
              pip install databricks-sdk pytest pyspark delta-spark
              pytest tests/ -v
            displayName: Run unit tests

  - stage: DeployDev
    dependsOn: Test
    condition: succeeded()
    jobs:
      - job: DeployToDev
        steps:
          - script: |
              pip install databricks-cli
              databricks bundle deploy --target dev
            env:
              DATABRICKS_TOKEN: $(DATABRICKS_DEV_TOKEN)
            displayName: Deploy to Dev

  - stage: DeployProd
    dependsOn: DeployDev
    condition: and(succeeded(), eq(variables['Build.SourceBranch'], 'refs/heads/main'))
    jobs:
      - deployment: DeployToProd
        environment: production    # requires manual approval gate
        steps:
          - script: |
              databricks bundle deploy --target prod
            env:
              DATABRICKS_TOKEN: $(DATABRICKS_PROD_TOKEN)
            displayName: Deploy to Prod
```

---

## Testing Strategy

### Unit Testing (pytest + PySpark)
```python
# tests/test_helpers.py
from pyspark.sql import SparkSession
from src.utils.helpers import deduplicate_sales

def test_deduplicate_sales(spark: SparkSession):
    input_data = [
        (1, "2024-01-01", 100.0),
        (1, "2024-01-01", 100.0),   # duplicate
        (2, "2024-01-02", 200.0),
    ]
    df = spark.createDataFrame(input_data, ["sale_id", "date", "amount"])
    result = deduplicate_sales(df)
    assert result.count() == 2
```

### Integration Testing
&nbsp;&nbsp;- Run the job against a **dev workspace** with a sample dataset.  
&nbsp;&nbsp;- Assert output table row counts and schema match expectations.  
&nbsp;&nbsp;- Use job run API to trigger and poll for completion.
<br>

---

## Branching Strategy

```
main           → deploys to prod (protected, requires PR + approval)
release/*      → deploys to test/UAT
feature/*      → developer branches, deploys to personal dev workspace
```

&nbsp;&nbsp;- **Feature branches** — each developer works in a separate Databricks Repo branch; deploying to their own dev workspace prevents conflicts.  
&nbsp;&nbsp;- **Pull request gates** — automated tests must pass before merge to main.  
&nbsp;&nbsp;- **Environment-specific variable groups** — Azure DevOps variable groups store environment secrets (Databricks PAT tokens, service principal credentials) — never in YAML files.
<br>

---

## Secret Handling in CI/CD

```yaml
# Azure DevOps — reference a secret variable group
variables:
  - group: databricks-prod-secrets  # contains DATABRICKS_PROD_TOKEN, SP_CLIENT_SECRET, etc.

steps:
  - script: databricks bundle deploy --target prod
    env:
      DATABRICKS_HOST: $(DATABRICKS_PROD_HOST)
      DATABRICKS_TOKEN: $(DATABRICKS_PROD_TOKEN)
```

&nbsp;&nbsp;- Store all secrets in **Azure DevOps variable groups** (backed by Azure Key Vault).  
&nbsp;&nbsp;- Never echo or print secret variables in pipeline logs.  
&nbsp;&nbsp;- Use a **service principal** (not a personal PAT token) for production deployments.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **DAB replaces manual job creation** — jobs, clusters, and permissions are defined as code, reviewed in PRs, and deployed idempotently.  
&nbsp;&nbsp;- **Job cluster per deployment** — the bundle defines job clusters, ensuring prod jobs run on the same cluster config that was tested.  
&nbsp;&nbsp;- **Variable groups + Key Vault** — no secrets in pipeline YAML; the pipeline references variable groups that pull from Key Vault at runtime.  
&nbsp;&nbsp;- **Approval gates for prod** — Azure DevOps `environment` with required reviewers prevents accidental prod deployments.  
&nbsp;&nbsp;- **pytest + PySpark locally** — unit tests run without a Databricks cluster using a local SparkSession; fast feedback loop.
