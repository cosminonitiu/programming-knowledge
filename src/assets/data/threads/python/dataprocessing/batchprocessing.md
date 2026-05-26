## Batch Processing
---

Batch processing handles large datasets by processing them in chunks — either on a schedule or triggered by data availability. It's the backbone of data warehousing, reporting, and most ETL pipelines.

---

## 1. What is Batch Processing?

Batch processing collects data over a period, then processes all of it together in a single run:

```
Time ─────────────────────────────────────────────────────►
                    Data accumulates...
                           │
                 ┌─────────▼──────────┐
                 │    Batch Job       │
                 │  (e.g., at 2AM)   │
                 └─────────┬──────────┘
                           │
                    Results written
                    to destination
```

**Use batch for:**
- Daily reports, weekly aggregations.
- ETL/ELT pipeline loads.
- Large-scale data transformations that don't need real-time results.
- Machine learning training data preparation.

---

## 2. Simple Batch Job in Python

```python
import pandas as pd
from datetime import date, timedelta
import logging

logger = logging.getLogger(__name__)

def process_daily_batch(processing_date: date):
    logger.info(f"Starting batch for {processing_date}")

    # Extract
    raw_data = load_data_for_date(processing_date)
    logger.info(f"Extracted {len(raw_data)} records")

    if raw_data.empty:
        logger.info("No data to process")
        return

    # Transform in chunks to avoid memory issues
    results = []
    chunk_size = 10_000

    for start in range(0, len(raw_data), chunk_size):
        chunk = raw_data.iloc[start:start + chunk_size]
        processed = transform(chunk)
        results.append(processed)

    final = pd.concat(results)
    logger.info(f"Transformed {len(final)} records")

    # Load
    write_to_warehouse(final, processing_date)
    logger.info("Batch complete")

if __name__ == "__main__":
    yesterday = date.today() - timedelta(days=1)
    process_daily_batch(yesterday)
```

---

## 3. Chunked File Processing

```python
def process_large_csv(file_path: str, output_path: str, chunk_size: int = 100_000):
    writer = None
    total_rows = 0

    for chunk in pd.read_csv(file_path, chunksize=chunk_size):
        processed = transform_chunk(chunk)
        total_rows += len(processed)

        if writer is None:
            processed.to_csv(output_path, index=False)
            writer = True
        else:
            processed.to_csv(output_path, mode="a", header=False, index=False)

    return total_rows

# Or with pyarrow for Parquet (much more efficient)
import pyarrow.parquet as pq
import pyarrow as pa

def process_large_parquet(input_path: str, output_path: str):
    dataset = pq.ParquetDataset(input_path)
    writer = None

    for fragment in dataset.fragments:
        table = fragment.to_table()
        processed = transform_arrow_table(table)

        if writer is None:
            writer = pq.ParquetWriter(output_path, processed.schema)
        writer.write_table(processed)

    if writer:
        writer.close()
```

---

## 4. Parallel Batch Processing

```python
from concurrent.futures import ProcessPoolExecutor
from pathlib import Path
import multiprocessing

def process_file(file_path: Path) -> dict:
    df = pd.read_parquet(file_path)
    result = transform(df)
    output = file_path.parent / "processed" / file_path.name
    result.to_parquet(output)
    return {"file": str(file_path), "rows": len(result)}

def parallel_batch(input_dir: Path, max_workers: int = None):
    files = list(input_dir.glob("*.parquet"))
    max_workers = max_workers or multiprocessing.cpu_count()

    with ProcessPoolExecutor(max_workers=max_workers) as pool:
        results = list(pool.map(process_file, files))

    total = sum(r["rows"] for r in results)
    print(f"Processed {len(files)} files, {total} total rows")
```

---

## 5. Watermarks and State Tracking

```python
import sqlite3
from datetime import datetime

class PipelineState:
    def __init__(self, db_path: str = "pipeline_state.db"):
        self.conn = sqlite3.connect(db_path)
        self.conn.execute("""
            CREATE TABLE IF NOT EXISTS watermarks (
                pipeline TEXT PRIMARY KEY,
                last_processed_at TIMESTAMP,
                rows_processed INTEGER
            )
        """)

    def get_watermark(self, pipeline: str) -> datetime | None:
        row = self.conn.execute(
            "SELECT last_processed_at FROM watermarks WHERE pipeline = ?", (pipeline,)
        ).fetchone()
        return datetime.fromisoformat(row[0]) if row else None

    def set_watermark(self, pipeline: str, ts: datetime, rows: int):
        self.conn.execute("""
            INSERT INTO watermarks VALUES (?, ?, ?)
            ON CONFLICT(pipeline) DO UPDATE SET
              last_processed_at = excluded.last_processed_at,
              rows_processed = excluded.rows_processed
        """, (pipeline, ts.isoformat(), rows))
        self.conn.commit()
```

---

## 6. Retry and Error Handling

```python
import time
from functools import wraps

def retry(max_attempts: int = 3, delay_seconds: float = 5.0, backoff: float = 2.0):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    wait = delay_seconds * (backoff ** (attempt - 1))
                    logger.warning(f"Attempt {attempt} failed: {e}. Retrying in {wait}s")
                    time.sleep(wait)
        return wrapper
    return decorator

@retry(max_attempts=3, delay_seconds=10)
def load_to_warehouse(df, connection_string):
    engine = sa.create_engine(connection_string)
    df.to_sql("target_table", engine, if_exists="append", index=False)
```
