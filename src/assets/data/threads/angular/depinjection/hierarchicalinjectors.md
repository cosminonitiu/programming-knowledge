## Hierarchical Injectors

Angular's DI system has two parallel injector trees that determine how services are resolved and scoped.

---

## 1. The Two Injector Trees

```
ModuleInjector tree               ElementInjector tree
────────────────────              ────────────────────
NullInjector                      HostComponent
  └── PlatformInjector              └── ParentComponent
        └── AppInjector                   └── ChildComponent
              └── FeatureInjector               └── NgDirective
```

- **`ModuleInjector`**: built from `@NgModule.providers` or `providers: []` in `@Injectable`, `provideRouter`, `bootstrapApplication`. Services here are typically singletons.
- **`ElementInjector`**: built from `providers: []` in `@Component` / `@Directive`. Services here are scoped to the component subtree.

---

## 2. Resolution Order

When Angular resolves a dependency, it walks **up** both trees simultaneously:
1. Start at the current `ElementInjector`
2. Walk up through parent components
3. Then search `ModuleInjector` (AppInjector → PlatformInjector)
4. If not found anywhere: `NullInjector` throws `NullInjectorError`

---

## 3. Component-Level Providers (ElementInjector Scope)

```typescript
@Component({
  selector: 'app-survey-form',
  providers: [SurveyFormStateService],  // new instance per component
  template: `...`
})
export class SurveyFormComponent {
  // Gets a NEW SurveyFormStateService, not the root singleton
  constructor(private state: SurveyFormStateService) {}
}
```

Each instance of `SurveyFormComponent` gets its own `SurveyFormStateService`. When the component is destroyed, so is the service instance.

**Use case:** Form state, wizard steps, per-item editing state.

---

## 4. `@Self`, `@SkipSelf`, `@Host`, `@Optional`

These decorators control how Angular traverses the injector tree.

### `@Self` — Only look in this component's injector

```typescript
@Component({ providers: [ValidationService] })
export class InputComponent {
  // ONLY resolves from this component's providers — throws if not found there
  constructor(@Self() private validation: ValidationService) {}
}
```

### `@SkipSelf` — Skip this component's injector, start from parent

```typescript
@Component({ providers: [LoggingService] })
export class ChildComponent {
  // Resolves from the PARENT injector upward — ignores own providers
  constructor(@SkipSelf() private logger: LoggingService) {}
}
```

**Use case:** Allow child to override a service while still accessing the parent's version when needed.

### `@Host` — Only look up to the host component

```typescript
@Directive({ selector: '[appValidation]' })
export class ValidationDirective {
  // Only resolves up to the component that hosts this directive
  constructor(@Host() private formGroup: ControlContainer) {}
}
```

**Use case:** Directives that must find a parent form — stops resolution at the component boundary.

### `@Optional` — Return `null` if not found (don't throw)

```typescript
@Component({ /* ... */ })
export class SurveyComponent {
  constructor(@Optional() private analytics: AnalyticsService) {
    // analytics may be null if not provided — safe to check
    this.analytics?.track('survey_view');
  }
}
```

### Combining decorators

```typescript
constructor(
  @Optional() @SkipSelf() private parentLogger: LoggingService
) {}
```

---

## 5. `forwardRef` — Circular Reference Resolution

When two services depend on each other or a provider references a class not yet declared:

```typescript
providers: [
  {
    provide: VALIDATOR_TOKEN,
    useExisting: forwardRef(() => SurveyValidatorService)
  }
]
```

---

## 6. Route-Level Injector (Standalone Pattern)

```typescript
{
  path: 'surveys',
  providers: [SurveyFacade, SurveyStore],  // scoped to this route subtree
  loadChildren: () => import('./surveys.routes').then(m => m.SURVEY_ROUTES)
}
```

This creates an injector between the root injector and the route's component — the same mechanism as `NgModule.forFeature()` but without the module.

---

## Architect Interview Notes

- **Most developers never need `@Self`/`@SkipSelf`** — but knowing them signals deep DI understanding, which architects must have.
- **"Where do I provide this service?"** is the most common DI architecture question: root (`providedIn: 'root'`) for true singletons, component `providers: []` for instance-per-component, route `providers: []` for feature scope.
- The route-level injector pattern with standalone is a key Angular 17+ architectural building block — replace `NgModule.forFeature()` with it.
- **`@Optional` everywhere is wrong** — it hides missing dependencies. Only use it for genuinely optional integrations (analytics, logging wrappers).
