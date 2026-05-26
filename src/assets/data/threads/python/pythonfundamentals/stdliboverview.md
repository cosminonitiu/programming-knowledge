## Standard Library Highlights
---

Python's "batteries included" philosophy means the standard library covers most everyday tasks without any external dependencies. Below are the modules you'll reach for most often in backend and data engineering work.

---

## 1. `os` and `pathlib` — Filesystem and OS Interface

```python
import os

os.getcwd()                    # current working directory
os.environ.get("HOME", "/tmp") # environment variables
os.listdir("/tmp")             # directory contents
os.makedirs("/tmp/a/b", exist_ok=True)
os.remove("file.txt")
os.rename("old.txt", "new.txt")

# Prefer pathlib for new code
from pathlib import Path
Path.home() / ".config" / "app.json"
```

---

## 2. `sys` — Interpreter State

```python
import sys

sys.argv          # command-line arguments
sys.path          # module search path
sys.version       # Python version string
sys.exit(0)       # exit with code
sys.stdin, sys.stdout, sys.stderr
sys.getsizeof(obj)  # memory size in bytes
```

---

## 3. `datetime` and `zoneinfo` — Dates and Times

```python
from datetime import datetime, date, timedelta, timezone
from zoneinfo import ZoneInfo   # Python 3.9+

now_utc = datetime.now(timezone.utc)
today = date.today()

# Arithmetic
tomorrow = today + timedelta(days=1)
in_2h = now_utc + timedelta(hours=2)

# Formatting and parsing
formatted = now_utc.strftime("%Y-%m-%dT%H:%M:%SZ")
parsed = datetime.strptime("2024-01-15", "%Y-%m-%d")

# Timezone-aware
berlin = datetime.now(ZoneInfo("Europe/Berlin"))
```

---

## 4. `json` — JSON Serialisation

```python
import json

# Encode
data = {"name": "Alice", "scores": [95, 87, 91]}
json_str = json.dumps(data, indent=2, default=str)

# Decode
loaded = json.loads(json_str)

# File I/O
with open("data.json", "w") as f:
    json.dump(data, f)

with open("data.json") as f:
    data = json.load(f)
```

---

## 5. `logging` — Structured Logging

```python
import logging

logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s %(levelname)s %(name)s — %(message)s"
)

logger = logging.getLogger(__name__)

logger.debug("Detailed diagnostic info")
logger.info("Server started on port %d", 8080)
logger.warning("Config not found, using defaults")
logger.error("Failed to connect: %s", error)
logger.exception("Unexpected error")  # includes stack trace

# Best practice: use structured logging in production
# (structlog or python-json-logger for JSON output)
```

---

## 6. `re` — Regular Expressions

```python
import re

# Search (anywhere in string)
match = re.search(r"\d{4}-\d{2}-\d{2}", text)
if match:
    date_str = match.group()

# Match (from start of string)
m = re.match(r"(\w+)@(\w+\.\w+)", email)
user, domain = m.groups()

# Find all occurrences
numbers = re.findall(r"\d+", "there are 3 cats and 12 dogs")

# Substitute
clean = re.sub(r"\s+", " ", "too   many   spaces")

# Compile for performance in loops
pattern = re.compile(r"ERROR: (?P<message>.+)", re.IGNORECASE)
for line in log_lines:
    if m := pattern.search(line):
        print(m.group("message"))
```

---

## 7. `collections` — Specialised Data Structures

```python
from collections import Counter, defaultdict, deque, namedtuple, ChainMap

Counter("aababc")           # Counter({'a': 3, 'b': 2, 'c': 1})
defaultdict(list)           # dict with list factory
deque(maxlen=100)           # circular buffer
namedtuple("Point", "x y") # lightweight immutable record
ChainMap(local, defaults)   # layered dict lookup
```

---

## 8. `itertools` — Iterator Building Blocks

```python
import itertools as it

list(it.chain([1,2], [3,4], [5]))          # [1,2,3,4,5]
list(it.islice(range(1000), 5))            # [0,1,2,3,4]
list(it.product("AB", repeat=2))           # all combinations
list(it.combinations("ABCD", 2))           # C(4,2) pairs
list(it.permutations("ABC", 2))            # ordered pairs
dict(it.groupby(sorted_data, key=lambda x: x["dept"]))
list(it.takewhile(lambda x: x < 5, [1,2,3,4,5,6]))
list(it.dropwhile(lambda x: x < 5, [1,2,3,4,5,6]))
```

---

## 9. `functools` — Higher-Order Functions

```python
from functools import lru_cache, cache, partial, reduce, wraps

@lru_cache(maxsize=128)
def fibonacci(n):
    if n < 2: return n
    return fibonacci(n-1) + fibonacci(n-2)

double = partial(pow, exp=2)   # partial application

reduce(lambda a, b: a+b, [1,2,3,4])  # 10
```

---

## 10. `subprocess` — Running External Processes

```python
import subprocess

# Simple run, capture output
result = subprocess.run(
    ["git", "log", "--oneline", "-5"],
    capture_output=True,
    text=True,
    check=True   # raises CalledProcessError on non-zero exit
)
print(result.stdout)

# Pipe output to another command
proc = subprocess.run("ls -la | grep .py", shell=True, capture_output=True, text=True)
```

---

## 11. `urllib` / `http` — HTTP without Third-Party Libraries

```python
import urllib.request, json

with urllib.request.urlopen("https://api.example.com/data") as resp:
    data = json.loads(resp.read().decode())
```

> In production, prefer `httpx` (async) or `requests` (sync) over the stdlib HTTP modules.
