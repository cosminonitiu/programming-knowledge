## Azure Databricks Overview

**Azure Databricks** is a first-party Microsoft service that provides a fully managed Apache Spark environment, deeply integrated with the Azure ecosystem. It is the primary platform for data engineering, large-scale data transformation, machine learning, and real-time analytics on Azure.

---

## What Is Azure Databricks?

&nbsp;&nbsp;- Built on **Apache Spark** — the open-source distributed computing engine for big data.  
&nbsp;&nbsp;- Managed by Databricks, sold as a first-party Azure service — provisioned from the Azure portal and billed through Azure.  
&nbsp;&nbsp;- Uses the **Lakehouse** paradigm: combines the scalability of a data lake with the ACID guarantees and performance of a data warehouse, via **Delta Lake**.  
&nbsp;&nbsp;- Supports **Python, Scala, SQL, R, and Java** in the same environment.
<br>

---

## Architecture

```
Azure Tenant
└── Azure Databricks Workspace (PaaS resource)
    ├── Control Plane (managed by Databricks)
    │   ├── Web UI / REST API
    │   ├── Job Scheduler
    │   ├── Cluster Manager
    │   └── Unity Catalog Metastore
    └── Data Plane (in your Azure subscription)
        ├── Cluster VMs (driver + worker nodes)
        ├── DBFS (Databricks File System — backed by ADLS Gen2)
        └── Network (VNet-injected or default managed VNet)
```

&nbsp;&nbsp;- **Control Plane** — runs in Databricks' Azure subscription; handles orchestration, UI, and job management.  
&nbsp;&nbsp;- **Data Plane** — runs in **your** Azure subscription; your data never leaves your subscription.  
&nbsp;&nbsp;- **VNet injection** — deploy the data plane into a customer-managed VNet for network isolation (required for private environments).
<br>

---

## Key Platform Capabilities

### Collaborative Notebooks
Interactive notebooks with real-time co-authoring, inline visualisations, and support for Python, SQL, Scala, and R in the same file via `%python`, `%sql`, `%scala` magic commands.
<br>

### Apache Spark
&nbsp;&nbsp;- Distributed data processing at petabyte scale.  
&nbsp;&nbsp;- **DataFrame API** (PySpark) — structured, SQL-like operations on distributed datasets.  
&nbsp;&nbsp;- **Spark SQL** — run SQL queries on DataFrames and Delta tables.  
&nbsp;&nbsp;- **Spark Streaming** — micro-batch and continuous stream processing.
<br>

### Delta Lake
&nbsp;&nbsp;- ACID transactions on data lake storage.  
&nbsp;&nbsp;- Schema enforcement and evolution.  
&nbsp;&nbsp;- Time travel (query historical versions of a table).  
&nbsp;&nbsp;- Scalable metadata handling for tables with billions of files.
<br>

### MLflow (integrated)
&nbsp;&nbsp;- Experiment tracking, model registry, and model serving.  
&nbsp;&nbsp;- Log parameters, metrics, and artefacts from any ML training run.
<br>

### Unity Catalog
Unified governance layer: access control, data lineage, and a shared metastore across multiple Databricks workspaces.
<br>

---

## Azure-Specific Integration

| Azure Service | Integration |
|---|---|
| **ADLS Gen2** | Native ABFSS connector; managed identity or service principal auth |
| **Azure Key Vault** | Databricks secret scopes backed by Key Vault — `dbutils.secrets.get()` |
| **Azure Data Factory** | Databricks Notebook Activity and Jar Activity in ADF pipelines |
| **Azure DevOps / GitHub** | Repos integration for version-controlled notebooks and CI/CD |
| **Microsoft Entra ID** | SSO for workspace login; SCIM for user/group provisioning |
| **Azure Monitor** | Diagnostic logs and metrics forwarded to Log Analytics |
| **Azure Event Hubs** | Kafka-compatible connector for streaming ingestion |

---

## Workspace Object Types

| Object | Description |
|---|---|
| **Notebook** | Interactive code file; attached to a cluster |
| **Cluster** | Compute resource (driver + workers) |
| **Job** | Scheduled or triggered run of a notebook/script/pipeline |
| **Delta Live Tables (DLT) Pipeline** | Declarative ETL pipeline with auto data quality checks |
| **Repo** | Git-backed workspace folder (linked to Azure DevOps or GitHub) |
| **Secret Scope** | Secure key-value store backed by Databricks or Azure Key Vault |
| **SQL Warehouse** | Serverless/managed compute optimised for SQL and BI queries |

---

## Lakehouse Architecture on Azure Databricks

```
Ingestion
  ADF / Event Hubs / Auto Loader
        ↓
Bronze (raw Delta tables on ADLS Gen2)
  - Schema-on-read, append-only
        ↓
Silver (cleaned / conformed Delta tables)
  - Deduplication, type casting, joins
        ↓
Gold (business-level aggregates)
  - KPIs, reporting tables
        ↓
Consumption
  Power BI Direct Lake / Synapse serverless SQL / REST API
```

---

## Interview Talking Points

&nbsp;&nbsp;- **Control plane vs data plane** — your data stays in your subscription; only orchestration metadata goes to Databricks' control plane.  
&nbsp;&nbsp;- **Delta Lake is the default table format** — not just Parquet; Delta adds transactions, time travel, and schema enforcement.  
&nbsp;&nbsp;- **Photon engine** — a native C++ vectorised execution engine (available on all-purpose and job clusters) that significantly accelerates SQL and Delta operations.  
&nbsp;&nbsp;- **Unity Catalog vs legacy Hive metastore** — Unity Catalog is workspace-agnostic; the same tables and permissions apply across all workspaces in the account.  
&nbsp;&nbsp;- **VNet injection** — required for access to private resources (on-prem via ExpressRoute, private ADLS endpoints); without it, clusters use a managed public VNet.
