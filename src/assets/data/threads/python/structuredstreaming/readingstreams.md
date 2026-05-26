## Reading Streams
---

Structured Streaming reads from sources using `spark.readStream`, which returns a streaming DataFrame. The API is identical to batch reads but with streaming semantics.

---

## 1. Reading from Kafka

```python
from pyspark.sql import SparkSession, functions as F
from pyspark.sql.types import StructType, StructField, StringType, IntegerType, DoubleType

spark = SparkSession.builder.getOrCreate()

# Basic Kafka read
raw_stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker1:9092,broker2:9092") \
    .option("subscribe", "orders") \           # single topic
    .option("startingOffsets", "latest") \     # latest (default) or earliest
    .option("maxOffsetsPerTrigger", "10000") \ # cap records per micro-batch
    .load()

# raw_stream schema: topic, partition, offset, timestamp, key (bytes), value (bytes)
```

---

## 2. Parsing JSON from Kafka

```python
order_schema = StructType([
    StructField("order_id", IntegerType()),
    StructField("customer_id", IntegerType()),
    StructField("amount", DoubleType()),
    StructField("status", StringType()),
    StructField("event_time", StringType()),
])

orders = raw_stream \
    .select(
        F.col("timestamp").alias("kafka_timestamp"),
        F.from_json(F.col("value").cast("string"), order_schema).alias("data"),
    ) \
    .select("kafka_timestamp", "data.*") \
    .withColumn("event_time", F.to_timestamp("event_time", "yyyy-MM-dd HH:mm:ss"))
```

---

## 3. Reading from Delta Lake (Change Data Feed)

```python
# Read incremental changes from a Delta table as a stream
delta_stream = spark.readStream \
    .format("delta") \
    .option("readChangeFeed", "true") \
    .option("startingVersion", 0) \
    .table("bronze.raw_orders")

# Or from a path
delta_stream = spark.readStream \
    .format("delta") \
    .load("abfss://container@storage.dfs.core.windows.net/bronze/orders")
```

---

## 4. Reading from a File Directory

```python
# Structured Streaming monitors a directory for NEW files
# (files must not be modified after being written)
file_stream = spark.readStream \
    .format("parquet") \
    .schema(order_schema) \
    .option("maxFilesPerTrigger", "100") \   # process up to 100 new files per trigger
    .load("s3://bucket/incoming-orders/")

# JSON files
json_stream = spark.readStream \
    .format("json") \
    .schema(event_schema) \
    .option("multiLine", False) \    # one JSON object per line
    .load("s3://bucket/events/")
```

---

## 5. Multiple Topics / Topic Pattern

```python
# Multiple topics
stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribe", "orders,payments,returns") \
    .load()

# Topic pattern (regex)
stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribePattern", "events-.*") \   # all topics starting with "events-"
    .load()
```

---

## 6. Handling Kafka Offsets

```python
# Control where streaming starts:
.option("startingOffsets", "earliest")   # read all existing messages
.option("startingOffsets", "latest")     # only new messages going forward

# Specific offset (JSON per topic/partition)
.option("startingOffsets", """{
    "orders": {"0": 1000, "1": 500}
}""")

# After a checkpoint exists: Spark resumes from stored offsets automatically
# startingOffsets is only used the first time (no checkpoint yet)
```

---

## 7. Schema Tips

```python
# Always define schema explicitly — inferSchema not supported for streams
# Use DDL string as alternative to StructType
orders_ddl = "order_id INT, customer_id INT, amount DOUBLE, status STRING"
stream = spark.readStream.format("json").schema(orders_ddl).load("path/")

# Handling schema evolution: set mergeSchema option for Parquet/Delta
stream = spark.readStream \
    .format("delta") \
    .option("mergeSchema", "true") \
    .load("path/to/delta")
```
