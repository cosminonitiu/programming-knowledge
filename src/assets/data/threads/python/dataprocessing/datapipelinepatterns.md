## Data Pipeline Patterns
---

Well-designed data pipelines are modular, observable, idempotent, and testable. Understanding common pipeline patterns helps you choose the right architecture for your use case.

---

## 1. Linear Pipeline Pattern

The simplest pattern: data flows through a sequence of stages:

```python
from dataclasses import dataclass
from typing import Callable, TypeVar

T = TypeVar("T")

class Pipeline:
    def __init__(self, data):
        self._data = data

    def step(self, func: Callable, **kwargs):
        self._data = func(self._data, **kwargs)
        return self

    def result(self):
        return self._data

# Usage
result = (
    Pipeline(raw_df)
    .step(filter_nulls, columns=["customer_id", "amount"])
    .step(normalise_amounts, currency="USD")
    .step(enrich_with_customer_data, db=customer_db)
    .step(aggregate_by_day)
    .result()
)
```

---

## 2. Fan-Out / Fan-In

Process independently and merge:

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def fan_out_pipeline(input_data: list) -> list:
    """Split into chunks, process in parallel, merge."""
    chunks = split_into_chunks(input_data, chunk_size=1000)

    results = []
    with ThreadPoolExecutor(max_workers=8) as executor:
        futures = {executor.submit(process_chunk, chunk): i for i, chunk in enumerate(chunks)}
        for future in as_completed(futures):
            results.append(future.result())

    return merge_results(results)
```

---

## 3. Idempotency Patterns

```python
# Pattern 1: Check-before-write
def load_idempotent(df, table: str, date: str, engine):
    with engine.begin() as conn:
        count = conn.execute(
            sa.text(f"SELECT COUNT(*) FROM {table} WHERE date = :d"), {"d": date}
        ).scalar()
        if count > 0:
            logger.info(f"Data for {date} already exists, skipping")
            return
        df.to_sql(table, conn, if_exists="append", index=False)

# Pattern 2: Delete-then-insert
def replace_partition(df, table: str, partition_col: str, partition_val: str, engine):
    with engine.begin() as conn:
        conn.execute(sa.text(
            f"DELETE FROM {table} WHERE {partition_col} = :val"
        ), {"val": partition_val})
        df.to_sql(table, conn, if_exists="append", index=False)
```

---

## 4. Dead Letter Queue Pattern

Failed records go to a separate queue for investigation/reprocessing:

```python
def process_with_dlq(events: list[dict], dlq_writer):
    successes = []
    failures = []

    for event in events:
        try:
            result = transform_event(event)
            successes.append(result)
        except Exception as e:
            failures.append({
                "original_event": event,
                "error": str(e),
                "error_type": type(e).__name__,
                "failed_at": datetime.utcnow().isoformat(),
            })

    if failures:
        dlq_writer.write(failures)
        logger.warning(f"{len(failures)} events sent to DLQ")

    return successes
```

---

## 5. Pipeline Metadata and Observability

```python
from dataclasses import dataclass, field
from datetime import datetime
import time

@dataclass
class PipelineRun:
    pipeline_name: str
    started_at: datetime = field(default_factory=datetime.utcnow)
    finished_at: datetime | None = None
    rows_extracted: int = 0
    rows_transformed: int = 0
    rows_loaded: int = 0
    rows_failed: int = 0
    status: str = "running"
    error: str | None = None

class ObservablePipeline:
    def __init__(self, name: str, metadata_store):
        self.run = PipelineRun(name)
        self.store = metadata_store

    def __enter__(self):
        self.store.save(self.run)
        return self.run

    def __exit__(self, exc_type, exc_val, exc_tb):
        self.run.finished_at = datetime.utcnow()
        self.run.status = "failed" if exc_val else "success"
        if exc_val:
            self.run.error = str(exc_val)
        self.store.save(self.run)

# Usage
with ObservablePipeline("daily_sales_etl", metadata_store) as run:
    raw = extract()
    run.rows_extracted = len(raw)
    transformed = transform(raw)
    run.rows_transformed = len(transformed)
    load(transformed)
    run.rows_loaded = len(transformed)
```

---

## 6. Configuration-Driven Pipelines

```python
# pipeline_config.yaml
pipelines:
  daily_orders:
    source:
      type: postgres
      query: "SELECT * FROM orders WHERE date = '{date}'"
    transformations:
      - type: filter_nulls
        columns: [customer_id, amount]
      - type: convert_currency
        column: amount
        to: USD
    destination:
      type: parquet
      path: "s3://my-bucket/orders/{date}/"
      mode: overwrite
```

```python
class PipelineRunner:
    def run_from_config(self, config: dict, context: dict):
        extractor = self._build_extractor(config["source"], context)
        transformers = [self._build_transformer(t) for t in config["transformations"]]
        loader = self._build_loader(config["destination"], context)

        data = extractor.extract()
        for transformer in transformers:
            data = transformer.transform(data)
        loader.load(data)
```

---

## 7. Testing Pipelines

```python
import pytest
import pandas as pd

def test_transform_handles_nulls():
    input_df = pd.DataFrame({
        "customer_id": [1, None, 3],
        "amount": [10.0, 20.0, 30.0],
    })
    result = transform(input_df)
    assert result["customer_id"].isna().sum() == 0  # nulls removed
    assert len(result) == 2

def test_idempotent_load(test_engine):
    df = pd.DataFrame({"date": ["2024-01-01"], "value": [100]})
    load_idempotent(df, "metrics", "2024-01-01", test_engine)
    load_idempotent(df, "metrics", "2024-01-01", test_engine)  # second call no-ops
    count = test_engine.execute("SELECT COUNT(*) FROM metrics").scalar()
    assert count == 1
```
