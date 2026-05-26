## Serialisation Formats
---

Choosing the right serialisation format affects storage size, read/write speed, schema enforcement, and interoperability. Data engineering uses different formats at different pipeline stages.

---

## 1. Format Overview

| Format | Type | Human-Readable | Schema | Columnar | Compression |
|--------|------|---------------|--------|----------|-------------|
| CSV | Text | Yes | No | No | External |
| JSON | Text | Yes | Optional | No | External |
| Parquet | Binary | No | Yes | **Yes** | Built-in |
| Avro | Binary | No | Yes | No | Built-in |
| ORC | Binary | No | Yes | **Yes** | Built-in |
| Protocol Buffers | Binary | No | Yes | No | Gzip |

---

## 2. CSV

```python
import pandas as pd
import csv

# Pandas (most common)
df = pd.read_csv("data.csv", dtype={"id": int, "amount": float}, na_values=["", "NULL"])
df.to_csv("output.csv", index=False, quoting=csv.QUOTE_NONNUMERIC)

# Standard library (streaming)
with open("large.csv", newline="") as f:
    reader = csv.DictReader(f)
    for row in reader:
        process(row)
```

**Best for:** Simple data exchange, human inspection, small datasets, spreadsheet integration.
**Avoid for:** Large datasets (no compression, slow), schema validation.

---

## 3. JSON / JSONL

```python
import json, orjson  # orjson is 10x faster

# Standard JSON
data = json.loads(raw_text)
raw_text = json.dumps(data, default=str, indent=2)

# orjson (binary I/O, handles datetime/UUID natively)
raw_bytes = orjson.dumps(data, option=orjson.OPT_SERIALIZE_DATACLASS)
data = orjson.loads(raw_bytes)

# JSON Lines (JSONL) — best format for streaming JSON
with open("events.jsonl", "w") as f:
    for record in records:
        f.write(json.dumps(record) + "\n")

# Read JSONL in chunks
def read_jsonl(path: str):
    with open(path) as f:
        for line in f:
            yield json.loads(line)
```

---

## 4. Parquet — The Data Engineering Standard

```python
import pandas as pd
import pyarrow as pa
import pyarrow.parquet as pq

# Write with pandas
df.to_parquet("data.parquet", engine="pyarrow", compression="snappy", index=False)

# Write with explicit schema
schema = pa.schema([
    pa.field("order_id", pa.int64()),
    pa.field("amount", pa.float32()),
    pa.field("order_date", pa.date32()),
])
table = pa.Table.from_pandas(df, schema=schema)
pq.write_table(table, "data.parquet")

# Read with column pruning (only load needed columns)
df = pd.read_parquet("data.parquet", columns=["order_id", "amount"])

# Partitioned dataset (e.g., by date)
pq.write_to_dataset(table, root_path="s3://bucket/orders", partition_cols=["year", "month"])
```

**Best for:** Analytical workloads, data lakes, columnar reads, Spark/Databricks, large datasets.
**Key advantages:** Columnar storage (read only needed columns), built-in compression, schema embedded, predicate pushdown.

---

## 5. Avro

```python
import fastavro

schema = {
    "type": "record",
    "name": "Order",
    "fields": [
        {"name": "order_id", "type": "int"},
        {"name": "customer_id", "type": "int"},
        {"name": "amount", "type": "double"},
        {"name": "status", "type": {"type": "enum", "name": "Status",
                                    "symbols": ["pending", "shipped"]}},
    ]
}

# Write
with open("orders.avro", "wb") as f:
    fastavro.writer(f, schema, records)

# Read
with open("orders.avro", "rb") as f:
    records = list(fastavro.reader(f))
```

**Best for:** Kafka messages (native schema registry support), row-based streaming, schema evolution with full/forward/backward compatibility.

---

## 6. Protocol Buffers

```protobuf
// order.proto
syntax = "proto3";

message Order {
  int32 order_id = 1;
  int32 customer_id = 2;
  double amount = 3;
  string status = 4;
}
```

```python
# After generating: protoc --python_out=. order.proto
from order_pb2 import Order

msg = Order(order_id=1, customer_id=42, amount=99.99, status="pending")
serialised = msg.SerializeToString()   # binary bytes

order = Order()
order.ParseFromString(serialised)
```

**Best for:** gRPC, microservice communication, IoT payloads, Android/iOS apps. Smallest binary size.

---

## 7. Format Selection Guide

```
Is it for human inspection / simple exchange?
  → CSV or JSON

Is it a Kafka/Kinesis event stream?
  → Avro (with Schema Registry) or JSON Lines

Is it a data lake / analytical workload?
  → Parquet (columnar, Spark-native)

Is it a gRPC or microservice API?
  → Protocol Buffers

Is it for archival / long-term storage?
  → Parquet with Snappy or Zstandard compression
```
