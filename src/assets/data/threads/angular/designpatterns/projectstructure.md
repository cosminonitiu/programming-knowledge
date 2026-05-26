## Angular Project Structure — Architecture Decisions

The single decision with the longest-lasting impact on maintainability is how you organize your code. Two main philosophies: **layer-first** vs **feature-first**.

---

## 1. Layer-First Structure (Anti-Pattern for Large Apps)

```
src/app/
├── components/       ← all components everywhere
├── services/         ← all services everywhere
├── models/           ← all models everywhere
├── pipes/            ← all pipes everywhere
└── store/            ← all state everywhere
```

**Problem:** To work on the "surveys" feature, you navigate five different folders. Changes to one feature touch files scattered everywhere. Teams working on different features constantly edit the same folders.

---

## 2. Feature-First Structure (Recommended)

```
src/app/
├── core/                        ← singleton services, app-wide interceptors, guards
│   ├── auth/
│   │   ├── auth.service.ts
│   │   └── auth.guard.ts
│   ├── http/
│   │   └── api-error.interceptor.ts
│   └── core.providers.ts        ← export all core providers
│
├── shared/                      ← reusable, stateless UI components + pipes + directives
│   ├── components/
│   │   ├── button/
│   │   └── modal/
│   ├── pipes/
│   └── shared.ts                ← barrel export
│
├── features/                    ← business features (lazy-loaded)
│   ├── surveys/
│   │   ├── pages/
│   │   │   ├── survey-list/
│   │   │   └── survey-detail/
│   │   ├── components/          ← feature-specific components
│   │   ├── services/            ← feature-specific services
│   │   ├── store/               ← NgRx: actions, reducers, selectors, effects
│   │   │   ├── surveys.actions.ts
│   │   │   ├── surveys.reducer.ts
│   │   │   ├── surveys.selectors.ts
│   │   │   ├── surveys.effects.ts
│   │   │   └── surveys.facade.ts
│   │   ├── models/
│   │   └── surveys.routes.ts
│   │
│   └── dashboard/
│       ├── pages/
│       ├── store/
│       └── dashboard.routes.ts
│
└── app.routes.ts
```

---

## 3. Core vs Shared — The Critical Distinction

| Rule | Core | Shared |
|---|---|---|
| Instantiated | Once (singleton) | Many times |
| Examples | `AuthService`, `HttpInterceptor`, `ErrorHandler` | `ButtonComponent`, `DatePipe`, `TruncatePipe` |
| Provided in | `app.config.ts` (root) | Imported directly where used |
| Contains state | Yes (auth state, user session) | Never |

**The rule:** If you could import a shared component into two different features and get two independent instances — that's correct. If two instances of a service would be a bug — it belongs in core.

---

## 4. Where State Lives

```
features/surveys/store/
├── surveys.actions.ts    ← createActionGroup
├── surveys.reducer.ts    ← on() handlers
├── surveys.selectors.ts  ← createSelector chains
├── surveys.effects.ts    ← loadSurveys$, createSurvey$
└── surveys.facade.ts     ← injectable API over the store
```

State is co-located with the feature. When the feature is lazy-loaded, the state is registered with `provideState()` in the route's `providers` array.

---

## 5. Barrel Exports

```typescript
// features/surveys/index.ts (public API of the feature)
export { SurveysComponent } from './pages/surveys/surveys.component';
export { SurveyFacade } from './store/surveys.facade';
// Do NOT export internal components, reducers, or selectors
```

Other features import from the barrel, not from deep paths:
```typescript
import { SurveyFacade } from '@features/surveys';  // path alias
```

---

## 6. Path Aliases (tsconfig)

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@core/*": ["src/app/core/*"],
      "@shared/*": ["src/app/shared/*"],
      "@features/*": ["src/app/features/*"]
    }
  }
}
```

---

## 7. Module vs Feature Boundaries (Enforcing Architecture)

In Nx monorepos, module boundaries are enforced by lint rules. In a standard Angular workspace, use code review conventions:
- `shared/` components must not import from `features/`
- `core/` must not import from `features/`
- Features must not import from other features directly — use a shared service or the store

---

## Architect Notes

- **Feature-first scales, layer-first doesn't.** At 50+ components, layer-first becomes navigation hell.
- The `core/` vs `shared/` distinction is the hardest to explain to teams — hammer it in code review
- Co-locating store files with features is essential for lazy-loading store slices
- Enforce barrel imports (`@features/surveys`) to control the public API of each feature — it makes refactoring safer
