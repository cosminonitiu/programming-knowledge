## Azure Data Lake Storage Gen2 Overview

**Azure Data Lake Storage Gen2 (ADLS Gen2)** is Microsoft's scalable analytics storage service. It combines the massive scale and low cost of **Azure Blob Storage** with a **Hadoop-compatible hierarchical namespace (HNS)**, making it the standard landing zone for enterprise data lakes on Azure.

---

## How It Works

ADLS Gen2 is not a separate service — it is an **Azure Blob Storage account with the Hierarchical Namespace feature enabled**.

```
Storage Account (HNS enabled)
└── Container (maps to a filesystem root)
    ├── /raw/
    │   ├── /2024/01/01/
    │   │   └── events.parquet
    │   └── /2024/01/02/
    └── /processed/
        └── /sales/
            └── sales_2024.delta/
```

&nbsp;&nbsp;- **Without HNS (flat namespace):** renaming or deleting a "directory" requires listing and operating on every object individually — O(n) cost.  
&nbsp;&nbsp;- **With HNS (Gen2):** directories are real filesystem objects — rename and delete are O(1) atomic operations. This is critical for Spark job commit protocols (rename-based atomic writes).
<br>

---

## Key Concepts

### Storage Account
The top-level resource. A single storage account can hold multiple containers.

&nbsp;&nbsp;- Standard performance tier (HDDs, lower cost) or Premium (SSDs, for low-latency workloads).  
&nbsp;&nbsp;- **LRS** (locally redundant), **ZRS** (zone-redundant), **GRS** / **GZRS** (geo-redundant).  
&nbsp;&nbsp;- Globally unique DNS name: `https://<account>.dfs.core.windows.net` (DFS endpoint for HNS operations).
<br>

### Containers & Directories
&nbsp;&nbsp;- A **container** is the root filesystem (equivalent to a top-level folder).  
&nbsp;&nbsp;- Directories are first-class objects with their own ACL entries.  
&nbsp;&nbsp;- Common container layout:
<br>

```
raw/          → ingested data as-is (immutable)
curated/      → cleaned, conformed data (Delta Lake tables)
sandbox/      → ad-hoc exploration (short-lived)
```

### File Formats
&nbsp;&nbsp;- **Parquet** — columnar, splittable, efficient for analytics reads — most common format.  
&nbsp;&nbsp;- **Delta Lake** — Parquet + transaction log (ACID, time travel, schema enforcement).  
&nbsp;&nbsp;- **Avro** — row-based, good for event streaming (Kafka sink).  
&nbsp;&nbsp;- **ORC** — columnar, primarily used in Hive/Hadoop ecosystems.
<br>

---

## Accessing ADLS Gen2

### ABFSS URI (Azure Blob Filesystem Scheme)
```
abfss://<container>@<account>.dfs.core.windows.net/<path>

Example:
abfss://raw@adlsanalyticsprod.dfs.core.windows.net/2024/01/events.parquet
```

Used by Apache Spark (Azure Databricks, Azure Synapse) to access ADLS Gen2 natively.
<br>

### Access Methods

| Method | Use case |
|---|---|
| **Managed Identity + RBAC** | Databricks, ADF, Functions — no secrets |
| **Service Principal + RBAC** | External apps, CI/CD pipelines |
| **Shared Access Signature (SAS)** | Time-limited, scoped delegation — avoid where possible |
| **Storage Account Key** | Full admin access — use only for initial setup, store in Key Vault |
| **ACLs (POSIX-style)** | Fine-grained per-file/directory permissions in addition to RBAC |

---

## Mounting in Azure Databricks

### Option 1: Unity Catalog External Location (recommended)
Unity Catalog abstracts the ADLS path behind a governed external location — no explicit mount point needed; access is controlled via Unity Catalog privileges.
<br>

### Option 2: Direct ABFSS with Service Principal
```python
spark.conf.set(
    "fs.azure.account.auth.type.<account>.dfs.core.windows.net",
    "OAuth"
)
spark.conf.set(
    "fs.azure.account.oauth.provider.type.<account>.dfs.core.windows.net",
    "org.apache.hadoop.fs.azurebfs.oauth2.ClientCredsTokenProvider"
)
spark.conf.set(
    "fs.azure.account.oauth2.client.id.<account>.dfs.core.windows.net",
    dbutils.secrets.get(scope="kv", key="sp-client-id")
)
spark.conf.set(
    "fs.azure.account.oauth2.client.secret.<account>.dfs.core.windows.net",
    dbutils.secrets.get(scope="kv", key="sp-client-secret")
)
spark.conf.set(
    "fs.azure.account.oauth2.client.endpoint.<account>.dfs.core.windows.net",
    f"https://login.microsoftonline.com/{tenant_id}/oauth2/token"
)

df = spark.read.parquet("abfss://raw@myaccount.dfs.core.windows.net/events/")
```

---

## Performance Considerations

&nbsp;&nbsp;- **File size** — aim for 128 MB–1 GB per Parquet/Delta file for optimal Spark read performance. Avoid millions of tiny files (small-file problem).  
&nbsp;&nbsp;- **Partitioning** — partition Delta tables by high-cardinality filter columns (e.g., `year`, `month`, `day`, `region`) to enable partition pruning.  
&nbsp;&nbsp;- **Compaction** — run `OPTIMIZE` on Delta tables periodically to merge small files.  
&nbsp;&nbsp;- **Colocate compute and storage** — run Databricks clusters in the same Azure region as the ADLS storage account to avoid cross-region egress costs and latency.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **HNS = O(1) directory rename** — critical for Spark's atomic commit protocol; without it, `_SUCCESS` file placement and commit are expensive.  
&nbsp;&nbsp;- **ADLS Gen2 ≠ Azure Data Lake Store Gen1** — Gen1 is a legacy service; Gen2 is the current standard, built on Blob Storage.  
&nbsp;&nbsp;- **Managed Identity over SAS/keys** — SAS tokens can be leaked; managed identities have no exportable credential.  
&nbsp;&nbsp;- **Bronze/Silver/Gold (Medallion architecture)** — ADLS Gen2 is the typical storage layer for all three tiers in a Lakehouse architecture.  
&nbsp;&nbsp;- **Data residency** — ADLS respects region selection; GRS replicates to the paired region, important for compliance.
