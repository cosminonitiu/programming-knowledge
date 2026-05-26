## Medallion Architecture
---

The Medallion Architecture (also called Multi-Hop Architecture) is a design pattern for organising data in a data lake into Bronze, Silver, and Gold layers — each representing a higher level of data quality and business value.

---

## 1. Three-Layer Model

```
External Sources               Bronze              Silver               Gold
(Kafka, APIs, DBs)    →    Raw / Landing    →   Cleaned &       →   Business
                             (as-is copy)        Conformed            Aggregates

"Append-only            "Deduplicated,       "KPIs, reports,
 ingestion"              validated,            dashboards,
                         conformed"            ML features"
```

---

## 2. Bronze Layer — Raw Landing Zone

```python
# Bronze: store data exactly as received, no transformation
# Goal: preserve all original data, provide reprocessing capability

# Ingest from Kafka
bronze_stream = (
    spark.readStream
    .format("kafka")
    .option("kafka.bootstrap.servers", "broker:9092")
    .option("subscribe", "orders")
    .load()
    .select(
        F.col("value").cast("string").alias("raw_payload"),
        F.col("timestamp").alias("kafka_timestamp"),
        F.col("partition").alias("kafka_partition"),
        F.col("offset").alias("kafka_offset"),
        F.current_timestamp().alias("ingested_at"),
    )
)

bronze_stream.writeStream \
    .format("delta") \
    .outputMode("append") \
    .option("checkpointLocation", "/checkpoints/bronze/orders") \
    .partitionBy("kafka_partition") \
    .start("abfss://container@storage.dfs.core.windows.net/bronze/orders")
```

**Bronze rules:**
- Append-only — never modify or delete raw data.
- Include metadata: ingestion timestamp, source, partition, offset.
- No transformations — preserve original format.

---

## 3. Silver Layer — Cleaned and Conformed

```python
# Silver: parse, validate, deduplicate, standardise
# Goal: a single source of truth for all consumers

from delta.tables import DeltaTable

def process_silver(batch_df, batch_id):
    # Parse JSON payload
    parsed = batch_df.select(
        F.from_json(F.col("raw_payload"), order_schema).alias("d"),
        "ingested_at"
    ).select("d.*", "ingested_at") \
     .withColumn("event_time", F.to_timestamp("event_time")) \
     .filter(F.col("order_id").isNotNull()) \
     .filter(F.col("amount") >= 0)

    # Deduplicate
    deduped = parsed.dropDuplicates(["order_id"])

    # Upsert into silver (MERGE handles late-arriving updates)
    target = DeltaTable.forName(spark, "silver.orders")
    target.alias("t").merge(
        deduped.alias("s"), "t.order_id = s.order_id"
    ).whenMatchedUpdateAll() \
     .whenNotMatchedInsertAll() \
     .execute()

spark.readStream.format("delta").table("bronze.orders") \
    .writeStream \
    .foreachBatch(process_silver) \
    .option("checkpointLocation", "/checkpoints/silver/orders") \
    .start()
```

---

## 4. Gold Layer — Business Aggregates

```python
# Gold: curated, aggregated views optimised for consumption
# Goal: ready-to-query data products (KPIs, reports, features)

spark.sql("""
    CREATE OR REPLACE TABLE gold.daily_revenue
    USING DELTA AS
    SELECT
        DATE_TRUNC('day', order_date) AS date,
        region,
        product_category,
        SUM(amount)       AS total_revenue,
        COUNT(order_id)   AS order_count,
        COUNT(DISTINCT customer_id) AS unique_customers,
        AVG(amount)       AS avg_order_value
    FROM silver.orders
    WHERE status IN ('shipped', 'delivered')
    GROUP BY 1, 2, 3
""")

# Refresh gold incrementally each day
spark.sql("""
    INSERT OVERWRITE gold.daily_revenue
    PARTITION (date = '2024-03-15')
    SELECT ...
    FROM silver.orders WHERE order_date = '2024-03-15'
""")
```

---

## 5. Design Principles

| Principle | Description |
|-----------|-------------|
| **Idempotent** | Re-running a layer produces the same result |
| **Reprocessable** | Bronze can be re-ingested to rebuild Silver and Gold |
| **Progressive trust** | Each layer is more reliable than the previous |
| **Separation of concerns** | Bronze = ingestion, Silver = quality, Gold = value |
| **Schema-on-read at Bronze** | Don't enforce schema when landing raw data |
| **Schema-on-write at Silver+** | Enforce schema with Delta's schema enforcement |

---

## 6. Naming Conventions

```python
# Databricks recommended namespace
my_catalog.bronze.raw_orders        # raw landing
my_catalog.silver.orders            # cleaned
my_catalog.gold.daily_revenue       # aggregated KPI
my_catalog.gold.customer_features   # ML feature store
```

---

## 7. Pipeline Orchestration

```python
# Options for orchestrating Bronze → Silver → Gold:
# 1. Databricks Workflows: DAG of notebook/DLT tasks
# 2. Delta Live Tables: declarative, handles dependencies automatically
# 3. Apache Airflow: external orchestration
# 4. Streaming: continuous Bronze → Silver → Gold pipelines
```
