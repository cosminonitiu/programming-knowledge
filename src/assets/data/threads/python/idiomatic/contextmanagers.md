## Context Managers
---

Context managers encapsulate setup and teardown logic. The `with` statement guarantees that `__exit__` is called even if an exception occurs, making them the idiomatic way to manage resources: files, database connections, locks, timers and more.

---

## 1. How `with` Works

```python
# Python translates this:
with expr as target:
    body

# Into this:
manager = expr
value = manager.__enter__()
target = value
try:
    body
except:
    if not manager.__exit__(*sys.exc_info()):
        raise
else:
    manager.__exit__(None, None, None)
```

---

## 2. Class-Based Context Manager

```python
class DatabaseConnection:
    def __init__(self, dsn: str):
        self.dsn = dsn
        self.conn = None

    def __enter__(self):
        self.conn = connect(self.dsn)
        return self.conn    # value bound to `as` target

    def __exit__(self, exc_type, exc_val, exc_tb):
        if exc_type:
            self.conn.rollback()
        else:
            self.conn.commit()
        self.conn.close()
        return False   # False = propagate any exception; True = suppress it

with DatabaseConnection("postgresql://localhost/mydb") as conn:
    conn.execute("INSERT INTO users VALUES (?)", ("Alice",))
```

---

## 3. `contextlib.contextmanager` — Generator-Based

`@contextmanager` turns a generator function into a context manager. The `yield` divides setup from teardown:

```python
from contextlib import contextmanager

@contextmanager
def timer(label: str):
    import time
    start = time.perf_counter()
    try:
        yield                            # body of the with block runs here
    finally:
        elapsed = time.perf_counter() - start
        print(f"{label}: {elapsed:.4f}s")

with timer("Database query"):
    results = db.execute("SELECT * FROM events")
```

```python
@contextmanager
def managed_transaction(conn):
    try:
        yield conn
        conn.commit()
    except Exception:
        conn.rollback()
        raise
```

---

## 4. Multiple Context Managers

```python
# Comma-separated — both are entered and exited correctly
with open("input.txt") as fin, open("output.txt", "w") as fout:
    fout.write(fin.read().upper())

# Python 3.10+ parenthesised form for better formatting
with (
    open("source.csv") as source,
    open("dest.parquet", "wb") as dest,
    timer("ETL job"),
):
    process(source, dest)
```

---

## 5. `contextlib.ExitStack` — Dynamic Context Managers

`ExitStack` manages a dynamic number of context managers — useful when you don't know at compile time how many resources you'll open:

```python
from contextlib import ExitStack

files = ["a.txt", "b.txt", "c.txt"]

with ExitStack() as stack:
    handles = [stack.enter_context(open(f)) for f in files]
    # all handles closed automatically, even if one raises

# Conditionally add a context manager
with ExitStack() as stack:
    if debug_mode:
        stack.enter_context(timer("Processing"))
    process_data()
```

---

## 6. `contextlib.suppress` — Swallow Specific Exceptions

```python
from contextlib import suppress

with suppress(FileNotFoundError):
    Path("optional_cache.pkl").unlink()

# Equivalent but more concise than:
try:
    Path("optional_cache.pkl").unlink()
except FileNotFoundError:
    pass
```

---

## 7. `contextlib.nullcontext` — Optional Context

```python
from contextlib import nullcontext

def process(data, lock=None):
    ctx = lock if lock is not None else nullcontext()
    with ctx:
        do_work(data)   # thread-safe if lock provided, otherwise no-op
```

---

## 8. Reentrant and Reusable Context Managers

- **Regular context manager:** single-use or non-reentrant (e.g., most file objects).
- **Reentrant:** can be used in nested `with` statements. `contextlib.RLock` is an example.
- **Reusable:** can be re-entered after exiting. Implement `__enter__`/`__exit__` on a class (rather than using `@contextmanager`) for reusability.

```python
from contextlib import contextmanager

# @contextmanager generators are NOT reusable — use a class instead
class Timer:
    def __enter__(self):
        import time
        self._start = time.perf_counter()
        return self

    def __exit__(self, *args):
        self.elapsed = time.perf_counter() - self._start

t = Timer()
with t:
    compute()
print(t.elapsed)

with t:   # reusable — start fresh
    another_compute()
```

---

## 9. Common Use Cases

| Use Case | Context Manager |
|----------|----------------|
| File operations | `open()` |
| Database connections | Custom or SQLAlchemy `Session` |
| Threading locks | `threading.Lock()` |
| Temporary directories | `tempfile.TemporaryDirectory()` |
| Mocking in tests | `unittest.mock.patch()` |
| Changing directories | Custom `cd` context manager |
| Timing code | Custom timer |
| Suppressing exceptions | `contextlib.suppress()` |
