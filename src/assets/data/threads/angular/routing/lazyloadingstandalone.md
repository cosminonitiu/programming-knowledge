## Lazy Loading with Standalone Components

Angular 14+ allows lazy loading individual standalone components without wrapping them in an NgModule — reducing boilerplate and enabling finer-grained code splitting.

---

## 1. `loadComponent` — Lazy-Loading a Single Component

```typescript
// app.routes.ts
import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./features/dashboard/dashboard.component')
        .then(m => m.DashboardComponent)
  },
  {
    path: 'survey/:id',
    loadComponent: () =>
      import('./features/survey/survey-detail.component')
        .then(m => m.SurveyDetailComponent)
  }
];
```

The component must be declared as `standalone: true`:

```typescript
@Component({
  standalone: true,
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, DashboardWidgetComponent],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent {}
```

---

## 2. `loadChildren` with a Routes Array — Lazy Feature Shell

For feature areas with child routes, export a `Routes` array instead of an `NgModule`:

```typescript
// surveys/surveys.routes.ts
export const SURVEY_ROUTES: Routes = [
  { path: '', component: SurveyListComponent },
  { path: 'new', component: SurveyCreateComponent },
  { path: ':id', component: SurveyDetailComponent },
  { path: ':id/edit', component: SurveyEditComponent },
];
```

```typescript
// app.routes.ts
{
  path: 'surveys',
  loadChildren: () =>
    import('./features/surveys/surveys.routes')
      .then(m => m.SURVEY_ROUTES)
}
```

No `NgModule`, no `RouterModule.forChild()` — just a plain array of routes.

---

## 3. Combining with Guards and Resolvers

```typescript
{
  path: 'admin',
  canMatch: [adminGuard],
  loadChildren: () =>
    import('./features/admin/admin.routes').then(m => m.ADMIN_ROUTES)
}
```

```typescript
{
  path: 'survey/:id',
  loadComponent: () =>
    import('./features/survey/survey-detail.component').then(m => m.SurveyDetailComponent),
  canActivate: [authGuard],
  resolve: { survey: surveyResolver }
}
```

---

## 4. Providing Feature-Level Services in Standalone Routes

Without `NgModule`, feature-level providers go on the route definition:

```typescript
{
  path: 'surveys',
  providers: [
    SurveyFacade,
    { provide: SURVEY_API_URL, useValue: '/api/v2/surveys' },
    importProvidersFrom(StoreModule.forFeature('surveys', surveyReducer))
  ],
  loadChildren: () => import('./features/surveys/surveys.routes').then(m => m.SURVEY_ROUTES)
}
```

This creates a **route-scoped injector** — services provided here are only available within this route subtree.

---

## 5. Full Standalone Bootstrap (`bootstrapApplication`)

```typescript
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withPreloading, PreloadAllModules } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideStore(rootReducers),
    provideEffects(rootEffects),
  ]
});
```

No `AppModule` at all — everything is configured via `provide*` functions.

---

## 6. Migration Path: NgModule → Standalone

```typescript
// Step 1: Mark component standalone: true, move imports from NgModule declarations
@Component({
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  // ...
})
export class SurveyFormComponent {}

// Step 2: Remove from NgModule declarations, add to imports if still needed in module context

// Step 3: Replace loadChildren(() => SurveyModule) with loadComponent or loadChildren(() => ROUTES)

// Step 4: Once all components are standalone, delete the NgModule
```

Use the Angular CLI migration schematic:
```bash
ng generate @angular/core:standalone
```

---

## Architect Interview Notes

- **`loadComponent`** creates a separate chunk per component — best for large pages rarely visited.
- **`loadChildren` with routes array** creates one chunk for the entire feature — better for cohesive feature sets.
- Route-level `providers: []` is the standalone equivalent of `NgModule.forFeature()` — use it for feature-scoped state and services.
- **Never mix `loadChildren` pointing to an NgModule and standalone components in the same subtree** — pick one model per feature and be consistent.
