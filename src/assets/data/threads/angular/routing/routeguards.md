## Route Guards

Route guards are functions (or classes) that the Angular Router calls before activating, deactivating, or loading a route. They return `true` to allow navigation, `false` to block it, or a `UrlTree` to redirect.

---

## 1. Guard Types

| Guard | Interface / Function token | When it runs |
|---|---|---|
| `canActivate` | `CanActivateFn` | Before entering a route |
| `canActivateChild` | `CanActivateChildFn` | Before entering any child route |
| `canDeactivate` | `CanDeactivateFn` | Before leaving a route (unsaved changes) |
| `canMatch` | `CanMatchFn` | Before the route is even matched (replaces `canLoad`) |
| `resolve` | `ResolveFn` | Pre-fetch data before the component renders |

---

## 2. `canActivate` — Protecting Routes

### Class-based (legacy, still works)
```typescript
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private auth: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    if (this.auth.isLoggedIn()) {
      return true;
    }
    return this.router.createUrlTree(['/login'], {
      queryParams: { returnUrl: state.url }
    });
  }
}
```

```typescript
// Route config
{ path: 'dashboard', component: DashboardComponent, canActivate: [AuthGuard] }
```

### Functional guard (modern Angular 14+, preferred)
```typescript
export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return auth.isLoggedIn()
    ? true
    : router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
```

```typescript
{ path: 'dashboard', component: DashboardComponent, canActivate: [authGuard] }
```

---

## 3. `canActivateChild` — Protecting Child Routes

Applied once on the parent route — guards all child routes below it.

```typescript
export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  const auth = inject(AuthService);
  return auth.hasRole('ADMIN')
    ? true
    : inject(Router).createUrlTree(['/forbidden']);
};
```

```typescript
{
  path: 'admin',
  canActivateChild: [adminGuard],
  children: [
    { path: 'users', component: UsersComponent },
    { path: 'reports', component: ReportsComponent },
  ]
}
```

---

## 4. `canDeactivate` — Unsaved Changes Warning

```typescript
export interface HasUnsavedChanges {
  hasUnsavedChanges(): boolean;
}

export const unsavedChangesGuard: CanDeactivateFn<HasUnsavedChanges> = (component) => {
  if (component.hasUnsavedChanges()) {
    return confirm('You have unsaved changes. Leave anyway?');
  }
  return true;
};
```

```typescript
// Component implements the interface
@Component({ /* ... */ })
export class SurveyEditComponent implements HasUnsavedChanges {
  hasUnsavedChanges(): boolean {
    return this.form.dirty;
  }
}
```

```typescript
{ path: 'survey/:id/edit', component: SurveyEditComponent, canDeactivate: [unsavedChangesGuard] }
```

---

## 5. `canMatch` — Matching Routes Conditionally

`canMatch` runs before the route is matched at all. Unlike `canActivate`, if it returns `false` the router continues looking for another matching route rather than blocking navigation entirely. Replaces the old `canLoad` for lazy modules.

```typescript
// Show different dashboards based on role — same path, different components
export const adminMatchGuard: CanMatchFn = () => inject(AuthService).hasRole('ADMIN');
export const userMatchGuard: CanMatchFn  = () => !inject(AuthService).hasRole('ADMIN');

const routes: Routes = [
  {
    path: 'dashboard',
    canMatch: [adminMatchGuard],
    loadComponent: () => import('./admin-dashboard.component').then(m => m.AdminDashboardComponent)
  },
  {
    path: 'dashboard',
    canMatch: [userMatchGuard],
    loadComponent: () => import('./user-dashboard.component').then(m => m.UserDashboardComponent)
  }
];
```

---

## 6. Guard Execution Order

When navigating to a child route, Angular runs guards in this order:
1. `canMatch` — decides whether the route is a candidate
2. `canActivateChild` — on all ancestor routes
3. `canActivate` — on the target route
4. `resolve` — pre-fetches data
5. Component renders

If any guard returns `false` or a `UrlTree`, the sequence stops and navigation is cancelled or redirected.

---

## 7. Async Guards (Observable / Promise)

Guards can return `Observable<boolean | UrlTree>` — the router waits for the first emission and then completes.

```typescript
export const permissionGuard: CanActivateFn = (route) => {
  const permissions = inject(PermissionService);
  const router = inject(Router);
  const required = route.data['permission'] as string;

  return permissions.check(required).pipe(
    map(allowed => allowed ? true : router.createUrlTree(['/forbidden'])),
    catchError(() => of(router.createUrlTree(['/error'])))
  );
};
```

```typescript
// Route config passes data to the guard
{
  path: 'analytics',
  component: AnalyticsComponent,
  canActivate: [permissionGuard],
  data: { permission: 'VIEW_ANALYTICS' }
}
```

---

## Architect Interview Notes

- **Prefer functional guards** — they compose better, are easier to test, and don't require `Injectable` boilerplate.
- **Always return `UrlTree` for redirects** instead of calling `router.navigate()` inside a guard — prevents race conditions.
- **`canMatch` vs `canActivate`**: use `canMatch` when you want route-level A/B splitting or role-based component loading. Use `canActivate` when you want to redirect to login.
- Guards compose — you can pass multiple: `canActivate: [authGuard, featureFlagGuard]`. All must pass.
