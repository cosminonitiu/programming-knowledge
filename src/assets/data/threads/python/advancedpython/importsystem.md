## The Import System
---

Understanding how Python resolves and loads modules helps you write clean package structures, avoid circular imports, and control what gets exposed from your packages.

---

## 1. How `import` Works

When Python executes `import foo`:

1. Checks `sys.modules` (cache) — if found, returns it.
2. Finds the module using **finders** in `sys.meta_path`.
3. Loads the module using a **loader**.
4. Executes the module's code in its namespace.
5. Stores the module in `sys.modules[foo]`.

```python
import sys

# After import, the module is cached
import json
"json" in sys.modules        # True
sys.modules["json"] is json  # True

# Force reload (re-executes module code)
import importlib
importlib.reload(json)
```

---

## 2. Module Search Path (`sys.path`)

```python
import sys

sys.path
# [
#   '',                   # current directory
#   '/usr/lib/python3.11',
#   '/usr/lib/python3.11/lib-dynload',
#   '/home/user/.local/lib/python3.11/site-packages',
#   ...
# ]

# Modify at runtime (not recommended, use PYTHONPATH env var or .pth files)
sys.path.insert(0, "/path/to/my/modules")
import mymodule
```

---

## 3. Packages and `__init__.py`

```
mypackage/
    __init__.py        # marks directory as a package; runs on import
    module_a.py
    module_b.py
    subpackage/
        __init__.py
        module_c.py
```

```python
# mypackage/__init__.py — control public API
from .module_a import ClassA, function_b
from .module_b import ClassB

__all__ = ["ClassA", "ClassB", "function_b"]

# Users can now do:
from mypackage import ClassA   # instead of from mypackage.module_a import ClassA
```

---

## 4. Relative vs Absolute Imports

```python
# mypackage/module_a.py

# Absolute (preferred — explicit)
from mypackage.module_b import ClassB

# Relative (useful within a package, avoids hard-coding package name)
from .module_b import ClassB     # same package
from ..subpackage import thing   # parent then subpackage
```

---

## 5. `__all__` — Controlling `from module import *`

```python
# module.py
def public_func(): ...
def _private_func(): ...
def helper(): ...

__all__ = ["public_func"]

# from module import * only imports public_func
# _private_func and helper are not exported
```

---

## 6. Lazy Imports (Performance Pattern)

Delay the cost of importing heavy libraries until they're actually needed:

```python
# Top-level import (always loaded, even if this feature is never used)
import numpy as np   # adds ~50ms startup cost

# Lazy import (only loaded if this function is called)
def process_array(data):
    import numpy as np   # loaded only when needed
    return np.array(data).mean()

# PEP 562: lazy module attributes (Python 3.7+)
def __getattr__(name: str):
    if name == "heavy_module":
        import heavy_module
        globals()["heavy_module"] = heavy_module
        return heavy_module
    raise AttributeError(f"module has no attribute {name!r}")
```

---

## 7. Circular Import Problem and Solutions

```python
# PROBLEM: a.py imports b.py, b.py imports a.py
# a.py
from b import ClassB

# b.py
from a import ClassA   # ImportError: cannot import name 'ClassA' (a not fully loaded)

# SOLUTION 1: Move import inside the function
# b.py
def create():
    from a import ClassA   # imported only when create() is called
    return ClassA()

# SOLUTION 2: Import the module, not names from it
# b.py
import a
def create():
    return a.ClassA()

# SOLUTION 3: Reorganise to remove the cycle (best approach)
# Extract shared definitions to a third module that both can import
```

---

## 8. Custom Importers with `importlib`

```python
import importlib
import importlib.util

# Import a module from an arbitrary file path
spec = importlib.util.spec_from_file_location("my_module", "/path/to/file.py")
module = importlib.util.module_from_spec(spec)
spec.loader.exec_module(module)
module.some_function()

# Import by string name
module = importlib.import_module("json")
module = importlib.import_module(".module_a", package="mypackage")
```

---

## 9. `__import__` and `importlib.import_module()`

```python
# Dynamic import by name string
plugin_name = "plugins.csv_plugin"
plugin_module = importlib.import_module(plugin_name)
plugin_class = getattr(plugin_module, "CSVPlugin")
plugin = plugin_class()
```

---

## 10. `namespace packages` (PEP 420)

A directory without `__init__.py` becomes a namespace package — Python 3 searches all `sys.path` entries for pieces of the same package name and merges them:

```python
# Useful for splitting large packages across multiple directories
# No __init__.py required in Python 3
# python will still find mypackage.moduleA and mypackage.moduleB
# even if they live in different filesystem locations
```
