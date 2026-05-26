## Control Flow
---

Python control flow constructs include conditionals, loops, and the match/case pattern matching introduced in Python 3.10. Python uses indentation (4 spaces by convention) to delimit blocks — there are no curly braces.

---

## 1. Conditionals — `if / elif / else`

```python
score = 85

if score >= 90:
    grade = "A"
elif score >= 80:
    grade = "B"
elif score >= 70:
    grade = "C"
else:
    grade = "F"

# Ternary (conditional expression)
label = "pass" if score >= 60 else "fail"
```

---

## 2. `for` Loops

`for` iterates over any iterable (list, string, range, generator, dict, …).

```python
# Over a list
for item in ["a", "b", "c"]:
    print(item)

# Over a range
for i in range(5):        # 0, 1, 2, 3, 4
    print(i)

for i in range(2, 10, 2): # 2, 4, 6, 8
    print(i)

# With index — prefer enumerate() over range(len(...))
for idx, value in enumerate(["x", "y", "z"], start=1):
    print(idx, value)

# Iterating dict
config = {"host": "localhost", "port": 5432}
for key, value in config.items():
    print(f"{key} = {value}")
```

---

## 3. `while` Loops

```python
count = 0
while count < 5:
    print(count)
    count += 1

# Infinite loop with break
while True:
    data = input("Enter value (q to quit): ")
    if data == "q":
        break
    process(data)
```

---

## 4. `break`, `continue`, `pass`

- **`break`** — exits the innermost loop immediately.
- **`continue`** — skips the rest of the current iteration.
- **`pass`** — a no-op placeholder (syntactically required empty block).

```python
for n in range(10):
    if n == 3:
        continue   # skip 3
    if n == 7:
        break      # stop at 7
    print(n)       # prints 0,1,2,4,5,6

# pass as placeholder
def not_implemented_yet():
    pass
```

---

## 5. `for`/`while` `else` Clause

The `else` block on a loop runs **only if the loop completed without a `break`**:

```python
for n in range(2, 100):
    for factor in range(2, n):
        if n % factor == 0:
            break
    else:
        print(f"{n} is prime")  # only reached if inner loop didn't break
```

---

## 6. Walrus Operator `:=` (Python 3.8+)

Assigns and returns a value inside an expression:

```python
import re

line = "Error: disk full"
if match := re.search(r"Error: (.+)", line):
    print(match.group(1))  # "disk full"

# Useful in while loops
while chunk := file.read(8192):
    process(chunk)
```

---

## 7. Pattern Matching — `match / case` (Python 3.10+)

Structural pattern matching goes beyond simple value comparison:

```python
def handle_command(command):
    match command.split():
        case ["quit"]:
            return "Quitting"
        case ["go", direction]:
            return f"Going {direction}"
        case ["go", direction, speed]:
            return f"Going {direction} at {speed}"
        case _:
            return f"Unknown command: {command}"

# Matching types and structures
def process(event):
    match event:
        case {"type": "click", "x": x, "y": y}:
            print(f"Click at {x},{y}")
        case {"type": "keypress", "key": str(k)}:
            print(f"Key pressed: {k}")
        case _:
            print("Unknown event")
```

---

## 8. Exception Control Flow

```python
try:
    result = 10 / 0
except ZeroDivisionError:
    result = 0
except (TypeError, ValueError) as e:
    print(f"Error: {e}")
else:
    print("No exception occurred")   # runs only if no exception
finally:
    print("Always runs")             # cleanup

# Raising exceptions
def validate_age(age):
    if age < 0:
        raise ValueError(f"Age cannot be negative: {age}")
    return age
```
