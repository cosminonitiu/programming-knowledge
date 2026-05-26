## Delta Lake Introduction
---

Delta Lake is an open-source storage layer that adds ACID transactions, schema enforcement, and versioning to data lakes. It's the default table format in Databricks.

---

## 1. The Problem Delta Solves

Without Delta Lake (plain Parquet):
```
Problem 1 — No atomicity:
  Writer crashes halfway through → half-written data, corrupt table

Problem 2 — No consistent reads:
  Reader sees new files before writer finishes → dirty reads

Problem 3 — No schema enforcement:
  New writer adds column with wrong type → downstream breaks silently

Problem 4 — No versioning:
  Accidentally overwrote data → unrecoverable
```

---

## 2. Delta Lake Architecture

```
Delta Table =  Parquet files  +  Transaction Log (_delta_log/)

data/orders/
  ├── _delta_log/
  │     ├── 00000000000000000000.json   ← commit 0: initial write
  │     ├── 00000000000000000001.json   ← commit 1: appended records
  │     ├── 00000000000000000002.json   ← commit 2: DELETE
  │     └── 00000000000000000010.checkpoint.parquet  ← checkpoint (every 10 commits)
  ├── part-00000-abc.parquet
  ├── part-00001-def.parquet
  └── part-00002-ghi.parquet

The transaction log records every add/remove of Parquet files.
Reading a Delta table = read the log to determine which files are current.
```

---

## 3. Creating Delta Tables

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.getOrCreate()

# From DataFrame
df.write \
  .format("delta") \
  .mode("overwrite") \
  .save("abfss://container@storage.dfs.core.windows.net/silver/orders")

# As a catalog table (Unity Catalog)
df.write \
  .format("delta") \
  .mode("overwrite") \
  .saveAsTable("silver.orders")

# SQL DDL
spark.sql("""
    CREATE TABLE IF NOT EXISTS silver.orders (
        order_id    INT NOT NULL,
        customer_id INT,
        amount      DOUBLE,
        status      STRING,
        order_date  DATE
    )
    USING DELTA
    PARTITIONED BY (order_date)
    LOCATION 'abfss://container@storage.dfs.core.windows.net/silver/orders'
""")
```

---

## 4. ACID Properties in Delta Lake

| Property | Delta Lake Behaviour |
|----------|---------------------|
| **Atomicity** | A write either fully commits or fully rolls back |
| **Consistency** | Schema enforcement prevents invalid writes |
| **Isolation** | Concurrent reads/writes don't interfere (optimistic concurrency) |
| **Durability** | Committed data survives failures; log is persistent |

---

## 5. Schema Enforcement and Evolution

```python
# Schema enforcement (default) — reject writes that don't match
try:
    df_wrong_schema.write.format("delta").mode("append").save(path)
    # AnalysisException: schema mismatch
except Exception as e:
    print(e)

# Schema evolution — allow adding new columns
df_with_new_col.write \
    .format("delta") \
    .mode("append") \
    .option("mergeSchema", "true") \
    .save(path)

# Replace entire schema (rare — use with caution)
df.write \
    .format("delta") \
    .mode("overwrite") \
    .option("overwriteSchema", "true") \
    .save(path)
```

---

## 6. Reading Delta Tables

```python
# Read latest version (default)
df = spark.read.format("delta").load("path/to/delta")
df = spark.read.table("silver.orders")

# Read specific version (time travel)
df = spark.read.format("delta") \
    .option("versionAsOf", 5) \
    .load("path/to/delta")

# Read as stream (change data feed)
stream = spark.readStream.format("delta").load("path/to/delta")
```

---

## 7. Key Delta Lake Features Summary

| Feature | Description |
|---------|-------------|
| ACID transactions | Safe concurrent reads/writes |
| Schema enforcement | Rejects incompatible writes |
| Schema evolution | `mergeSchema` adds new columns safely |
| Time travel | Query historical versions |
| MERGE (upsert) | Efficient update-or-insert |
| OPTIMIZE / ZORDER | Compact small files, co-locate related data |
| Change Data Feed | Stream of row-level changes |
| Liquid clustering | Auto-manages clustering without partitioning |
