## Iterators and the Iteration Protocol
---

Python's iteration protocol is what makes `for` loops, comprehensions, `sum()`, `zip()`, `map()` and countless other constructs work uniformly on any collection or data stream. Understanding it unlocks lazy, memory-efficient code patterns.

---

## 1. The Two-Object Protocol

An **iterable** is any object that implements `__iter__()`, which returns an **iterator**.  
An **iterator** is any object that implements both `__iter__()` (returning itself) and `__next__()` (returning the next value or raising `StopIteration`).

```python
# All of these are iterables:
for x in [1, 2, 3]: ...     # list
for x in "hello": ...       # string
for x in range(10): ...     # range
for x in {1, 2, 3}: ...     # set
for x in {"a": 1}: ...      # dict (iterates keys)
for x in open("file.txt"): ...  # file (iterates lines)
```

---

## 2. How `for` Works Internally

```python
# Python translates this for loop:
for item in iterable:
    process(item)

# Into this equivalent:
iterator = iter(iterable)   # calls iterable.__iter__()
while True:
    try:
        item = next(iterator)   # calls iterator.__next__()
        process(item)
    except StopIteration:
        break
```

---

## 3. Building a Custom Iterator

```python
class CountDown:
    def __init__(self, start: int):
        self.current = start

    def __iter__(self):
        return self      # the iterator IS the iterable here

    def __next__(self):
        if self.current <= 0:
            raise StopIteration
        value = self.current
        self.current -= 1
        return value

for n in CountDown(3):
    print(n)   # 3, 2, 1

# Manual protocol
cd = CountDown(2)
next(cd)   # 2
next(cd)   # 1
next(cd)   # StopIteration
```

---

## 4. Separating Iterable from Iterator

A good design makes the iterable reusable (multiple independent iterations) while the iterator is consumed once:

```python
class NumberRange:
    """Iterable — can be iterated multiple times."""
    def __init__(self, start, stop):
        self.start = start
        self.stop = stop

    def __iter__(self):
        return NumberRangeIterator(self.start, self.stop)

class NumberRangeIterator:
    """Iterator — consumed in one pass."""
    def __init__(self, start, stop):
        self.current = start
        self.stop = stop

    def __iter__(self):
        return self

    def __next__(self):
        if self.current >= self.stop:
            raise StopIteration
        value = self.current
        self.current += 1
        return value

r = NumberRange(0, 5)
list(r)   # [0, 1, 2, 3, 4]
list(r)   # [0, 1, 2, 3, 4]  — reusable!
```

---

## 5. Generator Functions as Iterators

Generator functions are the idiomatic way to create custom iterators:

```python
def count_down(start: int):
    while start > 0:
        yield start
        start -= 1

for n in count_down(5):
    print(n)

# Generator is both iterable and iterator
gen = count_down(3)
iter(gen) is gen   # True
```

---

## 6. `itertools` — The Iterator Toolbox

```python
import itertools as it

# Infinite iterators
it.count(10)            # 10, 11, 12, ...
it.cycle("ABC")         # A, B, C, A, B, C, ...
it.repeat(42, 3)        # 42, 42, 42

# Finite iterators
it.chain([1,2], [3,4])            # 1, 2, 3, 4
it.chain.from_iterable([[1,2],[3]])# same, from nested iterable
it.islice(gen, 5)                 # first 5 items
it.takewhile(lambda x: x<5, nums) # take while predicate is True
it.dropwhile(lambda x: x<5, nums) # drop while predicate is True
it.filterfalse(pred, iterable)    # complement of filter()
it.compress("ABCDE", [1,0,1,0,1]) # A, C, E
it.starmap(pow, [(2,3),(3,2)])     # 8, 9
it.accumulate([1,2,3,4], func=operator.add)  # 1,3,6,10

# Combinatoric iterators
it.product("AB", repeat=2)          # AA AB BA BB
it.permutations("ABC", 2)           # AB AC BA BC CA CB
it.combinations("ABCD", 2)          # AB AC AD BC BD CD
it.combinations_with_replacement("AB", 2)  # AA AB BB

# Grouping (requires sorted input)
for key, group in it.groupby(sorted_data, key=lambda x: x["dept"]):
    print(key, list(group))
```

---

## 7. `zip()`, `enumerate()` and `map()`

```python
# zip — iterate multiple iterables in parallel (stops at shortest)
names = ["Alice", "Bob", "Charlie"]
scores = [95, 87, 91]
for name, score in zip(names, scores):
    print(f"{name}: {score}")

# zip_longest — pad shorter with fill value
from itertools import zip_longest
list(zip_longest([1,2], [3,4,5], fillvalue=0))  # [(1,3),(2,4),(0,5)]

# enumerate — add index to any iterable
for i, value in enumerate(["a", "b", "c"], start=1):
    print(i, value)  # 1 a, 2 b, 3 c

# map — apply a function lazily
doubled = list(map(lambda x: x*2, [1,2,3]))  # [2, 4, 6]
```

---

## 8. Lazy Pipelines with Generators

```python
# Infinite sequence of log lines from a file
def tail(f):
    """Follow a file like `tail -f`."""
    f.seek(0, 2)  # seek to end
    while True:
        line = f.readline()
        if line:
            yield line

# Process lazily — no list of all lines in memory
with open("/var/log/app.log") as f:
    error_lines = (line for line in tail(f) if "ERROR" in line)
    for line in error_lines:
        alert(line)
```
