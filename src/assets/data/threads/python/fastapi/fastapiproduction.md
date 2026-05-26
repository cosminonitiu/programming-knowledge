## FastAPI in Production
---

Running FastAPI in production requires proper configuration of the ASGI server, containerisation, reverse proxy setup, health checks, structured logging, and configuration management.

---

## 1. ASGI Server — Uvicorn and Gunicorn

```bash
# Development
uvicorn main:app --reload --port 8000

# Production — multiple workers
uvicorn main:app --workers 4 --host 0.0.0.0 --port 8000

# Gunicorn with Uvicorn workers (recommended for production)
gunicorn main:app \
  --workers 4 \
  --worker-class uvicorn.workers.UvicornWorker \
  --bind 0.0.0.0:8000 \
  --timeout 120 \
  --keepalive 5 \
  --access-logfile - \
  --error-logfile -
```

**Worker count rule of thumb:** `2 * CPU_COUNT + 1`

---

## 2. Configuration with `pydantic-settings`

```python
# config.py
from pydantic_settings import BaseSettings, SettingsConfigDict
from functools import lru_cache

class Settings(BaseSettings):
    app_name: str = "My API"
    environment: str = "development"
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 30
    allowed_origins: list[str] = ["http://localhost:3000"]

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

@lru_cache
def get_settings() -> Settings:
    return Settings()

# .env file:
# DATABASE_URL=postgresql+asyncpg://user:pass@localhost/mydb
# SECRET_KEY=very-secret-key-here
```

---

## 3. Structured Logging

```python
# logging_config.py
import logging
import sys
import json

class JSONFormatter(logging.Formatter):
    def format(self, record: logging.LogRecord) -> str:
        log_entry = {
            "timestamp": self.formatTime(record),
            "level": record.levelname,
            "logger": record.name,
            "message": record.getMessage(),
        }
        if record.exc_info:
            log_entry["exception"] = self.formatException(record.exc_info)
        return json.dumps(log_entry)

def configure_logging():
    handler = logging.StreamHandler(sys.stdout)
    handler.setFormatter(JSONFormatter())
    logging.basicConfig(level=logging.INFO, handlers=[handler])
    logging.getLogger("uvicorn.access").propagate = False
```

---

## 4. Health Check and Readiness Endpoints

```python
from fastapi import status
from fastapi.responses import Response

@app.get("/health", status_code=status.HTTP_200_OK, include_in_schema=False)
async def health_check():
    return {"status": "healthy"}

@app.get("/ready", include_in_schema=False)
async def readiness_check(db: AsyncSession = Depends(get_db)):
    try:
        await db.execute(text("SELECT 1"))
        return {"status": "ready", "database": "ok"}
    except Exception:
        return Response(
            content='{"status": "not ready"}',
            status_code=503,
            media_type="application/json",
        )
```

---

## 5. Docker Setup

```dockerfile
# Dockerfile
FROM python:3.12-slim

WORKDIR /app

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["gunicorn", "main:app", \
     "--workers", "4", \
     "--worker-class", "uvicorn.workers.UvicornWorker", \
     "--bind", "0.0.0.0:8000"]
```

```yaml
# docker-compose.yml
services:
  api:
    build: .
    ports: ["8000:8000"]
    env_file: .env
    depends_on: [db, redis]
  db:
    image: postgres:16
    environment:
      POSTGRES_DB: mydb
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
```

---

## 6. Exception Handling

```python
from fastapi import Request
from fastapi.responses import JSONResponse

class AppError(Exception):
    def __init__(self, message: str, status_code: int = 400):
        self.message = message
        self.status_code = status_code

@app.exception_handler(AppError)
async def app_error_handler(request: Request, exc: AppError):
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.message},
    )

@app.exception_handler(Exception)
async def generic_error_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception", exc_info=exc)
    return JSONResponse(
        status_code=500,
        content={"detail": "Internal server error"},
    )
```

---

## 7. Security Headers Middleware

```python
@app.middleware("http")
async def security_headers(request: Request, call_next):
    response = await call_next(request)
    response.headers["X-Content-Type-Options"] = "nosniff"
    response.headers["X-Frame-Options"] = "DENY"
    response.headers["X-XSS-Protection"] = "1; mode=block"
    response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
    return response
```

---

## 8. Production Checklist

- Set `debug=False` in production (`FastAPI(debug=False)`).
- Load secrets from environment variables, not source code.
- Enable HTTPS via a reverse proxy (nginx, Traefik, AWS ALB).
- Set `allow_origins` to explicit domains, not `["*"]`.
- Use `pool_pre_ping=True` on SQLAlchemy engine.
- Add `/health` and `/ready` endpoints for Kubernetes probes.
- Use structured JSON logging for log aggregation (Datadog, ELK).
- Set request timeouts on Gunicorn to prevent runaway requests.
