## Checkpointing in Structured Streaming
---

Checkpointing is the mechanism that makes Structured Streaming fault-tolerant. It persists the streaming query's progress and state to durable storage so the query can resume exactly where it left off after a failure.

---

## 1. What Checkpointing Stores

```
Checkpoint directory structure:
  checkpoints/my-query/
    ├── commits/           ← completed micro-batch IDs
    ├── offsets/           ← source offsets (e.g., Kafka partition offsets)
    ├── metadata           ← query ID and configuration
    └── state/             ← operator state (stateful aggregations, deduplication)
        └── 0/
            └── 0/         ← state store data per partition
```

---

## 2. Setting Checkpoint Location

```python
# Always set a checkpoint location for production queries
query = stream_df.writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "abfss://container@storage.dfs.core.windows.net/checkpoints/orders-etl") \
    .trigger(processingTime="30 seconds") \
    .start("abfss://container@storage.dfs.core.windows.net/silver/orders")
```

**Rules:**
- Each query needs its own unique checkpoint directory.
- The directory must be on durable storage (ADLS Gen2, S3, HDFS — not local disk).
- Do NOT share checkpoint directories between different queries.

---

## 3. How Recovery Works

```
Normal run:
  Micro-batch N → read offsets → process → write output → commit offsets
                                                              ↓
                                                    (checkpoint updated)

Failure during micro-batch N:
  Process crashes before commit
  ↓
  Restart → read last committed offset from checkpoint
  ↓
  Re-process micro-batch N from source (at-least-once)
  ↓
  Write output again → commit offset

Result: at-least-once delivery
For exactly-once: sink must be idempotent (Delta Lake handles this)
```

---

## 4. Write-Ahead Log (WAL)

The WAL records source offsets before each micro-batch begins:

```
WAL step-by-step per micro-batch:
1. Write source offsets to offsets/ directory (WAL)
2. Read data from source (Kafka, files, etc.)
3. Process transformation
4. Write to sink
5. Write batch ID to commits/ directory

If failure between step 1 and 5 → replay from WAL offset on restart
If failure after step 5 → committed; do not reprocess
```

---

## 5. Checkpoint and Schema Changes

Changing query schema (adding columns, changing transformations) may require clearing the checkpoint:

```python
# After a breaking change: clear checkpoint and restart
# WARNING: you'll re-process from startingOffsets (or lose old state)

# Non-breaking changes: adding output columns usually works
# Breaking changes: aggregation schema change, adding stateful ops → must clear checkpoint

# Databricks DLT handles this automatically with pipeline schema evolution
```

---

## 6. Managing Checkpoint Size

```python
# State grows over time — set watermark to bound old state cleanup
orders_with_wm = orders_stream \
    .withWatermark("event_time", "2 hours") \   # discard state for events > 2h old
    .groupBy(
        F.window("event_time", "1 hour"),
        "region"
    ) \
    .agg(F.sum("amount"))

# Async checkpoint (reduce latency impact of checkpointing)
spark.conf.set("spark.sql.streaming.checkpointFileManagerClass",
    "org.apache.spark.sql.execution.streaming.CheckpointFileManager")
spark.conf.set(
    "spark.sql.streaming.minBatchesToRetain", "2"   # keep last 2 batches in offsets/commits
)
```

---

## 7. Monitoring Checkpoint Progress

```python
query = stream.writeStream \
    .option("checkpointLocation", "/checkpoints/my-query") \
    .start()

# Monitor progress
import time
while query.isActive:
    progress = query.lastProgress
    if progress:
        print(f"Batch {progress['batchId']}: {progress['numInputRows']} rows")
        print(f"Input rate: {progress['inputRowsPerSecond']:.2f} rows/sec")
        print(f"Processing rate: {progress['processedRowsPerSecond']:.2f} rows/sec")
    time.sleep(10)
```
