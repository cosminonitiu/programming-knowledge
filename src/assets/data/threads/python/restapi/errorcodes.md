## Error Codes and Responses
---

Consistent, informative error responses are a hallmark of a well-designed API. Clients need enough information to understand what went wrong, whether they should retry, and how to fix the request.

---

## 1. HTTP Status Code Selection

```
Use the most specific appropriate status code:

400 Bad Request         — client sent malformed or invalid data
401 Unauthorized        — not authenticated (send credentials)
403 Forbidden           — authenticated but not permitted
404 Not Found           — resource doesn't exist
405 Method Not Allowed  — endpoint exists but not this HTTP method
409 Conflict            — request conflicts with current state (duplicate)
410 Gone                — resource permanently deleted (stricter than 404)
422 Unprocessable       — valid syntax, invalid semantics (validation failure)
429 Too Many Requests   — rate limit exceeded
500 Internal Server     — unexpected server error (never return details to client)
503 Service Unavailable — server overloaded or in maintenance
```

---

## 2. Consistent Error Body

Pick one format and use it everywhere:

```json
// RFC 7807 Problem Details (recommended)
{
  "type": "https://api.example.com/errors/validation-error",
  "title": "Validation Error",
  "status": 422,
  "detail": "The 'email' field must be a valid email address.",
  "instance": "/users",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format",
      "code": "EMAIL_INVALID"
    }
  ]
}

// Simpler format (FastAPI default)
{
  "detail": "User not found",
  "code": "USER_NOT_FOUND"
}
```

---

## 3. Implementing in FastAPI

```python
from fastapi import FastAPI, HTTPException
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel

class ErrorResponse(BaseModel):
    code: str
    message: str
    details: list[dict] | None = None

@app.exception_handler(RequestValidationError)
async def validation_error_handler(request, exc: RequestValidationError):
    errors = [
        {
            "field": ".".join(str(loc) for loc in err["loc"][1:]),
            "message": err["msg"],
            "code": err["type"].upper(),
        }
        for err in exc.errors()
    ]
    return JSONResponse(
        status_code=422,
        content={
            "code": "VALIDATION_ERROR",
            "message": "Request validation failed",
            "details": errors,
        },
    )

@app.exception_handler(HTTPException)
async def http_exception_handler(request, exc: HTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={"code": exc.detail.get("code", "ERROR"), "message": exc.detail},
    )
```

---

## 4. Application-Level Error Codes

Define machine-readable error codes in addition to HTTP status:

```python
class ErrorCode:
    # Auth
    INVALID_CREDENTIALS = "INVALID_CREDENTIALS"
    TOKEN_EXPIRED = "TOKEN_EXPIRED"
    INSUFFICIENT_PERMISSIONS = "INSUFFICIENT_PERMISSIONS"

    # Resources
    USER_NOT_FOUND = "USER_NOT_FOUND"
    EMAIL_ALREADY_REGISTERED = "EMAIL_ALREADY_REGISTERED"
    ORDER_NOT_FOUND = "ORDER_NOT_FOUND"

    # Business logic
    INSUFFICIENT_STOCK = "INSUFFICIENT_STOCK"
    PAYMENT_DECLINED = "PAYMENT_DECLINED"
    ORDER_ALREADY_CANCELLED = "ORDER_ALREADY_CANCELLED"

# Usage
raise HTTPException(
    status_code=409,
    detail={"code": ErrorCode.EMAIL_ALREADY_REGISTERED, "message": "Email already in use"},
)
```

---

## 5. Retry-After for 429 and 503

When rate-limited or overloaded, tell clients when to retry:

```python
@app.exception_handler(RateLimitExceeded)
async def rate_limit_handler(request, exc):
    return JSONResponse(
        status_code=429,
        content={"code": "RATE_LIMIT_EXCEEDED", "message": "Too many requests"},
        headers={
            "Retry-After": "60",
            "X-RateLimit-Limit": "100",
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": str(int(time.time()) + 60),
        },
    )
```

---

## 6. Validation Errors (422)

FastAPI produces detailed validation error responses automatically:

```json
{
  "detail": [
    {
      "type": "missing",
      "loc": ["body", "email"],
      "msg": "Field required",
      "input": {"name": "Alice"}
    },
    {
      "type": "string_too_short",
      "loc": ["body", "password"],
      "msg": "String should have at least 8 characters",
      "input": "abc",
      "ctx": {"min_length": 8}
    }
  ]
}
```

---

## 7. Internal Server Error — Never Expose Details

```python
@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception", exc_info=exc, extra={
        "path": request.url.path,
        "method": request.method,
    })
    return JSONResponse(
        status_code=500,
        content={
            "code": "INTERNAL_SERVER_ERROR",
            "message": "An unexpected error occurred",
            # Never include: str(exc), stack trace, or internal paths
        },
    )
```

---

## 8. Best Practices

- Return errors in the **same format** as success responses.
- Include a machine-readable `code` for client-side error handling.
- Include a human-readable `message` for debugging.
- Use `4xx` for client errors, `5xx` for server errors — never return 200 with an error body.
- Log all `5xx` errors with full context for debugging.
- Never include sensitive information (stack traces, SQL queries, file paths) in error responses.
