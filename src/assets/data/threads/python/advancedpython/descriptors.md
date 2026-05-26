## Descriptors
---

A descriptor is any object that implements `__get__`, `__set__`, or `__delete__`. Descriptors are the mechanism behind Python's properties, classmethods, staticmethods, and slot-based attributes. They give you complete control over attribute access.

---

## 1. The Descriptor Protocol

```python
class MyDescriptor:
    def __get__(self, obj, objtype=None):
        """Called on attribute read: obj.attr"""
        if obj is None:
            return self   # accessed via class, not instance
        return self._value

    def __set__(self, obj, value):
        """Called on attribute write: obj.attr = value"""
        self._value = value

    def __delete__(self, obj):
        """Called on attribute delete: del obj.attr"""
        del self._value
```

---

## 2. Data vs Non-Data Descriptors

| Type | Implements | Priority |
|------|-----------|----------|
| **Data descriptor** | `__set__` and/or `__delete__` | Overrides instance `__dict__` |
| **Non-data descriptor** | Only `__get__` | Instance `__dict__` takes priority |

```python
class DataDesc:
    def __get__(self, obj, tp): return "data"
    def __set__(self, obj, val): pass   # makes it a data descriptor

class NonDataDesc:
    def __get__(self, obj, tp): return "non-data"

class MyClass:
    data = DataDesc()
    non_data = NonDataDesc()

obj = MyClass()
obj.__dict__["data"] = "instance"      # ignored — data descriptor wins
obj.__dict__["non_data"] = "instance"  # wins — non-data descriptor loses
obj.data       # "data"
obj.non_data   # "instance"
```

---

## 3. Practical Example: Validated Attribute

```python
class Typed:
    """Descriptor that type-checks on assignment."""

    def __set_name__(self, owner, name):
        # Called when the class is created
        self.name = name
        self.private_name = f"_{name}"

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        return getattr(obj, self.private_name, None)

    def __set__(self, obj, value):
        if not isinstance(value, self.type):
            raise TypeError(f"{self.name} must be {self.type.__name__}, got {type(value).__name__}")
        setattr(obj, self.private_name, value)


class IntField(Typed):
    type = int

class StrField(Typed):
    type = str


class User:
    name = StrField()
    age = IntField()

    def __init__(self, name: str, age: int):
        self.name = name
        self.age = age

u = User("Alice", 30)
u.age = "thirty"   # TypeError: age must be int, got str
```

---

## 4. `__set_name__` Hook

`__set_name__(owner, name)` is called at class creation time with the attribute name. Avoids having to pass the name explicitly:

```python
class Column:
    def __set_name__(self, owner, name):
        self.column_name = name        # "first_name", "last_name", etc.
        self.attr = f"_{name}"

    def __get__(self, obj, tp):
        if obj is None: return self
        return getattr(obj, self.attr)

    def __set__(self, obj, value):
        setattr(obj, self.attr, value)

class Model:
    first_name = Column()
    last_name = Column()
    # first_name.column_name == "first_name" automatically
```

---

## 5. `property` — Built-in Descriptor

`property` is just a convenient built-in data descriptor:

```python
class Circle:
    def __init__(self, radius: float):
        self._radius = radius

    @property
    def radius(self) -> float:
        return self._radius

    @radius.setter
    def radius(self, value: float):
        if value < 0:
            raise ValueError("Radius cannot be negative")
        self._radius = value

    @property
    def area(self) -> float:
        return 3.14159 * self._radius ** 2
```

---

## 6. `classmethod` and `staticmethod` — Non-Data Descriptors

```python
# classmethod.__get__ injects `cls` as the first argument
class MyClass:
    @classmethod
    def create(cls):
        return cls()       # cls is injected by the descriptor protocol

# staticmethod.__get__ returns the function unchanged (no injection)
class Utility:
    @staticmethod
    def helper(x: int) -> int:
        return x * 2
```

---

## 7. Lazy Attribute Descriptor

```python
class lazy_property:
    """Compute expensive value once, then cache on the instance."""

    def __init__(self, func):
        self.func = func
        self.attr_name = None

    def __set_name__(self, owner, name):
        self.attr_name = name

    def __get__(self, obj, objtype=None):
        if obj is None:
            return self
        value = self.func(obj)
        setattr(obj, self.attr_name, value)  # replace descriptor with value
        return value

class Report:
    @lazy_property
    def data(self) -> list:
        print("Loading data (expensive)...")
        return load_from_database()

r = Report()
r.data   # prints "Loading data..." and computes
r.data   # returns cached value directly (descriptor bypassed)
```
