## Partitioning in Spark
---

Partitioning determines how data is distributed across the cluster and how it's physically stored. Correct partitioning is one of the highest-leverage performance optimisations in Spark.

---

## 1. What is a Partition?

A partition is one chunk of data processed by a single task on one executor core:

```
DataFrame (100GB, 800 partitions)
  Partition 0 (128MB) → Task → Executor Core 1
  Partition 1 (128MB) → Task → Executor Core 2
  ...
  Partition 799 (128MB) → Task → Executor Core N
```

More partitions = more parallelism, up to the number of available executor cores.

---

## 2. In-Memory Partitioning

```python
# Check current partition count
print(df.rdd.getNumPartitions())

# Repartition — shuffle data into N equal partitions (expensive, full shuffle)
df = df.repartition(200)

# Repartition by column — co-locate all rows with the same key
df = df.repartition(200, "customer_id")
df = df.repartition(200, "year", "month")

# Coalesce — reduce partitions without a full shuffle (only merges, no redistribution)
# Use after a filter that significantly reduced row count
df = df.coalesce(50)

# Rule of thumb: 2-4 partitions per CPU core, ~128MB per partition
```

---

## 3. Shuffle Partitions

Wide transformations (groupBy, join, sort) produce N shuffle partitions, controlled by:

```python
# Default is 200 — often too high for small data, too low for large data
spark.conf.set("spark.sql.shuffle.partitions", "400")

# AQE (Adaptive Query Execution) — Spark 3.x auto-tunes this
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.adaptive.advisoryPartitionSizeInBytes", "128MB")
```

---

## 4. Disk (Write-Time) Partitioning

```python
# Partition Parquet files by date columns for efficient reads
df.write \
  .mode("overwrite") \
  .partitionBy("year", "month", "day") \
  .parquet("s3://bucket/orders/")

# Resulting file structure:
# orders/
#   year=2024/
#     month=01/
#       day=01/
#         part-00000.parquet

# Delta Lake
df.write \
  .format("delta") \
  .mode("overwrite") \
  .partitionBy("region") \
  .save("abfss://container@storage.dfs.core.windows.net/silver/orders")
```

---

## 5. Partition Pruning

Partition pruning is the key benefit of disk partitioning — Spark skips irrelevant partitions entirely:

```python
# Spark reads ONLY the partitions matching the filter — no full table scan
result = spark.read.parquet("s3://bucket/orders/") \
    .filter((F.col("year") == 2024) & (F.col("month") == 3))

# Verify pruning in the physical plan
result.explain()  # should show "PartitionFilters: [year=2024, month=3]"
```

---

## 6. Partition Column Selection

Good partition columns:
- **Low cardinality**: `region` (5 values), `year` (5 values), `status` (4 values)
- **Frequently filtered**: columns used in WHERE clauses
- **Evenly distributed**: avoid highly skewed columns

Bad partition columns:
- `customer_id` — too many unique values → millions of tiny files
- `amount` — numeric, not discrete, not used in filters

---

## 7. Small Files Problem

```python
# Writing too many small Parquet files hurts read performance
# Too many partitions + many small dataframes = many tiny files

# Solution: repartition before write
df.coalesce(20) \            # merge to 20 partitions before writing
  .write.parquet("output/")

# Delta Lake: OPTIMIZE command merges small files
spark.sql("OPTIMIZE silver.orders ZORDER BY (customer_id)")
```
