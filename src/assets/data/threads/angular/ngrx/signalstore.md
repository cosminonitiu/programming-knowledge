## `@ngrx/signals` — Signal Store

NgRx Signal Store (v17+) is the modern, signal-native state management solution. It replaces `ComponentStore` and provides an alternative to global NgRx with better Angular integration.

---

## 1. Why Signal Store?

| | ComponentStore | Signal Store |
|---|---|---|
| Reactive primitives | `Observable` | `Signal` |
| Template reads | `async` pipe required | Direct signal calls `store.surveys()` |
| Computed state | `select()` | `withComputed()` — auto-memoized |
| Boilerplate | Medium | Low |
| Extensibility | Inheritance | Composable features (`withMethods`, `withHooks`) |

---

## 2. Defining a Signal Store

```typescript
// survey.store.ts
import { signalStore, withState, withComputed, withMethods, patchState } from '@ngrx/signals';
import { withEntities, setAllEntities, removeEntity } from '@ngrx/signals/entities';
import { rxMethod } from '@ngrx/signals/rxjs-interop';

export const SurveyStore = signalStore(
  // ── State ──────────────────────────────────────
  withState({
    loading: false,
    error: null as string | null,
    filter: '',
  }),

  // ── Entity collection ──────────────────────────
  withEntities<Survey>(),  // provides ids, entities, selectAll, etc.

  // ── Computed (memoized) ────────────────────────
  withComputed(({ entities, filter }) => ({
    filteredSurveys: computed(() => {
      const term = filter().toLowerCase();
      return entities().filter(s => s.title.toLowerCase().includes(term));
    }),
    surveyCount: computed(() => entities().length),
  })),

  // ── Methods ────────────────────────────────────
  withMethods((store, service = inject(SurveyService)) => ({
    setFilter(filter: string) {
      patchState(store, { filter });
    },

    loadSurveys: rxMethod<void>(
      pipe(
        tap(() => patchState(store, { loading: true, error: null })),
        switchMap(() =>
          service.getAll().pipe(
            tapResponse({
              next:  surveys => patchState(store, setAllEntities(surveys), { loading: false }),
              error: err     => patchState(store, { error: String(err), loading: false }),
            })
          )
        )
      )
    ),

    deleteSurvey: rxMethod<string>(
      pipe(
        concatMap(id =>
          service.delete(id).pipe(
            tapResponse({
              next:  () => patchState(store, removeEntity(id)),
              error: err => patchState(store, { error: String(err) }),
            })
          )
        )
      )
    ),
  })),

  // ── Lifecycle hooks ────────────────────────────
  withHooks({
    onInit(store) { store.loadSurveys(); },
    onDestroy(store) { /* cleanup */ },
  })
);
```

---

## 3. Providing the Store

```typescript
// Feature-scoped (component lifetime)
@Component({
  providers: [SurveyStore],
  // ...
})
export class SurveyPageComponent {}

// Global (app lifetime)
export const SurveyStore = signalStore(
  { providedIn: 'root' },
  // ...
);
```

---

## 4. Using in a Component

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SurveyStore],
  template: `
    <input [value]="store.filter()" (input)="store.setFilter($event.target.value)" />

    @if (store.loading()) {
      <app-spinner />
    }

    @for (survey of store.filteredSurveys(); track survey.id) {
      <app-survey-card
        [survey]="survey"
        (deleted)="store.deleteSurvey($event)"
      />
    }

    <p>Total: {{ store.surveyCount() }}</p>
  `,
})
export class SurveyListComponent {
  store = inject(SurveyStore);
}
```

No `async` pipe — signals are read directly in the template. Combined with `OnPush`, only affected subtrees re-render.

---

## 5. Custom Store Features (Composability)

```typescript
// Reusable loading state feature
export function withLoadingState() {
  return signalStoreFeature(
    withState({ loading: false, error: null as string | null }),
    withMethods(store => ({
      setLoading: (loading: boolean) => patchState(store, { loading }),
      setError: (error: string | null) => patchState(store, { error }),
    }))
  );
}

// Compose into any store
export const SurveyStore = signalStore(
  withLoadingState(),   // reused across stores
  withEntities<Survey>(),
  withMethods(/* ... */)
);
```

---

## 6. Signal Store vs Global NgRx Decision

| Criterion | Signal Store | Global NgRx |
|---|---|---|
| New app (Angular 17+) | ✅ Preferred | Optional |
| Signals-first codebase | ✅ Preferred | Mismatch |
| Existing NgRx codebase | Migration overhead | ✅ Stay |
| Time-travel debugging needed | ❌ Limited | ✅ Full DevTools |
| Complex saga-like side effects | Less natural | ✅ Effects pattern |
| Team familiar with Observables | Either works | ✅ Familiar |

---

## Architect Interview Notes

- **Signal Store is the future of NgRx** — v18 positions it as the primary API for new apps.
- **`rxMethod`** bridges the signal store with RxJS — you write effects in RxJS but they trigger from signals.
- The **custom features pattern** (`signalStoreFeature`) is the signal store's answer to meta-reducers — reusable cross-cutting state concerns.
- **CV connection:** *"For new features on greenfield work I'm moving toward Signal Store — it eliminates `async` pipe noise in templates and aligns with Angular's signals direction. Existing NgRx code stays — you migrate features one by one."*
