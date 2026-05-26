## Middleware
---

Middleware in FastAPI is a function that processes every request before it reaches the route handler, and every response before it goes back to the client. It's used for logging, CORS, authentication, compression, and request tracing.

---

## 1. Adding Middleware

```python
from fastapi import FastAPI, Request
import time

app = FastAPI()

@app.middleware("http")
async def timing_middleware(request: Request, call_next):
    start = time.perf_counter()
    response = await call_next(request)   # forward to route handler
    elapsed = time.perf_counter() - start
    response.headers["X-Process-Time"] = f"{elapsed:.4f}"
    return response
```

---

## 2. Middleware Execution Order

```
Request:   MW1 → MW2 → MW3 → Route Handler
Response:  MW1 ← MW2 ← MW3 ← Route Handler
```

Middleware added last runs outermost (first for requests, last for responses).

---

## 3. CORS Middleware

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://app.example.com", "https://admin.example.com"],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "PATCH"],
    allow_headers=["Authorization", "Content-Type"],
)

# For development only
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # Never use in production!
    allow_methods=["*"],
    allow_headers=["*"],
)
```

---

## 4. Request Logging Middleware

```python
import logging
import uuid

logger = logging.getLogger("api.requests")

@app.middleware("http")
async def request_logging_middleware(request: Request, call_next):
    request_id = str(uuid.uuid4())
    start = time.perf_counter()

    logger.info(
        "Request started",
        extra={
            "request_id": request_id,
            "method": request.method,
            "path": request.url.path,
            "client": request.client.host if request.client else "unknown",
        },
    )

    response = await call_next(request)
    elapsed = time.perf_counter() - start

    logger.info(
        "Request completed",
        extra={
            "request_id": request_id,
            "status_code": response.status_code,
            "duration_ms": round(elapsed * 1000, 2),
        },
    )

    response.headers["X-Request-ID"] = request_id
    return response
```

---

## 5. Authentication Middleware

```python
from fastapi.responses import JSONResponse

EXCLUDED_PATHS = {"/auth/token", "/auth/refresh", "/docs", "/openapi.json"}

@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    if request.url.path in EXCLUDED_PATHS:
        return await call_next(request)

    auth = request.headers.get("Authorization")
    if not auth or not auth.startswith("Bearer "):
        return JSONResponse(
            status_code=401,
            content={"detail": "Missing or invalid Authorization header"},
        )

    token = auth.removeprefix("Bearer ")
    try:
        user = decode_and_verify(token)
        request.state.user = user   # attach to request state
    except InvalidTokenError:
        return JSONResponse(status_code=401, content={"detail": "Invalid token"})

    return await call_next(request)
```

---

## 6. Rate Limiting Middleware

```python
from collections import defaultdict
from asyncio import Lock

class RateLimiter:
    def __init__(self, requests_per_minute: int):
        self.limit = requests_per_minute
        self.window = 60
        self._counts: dict[str, list[float]] = defaultdict(list)
        self._lock = Lock()

    async def is_allowed(self, key: str) -> bool:
        async with self._lock:
            now = time.time()
            cutoff = now - self.window
            self._counts[key] = [t for t in self._counts[key] if t > cutoff]
            if len(self._counts[key]) >= self.limit:
                return False
            self._counts[key].append(now)
            return True

limiter = RateLimiter(requests_per_minute=60)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    client_ip = request.client.host
    if not await limiter.is_allowed(client_ip):
        return JSONResponse(
            status_code=429,
            content={"detail": "Too many requests"},
            headers={"Retry-After": "60"},
        )
    return await call_next(request)
```

---

## 7. Starlette Middleware Classes

For more complex middleware, subclass `BaseHTTPMiddleware`:

```python
from starlette.middleware.base import BaseHTTPMiddleware

class CompressionMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        # Inspect or modify response here
        return response

app.add_middleware(CompressionMiddleware)
```

---

## 8. GZip Compression (Built-in)

```python
from fastapi.middleware.gzip import GZipMiddleware

app.add_middleware(GZipMiddleware, minimum_size=1000)
# Compresses responses larger than 1000 bytes if client supports gzip
```
