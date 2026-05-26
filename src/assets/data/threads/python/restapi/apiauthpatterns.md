## API Authentication Patterns
---

REST APIs need to identify and authorise callers. The right pattern depends on who the clients are (browsers, mobile apps, server-to-server), the security requirements, and the user experience constraints.

---

## 1. API Keys

Simplest pattern. Suitable for server-to-server, internal APIs, and developer tools.

```
GET /data
X-API-Key: sk_live_abc123xyz

# or as query param (less secure — appears in logs and browser history)
GET /data?api_key=sk_live_abc123xyz
```

```python
from fastapi import Header, HTTPException

def verify_api_key(x_api_key: str = Header(...)):
    key = secrets.compare_digest(x_api_key, settings.EXPECTED_API_KEY)
    if not key:
        raise HTTPException(status_code=403, detail="Invalid API key")
```

**Always:** use `secrets.compare_digest()` to prevent timing attacks.

---

## 2. Basic Authentication

Username and password, Base64-encoded in the `Authorization` header. Only use over HTTPS.

```
GET /api/resource
Authorization: Basic dXNlcjpwYXNzd29yZA==
# dXNlcjpwYXNzd29yZA== = base64("user:password")
```

Use sparingly — credentials are sent with every request.

---

## 3. Bearer Tokens (JWT)

The most common pattern for web and mobile applications. A short-lived signed token is obtained by authenticating once, then sent with every request.

```
POST /auth/token
{"username": "alice", "password": "secret"}

← 200 OK
{"access_token": "eyJ...", "token_type": "bearer"}

GET /me
Authorization: Bearer eyJ...
```

```python
# JWT anatomy
{
  "header":  {"alg": "HS256", "typ": "JWT"},
  "payload": {"sub": "123", "email": "alice@example.com", "exp": 1234567890},
  "signature": "HMAC-SHA256(base64(header)+'.'+base64(payload), secret_key)"
}
```

---

## 4. OAuth2 — Delegated Access

OAuth2 lets users grant third-party apps limited access without sharing passwords.

```
Authorization Code Flow (browser apps):
  1. User clicks "Login with Google"
  2. Browser → Google: GET /authorize?response_type=code&client_id=...
  3. User logs in and grants permission
  4. Google → App callback: GET /callback?code=abc123
  5. App server → Google: POST /token {code, client_secret}
  6. Google → App: {"access_token": "...", "refresh_token": "..."}

Client Credentials Flow (server-to-server):
  POST /token
  {"grant_type": "client_credentials", "client_id": "...", "client_secret": "..."}
```

---

## 5. Refresh Token Pattern

Access tokens are short-lived (15–60 min). Refresh tokens are long-lived (days/weeks) and used to get new access tokens silently:

```python
# Token endpoint
@app.post("/auth/token")
def login(form: OAuth2PasswordRequestForm = Depends()):
    user = authenticate(form.username, form.password)
    access_token = create_access_token(user.id, expires_in=timedelta(minutes=30))
    refresh_token = create_refresh_token(user.id, expires_in=timedelta(days=7))
    store_refresh_token(user.id, refresh_token)  # persist for revocation
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
    }

@app.post("/auth/refresh")
def refresh(refresh_token: str = Body(..., embed=True)):
    user_id = verify_refresh_token(refresh_token)  # checks signature + DB
    new_access = create_access_token(user_id)
    return {"access_token": new_access, "token_type": "bearer"}
```

---

## 6. mTLS — Mutual TLS (Service-to-Service)

Both client and server present certificates. Used in service meshes (Istio) and zero-trust networking:

```
Client presents certificate → Server verifies against CA
Server presents certificate → Client verifies against CA

No bearer tokens needed — identity is proven by certificate.
```

---

## 7. Scopes and Permissions

```python
# Define scopes on the token
access_token = create_token({
    "sub": str(user.id),
    "scopes": ["orders:read", "profile:write"],
})

# Route requires specific scope
def require_scope(scope: str):
    def checker(token_data: TokenData = Depends(get_current_token)):
        if scope not in token_data.scopes:
            raise HTTPException(403, f"Scope '{scope}' required")
    return Depends(checker)

@app.get("/orders", dependencies=[require_scope("orders:read")])
def list_orders(): ...
```

---

## 8. Security Checklist

- Use HTTPS everywhere — tokens in headers are plaintext over HTTP.
- Set short expiry on access tokens (< 60 min).
- Store refresh tokens in HttpOnly cookies or secure server-side store.
- Rotate refresh tokens on use (refresh token rotation).
- Use `secrets.compare_digest()` for constant-time comparison of secrets.
- Never log tokens, passwords, or API keys.
- Implement rate limiting on auth endpoints to prevent brute-force.
