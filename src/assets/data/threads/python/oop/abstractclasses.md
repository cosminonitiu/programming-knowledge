## Abstract Classes and Protocols
---

Python offers two complementary tools for defining interfaces: `abc.ABC` for nominal (explicit inheritance) interfaces, and `typing.Protocol` for structural (duck-typed) interfaces. Understanding the difference lets you choose the right level of coupling for your design.

---

## 1. Abstract Base Classes with `abc.ABC`

```python
from abc import ABC, abstractmethod

class Repository(ABC):
    """Defines the interface all repositories must implement."""

    @abstractmethod
    def get(self, id: int):
        ...

    @abstractmethod
    def save(self, entity) -> None:
        ...

    @abstractmethod
    def delete(self, id: int) -> None:
        ...

    # Non-abstract methods provide default behaviour
    def get_or_raise(self, id: int):
        result = self.get(id)
        if result is None:
            raise KeyError(f"Entity {id} not found")
        return result
```

Attempting to instantiate `Repository` directly raises `TypeError`:

```python
r = Repository()  # TypeError: Can't instantiate abstract class Repository
                  # with abstract methods delete, get, save
```

---

## 2. Concrete Implementation

```python
from typing import Optional

class InMemoryUserRepository(Repository):
    def __init__(self):
        self._store: dict[int, dict] = {}

    def get(self, id: int) -> Optional[dict]:
        return self._store.get(id)

    def save(self, entity: dict) -> None:
        self._store[entity["id"]] = entity

    def delete(self, id: int) -> None:
        self._store.pop(id, None)

repo = InMemoryUserRepository()
repo.save({"id": 1, "name": "Alice"})
repo.get(1)   # {"id": 1, "name": "Alice"}
```

---

## 3. Abstract Properties

```python
from abc import ABC, abstractmethod

class Vehicle(ABC):
    @property
    @abstractmethod
    def max_speed(self) -> float:
        ...

    @abstractmethod
    def start(self) -> None:
        ...

class Car(Vehicle):
    @property
    def max_speed(self) -> float:
        return 200.0

    def start(self) -> None:
        print("Vroom!")
```

---

## 4. `typing.Protocol` — Structural Subtyping (PEP 544)

A `Protocol` defines an interface by the methods an object **has**, not by what it **inherits from**. Any class with the right methods satisfies the protocol — no explicit inheritance needed.

```python
from typing import Protocol, runtime_checkable

@runtime_checkable
class Drawable(Protocol):
    def draw(self) -> None:
        ...

class Circle:
    def draw(self) -> None:
        print("Drawing circle")

class Square:
    def draw(self) -> None:
        print("Drawing square")

def render(shape: Drawable) -> None:
    shape.draw()

render(Circle())   # works — Circle has .draw()
render(Square())   # works — Square has .draw()

# runtime_checkable allows isinstance checks
isinstance(Circle(), Drawable)   # True
```

Neither `Circle` nor `Square` explicitly inherits from `Drawable`. This is the power of structural typing.

---

## 5. ABC vs Protocol — When to Use Which

| | `abc.ABC` | `typing.Protocol` |
|--|-----------|-------------------|
| Coupling | Nominal (explicit inheritance) | Structural (duck typing) |
| Runtime `isinstance` | Always works | Needs `@runtime_checkable` |
| Default implementations | Yes | No (only method signatures) |
| Third-party classes | Must subclass explicitly | Work automatically |
| Best for | Internal hierarchies, shared behaviour | External / open-ended interfaces |

---

## 6. Registering Virtual Subclasses

ABCs support registering existing classes as virtual subclasses without modifying them:

```python
class MyList(ABC):
    @abstractmethod
    def __len__(self): ...

MyList.register(list)  # list is now a "virtual subclass" of MyList
isinstance([], MyList)  # True
```

The standard library uses this to register built-in types with ABCs like `collections.abc.Sequence`, `Iterable`, `Mapping`, etc.

---

## 7. `collections.abc` Built-in ABCs

```python
from collections.abc import Iterable, Sequence, Mapping, Callable, Iterator

def process(items: Iterable):
    for item in items:
        print(item)

process([1, 2, 3])    # list
process((1, 2, 3))    # tuple
process({1, 2, 3})    # set
process("hello")      # string — all Iterable
```

Using `collections.abc` types as annotations expresses intent more precisely than concrete types like `list` or `dict`.

---

## 8. Protocol with `__call__` — Callable Interfaces

```python
from typing import Protocol

class Validator(Protocol):
    def __call__(self, value: str) -> bool:
        ...

def validate_form(value: str, validator: Validator) -> bool:
    return validator(value)

def is_non_empty(s: str) -> bool:
    return len(s) > 0

validate_form("hello", is_non_empty)  # True — function satisfies Validator protocol
```
