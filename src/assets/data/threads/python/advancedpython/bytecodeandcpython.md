## Python Bytecode and CPython Internals
---

Understanding how CPython compiles and executes Python code reveals why certain patterns are faster, how to inspect the interpreter's work, and how to reason about Python's execution model.

---

## 1. Compilation Pipeline

```
Python source (.py)
      │
      ▼  tokeniser → parser → AST
Abstract Syntax Tree (AST)
      │
      ▼  compiler
Code Objects (.pyc bytecode)
      │
      ▼  CPython eval loop
Execution (result)
```

```python
import ast

source = "x = 1 + 2"
tree = ast.parse(source)
print(ast.dump(tree, indent=2))
# Module(body=[Assign(targets=[Name(id='x')], value=BinOp(...))])
```

---

## 2. Code Objects

Every function and module compiles to a **code object**:

```python
def add(a, b):
    return a + b

code = add.__code__
code.co_name       # 'add'
code.co_varnames   # ('a', 'b')
code.co_argcount   # 2
code.co_consts     # (None,)
code.co_filename   # '<stdin>'
code.co_firstlineno # 1
```

---

## 3. `dis` Module — Disassembler

```python
import dis

def greet(name: str) -> str:
    return f"Hello, {name}!"

dis.dis(greet)
# Disassembly of greet:
#   2           0 RESUME                   0
#
#   3           2 LOAD_CONST               1 ('Hello, ')
#               4 LOAD_FAST                0 (name)
#               6 FORMAT_VALUE             0
#               8 BUILD_STRING             2
#              10 RETURN_VALUE
```

Common opcodes:

| Opcode | Description |
|--------|-------------|
| `LOAD_FAST` | Load a local variable onto the stack |
| `LOAD_GLOBAL` | Load a global variable |
| `LOAD_CONST` | Push a constant (literal) |
| `CALL` | Call a callable |
| `BINARY_OP` | Binary operation (+, -, *, /) |
| `RETURN_VALUE` | Return top of stack |
| `STORE_FAST` | Store TOS into local variable |

---

## 4. The Eval Loop

CPython executes bytecode in `ceval.c` using a **switch-dispatch loop** over opcodes. Each frame on the call stack has:

- **code object** — the bytecode instructions
- **locals dict** (or optimised array for functions)
- **value stack** — operands for instructions
- **instruction pointer** — current opcode position

```python
import sys

def count_frames():
    frame = sys._getframe()
    n = 0
    while frame:
        n += 1
        frame = frame.f_back
    return n

# Inspect current frame
frame = sys._getframe(0)   # 0 = current, 1 = caller, etc.
frame.f_locals
frame.f_lineno
frame.f_code.co_name
```

---

## 5. `.pyc` Files and `__pycache__`

CPython caches compiled bytecode in `__pycache__/module.cpython-311.pyc`. The cache is invalidated when:
- The source file's mtime changes.
- The Python version changes.

```python
import py_compile, compileall

py_compile.compile("mymodule.py")            # compile single file
compileall.compile_dir("mypackage/")          # compile entire package
python -m compileall mypackage/               # same from command line
```

---

## 6. Python Object Model

In CPython, every Python object is a C `PyObject` struct:

```c
typedef struct _object {
    Py_ssize_t ob_refcnt;      // reference count
    PyTypeObject *ob_type;     // pointer to the type (class)
} PyObject;
```

```python
import ctypes
import sys

x = 42
sys.getrefcount(x)         # reference count
id(x)                       # memory address of the object
type(x)                     # PyTypeObject → int

# Small integers (-5 to 256) are cached (interned)
a = 256
b = 256
a is b   # True — same object

a = 257
b = 257
a is b   # False — different objects
```

---

## 7. String Interning

CPython interns (deduplicates) string literals that look like identifiers:

```python
a = "hello"
b = "hello"
a is b     # True — interned

a = "hello world"
b = "hello world"
a is b     # False (usually) — not interned (contains space)

# Force interning
import sys
a = sys.intern("hello world")
b = sys.intern("hello world")
a is b   # True
```

---

## 8. Performance Implications

```python
# Local variable access (LOAD_FAST) is faster than global (LOAD_GLOBAL)
import math

def slow_sqrt(values):
    return [math.sqrt(v) for v in values]   # LOAD_GLOBAL on each iteration

def fast_sqrt(values):
    sqrt = math.sqrt   # bind to local
    return [sqrt(v) for v in values]         # LOAD_FAST — significantly faster

# Constant folding: Python folds constant expressions at compile time
dis.dis(lambda: 2 * 3 * 4)
# Shows LOAD_CONST 24 — the multiplication was done at compile time!
```
