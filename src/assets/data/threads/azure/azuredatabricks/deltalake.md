## Delta Lake

**Delta Lake** is an open-source storage layer built on top of Parquet files that adds **ACID transactions**, **schema enforcement**, **time travel**, and **scalable metadata management** to data lake storage. It is the default table format in Azure Databricks.

---

## Why Delta Lake?

Plain Parquet on a data lake has fundamental limitations:

| Problem | Impact |
|---|---|
| No atomic writes | Partial failures leave tables in an inconsistent state |
| No schema enforcement | Bad data silently enters the table |
| No updates/deletes | Cannot correct historical data without full rewrites |
| Poor metadata scalability | Listing millions of files is slow |
| No concurrent reads during writes | Readers see partial results during a write |

Delta Lake solves all of these.
<br>

---

## How Delta Lake Works

A Delta table is a directory on ADLS Gen2 containing:

```
/my_delta_table/
├── _delta_log/               ← transaction log (JSON + Parquet checkpoint files)
│   ├── 00000000000000000000.json
│   ├── 00000000000000000001.json
│   └── 00000000000000000010.checkpoint.parquet
├── part-00000-....snappy.parquet
├── part-00001-....snappy.parquet
└── ...
```

&nbsp;&nbsp;- Every write (insert, update, delete, schema change) creates a new **commit entry** in the `_delta_log/`.  
&nbsp;&nbsp;- Readers always read the transaction log first to determine which Parquet files constitute the **current version** of the table.  
&nbsp;&nbsp;- **Checkpoints** are full snapshots of the log written every 10 commits to speed up log replay.
<br>

---

## ACID Transactions

| Property | Delta Lake guarantee |
|---|---|
| **Atomicity** | A write either fully succeeds or leaves the table unchanged — no partial states |
| **Consistency** | Schema enforcement rejects writes that violate the schema |
| **Isolation** | Concurrent reads and writes are isolated via optimistic concurrency control |
| **Durability** | Committed data is persisted to ADLS Gen2 |

---

## Core Operations

### Read & Write
```python
# Write (creates or overwrites)
df.write.format("delta").mode("overwrite").save(
    "abfss://curated@myaccount.dfs.core.windows.net/sales/"
)

# Append
df.write.format("delta").mode("append").save(
    "abfss://curated@myaccount.dfs.core.windows.net/sales/"
)

# Read
df = spark.read.format("delta").load(
    "abfss://curated@myaccount.dfs.core.windows.net/sales/"
)
```

### MERGE (Upsert)
```python
from delta.tables import DeltaTable

delta_table = DeltaTable.forPath(
    spark, "abfss://curated@myaccount.dfs.core.windows.net/sales/"
)

delta_table.alias("target").merge(
    source=new_data.alias("source"),
    condition="target.sale_id = source.sale_id"
).whenMatchedUpdateAll(
).whenNotMatchedInsertAll(
).execute()
```

MERGE is atomic — either all matched rows are updated/inserted or nothing changes.
<br>

### Schema Enforcement & Evolution
```python
# Schema enforcement (default) — rejects writes with incompatible schema
df_with_extra_col.write.format("delta").mode("append").save(path)
# AnalysisException: A schema mismatch detected

# Schema evolution — allow adding new columns
df_with_extra_col.write.format("delta").mode("append") \
    .option("mergeSchema", "true").save(path)
```

---

## Time Travel

Delta Lake retains historical versions of a table — you can query any past version.

```python
# Query a specific version
df_v3 = spark.read.format("delta").option("versionAsOf", 3).load(path)

# Query at a specific timestamp
df_yesterday = spark.read.format("delta") \
    .option("timestampAsOf", "2024-06-01") \
    .load(path)
```

```sql
-- SQL syntax
SELECT * FROM sales VERSION AS OF 3;
SELECT * FROM sales TIMESTAMP AS OF '2024-06-01';
```

Time travel history is retained until `VACUUM` is run.
<br>

---

## OPTIMIZE & VACUUM

### OPTIMIZE — Compaction
Small files accumulate over time (from streaming ingestion, frequent small appends), degrading read performance.

```sql
OPTIMIZE sales;

-- Z-ORDER: colocate related data for efficient filtering
OPTIMIZE sales ZORDER BY (region, sale_date);
```

&nbsp;&nbsp;- Merges small Parquet files into larger ones (target ~1 GB each).  
&nbsp;&nbsp;- **Z-ORDER** reorders data within files to colocate rows with the same filter values, reducing the amount of data scanned.
<br>

### VACUUM — Cleanup
Remove old Parquet files that are no longer part of any table version (after time travel retention expires).

```sql
-- Default: removes files older than 7 days (168 hours)
VACUUM sales;

-- Custom retention (minimum 7 days enforced by default)
VACUUM sales RETAIN 336 HOURS;  -- 14 days
```

> Do not run VACUUM with a retention period shorter than your longest-running query — a concurrent reader may still reference the files being deleted.

---

## DESCRIBE HISTORY

Inspect the full audit log of all operations on a table:

```sql
DESCRIBE HISTORY sales;
```

Returns: version number, timestamp, user, operation type (WRITE, MERGE, OPTIMIZE, VACUUM), operation parameters, and metrics.
<br>

---

## Delta Live Tables (DLT)

**Delta Live Tables** is a declarative ETL framework built on Delta Lake:

```python
import dlt

@dlt.table(comment="Raw sales events from Event Hub")
def raw_sales():
    return spark.readStream.format("cloudFiles") \
        .option("cloudFiles.format", "json") \
        .load("abfss://raw@myaccount.dfs.core.windows.net/sales/")

@dlt.table(comment="Cleaned sales with type enforcement")
@dlt.expect("valid_amount", "amount > 0")
def silver_sales():
    return dlt.read_stream("raw_sales") \
        .select("sale_id", "region", col("amount").cast("double"), "sale_date")
```

&nbsp;&nbsp;- Declarative DAG — DLT infers table dependencies automatically.  
&nbsp;&nbsp;- Built-in **data quality expectations** (`@dlt.expect`) with quarantine options.  
&nbsp;&nbsp;- Auto-manages pipeline restarts and incremental processing.
<br>

---

## Interview Talking Points

&nbsp;&nbsp;- **MERGE for upserts** — the go-to pattern for CDC (Change Data Capture) pipelines; avoids duplicates when reprocessing.  
&nbsp;&nbsp;- **OPTIMIZE + ZORDER** — run after bulk loads or on a schedule; ZORDER is effective when queries filter by the same 1–3 columns repeatedly.  
&nbsp;&nbsp;- **Time travel for auditing** — useful for debugging pipelines ("what did this table look like before yesterday's job?").  
&nbsp;&nbsp;- **VACUUM retention** — set to at least 7 days (default) to support time travel; balance cost vs recovery window.  
&nbsp;&nbsp;- **Delta vs Parquet** — in Databricks, always use Delta; Parquet is a building block of Delta, not an alternative.
