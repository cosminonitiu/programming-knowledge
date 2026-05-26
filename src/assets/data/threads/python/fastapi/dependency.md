## Dependency Injection
---

FastAPI's dependency injection system (`Depends`) is one of its most powerful features. It provides shared resources to route handlers cleanly, supports nesting, automatic cleanup via `yield`, and integrates directly with the OpenAPI schema.

---

## 1. Basic Dependency

```python
from fastapi import FastAPI, Depends

app = FastAPI()

def get_current_user_id(token: str) -> int:
    """Extract user ID from token."""
    return decode_token(token)

@app.get("/profile")
def get_profile(user_id: int = Depends(get_current_user_id)):
    return {"user_id": user_id}
```

---

## 2. Class-Based Dependencies

Classes let you group related dependencies with constructor parameters:

```python
class PaginationParams:
    def __init__(self, page: int = 1, page_size: int = 20):
        if page_size > 100:
            raise ValueError("page_size cannot exceed 100")
        self.page = page
        self.page_size = page_size
        self.offset = (page - 1) * page_size

@app.get("/items")
def list_items(pagination: PaginationParams = Depends()):
    return fetch_items(limit=pagination.page_size, offset=pagination.offset)
```

Using `Depends()` with no argument infers the dependency from the type annotation.

---

## 3. Dependencies with `yield` (Resource Cleanup)

```python
from sqlalchemy.orm import Session
from database import SessionLocal

def get_db():
    db = SessionLocal()
    try:
        yield db        # test/handler code runs here
    finally:
        db.close()      # always runs, even on exception

@app.get("/users/{user_id}")
def get_user(user_id: int, db: Session = Depends(get_db)):
    return db.query(User).filter(User.id == user_id).first()
```

---

## 4. Nested Dependencies

```python
def get_db() -> Generator[Session, None, None]:
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_current_user(
    token: str,
    db: Session = Depends(get_db),
) -> User:
    user = db.query(User).filter(User.token == token).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid token")
    return user

def get_admin_user(user: User = Depends(get_current_user)) -> User:
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin required")
    return user

@app.delete("/users/{user_id}")
def delete_user(user_id: int, admin: User = Depends(get_admin_user)):
    # DI chain: token → db → user → admin check
    ...
```

---

## 5. `Annotated` Dependencies (Reusable Aliases)

```python
from typing import Annotated
from fastapi import Depends

# Define reusable aliases
CurrentUser = Annotated[User, Depends(get_current_user)]
AdminUser = Annotated[User, Depends(get_admin_user)]
DBSession = Annotated[Session, Depends(get_db)]

@app.get("/me")
def get_me(user: CurrentUser):
    return user

@app.get("/admin/stats")
def admin_stats(admin: AdminUser, db: DBSession):
    ...
```

---

## 6. Global Dependencies (Applied to All Routes)

```python
from fastapi import FastAPI, Depends

def verify_api_key(x_api_key: str = Header(...)):
    if x_api_key != settings.API_KEY:
        raise HTTPException(status_code=403, detail="Invalid API key")

app = FastAPI(dependencies=[Depends(verify_api_key)])
```

Or apply to a router:

```python
router = APIRouter(
    prefix="/admin",
    dependencies=[Depends(get_admin_user)],
)
```

---

## 7. Caching — `use_cache=True` (default)

FastAPI caches dependency results within a single request. If multiple dependencies use `get_db`, only one DB session is created:

```python
# Both endpoints share one db call per request
def get_user(db: Session = Depends(get_db)): ...       # uses cached db
def get_order(db: Session = Depends(get_db)): ...      # same db instance

# Disable caching (create new instance each time)
def get_unique(x: str = Depends(dep, use_cache=False)): ...
```

---

## 8. Testing with Dependency Override

```python
from fastapi.testclient import TestClient

def override_get_db():
    db = TestSessionLocal()
    try:
        yield db
    finally:
        db.close()

app.dependency_overrides[get_db] = override_get_db

client = TestClient(app)

def test_get_user():
    response = client.get("/users/1")
    assert response.status_code == 200

# Clean up after tests
app.dependency_overrides.clear()
```
