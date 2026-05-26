## API Versioning
---

Versioning lets you evolve an API without breaking existing clients. The right strategy depends on your consumers, release cadence, and how aggressively you plan to introduce breaking changes.

---

## 1. What Constitutes a Breaking Change?

**Breaking changes:**
- Removing or renaming a field in the response.
- Changing a field's type (e.g., `string` → `integer`).
- Removing an endpoint.
- Changing required/optional status of a request field.
- Changing HTTP method or status code.

**Non-breaking changes:**
- Adding optional fields to requests.
- Adding new fields to responses (clients should ignore unknown fields).
- Adding new endpoints.
- Adding new optional query parameters.

---

## 2. URL Path Versioning

Most common and explicit. Version is in the URL path:

```
GET /v1/users/123
GET /v2/users/123
```

```python
# FastAPI
from fastapi import FastAPI
from routers.v1 import users as users_v1
from routers.v2 import users as users_v2

app = FastAPI()
app.include_router(users_v1.router, prefix="/v1")
app.include_router(users_v2.router, prefix="/v2")
```

**Pros:** Easy to see in URLs, logs, and browser history. Easy to route via proxy.
**Cons:** URLs are not "pure" (version isn't a resource attribute).

---

## 3. Header Versioning

Version is in a custom request header:

```
GET /users/123
API-Version: 2
```

```python
from fastapi import Header

@app.get("/users/{user_id}")
def get_user(user_id: int, api_version: str = Header(default="1")):
    if api_version == "2":
        return get_user_v2(user_id)
    return get_user_v1(user_id)
```

**Pros:** Clean URLs. Semantically correct (URL identifies resource, header specifies representation).
**Cons:** Less visible, harder to test in a browser, requires proxy to route.

---

## 4. Accept Header (Media Type) Versioning

Version embedded in `Accept` / `Content-Type`:

```
GET /users/123
Accept: application/vnd.myapp.v2+json
```

**Pros:** Most REST-correct. Follows content negotiation.
**Cons:** Complex to implement and test. Rarely used in practice.

---

## 5. Query Parameter Versioning

```
GET /users/123?version=2
```

**Pros:** Easy to test in browsers.
**Cons:** Pollutes every URL. Version is a resource selection concern, not filtering.

---

## 6. Deprecation Strategy

```python
@app.get(
    "/v1/users/{id}",
    deprecated=True,   # shows as deprecated in OpenAPI docs
    summary="Get User (Deprecated)",
)
def get_user_v1(id: int):
    ...

# Also use a Sunset header in the response
@app.middleware("http")
async def deprecation_middleware(request: Request, call_next):
    response = await call_next(request)
    if request.url.path.startswith("/v1/"):
        response.headers["Sunset"] = "Sat, 31 Dec 2025 23:59:59 GMT"
        response.headers["Deprecation"] = "true"
        response.headers["Link"] = '</v2/docs>; rel="successor-version"'
    return response
```

---

## 7. Semantic Versioning for APIs

| Version Type | When to Bump | Example |
|--------------|-------------|---------|
| **Major** (v1 → v2) | Breaking changes | Remove field, change type |
| **Minor** (v1.1) | New non-breaking features | Add optional field |
| **Patch** (v1.0.1) | Bug fixes only | Fix incorrect status code |

Public APIs typically only expose major versions in the URL (`/v1`, `/v2`).

---

## 8. Versioning Best Practices

- **Start with `/v1`** even if you don't plan changes — harder to add versioning later.
- **Support N-1 versions** — don't deprecate v1 until v3 is released.
- **Give clients at least 6 months** notice before sunsetting a version.
- **Don't version every change** — only introduce a new version for breaking changes.
- **Maintain a changelog** — document what changed between versions.
