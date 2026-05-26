## Test Architecture Decisions

Writing tests is easy. Writing the *right* tests — tests that are fast, maintainable, and actually catch regressions — requires architectural thinking.

---

## 1. The Testing Pyramid in Angular Context

```
         /\
        /  \   E2E (Cypress/Playwright)
       /----\  — Full user flows, browser real
      /      \ — Slow, brittle, high value
     /--------\
    /          \ Integration (TestBed)
   /   LARGE   \ — Component + template + CD
  /-  MIDDLE  -\ — Medium speed, good value
 /              \
/-    UNIT     --\ Unit (Jasmine + no TestBed)
                  — Fast, stable, low setup
```

For Angular:
- **Unit**: Services, pipes, pure functions, guards, resolvers (no TestBed)
- **Integration**: Components with TestBed — real template rendering, real DI
- **E2E**: Full user flows in a real browser

---

## 2. What to Test at Each Level

### Unit Tests (No TestBed)

```typescript
// Services are fastest to test without TestBed
describe('SurveyValidationService', () => {
  let service: SurveyValidationService;

  beforeEach(() => {
    service = new SurveyValidationService();  // direct instantiation
  });

  it('should return error when title is empty', () => {
    const result = service.validate({ title: '', questions: [] });
    expect(result.errors).toContain('Title is required');
  });
});
```

Services with dependencies — use real deps or minimal fakes:
```typescript
beforeEach(() => {
  const http = { get: jasmine.createSpy().and.returnValue(of([])) };
  service = new SurveyService(http as any);
});
```

### Integration Tests (With TestBed)

```typescript
describe('SurveyCardComponent', () => {
  let fixture: ComponentFixture<SurveyCardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SurveyCardComponent],  // standalone component
      providers: [{ provide: SurveyFacade, useValue: mockFacade }]
    });
    fixture = TestBed.createComponent(SurveyCardComponent);
  });
});
```

---

## 3. The Mock Boundary Decision

**What to mock:**
- External services (HTTP, localStorage, Auth)
- Angular services not under test (`Router`, `ActivatedRoute`)
- Dependencies that are slow, non-deterministic, or have side effects

**What NOT to mock:**
- The class under test
- Services the component needs to function (test behavior, not isolation)
- Angular's own primitives (`ChangeDetectorRef`, `Renderer2`)

**The rule:** Mock at the boundaries of your system (HTTP, browser APIs, third-party). Don't mock your own services unless they're truly irrelevant to the behavior under test.

---

## 4. Component Testing Strategy

```typescript
// ✅ Test observable behavior — does the UI change when data changes?
it('should show loading indicator while surveys load', () => {
  mockFacade.isLoading.set(true);
  fixture.detectChanges();
  expect(fixture.debugElement.query(By.css('[data-testid="loading"]'))).toBeTruthy();
});

// ✅ Test user interactions — does clicking do the right thing?
it('should call delete when delete button is clicked', () => {
  const deleteBtn = fixture.debugElement.query(By.css('[data-testid="delete"]'));
  deleteBtn.triggerEventHandler('click', null);
  expect(mockFacade.delete).toHaveBeenCalledWith('survey-1');
});

// ❌ Don't test implementation details
it('should set this.isLoading to true', ...) // Who cares — test the template
it('should call this.cd.detectChanges()', ...) // Internal, fragile
```

---

## 5. `data-testid` vs CSS Selectors

```html
<!-- ❌ Fragile — breaks on CSS class rename -->
<button class="btn-primary delete-btn">Delete</button>

<!-- ✅ Stable — test IDs are stable contracts -->
<button data-testid="delete-survey-btn" class="btn-primary">Delete</button>
```

```typescript
fixture.debugElement.query(By.css('[data-testid="delete-survey-btn"]'))
```

Use `data-testid` attributes as a stable contract between your templates and tests.

---

## 6. Async Testing Patterns

```typescript
// fakeAsync + tick for timers/debounce
it('should debounce search input', fakeAsync(() => {
  component.searchControl.setValue('test');
  tick(300); // advance 300ms debounce
  fixture.detectChanges();
  expect(component.results().length).toBeGreaterThan(0);
}));

// waitForAsync for actual Promises/HTTP
it('should load surveys on init', waitForAsync(() => {
  fixture.detectChanges();
  fixture.whenStable().then(() => {
    expect(component.surveys().length).toBe(3);
  });
}));
```

---

## 7. Testing NgRx with MockStore vs Facade

**With Facade (recommended):** Mock the facade directly — no NgRx knowledge needed:
```typescript
providers: [{ provide: SurveyFacade, useValue: createMockFacade() }]
```

**With MockStore (when testing NgRx directly):**
```typescript
providers: [
  provideMockStore({
    initialState: { surveys: { entities: {}, ids: [], loading: false } }
  })
]
```

MockStore is only needed when testing NgRx internals (effects, reducers). In component tests, mock the facade.

---

## 8. Metrics That Matter

| Metric | Good | Warning |
|---|---|---|
| Test execution time | < 10s for unit suite | > 30s — too many integration tests |
| Test coverage | 70–80% meaningful | 100% — likely testing internals |
| Flaky tests | 0 | > 0 — fix immediately |
| Tests that failed for wrong reason | 0 | Tests coupled to implementation |

---

## Architect Notes

- **Coverage % is a vanity metric** — 80% meaningful tests > 100% test-counting coverage
- Integration tests (with TestBed) have the best ROI — they test real rendering + interactions with real DI
- E2E tests should cover happy paths and critical user flows only — they're expensive to maintain
- Tests that test implementation (what code calls internally) are the most brittle — test behavior (what the user sees) instead
