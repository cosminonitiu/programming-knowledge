## Introduction to Python
---

Python is a high-level, interpreted, dynamically-typed, general-purpose programming language first released by Guido van Rossum in 1991. Its philosophy of readability and simplicity is captured in the Zen of Python (`import this`).

---

## 1. Key Characteristics

- **Interpreted:**  
  Python source code is compiled to bytecode and executed by the CPython virtual machine. There is no separate compilation step required.

- **Dynamically Typed:**  
  Types are resolved at runtime. A variable can hold any type at any time. This speeds up development but shifts some errors from compile-time to runtime.

- **Garbage Collected:**  
  Memory is managed automatically via reference counting supplemented by a cyclic garbage collector.

- **Multi-paradigm:**  
  Supports procedural, object-oriented and functional styles. You can mix them freely within the same program.

- **Batteries Included:**  
  The standard library covers networking, file I/O, data serialisation, regular expressions, testing, concurrency, and much more — without any external dependencies.

---

## 2. Where Python is Used

- **Backend Web Development:** FastAPI, Django, Flask
- **Data Engineering:** PySpark, dbt, Apache Airflow
- **Data Science / ML:** NumPy, Pandas, scikit-learn, TensorFlow, PyTorch
- **Scripting and Automation:** System administration, CI/CD scripts, cloud provisioning
- **Testing:** pytest, Selenium
- **Finance / Quant:** QuantLib, zipline

---

## 3. The Python Execution Model

```python
# Source file: example.py
print("Hello, world!")
```

1. The interpreter reads `example.py`.
2. The parser produces an Abstract Syntax Tree (AST).
3. The compiler converts the AST to bytecode (`.pyc` stored in `__pycache__`).
4. The CPython eval loop executes the bytecode instruction by instruction.

---

## 4. Python Versions

- **Python 2.x** — end-of-life January 2020. Do not use.
- **Python 3.x** — the only supported branch.
  - **3.10** introduced structural pattern matching (`match`/`case`).
  - **3.11** improved error messages significantly and sped up the interpreter ~25%.
  - **3.12** added `type` alias statement, improved f-strings.
  - **3.13** introduced an experimental free-threaded (no-GIL) build.

---

## 5. The Zen of Python (PEP 20)

Key tenets that guide idiomatic Python:

- Beautiful is better than ugly.
- Explicit is better than implicit.
- Simple is better than complex.
- Flat is better than nested.
- Readability counts.
- There should be one — and preferably only one — obvious way to do it.
- Errors should never pass silently, unless explicitly silenced.

---

## 6. Running Python

```python
# Interactive REPL
# $ python3

# Run a script
# $ python3 script.py

# Execute a one-liner
# $ python3 -c "print('hello')"

# Module as script
# $ python3 -m http.server 8080

# Check version
import sys
print(sys.version)  # e.g. 3.12.0
```

---

## 7. PEP — Python Enhancement Proposals

PEPs are the primary mechanism for proposing new features and documenting design decisions:

- **PEP 8** — Style Guide for Python Code (indentation, naming, line length)
- **PEP 20** — The Zen of Python
- **PEP 484** — Type Hints
- **PEP 517/518** — Build system specification (`pyproject.toml`)
- **PEP 634** — Structural Pattern Matching
