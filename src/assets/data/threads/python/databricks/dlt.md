## Delta Live Tables (DLT)
---

Delta Live Tables is a declarative framework for building reliable, maintainable ETL pipelines in Databricks. You declare the desired result; DLT manages orchestration, quality enforcement, and monitoring automatically.

---

## 1. Why DLT?

```
Traditional ETL:
  You manage: orchestration, error handling, reprocessing,
              schema enforcement, data quality, monitoring, retries

DLT:
  You declare: what the data should look like
  DLT manages: orchestration, lineage, quality, monitoring, scaling
```

---

## 2. DLT Table Types

| Type | Description | Trigger |
|------|-------------|---------|
| `@dlt.table` | Materialised Delta table — always persisted | Pipeline trigger |
| `@dlt.view` | Temporary virtual table — not materialised | In-pipeline only |
| Streaming table | Incremental / stream ingestion | Continuous or triggered |

---

## 3. Declaring Tables

```python
import dlt
from pyspark.sql import functions as F
from pyspark.sql.types import StructType, StructField, IntegerType, DoubleType, StringType

# ─── Bronze: raw ingestion ───────────────────────────────
@dlt.table(
    name="raw_orders",
    comment="Raw orders from Kafka",
    table_properties={"quality": "bronze"},
)
def raw_orders():
    return (
        spark.readStream
        .format("kafka")
        .option("kafka.bootstrap.servers", spark.conf.get("pipelines.kafka.broker"))
        .option("subscribe", "orders")
        .load()
        .select(
            F.col("value").cast("string").alias("raw_payload"),
            F.col("timestamp").alias("kafka_timestamp"),
        )
    )

# ─── Silver: cleaned and validated ───────────────────────
order_schema = StructType([
    StructField("order_id", IntegerType()),
    StructField("customer_id", IntegerType()),
    StructField("amount", DoubleType()),
    StructField("status", StringType()),
])

@dlt.table(
    name="orders_clean",
    comment="Parsed and validated orders",
    table_properties={"quality": "silver"},
)
@dlt.expect("valid_order_id", "order_id IS NOT NULL")
@dlt.expect("positive_amount", "amount >= 0")
@dlt.expect_or_drop("valid_status", "status IN ('pending','shipped','delivered','cancelled')")
def orders_clean():
    return (
        dlt.read_stream("raw_orders")
        .select(F.from_json("raw_payload", order_schema).alias("d"))
        .select("d.*")
    )

# ─── Gold: aggregated KPIs ───────────────────────────────
@dlt.table(
    name="daily_revenue",
    comment="Daily revenue by region",
    table_properties={"quality": "gold"},
)
def daily_revenue():
    return (
        dlt.read("orders_clean")
        .filter(F.col("status").isin("shipped", "delivered"))
        .groupBy("region", F.to_date("order_date").alias("date"))
        .agg(F.sum("amount").alias("revenue"))
    )
```

---

## 4. Expectations (Data Quality)

```python
# @dlt.expect — warn on violation (row kept, metric tracked)
@dlt.expect("valid_customer", "customer_id IS NOT NULL")

# @dlt.expect_or_drop — drop violating rows
@dlt.expect_or_drop("positive_amount", "amount >= 0")

# @dlt.expect_or_fail — fail the entire pipeline on violation
@dlt.expect_or_fail("valid_key", "order_id IS NOT NULL")

# Multiple expectations in one decorator
@dlt.expect_all({
    "valid_order_id": "order_id IS NOT NULL",
    "positive_amount": "amount >= 0",
    "valid_status": "status IS NOT NULL",
})
```

---

## 5. Pipeline Modes

```python
# Triggered (default): run once, process all available data, then stop
# Continuous: run indefinitely, process data as it arrives

# Set in pipeline configuration (UI or JSON):
{
  "pipeline_mode": "TRIGGERED",    # or "CONTINUOUS"
  "trigger": {
    "cron": "0 2 * * *"            # daily at 2AM (triggered mode only)
  }
}
```

---

## 6. DLT Pipeline Configuration

```json
{
  "name": "Orders Pipeline",
  "catalog": "my_catalog",
  "target": "silver",
  "libraries": [
    {"notebook": {"path": "/Repos/project/pipelines/orders_pipeline"}}
  ],
  "configuration": {
    "pipelines.kafka.broker": "broker:9092"
  },
  "clusters": [
    {
      "label": "default",
      "autoscale": {"min_workers": 2, "max_workers": 8}
    }
  ]
}
```

---

## 7. Monitoring DLT Pipelines

```python
# Event log: DLT stores pipeline events in a Delta table
events = spark.read.format("delta").load("/pipelines/{pipeline_id}/system/events")
events.filter(F.col("level") == "ERROR").show()

# Data quality metrics
quality = events.filter(F.col("event_type") == "flow_progress") \
    .select("origin.flow_name", "details.flow_progress.data_quality.dropped_records")

# UI: Databricks Workflows → Delta Live Tables → pipeline graph
# Shows: record counts per table, expectation pass/fail rates, lineage graph
```
