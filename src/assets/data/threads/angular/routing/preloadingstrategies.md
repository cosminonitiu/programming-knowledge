## Preloading Strategies

Preloading eagerly downloads lazy-loaded modules **after** the initial page has loaded, so they are ready before the user navigates to them — combining the fast startup of lazy loading with near-instant subsequent navigation.

---

## 1. The Three Strategies

| Strategy | Behaviour | Best For |
|---|---|---|
| No preloading (default) | Modules load only when routed to | Minimal bandwidth usage |
| `PreloadAllModules` | All lazy modules preload after bootstrap | Apps with predictable navigation |
| `QuicklinkStrategy` | Only preloads routes whose `routerLink` is visible in the viewport | Large apps, data-conscious users |
| Custom strategy | Full control — e.g. by role, feature flag, or data attribute | Enterprise apps |

---

## 2. `PreloadAllModules`

```typescript
// app.config.ts (standalone bootstrap)
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules))
  ]
};
```

All lazy routes start downloading as background tasks after the app bootstraps. Simple to set up but wastes bandwidth for routes the user may never visit.

---

## 3. `QuicklinkStrategy` (Recommended for Production)

Preloads only routes that have a `routerLink` currently visible in the viewport (uses `IntersectionObserver`). Best balance of performance and bandwidth.

```bash
npm install ngx-quicklink
```

```typescript
import { provideRouter, withPreloading } from '@angular/router';
import { QuicklinkStrategy } from 'ngx-quicklink';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(QuicklinkStrategy))
  ]
};
```

---

## 4. Custom Preloading Strategy

Load only routes explicitly opted in with `data: { preload: true }` — gives precise control.

```typescript
// selective-preload.strategy.ts
@Injectable({ providedIn: 'root' })
export class SelectivePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    return route.data?.['preload'] ? load() : EMPTY;
  }
}
```

```typescript
// Route config — opt specific routes in
const routes: Routes = [
  {
    path: 'surveys',
    loadChildren: () => import('./surveys/surveys.module').then(m => m.SurveysModule),
    data: { preload: true }   // this module preloads
  },
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule),
    // no data.preload — loads on demand only
  }
];
```

```typescript
// Register the strategy
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes, withPreloading(SelectivePreloadStrategy))
  ]
};
```

---

## 5. Role-Based Preloading

An architect-level pattern: preload only the modules the current user can access.

```typescript
@Injectable({ providedIn: 'root' })
export class RoleBasedPreloadStrategy implements PreloadingStrategy {
  private auth = inject(AuthService);

  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    const requiredRole = route.data?.['preloadForRole'] as string | undefined;
    if (!requiredRole) return EMPTY;
    return this.auth.hasRole(requiredRole) ? load() : EMPTY;
  }
}
```

```typescript
{
  path: 'analytics',
  loadChildren: () => import('./analytics/analytics.module').then(m => m.AnalyticsModule),
  data: { preloadForRole: 'ANALYST' }
}
```

---

## 6. Checking Preload Status

Use `Router.events` to observe when preloading occurs:

```typescript
this.router.events.pipe(
  filter(e => e instanceof RouteConfigLoadStart || e instanceof RouteConfigLoadEnd)
).subscribe(e => console.log('Preload event:', e));
```

---

## Architect Interview Notes

- **`PreloadAllModules`** is fine for small apps; **custom strategy** is the answer for large enterprise apps.
- Preloading only affects lazy-loaded modules — eagerly loaded code is always in the main bundle.
- Combine preloading with **bundle budgets** in `angular.json` to enforce size constraints.
- For standalone components using `loadComponent`, preloading works the same way — the strategy applies to any route with a dynamic import.
