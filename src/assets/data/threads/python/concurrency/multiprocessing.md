## Multiprocessing Module
---

The `multiprocessing` module spawns separate OS processes, each with its own Python interpreter and memory space. Because processes don't share the GIL, they achieve true parallelism on multi-core systems — ideal for CPU-bound work.

---

## 1. Basic Process Creation

```python
from multiprocessing import Process
import os

def worker(name: str):
    print(f"Worker {name}, PID: {os.getpid()}")

if __name__ == "__main__":   # REQUIRED guard on Windows/macOS (spawn method)
    p1 = Process(target=worker, args=("A",))
    p2 = Process(target=worker, args=("B",))
    p1.start()
    p2.start()
    p1.join()
    p2.join()
```

> The `if __name__ == "__main__":` guard is mandatory on platforms that use the `spawn` start method (Windows, macOS default) to prevent recursive process spawning.

---

## 2. Process Pools — `Pool`

```python
from multiprocessing import Pool

def square(n: int) -> int:
    return n ** 2

if __name__ == "__main__":
    with Pool(processes=4) as pool:
        results = pool.map(square, range(10))   # [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

    # map_async — non-blocking
    with Pool(4) as pool:
        async_result = pool.map_async(square, range(10))
        print("Doing other work...")
        results = async_result.get(timeout=10)

    # starmap — pass multiple arguments
    with Pool(4) as pool:
        results = pool.starmap(pow, [(2, 3), (3, 2), (4, 2)])  # [8, 9, 16]
```

---

## 3. Inter-Process Communication

Processes cannot share memory directly (each has its own address space). Use `Queue` or `Pipe` to pass data:

```python
from multiprocessing import Process, Queue

def producer(q: Queue):
    for i in range(5):
        q.put(i)
    q.put(None)   # sentinel

def consumer(q: Queue):
    while True:
        item = q.get()
        if item is None:
            break
        print(f"Processing: {item}")

if __name__ == "__main__":
    q = Queue()
    p1 = Process(target=producer, args=(q,))
    p2 = Process(target=consumer, args=(q,))
    p1.start(); p2.start()
    p1.join(); p2.join()
```

---

## 4. `Pipe` — Two-Way Communication

```python
from multiprocessing import Pipe, Process

def child(conn):
    conn.send("hello from child")
    response = conn.recv()
    print(f"Child received: {response}")
    conn.close()

if __name__ == "__main__":
    parent_conn, child_conn = Pipe()
    p = Process(target=child, args=(child_conn,))
    p.start()
    print(f"Parent received: {parent_conn.recv()}")
    parent_conn.send("hello from parent")
    p.join()
```

---

## 5. Shared Memory — `Value` and `Array`

For simple numeric sharing without serialisation overhead:

```python
from multiprocessing import Process, Value, Array

def increment(val, lock):
    for _ in range(1000):
        with lock:
            val.value += 1

if __name__ == "__main__":
    from multiprocessing import Lock
    counter = Value("i", 0)    # "i" = C int
    lock = Lock()
    processes = [Process(target=increment, args=(counter, lock)) for _ in range(4)]
    for p in processes: p.start()
    for p in processes: p.join()
    print(counter.value)   # 4000
```

---

## 6. `multiprocessing.shared_memory` (Python 3.8+)

Share arbitrary binary data between processes without copying:

```python
from multiprocessing import shared_memory
import numpy as np

# Create
shm = shared_memory.SharedMemory(create=True, size=1024 * 1024 * 10)
array = np.ndarray((1000, 1000), dtype=np.float64, buffer=shm.buf)
array[:] = 0.0

# In another process (pass shm.name)
existing_shm = shared_memory.SharedMemory(name=shm.name)
view = np.ndarray((1000, 1000), dtype=np.float64, buffer=existing_shm.buf)

# Cleanup
shm.close()
shm.unlink()
```

---

## 7. Process Start Methods

| Method | Description | Default On |
|--------|-------------|-----------|
| `fork` | Copy parent process (fast, but copies file descriptors) | Linux |
| `spawn` | Start fresh interpreter (safe, slower) | Windows, macOS |
| `forkserver` | Fork from a clean server process | Some Linux configs |

```python
import multiprocessing as mp
mp.set_start_method("spawn")   # call once in __main__
```

---

## 8. `ProcessPoolExecutor` — Higher-Level API

```python
from concurrent.futures import ProcessPoolExecutor, as_completed

def process_chunk(chunk: list[int]) -> int:
    return sum(x**2 for x in chunk)

data = list(range(1_000_000))
chunks = [data[i:i+10000] for i in range(0, len(data), 10000)]

if __name__ == "__main__":
    with ProcessPoolExecutor(max_workers=4) as executor:
        futures = [executor.submit(process_chunk, chunk) for chunk in chunks]
        total = sum(f.result() for f in as_completed(futures))
```

---

## 9. When to Use Multiprocessing

**Use `multiprocessing` when:**
- CPU-bound work: image/video processing, cryptography, compression, numerical computation.
- You need true parallelism on multi-core hardware.
- Each task is coarse-grained enough that inter-process communication overhead is acceptable.

**Do NOT use when:**
- Tasks are fine-grained (communication overhead dominates).
- You need shared mutable state (use `threading` + locks or `asyncio`).
- The I/O bottleneck dominates (use `asyncio` or `threading`).
