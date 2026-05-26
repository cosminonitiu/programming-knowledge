## Inheritance and Polymorphism
---

Python supports single and multiple inheritance. The Method Resolution Order (MRO) defines which class's method is called when names collide in a complex hierarchy. Duck typing means you rarely need explicit inheritance — if an object has the right methods, it works.

---

## 1. Single Inheritance

```python
class Animal:
    def __init__(self, name: str):
        self.name = name

    def speak(self) -> str:
        raise NotImplementedError

    def __repr__(self):
        return f"{type(self).__name__}(name={self.name!r})"

class Dog(Animal):
    def speak(self) -> str:
        return f"{self.name} says Woof!"

class Cat(Animal):
    def speak(self) -> str:
        return f"{self.name} says Meow!"

animals = [Dog("Rex"), Cat("Whiskers")]
for animal in animals:
    print(animal.speak())   # polymorphism — same interface, different behaviour
```

---

## 2. `super()` — Calling the Parent

```python
class Vehicle:
    def __init__(self, make: str, model: str):
        self.make = make
        self.model = model

class ElectricVehicle(Vehicle):
    def __init__(self, make: str, model: str, range_km: int):
        super().__init__(make, model)   # delegate to Vehicle.__init__
        self.range_km = range_km

ev = ElectricVehicle("Tesla", "Model 3", 560)
print(ev.make, ev.range_km)
```

---

## 3. Multiple Inheritance

Python allows a class to inherit from multiple parents:

```python
class Flyable:
    def fly(self):
        return "I can fly!"

class Swimmable:
    def swim(self):
        return "I can swim!"

class Duck(Animal, Flyable, Swimmable):
    def speak(self):
        return "Quack!"

donald = Duck("Donald")
donald.fly()    # "I can fly!"
donald.swim()   # "I can swim!"
donald.speak()  # "Quack!"
```

---

## 4. Method Resolution Order (MRO)

Python uses the **C3 linearisation** algorithm to compute the MRO — the order in which classes are searched for a method:

```python
class A:
    def method(self): return "A"

class B(A):
    def method(self): return "B"

class C(A):
    def method(self): return "C"

class D(B, C):
    pass

D.__mro__   # (D, B, C, A, object)
D().method()  # "B"  — follows MRO

# Inspect MRO
print(D.__mro__)
# Or:
import inspect
inspect.getmro(D)
```

---

## 5. Mixin Pattern

Mixins are small classes designed to add a specific behaviour to another class:

```python
class TimestampMixin:
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        from datetime import datetime, timezone
        self.created_at = datetime.now(timezone.utc)
        self.updated_at = self.created_at

class SerializeMixin:
    def to_dict(self):
        return {k: v for k, v in self.__dict__.items() if not k.startswith("_")}

class User(TimestampMixin, SerializeMixin):
    def __init__(self, name: str, email: str):
        super().__init__()
        self.name = name
        self.email = email

user = User("Alice", "alice@example.com")
print(user.to_dict())
print(user.created_at)
```

---

## 6. Duck Typing

Python's type system is based on duck typing: "If it walks like a duck and quacks like a duck, it's a duck."

```python
def make_it_speak(animal):
    # No type check needed — any object with .speak() works
    return animal.speak()

class Robot:
    def speak(self):
        return "Beep boop"

make_it_speak(Dog("Rex"))    # works
make_it_speak(Robot())       # also works — not an Animal!
```

---

## 7. `isinstance()` and `issubclass()`

```python
dog = Dog("Rex")
isinstance(dog, Dog)       # True
isinstance(dog, Animal)    # True  — checks the whole hierarchy
issubclass(Dog, Animal)    # True
issubclass(Dog, Cat)       # False

# Check against multiple types
isinstance(dog, (Dog, Cat))  # True
```

---

## 8. Abstract Base Classes

Use `abc.ABC` to enforce interface contracts:

```python
from abc import ABC, abstractmethod

class Shape(ABC):
    @abstractmethod
    def area(self) -> float:
        ...

    @abstractmethod
    def perimeter(self) -> float:
        ...

class Circle(Shape):
    def __init__(self, radius: float):
        self.radius = radius

    def area(self) -> float:
        import math
        return math.pi * self.radius ** 2

    def perimeter(self) -> float:
        import math
        return 2 * math.pi * self.radius

# Shape()       # TypeError: Can't instantiate abstract class
c = Circle(5)   # OK
```

---

## 9. Cooperative Multiple Inheritance with `super()`

When all classes in a hierarchy cooperatively call `super().__init__()`, `**kwargs` flows correctly through the MRO:

```python
class Base:
    def __init__(self, **kwargs):
        super().__init__(**kwargs)

class LogMixin(Base):
    def __init__(self, log_level="INFO", **kwargs):
        super().__init__(**kwargs)
        self.log_level = log_level

class CacheMixin(Base):
    def __init__(self, cache_size=128, **kwargs):
        super().__init__(**kwargs)
        self.cache_size = cache_size

class Service(LogMixin, CacheMixin, Base):
    def __init__(self, name, **kwargs):
        super().__init__(**kwargs)
        self.name = name

svc = Service("api", log_level="DEBUG", cache_size=256)
```
