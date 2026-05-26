## Standalone Components

Standalone components are the modern Angular architecture (Angular 14+, default since Angular 17). They declare their own dependencies directly — no `NgModule` required.

---

## 1. What Makes a Component Standalone

```typescript
@Component({
  standalone: true,                    // opt-in flag (default true in Angular 17+)
  selector: 'app-survey-card',
  templateUrl: './survey-card.component.html',
  imports: [                           // dependencies declared directly on the component
    CommonModule,                      // or individual: NgIf, NgFor, AsyncPipe
    RouterModule,
    SurveyStatusBadgeComponent,        // other standalone components
    DatePipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SurveyCardComponent {
  @Input() survey!: Survey;
}
```

**Key difference:** `imports` replaces `NgModule.declarations` + `NgModule.imports`. Each component is self-contained.

---

## 2. Bootstrapping Without `AppModule`

```typescript
// main.ts — standalone bootstrap
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideStore } from '@ngrx/store';
import { provideEffects } from '@ngrx/effects';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withPreloading(PreloadAllModules)),
    provideHttpClient(withInterceptors([authInterceptor, errorInterceptor])),
    provideStore(rootReducers, { metaReducers }),
    provideEffects(rootEffects),
    provideAnimations(),
    { provide: ErrorHandler, useClass: GlobalErrorHandler },
  ]
});
```

`provide*` functions replace `NgModule` imports — they are tree-shakable and composable.

---

## 3. Feature Routes with Route-Scoped Providers

```typescript
// surveys/surveys.routes.ts
export const SURVEY_ROUTES: Routes = [
  {
    path: '',
    providers: [
      SurveyFacade,
      importProvidersFrom(StoreModule.forFeature('surveys', surveyReducer)),
      importProvidersFrom(EffectsModule.forFeature([SurveyEffects])),
    ],
    children: [
      { path: '', loadComponent: () => import('./survey-list.component').then(m => m.SurveyListComponent) },
      { path: ':id', loadComponent: () => import('./survey-detail.component').then(m => m.SurveyDetailComponent) },
    ]
  }
];
```

Providers in `routes[].providers` create a **route-scoped injector** — services are instantiated once for this subtree and destroyed when the user leaves.

---

## 4. `importProvidersFrom` — Bridging NgModule Libraries

Many libraries (Angular Material, NgRx) still use `NgModule`. `importProvidersFrom` extracts their providers for standalone bootstrap:

```typescript
bootstrapApplication(AppComponent, {
  providers: [
    importProvidersFrom(BrowserAnimationsModule),
    importProvidersFrom(MatSnackBarModule),
    importProvidersFrom(StoreModule.forRoot(reducers)),  // until library provides standalone API
  ]
});
```

Most Angular libraries now provide `provide*` functions as the primary API — check the library docs first.

---

## 5. Standalone Pipes and Directives

The same `standalone: true` flag works on pipes and directives:

```typescript
@Pipe({ standalone: true, name: 'surveyStatus' })
export class SurveyStatusPipe implements PipeTransform {
  transform(status: SurveyStatus): string {
    return STATUS_LABELS[status] ?? status;
  }
}

@Directive({ standalone: true, selector: '[appHighlight]' })
export class HighlightDirective { /* ... */ }
```

Import them directly in the component that needs them — no shared module needed.

---

## 6. When to Still Use NgModules

| Scenario | Use NgModule? |
|---|---|
| New greenfield Angular 17+ app | No — standalone by default |
| Legacy app migration | Yes — migrate gradually |
| Publishing a library for others | Still common — check `ng-packagr` guidance |
| Third-party library you consume | Wrap with `importProvidersFrom` |

---

## 7. Angular CLI Migration Schematic

```bash
# Migrates one component at a time
ng generate @angular/core:standalone --path=src/app/features/surveys

# Migrates everything
ng generate @angular/core:standalone --path=src/app

# Three stages: migrate components, remove unnecessary NgModules, bootstrap standalone
```

---

## Architect Interview Notes

- **Standalone is not just syntax sugar** — it enables route-scoped injectors, eliminates shared module anti-patterns, and improves tree-shaking.
- **The `shared.module.ts` anti-pattern** (one giant module that re-exports everything) disappears with standalone — each component declares exactly what it needs.
- **`importProvidersFrom` is a bridge**, not a destination — audit libraries periodically for native `provide*` alternatives.
- **CV connection:** *"In new features on the Survey Platform I used standalone components exclusively. The route-scoped provider pattern replaced `NgModule.forFeature()`, keeping feature state isolated without a module file."*
