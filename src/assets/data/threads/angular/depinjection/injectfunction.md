## The `inject()` Function

`inject()` is the modern way to access Angular's DI system. It replaces constructor injection in many patterns and is required in functional contexts (guards, interceptors, resolvers).

---

## 1. Basic Usage

```typescript
import { inject } from '@angular/core';

// In a component (replaces constructor injection)
@Component({ standalone: true, /* ... */ })
export class SurveyListComponent {
  private facade = inject(SurveyFacade);
  private router  = inject(Router);

  surveys$ = this.facade.surveys$;

  navigate(id: string) { this.router.navigate(['/survey', id]); }
}
```

`inject()` can only be called in an **injection context** — during construction of a component, directive, pipe, service, or inside a factory function run by Angular.

---

## 2. `inject()` in Functional Guards and Interceptors

This is the primary use case — functional guards and interceptors cannot use constructor injection:

```typescript
// Guard
export const authGuard: CanActivateFn = () => {
  return inject(AuthService).isLoggedIn()
    ? true
    : inject(Router).createUrlTree(['/login']);
};

// Interceptor
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const token = inject(AuthService).getToken();
  if (!token) return next(req);
  return next(req.clone({ setHeaders: { Authorization: `Bearer ${token}` } }));
};

// Resolver
export const surveyResolver: ResolveFn<Survey> = (route) => {
  return inject(SurveyService).getById(route.params['id']);
};
```

---

## 3. `APP_INITIALIZER` — Run Async Logic Before App Starts

Load config, translations, or user data before the first component renders:

```typescript
// config.initializer.ts
export function configInitializer(): () => Promise<void> {
  const configService = inject(ConfigService);
  return () => configService.loadAppConfig();  // returns Promise
}
```

```typescript
// app.config.ts
providers: [
  {
    provide: APP_INITIALIZER,
    useFactory: configInitializer,
    deps: [],
    multi: true,        // multiple initializers can run in parallel
  }
]
```

Modern Angular (v18+) functional form:

```typescript
import { provideAppInitializer } from '@angular/core';

providers: [
  provideAppInitializer(() => {
    const config = inject(ConfigService);
    return config.loadAppConfig();
  })
]
```

**Use cases:** Fetch feature flags before app renders, load user preferences, initialize analytics.

---

## 4. `inject()` in Class Field Initializers

Cleaner than constructor injection for multiple dependencies:

```typescript
@Injectable({ providedIn: 'root' })
export class SurveyFacade {
  // All injections as field initializers — no constructor parameter list
  private store    = inject(Store);
  private router   = inject(Router);
  private logger   = inject(LoggingService);
  private analytics = inject(AnalyticsService);

  surveys$ = this.store.select(selectAllSurveys);

  loadSurveys() { this.store.dispatch(SurveyActions.loadSurveys()); }
}
```

---

## 5. `inject()` with Tokens and Optionals

```typescript
// Using InjectionToken
export const API_BASE_URL = new InjectionToken<string>('ApiBaseUrl');

@Injectable({ providedIn: 'root' })
export class SurveyApiService {
  private baseUrl = inject(API_BASE_URL);
  private http    = inject(HttpClient);

  getAll() { return this.http.get<Survey[]>(`${this.baseUrl}/surveys`); }
}

// Optional injection
private analytics = inject(AnalyticsService, { optional: true });

// SkipSelf — skip own injector
private parentStore = inject(Store, { skipSelf: true });
```

---

## 6. `runInInjectionContext` — Using `inject()` Outside Construction

For cases where you need DI inside an `effect()` callback or other reactive context:

```typescript
@Component({ /* ... */ })
export class SurveyComponent {
  private injector = inject(Injector);

  ngOnInit() {
    // Run inject() in a deferred context
    runInInjectionContext(this.injector, () => {
      const facade = inject(SurveyFacade);
      facade.loadSurveys();
    });
  }
}
```

Signals' `effect()` runs inside an injection context automatically — `inject()` works directly inside `effect()` callbacks.

---

## Architect Interview Notes

- **`inject()` is strictly superior to constructor injection** in functional code — guards, interceptors, resolvers. There is no debate.
- For class-based code (components, services), `inject()` fields are cleaner than long constructor parameter lists — but either works.
- `APP_INITIALIZER` is the correct place for **bootstrapping async data** — never try to load config in `ngOnInit` of `AppComponent`.
- **The injection context rule** — calling `inject()` outside construction context throws `NG0203`. Use `runInInjectionContext` if you genuinely need it deferred.
