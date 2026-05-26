## Testing FastAPI Applications
---

FastAPI provides a `TestClient` (synchronous, wraps `httpx`) and supports async testing with `AsyncClient`. Tests should be independent, fast, and use dependency overrides instead of hitting real services.

---

## 1. `TestClient` — Synchronous Testing

```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_read_root():
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello, World!"}

def test_create_user():
    response = client.post("/users", json={"email": "a@b.com", "password": "secret123"})
    assert response.status_code == 201
    data = response.json()
    assert data["email"] == "a@b.com"
    assert "id" in data
    assert "password" not in data   # ensure password not leaked
```

---

## 2. Dependency Overrides — Replace Real Services

```python
from fastapi.testclient import TestClient
from main import app
from dependencies.db import get_db

def override_get_db():
    """Use in-memory SQLite for tests."""
    db = TestingSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db
client = TestClient(app)
```

---

## 3. pytest Fixtures for Client and Auth

```python
# conftest.py
import pytest
from fastapi.testclient import TestClient
from main import app
from dependencies.db import get_db

@pytest.fixture(scope="module")
def test_client():
    app.dependency_overrides[get_db] = override_get_db
    with TestClient(app) as client:
        yield client
    app.dependency_overrides.clear()

@pytest.fixture
def auth_headers(test_client):
    response = test_client.post(
        "/auth/token",
        data={"username": "test@example.com", "password": "testpass"},
    )
    token = response.json()["access_token"]
    return {"Authorization": f"Bearer {token}"}
```

---

## 4. Async Testing with `httpx.AsyncClient`

```python
import pytest
import httpx
from httpx import AsyncClient
from main import app

@pytest.mark.asyncio
async def test_async_endpoint():
    async with AsyncClient(app=app, base_url="http://test") as client:
        response = await client.get("/users/1")
    assert response.status_code == 200
```

---

## 5. Testing with a Real Database (Transactions)

```python
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker

TEST_DATABASE_URL = "postgresql+asyncpg://user:pass@localhost/testdb"
test_engine = create_async_engine(TEST_DATABASE_URL)
TestingSessionLocal = async_sessionmaker(test_engine, expire_on_commit=False)

@pytest.fixture(autouse=True)
async def reset_db():
    """Wrap each test in a transaction and roll back."""
    async with test_engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
        yield
        await conn.run_sync(Base.metadata.drop_all)
```

---

## 6. Testing Error Responses

```python
def test_user_not_found(test_client):
    response = test_client.get("/users/99999")
    assert response.status_code == 404
    assert "detail" in response.json()

def test_validation_error(test_client):
    response = test_client.post("/users", json={"email": "not-an-email"})
    assert response.status_code == 422
    errors = response.json()["detail"]
    assert any(e["loc"] == ["body", "email"] for e in errors)

def test_auth_required(test_client):
    response = test_client.get("/me")
    assert response.status_code == 401
```

---

## 7. Mocking External Calls

```python
from unittest.mock import patch, AsyncMock
import pytest

@pytest.mark.asyncio
async def test_webhook_called_on_order():
    with patch("services.order_service.send_webhook", new_callable=AsyncMock) as mock_wh:
        async with AsyncClient(app=app, base_url="http://test") as client:
            response = await client.post("/orders", json=order_payload)

    assert response.status_code == 201
    mock_wh.assert_awaited_once()
    args = mock_wh.call_args
    assert args.kwargs["order_id"] == response.json()["id"]
```

---

## 8. Testing File Upload

```python
def test_upload_avatar(test_client, auth_headers):
    png_data = b"\x89PNG\r\n\x1a\n" + b"\x00" * 100   # minimal PNG-like bytes
    response = test_client.post(
        "/users/me/avatar",
        files={"file": ("avatar.png", png_data, "image/png")},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert "url" in response.json()
```
