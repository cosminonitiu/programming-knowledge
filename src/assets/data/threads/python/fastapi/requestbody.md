## Request Body and Pydantic Models
---

FastAPI uses Pydantic for request body parsing, validation, and serialisation. You declare the expected body shape as a Pydantic `BaseModel`, and FastAPI handles everything else.

---

## 1. Basic Request Body

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class ItemCreate(BaseModel):
    name: str
    description: str | None = None
    price: float
    in_stock: bool = True

@app.post("/items")
def create_item(item: ItemCreate):
    return {"received": item.model_dump()}

# Request body:
# {
#   "name": "Widget",
#   "price": 9.99
# }
# description and in_stock use defaults
```

---

## 2. Pydantic Field Validation

```python
from pydantic import BaseModel, Field, field_validator

class UserCreate(BaseModel):
    username: str = Field(min_length=3, max_length=50, pattern=r"^\w+$")
    email: str = Field(examples=["user@example.com"])
    age: int = Field(ge=0, le=120, description="Age in years")
    password: str = Field(min_length=8, repr=False)   # repr=False hides in logs

    @field_validator("email")
    @classmethod
    def email_must_be_valid(cls, v: str) -> str:
        if "@" not in v or "." not in v.split("@")[-1]:
            raise ValueError("Invalid email format")
        return v.lower()

    @field_validator("username")
    @classmethod
    def username_not_reserved(cls, v: str) -> str:
        reserved = {"admin", "root", "system"}
        if v.lower() in reserved:
            raise ValueError(f"'{v}' is a reserved username")
        return v
```

---

## 3. Separate Create / Read / Update Models

```python
from pydantic import BaseModel
from datetime import datetime

class ItemBase(BaseModel):
    name: str
    price: float

class ItemCreate(ItemBase):
    pass               # same as base for creation

class ItemUpdate(BaseModel):
    name: str | None = None    # all fields optional for partial update
    price: float | None = None

class Item(ItemBase):
    id: int
    created_at: datetime

    model_config = {"from_attributes": True}   # allow ORM model → Pydantic

@app.post("/items", response_model=Item)
def create_item(data: ItemCreate): ...

@app.patch("/items/{id}", response_model=Item)
def update_item(id: int, data: ItemUpdate): ...
```

---

## 4. Nested Models

```python
class Address(BaseModel):
    street: str
    city: str
    country: str
    postcode: str

class OrderItem(BaseModel):
    product_id: int
    quantity: int
    unit_price: float

class Order(BaseModel):
    customer_id: int
    shipping_address: Address          # nested model
    items: list[OrderItem]             # list of nested models
    coupon_code: str | None = None

@app.post("/orders")
def place_order(order: Order):
    subtotal = sum(i.quantity * i.unit_price for i in order.items)
    return {"order": order.model_dump(), "subtotal": subtotal}
```

---

## 5. Body, Path, and Query Together

```python
from typing import Annotated
from fastapi import Path, Query

@app.put("/users/{user_id}/profile")
def update_profile(
    user_id: Annotated[int, Path(ge=1)],
    notify: bool = Query(default=False),
    data: UserUpdate = Body(...),          # explicit Body declaration
):
    ...
```

---

## 6. Multiple Bodies

```python
from fastapi import Body

@app.post("/invoice")
def create_invoice(
    customer: Annotated[Customer, Body()],
    order: Annotated[Order, Body()],
):
    # Request body: {"customer": {...}, "order": {...}}
    ...
```

---

## 7. `model_config` Settings

```python
from pydantic import BaseModel, ConfigDict

class User(BaseModel):
    model_config = ConfigDict(
        from_attributes=True,          # support ORM models (SQLAlchemy)
        str_strip_whitespace=True,     # strip whitespace from strings
        str_to_lower=True,             # lowercase all strings
        frozen=True,                   # immutable instances
        populate_by_name=True,         # allow both field name and alias
    )
```

---

## 8. Excluding Sensitive Fields from Response

```python
class UserPublic(BaseModel):
    id: int
    email: str
    # No password field — never serialised in response

class UserInternal(UserPublic):
    password_hash: str   # only used internally

@app.get("/users/{id}", response_model=UserPublic)
def get_user(id: int):
    user = db.get_user(id)   # UserInternal with password
    return user              # FastAPI uses UserPublic to filter fields
```
