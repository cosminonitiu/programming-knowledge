## Pipeline Orchestration
---

Orchestration tools schedule, monitor, and manage dependencies between pipeline tasks — ensuring they run in the right order, retrying failures, and providing visibility into pipeline health.

---

## 1. What is Orchestration?

Without an orchestrator:
```
cron job → script → next script → ...
         └─ no visibility, no retry, no dependency tracking
```

With an orchestrator:
```
DAG definition → Scheduler → Worker executes tasks
                           ├─ Retry on failure
                           ├─ Alert on SLA breach
                           ├─ Backfill historical runs
                           └─ Log every execution
```

---

## 2. Apache Airflow

The most widely used open-source orchestrator for batch pipelines.

```python
from datetime import datetime, timedelta
from airflow import DAG
from airflow.operators.python import PythonOperator

default_args = {
    "owner": "data-team",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "email_on_failure": True,
    "email": ["alerts@example.com"],
}

with DAG(
    dag_id="daily_sales_pipeline",
    default_args=default_args,
    schedule_interval="0 2 * * *",   # 2AM daily
    start_date=datetime(2024, 1, 1),
    catchup=False,
    tags=["sales", "etl"],
) as dag:

    def extract(**context):
        date = context["ds"]         # execution date "2024-01-15"
        df = pull_from_source(date)
        df.to_parquet(f"/tmp/raw_{date}.parquet")

    def transform(**context):
        date = context["ds"]
        df = pd.read_parquet(f"/tmp/raw_{date}.parquet")
        clean = clean_data(df)
        clean.to_parquet(f"/tmp/clean_{date}.parquet")

    def load(**context):
        date = context["ds"]
        df = pd.read_parquet(f"/tmp/clean_{date}.parquet")
        write_to_warehouse(df, date)

    extract_task = PythonOperator(task_id="extract", python_callable=extract)
    transform_task = PythonOperator(task_id="transform", python_callable=transform)
    load_task = PythonOperator(task_id="load", python_callable=load)

    extract_task >> transform_task >> load_task
```

---

## 3. Airflow Key Concepts

| Concept | Description |
|---------|-------------|
| **DAG** | Directed Acyclic Graph of tasks |
| **Task** | Individual unit of work |
| **Operator** | Task template (PythonOperator, BashOperator, SQLOperator…) |
| **Sensor** | Polls until a condition is met (file arrived, query returned data) |
| **XCom** | Cross-task communication (small data only) |
| **Pool** | Limits concurrency on shared resources |
| **Variable** | Runtime configuration values |
| **Connection** | Named credentials for external systems |

---

## 4. Prefect

Modern, Python-native orchestration with less boilerplate:

```python
from prefect import flow, task
from prefect.tasks import task_input_hash
from datetime import timedelta

@task(retries=3, cache_key_fn=task_input_hash, cache_expiration=timedelta(hours=1))
def extract(date: str) -> pd.DataFrame:
    return pull_from_source(date)

@task(retries=2)
def transform(df: pd.DataFrame) -> pd.DataFrame:
    return clean_data(df)

@task
def load(df: pd.DataFrame, date: str):
    write_to_warehouse(df, date)

@flow(name="daily-sales-pipeline", log_prints=True)
def daily_pipeline(date: str):
    raw = extract(date)
    clean = transform(raw)
    load(clean, date)

# Run locally
daily_pipeline(date="2024-01-15")

# Deploy to Prefect Cloud / server
# prefect deploy
```

---

## 5. Dagster

Asset-based orchestration — focuses on data assets rather than tasks:

```python
from dagster import asset, AssetIn, define_asset_job, Definitions

@asset
def raw_orders(context) -> pd.DataFrame:
    date = context.run.run_config.get("date")
    return pull_from_source(date)

@asset(ins={"raw_orders": AssetIn()})
def clean_orders(raw_orders: pd.DataFrame) -> pd.DataFrame:
    return clean_data(raw_orders)

@asset(ins={"clean_orders": AssetIn()})
def orders_summary(clean_orders: pd.DataFrame) -> pd.DataFrame:
    return clean_orders.groupby("region")["amount"].sum().reset_index()

daily_job = define_asset_job("daily_orders_job", selection=["*"])

defs = Definitions(
    assets=[raw_orders, clean_orders, orders_summary],
    jobs=[daily_job],
)
```

---

## 6. Orchestrator Comparison

| Feature | Airflow | Prefect | Dagster |
|---------|---------|---------|---------|
| Paradigm | Task-centric | Task-centric | Asset-centric |
| Setup complexity | High | Low | Medium |
| Python-native | Partial | Yes | Yes |
| Data lineage | No | No | Yes |
| Testing | Hard | Easy | Easy |
| Best for | Enterprise, large teams | Simpler pipelines | Data-asset observability |
