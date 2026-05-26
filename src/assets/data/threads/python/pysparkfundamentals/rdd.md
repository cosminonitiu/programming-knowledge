## RDDs — Resilient Distributed Datasets
---

RDDs are Spark's low-level, foundational data abstraction: an immutable, partitioned collection of records distributed across a cluster. DataFrames are built on top of RDDs.

---

## 1. What is an RDD?

- **Resilient**: Can be rebuilt from lineage on failure.
- **Distributed**: Partitioned across executor nodes.
- **Dataset**: Collection of records (any Python objects).

RDDs offer maximum flexibility but no schema awareness and no query optimisation. Use DataFrames/Datasets unless you specifically need low-level control.

---

## 2. Creating RDDs

```python
from pyspark.sql import SparkSession

spark = SparkSession.builder.appName("RDD Demo").getOrCreate()
sc = spark.sparkContext

# From Python collection
rdd = sc.parallelize([1, 2, 3, 4, 5], numSlices=4)

# From file
rdd = sc.textFile("hdfs://data/logs/*.log")
rdd = sc.textFile("s3://bucket/data/file.csv", minPartitions=8)

# From DataFrame
rdd = df.rdd    # Row objects
rdd = df.rdd.map(lambda row: (row.order_id, row.amount))
```

---

## 3. Transformations (Lazy)

```python
numbers = sc.parallelize(range(1, 11))

# map — transform each element
squares = numbers.map(lambda x: x ** 2)

# filter — keep elements matching predicate
evens = numbers.filter(lambda x: x % 2 == 0)

# flatMap — map and flatten
lines = sc.textFile("text.txt")
words = lines.flatMap(lambda line: line.split())

# mapPartitions — apply function to entire partition (more efficient than map for setup cost)
def process_partition(partition):
    db = connect_to_db()   # connect once per partition, not once per row
    for record in partition:
        yield db.lookup(record)

result = rdd.mapPartitions(process_partition)

# Pair RDD transformations
pairs = numbers.map(lambda x: (x % 3, x))  # (key, value)
grouped = pairs.groupByKey()
summed = pairs.reduceByKey(lambda a, b: a + b)
```

---

## 4. Actions (Trigger Execution)

```python
rdd = sc.parallelize([3, 1, 4, 1, 5, 9, 2, 6])

# Collect all elements to driver
all_vals = rdd.collect()        # WARNING: must fit in driver memory

# Count
print(rdd.count())              # 8
print(rdd.countByValue())       # {3: 1, 1: 2, ...}

# Aggregation
print(rdd.sum())                # 31
print(rdd.reduce(lambda a, b: a + b))   # 31
print(rdd.min(), rdd.max())

# First / take
print(rdd.first())              # 3
print(rdd.take(3))              # [3, 1, 4]
print(rdd.top(3))               # [9, 6, 5]

# Save
rdd.saveAsTextFile("output/")
rdd.saveAsSequenceFile("output_seq/")

# foreach (side effect, runs on executors)
rdd.foreach(lambda x: write_to_external_system(x))
```

---

## 5. Pair RDD Operations

```python
orders = sc.parallelize([
    ("alice", 100), ("bob", 200), ("alice", 150),
    ("carol", 300), ("bob", 50),
])

# groupByKey — groups values into iterable (shuffle-heavy)
grouped = orders.groupByKey().mapValues(list)
# [("alice", [100, 150]), ("bob", [200, 50]), ("carol", [300])]

# reduceByKey — aggregates values per key (more efficient: combines locally first)
totals = orders.reduceByKey(lambda a, b: a + b)
# [("alice", 250), ("bob", 250), ("carol", 300)]

# sortByKey
sorted_rdd = totals.sortByKey()
sorted_desc = totals.sortByKey(ascending=False)

# join (inner join of two pair RDDs)
names = sc.parallelize([("alice", "Alice Smith"), ("bob", "Bob Jones")])
joined = totals.join(names)
# [("alice", (250, "Alice Smith")), ("bob", (250, "Bob Jones"))]
```

---

## 6. Lineage and Fault Tolerance

```python
# Spark tracks the lineage (DAG of transformations)
# If a partition is lost, Spark re-computes it from its parent partitions

rdd1 = sc.textFile("data.txt")     # base RDD from HDFS
rdd2 = rdd1.filter(...)            # dependent on rdd1
rdd3 = rdd2.map(...)               # dependent on rdd2

# To avoid recomputation:
rdd2.cache()       # cache after first materialisation
rdd2.persist(StorageLevel.MEMORY_AND_DISK)
```

---

## 7. RDD vs DataFrame

| Aspect | RDD | DataFrame |
|--------|-----|-----------|
| Schema | None | Typed, schema-aware |
| Optimisation | None (you control plan) | Catalyst + Tungsten |
| API | Functional (map/filter) | SQL-like (select/filter) |
| Python overhead | High (serialisation) | Lower (JVM-native) |
| Use case | Low-level, unstructured data | Structured/semi-structured data |

**Rule:** Use DataFrames unless you need RDD's flexibility (complex custom transformations, unstructured data).
