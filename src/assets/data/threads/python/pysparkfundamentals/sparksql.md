## Spark SQL
---

Spark SQL lets you query distributed DataFrames using standard SQL syntax, integrating seamlessly with the DataFrame API. It's the most accessible Spark interface for analysts and data engineers.

---

## 1. Registering DataFrames as Views

```python
from pyspark.sql import SparkSession
spark = SparkSession.builder.getOrCreate()

# Load a DataFrame
orders = spark.read.parquet("s3://bucket/orders/")
customers = spark.read.parquet("s3://bucket/customers/")

# Register as temporary views (session-scoped, not persisted)
orders.createOrReplaceTempView("orders")
customers.createOrReplaceTempView("customers")

# Global temporary views (shared across sessions, in `global_temp` database)
orders.createOrReplaceGlobalTempView("orders_global")
```

---

## 2. Running SQL Queries

```python
# Basic query
result = spark.sql("SELECT * FROM orders WHERE amount > 100 ORDER BY amount DESC")
result.show(10)

# Multi-line
result = spark.sql("""
    SELECT
        c.name,
        c.region,
        SUM(o.amount) AS total_revenue,
        COUNT(o.order_id) AS order_count
    FROM orders o
    INNER JOIN customers c ON o.customer_id = c.id
    WHERE o.status = 'shipped'
      AND o.order_date >= '2024-01-01'
    GROUP BY c.name, c.region
    ORDER BY total_revenue DESC
""")
```

---

## 3. SQL Functions Module

```python
from pyspark.sql import functions as F
from pyspark.sql.functions import col, lit, when, coalesce

# Conditionals
df = df.withColumn(
    "discount",
    when(col("status") == "vip", col("amount") * 0.1).otherwise(lit(0.0))
)

# Null handling
df = df.withColumn("name", coalesce(col("name"), lit("Unknown")))
df = df.fillna({"amount": 0.0, "status": "unknown"})
df = df.dropna(subset=["order_id", "customer_id"])

# String functions
df = df.withColumn("email_upper", F.upper(col("email")))
df = df.withColumn("domain", F.regexp_extract(col("email"), r"@(.+)$", 1))

# Date functions
df = df.withColumn("order_year", F.year(col("order_date")))
df = df.withColumn("order_month", F.month(col("order_date")))
df = df.withColumn("days_since", F.datediff(F.current_date(), col("order_date")))
df = df.withColumn("ts", F.to_timestamp(col("created_at"), "yyyy-MM-dd HH:mm:ss"))
```

---

## 4. Window Functions

```python
from pyspark.sql.window import Window

# Running total per customer
w_customer = Window.partitionBy("customer_id").orderBy("order_date")
df = df.withColumn("running_total", F.sum("amount").over(w_customer))

# Rank within region by revenue
w_region = Window.partitionBy("region").orderBy(F.desc("amount"))
df = df.withColumn("rank", F.rank().over(w_region))
df = df.withColumn("dense_rank", F.dense_rank().over(w_region))

# Lag / Lead (previous/next row value)
df = df.withColumn("prev_amount", F.lag("amount", 1).over(w_customer))
df = df.withColumn("next_amount", F.lead("amount", 1).over(w_customer))

# Row number
df = df.withColumn("row_num", F.row_number().over(w_customer))

# Deduplicate — keep the most recent record per customer
df = df.withColumn("rn", F.row_number().over(w_customer)) \
       .filter(col("rn") == 1) \
       .drop("rn")
```

---

## 5. Persisted Tables (Hive / Unity Catalog)

```python
# Create a managed table (metadata + data managed by Spark/Hive)
df.write.saveAsTable("silver.orders_clean")

# Create an external table (data stored at custom path)
df.write.option("path", "s3://bucket/silver/orders_clean") \
        .saveAsTable("silver.orders_clean")

# Run DDL through SQL
spark.sql("CREATE DATABASE IF NOT EXISTS silver")
spark.sql("DROP TABLE IF EXISTS silver.stale_data")
spark.sql("DESCRIBE TABLE silver.orders_clean").show(100, truncate=False)
spark.sql("SHOW TABLES IN silver").show()
```

---

## 6. Parameterised Queries

```python
# Pass Python variables safely
start_date = "2024-01-01"
region = "EMEA"

result = spark.sql(f"""
    SELECT * FROM orders
    WHERE order_date >= '{start_date}'
      AND region = '{region}'
""")

# Safer: use DataFrame API to avoid any injection risk
result = orders \
    .filter(col("order_date") >= start_date) \
    .filter(col("region") == region)
```

---

## 7. Reading From Catalog in SQL

```python
# Unity Catalog namespace: catalog.schema.table
spark.sql("USE CATALOG my_catalog")
spark.sql("USE SCHEMA silver")

result = spark.sql("""
    SELECT year, month, SUM(amount) AS revenue
    FROM my_catalog.silver.orders_clean
    GROUP BY year, month
    ORDER BY year, month
""")
```
