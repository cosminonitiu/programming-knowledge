## Jasmine & Karma: Interview-Ready Testing Guide

Jasmine is Angular's default testing framework. Karma is the test runner that executes specs in real browsers. Together they power `ng test`.

---

## 1. Jasmine Fundamentals

### Test Structure

```typescript
describe('SurveyService', () => {      // Suite — groups related specs
  let service: SurveyService;

  beforeEach(() => {                   // Runs before each spec
    TestBed.configureTestingModule({ providers: [SurveyService] });
    service = TestBed.inject(SurveyService);
  });

  it('should be created', () => {     // Spec (individual test)
    expect(service).toBeTruthy();
  });

  afterEach(() => {                   // Optional cleanup
    // teardown
  });
});
```

### Key Matchers

```typescript
expect(value).toBe(42);                  // strict equality (===)
expect(value).toEqual({ id: 1 });        // deep equality
expect(value).toBeTruthy();              // truthy check
expect(value).toBeFalsy();               // falsy check
expect(array).toContain('item');         // array/string containment
expect(fn).toThrow();                    // function throws
expect(fn).toHaveBeenCalled();           // spy was called
expect(fn).toHaveBeenCalledWith(args);   // spy called with specific args
expect(fn).toHaveBeenCalledTimes(2);     // call count
expect(value).toBeNull();
expect(value).toBeUndefined();
expect(value).toBeGreaterThan(5);
```

---

## 2. Spies — The Core of Jasmine Mocking

Spies let you intercept function calls, control return values, and assert call behaviour without touching real implementations.

### `spyOn` — Spy on an existing method

```typescript
it('should delegate to the service', () => {
  const spy = spyOn(surveyService, 'getAll').and.returnValue(of([]));

  component.ngOnInit();

  expect(spy).toHaveBeenCalledTimes(1);
});
```

### `jasmine.createSpyObj` — Create a full mock object

This is the recommended pattern when injecting mock services into TestBed.

```typescript
describe('SurveyListComponent', () => {
  let component: SurveyListComponent;
  let fixture: ComponentFixture<SurveyListComponent>;
  let mockSurveyService: jasmine.SpyObj<SurveyService>;

  beforeEach(async () => {
    mockSurveyService = jasmine.createSpyObj('SurveyService', ['getAll', 'create', 'delete']);
    mockSurveyService.getAll.and.returnValue(of([{ id: '1', title: 'Q4 Review' }]));

    await TestBed.configureTestingModule({
      declarations: [SurveyListComponent],
      providers: [
        { provide: SurveyService, useValue: mockSurveyService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should load surveys on init', () => {
    expect(mockSurveyService.getAll).toHaveBeenCalledTimes(1);
    expect(component.surveys.length).toBe(1);
  });

  it('should dispatch delete on button click', () => {
    mockSurveyService.delete.and.returnValue(of(void 0));
    component.deleteSurvey('1');
    expect(mockSurveyService.delete).toHaveBeenCalledWith('1');
  });
});
```

### Spy Return Variants

```typescript
spy.and.returnValue(value);           // always returns this value
spy.and.returnValues(v1, v2, v3);     // returns values in sequence per call
spy.and.callThrough();                // calls the real implementation
spy.and.callFake((args) => result);   // custom implementation
spy.and.throwError('message');        // throws an error on call
spy.and.rejectWith('reason');         // returns a rejected Promise
```

---

## 3. Async Testing

### `fakeAsync` + `tick` — Control virtual time

Use for `setTimeout`, `setInterval`, `Promise`, and RxJS schedulers. Everything runs synchronously inside `fakeAsync`.

```typescript
it('should expire after 3 seconds', fakeAsync(() => {
  component.startCountdown();   // internally does setTimeout(3000)

  expect(component.expired).toBeFalse();

  tick(3000);                   // advance virtual clock
  fixture.detectChanges();

  expect(component.expired).toBeTrue();
}));
```

```typescript
it('should debounce search input', fakeAsync(() => {
  component.searchControl.setValue('angular');
  tick(300);                    // debounce time
  fixture.detectChanges();

  expect(mockService.search).toHaveBeenCalledWith('angular');
}));
```

### `async` + `fixture.whenStable()` — Wait for real async

```typescript
it('should load data from a Promise', async () => {
  mockService.getData.and.returnValue(Promise.resolve(['item1', 'item2']));

  fixture.detectChanges();
  await fixture.whenStable();   // waits for all pending micro/macro tasks
  fixture.detectChanges();

  expect(component.items.length).toBe(2);
});
```

