## `@ngrx/component-store`

ComponentStore is a lightweight, scoped state management solution. Unlike the global NgRx store, each ComponentStore instance is tied to a specific component or feature — it is created when the component mounts and destroyed when it unmounts.

---

## 1. When to Use ComponentStore

| Scenario | Use ComponentStore? |
|---|---|
| State is only needed within one feature | ✅ Yes |
| Multiple independent instances of the same UI (e.g., an expandable item list) | ✅ Yes |
| State should be destroyed when the component is destroyed | ✅ Yes |
| State needs to be shared across many unrelated features | ❌ Use global NgRx |
| DevTools / time-travel debugging required | ❌ Use global NgRx |

---

## 2. Defining the Store

```typescript
// survey-list.store.ts
import { Injectable } from '@angular/core';
import { ComponentStore } from '@ngrx/component-store';
import { tapResponse } from '@ngrx/operators';

interface SurveyListState {
  surveys:  Survey[];
  loading:  boolean;
  filter:   string;
  error:    string | null;
}

const initialState: SurveyListState = {
  surveys: [],
  loading: false,
  filter:  '',
  error:   null,
};

@Injectable()
export class SurveyListStore extends ComponentStore<SurveyListState> {
  constructor(private service: SurveyService) {
    super(initialState);
  }

  // ─── Selectors ───────────────────────────────────
  readonly surveys$ = this.select(s => s.surveys);
  readonly loading$ = this.select(s => s.loading);
  readonly filter$  = this.select(s => s.filter);

  readonly filteredSurveys$ = this.select(
    this.surveys$,
    this.filter$,
    (surveys, filter) =>
      filter ? surveys.filter(s => s.title.toLowerCase().includes(filter.toLowerCase())) : surveys
  );

  // ─── Updaters (synchronous state changes) ────────
  readonly setFilter = this.updater((state, filter: string) => ({
    ...state, filter
  }));

  readonly removeSurvey = this.updater((state, id: string) => ({
    ...state,
    surveys: state.surveys.filter(s => s.id !== id)
  }));

  // ─── Effects (async operations) ──────────────────
  readonly loadSurveys = this.effect<void>(trigger$ =>
    trigger$.pipe(
      tap(() => this.patchState({ loading: true, error: null })),
      switchMap(() =>
        this.service.getAll().pipe(
          tapResponse({
            next:  surveys => this.patchState({ surveys, loading: false }),
            error: err     => this.patchState({ error: String(err), loading: false }),
          })
        )
      )
    )
  );

  readonly deleteSurvey = this.effect<string>(id$ =>
    id$.pipe(
      concatMap(id =>
        this.service.delete(id).pipe(
          tapResponse({
            next:  () => this.removeSurvey(id),
            error: err => this.patchState({ error: String(err) }),
          })
        )
      )
    )
  );
}
```

---

## 3. Using the Store in a Component

```typescript
@Component({
  standalone: true,
  selector: 'app-survey-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [SurveyListStore],  // scoped to this component subtree
  template: `
    <input [value]="store.filter$ | async" (input)="store.setFilter($event.target.value)" />

    @if (store.loading$ | async) {
      <app-spinner />
    }

    @for (survey of store.filteredSurveys$ | async; track survey.id) {
      <app-survey-card
        [survey]="survey"
        (deleted)="store.deleteSurvey($event)"
      />
    }
  `,
  imports: [SpinnerComponent, SurveyCardComponent, AsyncPipe],
})
export class SurveyListComponent implements OnInit {
  constructor(readonly store: SurveyListStore) {}

  ngOnInit() { this.store.loadSurveys(); }
}
```

---

## 4. ComponentStore vs Global NgRx

| Feature | ComponentStore | Global NgRx |
|---|---|---|
| Scope | Component lifetime | App lifetime |
| Boilerplate | Low (one class) | High (actions, reducer, effects, selectors) |
| DevTools support | ❌ | ✅ |
| Multiple instances | ✅ | ❌ |
| Cross-feature sharing | ❌ | ✅ |
| Testing | Simple — instantiate directly | Needs `MockStore` |

---

## 5. Testing ComponentStore

```typescript
describe('SurveyListStore', () => {
  let store: SurveyListStore;
  let mockService: jasmine.SpyObj<SurveyService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('SurveyService', ['getAll', 'delete']);
    store = new SurveyListStore(mockService);  // direct instantiation — no TestBed needed
  });

  it('should load surveys', (done) => {
    const mockSurveys = [{ id: '1', title: 'Test' }];
    mockService.getAll.and.returnValue(of(mockSurveys));

    store.loadSurveys();

    store.surveys$.subscribe(surveys => {
      expect(surveys).toEqual(mockSurveys);
      done();
    });
  });

  it('should filter surveys', (done) => {
    store.patchState({ surveys: [
      { id: '1', title: 'Q4 Review' },
      { id: '2', title: 'Annual Survey' }
    ]});
    store.setFilter('Q4');

    store.filteredSurveys$.subscribe(filtered => {
      expect(filtered.length).toBe(1);
      expect(filtered[0].id).toBe('1');
      done();
    });
  });
});
```

---

## Architect Interview Notes

- **ComponentStore is the missing middle layer** — most apps have state that is too complex for a simple service but too localized for global NgRx. ComponentStore fits exactly there.
- **`providers: [SurveyListStore]` on the component** means each route that uses this component gets its own store instance — perfect for list/detail patterns with multiple concurrent views.
- **`tapResponse`** from `@ngrx/operators` is cleaner than `tap` + `catchError` for effect error handling.
- **CV connection:** *"On the Survey Platform, per-survey state (edit mode, unsaved changes, validation) lived in ComponentStore instances — each edit form had its own isolated state that cleaned up automatically on navigation."*
