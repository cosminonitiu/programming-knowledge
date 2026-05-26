## Streaming Concepts
---

Spark Structured Streaming is a scalable, fault-tolerant stream processing engine built on the Spark SQL engine. It models a stream as an unbounded table that continuously grows.

---

## 1. The Unbounded Table Model

```
Batch:                           Streaming:
┌────────────────────┐          ┌────────────────────────────────────────►
│  Static Table      │          │  Unbounded Table (grows continuously)   time
│  (fixed rows)      │          │  Row 0, Row 1, Row 2, Row 3, Row 4 ...
└────────────────────┘          └─────────────────────────────────────────
         ↓                                       ↓
    One result                          Continuously updated result
```

Structured Streaming lets you write the same DataFrame/SQL queries and apply them to live data.

---

## 2. Micro-Batch vs Continuous Processing

| Mode | Latency | Throughput | Status |
|------|---------|-----------|--------|
| **Micro-batch** | ~100ms–seconds | High | Production-ready |
| **Continuous** | ~1ms | Lower | Experimental (Spark 3.x) |

**Micro-batch** (default): Spark processes data in small batches triggered at intervals. Each trigger reads new records, processes them, and writes output — exactly like a batch job, but run repeatedly.

---

## 3. Trigger Types

```python
from pyspark.sql.streaming import DataStreamWriter

# Default — run as fast as possible (one micro-batch at a time)
query = df.writeStream.trigger(processingTime="0 seconds")

# Fixed interval — trigger every N seconds
query = df.writeStream.trigger(processingTime="10 seconds")

# Once — process all available data, then stop (batch-style)
query = df.writeStream.trigger(once=True)

# AvailableNow — process all available, then stop (Spark 3.3+, idempotent)
query = df.writeStream.trigger(availableNow=True)

# Continuous (experimental) — ~1ms latency
query = df.writeStream.trigger(continuous="1 second")
```

---

## 4. Sources and Sinks

| Source | Description |
|--------|-------------|
| Kafka | Most common; scalable event stream |
| Delta Lake | Streaming from Delta table changes |
| Files (Parquet, JSON, CSV) | New files dropped in a directory |
| Rate | Generates rows at a fixed rate (testing) |
| Socket | TCP socket (testing only) |

| Sink | Description |
|------|-------------|
| Kafka | Produce to Kafka topic |
| Delta Lake | Write to Delta table (best for analytics) |
| Files | Append to partitioned directory |
| Memory | In-memory table (testing) |
| Console | Print to stdout (development only) |
| foreachBatch | Custom sink via function |

---

## 5. Starting a Streaming Query

```python
# Read from a streaming source
stream_df = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribe", "orders") \
    .load()

# Apply transformations (same API as batch DataFrames)
parsed = stream_df.select(
    F.from_json(F.col("value").cast("string"), order_schema).alias("data")
).select("data.*")

# Write to sink
query = parsed.writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "abfss://container@storage.dfs.core.windows.net/checkpoints/orders") \
    .trigger(processingTime="10 seconds") \
    .start("abfss://container@storage.dfs.core.windows.net/silver/orders")

# Block until the query terminates (or wait for Ctrl+C)
query.awaitTermination()
```

---

## 6. Managing Running Queries

```python
# List all active queries
spark.streams.active

# Access a specific query
query.id           # UUID of the query
query.name         # name if set
query.status       # current status dict
query.lastProgress # dict of metrics for last micro-batch

# Stop a query
query.stop()

# Wait for termination (with optional timeout in ms)
query.awaitTermination(timeout=60_000)

# Exception handling
try:
    query.awaitTermination()
except Exception as e:
    print(f"Query failed: {e}")
    query.stop()
```

---

## 7. Streaming vs Batch — When to Use

| Use Case | Batch | Streaming |
|----------|-------|-----------|
| Daily/hourly reports | ✅ | Overkill |
| Real-time dashboards | ✗ | ✅ |
| Fraud detection (immediate) | ✗ | ✅ |
| End-of-day reconciliation | ✅ | ✗ |
| Event-driven notifications | ✗ | ✅ |
| Large historical ETL | ✅ | ✗ |
