## CSRF Protection in Angular

Cross-Site Request Forgery (CSRF) tricks authenticated users into unknowingly submitting requests to a site they're logged into. It is relevant when Angular uses **cookie-based authentication** (e.g., `HttpOnly` refresh tokens or session cookies).

---

## 1. How CSRF Works

1. User logs into your app — server sets a session/auth cookie.
2. User visits a malicious site.
3. Malicious site makes a request to your API — the browser automatically includes cookies.
4. Server sees valid cookie and processes the request.

JWTs stored in memory or `localStorage` are **not** vulnerable to CSRF (no cookie = no automatic attachment). CSRF is only a concern when you use cookies.

---

## 2. Angular's Built-in CSRF Support (`HttpClientXsrfModule`)

Angular's `HttpClient` automatically reads a CSRF token from a cookie named `XSRF-TOKEN` and sends it in a request header named `X-XSRF-TOKEN` on all mutating requests (`POST`, `PUT`, `PATCH`, `DELETE`).

### Default setup

```typescript
// app.config.ts — standalone
import { provideHttpClient, withXsrfConfiguration } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withXsrfConfiguration({
        cookieName: 'XSRF-TOKEN',      // name of cookie server sets
        headerName: 'X-XSRF-TOKEN',    // name of header Angular sends
      })
    )
  ]
};
```

### Module-based (legacy)

```typescript
@NgModule({
  imports: [
    HttpClientModule,
    HttpClientXsrfModule.withOptions({
      cookieName: 'XSRF-TOKEN',
      headerName: 'X-XSRF-TOKEN',
    })
  ]
})
export class AppModule {}
```

---

## 3. Server-Side Requirements

The server must:
1. Set an `XSRF-TOKEN` cookie (not `HttpOnly` — Angular's JS must read it).
2. Validate the `X-XSRF-TOKEN` header on every mutating request.
3. Reject requests where the header is missing or doesn't match the cookie value.

### Example — .NET Core (pairs well with Angular)

```csharp
// Program.cs
builder.Services.AddAntiforgery(options => {
    options.HeaderName = "X-XSRF-TOKEN";
    options.Cookie.Name = "XSRF-TOKEN";
    options.Cookie.HttpOnly = false; // Must be readable by JavaScript
    options.Cookie.SameSite = SameSiteMode.Strict;
});
```

```csharp
// Middleware — send token on every response
app.Use(async (context, next) => {
    var antiforgery = context.RequestServices.GetRequiredService<IAntiforgery>();
    var tokens = antiforgery.GetAndStoreTokens(context);
    context.Response.Cookies.Append("XSRF-TOKEN", tokens.RequestToken!, new CookieOptions {
        HttpOnly = false,
        Secure = true,
        SameSite = SameSiteMode.Strict
    });
    await next(context);
});
```

---

## 4. `SameSite` Cookie Attribute — Modern Alternative

`SameSite=Strict` or `SameSite=Lax` prevents cross-site requests from including cookies at all — effectively blocking CSRF without needing a token.

```
Set-Cookie: session=abc123; HttpOnly; Secure; SameSite=Strict
```

| SameSite Value | Cross-site GET | Cross-site POST | Recommendation |
|---|---|---|---|
| `Strict` | Blocked | Blocked | Most secure; breaks OAuth redirects |
| `Lax` | Allowed | Blocked | Good balance; Angular default recommendation |
| `None` | Allowed | Allowed | Requires `Secure`; needed for cross-origin auth |

**For most Angular apps with same-origin APIs**: `SameSite=Lax` + HTTPS is sufficient. The XSRF token adds defence in depth.

---

## 5. Excluding CSRF for Specific Requests

Some requests (e.g., to third-party APIs) should not include the CSRF header:

```typescript
export const csrfInterceptor: HttpInterceptorFn = (req, next) => {
  // Don't attach CSRF header for external APIs
  if (!req.url.startsWith('/api')) {
    return next(req);
  }
  // Angular HttpClient handles XSRF automatically for /api calls
  return next(req);
};
```

---

## Architect Interview Notes

- **CSRF only matters if you use cookies** — if you're using in-memory JWT with `Authorization: Bearer`, CSRF is not a concern.
- Angular's `HttpClientXsrfModule` handles the client side automatically — the work is on the server.
- `SameSite=Lax` + `Secure` + `HttpOnly` on session cookies is a strong defence that doesn't require any Angular configuration.
- Layer defences: use CSRF tokens **and** `SameSite` cookies — one guards against bugs in the other.
