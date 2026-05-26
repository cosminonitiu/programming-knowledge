## ETL and ELT
---

ETL and ELT are the two dominant patterns for moving and transforming data between systems. Choosing the right one depends on where your compute power lives and the capabilities of your destination system.

---

## 1. ETL — Extract, Transform, Load

```
Source Systems → [Extract] → Raw Data → [Transform] → Clean Data → [Load] → Destination
                  (DB, API,              (compute on    (structured,           (data warehouse,
                   files)                 pipeline       enriched)              analytics DB)
                                          server)
```

**When to use ETL:**
- Destination has limited compute (legacy systems, smaller databases).
- Sensitive data must be masked/anonymised before leaving source environment.
- Transformation is complex and benefits from a dedicated processing layer.

---

## 2. ELT — Extract, Load, Transform

```
Source Systems → [Extract] → [Load] → Raw Storage → [Transform] → Analytics Layer
                  (DB, API)            (data lake,                  (dbt, Spark SQL,
                                        raw zone)                    views, procedures)
```

**When to use ELT:**
- Destination is a powerful analytical engine (Databricks, BigQuery, Snowflake, Redshift).
- You want to preserve raw data for re-processing.
- Transformation requirements evolve frequently.
- Cloud-native data platforms with near-infinite compute.

---

## 3. Simple ETL Example in Python

```python
import pandas as pd
import sqlalchemy as sa
from datetime import datetime

# EXTRACT
def extract_sales(source_conn_str: str, since: datetime) -> pd.DataFrame:
    engine = sa.create_engine(source_conn_str)
    query = """
        SELECT order_id, customer_id, product_id, quantity, unit_price, order_date
        FROM orders
        WHERE order_date >= :since
    """
    with engine.connect() as conn:
        return pd.read_sql(query, conn, params={"since": since})

# TRANSFORM
def transform_sales(df: pd.DataFrame) -> pd.DataFrame:
    df = df.copy()
    df["total"] = df["quantity"] * df["unit_price"]
    df["order_date"] = pd.to_datetime(df["order_date"])
    df["year_month"] = df["order_date"].dt.to_period("M").astype(str)
    df = df.dropna(subset=["customer_id"])
    df["product_id"] = df["product_id"].astype(int)
    return df

# LOAD
def load_to_warehouse(df: pd.DataFrame, dest_conn_str: str, table: str):
    engine = sa.create_engine(dest_conn_str)
    df.to_sql(
        table,
        engine,
        if_exists="append",
        index=False,
        method="multi",        # batch inserts
        chunksize=1000,
    )

# Orchestrate
def run_pipeline(since: datetime):
    raw = extract_sales(SOURCE_DB, since)
    cleaned = transform_sales(raw)
    load_to_warehouse(cleaned, DEST_DB, "fact_sales")
    print(f"Loaded {len(cleaned)} rows")
```

---

## 4. Idempotent Loads

Always design loads to be re-runnable without duplicating data:

```python
# Strategy 1: Delete-Insert (truncate partition before load)
def load_partition(df: pd.DataFrame, year_month: str, engine):
    with engine.begin() as conn:
        conn.execute(sa.text(
            "DELETE FROM fact_sales WHERE year_month = :ym"
        ), {"ym": year_month})
        df.to_sql("fact_sales", conn, if_exists="append", index=False)

# Strategy 2: Upsert / MERGE
def upsert(df: pd.DataFrame, engine, table: str, key: str):
    temp_table = f"_temp_{table}"
    df.to_sql(temp_table, engine, if_exists="replace", index=False)
    with engine.begin() as conn:
        conn.execute(sa.text(f"""
            INSERT INTO {table} SELECT * FROM {temp_table}
            ON CONFLICT ({key}) DO UPDATE SET
              quantity = EXCLUDED.quantity,
              total = EXCLUDED.total
        """))
```

---

## 5. Incremental vs Full Loads

```python
from datetime import datetime, timedelta

# Full load — re-process everything (safe but expensive)
def full_load():
    since = datetime(2020, 1, 1)
    run_pipeline(since)

# Incremental — only process new/changed data
def incremental_load():
    last_run = get_last_watermark("fact_sales")    # stored in metadata table
    since = last_run or datetime(2020, 1, 1)
    run_pipeline(since)
    save_watermark("fact_sales", datetime.utcnow())

# Change Data Capture — even more efficient (covered separately)
```

---

## 6. ETL vs ELT Summary

| Aspect | ETL | ELT |
|--------|-----|-----|
| Transform location | Before destination | In destination |
| Raw data preserved | No | Yes |
| Destination requirements | Any | Must handle heavy SQL |
| Re-processing old data | Must re-run pipeline | Re-run SQL/dbt only |
| Typical tools | Python, SSIS, Talend | dbt, Spark SQL, BigQuery |
| Cloud-native fit | Moderate | High |
