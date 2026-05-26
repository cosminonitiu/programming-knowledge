## Spark Performance Tuning
---

Performance tuning in Spark is a systematic process: profile first, then target the bottleneck. Most gains come from partitioning strategy, join optimisation, and correct resource sizing.

---

## 1. Tuning Checklist

```
1. Enable AQE (Adaptive Query Execution)
2. Right-size shuffle partitions
3. Broadcast small tables in joins
4. Avoid data skew (detect and salt)
5. Cache reused DataFrames
6. Minimise shuffles with repartition before groupBy
7. Size executors correctly (cores × memory)
8. Use Parquet/Delta with partition pruning
9. Avoid UDFs; prefer native SQL functions
10. Profile with Spark UI / explain()
```

---

## 2. Adaptive Query Execution (AQE)

AQE is the most impactful single setting in Spark 3.x:

```python
# Enable AQE (default in Spark 3.2+)
spark.conf.set("spark.sql.adaptive.enabled", "true")

# Auto-coalesce small shuffle partitions (200 → 15 if data is small)
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
spark.conf.set("spark.sql.adaptive.advisoryPartitionSizeInBytes", "128MB")

# Auto-detect and handle skewed partitions in joins
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionThresholdInBytes", "256MB")

# Switch join strategy at runtime (e.g., sort-merge → broadcast)
spark.conf.set("spark.sql.adaptive.localShuffleReader.enabled", "true")
```

---

## 3. Right-Sizing Shuffle Partitions

```python
# Default 200 is wrong for most workloads
# Too many: overhead of managing empty/tiny partitions
# Too few: large partitions cause OOM

# Manual formula: total shuffle data / target partition size (128MB)
# e.g., 50GB after shuffle → 400 partitions
spark.conf.set("spark.sql.shuffle.partitions", "400")

# With AQE enabled: set a high max, let AQE coalesce down
spark.conf.set("spark.sql.shuffle.partitions", "1000")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
```

---

## 4. Executor Sizing

```python
# Rule: 5 cores per executor, memory = 5 × (partition size × 4 for intermediate data)
# Typical: 5 cores, 20GB RAM

spark = SparkSession.builder \
    .config("spark.executor.cores", "5") \
    .config("spark.executor.memory", "20g") \
    .config("spark.executor.memoryOverhead", "4g") \    # off-heap overhead
    .config("spark.driver.memory", "8g") \
    .getOrCreate()

# Memory fractions
spark.conf.set("spark.memory.fraction", "0.75")         # fraction for execution + storage
spark.conf.set("spark.memory.storageFraction", "0.5")   # within above, fraction for storage
```

---

## 5. Avoiding User-Defined Functions (UDFs)

```python
# SLOW: Python UDF (serialises every row between Python and JVM)
from pyspark.sql.functions import udf
from pyspark.sql.types import StringType

@udf(returnType=StringType())
def categorise(amount: float) -> str:
    return "high" if amount > 1000 else "low"

df = df.withColumn("cat", categorise("amount"))

# FAST: native SQL expressions (stay in JVM, Catalyst-optimised)
from pyspark.sql import functions as F
df = df.withColumn("cat", F.when(F.col("amount") > 1000, "high").otherwise("low"))

# If UDF is unavoidable: use Pandas UDF (vectorised, much faster)
from pyspark.sql.functions import pandas_udf
import pandas as pd

@pandas_udf("string")
def fast_categorise(series: pd.Series) -> pd.Series:
    return series.apply(lambda x: "high" if x > 1000 else "low")

df = df.withColumn("cat", fast_categorise("amount"))
```

---

## 6. Reading Data Efficiently

```python
# Use partition pruning — only read needed partitions
df = spark.read.parquet("orders/") \
    .filter(F.col("year") == 2024) \   # partition pruning
    .filter(F.col("month") == 3)

# Select only needed columns (Parquet column pruning)
df = spark.read.parquet("orders/").select("order_id", "amount", "status")

# Use predicate pushdown for data sources that support it
# Parquet, ORC, Delta — filter pushed into file scan
df.explain()  # look for "PushedFilters" in scan node
```

---

## 7. Profiling with Spark UI

```
Spark UI → http://localhost:4040

Key tabs:
- Jobs: see all jobs, duration, failures
- Stages: identify slow stages (shuffle write/read size, task skew)
- SQL: visualise query plan, see bottlenecks
- Storage: see cached DataFrames and their sizes
- Executors: memory usage, GC time, task counts

Key metrics to watch:
- Shuffle Read/Write Size — large = expensive
- Task Duration Distribution — skew = some tasks 10× slower than median
- GC Time > 20% of task time — tune executor memory
- Spill (Memory/Disk) — increase executor memory or reduce partition size
```

---

## 8. explain() Output Guide

```python
df.explain(mode="formatted")
# Modes: "simple", "extended", "codegen", "cost", "formatted"

# Key operators in physical plan:
# FileScan parquet — data source; look for PartitionFilters, PushedFilters
# BroadcastHashJoin — small table broadcast (good)
# SortMergeJoin — large-large join (expensive if not needed)
# HashAggregate → Exchange → HashAggregate — GroupBy with shuffle (Exchange)
# Exchange — shuffle operation (find and minimise these)
```
