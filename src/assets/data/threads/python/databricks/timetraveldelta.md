## Delta Lake Time Travel
---

Time travel allows you to query historical versions of a Delta table — by version number or timestamp. This enables auditing, rollback, and reproducible analysis.

---

## 1. How It Works

The Delta transaction log records every commit as a new version. Reading an old version means reading the files that were active at that point:

```
Version 0: CREATE TABLE — 10 Parquet files added
Version 1: APPEND — 2 new files added
Version 2: DELETE — 1 file removed (old file marked as removed in log)
Version 3: MERGE  — 3 files added, 2 removed

Query "VERSION AS OF 1" → Spark resolves log → reads files active at v1
```

---

## 2. Reading Historical Versions

```python
# By version number
df_v0 = spark.read.format("delta") \
    .option("versionAsOf", 0) \
    .load("abfss://container@storage.dfs.core.windows.net/silver/orders")

df_v3 = spark.read.format("delta") \
    .option("versionAsOf", 3) \
    .table("silver.orders")

# By timestamp
df_yesterday = spark.read.format("delta") \
    .option("timestampAsOf", "2024-03-14") \
    .load("path/to/delta")

df_specific = spark.read.format("delta") \
    .option("timestampAsOf", "2024-03-14 09:00:00") \
    .table("silver.orders")
```

---

## 3. SQL Syntax

```sql
-- VERSION AS OF
SELECT * FROM silver.orders VERSION AS OF 5;

-- TIMESTAMP AS OF
SELECT * FROM silver.orders TIMESTAMP AS OF '2024-03-14';

-- Full timestamp
SELECT COUNT(*) FROM silver.orders TIMESTAMP AS OF '2024-03-14 09:00:00';

-- Compare current vs historical
SELECT
    c.order_id,
    c.status AS current_status,
    h.status AS previous_status
FROM silver.orders AS c
JOIN silver.orders VERSION AS OF 5 AS h
  ON c.order_id = h.order_id
WHERE c.status != h.status
```

---

## 4. RESTORE — Roll Back a Table

```python
from delta.tables import DeltaTable

dt = DeltaTable.forName(spark, "silver.orders")

# Roll back to a previous version
dt.restoreToVersion(3)

# Roll back to a timestamp
dt.restoreToTimestamp("2024-03-14 09:00:00")
```

```sql
-- SQL RESTORE
RESTORE TABLE silver.orders TO VERSION AS OF 3;
RESTORE TABLE silver.orders TO TIMESTAMP AS OF '2024-03-14';
```

---

## 5. View Table History

```python
from delta.tables import DeltaTable

dt = DeltaTable.forName(spark, "silver.orders")
display(dt.history())

# Key columns:
# version      — sequential version number
# timestamp    — when the commit happened
# operation    — WRITE, APPEND, MERGE, DELETE, OPTIMIZE, RESTORE
# userEmail    — who performed the operation
# operationParameters — predicate, mode, etc.
```

```sql
DESCRIBE HISTORY silver.orders;
DESCRIBE HISTORY silver.orders LIMIT 5;
```

---

## 6. Retention Period

Time travel only works while old Parquet files are retained:

```python
# Default retention: 30 days
# VACUUM removes files older than the retention period

# Check retention setting
spark.sql("SHOW TBLPROPERTIES silver.orders").show()

# Change retention
spark.sql("""
    ALTER TABLE silver.orders
    SET TBLPROPERTIES ('delta.logRetentionDuration' = 'interval 90 days')
""")

# VACUUM removes files older than retention threshold
spark.sql("VACUUM silver.orders RETAIN 30 HOURS")

# DRY RUN: see what would be deleted first
spark.sql("VACUUM silver.orders RETAIN 30 HOURS DRY RUN")
```

---

## 7. Use Cases

```python
# 1. Audit: who changed what, when
history = spark.sql("DESCRIBE HISTORY silver.orders")

# 2. Debugging: compare before/after a bad write
before = spark.read.format("delta").option("versionAsOf", 9).table("silver.orders")
after  = spark.read.format("delta").option("versionAsOf", 10).table("silver.orders")

# 3. Rollback: undo an accidental DELETE
dt.restoreToVersion(current_version - 1)

# 4. Reproducibility: ML training on exact snapshot used 3 months ago
training_data = spark.read.format("delta") \
    .option("timestampAsOf", "2024-01-01") \
    .table("silver.features")
```
