## Profiling and Benchmarking
---

Profiling identifies where your code spends time (CPU profiling) and memory (memory profiling). Never optimise without profiling first — intuition about bottlenecks is often wrong.

---

## 1. `timeit` — Microbenchmarks

```python
import timeit

# One-liner
timeit.timeit("sum(range(1000))", number=10_000)   # total seconds for 10k runs

# Comparing approaches
setup = "data = list(range(1000))"
t1 = timeit.timeit("sum(data)", setup=setup, number=10_000)
t2 = timeit.timeit("total = 0\nfor x in data: total += x", setup=setup, number=10_000)
print(f"sum(): {t1:.4f}s")
print(f"loop: {t2:.4f}s")

# In Jupyter / interactive
%timeit sum(range(1000))
%timeit -n 10000 -r 5 sum(range(1000))
```

---

## 2. `cProfile` — Function-Level CPU Profiling

```python
import cProfile
import pstats

def main():
    # your program
    process_large_dataset()

# Method 1: run and print stats
cProfile.run("main()", sort="cumulative")

# Method 2: save to file for analysis
with cProfile.Profile() as pr:
    main()

stats = pstats.Stats(pr)
stats.sort_stats("cumulative")
stats.print_stats(20)          # top 20 functions
stats.print_callers("process") # who calls functions matching "process"
```

---

## 3. `snakeviz` — Visual Profile Browser

```bash
pip install snakeviz
python -m cProfile -o output.prof my_script.py
snakeviz output.prof   # opens interactive sunburst in browser
```

---

## 4. `line_profiler` — Line-Level Profiling

For pinpointing the exact line(s) that are slow within a function:

```bash
pip install line_profiler
```

```python
# Decorate the functions you want to profile
@profile   # added by kernprof at runtime
def process_items(items: list) -> list:
    result = []
    for item in items:
        parsed = parse(item)      # is THIS the bottleneck?
        validated = validate(parsed)
        result.append(validated)
    return result
```

```bash
kernprof -l -v my_script.py
# Output shows time per line and hits
```

---

## 5. `tracemalloc` — Memory Allocation Tracing

```python
import tracemalloc

tracemalloc.start(10)   # store 10 frames of stack trace

# ... run the code ...
create_large_objects()

snapshot = tracemalloc.take_snapshot()
top = snapshot.statistics("lineno")

for stat in top[:10]:
    print(stat)

# Compare before and after
snap1 = tracemalloc.take_snapshot()
step_that_might_leak()
snap2 = tracemalloc.take_snapshot()

for stat in snap2.compare_to(snap1, "lineno")[:10]:
    print(stat)   # positive = allocated, negative = freed
```

---

## 6. `memory_profiler` — Line-Level Memory

```bash
pip install memory-profiler
```

```python
from memory_profiler import profile

@profile
def load_data(path: str):
    with open(path) as f:
        lines = f.readlines()   # line 1: +X MB
    data = [parse(l) for l in lines]   # line 2: +Y MB
    return data
```

```bash
python -m memory_profiler my_script.py
```

---

## 7. Interpreting `cProfile` Output

```
ncalls  tottime  percall  cumtime  percall  filename:lineno(function)
  5000    1.234    0.000    3.456    0.001  parser.py:42(parse_line)
```

| Column | Meaning |
|--------|---------|
| `ncalls` | Number of calls |
| `tottime` | Time in function itself (excluding callees) |
| `cumtime` | Cumulative time including all callees |
| `percall` | Per-call time |

**Focus on `tottime` first** — high `cumtime` with low `tottime` means the function calls expensive sub-functions.

---

## 8. Common Optimisation Patterns

```python
# 1. Cache expensive computations
from functools import lru_cache

@lru_cache(maxsize=1024)
def fib(n: int) -> int:
    if n < 2: return n
    return fib(n-1) + fib(n-2)

# 2. Use local variable lookups (faster than attribute lookups in loops)
def process(data: list) -> list:
    append = [].append           # local var avoids repeated method lookup
    for item in data:
        append(transform(item))

# 3. Avoid repeated dict/list lookups in loops
config = get_config()
threshold = config["threshold"]   # look up once
for item in items:
    if item.value > threshold:    # local var, not config["threshold"]
        ...

# 4. Use built-ins (implemented in C)
total = sum(values)          # faster than manual loop
filtered = list(filter(predicate, values))
result = list(map(transform, values))
```
