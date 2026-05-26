## Classes and Objects
---

In Python, everything is an object — including functions, modules and even classes themselves. The `class` keyword creates a new type. Understanding how Python creates and manages objects is foundational to writing effective OOP code.

---

## 1. Defining a Class

```python
class BankAccount:
    # Class attribute — shared by all instances
    interest_rate = 0.03

    def __init__(self, owner: str, balance: float = 0.0):
        # Instance attributes — unique per instance
        self.owner = owner
        self.balance = balance

    def deposit(self, amount: float) -> None:
        if amount <= 0:
            raise ValueError("Deposit must be positive")
        self.balance += amount

    def withdraw(self, amount: float) -> float:
        if amount > self.balance:
            raise ValueError("Insufficient funds")
        self.balance -= amount
        return amount

    def __repr__(self) -> str:
        return f"BankAccount(owner={self.owner!r}, balance={self.balance:.2f})"
```

---

## 2. Creating Instances

```python
alice_account = BankAccount("Alice", 1000.0)
alice_account.deposit(500)
alice_account.withdraw(200)
print(alice_account)  # BankAccount(owner='Alice', balance=1300.00)
```

---

## 3. Class Attributes vs Instance Attributes

```python
class Dog:
    species = "Canis lupus familiaris"  # class attribute

    def __init__(self, name):
        self.name = name                 # instance attribute

rex = Dog("Rex")
rex.species     # "Canis lupus familiaris"  — from class
rex.name        # "Rex"                     — from instance

# Setting on instance SHADOWS the class attribute for that instance
rex.species = "Canis lupus"
Dog.species     # still "Canis lupus familiaris"
rex.species     # "Canis lupus"              — instance shadow
```

---

## 4. Class Methods and Static Methods

```python
class Temperature:
    def __init__(self, celsius: float):
        self.celsius = celsius

    @classmethod
    def from_fahrenheit(cls, f: float) -> "Temperature":
        """Alternative constructor — receives the class, not an instance."""
        return cls((f - 32) * 5 / 9)

    @staticmethod
    def is_valid(celsius: float) -> bool:
        """Utility method — no access to class or instance."""
        return celsius >= -273.15

    @property
    def fahrenheit(self) -> float:
        """Computed attribute — accessed like a field, not called like a method."""
        return self.celsius * 9 / 5 + 32

t = Temperature.from_fahrenheit(212)
print(t.celsius)      # 100.0
print(t.fahrenheit)   # 212.0 — property
Temperature.is_valid(-300)  # False
```

---

## 5. The Object Model: `__dict__`, `type()`, `id()`

```python
class Point:
    def __init__(self, x, y):
        self.x = x
        self.y = y

p = Point(3, 4)
p.__dict__       # {'x': 3, 'y': 4}  — instance namespace
type(p)          # <class '__main__.Point'>
id(p)            # memory address of the object
isinstance(p, Point)  # True
```

---

## 6. Access Control — Convention, not Enforcement

Python does not have true private members. The convention is:

| Naming | Meaning |
|--------|---------|
| `name` | Public |
| `_name` | Internal / protected by convention (don't use from outside) |
| `__name` | Name-mangled to `_ClassName__name` — harder to access externally |
| `__name__` | Dunder — reserved for Python internals |

```python
class MyClass:
    def __init__(self):
        self.public = 1
        self._internal = 2
        self.__private = 3       # becomes _MyClass__private

obj = MyClass()
obj.public       # 1
obj._internal    # 2 — accessible but "please don't"
obj._MyClass__private  # 3 — name mangling, not truly private
```

---

## 7. `__repr__` and `__str__`

```python
class Vector:
    def __init__(self, x, y):
        self.x = x
        self.y = y

    def __repr__(self):
        """Developer representation — should be unambiguous."""
        return f"Vector({self.x!r}, {self.y!r})"

    def __str__(self):
        """User-facing representation — readable."""
        return f"({self.x}, {self.y})"

v = Vector(3, 4)
repr(v)   # "Vector(3, 4)"
str(v)    # "(3, 4)"
print(v)  # calls __str__
```

If only `__repr__` is defined, it is used for both `repr()` and `str()`.

---

## 8. Comparison and Hashing

```python
from dataclasses import dataclass

@dataclass(eq=True, frozen=True)
class Point:
    x: float
    y: float

# frozen=True makes it immutable and hashable (usable as dict key)
p1 = Point(1, 2)
p2 = Point(1, 2)
p1 == p2   # True — @dataclass generates __eq__
{p1, p2}   # {Point(x=1, y=2)} — one element, they're equal
```

Manual comparison:

```python
class Money:
    def __init__(self, amount, currency):
        self.amount = amount
        self.currency = currency

    def __eq__(self, other):
        if not isinstance(other, Money):
            return NotImplemented
        return self.amount == other.amount and self.currency == other.currency

    def __hash__(self):
        return hash((self.amount, self.currency))
```
