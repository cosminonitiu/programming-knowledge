## State Management Decision Framework

The hardest architecture decision in Angular is choosing the right state management approach. The answer depends on scope, complexity, and team size — not on personal preference.

---

## 1. The Options

| Tool | Best for | Trade-offs |
|---|---|---|
| Component state (`signal` / property) | Local, ephemeral UI state | Not shared, not persisted |
| Service with `signal` / `BehaviorSubject` | Shared state across a feature, no complex flows | No devtools, no action history |
| `@ngrx/component-store` | Feature-level state with reactive patterns | Scoped, no global store needed |
| `@ngrx/store` (global) | App-wide state, complex async flows, audit trail | Boilerplate, learning curve |
| `@ngrx/signals` (Signal Store) | Global or feature state with signal ergonomics | Newer API, less community material |

---

## 2. Decision Flow

```
Is the state used only inside one component?
  └─ YES → Component signal / local variable
  └─ NO  → Is it used across multiple components in one feature?
              └─ YES → Is the logic complex (multiple async flows, undo/redo)?
                          └─ NO  → Service with Signal / BehaviorSubject
                          └─ YES → @ngrx/component-store
              └─ NO  → Is it truly global (auth, user profile, app config)?
                          └─ YES → @ngrx/store or @ngrx/signals
```

---

## 3. Component State — Signals (Angular 16+)

```typescript
@Component({ standalone: true, /* ... */ })
export class SurveyFilterComponent {
  searchTerm  = signal('');
  activeTab   = signal<'all' | 'mine'>('all');
  isExpanded  = signal(false);

  filteredCount = computed(() =>
    this.surveys().filter(s => s.title.includes(this.searchTerm())).length
  );

  toggle() { this.isExpanded.update(v => !v); }
}
```

Use when: state dies with the component, nothing else needs it.

---

## 4. Shared Service — Signal-Based

```typescript
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<'light' | 'dark'>('light');
  theme = this._theme.asReadonly();

  setTheme(theme: 'light' | 'dark') { this._theme.set(theme); }
  toggle() { this._theme.update(t => t === 'light' ? 'dark' : 'light'); }
}
```

Use when: simple shared state, no complex async, no action log needed.

---

## 5. `@ngrx/component-store` — Feature-Level

Scoped state that lives and dies with a feature. No global store, no boilerplate actions file.

```typescript
interface SurveyState {
  surveys: Survey[];
  loading: boolean;
  error: string | null;
}

@Injectable()
export class SurveyStore extends ComponentStore<SurveyState> {
  constructor(private service: SurveyService) {
    super({ surveys: [], loading: false, error: null });
  }

  // Selectors
  readonly surveys$ = this.select(s => s.surveys);
  readonly loading$ = this.select(s => s.loading);

  // Updaters (synchronous reducers)
  readonly setSurveys = this.updater((state, surveys: Survey[]) => ({
    ...state, surveys, loading: false
  }));

  // Effects (async)
  readonly loadSurveys = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true })),
      switchMap(() =>
        this.service.getAll().pipe(
          tapResponse(
            surveys => this.setSurveys(surveys),
            error => this.patchState({ error: String(error), loading: false })
          )
        )
      )
    )
  );
}
```

```typescript
// Provide per-component (scoped) or per route
@Component({
  providers: [SurveyStore],
  // ...
})
export class SurveyPageComponent {
  constructor(readonly store: SurveyStore) {
    store.loadSurveys();
  }
}
```

---

## 6. Global NgRx — When It's Worth the Ceremony

Use global NgRx when you need:
- **Time-travel debugging** (Redux DevTools)
- **Cross-feature state** (shopping cart across multiple pages)
- **Optimistic updates with rollback**
- **Audit trail** (financial, compliance systems)
- **Team scale** — standardized patterns for 5+ devs

```
Global NgRx adds ~10-15 files per feature (actions, reducer, effects, selectors, facade).
This is worth it at scale. For a 3-person team on a 5-feature app, it is usually overkill.
```

---

## 7. `@ngrx/signals` (Signal Store) — Modern Hybrid

Combines NgRx patterns with Angular's signal reactivity:

```typescript
export const SurveyStore = signalStore(
  { providedIn: 'root' },
  withState<SurveyState>({ surveys: [], loading: false, error: null }),
  withComputed(({ surveys }) => ({
    completedSurveys: computed(() => surveys().filter(s => s.completed)),
    surveyCount: computed(() => surveys().length),
  })),
  withMethods((store, service = inject(SurveyService)) => ({
    loadSurveys: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next: surveys => patchState(store, { surveys, loading: false }),
              error: err => patchState(store, { error: String(err), loading: false }),
            })
          )
        )
      )
    ),
  }))
);
```

---

## 8. Summary Table

| Scenario | Recommended |
|---|---|
| Toggle, tab state, form dirty flag | Component signal |
| Theme, language, current user | Service with signal |
| Feature CRUD with loading state | `@ngrx/component-store` or service |
| Multi-feature cart/session | Global NgRx store |
| New greenfield app, signals-first | `@ngrx/signals` Signal Store |
| Compliance/audit-trail required | Global NgRx store |

---

## Architect Interview Notes

- **The wrong answer:** always using global NgRx regardless of scope. The right answer: justify each layer.
- **The signal transition:** signals don't replace NgRx — they replace `BehaviorSubject` in services and local component state.
- **CV connection:** *"At Aumovio I established the state management architecture: component signals for local UI, services for shared cross-component state, and NgRx for features requiring audit trails and complex async coordination."*
