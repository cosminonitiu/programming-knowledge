## Dataclasses and NamedTuples
---

`@dataclass` and `typing.NamedTuple` eliminate boilerplate for data-holder classes. They auto-generate `__init__`, `__repr__` and `__eq__`, with options for immutability, ordering and hashing.

---

## 1. `@dataclass` — The Basics

```python
from dataclasses import dataclass, field
from typing import ClassVar

@dataclass
class Point:
    x: float
    y: float

p1 = Point(1.0, 2.0)
p2 = Point(1.0, 2.0)
p1 == p2   # True  — __eq__ auto-generated
repr(p1)   # "Point(x=1.0, y=2.0)"  — __repr__ auto-generated
```

---

## 2. Default Values and `field()`

```python
from dataclasses import dataclass, field
from datetime import datetime, timezone

@dataclass
class User:
    name: str
    email: str
    roles: list[str] = field(default_factory=list)  # mutable default — MUST use field()
    created_at: datetime = field(default_factory=lambda: datetime.now(timezone.utc))
    admin: bool = False

    # ClassVar is not included as a dataclass field
    MAX_ROLES: ClassVar[int] = 10
```

> Never use a mutable object (list, dict) as a direct default — use `field(default_factory=...)`.

---

## 3. Frozen Dataclasses — Immutability

```python
@dataclass(frozen=True)
class FrozenPoint:
    x: float
    y: float

fp = FrozenPoint(1.0, 2.0)
# fp.x = 5.0  # raises FrozenInstanceError
hash(fp)       # hashable — can be used as dict key or in a set
```

---

## 4. Ordering

```python
@dataclass(order=True)
class Version:
    major: int
    minor: int
    patch: int

v1 = Version(1, 2, 0)
v2 = Version(1, 3, 0)
v1 < v2    # True  — compares tuple (major, minor, patch)
sorted([Version(2,0,0), Version(1,0,0), Version(1,2,0)])
```

---

## 5. `__post_init__` — Post-Construction Validation

```python
from dataclasses import dataclass
import re

@dataclass
class Email:
    address: str

    def __post_init__(self):
        if not re.match(r"[^@]+@[^@]+\.[^@]+", self.address):
            raise ValueError(f"Invalid email address: {self.address}")
        self.address = self.address.lower()

e = Email("Alice@Example.COM")
e.address   # "alice@example.com"
```

---

## 6. `field()` Options Reference

```python
from dataclasses import field

@dataclass
class Config:
    host: str
    port: int = 5432
    # field() options:
    debug: bool = field(default=False, repr=True)
    _cache: dict = field(default_factory=dict, init=False, repr=False, compare=False)
    metadata: dict = field(default_factory=dict, hash=False)
```

| Option | Description |
|--------|-------------|
| `default` | Default value (immutable only) |
| `default_factory` | Callable for mutable defaults |
| `init` | Include in `__init__`? (default True) |
| `repr` | Include in `__repr__`? (default True) |
| `compare` | Include in `__eq__`/`__lt__`? (default True) |
| `hash` | Include in `__hash__`? |

---

## 7. `typing.NamedTuple`

`NamedTuple` provides an immutable, ordered record with named fields. Lighter than a dataclass but no post-init or mutation:

```python
from typing import NamedTuple

class Point(NamedTuple):
    x: float
    y: float
    z: float = 0.0   # optional field with default

p = Point(1.0, 2.0)
p.x, p.y    # 1.0, 2.0
p[0]        # 1.0  — also accessible by index
p._asdict() # {"x": 1.0, "y": 2.0, "z": 0.0}
p._replace(x=5.0)  # new Point(x=5.0, y=2.0, z=0.0) — returns new instance
hash(p)     # hashable
```

---

## 8. Dataclass Inheritance

```python
@dataclass
class Animal:
    name: str
    weight_kg: float

@dataclass
class Dog(Animal):
    breed: str
    trained: bool = False

d = Dog(name="Rex", weight_kg=25.0, breed="Labrador")
```

> Fields with defaults must come after fields without defaults. This applies across the inheritance chain — a common source of errors.

---

## 9. Choosing: `@dataclass` vs `NamedTuple` vs plain `class`

| Feature | `@dataclass` | `NamedTuple` | plain class |
|---------|-------------|--------------|-------------|
| Auto `__init__` | ✓ | ✓ | ✗ |
| Auto `__repr__` | ✓ | ✓ | ✗ |
| Mutable | ✓ (default) | ✗ | ✓ |
| Hashable (default) | ✗ | ✓ | ✗ |
| Indexed access | ✗ | ✓ | ✗ |
| Inheritance | Full | Limited | Full |
| Validation in `__post_init__` | ✓ | ✗ | ✓ |
| Memory | Normal | Tuple (lighter) | Normal |
