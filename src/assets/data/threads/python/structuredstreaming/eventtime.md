## Event Time and Watermarks
---

Event time is the time embedded in the data itself (when the event actually occurred), as opposed to processing time (when Spark processes it). Watermarks define how late data can arrive before being dropped.

---

## 1. Event Time vs Processing Time

```
Event time:      when the event actually happened (in the data)
Processing time: when Spark processed the event

Real-world scenario:
  Order placed at 14:00:05 (event time)
  → Network delay: 30 seconds
  → Kafka consumed at 14:00:35
  → Spark processed at 14:00:40 (processing time)

For correct time-based analytics, ALWAYS use event time.
Processing time is non-deterministic (varies with load, retries).
```

---

## 2. Setting Up Event Time

```python
from pyspark.sql import functions as F

# Parse event timestamp from Kafka/JSON payload
orders = raw_stream.select(
    F.from_json(F.col("value").cast("string"), schema).alias("data")
).select("data.*") \
 .withColumn("event_time", F.to_timestamp("event_time", "yyyy-MM-dd HH:mm:ss"))

# Now event_time is a TimestampType column — use it in window operations
```

---

## 3. Watermarks

Without a watermark, Spark must keep state for all time windows indefinitely (to handle arbitrarily late data). A watermark bounds how late data can arrive:

```python
# "event_time" watermark of 10 minutes:
# Spark will wait 10 minutes past the max event time seen
# before finalising any window ending before (max_event_time - 10 minutes)

orders_with_wm = orders \
    .withWatermark("event_time", "10 minutes")
```

```
Events arrive:
  [14:00, 100$]  max_event_time = 14:00   watermark = 13:50
  [14:05, 200$]  max_event_time = 14:05   watermark = 13:55
  [13:58, 50$]   ← late by 7 min → accepted (after watermark 13:55)
  [13:49, 30$]   ← late by 16 min → DROPPED (before watermark 13:55)
```

---

## 4. Windowed Aggregations with Watermark

```python
# Tumbling window: 5-minute non-overlapping revenue buckets
revenue_by_window = orders \
    .withWatermark("event_time", "10 minutes") \
    .groupBy(
        F.window("event_time", "5 minutes"),
        F.col("region")
    ) \
    .agg(F.sum("amount").alias("revenue"))

# In Append mode: results only emitted after the window is finalised
# (i.e., when watermark advances past window end)
query = revenue_by_window.writeStream \
    .outputMode("append") \   # or "update"
    .format("delta") \
    .option("checkpointLocation", "/checkpoints/revenue") \
    .start("/delta/revenue-windows")
```

---

## 5. How Watermarks Affect Output Modes

```
Append mode + watermark:
  Results are emitted ONCE the window is considered final
  (no more late data expected based on watermark)
  → Low-frequency output, but guaranteed complete

Update mode + watermark:
  Intermediate results emitted every trigger
  Final state emitted, then state cleaned up
  → More frequent output, results may change

Complete mode:
  No watermark-based cleanup — state grows indefinitely
  (only appropriate for small result sets)
```

---

## 6. Monitoring Watermark Progress

```python
query = ...writeStream.start()

# Check current watermark
progress = query.lastProgress
if progress:
    event_time_stats = progress.get("eventTime", {})
    print(f"Watermark: {event_time_stats.get('watermark')}")
    print(f"Max event time: {event_time_stats.get('max')}")
    print(f"Min event time: {event_time_stats.get('min')}")
```

---

## 7. Late Data Handling Strategy

```python
# Short watermark: faster state cleanup, more late data dropped
.withWatermark("event_time", "5 minutes")

# Long watermark: handles more late data, but state uses more memory
.withWatermark("event_time", "2 hours")

# No watermark: state never cleaned up (only for Complete mode / no aggregation)

# Trade-off:
# Watermark too short → accurate but drops legitimate late data
# Watermark too long  → complete but uses more memory and delays results

# Typical values:
# High-reliability source (Delta, files): 30 seconds to 5 minutes
# Kafka with mobile devices:              5 to 30 minutes
# IoT sensors with poor connectivity:    1 to 24 hours
```
