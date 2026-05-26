## Router Events — Lifecycle & Patterns

Angular's Router emits a stream of events during every navigation. Understanding the full lifecycle is essential for routing progress indicators, analytics, breadcrumbs, and debugging.

---

## 1. The Complete Navigation Lifecycle

```
NavigationStart
  → RouteConfigLoadStart      (only for lazy-loaded modules/components)
  → RouteConfigLoadEnd
  → RoutesRecognized
  → GuardsCheckStart
    → ChildActivationStart
    → ActivationStart
    → CanActivate guard runs
    → CanActivateChild guard runs
    → CanMatch guard runs
    → ChildActivationEnd
    → ActivationEnd
  → GuardsCheckEnd
  → ResolveStart
    → Resolvers run
  → ResolveEnd
  → ActivationStart (component activates)
  → ChildActivationStart
  → Scroll (if scrolling is configured)
  → NavigationEnd
```

On failure:
```
NavigationStart → ... → NavigationCancelled  (guard returned false/UrlTree)
NavigationStart → ... → NavigationError      (resolver threw, component failed to load)
```

---

## 2. Subscribing to Router Events

```typescript
@Injectable({ providedIn: 'root' })
export class NavigationService {
  private router = inject(Router);

  constructor() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        console.log('Navigation started to:', event.url);
      }
      if (event instanceof NavigationEnd) {
        console.log('Navigation ended at:', event.urlAfterRedirects);
      }
      if (event instanceof NavigationError) {
        console.error('Navigation error:', event.error);
      }
    });
  }
}
```

---

## 3. Loading Indicator (Most Common Use Case)

```typescript
@Component({ selector: 'app-root', standalone: true, ... })
export class AppComponent {
  private router = inject(Router);
  isLoading = signal(false);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationStart || e instanceof NavigationEnd
                  || e instanceof NavigationError || e instanceof NavigationCancel)
    ).subscribe(event => {
      this.isLoading.set(event instanceof NavigationStart);
    });
  }
}
```

```html
@if (isLoading()) {
  <div class="loading-bar"></div>
}
<router-outlet></router-outlet>
```

---

## 4. Scroll Restoration

```typescript
// app.config.ts
providers: [
  provideRouter(routes, withInMemoryScrolling({
    scrollPositionRestoration: 'enabled',   // restore scroll on back/forward
    anchorScrolling: 'enabled'              // support fragment (#section) navigation
  }))
]
```

The `Scroll` event fires after `NavigationEnd` and contains the scroll position:
```typescript
this.router.events.pipe(filter(e => e instanceof Scroll)).subscribe((e: Scroll) => {
  if (e.position) {
    // backward navigation — restore to previous position
    viewportScroller.scrollToPosition(e.position);
  } else if (e.anchor) {
    viewportScroller.scrollToAnchor(e.anchor);
  } else {
    viewportScroller.scrollToPosition([0, 0]);
  }
});
```

---

## 5. Analytics / Page View Tracking

```typescript
@Injectable({ providedIn: 'root' })
export class AnalyticsService {
  private router = inject(Router);
  private analytics = inject(AnalyticsProvider);

  init() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe((e: NavigationEnd) => {
      this.analytics.pageView(e.urlAfterRedirects);
    });
  }
}
```

---

## 6. Guard Execution Order

When multiple guards are present on a route:
1. `canMatch` — runs first, determines whether the route matches at all
2. `canActivate` — parent before child
3. `canActivateChild` — parent to child
4. `canDeactivate` — current component before parent
5. `resolve` — runs after all guards pass

If any guard returns `false` or `UrlTree`, a `NavigationCancelled` event fires and subsequent guards are NOT called.

---

## Architect Notes

- Always handle `NavigationError` globally — lazy-loaded chunks can fail to load if the user has a network interruption during navigation
- Use `NavigationEnd` for analytics, not `NavigationStart` — redirects change the final URL
- `urlAfterRedirects` on `NavigationEnd` gives the resolved URL after all redirect guards
- Prefer `withRouterConfig({ onSameUrlNavigation: 'reload' })` for "refresh current page" patterns rather than manually reloading the window
