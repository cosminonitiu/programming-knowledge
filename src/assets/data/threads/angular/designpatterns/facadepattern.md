## Facade Pattern for NgRx State Abstraction

The Facade pattern wraps the NgRx store behind a service, shielding components from knowing anything about the store's structure. Components talk to the Facade; only the Facade talks to the store.

---

## 1. The Problem Without a Facade

```typescript
// Without Facade — component knows about NgRx internals
@Component({ ... })
export class SurveyListComponent {
  private store = inject(Store);

  surveys$ = this.store.select(selectAllSurveys);
  isLoading$ = this.store.select(selectSurveysLoading);
  error$ = this.store.select(selectSurveysError);

  load() { this.store.dispatch(SurveyActions.loadAll()); }
  delete(id: string) { this.store.dispatch(SurveyActions.deleteOne({ id })); }
}
```

Problems: components are tightly coupled to action names, selector paths, and the NgRx API.

---

## 2. The Facade Service

```typescript
// surveys.facade.ts
@Injectable({ providedIn: 'root' })
export class SurveyFacade {
  private store = inject(Store);

  // Expose selectors as observables (or signals)
  readonly surveys$ = this.store.select(selectAllSurveys);
  readonly isLoading$ = this.store.select(selectSurveysLoading);
  readonly error$ = this.store.select(selectSurveysError);
  readonly activeSurvey$ = this.store.select(selectActiveSurvey);

  // Signal-based API (Angular 17+)
  readonly surveys = toSignal(this.surveys$, { initialValue: [] });

  // Encapsulate all dispatches
  loadAll(): void {
    this.store.dispatch(SurveyActions.loadAll());
  }

  loadOne(id: string): void {
    this.store.dispatch(SurveyActions.loadOne({ id }));
  }

  create(survey: CreateSurveyDto): void {
    this.store.dispatch(SurveyActions.create({ survey }));
  }

  delete(id: string): void {
    this.store.dispatch(SurveyActions.deleteOne({ id }));
  }

  setActive(id: string): void {
    this.store.dispatch(SurveyActions.setActive({ id }));
  }
}
```

```typescript
// survey-list.component.ts — clean, no NgRx dependency
@Component({ ... })
export class SurveyListComponent {
  private facade = inject(SurveyFacade);

  surveys = this.facade.surveys;
  isLoading = toSignal(this.facade.isLoading$);

  ngOnInit() { this.facade.loadAll(); }
  delete(id: string) { this.facade.delete(id); }
}
```

---

## 3. Testing — The Biggest Advantage

With a facade, you never need `MockStore` in component tests:

```typescript
// No MockStore, no NgRx knowledge needed in the component test
describe('SurveyListComponent', () => {
  const mockFacade: Partial<SurveyFacade> = {
    surveys: signal([{ id: '1', title: 'Test Survey' }]),
    isLoading$: of(false),
    loadAll: jasmine.createSpy('loadAll'),
    delete: jasmine.createSpy('delete'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SurveyListComponent],
      providers: [{ provide: SurveyFacade, useValue: mockFacade }]
    });
  });

  it('should call loadAll on init', () => {
    const fixture = TestBed.createComponent(SurveyListComponent);
    fixture.detectChanges();
    expect(mockFacade.loadAll).toHaveBeenCalled();
  });
});
```

---

## 4. Facade With Feature State (Lazy Loaded)

```typescript
// surveys-state.module.ts (or provideState in routes)
@NgModule({
  imports: [StoreModule.forFeature(SURVEYS_FEATURE_KEY, surveysReducer)]
})
export class SurveysStateModule {}

// surveys.facade.ts — scoped to the feature
@Injectable()  // NOT providedIn: 'root' — scoped to the feature
export class SurveyFacade { ... }
```

```typescript
// Provide facade at route level
{
  path: 'surveys',
  loadChildren: () => import('./surveys/surveys.routes'),
  providers: [SurveyFacade, provideState(SURVEYS_FEATURE_KEY, surveysReducer)]
}
```

---

## 5. When to Use the Facade Pattern

| Scenario | Use Facade? |
|---|---|
| Large app, multiple teams | **Yes** — API contract between teams |
| Component needs 3+ selectors | **Yes** — reduces coupling |
| Components are often tested in isolation | **Yes** — trivial to mock |
| Small app, single developer | **Maybe** — adds a layer of indirection |
| Only 1 component uses this state | **No** — over-engineering |

---

## CV Connection

*"On the Survey Management Platform at Aumovio, I introduced the Facade pattern to separate NgRx concerns from our presentation components. This made our component tests simpler (plain spies instead of MockStore) and allowed teams to refactor the state structure without touching components."*

---

## Architect Notes

- Facades are the **public API** of a feature's state — keep them stable even if the store structure changes
- One facade per feature domain, not per component
- Avoid exposing raw store selectors through the facade — wrap them in business-meaningful names (`activeSurvey$` not `selectSurveyById$`)
- Signals are better than observables for the facade's read API in Angular 17+
