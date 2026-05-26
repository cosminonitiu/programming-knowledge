## Data Types and Variables
---

Python variables are references (pointers) to objects in memory. Every object has a type, a value and an identity (`id()`). Types are resolved at runtime; there is no declaration syntax.

---

## 1. Numeric Types

- **`int`** — arbitrary precision integers. No overflow.
- **`float`** — IEEE 754 double-precision (64-bit).
- **`complex`** — `3 + 4j` (real + imaginary).
- **`decimal.Decimal`** — arbitrary-precision decimal arithmetic; use for money.
- **`fractions.Fraction`** — exact rational numbers.

```python
x = 42          # int
y = 3.14        # float
z = 2 + 3j      # complex
big = 10 ** 100 # Python ints have no max size

from decimal import Decimal
price = Decimal("19.99")  # exact, no float rounding
```

---

## 2. Text Type — `str`

- Unicode by default (UTF-8 encoded source files).
- Immutable — every operation returns a new string.
- Triple quotes `"""..."""` for multi-line strings.
- f-strings (`f"Hello {name}"`) are the idiomatic formatting approach.

```python
name = "Alice"
greeting = f"Hello, {name}!"   # f-string (PEP 498)
multi = """line one
line two"""

# Common methods
"hello".upper()        # "HELLO"
"  hello  ".strip()    # "hello"
"a,b,c".split(",")     # ["a", "b", "c"]
",".join(["a","b","c"])# "a,b,c"
"hello".replace("l","r") # "herro"
```

---

## 3. Boolean Type — `bool`

`bool` is a subclass of `int`. `True == 1` and `False == 0`.

```python
print(True + True)   # 2
print(bool(0))       # False
print(bool(""))      # False  — empty string is falsy
print(bool([]))      # False  — empty list is falsy
print(bool(None))    # False
```

**Falsy values:** `0`, `0.0`, `""`, `[]`, `{}`, `()`, `set()`, `None`, `False`.  
Everything else is truthy.

---

## 4. None

`None` is the singleton representing the absence of a value. It is its own type (`NoneType`). Always check with `is None`, not `== None`.

```python
result = None
if result is None:
    print("No result yet")
```

---

## 5. Type Inspection

```python
x = 42
type(x)           # <class 'int'>
isinstance(x, int)  # True  — preferred for type checking
isinstance(x, (int, float))  # True — multiple types
```

---

## 6. Mutability

| Type | Mutable? |
|------|----------|
| `int`, `float`, `str`, `bool`, `tuple`, `frozenset`, `bytes` | No |
| `list`, `dict`, `set`, `bytearray` | Yes |

Immutable objects can safely be used as dictionary keys. Mutable objects cannot.

```python
a = [1, 2, 3]
b = a             # both reference the same list
b.append(4)
print(a)          # [1, 2, 3, 4]  — mutated through b!

# To copy:
c = a.copy()      # shallow copy
import copy
d = copy.deepcopy(a)  # deep copy
```

---

## 7. Type Coercion and Conversion

Python does **not** do implicit type coercion between unrelated types (unlike JavaScript). Conversions must be explicit:

```python
int("42")       # 42
float("3.14")   # 3.14
str(100)        # "100"
bool(1)         # True
list((1,2,3))   # [1, 2, 3]
tuple([1,2,3])  # (1, 2, 3)
```

---

## 8. Variable Assignment

```python
# Simple assignment
x = 10

# Multiple assignment
a, b, c = 1, 2, 3

# Swap
a, b = b, a

# Augmented assignment
x += 5   # x = x + 5
x *= 2

# Walrus operator (Python 3.8+) — assign and test
if n := len(data) > 10:
    print(f"Too many items: {n}")
```
