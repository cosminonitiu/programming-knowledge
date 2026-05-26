## Rate Limiting
---

Rate limiting protects APIs from abuse, ensures fair usage across clients, and prevents overload. It is typically implemented at the API gateway or as middleware.

---

## 1. Rate Limiting Strategies

| Strategy | Description | Use Case |
|----------|-------------|----------|
| **Fixed Window** | Count requests per time window | Simple, but vulnerable to burst at window boundary |
| **Sliding Window** | Rolling time window | Smoother, more accurate |
| **Token Bucket** | Tokens replenish at fixed rate; requests consume tokens | Allows controlled bursts |
| **Leaky Bucket** | Queue requests; process at fixed rate | Smooths burst traffic |

---

## 2. Fixed Window in FastAPI (In-Memory)

```python
from collections import defaultdict
from asyncio import Lock
import time

class FixedWindowRateLimiter:
    def __init__(self, max_requests: int, window_seconds: int):
        self.max = max_requests
        self.window = window_seconds
        self._counts: dict[str, tuple[int, float]] = {}
        self._lock = Lock()

    async def check(self, key: str) -> tuple[bool, int]:
        """Returns (allowed, retry_after_seconds)."""
        async with self._lock:
            now = time.time()
            count, window_start = self._counts.get(key, (0, now))

            if now - window_start >= self.window:
                count, window_start = 0, now  # reset window

            if count >= self.max:
                retry_after = int(self.window - (now - window_start))
                return False, retry_after

            self._counts[key] = (count + 1, window_start)
            return True, 0

limiter = FixedWindowRateLimiter(max_requests=100, window_seconds=60)

@app.middleware("http")
async def rate_limit_middleware(request: Request, call_next):
    key = request.client.host
    allowed, retry_after = await limiter.check(key)

    if not allowed:
        return JSONResponse(
            status_code=429,
            content={"detail": "Rate limit exceeded"},
            headers={"Retry-After": str(retry_after)},
        )

    response = await call_next(request)
    return response
```

---

## 3. Token Bucket with Redis

Redis-backed rate limiting works across multiple API server instances:

```python
import redis.asyncio as redis

class TokenBucketRateLimiter:
    def __init__(self, redis_client, capacity: int, refill_rate: float):
        self.redis = redis_client
        self.capacity = capacity
        self.refill_rate = refill_rate  # tokens per second

    async def consume(self, key: str, tokens: int = 1) -> bool:
        script = """
        local tokens_key = KEYS[1]
        local last_refill_key = KEYS[2]
        local capacity = tonumber(ARGV[1])
        local refill_rate = tonumber(ARGV[2])
        local now = tonumber(ARGV[3])
        local requested = tonumber(ARGV[4])

        local last_refill = tonumber(redis.call("get", last_refill_key) or now)
        local current_tokens = tonumber(redis.call("get", tokens_key) or capacity)
        local elapsed = now - last_refill
        local new_tokens = math.min(capacity, current_tokens + elapsed * refill_rate)

        if new_tokens >= requested then
            redis.call("set", tokens_key, new_tokens - requested, "EX", 3600)
            redis.call("set", last_refill_key, now, "EX", 3600)
            return 1
        else
            return 0
        end
        """
        result = await self.redis.eval(
            script, 2, f"rl:{key}:tokens", f"rl:{key}:ts",
            self.capacity, self.refill_rate, time.time(), tokens,
        )
        return result == 1
```

---

## 4. slowapi — Third-Party Rate Limiter

```bash
pip install slowapi
```

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded

limiter = Limiter(key_func=get_remote_address)
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

@app.get("/search")
@limiter.limit("10/minute")
async def search(request: Request, q: str):
    return search_results(q)

@app.get("/download")
@limiter.limit("3/hour")
async def download(request: Request):
    ...
```

---

## 5. Rate Limit Response Headers

```
HTTP/1.1 200 OK
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 43
X-RateLimit-Reset: 1705312800    ← Unix timestamp when limit resets

HTTP/1.1 429 Too Many Requests
Retry-After: 47                  ← seconds until client can retry
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
```

---

## 6. Different Limits per Endpoint / User Tier

```python
def get_rate_limit(user: User = Depends(get_current_user)) -> str:
    tiers = {"free": "20/minute", "pro": "100/minute", "enterprise": "1000/minute"}
    return tiers.get(user.tier, "20/minute")

@app.get("/api/data")
@limiter.limit(get_rate_limit)
async def get_data(request: Request, user: User = Depends(get_current_user)):
    ...
```

---

## 7. Best Practices

- Implement rate limiting at the **API gateway** (nginx, AWS API Gateway) for production — don't rely solely on in-process limiters.
- Use **Redis** for distributed rate limiting across multiple server instances.
- Differentiate limits by **IP address** (unauthenticated), **API key**, and **user tier**.
- Return `Retry-After` header so clients back off intelligently.
- Whitelist health check and internal endpoints from rate limits.
