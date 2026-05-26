## FastAPI Introduction
---

FastAPI is a modern, high-performance Python web framework for building APIs. It is built on Starlette (ASGI) and Pydantic, and automatically generates OpenAPI documentation. It rivals Node.js and Go in throughput benchmarks.

---

## 1. Why FastAPI?

- **Fast to run** — ASGI-based, fully async, performance comparable to NodeJS/Go.
- **Fast to develop** — type hints drive validation, serialisation, and documentation automatically.
- **Automatic docs** — interactive Swagger UI at `/docs` and ReDoc at `/redoc`, generated from your code.
- **Data validation** — Pydantic models validate request/response data with clear error messages.
- **Standards-based** — implements OpenAPI 3.x and JSON Schema natively.

---

## 2. Minimal Application

```python
# pip install fastapi uvicorn

from fastapi import FastAPI

app = FastAPI(title="My API", version="1.0.0")

@app.get("/")
def read_root():
    return {"message": "Hello, World!"}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str | None = None):
    return {"item_id": item_id, "q": q}
```

```bash
uvicorn main:app --reload       # development server with auto-reload
uvicorn main:app --port 8080    # custom port
```

Visit `http://127.0.0.1:8000/docs` for the interactive API documentation.

---

## 3. HTTP Method Decorators

```python
@app.get("/items")           # GET
@app.post("/items")          # POST
@app.put("/items/{id}")      # PUT (full replace)
@app.patch("/items/{id}")    # PATCH (partial update)
@app.delete("/items/{id}")   # DELETE
@app.head("/items")          # HEAD
@app.options("/items")       # OPTIONS
```

---

## 4. Response Models and Status Codes

```python
from fastapi import FastAPI, status
from pydantic import BaseModel

class Item(BaseModel):
    id: int
    name: str
    price: float

class ItemCreate(BaseModel):
    name: str
    price: float

@app.post(
    "/items",
    response_model=Item,                    # serialises and validates response
    status_code=status.HTTP_201_CREATED,    # 201 instead of 200
    summary="Create a new item",
    description="Creates a new item and returns the full item with ID.",
)
def create_item(data: ItemCreate) -> Item:
    saved = save_to_db(data)
    return saved
```

---

## 5. Type Annotations Drive Everything

```python
from typing import Annotated
from fastapi import FastAPI, Path, Query

@app.get("/users/{user_id}/orders")
def get_user_orders(
    user_id: Annotated[int, Path(ge=1, description="The user's ID")],
    page: Annotated[int, Query(ge=1, default=1)],
    page_size: Annotated[int, Query(ge=1, le=100, default=20)],
    status: str | None = None,
):
    return fetch_orders(user_id=user_id, page=page, size=page_size, status=status)
```

FastAPI reads the annotations and generates:
- URL parameter validation (`user_id: int` → validates it's an integer).
- Query parameter defaults and constraints.
- OpenAPI documentation with types, descriptions, and examples.

---

## 6. Application Lifecycle — `lifespan`

```python
from contextlib import asynccontextmanager
from fastapi import FastAPI

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Startup
    print("Starting up...")
    app.state.db_pool = await create_db_pool()
    yield
    # Shutdown
    print("Shutting down...")
    await app.state.db_pool.close()

app = FastAPI(lifespan=lifespan)
```

---

## 7. Async vs Sync Route Handlers

```python
# Use async def for I/O-bound handlers (database, HTTP calls)
@app.get("/users/{user_id}")
async def get_user(user_id: int):
    user = await db.fetch_one("SELECT * FROM users WHERE id = $1", user_id)
    return user

# Use def for CPU-bound or sync-only code
# FastAPI will run it in a thread pool automatically
@app.post("/process")
def process_image(data: bytes):
    result = run_heavy_cpu_computation(data)
    return result
```

---

## 8. Project Structure Convention

```
myapp/
├── main.py                 # FastAPI app + lifespan
├── routers/
│   ├── users.py
│   ├── products.py
│   └── orders.py
├── models/
│   ├── user.py             # Pydantic schemas
│   └── product.py
├── database/
│   ├── connection.py
│   └── repositories.py
├── services/
│   ├── user_service.py
│   └── auth_service.py
└── dependencies/
    ├── auth.py
    └── database.py
```