### `done` callback — For Observable streams

```typescript
it('should emit value on login', (done) => {
  service.login('user', 'pass').subscribe(result => {
    expect(result.token).toBeDefined();
    done();   // signal Jasmine the async test is complete
  });
});
```

---

## 4. Testing HTTP Services with `HttpClientTestingModule`

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('SurveyService', () => {
  let service: SurveyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [SurveyService]
    });
    service = TestBed.inject(SurveyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();   // fails test if unexpected requests were made
  });

  it('should GET all surveys', () => {
    const mockSurveys = [{ id: '1', title: 'Survey 1' }];

    service.getAll().subscribe(surveys => {
      expect(surveys).toEqual(mockSurveys);
    });

    const req = httpMock.expectOne('/api/surveys');
    expect(req.request.method).toBe('GET');
    req.flush(mockSurveys);   // simulate server response
  });

  it('should POST to create a survey', () => {
    const payload = { title: 'New Survey' };
    const created = { id: '2', ...payload };

    service.create(payload).subscribe(result => {
      expect(result.id).toBe('2');
    });

    const req = httpMock.expectOne('/api/surveys');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(payload);
    req.flush(created);
  });

  it('should handle 404 error', () => {
    service.getById('999').subscribe({
      next: () => fail('should have failed'),
      error: err => expect(err.status).toBe(404)
    });

    const req = httpMock.expectOne('/api/surveys/999');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
```

---

## 5. Testing NgRx-Connected Components with `MockStore`

```typescript
import { MockStore, provideMockStore } from '@ngrx/store/testing';
import * as SurveyActions from '../store/survey.actions';
import { selectAllSurveys } from '../store/survey.selectors';

describe('SurveyDashboardComponent', () => {
  let component: SurveyDashboardComponent;
  let fixture: ComponentFixture<SurveyDashboardComponent>;
  let store: MockStore;

  const initialState = {
    surveys: { ids: [], entities: {}, loading: false, error: null }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SurveyDashboardComponent],
      providers: [provideMockStore({ initialState })]
    }).compileComponents();

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(SurveyDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should dispatch loadSurveys on init', () => {
    const dispatchSpy = spyOn(store, 'dispatch');
    component.ngOnInit();
    expect(dispatchSpy).toHaveBeenCalledWith(SurveyActions.loadSurveys());
  });

  it('should render surveys from store state', () => {
    // Override the selector to return specific data
    store.overrideSelector(selectAllSurveys, [
      { id: '1', title: 'Q4 Review', completed: true }
    ]);
    store.refreshState();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('.survey-item');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Q4 Review');
  });

  it('should show loading indicator while loading', () => {
    store.setState({ surveys: { ids: [], entities: {}, loading: true, error: null } });
    fixture.detectChanges();

    const spinner = fixture.nativeElement.querySelector('.spinner');
    expect(spinner).toBeTruthy();
  });
});
```

---

## 6. DOM Querying in Tests

```typescript
// Native element (simple)
const el = fixture.nativeElement.querySelector('.title');
expect(el.textContent).toContain('Expected Text');

// DebugElement — Angular's abstraction (preferred)
import { By } from '@angular/platform-browser';
const debugEl = fixture.debugElement.query(By.css('.submit-btn'));
debugEl.triggerEventHandler('click', null);
fixture.detectChanges();

// Query by directive
const inputEl = fixture.debugElement.query(By.directive(NgModel));

// All matching elements
const rows = fixture.debugElement.queryAll(By.css('tr.data-row'));
expect(rows.length).toBe(3);
```

---

## 7. Testing OnPush Components

`OnPush` components only update when inputs change or `markForCheck` is called. Tests must account for this.

```typescript
it('should update when input changes', () => {
  // Set input via the component instance
  component.surveyTitle = 'Updated Title';
  fixture.detectChanges();   // manually trigger CD

  expect(fixture.nativeElement.querySelector('h2').textContent)
    .toContain('Updated Title');
});
```

---

## CV Interview Hook

*"At Aumovio and on the Survey Management Platform we maintained automated test coverage as part of Azure DevOps CI/CD. Jasmine spies — specifically `createSpyObj` — were essential for isolating service dependencies so components were never coupled to real HTTP calls in tests. For NgRx-connected components, `MockStore` let us set specific state snapshots and assert the exact actions dispatched. For async flows we used `fakeAsync` with `tick` to test debounced search and timed operations synchronously without real delays."*
