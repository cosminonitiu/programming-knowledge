## Database Integration
---

FastAPI works with any database. The most common patterns use SQLAlchemy (async or sync) with dependency injection to provide a session per request, and Alembic for migrations.

---

## 1. Async SQLAlchemy Setup

```bash
pip install sqlalchemy[asyncio] asyncpg alembic
```

```python
# database.py
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import DeclarativeBase

DATABASE_URL = "postgresql+asyncpg://user:password@localhost/mydb"

engine = create_async_engine(DATABASE_URL, echo=False, pool_size=20)
AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)

class Base(DeclarativeBase):
    pass
```

---

## 2. ORM Models

```python
# models/orm/user.py
from sqlalchemy import String, DateTime, func
from sqlalchemy.orm import Mapped, mapped_column
from database import Base
from datetime import datetime

class User(Base):
    __tablename__ = "users"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)
    email: Mapped[str] = mapped_column(String(255), unique=True, index=True)
    password_hash: Mapped[str] = mapped_column(String(255))
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(server_default=func.now())
```

---

## 3. Database Dependency

```python
# dependencies/db.py
from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession
from database import AsyncSessionLocal

async def get_db() -> AsyncGenerator[AsyncSession, None]:
    async with AsyncSessionLocal() as session:
        try:
            yield session
            await session.commit()
        except Exception:
            await session.rollback()
            raise
```

---

## 4. Repository Pattern

```python
# repositories/user_repo.py
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from models.orm.user import User

class UserRepository:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def get_by_id(self, user_id: int) -> User | None:
        result = await self.db.execute(select(User).where(User.id == user_id))
        return result.scalar_one_or_none()

    async def get_by_email(self, email: str) -> User | None:
        result = await self.db.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, email: str, password_hash: str) -> User:
        user = User(email=email, password_hash=password_hash)
        self.db.add(user)
        await self.db.flush()   # assigns ID without committing
        return user

    async def list_active(self, offset: int = 0, limit: int = 20) -> list[User]:
        result = await self.db.execute(
            select(User).where(User.is_active == True).offset(offset).limit(limit)
        )
        return list(result.scalars())
```

---

## 5. Route Handler with DB

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession
from typing import Annotated
from dependencies.db import get_db
from repositories.user_repo import UserRepository
from models.schemas.user import UserCreate, UserResponse

router = APIRouter(prefix="/users", tags=["Users"])
DB = Annotated[AsyncSession, Depends(get_db)]

@router.post("/", response_model=UserResponse, status_code=201)
async def create_user(data: UserCreate, db: DB):
    repo = UserRepository(db)
    existing = await repo.get_by_email(data.email)
    if existing:
        raise HTTPException(status_code=409, detail="Email already registered")
    user = await repo.create(data.email, hash_password(data.password))
    return user
```

---

## 6. Alembic Migrations

```bash
alembic init alembic
```

```python
# alembic/env.py
from models.orm import Base          # import all ORM models
from database import DATABASE_URL

target_metadata = Base.metadata

def run_migrations_online():
    connectable = engine_from_config(config.get_section(config.config_ini_section))
    with connectable.connect() as conn:
        context.configure(connection=conn, target_metadata=target_metadata)
        with context.begin_transaction():
            context.run_migrations()
```

```bash
alembic revision --autogenerate -m "add users table"
alembic upgrade head
alembic downgrade -1
alembic history
```

---

## 7. Raw SQL with `text()`

```python
from sqlalchemy import text

async def get_user_stats(db: AsyncSession, user_id: int):
    result = await db.execute(
        text("SELECT COUNT(*) as order_count FROM orders WHERE user_id = :uid"),
        {"uid": user_id},
    )
    return result.mappings().one()
```

---

## 8. Connection Pooling

```python
engine = create_async_engine(
    DATABASE_URL,
    pool_size=20,          # number of persistent connections
    max_overflow=10,       # extra connections when pool is full
    pool_timeout=30,       # wait this long before raising error
    pool_pre_ping=True,    # test connection before using (detects stale conns)
    pool_recycle=1800,     # recycle connections every 30 minutes
)
```
