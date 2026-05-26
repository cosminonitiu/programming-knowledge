## Async Patterns and Best Practices
---

Writing correct async code requires understanding how to compose coroutines, handle errors, manage backpressure and avoid common pitfalls that can block or starve the event loop.

---

## 1. Async HTTP with `httpx`

```python
import httpx
import asyncio

async def fetch_all(urls: list[str]) -> list[dict]:
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [client.get(url) for url in urls]
        responses = await asyncio.gather(*tasks, return_exceptions=True)

    results = []
    for url, response in zip(urls, responses):
        if isinstance(response, Exception):
            print(f"Failed to fetch {url}: {response}")
        else:
            results.append(response.json())
    return results
```

---

## 2. Retry with Exponential Backoff

```python
import asyncio
from functools import wraps

def async_retry(max_attempts: int = 3, base_delay: float = 1.0):
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return await func(*args, **kwargs)
                except Exception as e:
                    if attempt == max_attempts:
                        raise
                    delay = base_delay * (2 ** (attempt - 1))
                    print(f"Attempt {attempt} failed: {e}. Retrying in {delay}s")
                    await asyncio.sleep(delay)
        return wrapper
    return decorator

@async_retry(max_attempts=3)
async def fetch_user(user_id: int):
    async with httpx.AsyncClient() as client:
        response = await client.get(f"https://api.example.com/users/{user_id}")
        response.raise_for_status()
        return response.json()
```

---

## 3. Rate Limiting with Semaphore

```python
async def bounded_fetch(semaphore: asyncio.Semaphore, client, url: str):
    async with semaphore:   # limits concurrent requests
        response = await client.get(url)
        return response.json()

async def fetch_all_bounded(urls: list[str], max_concurrent: int = 10):
    semaphore = asyncio.Semaphore(max_concurrent)
    async with httpx.AsyncClient() as client:
        tasks = [bounded_fetch(semaphore, client, url) for url in urls]
        return await asyncio.gather(*tasks)
```

---

## 4. Async Generator Streaming

```python
async def stream_events(url: str):
    """Stream Server-Sent Events or large responses line by line."""
    async with httpx.AsyncClient() as client:
        async with client.stream("GET", url) as response:
            async for line in response.aiter_lines():
                if line.startswith("data:"):
                    yield line[5:].strip()

async def process_stream():
    async for event in stream_events("https://api.example.com/events"):
        print(f"Event: {event}")
```

---

## 5. Background Tasks Pattern

```python
import asyncio
from collections import deque

class BackgroundTaskManager:
    def __init__(self):
        self._tasks: set[asyncio.Task] = set()

    def schedule(self, coro):
        task = asyncio.create_task(coro)
        self._tasks.add(task)
        task.add_done_callback(self._tasks.discard)
        return task

    async def wait_all(self):
        if self._tasks:
            await asyncio.gather(*self._tasks, return_exceptions=True)

manager = BackgroundTaskManager()

async def handle_request(data):
    result = process(data)
    manager.schedule(send_notification(result))  # fire and forget
    return result
```

---

## 6. Async Context Manager for Database Sessions

```python
from contextlib import asynccontextmanager
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine, async_sessionmaker

engine = create_async_engine("postgresql+asyncpg://user:pass@localhost/db")
SessionLocal = async_sessionmaker(engine, expire_on_commit=False)

@asynccontextmanager
async def get_session():
    async with SessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise

async def get_user(user_id: int):
    async with get_session() as session:
        result = await session.get(User, user_id)
        return result
```

---

## 7. Avoiding Event Loop Blocking

```python
import asyncio
import time

# BAD: blocks the event loop — no other coroutines can run
async def bad_handler():
    time.sleep(2)          # DO NOT use blocking sleep
    result = open("huge_file.txt").read()  # synchronous file I/O in async

# GOOD: non-blocking alternatives
async def good_handler():
    await asyncio.sleep(2)  # yields control to event loop

    # Async file I/O with aiofiles
    import aiofiles
    async with aiofiles.open("huge_file.txt") as f:
        result = await f.read()

    # Run sync code in thread pool
    loop = asyncio.get_running_loop()
    result = await loop.run_in_executor(None, sync_operation)
```

---

## 8. Testing Async Code

```python
import pytest
import asyncio

# pytest-asyncio
@pytest.mark.asyncio
async def test_fetch_user():
    user = await fetch_user(1)
    assert user["id"] == 1

# Using httpx.AsyncClient as mock transport
@pytest.mark.asyncio
async def test_with_mock():
    transport = httpx.MockTransport(handler)
    async with httpx.AsyncClient(transport=transport) as client:
        response = await client.get("/users/1")
    assert response.status_code == 200
```

---

## 9. Structured Concurrency Best Practices

- **Prefer `TaskGroup` over `gather()`** — structured concurrency with automatic cleanup.
- **Always `await` tasks** — unfinished tasks cause resource leaks.
- **Set names on tasks** — `task.set_name("user_sync")` for easier debugging.
- **Use `asyncio.run()`** for the entry point — manages the event loop lifecycle.
- **Don't mix threads and async** without `run_in_executor` as the bridge.
- **Cancel tasks gracefully** — catch `CancelledError` and do cleanup, then re-raise.
