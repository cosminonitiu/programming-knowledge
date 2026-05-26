## Routers and Application Structure
---

`APIRouter` lets you split a FastAPI application into modular components, each with its own prefix, tags, and dependencies. Multiple routers are then included in the main `FastAPI` app.

---

## 1. Basic Router

```python
# routers/users.py
from fastapi import APIRouter, Depends, HTTPException
from models.user import User, UserCreate
from dependencies.auth import get_current_user

router = APIRouter(
    prefix="/users",
    tags=["Users"],
    responses={404: {"description": "User not found"}},
)

@router.get("/")
def list_users(): ...

@router.post("/", status_code=201)
def create_user(data: UserCreate): ...

@router.get("/{user_id}")
def get_user(user_id: int): ...

@router.delete("/{user_id}", status_code=204)
def delete_user(user_id: int): ...
```

---

## 2. Including Routers in the App

```python
# main.py
from fastapi import FastAPI
from routers import users, products, orders, auth

app = FastAPI(title="My API", version="1.0.0")

app.include_router(auth.router)
app.include_router(users.router)
app.include_router(products.router, prefix="/v1")   # override prefix
app.include_router(orders.router, dependencies=[Depends(verify_auth)])
```

---

## 3. Versioned API Structure

```
app/
├── main.py
├── routers/
│   ├── v1/
│   │   ├── __init__.py
│   │   ├── users.py
│   │   └── products.py
│   └── v2/
│       ├── __init__.py
│       └── users.py       # v2 of users API
```

```python
# main.py
from routers.v1 import users as users_v1, products as products_v1
from routers.v2 import users as users_v2

app.include_router(users_v1.router, prefix="/v1/users")
app.include_router(products_v1.router, prefix="/v1/products")
app.include_router(users_v2.router, prefix="/v2/users")
```

---

## 4. Router-Level Dependencies

```python
# All routes under /admin require admin role
admin_router = APIRouter(
    prefix="/admin",
    tags=["Admin"],
    dependencies=[Depends(require_admin)],
)

@admin_router.get("/stats")
def get_stats(): ...

@admin_router.delete("/users/{id}")
def hard_delete_user(id: int): ...
```

---

## 5. Nested Routers

```python
# Create a parent router for /api/v1
api_v1 = APIRouter(prefix="/api/v1")

# Include sub-routers into the versioned parent
api_v1.include_router(users.router, prefix="/users")
api_v1.include_router(products.router, prefix="/products")

# Include the versioned router in the main app
app.include_router(api_v1)
# Result: /api/v1/users, /api/v1/products
```

---

## 6. Tags for OpenAPI Grouping

```python
@router.post(
    "/",
    tags=["Users", "Create"],       # shown in Swagger grouped by tag
    summary="Create a new user",
    description="Creates a new user account. Returns the created user with ID.",
    response_description="The newly created user",
)
def create_user(data: UserCreate): ...
```

---

## 7. Full Project Structure

```
myapi/
├── main.py                 # app creation, lifespan, middleware, include routers
├── config.py               # settings via pydantic-settings
├── database.py             # engine, session, Base
├── models/
│   ├── orm/                # SQLAlchemy ORM models
│   │   ├── user.py
│   │   └── product.py
│   └── schemas/            # Pydantic request/response schemas
│       ├── user.py
│       └── product.py
├── routers/
│   ├── auth.py
│   ├── users.py
│   └── products.py
├── services/               # business logic, decoupled from HTTP layer
│   ├── user_service.py
│   └── product_service.py
├── repositories/           # data access layer
│   ├── user_repo.py
│   └── product_repo.py
└── dependencies/
    ├── auth.py             # get_current_user, require_admin
    └── db.py               # get_db session
```

---

## 8. `include_router` Parameters

```python
app.include_router(
    users.router,
    prefix="/v2/users",              # override router's own prefix
    tags=["Users V2"],               # override tags
    dependencies=[Depends(auth)],    # additional dependencies
    responses={401: {"description": "Not authenticated"}},
    include_in_schema=True,          # show in OpenAPI docs (default True)
)
```
