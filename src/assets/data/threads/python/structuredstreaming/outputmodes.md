## Output Modes
---

Output mode determines what rows are written to the sink on each micro-batch trigger. Choosing the wrong mode causes errors or incorrect results.

---

## 1. The Three Output Modes

| Mode | Description | Requirements |
|------|-------------|-------------|
| **Append** | Only new rows added since last trigger | Default; no aggregations, or aggregations with watermark |
| **Update** | Rows that were added or changed since last trigger | Aggregations; not supported by all sinks |
| **Complete** | The entire result table on every trigger | Aggregations only; sink must handle full rewrites |

---

## 2. Append Mode

```python
# Append mode — default
# New rows are written once and never modified
# Works with: filters, projections, maps, joins (with watermark), flat maps

query = orders_stream \
    .filter(F.col("amount") > 100) \
    .writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "/checkpoints/filtered-orders") \
    .start("/delta/filtered-orders")
```

**When to use:** Ingesting events into a data lake. Rows represent immutable facts. No aggregations (or windowed aggregations with watermark).

---

## 3. Complete Mode

```python
# Complete mode — rewrites ENTIRE result on every trigger
# Use only for aggregations where you want ALL current totals

agg_stream = orders_stream \
    .groupBy("region") \
    .agg(F.sum("amount").alias("total_revenue"))

query = agg_stream.writeStream \
    .format("memory") \
    .queryName("region_totals") \
    .outputMode("complete") \
    .start()

# View in SQL
spark.sql("SELECT * FROM region_totals").show()
```

**When to use:** Running totals (no watermark needed), small result sets, in-memory sinks, debug/testing.
**Avoid with:** Large result tables (rewrites everything each trigger), Delta Lake at scale.

---

## 4. Update Mode

```python
# Update mode — only rows that CHANGED in this micro-batch
# More efficient than Complete for aggregations

agg_stream = orders_stream \
    .groupBy("region") \
    .agg(F.sum("amount").alias("total_revenue"))

query = agg_stream.writeStream \
    .format("delta") \
    .outputMode("update") \
    .option("checkpointLocation", "/checkpoints/region-totals") \
    .start("/delta/region-totals")
```

**Note:** Update mode with Delta Lake works, but the sink must handle upserts. Use `foreachBatch` with Delta's MERGE for reliable upserts:

```python
def upsert_to_delta(batch_df, batch_id):
    from delta.tables import DeltaTable

    target = DeltaTable.forPath(spark, "/delta/region-totals")
    target.alias("t").merge(
        batch_df.alias("s"),
        "t.region = s.region"
    ).whenMatchedUpdateAll() \
     .whenNotMatchedInsertAll() \
     .execute()

query = agg_stream.writeStream \
    .foreachBatch(upsert_to_delta) \
    .outputMode("update") \
    .option("checkpointLocation", "/checkpoints/region-totals") \
    .start()
```

---

## 5. Mode Compatibility Matrix

| Operation | Append | Update | Complete |
|-----------|--------|--------|----------|
| No aggregation | ✅ | ✅ | ❌ |
| Aggregation without watermark | ❌ | ✅ | ✅ |
| Aggregation with watermark | ✅ | ✅ | ✅ |
| mapGroupsWithState | ❌ | ✅ | ❌ |
| flatMapGroupsWithState (Append) | ✅ | ❌ | ❌ |
| flatMapGroupsWithState (Update) | ❌ | ✅ | ❌ |

---

## 6. Sink Compatibility

| Sink | Append | Update | Complete |
|------|--------|--------|----------|
| Delta Lake | ✅ | ✅ (via foreachBatch) | ✅ (via foreachBatch) |
| Kafka | ✅ | ✅ | ✅ |
| Files (Parquet, JSON…) | ✅ | ❌ | ❌ |
| Console | ✅ | ✅ | ✅ |
| Memory | ✅ | ✅ | ✅ |
| foreachBatch | ✅ | ✅ | ✅ |
