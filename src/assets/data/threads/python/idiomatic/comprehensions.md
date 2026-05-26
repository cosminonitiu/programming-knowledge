## Comprehensions and Generator Expressions
---

Comprehensions are one of Python's most distinctive features — they express collection-building transformations in a single, readable expression. Generator expressions extend the idea to lazy evaluation.

---

## 1. List Comprehensions

```python
# Basic form: [expression for item in iterable if condition]
squares = [x**2 for x in range(10)]
# [0, 1, 4, 9, 16, 25, 36, 49, 64, 81]

evens = [x for x in range(20) if x % 2 == 0]
# [0, 2, 4, 6, 8, 10, 12, 14, 16, 18]

# Transform and filter at once
clean = [s.strip().lower() for s in raw_strings if s.strip()]

# Nested comprehension (avoid deep nesting — hurts readability)
matrix = [[1, 2, 3], [4, 5, 6], [7, 8, 9]]
flat = [num for row in matrix for num in row]
# [1, 2, 3, 4, 5, 6, 7, 8, 9]
```

---

## 2. Dict Comprehensions

```python
# {key_expr: value_expr for item in iterable}
word_lengths = {word: len(word) for word in ["hello", "world", "python"]}
# {"hello": 5, "world": 5, "python": 6}

# Invert a mapping
original = {"a": 1, "b": 2, "c": 3}
inverted = {v: k for k, v in original.items()}
# {1: "a", 2: "b", 3: "c"}

# Filter a dict
active_users = {uid: user for uid, user in users.items() if user["active"]}
```

---

## 3. Set Comprehensions

```python
unique_lengths = {len(word) for word in sentence.split()}
# {3, 5, 6, ...}
```

---

## 4. Generator Expressions

Generator expressions use `()` instead of `[]`. They produce values **lazily** — one at a time — never building the full list in memory:

```python
# List comprehension — builds entire list in memory
squares_list = [x**2 for x in range(10_000_000)]   # ~80 MB

# Generator expression — produces values on demand
squares_gen = (x**2 for x in range(10_000_000))    # ~200 bytes

# Consuming a generator
total = sum(x**2 for x in range(10_000_000))  # sum() accepts any iterable
first_10 = list(itertools.islice(squares_gen, 10))

# Generators are single-use — once exhausted, they're empty
gen = (x for x in range(3))
list(gen)  # [0, 1, 2]
list(gen)  # []  — already exhausted
```

---

## 5. Generator Functions with `yield`

A function that contains `yield` is a **generator function** — calling it returns a generator object without executing any code yet:

```python
def fibonacci():
    a, b = 0, 1
    while True:
        yield a          # suspends here, resumes on next()
        a, b = b, a + b

fib = fibonacci()        # no code runs yet
next(fib)                # 0
next(fib)                # 1
next(fib)                # 1
next(fib)                # 2

# Take first 10 Fibonacci numbers
import itertools
list(itertools.islice(fibonacci(), 10))
# [0, 1, 1, 2, 3, 5, 8, 13, 21, 34]
```

---

## 6. `yield from` — Delegating to Sub-generators

```python
def chain(*iterables):
    for it in iterables:
        yield from it    # delegates to sub-iterator

list(chain([1, 2], [3, 4], [5]))  # [1, 2, 3, 4, 5]
```

---

## 7. Performance Comparison

```python
import sys

# 1 million elements
nums = range(1_000_000)

list_comp = [x * 2 for x in nums]
gen_exp   = (x * 2 for x in nums)

sys.getsizeof(list_comp)  # ~8 MB
sys.getsizeof(gen_exp)    # ~208 bytes

# When you need all results: list comp is fine
# When you're pipelining / streaming: use generators
```

---

## 8. Practical Pipeline with Generators

```python
def read_lines(filename):
    with open(filename) as f:
        yield from f

def parse(lines):
    for line in lines:
        if not line.startswith("#"):
            yield line.strip()

def filter_empty(lines):
    return (line for line in lines if line)

def process(lines):
    for line in lines:
        yield line.upper()

# Pipeline — each stage processes lazily, one line at a time
pipeline = process(filter_empty(parse(read_lines("data.txt"))))
for result in pipeline:
    print(result)
```

No intermediate lists are created. Memory usage is O(1) regardless of file size.

---

## 9. When NOT to Use Comprehensions

- When the logic is complex enough to need multiple statements — use a regular `for` loop.
- When you need `break` or `continue` — you cannot use them inside a comprehension.
- When readability suffers from deeply nested comprehensions.

```python
# Hard to read
result = [[cell.value for cell in row if cell.value] for row in sheet if any(row)]

# Better as a loop
result = []
for row in sheet:
    if any(row):
        result.append([cell.value for cell in row if cell.value])
```
