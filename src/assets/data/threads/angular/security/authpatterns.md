## Authentication Patterns in Angular

---

## 1. JWT Storage Strategy

JWTs (JSON Web Tokens) are the most common auth token format in Angular SPAs. Where you store them matters for security.

| Storage | XSS Risk | CSRF Risk | Notes |
|---|---|---|---|
| `localStorage` | **High** — any JS can read it | None | Never use for sensitive apps |
| `sessionStorage` | **High** — any JS can read it | None | Cleared on tab close |
| Memory (service variable) | **Low** | None | Lost on refresh — requires silent refresh |
| `HttpOnly` cookie | **None** — JS can't read | **Medium** — needs CSRF protection | Most secure option |

### Recommended: Memory + HttpOnly refresh token cookie

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private accessToken: string | null = null;  // in memory only

  setToken(token: string) { this.accessToken = token; }
  getToken(): string | null { return this.accessToken; }
  clearToken() { this.accessToken = null; }

  isLoggedIn(): boolean { return !!this.accessToken; }
}
```

The access token lives in memory — gone on refresh, so you need silent refresh via a `HttpOnly` refresh token cookie.

---

## 2. HTTP Interceptor for Token Attachment

```typescript
// auth.interceptor.ts — functional interceptor (Angular 15+)
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const token = auth.getToken();

  if (!token) return next(req);

  const authReq = req.clone({
    setHeaders: { Authorization: `Bearer ${token}` }
  });

  return next(authReq);
};
```

```typescript
// Register in app.config.ts
provideHttpClient(withInterceptors([authInterceptor]))
```

---

## 3. Token Refresh — Handling 401 Responses

```typescript
// refresh.interceptor.ts
export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !req.url.includes('/auth/refresh')) {
        return auth.refreshToken().pipe(
          switchMap(({ accessToken }) => {
            auth.setToken(accessToken);
            const retried = req.clone({
              setHeaders: { Authorization: `Bearer ${accessToken}` }
            });
            return next(retried);
          }),
          catchError(() => {
            auth.clearToken();
            router.navigate(['/login']);
            return throwError(() => error);
          })
        );
      }
      return throwError(() => error);
    })
  );
};
```

**Important:** Use `switchMap` (not `mergeMap`) so concurrent 401s share one refresh call. In production, add a `BehaviorSubject` to queue concurrent requests until the refresh resolves.

---

## 4. Queuing Concurrent Requests During Refresh

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private refreshing = false;
  private refreshSubject = new BehaviorSubject<string | null>(null);

  getTokenWithRefresh(): Observable<string> {
    if (this.refreshing) {
      return this.refreshSubject.pipe(
        filter(token => token !== null),
        take(1),
        map(token => token!)
      );
    }

    this.refreshing = true;
    return this.http.post<{ accessToken: string }>('/auth/refresh', {}, { withCredentials: true }).pipe(
      tap(({ accessToken }) => {
        this.setToken(accessToken);
        this.refreshSubject.next(accessToken);
        this.refreshing = false;
      }),
      map(({ accessToken }) => accessToken),
      catchError(err => {
        this.refreshing = false;
        this.refreshSubject.next(null);
        return throwError(() => err);
      })
    );
  }
}
```

---

## 5. Route Guard–Based Auth

```typescript
// auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

```typescript
// After login — redirect back to intended route
@Component({ /* ... */ })
export class LoginComponent {
  private returnUrl = inject(ActivatedRoute).snapshot.queryParams['returnUrl'] || '/dashboard';

  onLogin(credentials: LoginForm) {
    this.auth.login(credentials).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    });
  }
}
```

---

## 6. OAuth2 / OIDC with `angular-oauth2-oidc`

For enterprise SSO (Azure AD, Okta, Keycloak):

```bash
npm install angular-oauth2-oidc
```

```typescript
// app.config.ts
import { provideOAuthClient } from 'angular-oauth2-oidc';

export const appConfig: ApplicationConfig = {
  providers: [
    provideOAuthClient({
      resourceServer: {
        allowedUrls: ['https://api.yourdomain.com'],
        sendAccessToken: true
      }
    })
  ]
};
```

```typescript
// auth.service.ts
@Injectable({ providedIn: 'root' })
export class AuthService {
  constructor(private oauthService: OAuthService) {
    this.oauthService.configure({
      issuer: 'https://login.microsoftonline.com/{tenantId}/v2.0',
      clientId: 'your-client-id',
      redirectUri: window.location.origin,
      scope: 'openid profile email api://your-api/.default',
      responseType: 'code',
      useSilentRefresh: true,
    });
    this.oauthService.loadDiscoveryDocumentAndTryLogin();
  }

  login() { this.oauthService.initCodeFlow(); }
  logout() { this.oauthService.logOut(); }
  isLoggedIn() { return this.oauthService.hasValidAccessToken(); }
}
```

---

## Architect Interview Notes

- **Never store JWTs in `localStorage`** for sensitive apps — XSS can steal them. Use memory + `HttpOnly` refresh cookie.
- **Functional interceptors** (Angular 15+) are the modern approach — class-based `HTTP_INTERCEPTORS` multi-providers still work but are legacy.
- The **concurrent refresh problem** is a common interview question — the answer is queuing requests using a `BehaviorSubject`.
- For enterprise: `angular-oauth2-oidc` handles PKCE, silent refresh, and token expiry automatically — don't roll your own OAuth.
- **CV connection:** *"The Survey Management Platform had enterprise-grade security with role-based access control. We used `HttpOnly` cookies for refresh tokens and in-memory access tokens, with an interceptor handling silent refresh transparently."*
