## Pagination
---

Large collections must be paginated. The right strategy depends on the data size, whether clients need to jump to arbitrary pages, and whether the data changes frequently.

---

## 1. Offset / Page Pagination

Classic pagination using `page` and `page_size` (or `limit`/`offset`):

```
GET /users?page=3&page_size=20
GET /users?limit=20&offset=40    # offset = (page-1) * page_size
```

```python
from fastapi import Query
from typing import Annotated

class PageParams:
    def __init__(
        self,
        page: Annotated[int, Query(ge=1)] = 1,
        page_size: Annotated[int, Query(ge=1, le=100)] = 20,
    ):
        self.offset = (page - 1) * page_size
        self.limit = page_size
        self.page = page
        self.page_size = page_size

@app.get("/users")
def list_users(pagination: PageParams = Depends()):
    total = count_users()
    users = get_users(offset=pagination.offset, limit=pagination.limit)
    return {
        "data": users,
        "total": total,
        "page": pagination.page,
        "page_size": pagination.page_size,
        "pages": math.ceil(total / pagination.page_size),
    }
```

**Limitations:**
- Data inserted between requests causes items to shift — page 2 may include duplicates or skip items.
- `OFFSET N` in SQL scans N rows — slow for large offsets.

---

## 2. Cursor-Based Pagination

Uses an opaque cursor (usually the last seen ID or timestamp) instead of numeric offsets. Stable with real-time data:

```
GET /posts?limit=20
← { "data": [...], "next_cursor": "eyJpZCI6IDIwfQ==" }

GET /posts?limit=20&cursor=eyJpZCI6IDIwfQ==
← { "data": [...], "next_cursor": "eyJpZCI6IDQwfQ==" }
```

```python
import base64, json

def encode_cursor(last_id: int) -> str:
    return base64.b64encode(json.dumps({"id": last_id}).encode()).decode()

def decode_cursor(cursor: str) -> int:
    return json.loads(base64.b64decode(cursor))["id"]

@app.get("/posts")
def list_posts(
    limit: Annotated[int, Query(ge=1, le=100)] = 20,
    cursor: str | None = None,
):
    after_id = decode_cursor(cursor) if cursor else 0
    # SQL: SELECT * FROM posts WHERE id > {after_id} ORDER BY id LIMIT {limit+1}
    posts = get_posts_after(after_id, limit + 1)

    has_more = len(posts) > limit
    if has_more:
        posts = posts[:limit]

    next_cursor = encode_cursor(posts[-1].id) if has_more else None
    return {"data": posts, "next_cursor": next_cursor}
```

---

## 3. Keyset Pagination

Efficient variant of cursor pagination using indexed columns directly:

```sql
-- Instead of OFFSET (slow for large tables):
SELECT * FROM orders ORDER BY created_at DESC, id DESC LIMIT 20

-- Keyset (fast with index on (created_at, id)):
SELECT * FROM orders
WHERE (created_at, id) < ('2024-01-15T10:00:00', 999)
ORDER BY created_at DESC, id DESC
LIMIT 20
```

---

## 4. Response Structure Conventions

```json
// Option A: Envelope
{
  "data": [...],
  "pagination": {
    "total": 523,
    "page": 2,
    "page_size": 20,
    "pages": 27
  }
}

// Option B: Link header (RFC 5988)
HTTP/1.1 200 OK
Link: <https://api.example.com/users?page=3>; rel="next",
      <https://api.example.com/users?page=1>; rel="prev",
      <https://api.example.com/users?page=27>; rel="last"

// Option C: Cursor response
{
  "data": [...],
  "next_cursor": "eyJpZCI6IDIwfQ==",
  "has_more": true
}
```

---

## 5. Pagination Strategy Comparison

| Strategy | Stable? | Skip to page? | Performance | Best for |
|----------|---------|--------------|-------------|----------|
| Offset | No | Yes | O(N) | Admin dashboards, small datasets |
| Cursor | Yes | No | O(log N) | Feeds, real-time data |
| Keyset | Yes | No | O(log N) | Large sorted tables |

---

## 6. Total Count Performance

Counting rows is expensive on large tables:

```python
# Approximate count (PostgreSQL)
SELECT reltuples::bigint FROM pg_class WHERE relname = 'orders';

# Exact count with caching
@lru_cache(maxsize=1, typed=False)
@cache_for(seconds=60)
def get_order_count() -> int:
    return db.execute("SELECT COUNT(*) FROM orders").scalar()
```
