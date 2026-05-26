## Join Strategies in Spark
---

Joins are one of the most expensive operations in distributed computing. Spark uses several join strategies depending on data size, configuration, and hints. Choosing the right strategy can mean the difference between a 2-minute and a 20-minute job.

---

## 1. The Shuffle Join Problem

```
Left table (10GB, 400 partitions)     Right table (10GB, 400 partitions)
  ├─ Partition 0 on Executor 1           ├─ Partition 0 on Executor 3
  ├─ Partition 1 on Executor 2           ├─ Partition 1 on Executor 4
  └─ ...                                 └─ ...

For join key "customer_id":
  All rows with customer_id=42 from BOTH tables must go to the SAME partition
  → SHUFFLE: massive network transfer
```

---

## 2. Sort-Merge Join (Default for Large-Large)

```python
# Default strategy for joining two large tables
result = large_orders.join(large_customers, on="customer_id")

# What Spark does:
# 1. Hash-partition both tables on the join key
# 2. Sort each partition by the join key
# 3. Merge-join each pair of sorted partitions
# ✓ Handles large tables that don't fit in memory
# ✗ Expensive: 2 shuffles + sort
```

---

## 3. Broadcast Hash Join (Large-Small)

```python
from pyspark.sql import functions as F

# When one table is small (<= 10MB by default), broadcast it to every executor
# Zero shuffle for the large table!
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "10485760")  # 10MB

# Explicit broadcast hint
result = large_orders.join(
    F.broadcast(small_lookup),
    on="product_id",
)

# When to use: dimension tables, lookup tables, reference data
# Threshold: you can increase for tables up to ~200-300MB
spark.conf.set("spark.sql.autoBroadcastJoinThreshold", "104857600")  # 100MB
```

---

## 4. Skew Handling

Data skew occurs when some join keys appear far more often than others, causing a few partitions to be massively larger (the "hot partition" problem):

```python
# Detect skew
orders.groupBy("customer_id").count().orderBy(F.desc("count")).show(10)

# Fix 1: AQE skew join (Spark 3.x — automatic!)
spark.conf.set("spark.sql.adaptive.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.enabled", "true")
spark.conf.set("spark.sql.adaptive.skewJoin.skewedPartitionFactor", "5")

# Fix 2: Salting — artificially distribute skewed keys
import random

# Add salt to skewed side
N_BUCKETS = 10
large_df = large_df.withColumn("salt", (F.rand() * N_BUCKETS).cast("int"))
large_df = large_df.withColumn("salted_key", F.concat_ws("_", "customer_id", "salt"))

# Explode lookup side to match each salt
from pyspark.sql.functions import array, explode

small_df_exploded = small_df \
    .withColumn("salt", array([F.lit(i) for i in range(N_BUCKETS)])) \
    .withColumn("salt", explode("salt")) \
    .withColumn("salted_key", F.concat_ws("_", "customer_id", "salt"))

result = large_df.join(small_df_exploded, on="salted_key")
```

---

## 5. Join Types

```python
orders = spark.read.parquet("orders/")
customers = spark.read.parquet("customers/")

# Inner join (default)
orders.join(customers, on="customer_id")

# Left outer join — all orders, matched customers or null
orders.join(customers, on="customer_id", how="left")

# Right outer join
orders.join(customers, on="customer_id", how="right")

# Full outer join
orders.join(customers, on="customer_id", how="outer")

# Left anti-join — orders without a matching customer
orders.join(customers, on="customer_id", how="left_anti")

# Left semi-join — orders that HAVE a matching customer (no customer columns added)
orders.join(customers, on="customer_id", how="left_semi")

# Cross join (Cartesian product — use with extreme caution)
spark.conf.set("spark.sql.crossJoin.enabled", "true")
a.crossJoin(b)
```

---

## 6. Optimisation Tips

```python
# Tip 1: Filter BEFORE joining — reduce data volume
recent = orders.filter(F.col("order_date") >= "2024-01-01")
result = recent.join(customers, on="customer_id")

# Tip 2: Select only needed columns before joining
slim_customers = customers.select("customer_id", "name", "region")
result = orders.join(slim_customers, on="customer_id")

# Tip 3: Repartition on join key before multiple joins on same key
orders = orders.repartition(200, "customer_id")
orders.cache()
result1 = orders.join(dim1, on="customer_id")
result2 = orders.join(dim2, on="customer_id")

# Tip 4: Use explain() to verify join strategy
result.explain(mode="formatted")
# Look for: BroadcastHashJoin, SortMergeJoin, ShuffledHashJoin
```
