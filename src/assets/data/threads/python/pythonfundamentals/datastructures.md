## Built-in Data Structures
---

Python ships with four essential built-in data structures — list, tuple, set and dict — plus a rich `collections` module for specialised needs. Choosing the right structure is a foundational performance and correctness decision.

---

## 1. List

An ordered, mutable sequence. Backed by a dynamic array.

```python
fruits = ["apple", "banana", "cherry"]

# Access
fruits[0]       # "apple"
fruits[-1]      # "cherry"
fruits[1:3]     # ["banana", "cherry"]  — slice

# Mutation
fruits.append("date")
fruits.insert(1, "avocado")
fruits.remove("banana")   # removes first occurrence
fruits.pop()              # removes and returns last element
fruits.pop(0)             # removes and returns element at index 0

# Sorting
fruits.sort()              # in-place, ascending
fruits.sort(reverse=True)
sorted(fruits)             # returns new sorted list

# Common operations
len(fruits)
"apple" in fruits         # True
fruits.index("cherry")    # position
fruits.count("apple")     # occurrences
fruits.reverse()          # in-place

# List comprehension
squares = [x**2 for x in range(10)]
evens   = [x for x in range(20) if x % 2 == 0]
```

**Time complexity:** `O(1)` append/pop (amortised), `O(n)` insert/remove at arbitrary index, `O(n)` search.

---

## 2. Tuple

An ordered, **immutable** sequence. Lower memory overhead than a list. Safe to use as a dict key.

```python
point = (3, 4)
x, y = point        # unpacking

# Single-element tuple needs trailing comma
singleton = (42,)   # not (42) — that's just an int in parens

# Named tuple for readable records
from collections import namedtuple
Point = namedtuple("Point", ["x", "y"])
p = Point(3, 4)
print(p.x, p.y)
```

---

## 3. Set

An unordered collection of unique, hashable elements. Backed by a hash table.

```python
s = {1, 2, 3, 2, 1}   # {1, 2, 3}
empty_set = set()      # {} creates an empty DICT, not a set!

s.add(4)
s.discard(10)          # no error if missing
s.remove(1)            # raises KeyError if missing

a = {1, 2, 3, 4}
b = {3, 4, 5, 6}
a | b    # union:        {1,2,3,4,5,6}
a & b    # intersection: {3,4}
a - b    # difference:   {1,2}
a ^ b    # symmetric diff:{1,2,5,6}

# frozenset — immutable set (can be used as dict key)
fs = frozenset([1, 2, 3])
```

**Time complexity:** `O(1)` average add/remove/lookup.

---

## 4. Dict

An ordered (Python 3.7+), mutable mapping from hashable keys to arbitrary values. Backed by a hash table.

```python
config = {"host": "localhost", "port": 5432}

# Access
config["host"]               # "localhost"
config.get("password", "")   # default value if key missing
config.setdefault("ssl", True)  # insert if not present

# Mutation
config["timeout"] = 30
del config["port"]
config.update({"port": 5433, "db": "mydb"})

# Iteration
config.keys()    # dict_keys view
config.values()  # dict_values view
config.items()   # dict_items view of (key, value) pairs

for k, v in config.items():
    print(f"{k}: {v}")

# Dict comprehension
squared = {x: x**2 for x in range(5)}

# Merge dicts (Python 3.9+)
merged = config | {"timeout": 60}
```

**Time complexity:** `O(1)` average get/set/delete.

---

## 5. `collections` Module Highlights

```python
from collections import Counter, defaultdict, deque, OrderedDict

# Counter — count hashable objects
words = ["the", "cat", "sat", "on", "the", "mat", "the"]
c = Counter(words)
c.most_common(2)   # [("the", 3), ("cat", 1)]

# defaultdict — dict with default factory
dd = defaultdict(list)
dd["users"].append("alice")  # no KeyError

# deque — double-ended queue, O(1) append/pop from both ends
q = deque([1, 2, 3])
q.appendleft(0)   # [0, 1, 2, 3]
q.popleft()       # 0
q.rotate(1)       # [3, 1, 2]

# OrderedDict — preserves insertion order (redundant in 3.7+ but has move_to_end)
od = OrderedDict([("a", 1), ("b", 2)])
od.move_to_end("a")
```

---

## 6. Choosing the Right Structure

| Need | Use |
|------|-----|
| Ordered, mutable sequence | `list` |
| Immutable record / dict key | `tuple` |
| Unique membership / set operations | `set` |
| Key-value mapping | `dict` |
| Fast FIFO queue | `collections.deque` |
| Counting | `collections.Counter` |
| Default values in dict | `collections.defaultdict` |
