## Functional Programming Tools
---

Python is not a purely functional language, but it supports functional patterns well through `functools`, `operator`, `itertools` and first-class functions. These tools enable expressive, composable code without side effects.

---

## 1. `map()`, `filter()` and `zip()`

All return lazy iterators:

```python
# map — apply a function to every item
numbers = [1, 2, 3, 4, 5]
doubled = list(map(lambda x: x * 2, numbers))   # [2, 4, 6, 8, 10]

# Prefer list comprehension for readability:
doubled = [x * 2 for x in numbers]

# filter — keep items where predicate is True
evens = list(filter(lambda x: x % 2 == 0, numbers))

# zip — pair items from multiple iterables
names = ["Alice", "Bob"]
scores = [95, 87]
pairs = list(zip(names, scores))   # [("Alice", 95), ("Bob", 87)]
```

---

## 2. `functools.reduce()`

```python
from functools import reduce
import operator

product = reduce(operator.mul, [1, 2, 3, 4, 5])   # 120
# equivalent to: 1 * 2 * 3 * 4 * 5

total = reduce(lambda acc, x: acc + x, [1, 2, 3], 0)  # 6
# third argument is the initial value
```

> Prefer `sum()`, `max()`, `min()` or `any()`/`all()` over `reduce()` where possible.

---

## 3. `functools.partial()` — Partial Application

Freeze some arguments of a function to create a new function with fewer parameters:

```python
from functools import partial

def power(base, exponent):
    return base ** exponent

square = partial(power, exponent=2)
cube   = partial(power, exponent=3)

square(5)   # 25
cube(3)     # 27

# Practical use: pre-configure a function for a specific context
import json
from functools import partial

compact_json = partial(json.dumps, separators=(",", ":"))
pretty_json  = partial(json.dumps, indent=2, sort_keys=True)

compact_json({"a": 1})   # '{"a":1}'
pretty_json({"b": 2})    # formatted with indent
```

---

## 4. `operator` Module — Functions for Operators

Provides function equivalents of built-in operators, useful with `map`, `reduce`, `sorted` etc.:

```python
import operator

operator.add(1, 2)         # 3
operator.mul(3, 4)         # 12
operator.lt(1, 2)          # True
operator.attrgetter("name")  # like lambda x: x.name
operator.itemgetter(1)       # like lambda x: x[1]

# Sort by attribute
from operator import attrgetter, itemgetter

users.sort(key=attrgetter("last_name"))
records.sort(key=itemgetter("score"), reverse=True)

# Multi-level sort
students.sort(key=attrgetter("grade", "name"))
```

---

## 5. `functools.lru_cache` and `functools.cache`

```python
from functools import lru_cache, cache

@lru_cache(maxsize=256)
def expensive_lookup(key: str) -> dict:
    return database.fetch(key)

@cache   # unbounded cache (Python 3.9+)
def factorial(n: int) -> int:
    return n * factorial(n-1) if n else 1

# Cache management
expensive_lookup.cache_info()    # hits, misses, currsize
expensive_lookup.cache_clear()   # invalidate
```

---

## 6. `functools.wraps` and `functools.update_wrapper`

```python
from functools import wraps, update_wrapper

def my_decorator(func):
    @wraps(func)
    def wrapper(*args, **kwargs):
        return func(*args, **kwargs)
    return wrapper
```

---

## 7. Higher-Order Functions

Functions that take or return other functions:

```python
from typing import Callable, TypeVar

T = TypeVar("T")

def compose(*funcs: Callable) -> Callable:
    """Create a pipeline: compose(f, g, h)(x) == h(g(f(x)))"""
    from functools import reduce
    return reduce(lambda f, g: lambda x: g(f(x)), funcs)

clean = compose(str.strip, str.lower, lambda s: s.replace(" ", "_"))
clean("  Hello World  ")   # "hello_world"

def memoize(func: Callable) -> Callable:
    cache = {}
    @wraps(func)
    def wrapper(*args):
        if args not in cache:
            cache[args] = func(*args)
        return cache[args]
    return wrapper
```

---

## 8. `all()`, `any()`, `sum()`, `min()`, `max()`

These are the idiomatic functional reductions in Python:

```python
data = [3, 1, 4, 1, 5, 9, 2, 6]

sum(data)                      # 31
max(data)                      # 9
min(data)                      # 1

# With a key
max(users, key=lambda u: u.age)
min(records, key=itemgetter("score"))

# any / all — short-circuit evaluation
any(x > 5 for x in data)    # True — stops at first True
all(x > 0 for x in data)    # True — checks all
any(user.is_admin for user in users)
```

---

## 9. Immutability Patterns

Python doesn't enforce immutability but these patterns help:

```python
from typing import NamedTuple
from dataclasses import dataclass

# Immutable record
class Point(NamedTuple):
    x: float
    y: float

# "Update" by creating a new instance
p1 = Point(1, 2)
p2 = p1._replace(x=5)   # new Point(5, 2)

# Frozen dataclass
@dataclass(frozen=True)
class Config:
    host: str
    port: int = 5432

c1 = Config("localhost")
c2 = Config("localhost", port=5433)  # new instance
```
