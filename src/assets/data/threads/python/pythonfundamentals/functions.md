## Functions, Arguments and Scope
---

Functions in Python are first-class objects: they can be passed as arguments, returned from other functions, stored in data structures and assigned to variables. Understanding argument kinds and scope rules is essential for writing predictable Python code.

---

## 1. Defining and Calling Functions

```python
def greet(name):
    """Return a greeting string."""
    return f"Hello, {name}!"

message = greet("Alice")   # "Hello, Alice!"
```

- `def` binds the function object to a name in the current scope.
- `return` without a value (or no `return`) returns `None`.
- The docstring (first string literal in the body) is accessible via `func.__doc__`.

---

## 2. Argument Kinds

Python supports five distinct argument kinds, all usable in a single function signature:

```python
def full_example(
    pos_only,        # 1. positional-only (before /)
    /,
    normal,          # 2. positional-or-keyword
    *,
    kw_only,         # 3. keyword-only (after *)
    *args,           # 4. variadic positional
    **kwargs         # 5. variadic keyword
):
    pass
```

**Practical examples:**

```python
# Default values
def connect(host, port=5432, ssl=True):
    ...

connect("db.example.com")          # port=5432, ssl=True
connect("db.example.com", 5433)    # override port
connect("db.example.com", ssl=False)

# *args — collects extra positional arguments into a tuple
def add(*numbers):
    return sum(numbers)

add(1, 2, 3, 4)   # 10

# **kwargs — collects extra keyword arguments into a dict
def tag(name, **attrs):
    attr_str = " ".join(f'{k}="{v}"' for k, v in attrs.items())
    return f"<{name} {attr_str}>"

tag("a", href="/home", class_="nav")   # <a href="/home" class_="nav">
```

---

## 3. Unpacking Operators at Call Sites

```python
args = [1, 2, 3]
kwargs = {"sep": ", ", "end": "\n"}

print(*args)           # print(1, 2, 3)
print(*args, **kwargs) # print(1, 2, 3, sep=", ", end="\n")
```

---

## 4. LEGB Scope Rules

Python resolves names in four nested scopes in this order:

1. **L**ocal — inside the current function.
2. **E**nclosing — in any enclosing functions (for closures).
3. **G**lobal — the module's top-level namespace.
4. **B**uilt-in — names in the `builtins` module (`len`, `print`, etc.).

```python
x = "global"

def outer():
    x = "enclosing"

    def inner():
        x = "local"
        print(x)   # "local"

    inner()
    print(x)       # "enclosing"

outer()
print(x)           # "global"
```

---

## 5. `global` and `nonlocal`

```python
counter = 0

def increment():
    global counter    # refers to module-level counter
    counter += 1

def make_counter():
    count = 0
    def inc():
        nonlocal count   # refers to enclosing function's count
        count += 1
        return count
    return inc

c = make_counter()
c()   # 1
c()   # 2
```

---

## 6. Closures

A closure captures variables from the enclosing scope, keeping them alive after the outer function returns:

```python
def multiplier(factor):
    def multiply(x):
        return x * factor   # factor is captured from enclosing scope
    return multiply

double = multiplier(2)
triple = multiplier(3)

double(5)   # 10
triple(5)   # 15
```

---

## 7. Lambda Functions

Anonymous single-expression functions:

```python
square = lambda x: x ** 2
square(4)   # 16

# Common use: as a sort key
data = [{"name": "Charlie"}, {"name": "Alice"}, {"name": "Bob"}]
data.sort(key=lambda d: d["name"])
```

---

## 8. Mutable Default Arguments — A Common Gotcha

Default values are evaluated **once** at function definition time:

```python
# BUG: the list is shared across all calls
def append_to(item, lst=[]):
    lst.append(item)
    return lst

append_to(1)   # [1]
append_to(2)   # [1, 2]  ← unexpected!

# CORRECT: use None as sentinel
def append_to(item, lst=None):
    if lst is None:
        lst = []
    lst.append(item)
    return lst
```

---

## 9. Type Annotations (Python 3.5+)

Annotations are hints for static analysers and documentation — they are not enforced at runtime:

```python
def add(a: int, b: int) -> int:
    return a + b

def greet(name: str = "World") -> str:
    return f"Hello, {name}"
```
