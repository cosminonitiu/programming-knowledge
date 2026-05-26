## Path and Query Parameters
---

FastAPI extracts and validates URL path parameters and query string parameters automatically from your function signature's type annotations.

---

## 1. Path Parameters

```python
from fastapi import FastAPI

app = FastAPI()

@app.get("/users/{user_id}")
def get_user(user_id: int):           # :int validates and converts automatically
    return {"user_id": user_id}

@app.get("/files/{file_path:path}")   # :path matches slashes
def read_file(file_path: str):
    return {"path": file_path}

# Multiple path parameters
@app.get("/categories/{category}/products/{product_id}")
def get_product(category: str, product_id: int):
    return {"category": category, "product_id": product_id}
```

**Important:** Fixed routes must be declared before parametric ones:

```python
@app.get("/users/me")       # MUST come first
def get_me(): ...

@app.get("/users/{user_id}")  # otherwise "me" matches as user_id
def get_user(user_id: int): ...
```

---

## 2. Query Parameters

Any parameter NOT in the path is treated as a query parameter:

```python
@app.get("/items")
def list_items(
    page: int = 1,             # optional, default 1
    page_size: int = 20,       # optional, default 20
    search: str | None = None, # optional, can be None
    active: bool = True,       # bool: "true"/"false"/"1"/"0"
):
    return {"page": page, "search": search}

# GET /items?page=2&search=widget&active=false
```

---

## 3. Validation with `Path()` and `Query()`

```python
from typing import Annotated
from fastapi import Path, Query

@app.get("/users/{user_id}/items")
def get_user_items(
    user_id: Annotated[int, Path(
        title="User ID",
        description="The ID of the user",
        ge=1,            # greater than or equal
        le=1_000_000,    # less than or equal
    )],
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    q: Annotated[str | None, Query(
        min_length=3,
        max_length=50,
        pattern=r"^\w+$",
    )] = None,
):
    return {"user_id": user_id, "page": page}
```

---

## 4. Required vs Optional Query Params

```python
# Optional with default
def search(q: str = ""):          # q has a default — optional
def search(q: str | None = None): # q defaults to None — optional

# Required (no default)
def search(q: str):               # q is required — 422 if missing
```

---

## 5. List Query Parameters

```python
from typing import Annotated
from fastapi import Query

@app.get("/items")
def filter_items(
    tag: Annotated[list[str], Query()] = [],
):
    return {"tags": tag}

# GET /items?tag=python&tag=fastapi&tag=async
# → {"tags": ["python", "fastapi", "async"]}
```

---

## 6. Enum Path Parameters

```python
from enum import Enum

class ModelType(str, Enum):
    small = "small"
    medium = "medium"
    large = "large"

@app.get("/models/{model_type}")
def get_model(model_type: ModelType):
    if model_type == ModelType.large:
        return {"type": model_type, "info": "Big model"}
    return {"type": model_type}

# GET /models/xlarge → 422 Validation Error (not in enum)
# GET /models/large  → 200 OK
```

---

## 7. Numeric Constraints Quick Reference

| Validator | Meaning |
|-----------|---------|
| `ge=n` | greater than or equal to n |
| `gt=n` | strictly greater than n |
| `le=n` | less than or equal to n |
| `lt=n` | strictly less than n |
| `multiple_of=n` | must be a multiple of n |

---

## 8. Automatic Error Responses

When validation fails, FastAPI returns a `422 Unprocessable Entity` with a detailed JSON body:

```json
{
  "detail": [
    {
      "type": "int_parsing",
      "loc": ["path", "user_id"],
      "msg": "Input should be a valid integer",
      "input": "abc"
    }
  ]
}
```

No boilerplate required — this comes for free from Pydantic integration.
