## `concurrent.futures` Executors
---

`concurrent.futures` provides a high-level, unified interface for running work in thread pools and process pools. It abstracts away the lower-level `threading` and `multiprocessing` APIs into a simple `Executor` pattern.

---

## 1. `ThreadPoolExecutor`

Best for I/O-bound tasks: network calls, database queries, file operations.

```python
from concurrent.futures import ThreadPoolExecutor, as_completed
import requests

def fetch(url: str) -> dict:
    response = requests.get(url, timeout=5)
    return response.json()

urls = [
    "https://api.example.com/users/1",
    "https://api.example.com/users/2",
    "https://api.example.com/users/3",
]

# map() — simplest form, preserves order
with ThreadPoolExecutor(max_workers=5) as executor:
    results = list(executor.map(fetch, urls))
```

---

## 2. `ProcessPoolExecutor`

Best for CPU-bound tasks: number crunching, image processing, compression.

```python
from concurrent.futures import ProcessPoolExecutor

def compute(n: int) -> int:
    return sum(i**2 for i in range(n))

if __name__ == "__main__":
    inputs = [1_000_000, 2_000_000, 3_000_000, 4_000_000]

    with ProcessPoolExecutor(max_workers=4) as executor:
        results = list(executor.map(compute, inputs))
```

---

## 3. `submit()` — Individual Futures

`submit()` returns a `Future` immediately without blocking:

```python
from concurrent.futures import ThreadPoolExecutor, Future

def slow_task(n: int) -> int:
    import time
    time.sleep(n)
    return n ** 2

with ThreadPoolExecutor(max_workers=4) as executor:
    futures: list[Future] = [executor.submit(slow_task, i) for i in range(5)]

    # Access results as they complete
    for future in futures:
        print(future.result())  # blocks until this specific future is done
```

---

## 4. `as_completed()` — Process in Order of Completion

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

def process_file(path: str) -> dict:
    # some file processing
    return {"path": path, "lines": count_lines(path)}

files = ["data1.csv", "data2.csv", "data3.csv", "data4.csv"]

with ThreadPoolExecutor(max_workers=4) as executor:
    future_to_file = {executor.submit(process_file, f): f for f in files}

    for future in as_completed(future_to_file):
        file = future_to_file[future]
        try:
            result = future.result()
            print(f"Processed {file}: {result['lines']} lines")
        except Exception as exc:
            print(f"Error processing {file}: {exc}")
```

---

## 5. `Future` API

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor() as executor:
    f = executor.submit(lambda: 42)

    f.done()       # False while running, True when complete
    f.running()    # True if actively executing
    f.cancelled()  # True if cancelled before execution
    f.result(timeout=5)    # block and return result (raises exception if task raised)
    f.exception()  # return the exception if task raised, else None

    # Callbacks run when future completes (in the thread that completed it)
    f.add_done_callback(lambda fut: print(f"Done: {fut.result()}"))
```

---

## 6. Cancelling Futures

A future can only be cancelled if it hasn't started execution yet:

```python
from concurrent.futures import ThreadPoolExecutor

with ThreadPoolExecutor(max_workers=1) as executor:
    f1 = executor.submit(slow_task, 5)   # starts immediately (only 1 worker)
    f2 = executor.submit(slow_task, 5)   # queued — can be cancelled

    cancelled = f2.cancel()
    print(f"f2 cancelled: {cancelled}")  # True if still in queue
```

---

## 7. Choosing `max_workers`

```python
import os

# ThreadPoolExecutor default (Python 3.8+): min(32, os.cpu_count() + 4)
# For I/O-bound: more threads than CPUs is fine
thread_pool = ThreadPoolExecutor(max_workers=min(32, os.cpu_count() * 5))

# ProcessPoolExecutor default: os.cpu_count()
# For CPU-bound: match CPU count
process_pool = ProcessPoolExecutor(max_workers=os.cpu_count())
```

---

## 8. Using with `asyncio`

Bridge synchronous blocking code into an async application:

```python
import asyncio
from concurrent.futures import ThreadPoolExecutor, ProcessPoolExecutor

thread_pool = ThreadPoolExecutor(max_workers=10)
process_pool = ProcessPoolExecutor(max_workers=4)

async def async_handler():
    loop = asyncio.get_running_loop()

    # I/O blocking in thread pool
    result = await loop.run_in_executor(thread_pool, blocking_io_function)

    # CPU work in process pool
    computed = await loop.run_in_executor(process_pool, cpu_bound_function, data)

    return result, computed
```

---

## 9. Comparison: `threading` vs `concurrent.futures`

| | `threading` | `concurrent.futures.ThreadPoolExecutor` |
|--|-------------|----------------------------------------|
| Level | Low (manual) | High (automatic pool) |
| Thread reuse | Manual | Automatic |
| Result collection | Manual (queues/join) | `Future.result()` |
| Exception propagation | Must handle manually | Raised on `Future.result()` |
| Best for | Long-running threads with complex lifecycle | Short tasks submitted to a pool |
