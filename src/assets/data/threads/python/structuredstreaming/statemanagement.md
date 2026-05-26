## Stateful Stream Processing
---

Many streaming use cases require maintaining state across events — running totals, session tracking, time-windowed aggregations. Spark Structured Streaming provides both automatic and custom state management.

---

## 1. Stateless vs Stateful Transformations

```
Stateless: each event processed independently
  filter, select, withColumn, flatMap (row → rows, no cross-event state)

Stateful: processing depends on previous events
  groupBy + agg, window aggregations, deduplication,
  mapGroupsWithState, flatMapGroupsWithState
```

---

## 2. Window Aggregations

```python
from pyspark.sql import functions as F

# Tumbling window — fixed, non-overlapping intervals
windowed = orders_stream \
    .groupBy(
        F.window("event_time", "10 minutes"),  # window column
        F.col("region")
    ) \
    .agg(F.sum("amount").alias("revenue"), F.count("*").alias("count"))

# Sliding window — overlapping intervals (window size, slide interval)
windowed = orders_stream \
    .groupBy(
        F.window("event_time", "10 minutes", "5 minutes"),  # 10-min window, slides every 5 min
        F.col("region")
    ) \
    .agg(F.sum("amount").alias("revenue"))

# Access window start and end
windowed.select(
    F.col("window.start"),
    F.col("window.end"),
    "region",
    "revenue"
)
```

---

## 3. Streaming Deduplication

```python
# Deduplicate events by a unique key (e.g., order_id)
deduped = orders_stream \
    .withWatermark("event_time", "1 hour") \     # memory bound: drop state after 1h
    .dropDuplicates(["order_id"])                # unique per order_id
```

---

## 4. mapGroupsWithState

Arbitrary stateful processing per key using a user-defined state update function:

```python
from pyspark.sql.streaming.state import GroupState, GroupStateTimeout
from dataclasses import dataclass

@dataclass
class SessionState:
    order_count: int = 0
    total_spend: float = 0.0
    last_seen: str = ""

def update_session(customer_id: int, events, state: GroupState):
    if state.hasTimedOut:
        yield (*state.get, customer_id)    # emit final state on timeout
        state.remove()
        return

    current = state.getOption or SessionState()

    for event in events:
        current.order_count += 1
        current.total_spend += event.amount
        current.last_seen = event.event_time

    state.update(current)
    state.setTimeoutDuration("30 minutes")    # timeout if no events for 30 min

output_schema = "customer_id INT, order_count INT, total_spend DOUBLE, last_seen STRING"

result = orders_stream \
    .groupBy("customer_id") \
    .mapGroupsWithState(
        update_session,
        outputStructType=output_schema,
        stateStructType="order_count INT, total_spend DOUBLE, last_seen STRING",
        timeoutConf=GroupStateTimeout.ProcessingTimeTimeout,
    )
```

---

## 5. flatMapGroupsWithState

Like `mapGroupsWithState` but can emit 0 or many rows per group per trigger:

```python
def track_session(customer_id, events, state: GroupState):
    # Emit an alert row if spend crosses a threshold
    current = state.getOption or SessionState()

    for event in events:
        current.total_spend += event.amount

        if current.total_spend > 1000 and not current.alerted:
            current.alerted = True
            yield (customer_id, "high_value_alert", current.total_spend)

    state.update(current)

result = orders_stream \
    .groupBy("customer_id") \
    .flatMapGroupsWithState(
        track_session,
        outputMode="append",
        stateStructType=...,
        outputStructType="customer_id INT, event STRING, total DOUBLE",
    )
```

---

## 6. State Store

Spark stores state in the **State Store** — an embedded key-value store in each executor. State is checkpointed to durable storage for fault tolerance:

```python
# State store is automatically managed via the checkpoint location
query = result.writeStream \
    .option("checkpointLocation", "abfss://container@storage/checkpoints/sessions") \
    .outputMode("update") \
    .start()

# Tuning
spark.conf.set("spark.sql.streaming.stateStore.providerClass",
    "org.apache.spark.sql.execution.streaming.state.HDFSBackedStateStoreProvider")
spark.conf.set("spark.sql.streaming.statefulOperator.checkCorrectness.enabled", "true")
```
