## Decorators
---

A decorator is a callable that takes a function (or class) as input and returns a modified version of it. Decorators are syntactic sugar for wrapping: `@deco` above a `def` is exactly equivalent to `func = deco(func)`.

---

## 1. A Minimal Decorator

```python
def my_decorator(func):
    def wrapper(*args, **kwargs):
        print(f"Before {func.__name__}")
        result = func(*args, **kwargs)
        print(f"After {func.__name__}")
        return result
    return wrapper

@my_decorator
def greet(name):
    print(f"Hello, {name}!")

greet("Alice")
# Before greet
# Hello, Alice!
# After greet
```

---

## 2. Preserving Metadata with `functools.wraps`

Without `@wraps`, the wrapper hides the original function's `__name__`, `__doc__` and `__module__`:

```python
from functools import wraps

def log_calls(func):
    @wraps(func)    # copies __name__, __doc__, __module__, __annotations__ etc.
    def wrapper(*args, **kwargs):
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper

@log_calls
def add(a: int, b: int) -> int:
    """Add two integers."""
    return a + b

add.__name__   # "add"  — preserved
add.__doc__    # "Add two integers."  — preserved
```

---

## 3. Decorators with Arguments (Decorator Factories)

To pass arguments to a decorator, add an outer factory function:

```python
from functools import wraps

def retry(max_attempts: int = 3, exceptions: tuple = (Exception,)):
    """Retry a function up to max_attempts times on given exceptions."""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            for attempt in range(1, max_attempts + 1):
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    if attempt == max_attempts:
                        raise
                    print(f"Attempt {attempt} failed: {e}. Retrying...")
        return wrapper
    return decorator

@retry(max_attempts=3, exceptions=(ConnectionError, TimeoutError))
def fetch_data(url: str):
    ...
```

---

## 4. Timing Decorator

```python
import time
from functools import wraps

def timer(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        start = time.perf_counter()
        result = func(*args, **kwargs)
        elapsed = time.perf_counter() - start
        print(f"{func.__name__} took {elapsed:.4f}s")
        return result
    return wrapper

@timer
def slow_query():
    time.sleep(1)
    return "done"
```

---

## 5. Caching with `functools.lru_cache` / `cache`

```python
from functools import lru_cache, cache

@lru_cache(maxsize=128)
def fibonacci(n: int) -> int:
    if n < 2:
        return n
    return fibonacci(n-1) + fibonacci(n-2)

# cache() is lru_cache with unlimited size (Python 3.9+)
@cache
def factorial(n: int) -> int:
    return n * factorial(n-1) if n else 1

# Check cache info
fibonacci.cache_info()   # CacheInfo(hits=..., misses=..., maxsize=128, currsize=...)
fibonacci.cache_clear()  # invalidate cache
```

---

## 6. Class-based Decorators

A class with `__call__` can act as a decorator — useful when you need to maintain state:

```python
from functools import wraps

class CallCounter:
    def __init__(self, func):
        wraps(func)(self)
        self.func = func
        self.call_count = 0

    def __call__(self, *args, **kwargs):
        self.call_count += 1
        return self.func(*args, **kwargs)

@CallCounter
def greet(name):
    print(f"Hello, {name}")

greet("Alice")
greet("Bob")
greet.call_count   # 2
```

---

## 7. Stacking Decorators

Decorators are applied bottom-up:

```python
@timer
@log_calls
@retry(max_attempts=2)
def connect():
    ...

# Equivalent to:
connect = timer(log_calls(retry(max_attempts=2)(connect)))
```

---

## 8. Practical Patterns

```python
# Access control
def require_auth(func):
    @wraps(func)
    def wrapper(request, *args, **kwargs):
        if not request.user.is_authenticated:
            raise PermissionError("Authentication required")
        return func(request, *args, **kwargs)
    return wrapper

# Memoisation with custom key
def memoize(func):
    cache = {}
    @wraps(func)
    def wrapper(*args, **kwargs):
        key = (args, frozenset(kwargs.items()))
        if key not in cache:
            cache[key] = func(*args, **kwargs)
        return cache[key]
    return wrapper

# Deprecation warning
import warnings
def deprecated(message):
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            warnings.warn(
                f"{func.__name__} is deprecated: {message}",
                DeprecationWarning,
                stacklevel=2
            )
            return func(*args, **kwargs)
        return wrapper
    return decorator
```

---

## 9. Decorating Classes

Decorators also work on classes:

```python
def singleton(cls):
    instances = {}
    @wraps(cls)
    def get_instance(*args, **kwargs):
        if cls not in instances:
            instances[cls] = cls(*args, **kwargs)
        return instances[cls]
    return get_instance

@singleton
class DatabaseConnection:
    def __init__(self):
        self.connected = True
```
