## Spark DataFrames
---

The Spark DataFrame API is the primary way to work with structured data in PySpark. It provides a schema-aware, optimised abstraction over distributed data — similar to pandas but executed on a cluster.

---

## 1. Creating a SparkSession

```python
from pyspark.sql import SparkSession

# Local development
spark = SparkSession.builder \
    .appName("MyApp") \
    .master("local[*]") \
    .getOrCreate()

# On Databricks: 'spark' is already available in the notebook
```

---

## 2. Reading Data

```python
# Parquet (preferred format — columnar, compressed)
df = spark.read.parquet("s3://bucket/orders/year=2024/")
df = spark.read.parquet("dbfs:/mnt/datalake/bronze/orders")

# CSV
df = spark.read.option("header", True) \
               .option("inferSchema", True) \
               .csv("s3://bucket/raw/data.csv")

# JSON
df = spark.read.json("data.json")

# Delta Lake
df = spark.read.format("delta").load("abfss://container@storage.dfs.core.windows.net/orders")

# Explicit schema (faster + safer than inferSchema)
from pyspark.sql.types import StructType, StructField, IntegerType, StringType, DoubleType

schema = StructType([
    StructField("order_id", IntegerType(), nullable=False),
    StructField("customer_id", IntegerType(), nullable=True),
    StructField("amount", DoubleType(), nullable=True),
    StructField("status", StringType(), nullable=True),
])
df = spark.read.schema(schema).parquet("data/")
```

---

## 3. DataFrame Inspections

```python
df.show(5)                 # display first 5 rows
df.show(truncate=False)    # show full values, no truncation
df.printSchema()           # print schema tree
df.dtypes                  # list of (name, dtype) tuples
df.columns                 # list of column names
df.count()                 # row count (triggers action)
df.describe("amount").show()   # min, max, mean, stddev, count
```

---

## 4. Selecting and Filtering

```python
from pyspark.sql import functions as F

# Select columns
df.select("order_id", "amount")
df.select(F.col("order_id"), F.col("amount") * 1.2)

# Filter (equivalent)
df.filter(F.col("amount") > 100)
df.where(df["status"] == "shipped")
df.filter((df["amount"] > 50) & (df["status"] != "cancelled"))

# Distinct
df.select("region").distinct()
df.dropDuplicates(["order_id"])
```

---

## 5. Transformations

```python
# Add/modify columns
df = df.withColumn("total", F.col("qty") * F.col("unit_price"))
df = df.withColumn("order_date", F.to_date("order_date", "yyyy-MM-dd"))
df = df.withColumn("region_upper", F.upper(F.col("region")))
df = df.withColumn(
    "tier",
    F.when(F.col("amount") > 1000, "high")
     .when(F.col("amount") > 100, "medium")
     .otherwise("low")
)

# Rename column
df = df.withColumnRenamed("old_name", "new_name")

# Drop column
df = df.drop("unnecessary_col")

# Casting
df = df.withColumn("amount", F.col("amount").cast("double"))
```

---

## 6. Aggregations

```python
from pyspark.sql import functions as F

# Simple aggregation
df.agg(
    F.sum("amount").alias("total_revenue"),
    F.count("order_id").alias("order_count"),
    F.avg("amount").alias("avg_order"),
    F.countDistinct("customer_id").alias("unique_customers"),
).show()

# GroupBy + aggregation
df.groupBy("region", "status") \
  .agg(
      F.sum("amount").alias("revenue"),
      F.count("*").alias("count"),
  ) \
  .orderBy(F.desc("revenue")) \
  .show()
```

---

## 7. Writing Data

```python
# Parquet
df.write \
  .mode("overwrite") \      # overwrite | append | error | ignore
  .partitionBy("year", "month") \
  .parquet("output/orders/")

# Delta Lake
df.write \
  .format("delta") \
  .mode("append") \
  .save("abfss://container@storage.dfs.core.windows.net/silver/orders")

# Register as table (Databricks / Hive Metastore)
df.write \
  .mode("overwrite") \
  .saveAsTable("silver.orders")
```
