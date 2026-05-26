## REST Principles
---

REST (Representational State Transfer) is an architectural style for distributed hypermedia systems. Roy Fielding defined six constraints in his 2000 dissertation. Understanding these principles helps design APIs that are scalable, maintainable, and intuitive.

---

## 1. The Six REST Constraints

| Constraint | Description |
|-----------|-------------|
| **Client-Server** | UI and data storage are separated. Client and server evolve independently. |
| **Stateless** | Each request contains all information needed. Server stores no client session state. |
| **Cacheable** | Responses must declare whether they can be cached. Improves performance. |
| **Uniform Interface** | Standardised interaction through resource identification, manipulation via representations, self-descriptive messages, and HATEOAS. |
| **Layered System** | Client cannot tell if it's connected directly to the server or through intermediaries (load balancers, caches). |
| **Code on Demand** (optional) | Server can send executable code (JavaScript) to the client. |

---

## 2. Statelessness in Practice

```
# STATEFUL (non-RESTful) — server remembers session
POST /login → server stores session → subsequent requests use session cookie

# STATELESS (RESTful) — every request is self-contained
GET /users/123
Authorization: Bearer eyJhbGciOiJIUzI1NiJ9...
# Token contains identity; server authenticates each request independently
```

Benefits of statelessness:
- Any server instance can handle any request (horizontal scaling).
- No session synchronisation needed between servers.
- Failed requests can be retried safely.

---

## 3. HTTP Verbs and Their Semantics

| Verb | Safe? | Idempotent? | Use Case |
|------|-------|------------|----------|
| GET | Yes | Yes | Retrieve a resource |
| HEAD | Yes | Yes | Get headers only |
| POST | No | No | Create or trigger action |
| PUT | No | Yes | Full replace |
| PATCH | No | No | Partial update |
| DELETE | No | Yes | Delete |
| OPTIONS | Yes | Yes | CORS preflight |

- **Safe**: no side effects (read-only).
- **Idempotent**: calling N times has the same effect as calling once.

---

## 4. HTTP Status Codes

```
2xx — Success
  200 OK            — GET, PUT, PATCH succeeded
  201 Created       — POST created a resource; include Location header
  204 No Content    — DELETE succeeded; no body to return
  206 Partial       — Range request served

3xx — Redirection
  301 Moved Permanently — resource has a new permanent URL
  304 Not Modified      — cached version is still valid (ETag matched)

4xx — Client Error
  400 Bad Request       — malformed request syntax
  401 Unauthorized      — not authenticated
  403 Forbidden         — authenticated but not allowed
  404 Not Found         — resource doesn't exist
  409 Conflict          — state conflict (duplicate email)
  410 Gone              — resource permanently deleted
  422 Unprocessable     — valid syntax, but semantic error (validation failure)
  429 Too Many Requests — rate limit exceeded

5xx — Server Error
  500 Internal Server Error — unexpected server failure
  502 Bad Gateway           — upstream service error
  503 Service Unavailable   — server overloaded or down for maintenance
  504 Gateway Timeout       — upstream service timed out
```

---

## 5. HATEOAS

Hypermedia as the Engine of Application State: responses include links to related actions:

```json
GET /orders/123

{
  "id": 123,
  "status": "pending",
  "total": 59.99,
  "_links": {
    "self":    { "href": "/orders/123", "method": "GET" },
    "pay":     { "href": "/orders/123/payment", "method": "POST" },
    "cancel":  { "href": "/orders/123/cancel", "method": "DELETE" },
    "items":   { "href": "/orders/123/items", "method": "GET" }
  }
}
```

This allows clients to navigate the API without hardcoding URLs.

---

## 6. Content Negotiation

```
# Client tells server what format it wants
GET /users/1
Accept: application/json

# Server confirms what it's sending
HTTP/1.1 200 OK
Content-Type: application/json; charset=utf-8

# Client sends data in a specific format
POST /users
Content-Type: application/json
```

---

## 7. Caching Headers

```
# ETag — fingerprint of the response content
HTTP/1.1 200 OK
ETag: "abc123"
Cache-Control: max-age=3600, must-revalidate

# Client sends conditional request on next call
GET /products/1
If-None-Match: "abc123"

# Server: if unchanged, return 304 (no body, saves bandwidth)
HTTP/1.1 304 Not Modified
```

---

## 8. REST vs RPC vs GraphQL

| | REST | gRPC | GraphQL |
|-|------|------|---------|
| **Paradigm** | Resource-centric | Function-centric | Query-centric |
| **Transport** | HTTP/1.1, HTTP/2 | HTTP/2 (Protobuf) | HTTP |
| **Typing** | OpenAPI | Protobuf schema | GraphQL schema |
| **Over/under-fetching** | Can over-fetch | Precise | Client-defined |
| **Best for** | Public APIs, CRUD | Internal microservices | Complex queries, mobile |
