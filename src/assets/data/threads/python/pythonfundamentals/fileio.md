## File I/O and the `open()` Built-in
---

Python's built-in `open()` function provides access to the filesystem. The `with` statement ensures files are closed deterministically, even if an exception occurs. `pathlib` offers a modern, object-oriented alternative to `os.path`.

---

## 1. Opening and Reading Files

```python
# Basic read
with open("data.txt", "r", encoding="utf-8") as f:
    content = f.read()         # entire file as a string

# Read line by line (memory-efficient for large files)
with open("data.txt", "r", encoding="utf-8") as f:
    for line in f:             # file object is iterable
        print(line.strip())

# Read all lines into a list
with open("data.txt", "r") as f:
    lines = f.readlines()      # ["line1\n", "line2\n", ...]

# Read a specific number of bytes/characters
with open("data.txt", "r") as f:
    chunk = f.read(1024)
```

---

## 2. Writing Files

```python
# Write (creates or overwrites)
with open("output.txt", "w", encoding="utf-8") as f:
    f.write("Hello, World!\n")
    f.writelines(["line 1\n", "line 2\n"])

# Append (does not truncate)
with open("log.txt", "a", encoding="utf-8") as f:
    f.write("New log entry\n")
```

---

## 3. File Modes

| Mode | Description |
|------|-------------|
| `"r"` | Read (default). Error if file doesn't exist. |
| `"w"` | Write. Creates or truncates. |
| `"a"` | Append. Creates if not exists. |
| `"x"` | Exclusive create. Error if file exists. |
| `"r+"` | Read + write. File must exist. |
| `"b"` | Binary mode (combine with others: `"rb"`, `"wb"`) |
| `"t"` | Text mode (default) |

---

## 4. Binary Files

```python
# Reading an image
with open("photo.jpg", "rb") as f:
    data = f.read()

# Writing bytes
with open("output.bin", "wb") as f:
    f.write(b"\x00\xFF\xAB")
```

---

## 5. `pathlib` — The Modern Path API

`pathlib.Path` treats paths as objects rather than raw strings:

```python
from pathlib import Path

# Create path objects
p = Path("/home/user/data/file.txt")
cwd = Path.cwd()
home = Path.home()

# Navigation
parent = p.parent          # Path("/home/user/data")
name = p.name              # "file.txt"
stem = p.stem              # "file"
suffix = p.suffix          # ".txt"

# Joining paths — use / operator
config = home / ".config" / "app.json"

# Checking existence
p.exists()
p.is_file()
p.is_dir()

# Reading / writing (no open() needed)
text = p.read_text(encoding="utf-8")
p.write_text("content", encoding="utf-8")
data = p.read_bytes()
p.write_bytes(b"\x00\xFF")

# Iterating directory
for child in Path(".").iterdir():
    print(child)

# Glob
for py_file in Path("src").rglob("*.py"):
    print(py_file)

# Create directories
Path("logs/archive").mkdir(parents=True, exist_ok=True)
```

---

## 6. The `with` Statement and Context Managers

`with` calls `__enter__` on entry and `__exit__` on exit (even on exception):

```python
# Equivalent code without with:
f = open("data.txt")
try:
    content = f.read()
finally:
    f.close()   # must be called explicitly

# With with:
with open("data.txt") as f:
    content = f.read()    # f.close() is automatic
```

Multiple context managers in one `with`:

```python
with open("input.txt") as fin, open("output.txt", "w") as fout:
    fout.write(fin.read().upper())
```

---

## 7. Working with JSON and CSV

```python
import json

# Write JSON
data = {"name": "Alice", "age": 30}
with open("data.json", "w") as f:
    json.dump(data, f, indent=2)

# Read JSON
with open("data.json") as f:
    loaded = json.load(f)

# In-memory
json_str = json.dumps(data)
data = json.loads(json_str)

# CSV
import csv

with open("data.csv", "w", newline="") as f:
    writer = csv.DictWriter(f, fieldnames=["name", "age"])
    writer.writeheader()
    writer.writerows([{"name": "Alice", "age": 30}])

with open("data.csv") as f:
    reader = csv.DictReader(f)
    for row in reader:
        print(row)
```

---

## 8. Temporary Files and Directories

```python
import tempfile

# Temporary file (auto-deleted on close)
with tempfile.NamedTemporaryFile(mode="w", suffix=".txt", delete=True) as tmp:
    tmp.write("temporary data")
    print(tmp.name)

# Temporary directory
with tempfile.TemporaryDirectory() as tmpdir:
    p = Path(tmpdir) / "file.txt"
    p.write_text("data")
```
