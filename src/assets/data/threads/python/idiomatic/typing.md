## Type Hints and Static Analysis
---

Python's type hint system (PEP 484 onwards) adds optional, compile-time-style annotations to a dynamically typed language. Annotations are not enforced at runtime — they exist for static analysers (mypy, pyright), IDEs, and documentation.

---

## 1. Basic Annotations

```python
# Variables
name: str = "Alice"
count: int = 0
ratio: float = 0.75
active: bool = True

# Functions
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str = "World") -> str:
    return f"Hello, {name}"

def process(items: list[str]) -> None:
    for item in items:
        print(item)
```

---

## 2. `Optional`, `Union` and `|` Syntax

```python
from typing import Optional, Union

# Python 3.9 and below
def find_user(id: int) -> Optional[dict]:   # same as Union[dict, None]
    ...

def accept(value: Union[int, str]) -> None:
    ...

# Python 3.10+ — use | operator
def find_user(id: int) -> dict | None:
    ...

def accept(value: int | str) -> None:
    ...
```

---

## 3. Collection Types

```python
# Python 3.9+ — use built-in types directly (PEP 585)
def process(items: list[str]) -> dict[str, int]:
    ...

def flatten(matrix: list[list[int]]) -> list[int]:
    ...

# Python 3.8 and below — import from typing
from typing import List, Dict, Tuple, Set

def old_style(items: List[str]) -> Dict[str, int]:
    ...

# Tuple with fixed types
def get_coords() -> tuple[float, float]:
    ...

# Variable-length tuple
def get_args() -> tuple[int, ...]:   # tuple of any number of ints
    ...
```

---

## 4. `TypeVar` — Generic Functions

```python
from typing import TypeVar, Sequence

T = TypeVar("T")

def first(items: Sequence[T]) -> T | None:
    return items[0] if items else None

# The return type matches the element type of the input
first([1, 2, 3])       # int
first(["a", "b", "c"]) # str
```

---

## 5. `TypedDict` — Dict Shape Annotations

```python
from typing import TypedDict, Required, NotRequired

class UserDict(TypedDict):
    id: int
    name: str
    email: str

class PartialUser(TypedDict, total=False):  # all fields optional
    id: int
    name: str

# Python 3.11+ Required/NotRequired
class Config(TypedDict):
    host: Required[str]
    port: NotRequired[int]

def create_user(data: UserDict) -> None:
    print(data["name"])
```

---

## 6. `Callable` and `Protocol`

```python
from typing import Callable
from collections.abc import Callable

# Function type: Callable[[arg_types], return_type]
def apply(func: Callable[[int, int], int], a: int, b: int) -> int:
    return func(a, b)

# Protocol for structural typing
from typing import Protocol

class Comparable(Protocol):
    def __lt__(self, other: "Comparable") -> bool: ...
    def __eq__(self, other: object) -> bool: ...
```

---

## 7. `Literal` and `Final`

```python
from typing import Literal, Final

# Literal — only specific values
Mode = Literal["r", "w", "a", "rb", "wb"]

def open_file(path: str, mode: Mode = "r"):
    ...

open_file("data.txt", "r")   # OK
open_file("data.txt", "x")   # mypy error — "x" not in Literal

# Final — cannot be reassigned
MAX_SIZE: Final = 1000
MAX_SIZE = 2000   # mypy error
```

---

## 8. `TypeAlias` and `type` Statement

```python
from typing import TypeAlias

# Python 3.10+ TypeAlias
Vector: TypeAlias = list[float]
Matrix: TypeAlias = list[Vector]

# Python 3.12+ type statement (PEP 695)
type Vector = list[float]
type Matrix = list[Vector]
```

---

## 9. `dataclass_transform` and `ParamSpec`

```python
from typing import ParamSpec, Concatenate

P = ParamSpec("P")

def add_logging(func: Callable[P, T]) -> Callable[P, T]:
    @wraps(func)
    def wrapper(*args: P.args, **kwargs: P.kwargs) -> T:
        print(f"Calling {func.__name__}")
        return func(*args, **kwargs)
    return wrapper
```

---

## 10. Running Static Analysis

```bash
# mypy — the classic checker
pip install mypy
mypy src/

# pyright — faster, used by Pylance in VS Code
pip install pyright
pyright src/

# ruff — also performs some type-checking rules
pip install ruff
ruff check src/

# mypy configuration in pyproject.toml
# [tool.mypy]
# strict = true
# python_version = "3.12"
```

---

## 11. Type Narrowing

```python
def process(value: int | str) -> str:
    if isinstance(value, int):
        return str(value * 2)   # here mypy knows value is int
    return value.upper()         # here mypy knows value is str

# TypeGuard (Python 3.10+) for custom narrowing functions
from typing import TypeGuard

def is_str_list(lst: list[object]) -> TypeGuard[list[str]]:
    return all(isinstance(x, str) for x in lst)
```
