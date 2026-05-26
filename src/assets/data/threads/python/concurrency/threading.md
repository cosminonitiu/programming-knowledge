## Threading Module
---

The `threading` module provides OS-level threads for concurrent execution. In CPython, threads share memory and are best suited for I/O-bound tasks where threads spend most of their time waiting rather than computing.

---

## 1. Creating and Starting Threads

```python
import threading

def worker(name: str, count: int):
    for i in range(count):
        print(f"Thread {name}: {i}")

# Thread(target, args, kwargs, daemon)
t1 = threading.Thread(target=worker, args=("A", 3))
t2 = threading.Thread(target=worker, args=("B", 3))

t1.start()
t2.start()

# Wait for threads to complete
t1.join()
t2.join()
print("All done")
```

---

## 2. Thread Lifecycle

```python
t = threading.Thread(target=worker, args=("X", 5))

t.is_alive()  # False — not started
t.start()
t.is_alive()  # True — running
t.join()
t.is_alive()  # False — finished

# Daemon threads — auto-killed when main thread exits
t = threading.Thread(target=worker, daemon=True)
```

---

## 3. Thread Class Subclassing

```python
class DownloadThread(threading.Thread):
    def __init__(self, url: str):
        super().__init__()
        self.url = url
        self.result = None
        self.error = None

    def run(self):   # override run(), not start()
        try:
            self.result = download(self.url)
        except Exception as e:
            self.error = e

threads = [DownloadThread(url) for url in urls]
for t in threads: t.start()
for t in threads: t.join()
results = [t.result for t in threads if t.error is None]
```

---

## 4. `threading.Lock` — Mutual Exclusion

Protect shared mutable state with a lock:

```python
import threading

class SafeCounter:
    def __init__(self):
        self._count = 0
        self._lock = threading.Lock()

    def increment(self):
        with self._lock:   # acquire on entry, release on exit
            self._count += 1

    @property
    def value(self):
        with self._lock:
            return self._count

counter = SafeCounter()
threads = [threading.Thread(target=counter.increment) for _ in range(1000)]
for t in threads: t.start()
for t in threads: t.join()
print(counter.value)  # always 1000 with lock, sometimes less without
```

---

## 5. `threading.RLock` — Reentrant Lock

An `RLock` can be acquired multiple times by the **same thread** without deadlocking:

```python
class TreeNode:
    def __init__(self):
        self._lock = threading.RLock()

    def update(self):
        with self._lock:
            self._do_update()  # might also call a method that acquires _lock

    def _do_update(self):
        with self._lock:   # safe with RLock, deadlock with regular Lock
            ...
```

---

## 6. `threading.Event` — Thread Signalling

```python
ready_event = threading.Event()

def producer():
    time.sleep(1)
    data = fetch_data()
    shared_data.append(data)
    ready_event.set()   # signal to all waiting threads

def consumer():
    ready_event.wait(timeout=5)   # block until set or timeout
    if ready_event.is_set():
        process(shared_data)

threading.Thread(target=producer).start()
threading.Thread(target=consumer).start()
```

---

## 7. `threading.Semaphore` — Limiting Concurrency

```python
# Allow at most 5 concurrent database connections
db_semaphore = threading.Semaphore(5)

def query_db(query):
    with db_semaphore:    # blocks if 5 threads already inside
        return execute(query)

# BoundedSemaphore raises ValueError if released more than acquired
rate_limiter = threading.BoundedSemaphore(10)
```

---

## 8. `threading.Condition` — Wait/Notify Pattern

```python
condition = threading.Condition()
buffer = []

def producer():
    for i in range(5):
        time.sleep(0.5)
        with condition:
            buffer.append(i)
            condition.notify_all()   # wake waiting consumers

def consumer():
    while True:
        with condition:
            condition.wait_for(lambda: len(buffer) > 0)
            item = buffer.pop(0)
        print(f"Consumed: {item}")

threading.Thread(target=producer).start()
threading.Thread(target=consumer).start()
```

---

## 9. `threading.local()` — Thread-Local Storage

Each thread gets its own independent copy of the value:

```python
local_storage = threading.local()

def request_handler(request_id):
    local_storage.request_id = request_id   # stored per-thread
    process_request()

def process_request():
    print(f"Handling {local_storage.request_id}")  # reads THIS thread's value
```

---

## 10. Thread Pool with `ThreadPoolExecutor`

```python
from concurrent.futures import ThreadPoolExecutor, as_completed

urls = ["https://api.example.com/1", "https://api.example.com/2"]

def fetch(url):
    return requests.get(url).json()

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = {executor.submit(fetch, url): url for url in urls}
    for future in as_completed(futures):
        url = futures[future]
        try:
            data = future.result()
        except Exception as e:
            print(f"Error fetching {url}: {e}")
```
