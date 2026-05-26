## OpenAPI and Documentation
---

OpenAPI (formerly Swagger) is the standard for describing REST APIs. FastAPI generates an OpenAPI 3.x spec automatically from your code, which powers interactive documentation and enables client code generation.

---

## 1. FastAPI Auto-Documentation

```python
from fastapi import FastAPI

app = FastAPI(
    title="My E-Commerce API",
    description="RESTful API for product catalogue and order management.",
    version="2.1.0",
    contact={"name": "API Support", "email": "api@example.com"},
    license_info={"name": "MIT"},
    docs_url="/docs",           # Swagger UI
    redoc_url="/redoc",         # ReDoc
    openapi_url="/openapi.json",
)
```

Visit:
- `/docs` — interactive Swagger UI (try endpoints in browser)
- `/redoc` — ReDoc documentation (better for reading)
- `/openapi.json` — raw OpenAPI spec

---

## 2. Documenting Endpoints

```python
from fastapi import APIRouter
from pydantic import BaseModel, Field

router = APIRouter()

class OrderCreate(BaseModel):
    product_id: int = Field(
        description="The product to order",
        examples=[42],
        ge=1,
    )
    quantity: int = Field(default=1, ge=1, le=100)

class Order(BaseModel):
    id: int
    product_id: int
    quantity: int
    status: str = Field(examples=["pending", "shipped", "delivered"])

@router.post(
    "/orders",
    response_model=Order,
    status_code=201,
    summary="Create a new order",
    description="""
    Creates a new order for an authenticated user.

    **Business rules:**
    - Quantity cannot exceed available stock.
    - Only active products can be ordered.
    """,
    response_description="The created order with assigned ID and status",
    tags=["Orders"],
    responses={
        409: {"description": "Insufficient stock"},
        422: {"description": "Validation error"},
    },
)
def create_order(data: OrderCreate):
    ...
```

---

## 3. OpenAPI Spec Structure

```yaml
# Simplified OpenAPI 3.x structure
openapi: "3.1.0"
info:
  title: My API
  version: "1.0.0"
paths:
  /users/{user_id}:
    get:
      summary: Get a user
      parameters:
        - name: user_id
          in: path
          required: true
          schema:
            type: integer
      responses:
        "200":
          description: User found
          content:
            application/json:
              schema:
                $ref: "#/components/schemas/User"
        "404":
          description: User not found
components:
  schemas:
    User:
      type: object
      properties:
        id: {type: integer}
        email: {type: string}
```

---

## 4. Schema Examples

```python
from pydantic import BaseModel, Field

class UserCreate(BaseModel):
    email: str = Field(examples=["alice@example.com"])
    password: str = Field(examples=["Str0ng!Pass"])
    name: str = Field(examples=["Alice Smith"])

    model_config = {
        "json_schema_extra": {
            "examples": [
                {
                    "email": "alice@example.com",
                    "password": "Str0ng!Pass",
                    "name": "Alice Smith",
                }
            ]
        }
    }
```

---

## 5. Security Schemes in OpenAPI

```python
from fastapi.security import OAuth2PasswordBearer, APIKeyHeader

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

# This automatically adds the "Authorize" button to Swagger UI
```

---

## 6. Generating Client SDKs

The OpenAPI spec enables automatic client generation:

```bash
# Generate Python client
pip install openapi-python-client
openapi-python-client generate --url http://localhost:8000/openapi.json

# Generate TypeScript client
npx openapi-typescript-codegen \
  --input http://localhost:8000/openapi.json \
  --output ./src/api-client \
  --client axios

# openapi-generator (supports 50+ languages)
docker run --rm -v "$PWD:/local" openapitools/openapi-generator-cli generate \
  -i http://host.docker.internal:8000/openapi.json \
  -g typescript-axios \
  -o /local/client
```

---

## 7. Hiding Endpoints from Docs

```python
@app.get("/internal/metrics", include_in_schema=False)
def internal_metrics():
    """Not shown in Swagger or ReDoc."""
    return get_metrics()
```

---

## 8. OpenAPI in Production

```python
# Disable docs in production for security
import os

app = FastAPI(
    docs_url="/docs" if os.environ.get("ENVIRONMENT") != "production" else None,
    redoc_url="/redoc" if os.environ.get("ENVIRONMENT") != "production" else None,
)

# Or require authentication for docs
from fastapi import Depends

if settings.environment == "production":
    app.docs_url = None
    app.redoc_url = None
```
