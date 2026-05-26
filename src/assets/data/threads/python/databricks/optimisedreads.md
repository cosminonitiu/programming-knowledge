## Optimised Reads in Delta Lake
---

Delta Lake provides several mechanisms to optimise read performance: OPTIMIZE compacts small files, Z-ORDER co-locates related data, data skipping eliminates irrelevant files, and Liquid Clustering automates the process.

---

## 1. The Small Files Problem

```
Streaming writes and frequent small appends create many tiny Parquet files:
  table/
    part-000001.parquet (1MB)
    part-000002.parquet (500KB)
    part-000003.parquet (200KB)
    ... (thousands of files)

→ Slow reads: file open overhead per file
→ Slow scans: can't skip files efficiently
→ Driver bottleneck: listing thousands of files
```

---

## 2. OPTIMIZE — Compact Small Files

```sql
-- Compact all files in the table to target 1GB each
OPTIMIZE silver.orders;

-- Compact only specific partitions (faster for large tables)
OPTIMIZE silver.orders WHERE order_date >= '2024-01-01';
```

```python
from delta.tables import DeltaTable

dt = DeltaTable.forName(spark, "silver.orders")
dt.optimize().executeCompaction()

# With partition filter
dt.optimize().where("order_date >= '2024-01-01'").executeCompaction()
```

---

## 3. Z-ORDER — Co-Locate Related Data

Z-ORDER reorders data within each file so rows with similar values of the Z-ORDER columns are stored together. This enables data skipping:

```sql
-- OPTIMIZE with Z-ORDER
OPTIMIZE silver.orders ZORDER BY (customer_id, order_date);

-- Multi-column Z-ORDER (diminishing returns after 2-3 columns)
OPTIMIZE silver.orders ZORDER BY (region, product_id);
```

```python
dt.optimize().executeZOrderBy("customer_id", "order_date")
```

**Best columns to Z-ORDER:**
- Columns frequently used in WHERE filters
- High-cardinality columns (customer_id, product_id)
- Don't Z-ORDER the partition column (already partitioned)

---

## 4. Data Skipping

Delta Lake collects statistics (min, max, null_count) for the first 32 columns of each Parquet file. When querying with a filter, files that can't contain matching rows are skipped:

```python
# Spark reads statistics from the transaction log — no file scan needed to skip
df = spark.read.table("silver.orders") \
    .filter("customer_id = 12345")

# If 9/10 files have min_customer_id > 12345 or max_customer_id < 12345,
# those files are skipped entirely

# Check statistics
dt.detail().show()
```

```sql
-- Verify data skipping is working
EXPLAIN SELECT * FROM silver.orders WHERE customer_id = 12345;
-- Look for: "number of files scanned" vs "number of files total"
```

---

## 5. Liquid Clustering (Delta 3.x / Databricks Runtime 13.3+)

Liquid Clustering replaces both partitioning and Z-ORDER with an automatic, incremental clustering approach:

```sql
-- Enable liquid clustering at table creation
CREATE TABLE silver.orders (
    order_id    INT,
    customer_id INT,
    amount      DOUBLE,
    order_date  DATE
)
USING DELTA
CLUSTER BY (customer_id, order_date);

-- Or enable on existing table
ALTER TABLE silver.orders CLUSTER BY (customer_id, order_date);

-- Run incremental clustering (only processes unclustered new data)
OPTIMIZE silver.orders;
```

**Liquid Clustering vs Z-ORDER:**
- Z-ORDER rewrites all files every run (expensive).
- Liquid Clustering is incremental — only processes new/changed files.
- Better for frequently updated or streaming tables.

---

## 6. Auto OPTIMIZE (Databricks)

```sql
-- Auto-compact: automatically compact after writes (background)
ALTER TABLE silver.orders
SET TBLPROPERTIES ('delta.autoOptimize.autoCompact' = 'true');

-- Optimized writes: Databricks coalesces partitions before writing
-- (reduces small files from streaming/batch writes)
ALTER TABLE silver.orders
SET TBLPROPERTIES ('delta.autoOptimize.optimizeWrite' = 'true');
```

---

## 7. VACUUM — Remove Old Files

```sql
-- Default: remove files older than 7 days (retention period)
VACUUM silver.orders;

-- Custom retention (minimum 7 days to protect time travel)
VACUUM silver.orders RETAIN 168 HOURS;   -- 7 days

-- Dry run first
VACUUM silver.orders RETAIN 168 HOURS DRY RUN;
```
