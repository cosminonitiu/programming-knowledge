## Test-Driven Development (TDD)
---

TDD is a development workflow where you write failing tests before writing the implementation. The discipline of the Red-Green-Refactor cycle leads to better-designed, more testable code.

---

## 1. The Red-Green-Refactor Cycle

```
┌──────────┐     Write a failing test
│   RED    │ ──→ (test fails because feature doesn't exist)
└──────────┘
      │
      ▼
┌──────────┐     Write the minimum code to make it pass
│  GREEN   │ ──→ (don't worry about elegance yet)
└──────────┘
      │
      ▼
┌──────────┐     Clean up and improve the code
│ REFACTOR │ ──→ (tests still pass after refactoring)
└──────────┘
      │
      └──── repeat
```

---

## 2. TDD Example: Building a Stack

**Step 1 — Red:** Write failing tests first.

```python
# test_stack.py
import pytest
from stack import Stack   # doesn't exist yet!

def test_new_stack_is_empty():
    s = Stack()
    assert s.is_empty()

def test_push_makes_non_empty():
    s = Stack()
    s.push(1)
    assert not s.is_empty()

def test_pop_returns_last_pushed():
    s = Stack()
    s.push(1)
    s.push(2)
    assert s.pop() == 2

def test_pop_empty_raises():
    s = Stack()
    with pytest.raises(IndexError):
        s.pop()

def test_peek_does_not_remove():
    s = Stack()
    s.push(42)
    assert s.peek() == 42
    assert s.peek() == 42   # still there
```

**Step 2 — Green:** Write the minimum implementation.

```python
# stack.py
class Stack:
    def __init__(self):
        self._data = []

    def is_empty(self) -> bool:
        return len(self._data) == 0

    def push(self, item) -> None:
        self._data.append(item)

    def pop(self):
        if self.is_empty():
            raise IndexError("pop from empty stack")
        return self._data.pop()

    def peek(self):
        if self.is_empty():
            raise IndexError("peek from empty stack")
        return self._data[-1]
```

**Step 3 — Refactor:** Can we improve the code? Tests ensure we don't break anything.

---

## 3. Test-First Design Benefits

```python
# Writing the test first forces you to think about the API:

# If writing the test feels awkward, the API is probably bad.
# Example: test that's hard to write → code smell
def test_create_invoice_bad():
    invoice = Invoice()
    invoice.set_customer_id(1)
    invoice.set_items([...])
    invoice.set_discount(10)
    invoice.calculate()
    invoice.validate()
    assert invoice.total == 90.0

# Refactor to a better API (revealed by the pain of testing):
def test_create_invoice_good():
    items = [Item("widget", 100.0)]
    invoice = Invoice.create(customer_id=1, items=items, discount=10)
    assert invoice.total == 90.0
```

---

## 4. Arrange-Act-Assert (AAA) Pattern

Every test should have three clearly separated phases:

```python
def test_user_registration():
    # Arrange — set up state and dependencies
    repo = InMemoryUserRepository()
    email_service = MagicMock()
    service = UserService(repo, email_service)
    registration_data = {"email": "alice@example.com", "password": "secret123"}

    # Act — execute the thing under test
    user = service.register(registration_data)

    # Assert — verify the outcome
    assert user.email == "alice@example.com"
    assert repo.find_by_email("alice@example.com") is not None
    email_service.send_welcome.assert_called_once_with(user)
```

---

## 5. Testing with Fakes vs Mocks

```python
# Fake — a simplified working implementation (preferred when possible)
class InMemoryUserRepository:
    def __init__(self):
        self._users: dict[int, User] = {}
        self._next_id = 1

    def save(self, user: User) -> User:
        user.id = self._next_id
        self._users[self._next_id] = user
        self._next_id += 1
        return user

    def find_by_id(self, id: int) -> User | None:
        return self._users.get(id)

# Mock — synthetic stand-in (use when behaviour needs verification)
mock_repo = MagicMock(spec=UserRepository)
mock_repo.save.return_value = User(id=1, email="a@b.com")
```

---

## 6. Continuous Integration with TDD

```yaml
# .github/workflows/test.yml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-python@v5
        with:
          python-version: "3.11"
      - run: pip install -r requirements-dev.txt
      - run: pytest --tb=short --cov=src --cov-report=term-missing
```

---

## 7. What NOT to Test

- Third-party library internals (they have their own tests).
- Private implementation details (`_private_method`).
- Trivial getters/setters with no logic.
- Framework boilerplate.

**Focus tests on behaviour (what the code does), not implementation (how it does it).**

---

## 8. Coverage

```bash
pip install pytest-cov

pytest --cov=src --cov-report=term-missing
pytest --cov=src --cov-report=html          # open htmlcov/index.html
pytest --cov=src --cov-fail-under=80        # fail if coverage < 80%
```

Coverage is a tool to find untested paths, not a goal unto itself. 100% coverage with bad tests is worse than 80% coverage with good tests.
