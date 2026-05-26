## Change Data Capture (CDC)
---

Change Data Capture is the pattern of tracking row-level changes (INSERT, UPDATE, DELETE) in source systems and propagating them to target systems. It's fundamental for keeping a data lake in sync with operational databases.

---

## 1. Why CDC?

```
Without CDC (full load):
  Extract entire table every run
  → Slow (scan everything), expensive, large data transfer

With CDC:
  Extract only changed rows since last run
  → Fast incremental loads, near-real-time sync
  → Supports DELETE propagation (full load can't delete)
```

---

## 2. CDC Sources

| Source | CDC Mechanism |
|--------|--------------|
| Kafka | Event streams with operation type in payload |
| Debezium | Reads database transaction logs (MySQL binlog, Postgres WAL, SQL Server CDC) |
| SQL Server CDC | Native CDC tables built into SQL Server |
| Delta Lake | `readChangeFeed` on Delta tables |
| DLT / APPLY CHANGES INTO | Databricks-native CDC pipeline |

---

## 3. CDC Event Structure

```json
{
  "op": "u",            // c=create, u=update, d=delete, r=read/snapshot
  "ts_ms": 1710000000000,
  "before": {
    "order_id": 123,
    "status": "pending"
  },
  "after": {
    "order_id": 123,
    "status": "shipped"
  },
  "source": {
    "table": "orders",
    "lsn": "00000028:00000090:0001"
  }
}
```

---

## 4. APPLY CHANGES INTO (DLT)

Databricks' declarative CDC ingestion — handles ordering, late-arriving events, and hard deletes automatically:

```python
import dlt
from pyspark.sql import functions as F

# Step 1: Define the source (CDC events from Kafka/files)
@dlt.view(name="orders_cdc_feed")
def orders_cdc_feed():
    return (
        spark.readStream
        .format("kafka")
        .option("kafka.bootstrap.servers", "broker:9092")
        .option("subscribe", "orders-cdc")
        .load()
        .select(F.from_json("value", cdc_schema).alias("d"))
        .select("d.*")
    )

# Step 2: Apply CDC changes to a Silver table
dlt.create_streaming_table("orders_silver")

dlt.apply_changes(
    target="orders_silver",
    source="orders_cdc_feed",
    keys=["order_id"],              # primary key to match rows
    sequence_by="timestamp",        # order events by this column (handles late arrival)
    apply_as_deletes=F.expr("op = 'd'"),   # delete when op = 'd'
    apply_as_truncates=None,        # optional: truncate condition
    stored_as_scd_type=1,           # SCD Type 1: overwrite (default)
    # stored_as_scd_type=2          # SCD Type 2: keep history
    ignore_null_updates=True,       # don't overwrite with NULL updates
)
```

---

## 5. SCD Types

| Type | Behaviour | Use Case |
|------|-----------|----------|
| **SCD Type 1** | Overwrite old value — no history | Current state only (status, address) |
| **SCD Type 2** | Keep old rows; add new row with version | Full history (price changes, status changes) |
| **SCD Type 3** | Keep one previous value as extra column | Limited history (current + previous) |

```sql
-- SCD Type 2 with APPLY CHANGES INTO:
dlt.apply_changes(
    target="customer_history",
    source="customer_cdc",
    keys=["customer_id"],
    sequence_by="updated_at",
    stored_as_scd_type=2,
    track_history_column_list=["email", "address", "tier"],  # columns to version
)

-- Result: each change creates a new row with:
-- __START_AT (when this version became active)
-- __END_AT   (NULL for current; set when a newer version arrives)
```

---

## 6. Manual CDC with Delta MERGE

```python
from delta.tables import DeltaTable

def apply_cdc_batch(cdc_df, batch_id):
    # Separate operations
    deletes = cdc_df.filter("op = 'd'").select("order_id")
    upserts = cdc_df.filter("op != 'd'").select("order_id", "status", "amount", "updated_at")

    target = DeltaTable.forName(spark, "silver.orders")

    # Handle deletes
    target.alias("t").merge(
        deletes.alias("s"), "t.order_id = s.order_id"
    ).whenMatchedDelete().execute()

    # Handle upserts
    target.alias("t").merge(
        upserts.alias("s"), "t.order_id = s.order_id"
    ).whenMatchedUpdateAll() \
     .whenNotMatchedInsertAll() \
     .execute()

cdc_stream.writeStream \
    .foreachBatch(apply_cdc_batch) \
    .option("checkpointLocation", "/checkpoints/cdc/orders") \
    .start()
```

---

## 7. CDC from Kafka with Debezium

```python
# Debezium connectors capture database changes to Kafka topics
# Each database row change → Kafka message

cdc_stream = spark.readStream \
    .format("kafka") \
    .option("kafka.bootstrap.servers", "broker:9092") \
    .option("subscribe", "db.public.orders") \   # Debezium topic: db.schema.table
    .load()

debezium_schema = StructType([
    StructField("op", StringType()),
    StructField("before", order_schema),
    StructField("after", order_schema),
    StructField("ts_ms", LongType()),
])

parsed = cdc_stream \
    .select(F.from_json("value", debezium_schema).alias("d")) \
    .select("d.*") \
    .withColumn("event_row", F.when(F.col("op") == "d", F.col("before")).otherwise(F.col("after"))) \
    .select("op", F.col("event_row.*"), F.col("ts_ms"))
```
