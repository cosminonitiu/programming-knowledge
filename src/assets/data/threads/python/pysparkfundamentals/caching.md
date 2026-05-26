## Caching and Persistence
---

Caching stores a DataFrame's partitions in memory (or on disk) so they don't need to be recomputed from scratch on each action. Used correctly, it dramatically speeds up iterative workloads.

---

## 1. Why Cache?

```python
# Without caching — recomputed from scratch for EVERY action
df = spark.read.parquet("s3://bucket/large-dataset/") \
               .filter(F.col("amount") > 100) \
               .join(customer_df, on="customer_id")

count = df.count()       # Reads S3, filters, joins
sample = df.take(10)     # Reads S3, filters, joins AGAIN
summary = df.agg(...)    # Reads S3, filters, joins A THIRD TIME

# With caching — computed once, stored in memory
df.cache()               # mark for caching (lazy)
count = df.count()       # triggers computation + stores in memory
sample = df.take(10)     # reads from cache
summary = df.agg(...)    # reads from cache
```

---

## 2. cache() vs persist()

```python
from pyspark import StorageLevel

# cache() — shorthand for persist(StorageLevel.MEMORY_AND_DISK)
df.cache()

# persist() — choose storage level explicitly
df.persist(StorageLevel.MEMORY_ONLY)           # RAM only; if evicted, recomputed
df.persist(StorageLevel.MEMORY_AND_DISK)       # Spills to disk when RAM full (default)
df.persist(StorageLevel.DISK_ONLY)             # Disk only (slowest, most stable)
df.persist(StorageLevel.MEMORY_ONLY_2)         # 2 replicas in RAM
df.persist(StorageLevel.MEMORY_AND_DISK_SER)   # Serialised (smaller footprint, slower access)
df.persist(StorageLevel.OFF_HEAP)              # Off-heap memory (avoids GC pressure)
```

---

## 3. StorageLevel Comparison

| Level | Recompute on Eviction | Disk Spill | Memory Use |
|-------|----------------------|-----------|------------|
| `MEMORY_ONLY` | Yes | No | Lowest |
| `MEMORY_AND_DISK` | No | Yes | Medium |
| `DISK_ONLY` | No | Always | Minimal |
| `MEMORY_ONLY_SER` | Yes | No | Lowest (slower access) |
| `MEMORY_AND_DISK_SER` | No | Yes | Lower than unserialized |

---

## 4. Releasing Cache

```python
# Always unpersist when done — free cluster memory for other operations
df.unpersist()

# Check if cached
print(df.is_cached)       # True/False

# Spark automatically evicts LRU entries under memory pressure
# but explicit unpersist is best practice
```

---

## 5. When to Cache

```python
# GOOD: Iterative computation on same base dataset
base = spark.read.parquet("large_fact_table/").join(dims, ...).filter(...)
base.cache()
base.count()  # materialise

report_a = base.groupBy("region").agg(...)
report_b = base.groupBy("product").agg(...)
base.unpersist()

# GOOD: Machine learning — the same training data is used in many iterations
training_data.cache()

# BAD: Single-use DataFrames — caching wastes memory
df = spark.read.parquet("data/")
df.cache()
result = df.count()   # only action on df — cache is unnecessary overhead
df.unpersist()
```

---

## 6. Checking What's Cached

```python
# Spark UI → Storage tab shows all cached DataFrames / RDDs
# See: name, storage level, size in memory, size on disk, fraction cached

# Via SparkContext
for rdd in spark.sparkContext._jsc.getPersistentRDDs().items():
    print(rdd)
```

---

## 7. Delta Lake Caching (Databricks)

```python
# Delta cache (Databricks Photon-enabled clusters)
# Automatically caches recently accessed Parquet/Delta files on local SSDs
spark.conf.set("spark.databricks.io.cache.enabled", "true")
spark.conf.set("spark.databricks.io.cache.maxDiskUsage", "100g")

# Manual CACHE TABLE for Spark SQL
spark.sql("CACHE TABLE silver.orders")
spark.sql("UNCACHE TABLE silver.orders")
```

---

## 8. Checkpoint vs Cache

```python
# Cache: stored in memory, lineage is preserved (can be recomputed)
# Checkpoint: written to disk, lineage is TRUNCATED (safe from long lineage)

sc = spark.sparkContext
sc.setCheckpointDir("hdfs:///user/spark/checkpoints")

df.checkpoint()   # truncates lineage — use for long iterative computations
                  # (e.g., GraphX, very deep pipelines)
```
