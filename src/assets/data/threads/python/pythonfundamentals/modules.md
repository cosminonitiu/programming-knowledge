## Modules and Packages
---

Python's module system is the primary unit of code organisation. A module is a single `.py` file; a package is a directory containing an `__init__.py` file (or a namespace package without one). Understanding how the import system resolves names is essential for building maintainable projects.

---

## 1. What is a Module?

Any `.py` file is a module. When imported, Python executes the file's top-level code once and caches it in `sys.modules`.

```python
# math_utils.py
PI = 3.14159

def area(radius):
    return PI * radius ** 2

# main.py
import math_utils
print(math_utils.area(5))
print(math_utils.PI)
```

---

## 2. Import Forms

```python
# Import entire module
import os
os.path.join("/tmp", "file.txt")

# Import specific names
from os.path import join, exists
join("/tmp", "file.txt")

# Import with alias
import numpy as np
from datetime import datetime as dt

# Import all public names (avoid in production code)
from math import *
```

---

## 3. How Python Finds Modules — `sys.path`

When you write `import foo`, Python searches directories in `sys.path` in order:

1. The directory of the script that was run (or `""` for the REPL).
2. Directories listed in the `PYTHONPATH` environment variable.
3. Standard library directories.
4. Installed package directories (e.g., `site-packages`).

```python
import sys
print(sys.path)          # List of directories searched

sys.path.insert(0, "/my/custom/dir")  # prepend a custom path
```

---

## 4. Packages

A package is a directory with an `__init__.py` that is executed on first import:

```
mypackage/
    __init__.py          # makes it a package
    utils.py
    models/
        __init__.py
        user.py
        product.py
```

```python
from mypackage.models.user import User
from mypackage import utils
```

`__init__.py` can expose a public API, reducing import paths:

```python
# mypackage/__init__.py
from .models.user import User
from .models.product import Product

# consumers can now write:
from mypackage import User, Product
```

---

## 5. Relative Imports

Inside a package, use relative imports to avoid hardcoding package names:

```python
# mypackage/models/product.py
from .user import User          # same package (models/)
from ..utils import format_date  # parent package (mypackage/)
```

---

## 6. `__name__` and `if __name__ == "__main__"`

When a module is run directly, `__name__ == "__main__"`. When imported, `__name__` equals the module name:

```python
# utils.py
def helper():
    return 42

if __name__ == "__main__":
    # This block only runs when executed directly, not when imported
    print(helper())
```

---

## 7. Virtual Environments

Virtual environments isolate project dependencies from the system Python:

```bash
# Create
python3 -m venv .venv

# Activate (Linux/macOS)
source .venv/bin/activate

# Activate (Windows)
.venv\Scripts\activate

# Install packages
pip install fastapi uvicorn

# Freeze dependencies
pip freeze > requirements.txt

# Recreate environment from lockfile
pip install -r requirements.txt

# Deactivate
deactivate
```

---

## 8. `pyproject.toml` — Modern Project Metadata

PEP 517/518 standardised project configuration in `pyproject.toml`:

```toml
[project]
name = "my-service"
version = "1.0.0"
requires-python = ">=3.11"
dependencies = [
    "fastapi>=0.111",
    "pydantic>=2.0",
    "sqlalchemy>=2.0",
]

[project.optional-dependencies]
dev = ["pytest", "mypy", "ruff"]

[build-system]
requires = ["hatchling"]
build-backend = "hatchling.build"
```

---

## 9. Useful Standard Library Modules at a Glance

| Module | Purpose |
|--------|---------|
| `os`, `os.path` | OS interface, path manipulation |
| `pathlib` | Object-oriented path API |
| `sys` | Interpreter state, `sys.argv`, `sys.path` |
| `json` | JSON encode/decode |
| `logging` | Structured logging |
| `re` | Regular expressions |
| `datetime` | Date and time |
| `collections` | Specialised data structures |
| `itertools` | Iterator building blocks |
| `functools` | Higher-order functions |
| `typing` | Type hint primitives |
| `unittest` | Built-in test framework |
| `subprocess` | Run external processes |
| `threading`, `multiprocessing` | Concurrency |
| `asyncio` | Async I/O event loop |
