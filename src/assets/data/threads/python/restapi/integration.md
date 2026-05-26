## Frontend-Backend Integration
---

Integrating a REST API with a frontend (browser app, mobile app) involves handling authentication flows, managing CORS, consuming APIs efficiently, and handling errors gracefully on the client side.

---

## 1. CORS Configuration

Browsers enforce the same-origin policy. A FastAPI server on `api.example.com` needs to explicitly allow requests from `app.example.com`:

```python
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://app.example.com",
        "https://admin.example.com",
        "http://localhost:3000",    # development
    ],
    allow_credentials=True,         # allow cookies / Authorization header
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-Requested-With"],
    max_age=600,                    # cache preflight for 10 minutes
)
```

---

## 2. Token Storage Strategies

| Storage | XSS Risk | CSRF Risk | Recommendation |
|---------|---------|----------|----------------|
| `localStorage` | High | Low | Avoid for tokens |
| `sessionStorage` | High | Low | Avoid for tokens |
| `httpOnly` cookie | None | High | Use with CSRF protection |
| In-memory (JS variable) | Low | Low | Best for access tokens |

**Best practice:** Store access token in memory (JS), refresh token in `httpOnly` cookie.

---

## 3. httpOnly Cookie Auth Flow

```python
from fastapi import Response, Cookie

@app.post("/auth/login")
def login(response: Response, form: LoginForm):
    user = authenticate(form.email, form.password)
    access_token = create_access_token(user.id)
    refresh_token = create_refresh_token(user.id)

    response.set_cookie(
        key="refresh_token",
        value=refresh_token,
        httponly=True,      # not accessible from JavaScript
        secure=True,        # HTTPS only
        samesite="strict",  # CSRF protection
        max_age=7 * 24 * 3600,
    )
    return {"access_token": access_token}

@app.post("/auth/refresh")
def refresh(response: Response, refresh_token: str = Cookie(None)):
    if not refresh_token:
        raise HTTPException(401, "No refresh token")
    user_id = verify_refresh_token(refresh_token)
    new_access = create_access_token(user_id)
    return {"access_token": new_access}
```

---

## 4. Handling 401 — Automatic Token Refresh

```typescript
// Axios interceptor for automatic token refresh
let isRefreshing = false;
let refreshQueue: ((token: string) => void)[] = [];

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status !== 401) throw error;

    if (isRefreshing) {
      return new Promise((resolve) => {
        refreshQueue.push((newToken) => {
          error.config.headers.Authorization = `Bearer ${newToken}`;
          resolve(axios(error.config));
        });
      });
    }

    isRefreshing = true;
    const { data } = await axios.post("/auth/refresh");
    const newToken = data.access_token;
    refreshQueue.forEach((cb) => cb(newToken));
    refreshQueue = [];
    isRefreshing = false;

    error.config.headers.Authorization = `Bearer ${newToken}`;
    return axios(error.config);
  }
);
```

---

## 5. API Client Design

```typescript
// Typed API client
class ApiClient {
  private baseUrl: string;
  private token: string | null = null;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  setToken(token: string) { this.token = token; }

  private get headers() {
    return {
      "Content-Type": "application/json",
      ...(this.token ? { Authorization: `Bearer ${this.token}` } : {}),
    };
  }

  async get<T>(path: string): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, { headers: this.headers });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  async post<T>(path: string, body: unknown): Promise<T> {
    const res = await fetch(`${this.baseUrl}${path}`, {
      method: "POST",
      headers: this.headers,
      body: JSON.stringify(body),
    });
    if (!res.ok) throw await this.parseError(res);
    return res.json();
  }

  private async parseError(res: Response): Promise<Error> {
    const body = await res.json().catch(() => ({}));
    return new Error(body.detail || `HTTP ${res.status}`);
  }
}
```

---

## 6. Webhook Integration

```python
# Outbound webhook — notify external systems
import httpx
from pydantic import BaseModel

class WebhookPayload(BaseModel):
    event: str
    data: dict
    timestamp: str

async def send_webhook(url: str, payload: WebhookPayload, secret: str):
    body = payload.model_dump_json().encode()
    signature = hmac.new(secret.encode(), body, hashlib.sha256).hexdigest()

    async with httpx.AsyncClient() as client:
        await client.post(
            url,
            content=body,
            headers={
                "Content-Type": "application/json",
                "X-Webhook-Signature": f"sha256={signature}",
            },
            timeout=10.0,
        )
```

---

## 7. API Mocking for Frontend Development

```python
# Mock server for frontend development without real backend
from fastapi import FastAPI
from fastapi.responses import JSONResponse
import random

mock_app = FastAPI()

@mock_app.get("/users")
def mock_users():
    return {"data": [{"id": i, "name": f"User {i}"} for i in range(1, 21)], "total": 100}

@mock_app.post("/orders")
def mock_create_order():
    return JSONResponse({"id": random.randint(1000, 9999), "status": "pending"}, status_code=201)
```
