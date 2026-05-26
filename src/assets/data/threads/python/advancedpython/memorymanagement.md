## Memory Management
---

Python manages memory through reference counting combined with a cyclic garbage collector. Understanding this system helps you write code that avoids memory leaks and unnecessary allocations.

---

## 1. Reference Counting

Every Python object has a reference count. When the count drops to zero, the object's memory is freed immediately:

```python
import sys

a = [1, 2, 3]
sys.getrefcount(a)   # 2 (local variable + argument to getrefcount)

b = a                # count → 3
del b                # count → 2
a = None             # count → 0 → freed immediately
```

**Why `getrefcount` returns N+1:** the temporary reference created by passing the object as an argument.

---

## 2. The Cyclic Garbage Collector

Reference counting cannot free objects that form cycles:

```python
import gc

# Cycle: neither node can reach zero refcount
a = {}
b = {"other": a}
a["other"] = b

del a, b
# Both objects still alive! Reference count is 1 each due to the cycle.

gc.collect()   # Explicitly run cyclic GC — frees the cycle
gc.get_count() # (gen0, gen1, gen2) thresholds
gc.get_threshold()  # default (700, 10, 10)
```

The GC uses a generational strategy: objects that survive collection are promoted to an older, less-frequently-scanned generation.

---

## 3. Memory Profiling

```python
# tracemalloc — built-in memory tracing
import tracemalloc

tracemalloc.start()

# ... code to profile ...
result = [i**2 for i in range(100_000)]

snapshot = tracemalloc.take_snapshot()
top_stats = snapshot.statistics("lineno")
for stat in top_stats[:5]:
    print(stat)   # shows file/line and allocated memory

# memory_profiler (pip install memory-profiler)
from memory_profiler import memory_usage

def my_func():
    return [i for i in range(1_000_000)]

mem = memory_usage((my_func,), interval=0.1)
print(f"Peak: {max(mem):.2f} MB")
```

---

## 4. Object Sizes

```python
import sys

sys.getsizeof(42)       # 28 bytes (int)
sys.getsizeof(3.14)     # 24 bytes (float)
sys.getsizeof("")       # 49 bytes (empty str)
sys.getsizeof("hello")  # 54 bytes (49 + 5 bytes for 5 chars ASCII)
sys.getsizeof([])       # 56 bytes (empty list)
sys.getsizeof([1,2,3])  # 88 bytes (list + 3 pointers)

# Note: getsizeof only measures the container, not nested objects
# For deep size measurement:
def deep_size(obj, seen=None):
    size = sys.getsizeof(obj)
    if seen is None: seen = set()
    obj_id = id(obj)
    if obj_id in seen: return 0
    seen.add(obj_id)
    if hasattr(obj, '__dict__'):
        size += deep_size(obj.__dict__, seen)
    if hasattr(obj, '__iter__') and not isinstance(obj, (str, bytes)):
        size += sum(deep_size(i, seen) for i in obj)
    return size
```

---

## 5. Memory-Efficient Patterns

```python
# 1. Generators vs lists — generators are lazy, use O(1) memory
total = sum(x**2 for x in range(1_000_000))   # never materialises the list

# 2. __slots__ — eliminates per-instance __dict__
class Point:
    __slots__ = ("x", "y")
    def __init__(self, x, y): self.x = x; self.y = y

import sys
class PointDict:
    def __init__(self, x, y): self.x = x; self.y = y

p1 = Point(1, 2)
p2 = PointDict(1, 2)
sys.getsizeof(p1)              # ~56 bytes
sys.getsizeof(p2.__dict__)     # ~232 bytes

# 3. array module — typed homogeneous arrays
import array
arr = array.array("d", range(1_000_000))   # much smaller than list of floats

# 4. numpy arrays — efficient numerical storage
import numpy as np
np_arr = np.arange(1_000_000, dtype=np.float64)   # 8 MB vs ~35 MB for list
```

---

## 6. `weakref` — References Without Ownership

A weak reference doesn't increment the reference count, so it doesn't prevent garbage collection:

```python
import weakref

class Cache:
    def __init__(self):
        self._cache: dict[int, weakref.ref] = {}

    def add(self, key: int, value):
        self._cache[key] = weakref.ref(value)

    def get(self, key: int):
        ref = self._cache.get(key)
        if ref is not None:
            return ref()   # call the weakref to get the object (or None if GC'd)
        return None

# WeakValueDictionary — auto-removes entries when values are GC'd
cache = weakref.WeakValueDictionary()
obj = SomeObject()
cache[1] = obj
del obj
cache[1]   # raises KeyError — object was garbage collected
```

---

## 7. The `__del__` Method

`__del__` is called when an object is about to be garbage collected. Avoid relying on it for critical cleanup:

```python
class Resource:
    def __del__(self):
        # Called when refcount → 0, but timing is NOT guaranteed
        # Especially unreliable with cyclic GC or interpreter shutdown
        print("Resource cleaned up")

# PREFER context managers for guaranteed cleanup
class BetterResource:
    def __enter__(self):
        self._open()
        return self

    def __exit__(self, *args):
        self._close()   # always runs

with BetterResource() as r:
    ...
```

---

## 8. Key Takeaways

- Python uses **reference counting** for immediate deallocation + **cyclic GC** for cycle detection.
- Use `tracemalloc` or `memory_profiler` to find memory hotspots.
- Use **generators** instead of lists when you don't need random access.
- Use **`__slots__`** to reduce per-instance memory for large numbers of small objects.
- Use **`weakref`** for caches that shouldn't prevent object collection.
- Use **context managers** instead of `__del__` for deterministic cleanup.
