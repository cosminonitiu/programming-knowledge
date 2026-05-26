## APP_INITIALIZER & provideAppInitializer

Angular lets you run async initialization logic **before the app renders** — loading config, checking auth, preloading reference data.

---

## 1. The Problem

Some things must complete before any component renders:
- Load remote config (API URL, feature flags) 
- Check if the user has a valid session (refresh token silently)
- Load required lookup data (countries, roles, permissions)

---

## 2. `APP_INITIALIZER` (Angular < 19 style)

```typescript
// config.service.ts
@Injectable({ providedIn: 'root' })
export class ConfigService {
  config: AppConfig | null = null;

  load(): Promise<void> {
    return fetch('/assets/config/app-config.json')
      .then(r => r.json())
      .then(c => { this.config = c; });
  }
}
```

```typescript
// app.config.ts — classic token-based syntax
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: (configService: ConfigService) => () => configService.load(),
    deps: [ConfigService],
    multi: true  // ← always multi: true — multiple initializers can coexist
  }
]
```

The app waits for the returned `Promise` (or `Observable`) to resolve before bootstrapping.

---

## 3. `provideAppInitializer` (Angular 19+, recommended)

The modern form using `inject()`:

```typescript
// app.config.ts
import { provideAppInitializer } from '@angular/core';

providers: [
  provideAppInitializer(() => {
    const configService = inject(ConfigService);
    return configService.load();
  }),
  provideAppInitializer(() => {
    const authService = inject(AuthService);
    return authService.silentRefresh().catch(() => {
      // Don't block boot if silent refresh fails
    });
  })
]
```

Multiple `provideAppInitializer` calls run in **parallel** by default.

---

## 4. Observable-based Initializer

```typescript
provideAppInitializer(() => {
  const permissionsService = inject(PermissionsService);
  // Convert Observable to Promise for the initializer
  return firstValueFrom(permissionsService.loadPermissions());
})
```

---

## 5. Error Handling

If an initializer throws or rejects, Angular **prevents the app from bootstrapping** and throws an error. Always handle failures gracefully:

```typescript
provideAppInitializer(async () => {
  try {
    await inject(ConfigService).load();
  } catch (err) {
    console.error('Config load failed, using defaults');
    // App continues with default config
  }
})
```

---

## 6. Auth Silent Refresh Pattern

A very common pattern: refresh the access token silently before the app renders so the user never sees a flash of unauthenticated UI:

```typescript
provideAppInitializer(() => {
  const auth = inject(AuthService);
  return auth.tryRestoreSession().catch(() => {
    // Not logged in — that's fine, guards will redirect
  });
})
```

```typescript
@Injectable({ providedIn: 'root' })
export class AuthService {
  private store = inject(Store);

  tryRestoreSession(): Promise<void> {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) return Promise.resolve();
    return firstValueFrom(
      this.http.post<TokenResponse>('/auth/refresh', { refreshToken }).pipe(
        tap(tokens => this.store.dispatch(AuthActions.restoreSession({ tokens }))),
        catchError(() => of(null))
      )
    ).then(() => void 0);
  }
}
```

---

## 7. Loading Screen Pattern

Show a loading screen during initialization (outside Angular's zone):

```html
<!-- index.html — shown before Angular bootstraps -->
<body>
  <div id="app-loading">Loading...</div>
  <app-root></app-root>
</body>
```

```typescript
// After initialization, remove the loading screen
provideAppInitializer(async () => {
  await inject(ConfigService).load();
  document.getElementById('app-loading')?.remove();
})
```

---

## Architect Notes

- `provideAppInitializer` is preferred over the `APP_INITIALIZER` token in Angular 18+ — cleaner syntax, no `multi: true` needed
- All initializers run in parallel — if you need them sequential, chain Promises in a single initializer
- Keep initializer logic thin — delegate to services, don't inline business logic
- `APP_INITIALIZER` is one of the best use cases for `inject()` — no constructor injection needed
