## Background Tasks
---

FastAPI provides `BackgroundTasks` for running work after returning a response. For heavier workloads, Celery or ARQ integrate well with FastAPI.

---

## 1. `BackgroundTasks` — Simple Fire-and-Forget

```python
from fastapi import FastAPI, BackgroundTasks

app = FastAPI()

def send_welcome_email(email: str, name: str):
    """Runs after the response is sent."""
    send_email(to=email, subject="Welcome!", body=f"Hi {name}!")

@app.post("/users/register")
def register(data: UserCreate, background_tasks: BackgroundTasks):
    user = create_user(data)
    background_tasks.add_task(send_welcome_email, user.email, user.name)
    return {"id": user.id}  # response sent immediately
```

---

## 2. Multiple Background Tasks

```python
@app.post("/orders")
async def place_order(order: OrderCreate, bg: BackgroundTasks):
    saved = await save_order(order)

    bg.add_task(send_order_confirmation, saved.id)
    bg.add_task(update_inventory, saved.items)
    bg.add_task(notify_warehouse, saved)

    return {"order_id": saved.id}
```

---

## 3. Background Tasks with Dependencies

```python
from typing import Annotated
from fastapi import Depends, BackgroundTasks

async def get_email_service():
    return EmailService(smtp_host=settings.SMTP_HOST)

EmailSvc = Annotated[EmailService, Depends(get_email_service)]

@app.post("/invite")
async def send_invite(
    email: str,
    background_tasks: BackgroundTasks,
    email_svc: EmailSvc,
):
    async def do_send():
        await email_svc.send(email, "You're invited!")

    background_tasks.add_task(do_send)
    return {"status": "queued"}
```

---

## 4. Limitations of `BackgroundTasks`

- Runs in the **same process** as the web server — a crash or restart loses pending tasks.
- No retries, no persistence, no scheduling.
- Not suitable for long-running or CPU-intensive work.
- Use **Celery** or **ARQ** for production-grade background processing.

---

## 5. Celery Integration

```python
# celery_app.py
from celery import Celery

celery = Celery(
    "myapp",
    broker="redis://localhost:6379/0",
    backend="redis://localhost:6379/1",
)
celery.conf.task_serializer = "json"

@celery.task(bind=True, max_retries=3, default_retry_delay=60)
def send_email_task(self, email: str, subject: str, body: str):
    try:
        email_client.send(email, subject, body)
    except EmailError as exc:
        raise self.retry(exc=exc)
```

```python
# In FastAPI route
@app.post("/users")
def create_user(data: UserCreate):
    user = save_user(data)
    send_email_task.delay(user.email, "Welcome!", "Welcome to our platform.")
    return user
```

---

## 6. ARQ — Async Task Queue

ARQ uses asyncio natively, making it a natural fit with async FastAPI:

```bash
pip install arq
```

```python
# tasks.py
from arq import create_pool, ArqRedis
from arq.connections import RedisSettings

REDIS_SETTINGS = RedisSettings(host="localhost", port=6379)

async def send_email(ctx, email: str, subject: str):
    await ctx["email_service"].send(email, subject)

class WorkerSettings:
    functions = [send_email]
    redis_settings = REDIS_SETTINGS

# Enqueue from FastAPI
@app.post("/notify")
async def notify(email: str, redis: ArqRedis = Depends(get_redis)):
    await redis.enqueue_job("send_email", email, "Hello!")
    return {"queued": True}
```

---

## 7. Scheduled Tasks with APScheduler

```python
from apscheduler.schedulers.asyncio import AsyncIOScheduler
from contextlib import asynccontextmanager

scheduler = AsyncIOScheduler()

@asynccontextmanager
async def lifespan(app: FastAPI):
    scheduler.add_job(cleanup_expired_tokens, "interval", hours=1)
    scheduler.add_job(generate_daily_report, "cron", hour=2, minute=0)
    scheduler.start()
    yield
    scheduler.shutdown()

app = FastAPI(lifespan=lifespan)
```

---

## 8. When to Use Each Approach

| Scenario | Solution |
|----------|----------|
| Send email after response | `BackgroundTasks` |
| Retry on failure | Celery or ARQ |
| Long-running tasks (> 30s) | Celery + worker processes |
| High-volume async jobs | ARQ |
| Scheduled/cron jobs | APScheduler or Celery Beat |
| CPU-intensive work | Celery with process workers |
