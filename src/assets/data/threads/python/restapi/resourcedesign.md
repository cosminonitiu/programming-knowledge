## Resource Design
---

Good REST resource design makes an API predictable, self-documenting, and easy to evolve. It covers URL structure, naming conventions, collection vs item patterns, and relationships.

---

## 1. Resources vs Actions

REST models the world as **resources** (nouns), not actions (verbs). HTTP verbs express the action:

```
# Bad — RPC-style (verbs in URLs)
POST /getUser
POST /createOrder
POST /cancelOrder

# Good — REST style (nouns + HTTP verbs)
GET    /users/{id}
POST   /orders
DELETE /orders/{id}
```

---

## 2. URL Naming Conventions

```
# Use plural nouns for collections
GET /users           # collection
GET /users/{id}      # item

# Use lowercase and hyphens (not underscores or camelCase)
/product-categories  # correct
/productCategories   # avoid
/product_categories  # avoid

# Hierarchical: sub-resources through nesting
GET /users/{user_id}/orders             # orders belonging to a user
GET /users/{user_id}/orders/{order_id}  # specific order of a user
POST /users/{user_id}/orders            # create order for user
```

---

## 3. Collection and Item Endpoints

```
Collection:          /resources
  GET    → list all resources (with pagination)
  POST   → create a new resource

Item:               /resources/{id}
  GET    → retrieve the resource
  PUT    → full replace of the resource
  PATCH  → partial update of the resource
  DELETE → delete the resource
```

---

## 4. Nesting Depth

Avoid deep nesting — beyond 2 levels it becomes unwieldy:

```
# Reasonable
GET /orders/{order_id}/items

# Too deep
GET /users/{user_id}/carts/{cart_id}/items/{item_id}/reviews/{review_id}
# Better: separate top-level resource
GET /reviews/{review_id}
```

---

## 5. Resource Relationships

```
# Embedded (include related data in response)
GET /orders/123
{
  "id": 123,
  "customer": { "id": 5, "name": "Alice" },  ← embedded
  "items": [...]
}

# Linked (return IDs, client fetches separately)
{
  "id": 123,
  "customer_id": 5,
  "item_ids": [1, 2, 3]
}

# Use `?expand=` query param to let client choose
GET /orders/123?expand=customer,items
```

---

## 6. Filtering, Sorting, and Searching

```
# Filtering — resource attribute filters
GET /products?category=electronics&in_stock=true
GET /orders?status=pending&created_after=2024-01-01

# Sorting
GET /products?sort=price&order=asc
GET /products?sort=-price   # minus prefix = descending

# Searching
GET /products?q=wireless+headphones
GET /users?search=alice

# Field selection (reduce payload size)
GET /users?fields=id,name,email
```

---

## 7. Actions That Don't Fit CRUD

Use sub-resources or POST with a verb-like noun:

```
# Lifecycle transitions
POST /orders/{id}/cancel
POST /orders/{id}/ship
POST /accounts/{id}/suspend

# Bulk operations
POST /users/bulk-delete
{
  "ids": [1, 2, 3]
}

# Complex queries (too large for query string)
POST /reports/generate
{
  "start_date": "2024-01-01",
  "end_date": "2024-12-31",
  "group_by": "month"
}
```

---

## 8. Response Body Conventions

```json
// List response — wrap in object for extensibility
{
  "data": [...],
  "total": 523,
  "page": 1,
  "page_size": 20
}

// Single resource — flat or wrapped
{
  "id": 1,
  "name": "Widget",
  "price": 9.99
}

// Error response — consistent structure
{
  "detail": "User not found",
  "code": "USER_NOT_FOUND",
  "timestamp": "2024-01-15T10:30:00Z"
}
```
