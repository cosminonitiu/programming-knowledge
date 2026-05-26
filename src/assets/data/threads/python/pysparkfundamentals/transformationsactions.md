## Transformations and Actions
---

Understanding the distinction between transformations and actions is the key to understanding Spark's execution model and writing efficient jobs.

---

## 1. The Core Distinction

```
Transformations:
  - Lazy — define a computation, don't execute it
  - Return a new DataFrame/RDD
  - Build the DAG of operations
  - Examples: filter, select, join, groupBy, withColumn

Actions:
  - Eager — trigger actual execution
  - Return a result (to driver) or write to storage
  - Examples: count, collect, show, write, save
```

---

## 2. Narrow vs Wide Transformations

**Narrow transformations** — each output partition depends on at most one input partition. No data moves between executors:

```python
df.filter(F.col("amount") > 100)          # narrow — each partition filters independently
df.withColumn("total", col("qty") * col("price"))  # narrow
df.select("order_id", "amount")           # narrow
df.map(...)                               # narrow
```

**Wide transformations** — output partitions depend on multiple input partitions. Requires a **shuffle** (expensive network transfer):

```python
df.groupBy("region").sum("amount")        # wide — shuffle by region key
df.join(other_df, "customer_id")          # wide — shuffle both sides on key
df.sort("amount")                         # wide — global sort requires shuffle
df.distinct()                             # wide — requires comparing across partitions
df.repartition(200)                       # wide — redistributes all data
```

---

## 3. Stage Boundaries

```
Plan:  filter → select → join → groupBy → select
                         ↑                ↑
               shuffle boundary   shuffle boundary
                  (Stage 1 | Stage 2 | Stage 3)

Narrow transformations in a stage run as a single pass — "pipelined" together.
```

---

## 4. Common Transformations

```python
from pyspark.sql import functions as F

# ─── Narrow ────────────────────────────────────────────
df.filter(F.col("status") == "active")
df.select("id", "name")
df.withColumn("new_col", F.col("a") + F.col("b"))
df.withColumnRenamed("old", "new")
df.drop("col_to_remove")
df.limit(1000)
df.sample(fraction=0.1, seed=42)
df.union(other_df)                   # stack rows (same schema required)
df.unionByName(other_df)             # match by column name

# ─── Wide (shuffle) ────────────────────────────────────
df.groupBy("key").agg(F.sum("value"))
df.sort(F.desc("amount"))
df.orderBy("date")
df.dropDuplicates(["order_id"])
df.repartition(50)
df.repartition(50, "region")         # repartition by column (hash)
df.coalesce(10)                      # reduce partitions, no full shuffle

# Joins (wide)
df.join(other, on="id")               # inner join
df.join(other, on="id", how="left")
df.join(other, on="id", how="outer")
```

---

## 5. Common Actions

```python
# ─── Return to Driver ──────────────────────────────────
df.count()                    # number of rows
df.collect()                  # all rows as list of Row objects — danger on large data!
df.take(10)                   # first 10 rows as list
df.first()                    # first row
df.head(5)                    # first 5 rows
df.toPandas()                 # convert to pandas DataFrame — must fit in driver memory

# ─── Print/Inspect ─────────────────────────────────────
df.show(20, truncate=False)
df.printSchema()
df.explain(mode="formatted")  # print physical plan

# ─── Write to Storage ──────────────────────────────────
df.write.parquet("output/")
df.write.format("delta").save("output/")
df.write.saveAsTable("my_schema.my_table")

# ─── Foreach (side effects) ────────────────────────────
df.foreach(send_to_external_system)
df.foreachPartition(bulk_insert_to_db)
```

---

## 6. The Catalyst Optimiser

Spark optimises the logical plan before execution:

```python
# You write this:
df.filter(F.col("status") == "shipped") \
  .select("order_id", "amount") \
  .filter(F.col("amount") > 100)

# Catalyst rewrites it as:
# - Merge both filters (predicate pushdown)
# - Prune columns early (only read needed Parquet columns from disk)
# - Result: much less I/O

# Inspect the plan
df.explain(mode="formatted")  # shows: Parsed → Analyzed → Optimized → Physical
```

---

## 7. Common Performance Mistakes

```python
# SLOW: collect everything then process in Python
for row in df.collect():         # loads entire dataset into driver RAM
    process(row)

# FAST: use foreach/foreachPartition (processes on executors)
df.foreachPartition(lambda rows: [process(row) for row in rows])

# SLOW: groupByKey (shuffles all data to groups before reducing)
rdd.groupByKey().mapValues(sum)

# FAST: reduceByKey (reduces locally on each partition first)
rdd.reduceByKey(lambda a, b: a + b)
```
