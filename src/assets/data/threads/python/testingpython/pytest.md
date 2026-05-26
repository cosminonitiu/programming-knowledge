## pytest
---

`pytest` is the most widely used Python testing framework. It offers simpler syntax, powerful introspection for failures, rich plugins, and a flexible fixture system that makes `unittest` feel boilerplate-heavy by comparison.

---

## 1. Basic Test Structure

```python
# test_calculator.py — no class required

def add(a, b): return a + b

def test_add():
    assert add(2, 3) == 5   # plain assert — pytest rewrites for detailed output

def test_add_negative():
    assert add(-1, -2) == -3

def test_add_zero():
    assert add(0, 0) == 0
```

```bash
pytest                        # discover and run all tests
pytest test_calculator.py     # run specific file
pytest test_calculator.py::test_add  # run specific test
pytest -v                     # verbose output
pytest -s                     # don't capture stdout (print() output visible)
pytest -x                     # stop on first failure
pytest --tb=short             # shorter traceback format
```

---

## 2. Assertions and Error Output

pytest rewrites `assert` statements to show you exactly what failed:

```python
def test_dict():
    result = compute()
    expected = {"a": 1, "b": 2}
    assert result == expected
    # On failure, pytest shows:
    # E  AssertionError: assert {'a': 1, 'b': 3} == {'a': 1, 'b': 2}
    # E  Diff: {'b': 3} != {'b': 2}

def test_exception():
    import pytest
    with pytest.raises(ValueError, match="cannot be zero"):
        divide(10, 0)
```

---

## 3. Parametrize

Run the same test with multiple inputs without duplicating code:

```python
import pytest

@pytest.mark.parametrize("a, b, expected", [
    (1, 2, 3),
    (0, 0, 0),
    (-1, 1, 0),
    (100, 200, 300),
])
def test_add(a, b, expected):
    assert add(a, b) == expected

# parametrize with ids for readable output
@pytest.mark.parametrize("value,valid", [
    ("alice@example.com", True),
    ("not-an-email", False),
    ("@nodomain.com", False),
], ids=["valid_email", "no_at", "no_local"])
def test_email_validation(value, valid):
    assert is_valid_email(value) == valid
```

---

## 4. Markers

```python
import pytest

@pytest.mark.slow
def test_large_dataset():
    ...

@pytest.mark.integration
def test_database_connection():
    ...

@pytest.mark.skip(reason="Not implemented")
def test_future():
    ...

@pytest.mark.skipif(sys.platform == "win32", reason="Unix only")
def test_unix():
    ...

@pytest.mark.xfail(reason="Known bug #123")
def test_broken():
    ...
```

```bash
pytest -m "not slow"           # exclude slow tests
pytest -m "integration"        # run only integration tests
```

Register markers in `pytest.ini`:
```ini
[pytest]
markers =
    slow: marks tests as slow
    integration: marks integration tests
```

---

## 5. Conftest and Shared Configuration

`conftest.py` is auto-loaded by pytest — use it for shared fixtures and plugins:

```python
# conftest.py
import pytest
from myapp import create_app, db

@pytest.fixture(scope="session")
def app():
    app = create_app(testing=True)
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

@pytest.fixture
def client(app):
    return app.test_client()
```

---

## 6. pytest.ini / pyproject.toml Configuration

```toml
# pyproject.toml
[tool.pytest.ini_options]
testpaths = ["tests"]
addopts = "-v --tb=short -ra"
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
```

---

## 7. Capturing Output and Monkeypatching

```python
def test_stdout(capsys):
    print("hello")
    captured = capsys.readouterr()
    assert captured.out == "hello\n"

def test_env_var(monkeypatch):
    monkeypatch.setenv("DATABASE_URL", "sqlite:///:memory:")
    assert os.environ["DATABASE_URL"] == "sqlite:///:memory:"

def test_function_replaced(monkeypatch):
    monkeypatch.setattr("mymodule.expensive_call", lambda: "mocked")
    result = function_that_calls_expensive()
    assert result == "mocked"
```

---

## 8. Running Specific Tests

```bash
pytest -k "test_add"              # keyword expression
pytest -k "add and not negative"  # compound expression
pytest --collect-only             # show which tests would run without running
pytest -v --no-header             # compact output
pytest --lf                       # run only last failed tests
pytest --ff                       # run failed tests first
```
