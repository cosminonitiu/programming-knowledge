## Databricks Overview
---

Databricks is a unified analytics platform built on Apache Spark, providing a collaborative workspace for data engineering, data science, and machine learning. It's available on Azure, AWS, and GCP.

---

## 1. Platform Architecture

```
┌──────────────────────────────────────────────────────────────────┐
│                     Databricks Workspace                          │
│                                                                   │
│  ┌──────────────┐  ┌─────────────┐  ┌──────────────────────────┐ │
│  │  Notebooks   │  │   Jobs /    │  │  Delta Live Tables (DLT) │ │
│  │  (Python,    │  │  Workflows  │  │  (managed ETL pipelines) │ │
│  │  SQL, Scala) │  │             │  │                          │ │
│  └──────────────┘  └─────────────┘  └──────────────────────────┘ │
│                                                                   │
│  ┌──────────────────────────────────────────────────────────────┐ │
│  │              Unity Catalog (Governance Layer)                │ │
│  │   catalog.schema.table   |   fine-grained access control    │ │
│  └──────────────────────────────────────────────────────────────┘ │
│                                                                   │
│  ┌──────────────┐  ┌─────────────────────────────────────────┐   │
│  │   Clusters   │  │           Delta Lake Storage             │   │
│  │ (All-purpose │  │   (Parquet + transaction log on ADLS/S3) │   │
│  │  / Job)      │  └─────────────────────────────────────────┘   │
│  └──────────────┘                                                 │
└──────────────────────────────────────────────────────────────────┘
            │ Cloud provider resources
  ┌─────────▼───────────┐
  │  Azure / AWS / GCP  │
  │  VMs, Storage,      │
  │  Networking         │
  └─────────────────────┘
```

---

## 2. Key Concepts

| Concept | Description |
|---------|-------------|
| **Workspace** | The web UI and environment where you work |
| **Cluster** | Group of VMs running Spark; driver + workers |
| **Notebook** | Interactive code document (Python/SQL/Scala/R cells) |
| **Job** | Scheduled or triggered run of notebook/script |
| **DBFS** | Databricks File System — abstraction over cloud storage |
| **dbutils** | Utility library for file operations, secrets, widgets |
| **Delta Lake** | The default table format — ACID, versioned Parquet |
| **Unity Catalog** | Centralised governance: `catalog.schema.table` |
| **DLT** | Delta Live Tables — declarative ETL pipeline engine |
| **Photon** | Vectorised C++ query engine replacing Spark JVM for SQL |

---

## 3. Databricks Runtime (DBR)

```python
# Each cluster uses a DBR version
# DBR 14.x = Spark 3.5 + Delta 3.x + Python 3.11 + many bundled libraries

# Check runtime version in a notebook
spark.version   # Spark version
dbutils.library.restartPython()  # restart Python interpreter

# ML Runtime (DBR ML) — includes: scikit-learn, XGBoost, TensorFlow, PyTorch
# GPU Runtime — CUDA-enabled instances for ML training
```

---

## 4. Connecting to Data

```python
# Azure Data Lake Storage Gen2 (with Unity Catalog: credentials managed automatically)
df = spark.read.parquet("abfss://container@storageaccount.dfs.core.windows.net/path/")

# With DBFS mount (legacy — Unity Catalog preferred)
df = spark.read.parquet("/mnt/datalake/bronze/orders/")

# Direct S3 (AWS)
df = spark.read.parquet("s3://my-bucket/data/")

# Unity Catalog table (3-level namespace)
df = spark.read.table("my_catalog.silver.orders")
df = spark.sql("SELECT * FROM my_catalog.silver.orders WHERE year = 2024")
```

---

## 5. Databricks SQL

```python
# SQL notebook — write pure SQL
SELECT
    region,
    DATE_TRUNC('month', order_date) AS month,
    SUM(amount) AS revenue
FROM silver.orders
WHERE status = 'shipped'
GROUP BY 1, 2
ORDER BY 2 DESC

-- Databricks SQL warehouses: serverless, autoscaling SQL endpoints
-- Used by BI tools (Power BI, Tableau) via JDBC/ODBC
```

---

## 6. Integration with Other Services

| Service | Integration |
|---------|-------------|
| Azure Data Lake / S3 | Native read/write (ABFSS, S3) |
| Azure DevOps / GitHub | Repo-connected notebooks, CI/CD |
| Apache Kafka | `readStream.format("kafka")` |
| Azure Event Hubs | `readStream.format("eventhubs")` |
| Power BI | JDBC/ODBC to Databricks SQL warehouse |
| MLflow | Built-in experiment tracking for ML |

---

## 7. Cost Optimisation

```python
# Use Job Clusters over All-Purpose (billed only during job run)
# Enable autoscaling to match cluster size to workload
# Use spot/preemptible instances for non-critical batch jobs
# Schedule jobs to run during off-peak hours

# Terminate idle all-purpose clusters automatically
# Set cluster auto-termination: 20-30 minutes
```
