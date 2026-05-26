## Stream Processing
---

Stream processing handles data continuously as it arrives — individual events or micro-batches — enabling real-time analytics, alerting, and event-driven architectures with latency measured in milliseconds to seconds.

---

## 1. Batch vs Stream Processing

```
Batch Processing:
  Data accumulates → Job runs at scheduled time → Results written
  Latency: minutes to hours
  Use case: daily reports, ETL pipelines

Stream Processing:
  Event arrives → Processed immediately → Result written
  Latency: milliseconds to seconds
  Use case: fraud detection, live dashboards, alerting
```

---

## 2. Key Concepts

| Concept | Description |
|---------|-------------|
| **Event** | A discrete record (click, transaction, sensor reading) |
| **Topic** | Named stream of events (Kafka) |
| **Partition** | Parallel shard of a topic |
| **Consumer Group** | Set of consumers sharing a topic's partitions |
| **Watermark** | Progress marker: "all events before T have been received" |
| **Window** | Time-bounded grouping: tumbling, sliding, session |
| **State** | Aggregated values maintained across events |

---

## 3. Apache Kafka with `confluent-kafka`

```python
from confluent_kafka import Producer, Consumer, KafkaError

# Producer
producer = Producer({"bootstrap.servers": "localhost:9092"})

def produce_event(topic: str, key: str, value: dict):
    import json
    producer.produce(
        topic,
        key=key.encode(),
        value=json.dumps(value).encode(),
        callback=lambda err, msg: print(f"Error: {err}" if err else f"Sent: {msg.offset()}")
    )
    producer.poll(0)   # trigger callbacks

# Consumer
consumer = Consumer({
    "bootstrap.servers": "localhost:9092",
    "group.id": "my-consumer-group",
    "auto.offset.reset": "earliest",
    "enable.auto.commit": False,   # manual commit for exactly-once
})

consumer.subscribe(["orders"])

try:
    while True:
        msg = consumer.poll(timeout=1.0)
        if msg is None:
            continue
        if msg.error():
            if msg.error().code() == KafkaError._PARTITION_EOF:
                continue
            raise Exception(msg.error())

        event = json.loads(msg.value())
        process_event(event)
        consumer.commit()   # commit after successful processing
finally:
    consumer.close()
```

---

## 4. Redis Streams

```python
import redis

r = redis.Redis()

# Produce
r.xadd("orders", {"order_id": "123", "amount": "99.99", "customer": "alice"})

# Consume (consumer group)
r.xgroup_create("orders", "processors", id="0", mkstream=True)

while True:
    messages = r.xreadgroup(
        groupname="processors",
        consumername="worker-1",
        streams={"orders": ">"},   # ">" = only new messages
        count=10,
        block=1000,   # block 1s if no messages
    )
    for stream, entries in (messages or []):
        for entry_id, fields in entries:
            process_order(fields)
            r.xack("orders", "processors", entry_id)  # acknowledge
```

---

## 5. Window Aggregations

```python
from collections import defaultdict
from datetime import datetime, timedelta
import time

class TumblingWindowAggregator:
    """Count events per window (e.g., orders per minute)."""

    def __init__(self, window_seconds: int):
        self.window_seconds = window_seconds
        self._windows: dict[int, int] = defaultdict(int)

    def _window_key(self, ts: float) -> int:
        return int(ts // self.window_seconds) * self.window_seconds

    def add_event(self, event: dict):
        key = self._window_key(time.time())
        self._windows[key] += 1

    def get_current_window_count(self) -> int:
        key = self._window_key(time.time())
        return self._windows[key]

    def get_all_windows(self) -> dict[str, int]:
        return {
            datetime.fromtimestamp(k).isoformat(): v
            for k, v in sorted(self._windows.items())
        }
```

---

## 6. Delivery Guarantees

| Guarantee | Description | Trade-off |
|-----------|-------------|-----------|
| **At-most-once** | Deliver or drop; never duplicate | May lose data |
| **At-least-once** | Always deliver; may duplicate | May produce duplicates |
| **Exactly-once** | Deliver exactly once | Most complex and expensive |

```python
# At-least-once: commit offset only after successful processing
consumer.commit()  # call AFTER process_event()

# Exactly-once with idempotent processing:
def process_event_idempotent(event_id: str, event: dict):
    if redis.sismember("processed_events", event_id):
        return   # skip already-processed events
    process(event)
    redis.sadd("processed_events", event_id)
```

---

## 7. Micro-Batch vs True Streaming

| | True Streaming | Micro-Batch |
|-|---------------|-------------|
| Examples | Kafka Streams, Flink | Spark Structured Streaming |
| Latency | Milliseconds | Seconds |
| Throughput | Lower | Higher |
| State management | Complex | Easier |
| Use case | Real-time alerts | Near-real-time analytics |
