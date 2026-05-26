## Global Error Handling Architecture

Production Angular apps need centralized error handling — not `try/catch` scattered through every component.

---

## 1. `ErrorHandler` — The Global Catch-All

Angular provides a built-in `ErrorHandler` that catches all uncaught errors (synchronous and from component lifecycle hooks).

```typescript
import { ErrorHandler, Injectable, inject } from '@angular/core';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {
  private logger = inject(LoggingService);
  private notification = inject(NotificationService);

  handleError(error: unknown): void {
    const message = this.extractMessage(error);

    // Log to monitoring service (Sentry, DataDog, Application Insights)
    this.logger.logError(error);

    // Show user-friendly notification
    this.notification.showError('Something went wrong. Please try again.');

    // Re-throw in dev to preserve stack trace in console
    if (!environment.production) {
      console.error(error);
    }
  }

  private extractMessage(error: unknown): string {
    if (error instanceof Error) return error.message;
    if (typeof error === 'string') return error;
    return 'Unknown error';
  }
}
```

```typescript
// Register in app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
};
```

---

## 2. HTTP Error Handling — Centralized Interceptor

`ErrorHandler` does not catch errors inside Observables (RxJS errors). HTTP errors need an interceptor.

```typescript
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const notification = inject(NotificationService);
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      switch (error.status) {
        case 401:
          auth.clearToken();
          router.navigate(['/login']);
          break;
        case 403:
          router.navigate(['/forbidden']);
          break;
        case 404:
          notification.showWarning('Resource not found.');
          break;
        case 500:
          notification.showError('Server error. Our team has been notified.');
          break;
        default:
          if (error.status === 0) {
            notification.showError('No connection. Check your network.');
          }
      }
      return throwError(() => error);
    })
  );
};
```

```typescript
// Register alongside auth interceptor
provideHttpClient(withInterceptors([authInterceptor, errorInterceptor]))
```

---

## 3. Route-Level Error Boundaries

For errors that crash a lazy-loaded module, catch them at the route level:

```typescript
{
  path: 'analytics',
  loadComponent: () =>
    import('./analytics.component').then(m => m.AnalyticsComponent)
      .catch(() => import('./error-boundary.component').then(m => m.ErrorBoundaryComponent))
}
```

---

## 4. Logging Service — Abstracted for Swappability

```typescript
export abstract class LoggingService {
  abstract logError(error: unknown, context?: Record<string, unknown>): void;
  abstract logInfo(message: string, context?: Record<string, unknown>): void;
}

@Injectable()
export class SentryLoggingService extends LoggingService {
  logError(error: unknown) {
    Sentry.captureException(error);
  }
  logInfo(message: string, context?: Record<string, unknown>) {
    Sentry.captureMessage(message, { extra: context });
  }
}

@Injectable()
export class ConsoleLoggingService extends LoggingService {
  logError(error: unknown) { console.error(error); }
  logInfo(message: string) { console.log(message); }
}
```

```typescript
// Swap per environment
providers: [
  {
    provide: LoggingService,
    useClass: environment.production ? SentryLoggingService : ConsoleLoggingService
  }
]
```

---

## 5. Unhandled Promise / Observable Rejections

`ErrorHandler` catches synchronous errors and Angular lifecycle errors. For unhandled Observable errors, always add `catchError`. For unhandled Promises, use the global event:

```typescript
// main.ts — catch anything that slips through
window.addEventListener('unhandledrejection', (event) => {
  inject(LoggingService).logError(event.reason);
});
```

---

## Architect Interview Notes

- `ErrorHandler` + HTTP interceptor covers ~95% of production errors — implement both.
- The `LoggingService` abstraction means you can switch from Sentry to DataDog to Application Insights by changing one provider — all components are unaffected.
- **Never swallow errors silently** — always log before a `catchError` returns a fallback value.
- **CV connection:** *"On the AI Reviewer platform, I wired `ErrorHandler` to Azure Application Insights and paired it with an HTTP interceptor for structured error telemetry. This gave us full observability without any per-component error handling code."*
