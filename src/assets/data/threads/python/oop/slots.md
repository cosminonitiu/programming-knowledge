## `__slots__` and Memory Optimisation
---

By default every Python instance carries a `__dict__` — a hash table for its attributes. For classes with many instances or tight memory budgets, `__slots__` replaces the per-instance dict with a compact C-level descriptor array.

---

## 1. The Problem: Per-Instance `__dict__`

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

import sys
p = Point(1, 2)
sys.getsizeof(p)         # ~48 bytes (CPython 3.12)
sys.getsizeof(p.__dict__) # ~232 bytes — the hidden overhead
```

For millions of `Point` objects, the `__dict__` dominates memory.

---

## 2. Declaring `__slots__`

```python
class SlottedPoint:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

sp = SlottedPoint(1, 2)
sys.getsizeof(sp)   # ~56 bytes — no __dict__

# Attempting to add an undeclared attribute raises AttributeError
sp.z = 3  # AttributeError: 'SlottedPoint' object has no attribute 'z'
```

---

## 3. Memory Benchmark

```python
import tracemalloc

def measure(cls, n=1_000_000):
    tracemalloc.start()
    objects = [cls(i, i) for i in range(n)]
    current, peak = tracemalloc.get_traced_memory()
    tracemalloc.stop()
    return peak / 1024 / 1024  # MiB

print(f"With __dict__:   {measure(Point):.1f} MiB")
print(f"With __slots__:  {measure(SlottedPoint):.1f} MiB")
# Typical results: ~350 MiB vs ~72 MiB — ~5x reduction
```

---

## 4. `__slots__` with Inheritance

Each class in the hierarchy must declare its own `__slots__`. If any parent lacks `__slots__`, the subclass gets a `__dict__` anyway:

```python
class Base:
    __slots__ = ("id",)

class Child(Base):
    __slots__ = ("name", "value")  # must declare own slots; Base.id is inherited

class Broken(Base):
    pass  # no __slots__ → __dict__ is re-introduced

c = Child()
c.id = 1
c.name = "foo"
# c.extra = "bar"  # AttributeError
```

---

## 5. `__slots__` with Default Values

Slots are descriptors — they cannot have default values set directly:

```python
class Config:
    __slots__ = ("host", "port")

    def __init__(self, host: str = "localhost", port: int = 5432):
        self.host = host
        self.port = port
```

For default values on descriptors, use `__init__` or a class-level property.

---

## 6. `__slots__` with `@dataclass`

Python 3.10+ supports `@dataclass(slots=True)`:

```python
from dataclasses import dataclass

@dataclass(slots=True)
class Vector:
    x: float
    y: float
    z: float = 0.0
```

This is the recommended way — no need to manually declare `__slots__` alongside field annotations.

---

## 7. When to Use `__slots__`

Use `__slots__` when:
- You are instantiating **millions** of objects (e.g., events, records, geometry points).
- You want to **prevent accidental attribute creation** (tight contracts).
- You need **faster attribute access** (benchmark — improvement is usually small).

Do **not** use `__slots__` when:
- You need per-instance `__dict__` (e.g., dynamic attribute assignment, `vars()`).
- You need pickling with protocols < 2 (requires care).
- The class will be mixed with others that don't use `__slots__`.

---

## 8. `__slots__` and Pickling / Copy

Slotted classes are picklable but require `__getstate__` / `__setstate__` if you want to control pickle format:

```python
class Slotted:
    __slots__ = ("x", "y")

    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __getstate__(self):
        return {"x": self.x, "y": self.y}

    def __setstate__(self, state):
        self.x = state["x"]
        self.y = state["y"]

import pickle
s = Slotted(1, 2)
s2 = pickle.loads(pickle.dumps(s))
```
