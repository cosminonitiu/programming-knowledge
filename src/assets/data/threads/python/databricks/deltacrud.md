## Delta Lake CRUD Operations
---

Delta Lake supports full CRUD (Create, Read, Update, Delete) operations with ACID guarantees — a major capability gap compared to plain Parquet.

---

## 1. Insert / Append

```python
# Append new rows
new_orders.write \
    .format("delta") \
    .mode("append") \
    .save("abfss://container@storage.dfs.core.windows.net/silver/orders")

# SQL INSERT INTO
spark.sql("""
    INSERT INTO silver.orders
    VALUES (1001, 42, 99.99, 'pending', '2024-03-15')
""")

# INSERT INTO ... SELECT
spark.sql("""
    INSERT INTO silver.orders
    SELECT * FROM bronze.raw_orders WHERE is_valid = true
""")
```

---

## 2. Update

```python
from delta.tables import DeltaTable

dt = DeltaTable.forName(spark, "silver.orders")

# Update rows matching a condition
dt.update(
    condition="status = 'pending' AND order_date < '2024-01-01'",
    set={"status": "'expired'"}
)

# SQL UPDATE
spark.sql("""
    UPDATE silver.orders
    SET status = 'expired'
    WHERE status = 'pending'
      AND order_date < '2024-01-01'
""")
```

---

## 3. Delete

```python
dt = DeltaTable.forName(spark, "silver.orders")

# Delete matching rows
dt.delete("status = 'cancelled' AND order_date < '2023-01-01'")

# SQL DELETE
spark.sql("""
    DELETE FROM silver.orders
    WHERE status = 'cancelled'
      AND order_date < '2023-01-01'
""")
```

---

## 4. MERGE (Upsert)

MERGE is the most powerful Delta operation — update existing rows and insert new ones atomically:

```python
from delta.tables import DeltaTable
from pyspark.sql import functions as F

target = DeltaTable.forName(spark, "silver.orders")

# Source: incoming changes
updates_df = spark.read.parquet("s3://bucket/incoming/orders/")

target.alias("t").merge(
    source=updates_df.alias("s"),
    condition="t.order_id = s.order_id"
) \
.whenMatchedUpdate(set={
    "status":     "s.status",
    "amount":     "s.amount",
    "updated_at": F.current_timestamp().cast("string"),
}) \
.whenNotMatchedInsert(values={
    "order_id":    "s.order_id",
    "customer_id": "s.customer_id",
    "amount":      "s.amount",
    "status":      "s.status",
    "order_date":  "s.order_date",
    "updated_at":  F.current_timestamp().cast("string"),
}) \
.execute()
```

---

## 5. MERGE with Additional Clauses

```python
target.alias("t").merge(
    source=updates.alias("s"),
    condition="t.order_id = s.order_id"
) \
.whenMatchedUpdateAll() \                   # update all columns when key matches
.whenNotMatchedInsertAll() \                # insert all columns for new rows
.whenNotMatchedBySourceDelete() \          # delete target rows not in source
.execute()
```

---

## 6. SQL MERGE

```sql
MERGE INTO silver.orders AS t
USING (SELECT * FROM bronze.incoming_orders) AS s
ON t.order_id = s.order_id
WHEN MATCHED THEN
  UPDATE SET
    t.status = s.status,
    t.amount = s.amount
WHEN NOT MATCHED THEN
  INSERT (order_id, customer_id, amount, status, order_date)
  VALUES (s.order_id, s.customer_id, s.amount, s.status, s.order_date)
```

---

## 7. Table History

```python
# View all commits
dt = DeltaTable.forName(spark, "silver.orders")
display(dt.history())

# Or SQL
spark.sql("DESCRIBE HISTORY silver.orders").show(truncate=False)

# Output:
# version | timestamp            | operation | operationParameters
#       5 | 2024-03-15 10:00:01  | MERGE     | {predicate: "..."}
#       4 | 2024-03-15 09:00:00  | WRITE     | {mode: "Append"}
#       3 | 2024-03-14 02:00:00  | DELETE    | {predicate: "..."}
```
