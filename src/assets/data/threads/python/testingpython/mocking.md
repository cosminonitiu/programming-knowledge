## Mocking with `unittest.mock`
---

Mocking replaces real dependencies (APIs, databases, file systems) with controlled substitutes during testing. Python's `unittest.mock` module provides `MagicMock`, `patch`, and related utilities.

---

## 1. `MagicMock` — The Universal Mock

```python
from unittest.mock import MagicMock

mock = MagicMock()

# Any attribute access returns a new MagicMock
mock.some_attribute      # MagicMock
mock.method(1, 2)        # MagicMock — callable by default

# Configure return values
mock.method.return_value = 42
mock.method(1, 2)        # 42

# Configure multiple calls
mock.method.side_effect = [1, 2, 3]
mock.method()    # 1
mock.method()    # 2
mock.method()    # 3

# Make it raise an exception
mock.method.side_effect = ValueError("bad input")
mock.method()    # raises ValueError
```

---

## 2. Assertions on Calls

```python
from unittest.mock import MagicMock

mock = MagicMock()
mock.do_work(1, key="value")

mock.do_work.assert_called()
mock.do_work.assert_called_once()
mock.do_work.assert_called_with(1, key="value")
mock.do_work.assert_called_once_with(1, key="value")
mock.do_work.assert_not_called()

# Inspect call history
mock.do_work.call_count              # 1
mock.do_work.call_args               # call(1, key='value')
mock.do_work.call_args_list          # [call(1, key='value')]
```

---

## 3. `patch` — Replace Objects in Modules

The most important rule: **patch where the object is used, not where it's defined**.

```python
# myapp/service.py
import requests

def get_user(user_id: int):
    response = requests.get(f"https://api.example.com/users/{user_id}")
    return response.json()
```

```python
from unittest.mock import patch, MagicMock

# patch as context manager
def test_get_user():
    with patch("myapp.service.requests.get") as mock_get:  # patch WHERE IT'S USED
        mock_get.return_value.json.return_value = {"id": 1, "name": "Alice"}
        result = get_user(1)

    assert result == {"id": 1, "name": "Alice"}
    mock_get.assert_called_once_with("https://api.example.com/users/1")

# patch as decorator
@patch("myapp.service.requests.get")
def test_get_user_decorator(mock_get):
    mock_get.return_value.json.return_value = {"id": 2, "name": "Bob"}
    result = get_user(2)
    assert result["name"] == "Bob"
```

---

## 4. `patch.object` — Patch a Specific Attribute

```python
from unittest.mock import patch

class EmailService:
    def send(self, to, subject, body): ...

service = EmailService()

with patch.object(service, "send", return_value=True) as mock_send:
    service.send("user@example.com", "Welcome!", "Hello!")
    mock_send.assert_called_once()
```

---

## 5. `patch.dict` — Patch Dictionaries / Environment Variables

```python
import os
from unittest.mock import patch

def test_env_config():
    with patch.dict(os.environ, {"DATABASE_URL": "sqlite://", "DEBUG": "true"}):
        config = load_config()
        assert config.database_url == "sqlite://"
```

---

## 6. `spec` — Mock Matching a Real Interface

Without `spec`, mocks accept any attribute or call. With `spec`, accessing a non-existent attribute raises `AttributeError`:

```python
from unittest.mock import MagicMock, create_autospec

class UserRepository:
    def find_by_id(self, id: int): ...
    def save(self, user): ...

# create_autospec mirrors the real interface
mock_repo = create_autospec(UserRepository)
mock_repo.find_by_id(1)      # OK
mock_repo.nonexistent(1)     # AttributeError!

# spec= on MagicMock
mock = MagicMock(spec=UserRepository)
```

---

## 7. `AsyncMock` — Mocking Async Functions

```python
from unittest.mock import AsyncMock, patch
import pytest

async def fetch_user(session, user_id: int):
    response = await session.get(f"/users/{user_id}")
    return await response.json()

@pytest.mark.asyncio
async def test_fetch_user():
    mock_session = AsyncMock()
    mock_response = AsyncMock()
    mock_response.json.return_value = {"id": 1, "name": "Alice"}
    mock_session.get.return_value = mock_response

    result = await fetch_user(mock_session, 1)
    assert result["name"] == "Alice"
    mock_session.get.assert_awaited_once_with("/users/1")
```

---

## 8. `pytest-mock` Plugin — `mocker` Fixture

```python
# pip install pytest-mock

def test_with_mocker(mocker):
    mock_get = mocker.patch("myapp.service.requests.get")
    mock_get.return_value.json.return_value = {"id": 1}
    result = get_user(1)
    assert result == {"id": 1}
    # No need for context manager — cleanup is automatic after test
```

---

## 9. `side_effect` with a Function

```python
def raise_on_bad_id(url, **kwargs):
    if "999" in url:
        raise ConnectionError("Not found")
    return MagicMock(json=lambda: {"id": 1})

with patch("requests.get", side_effect=raise_on_bad_id):
    assert get_user(1)["id"] == 1
    with pytest.raises(ConnectionError):
        get_user(999)
```
