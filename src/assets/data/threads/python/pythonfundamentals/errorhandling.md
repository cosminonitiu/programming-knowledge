## Error Handling and Exceptions
---

Python uses exceptions for error signalling. The exception hierarchy is a class hierarchy; catching a base class catches all its subclasses. Structured `try/except/else/finally` blocks provide fine-grained control over error handling and cleanup.

---

## 1. The Exception Hierarchy

```
BaseException
├── SystemExit          # raised by sys.exit()
├── KeyboardInterrupt   # raised by Ctrl+C
├── GeneratorExit       # raised inside generators
└── Exception           # base for all "normal" exceptions
    ├── ArithmeticError
    │   ├── ZeroDivisionError
    │   └── OverflowError
    ├── LookupError
    │   ├── IndexError
    │   └── KeyError
    ├── ValueError
    ├── TypeError
    ├── AttributeError
    ├── IOError / OSError
    │   └── FileNotFoundError
    ├── ImportError
    │   └── ModuleNotFoundError
    ├── RuntimeError
    ├── StopIteration
    └── ... (many more)
```

Always catch the most specific exception type possible. Catching bare `Exception` or `BaseException` is usually a code smell.

---

## 2. `try / except / else / finally`

```python
def divide(a, b):
    try:
        result = a / b          # code that might raise
    except ZeroDivisionError:
        print("Cannot divide by zero")
        return None
    except TypeError as e:
        print(f"Type error: {e}")
        return None
    else:
        # Runs ONLY if NO exception was raised
        print(f"Result: {result}")
        return result
    finally:
        # ALWAYS runs — even if exception was re-raised
        print("Cleanup done")
```

---

## 3. Catching Multiple Exception Types

```python
try:
    value = int(user_input)
except (ValueError, TypeError) as e:
    print(f"Conversion failed: {e}")
```

---

## 4. Re-raising and Exception Chaining

```python
try:
    connect_to_db()
except ConnectionError as e:
    # Re-raise preserving the original traceback
    raise

# Chain exceptions — preserve cause
try:
    data = json.loads(raw)
except json.JSONDecodeError as e:
    raise ValueError("Invalid config file") from e

# Suppress chaining
raise ValueError("Something went wrong") from None
```

---

## 5. Custom Exceptions

Subclass `Exception` (not `BaseException`) for application-specific errors:

```python
class AppError(Exception):
    """Base class for all application exceptions."""

class DatabaseError(AppError):
    def __init__(self, message, query=None):
        super().__init__(message)
        self.query = query

class RecordNotFoundError(DatabaseError):
    pass

# Usage
try:
    user = get_user(user_id)
except RecordNotFoundError as e:
    return {"error": "User not found"}
except DatabaseError as e:
    logger.error("DB error during query: %s", e.query)
    raise
```

---

## 6. Context Managers and `contextlib.suppress`

```python
from contextlib import suppress

# Silently ignore specific exceptions
with suppress(FileNotFoundError):
    Path("optional_file.txt").unlink()

# Equivalent to:
try:
    Path("optional_file.txt").unlink()
except FileNotFoundError:
    pass
```

---

## 7. Raising Exceptions

```python
def validate_age(age: int) -> int:
    if not isinstance(age, int):
        raise TypeError(f"Expected int, got {type(age).__name__}")
    if age < 0:
        raise ValueError(f"Age must be non-negative, got {age}")
    return age

# Assert (for invariants in development, not user input validation)
assert len(items) > 0, "Items list must not be empty"
```

> **Note:** Never use `assert` for validating user input — assertions can be disabled with `python -O`.

---

## 8. `warnings` Module

```python
import warnings

def old_function():
    warnings.warn(
        "old_function is deprecated, use new_function instead",
        DeprecationWarning,
        stacklevel=2   # points to caller, not this function
    )

# Suppress warnings in tests
with warnings.catch_warnings():
    warnings.simplefilter("ignore", DeprecationWarning)
    old_function()
```

---

## 9. Best Practices

- **Be specific:** Catch the narrowest applicable exception type.
- **Don't swallow exceptions silently:** At minimum, log them.
- **Use `finally` for cleanup:** Or better, use context managers.
- **Add context when re-raising:** Use `raise ... from` to preserve cause.
- **Define a hierarchy:** Group related exceptions under a common base class for your application.
- **Avoid bare `except:`:** This catches even `KeyboardInterrupt` and `SystemExit`.

```python
# BAD
try:
    do_something()
except:
    pass

# GOOD
try:
    do_something()
except Exception as e:
    logger.exception("Unexpected error in do_something")
    raise
```
