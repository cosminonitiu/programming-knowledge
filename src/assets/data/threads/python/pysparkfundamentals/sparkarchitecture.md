## Spark Architecture
---

Apache Spark is a distributed computing engine for large-scale data processing. Understanding its architecture is fundamental to writing efficient Spark code and diagnosing performance issues.

---

## 1. High-Level Architecture

```
┌─────────────────────────────────────────────────────┐
│                   Driver Program                     │
│  ┌─────────────┐   ┌──────────────────────────────┐ │
│  │ SparkContext │   │  DAG Scheduler / Task Sched. │ │
│  └─────────────┘   └──────────────────────────────┘ │
└──────────────────────────┬──────────────────────────┘
                           │ Task assignment
                    ┌──────▼──────┐
                    │   Cluster   │
                    │   Manager   │
                    │(YARN/K8s/   │
                    │ Standalone) │
                    └──┬───┬───┬──┘
                       │   │   │
              ┌────────▼─┐ │ ┌─▼────────┐
              │ Executor │ │ │ Executor │  ...
              │ (JVM)    │ │ │ (JVM)    │
              │ Task Task│ │ │ Task Task│
              └──────────┘ │ └──────────┘
                           │
                    ┌──────▼──────┐
                    │   Executor  │
                    └─────────────┘
```

---

## 2. Key Components

| Component | Role |
|-----------|------|
| **Driver** | Hosts the SparkSession; builds the execution plan; coordinates executors |
| **Executor** | JVM process on a worker node; runs tasks; caches data |
| **Cluster Manager** | YARN, Kubernetes, Standalone, or Mesos — allocates resources |
| **Task** | Smallest unit of work; processes one partition |
| **Stage** | Group of tasks that can run without shuffling data across the network |
| **Job** | Complete computation triggered by an action |
| **DAG** | Directed Acyclic Graph of stages representing the execution plan |

---

## 3. Execution Flow

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder \
    .appName("SalesAnalysis") \
    .config("spark.executor.memory", "4g") \
    .config("spark.executor.cores", "4") \
    .getOrCreate()

# Lazy: builds a logical plan, nothing executes
df = spark.read.parquet("s3://bucket/orders/")
filtered = df.filter(df["amount"] > 100)
grouped = filtered.groupBy("region").sum("amount")

# Action: triggers compilation → optimisation → physical plan → execution
result = grouped.collect()    # sends job to cluster
```

**Lazy evaluation flow:**
1. Transformations build a logical plan (DAG of operators).
2. Action triggers Catalyst Optimizer → physical plan.
3. Physical plan broken into stages at shuffle boundaries.
4. Tasks scheduled on executors (one task per partition).
5. Results returned to driver.

---

## 4. Catalyst Optimizer

```python
# Catalyst optimises your DataFrame operations before executing
df.filter(df["status"] == "shipped").select("order_id", "amount")

# Catalyst may rewrite as: read only "order_id", "amount", "status" columns
# (predicate pushdown + column pruning) — never reads full Parquet files
```

---

## 5. Shuffle — The Most Expensive Operation

```python
# Shuffle occurs when data must move between executors
# Triggered by: groupBy, join, repartition, sort, distinct, window functions

# Check partitioning count (default is 200 — often wrong)
spark.conf.set("spark.sql.shuffle.partitions", "50")   # tune to data size

# AQE (Adaptive Query Execution) auto-tunes in Spark 3.x
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.coalescePartitions.enabled", "true")
```

---

## 6. SparkSession Configuration

```python
spark = SparkSession.builder \
    .appName("ETL Job") \
    .config("spark.executor.memory", "8g") \
    .config("spark.executor.cores", "4") \
    .config("spark.driver.memory", "4g") \
    .config("spark.sql.shuffle.partitions", "200") \
    .config("spark.sql.adaptive.enabled", "true") \
    .config("spark.serializer", "org.apache.spark.serializer.KryoSerializer") \
    .getOrCreate()

# On Databricks: SparkSession is already created as 'spark'
```

---

## 7. Partition Parallelism

Each partition maps to one task on one executor core:

```python
# Check partition count
print(df.rdd.getNumPartitions())

# Rule of thumb: 2-4 partitions per CPU core, target ~128MB per partition
# Total data: 100GB → aim for ~800 partitions (128MB each)

df = df.repartition(800)                    # hash repartition (causes shuffle)
df = df.repartition("region")              # repartition by column (co-locate same key)
df = df.coalesce(100)                      # reduce partitions without shuffle
```
