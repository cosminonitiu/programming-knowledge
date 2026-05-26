## Azure Databricks — Clusters & Compute

A **cluster** is the set of virtual machines that execute Spark workloads in Databricks. Understanding cluster types, configuration, and cost controls is essential for both interviews and production deployments.

---

## Cluster Types

### All-Purpose Cluster
&nbsp;&nbsp;- Started manually or via API; persists until terminated.  
&nbsp;&nbsp;- Used for **interactive development** — notebooks, ad-hoc queries, exploration.  
&nbsp;&nbsp;- Can be shared by multiple users concurrently.  
&nbsp;&nbsp;- **Cost:** billed even when idle (unless auto-termination is set).
<br>

### Job Cluster
&nbsp;&nbsp;- Created at the start of a **Databricks Job run** and terminated when the job completes.  
&nbsp;&nbsp;- Isolated — dedicated to a single job run for reproducibility and security.  
&nbsp;&nbsp;- **Cost:** pay only for the duration of the job — preferred for production workflows.
<br>

### SQL Warehouse (formerly SQL Endpoint)
&nbsp;&nbsp;- Optimised for **SQL analytics and BI** — used by Databricks SQL, Power BI, Tableau.  
&nbsp;&nbsp;- Supports **Serverless** (compute managed by Databricks in their infrastructure), **Pro**, and **Classic** modes.  
&nbsp;&nbsp;- Auto-starts and auto-stops based on query activity; supports query queuing.  
&nbsp;&nbsp;- Uses the **Photon** engine by default for maximum SQL performance.
<br>

---

## Cluster Configuration

### Node Types
&nbsp;&nbsp;- **Driver node** — coordinates the Spark application: job planning, task scheduling, result collection.  
&nbsp;&nbsp;- **Worker nodes** — execute tasks in parallel; hold RDD/DataFrame partitions.  
&nbsp;&nbsp;- Size selection: memory-optimised VMs for large in-memory datasets; compute-optimised for CPU-bound transformations.
<br>

### Single Node vs Multi-Node

| Mode | Description | Use case |
|---|---|---|
| **Single Node** | Driver only, no workers; Spark runs locally | ML model training, small datasets, testing |
| **Multi-Node** | Driver + 1+ workers | Production ETL, large-scale processing |

### Autoscaling
```
min_workers: 2
max_workers: 10
```
Databricks monitors the ratio of active tasks to available slots and scales up/down accordingly. Autoscaling is recommended for workloads with variable data volumes.
<br>

### Auto-Termination
Set an idle timeout (e.g., 30 minutes) on all-purpose clusters to prevent runaway costs when a notebook is left running.
<br>

---

## Instance Pools

An **instance pool** pre-allocates and holds idle VM instances, dramatically reducing cluster startup time (from ~5 minutes to ~30 seconds).

```
Instance Pool: pool-analytics-standard-ds3v2
  VM size: Standard_DS3_v2
  Min idle: 2
  Max capacity: 20
  Idle instance auto-termination: 60 minutes
```

&nbsp;&nbsp;- Clusters attached to a pool acquire VMs from the pool instead of provisioning from scratch.  
&nbsp;&nbsp;- Idle pool instances are cheaper than running cluster instances (no DBU charge when idle, only VM cost).
<br>

---

## Cluster Policies

**Cluster policies** are JSON-based rules that restrict what cluster configurations users can create.

```json
{
  "instance_pool_id": {
    "type": "fixed",
    "value": "0123-456789-pool-abc"
  },
  "autotermination_minutes": {
    "type": "range",
    "minValue": 10,
    "maxValue": 60,
    "defaultValue": 30
  },
  "spark_conf.spark.databricks.cluster.profile": {
    "type": "fixed",
    "value": "singleNode",
    "hidden": true
  }
}
```

Use policies to:
&nbsp;&nbsp;- Enforce auto-termination across all user clusters.  
&nbsp;&nbsp;- Restrict to approved VM types or instance pools.  
&nbsp;&nbsp;- Limit maximum cluster size to control costs.
<br>

---

## Databricks Units (DBUs)

DBUs are the billing unit for Databricks compute — charged per VM-hour based on the workload type and cluster tier:

| Workload | DBU rate |
|---|---|
| All-Purpose Compute | Highest (interactive development) |
| Jobs Compute | Lower (~60% of all-purpose) |
| Jobs Light Compute | Lowest (single-machine, no Spark) |
| SQL Serverless | Per-query model |

Azure combines DBU cost with the underlying VM cost (billed separately via Azure).
<br>

---

## Photon Engine

**Photon** is Databricks' native vectorised query execution engine, written in C++.

&nbsp;&nbsp;- Accelerates SQL queries, Delta reads/writes, and common ETL operations by 2–8x vs standard Spark.  
&nbsp;&nbsp;- Enabled by selecting a **Photon-enabled runtime** (Databricks Runtime 9.1+).  
&nbsp;&nbsp;- Fully transparent — no code changes required; the same SQL/DataFrame code runs on Photon automatically.  
&nbsp;&nbsp;- Incurs a higher DBU rate but typically reduces total wall-clock time (and therefore total cost) significantly.
<br>

---

## Runtime Versions

Databricks Runtime (DBR) packages Spark, Delta Lake, Python, ML libraries, and platform integrations.

&nbsp;&nbsp;- **DBR x.y** — standard runtime (Spark + Delta + Python).  
&nbsp;&nbsp;- **DBR x.y ML** — adds MLflow, TensorFlow, PyTorch, scikit-learn, XGBoost.  
&nbsp;&nbsp;- **DBR x.y Photon** — standard + Photon engine.  
&nbsp;&nbsp;- **Long-Term Support (LTS)** versions — stable, patched for 2 years — use LTS for production jobs.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **Job cluster over all-purpose for production** — isolated environment, no interference from other users, auto-terminates, lower DBU rate.  
&nbsp;&nbsp;- **Instance pools for fast startup** — critical for latency-sensitive job pipelines where cold start time matters.  
&nbsp;&nbsp;- **Cluster policy = cost governance** — without policies, users can create large clusters that run indefinitely.  
&nbsp;&nbsp;- **Driver bottleneck** — in large clusters the driver node collects results; if it OOMs, consider using `spark.write` instead of `collect()`, or increasing driver memory.  
&nbsp;&nbsp;- **Autoscaling caveats** — autoscaling is less predictable with streaming workloads; for structured streaming, fixed cluster size with a stream-specific cluster is often preferred.
