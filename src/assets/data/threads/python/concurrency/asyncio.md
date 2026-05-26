## asyncio and the Event Loop
---

`asyncio` implements cooperative multitasking via coroutines and a single-threaded event loop. It excels at I/O-bound workloads with high concurrency (thousands of simultaneous connections) using far fewer resources than a thread-per-request model.

---

## 1. Core Concepts

| Concept | Description |
|---------|-------------|
| **Coroutine** | A function defined with `async def`. Calling it returns a coroutine object, not the result. |
| **Awaitable** | Something you can `await`: coroutines, `Task`, `Future`. |
| **Event Loop** | Runs coroutines. Switches between them when they `await`. |
| **Task** | Wraps a coroutine and schedules it on the event loop. |
| **Future** | A low-level object representing a result that isn't ready yet. |

---

## 2. The Basics

```python
import asyncio

async def greet(name: str) -> str:
    await asyncio.sleep(1)   # suspends here, gives control back to event loop
    return f"Hello, {name}!"

# Entry point
async def main():
    result = await greet("Alice")
    print(result)

asyncio.run(main())   # runs main(), handles loop lifecycle
```

---

## 3. Running Tasks Concurrently with `asyncio.gather()`

```python
import asyncio
import httpx

async def fetch(client: httpx.AsyncClient, url: str) -> dict:
    response = await client.get(url)
    return response.json()

async def main():
    urls = [
        "https://api.example.com/users",
        "https://api.example.com/products",
        "https://api.example.com/orders",
    ]
    async with httpx.AsyncClient() as client:
        results = await asyncio.gather(*[fetch(client, url) for url in urls])
    return results

# gather() runs all coroutines concurrently and waits for all to complete
```

---

## 4. Creating Tasks

```python
async def background_task(name: str):
    while True:
        print(f"Task {name} working...")
        await asyncio.sleep(1)

async def main():
    # Create a task — scheduled immediately, runs alongside main
    task = asyncio.create_task(background_task("heartbeat"))
    task.set_name("heartbeat")

    await asyncio.sleep(5)       # do other work
    task.cancel()                # request cancellation
    try:
        await task               # wait for cancellation to complete
    except asyncio.CancelledError:
        print("Task was cancelled")
```

---

## 5. `asyncio.TaskGroup` — Structured Concurrency (Python 3.11+)

`TaskGroup` ensures all tasks are cancelled if any of them raises an exception:

```python
async def main():
    async with asyncio.TaskGroup() as tg:
        task1 = tg.create_task(fetch_users())
        task2 = tg.create_task(fetch_products())
        task3 = tg.create_task(fetch_orders())
    # All tasks guaranteed complete (or all cancelled if one failed)
    print(task1.result(), task2.result(), task3.result())
```

---

## 6. Timeout

```python
async def slow_operation():
    await asyncio.sleep(10)

async def main():
    try:
        result = await asyncio.wait_for(slow_operation(), timeout=3.0)
    except asyncio.TimeoutError:
        print("Operation timed out")

    # Python 3.11+ — asyncio.timeout context manager
    async with asyncio.timeout(3.0):
        result = await slow_operation()
```

---

## 7. Async Context Managers and Iterators

```python
# Async context manager
class AsyncDB:
    async def __aenter__(self):
        self.conn = await create_connection()
        return self.conn

    async def __aexit__(self, *args):
        await self.conn.close()

async with AsyncDB() as conn:
    result = await conn.execute("SELECT * FROM users")

# Async iterator
class AsyncCounter:
    def __init__(self, limit):
        self.current = 0
        self.limit = limit

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.current >= self.limit:
            raise StopAsyncIteration
        self.current += 1
        await asyncio.sleep(0.1)
        return self.current

async for num in AsyncCounter(5):
    print(num)
```

---

## 8. `asyncio.Queue` — Producer/Consumer Pattern

```python
async def producer(queue: asyncio.Queue):
    for i in range(5):
        await asyncio.sleep(0.5)
        await queue.put(i)
        print(f"Produced: {i}")
    await queue.put(None)   # sentinel

async def consumer(queue: asyncio.Queue):
    while True:
        item = await queue.get()
        if item is None:
            break
        print(f"Consumed: {item}")
        queue.task_done()

async def main():
    queue = asyncio.Queue(maxsize=3)  # backpressure
    await asyncio.gather(producer(queue), consumer(queue))
```

---

## 9. Running Blocking Code in Executor

Never call blocking code (file I/O, CPU work, blocking libraries) directly in an async function — it blocks the entire event loop:

```python
import asyncio

def blocking_io():
    import time
    time.sleep(2)           # blocks entire loop!
    return "result"

async def main():
    loop = asyncio.get_running_loop()

    # Run in thread pool (for I/O-bound blocking)
    result = await loop.run_in_executor(None, blocking_io)

    # Run CPU-bound in process pool
    from concurrent.futures import ProcessPoolExecutor
    with ProcessPoolExecutor() as pool:
        result = await loop.run_in_executor(pool, cpu_bound_func, arg)
```

---

## 10. Common Pitfalls

```python
# WRONG: calling a coroutine without await
async def main():
    fetch_data()   # returns coroutine object, never executes!
    result = fetch_data()  # coroutine object, not a result

# CORRECT
async def main():
    result = await fetch_data()

# WRONG: mixing sync sleep with async code
async def bad():
    import time
    time.sleep(1)   # blocks entire event loop!

# CORRECT
async def good():
    await asyncio.sleep(1)
```
