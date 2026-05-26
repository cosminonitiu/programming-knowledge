## Pandas for Data Engineering
---

Pandas is the foundation of data manipulation in Python. Understanding its internals and idiomatic usage is essential for writing efficient, production-quality data pipelines.

---

## 1. Reading and Writing Data

```python
import pandas as pd

# Reading
df = pd.read_csv("data.csv", parse_dates=["order_date"], dtype={"product_id": "int32"})
df = pd.read_parquet("data.parquet", columns=["id", "amount"])  # column pruning
df = pd.read_json("data.json", orient="records")
df = pd.read_sql("SELECT * FROM orders WHERE date > '2024-01-01'", engine)

# Writing
df.to_csv("output.csv", index=False)
df.to_parquet("output.parquet", index=False, compression="snappy")
df.to_sql("target_table", engine, if_exists="append", index=False, method="multi")
```

---

## 2. Essential DataFrame Operations

```python
# Selecting
df["column"]                       # Series
df[["col1", "col2"]]               # DataFrame subset
df.loc[df["amount"] > 100]         # boolean filter (label-based)
df.iloc[0:100]                     # row slice (integer-based)

# Column operations
df["total"] = df["qty"] * df["price"]
df["date"] = pd.to_datetime(df["date"])
df["category"] = df["category"].str.lower().str.strip()

# Renaming, dropping
df = df.rename(columns={"old_name": "new_name"})
df = df.drop(columns=["unnecessary_column"])

# Type casting
df["amount"] = df["amount"].astype("float32")    # save memory
df["status"] = df["status"].astype("category")  # for low-cardinality strings
```

---

## 3. Groupby and Aggregation

```python
# Single aggregation
daily_sales = df.groupby("date")["amount"].sum().reset_index()

# Multiple aggregations
summary = df.groupby(["region", "category"]).agg(
    total_revenue=("amount", "sum"),
    order_count=("order_id", "count"),
    avg_order=("amount", "mean"),
    max_order=("amount", "max"),
).reset_index()

# Window functions (transform — keep original row count)
df["rolling_7d_avg"] = (
    df.sort_values("date")
    .groupby("customer_id")["amount"]
    .transform(lambda x: x.rolling(7, min_periods=1).mean())
)
```

---

## 4. Merging and Joining

```python
# Inner join (default)
result = orders.merge(customers, on="customer_id")

# Left join
result = orders.merge(
    customers[["customer_id", "name", "tier"]],
    on="customer_id",
    how="left",
)

# Many-to-many with suffix disambiguation
result = left.merge(right, on="key", how="outer", suffixes=("_left", "_right"))

# Concatenation (stacking rows)
monthly_data = pd.concat([jan_df, feb_df, mar_df], ignore_index=True)
```

---

## 5. Vectorisation vs `apply`

`apply` is slow — use vectorised operations whenever possible:

```python
# SLOW: apply row-by-row
df["category"] = df["amount"].apply(lambda x: "high" if x > 1000 else "low")

# FAST: vectorised with np.where
import numpy as np
df["category"] = np.where(df["amount"] > 1000, "high", "low")

# FAST: pd.cut for binning
df["tier"] = pd.cut(
    df["amount"],
    bins=[0, 100, 500, 1000, float("inf")],
    labels=["micro", "small", "medium", "large"],
)

# FASTER for complex logic: use .map with dict
status_map = {"A": "Active", "I": "Inactive", "S": "Suspended"}
df["status_label"] = df["status_code"].map(status_map)
```

---

## 6. Memory Efficiency

```python
# Check memory usage
df.info(memory_usage="deep")
df.memory_usage(deep=True).sum() / 1024**2  # MB

# Downcast numeric types
df["age"] = pd.to_numeric(df["age"], downcast="integer")   # int64 → int8
df["price"] = pd.to_numeric(df["price"], downcast="float") # float64 → float32

# Categorical encoding for low-cardinality strings
df["country"] = df["country"].astype("category")  # can save 90%+ memory

# Read only needed columns
df = pd.read_csv("huge.csv", usecols=["id", "amount", "date"])

# Read in chunks for very large files
chunks = []
for chunk in pd.read_csv("huge.csv", chunksize=100_000):
    chunks.append(process(chunk))
result = pd.concat(chunks)
```

---

## 7. Handling Missing Data

```python
# Detect
df.isna().sum()                          # count NaN per column
df[df["customer_id"].isna()]             # rows with missing customer

# Drop
df = df.dropna(subset=["customer_id"])   # rows where customer_id is null
df = df.dropna(thresh=5)                 # rows with fewer than 5 non-NaN values

# Fill
df["amount"] = df["amount"].fillna(0)
df["category"] = df["category"].fillna(method="ffill")  # forward fill
df["city"] = df["city"].fillna(df["city"].mode()[0])    # fill with mode
```
