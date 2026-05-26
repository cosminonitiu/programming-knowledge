## Metaclasses
---

A metaclass is the "class of a class" — it controls how a class is created. When Python processes a `class` statement, it calls the metaclass to build the class object. Understanding metaclasses reveals how Python's object model works at its deepest level.

---

## 1. Everything is an Object

In Python, classes are objects too. The type of a class is its metaclass:

```python
class Foo:
    pass

type(Foo)       # <class 'type'>
type(int)       # <class 'type'>
type(type)      # <class 'type'>  — type is its own metaclass!

isinstance(Foo, type)  # True — Foo is an instance of type
```

`type` is the default metaclass for all classes. A class statement is essentially syntactic sugar for:

```python
# class Foo(Base): body   is equivalent to:
Foo = type("Foo", (Base,), {"attr": value, "method": func})
```

---

## 2. `type()` as a Class Factory

```python
# Create classes dynamically
Dog = type("Dog", (object,), {
    "species": "Canis lupus familiaris",
    "bark": lambda self: "Woof!",
    "__init__": lambda self, name: setattr(self, "name", name),
})

d = Dog("Rex")
d.bark()      # 'Woof!'
Dog.species   # 'Canis lupus familiaris'
```

---

## 3. Writing a Metaclass

```python
class SingletonMeta(type):
    """Metaclass that enforces the Singleton pattern."""
    _instances = {}

    def __call__(cls, *args, **kwargs):
        if cls not in cls._instances:
            cls._instances[cls] = super().__call__(*args, **kwargs)
        return cls._instances[cls]

class Database(metaclass=SingletonMeta):
    def __init__(self):
        self.connection = create_connection()

db1 = Database()
db2 = Database()
db1 is db2   # True — same instance
```

---

## 4. Metaclass Hooks

The metaclass can intercept three key moments in class creation:

```python
class TracingMeta(type):
    def __new__(mcs, name, bases, namespace):
        """Called first — create the class object."""
        print(f"Creating class: {name}")
        print(f"  Bases: {bases}")
        print(f"  Attributes: {list(namespace.keys())}")
        return super().__new__(mcs, name, bases, namespace)

    def __init__(cls, name, bases, namespace):
        """Called after __new__ — initialise the class object."""
        super().__init__(name, bases, namespace)
        cls._created_at = time.time()

    def __call__(cls, *args, **kwargs):
        """Called when the class is instantiated — i.e., MyClass()."""
        print(f"Instantiating {cls.__name__}")
        return super().__call__(*args, **kwargs)

class MyModel(metaclass=TracingMeta):
    value: int = 0
```

---

## 5. Practical Use Cases

```python
# 1. Auto-registering plugins
class PluginMeta(type):
    registry: dict[str, type] = {}

    def __new__(mcs, name, bases, namespace):
        cls = super().__new__(mcs, name, bases, namespace)
        if bases:  # skip the base Plugin class itself
            mcs.registry[name] = cls
        return cls

class Plugin(metaclass=PluginMeta):
    pass

class JSONPlugin(Plugin): ...
class XMLPlugin(Plugin): ...

PluginMeta.registry  # {"JSONPlugin": <class>, "XMLPlugin": <class>}

# 2. Enforcing interface contracts
class ABCMeta(type):
    def __new__(mcs, name, bases, namespace):
        required = {"save", "load", "validate"}
        missing = required - set(namespace)
        if bases and missing:
            raise TypeError(f"{name} must implement: {missing}")
        return super().__new__(mcs, name, bases, namespace)
```

---

## 6. `__init_subclass__` — Lighter Alternative

For most use cases, `__init_subclass__` is simpler than writing a full metaclass:

```python
class Registry:
    _registry: dict[str, type] = {}

    def __init_subclass__(cls, name: str = None, **kwargs):
        super().__init_subclass__(**kwargs)
        key = name or cls.__name__
        Registry._registry[key] = cls

class PluginA(Registry): ...
class PluginB(Registry, name="json_plugin"): ...

Registry._registry  # {"PluginA": ..., "json_plugin": ...}
```

---

## 7. `__class_getitem__` — Custom Generic Syntax

```python
class TypedList:
    def __class_getitem__(cls, item):
        """Support TypedList[int] syntax."""
        return type(f"TypedList[{item.__name__}]", (cls,), {"_type": item})

TypedList[int]       # a specialised subclass
TypedList[str]       # another specialised subclass
```

---

## 8. When to Use Metaclasses

- When `__init_subclass__`, `class decorators`, or `__set_name__` are insufficient.
- Framework-level code: ORMs (SQLAlchemy), plugin systems, serialisation frameworks.
- When you need to intercept `__call__` (singleton, caching constructors).
- Almost always a sign you're writing infrastructure, not application code.

> "Metaclasses are deeper magic than 99% of users should ever worry about. If you wonder whether you need them, you don't." — Tim Peters
