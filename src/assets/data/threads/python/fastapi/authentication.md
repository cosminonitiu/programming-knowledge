## Authentication and JWT
---

FastAPI does not ship with authentication built-in, but provides all the tools needed to implement it cleanly. The most common approach is JWT (JSON Web Tokens) with OAuth2 Bearer tokens.

---

## 1. OAuth2 Password Flow — Setup

```python
from fastapi import FastAPI, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from jose import JWTError, jwt
from passlib.context import CryptContext
from datetime import datetime, timedelta
from pydantic import BaseModel

SECRET_KEY = "super-secret-key-keep-in-env"  # use os.environ in production!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/token")

app = FastAPI()
```

---

## 2. Password Hashing

```python
def hash_password(plain: str) -> str:
    return pwd_context.hash(plain)

def verify_password(plain: str, hashed: str) -> bool:
    return pwd_context.verify(plain, hashed)
```

---

## 3. JWT Token Creation and Decoding

```python
class TokenData(BaseModel):
    user_id: int
    email: str

def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    expire = datetime.utcnow() + (expires_delta or timedelta(minutes=15))
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)

def decode_token(token: str) -> TokenData:
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return TokenData(user_id=payload["sub"], email=payload["email"])
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )
```

---

## 4. Login Endpoint

```python
@app.post("/auth/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = get_user_by_email(form.username)  # username = email in this pattern
    if not user or not verify_password(form.password, user.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )
    token = create_access_token(
        data={"sub": str(user.id), "email": user.email},
        expires_delta=timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES),
    )
    return {"access_token": token, "token_type": "bearer"}
```

---

## 5. Protected Routes

```python
from typing import Annotated

def get_current_user(token: str = Depends(oauth2_scheme)) -> User:
    token_data = decode_token(token)
    user = get_user_by_id(token_data.user_id)
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    return user

CurrentUser = Annotated[User, Depends(get_current_user)]

@app.get("/me")
def get_me(user: CurrentUser):
    return user

@app.get("/admin/dashboard")
def admin_dashboard(user: CurrentUser):
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Admin access required")
    return {"stats": get_admin_stats()}
```

---

## 6. Refresh Tokens Pattern

```python
REFRESH_TOKEN_EXPIRE_DAYS = 7

def create_refresh_token(user_id: int) -> str:
    return create_access_token(
        {"sub": str(user_id), "type": "refresh"},
        expires_delta=timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS),
    )

@app.post("/auth/refresh")
def refresh(refresh_token: str = Body(..., embed=True)):
    try:
        payload = jwt.decode(refresh_token, SECRET_KEY, algorithms=[ALGORITHM])
        if payload.get("type") != "refresh":
            raise ValueError("Not a refresh token")
        user_id = int(payload["sub"])
    except (JWTError, ValueError):
        raise HTTPException(status_code=401, detail="Invalid refresh token")

    new_access = create_access_token({"sub": str(user_id)})
    return {"access_token": new_access, "token_type": "bearer"}
```

---

## 7. API Key Authentication

```python
from fastapi.security import APIKeyHeader

api_key_header = APIKeyHeader(name="X-API-Key")

def verify_api_key(key: str = Depends(api_key_header)):
    if key != os.environ["API_KEY"]:
        raise HTTPException(status_code=403, detail="Invalid API key")

@app.get("/data", dependencies=[Depends(verify_api_key)])
def get_data():
    return {"data": "protected"}
```

---

## 8. Security Best Practices

- Store `SECRET_KEY` in environment variables, never in code.
- Use `bcrypt` for password hashing — never MD5 or SHA1.
- Set short expiry on access tokens (15–30 minutes).
- Use HTTPS in production — tokens in headers are plaintext over HTTP.
- Invalidate refresh tokens on logout (store in Redis/DB with revocation list).
- Use `httpOnly` cookies instead of `Authorization` header for browser clients (XSS protection).
