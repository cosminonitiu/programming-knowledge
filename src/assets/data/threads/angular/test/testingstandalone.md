## Testing Standalone Components

Standalone components declare their own dependencies — testing them requires a slightly different `TestBed` setup compared to NgModule-based components.

---

## 1. Basic Standalone Component Test

```typescript
import { TestBed, ComponentFixture } from '@angular/core/testing';
import { SurveyCardComponent } from './survey-card.component';

describe('SurveyCardComponent', () => {
  let component: SurveyCardComponent;
  let fixture: ComponentFixture<SurveyCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyCardComponent],   // ← import, not declarations
    }).compileComponents();

    fixture = TestBed.createComponent(SurveyCardComponent);
    component = fixture.componentInstance;
  });

  it('should render the survey title', () => {
    component.survey = { id: '1', title: 'Q4 Review', status: 'active' };
    fixture.detectChanges();

    const title = fixture.nativeElement.querySelector('h3');
    expect(title.textContent).toContain('Q4 Review');
  });
});
```

**Key difference:** `imports: [SurveyCardComponent]` instead of `declarations: [SurveyCardComponent]`.

---

## 2. Overriding Child Component Imports

A standalone component imports its own child components. In tests you often want to replace real children with stubs.

```typescript
@Component({ standalone: true, selector: 'app-survey-status-badge', template: '' })
class StubSurveyStatusBadgeComponent {}

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [SurveyCardComponent],
  })
  .overrideComponent(SurveyCardComponent, {
    remove: { imports: [SurveyStatusBadgeComponent] },
    add:    { imports: [StubSurveyStatusBadgeComponent] },
  })
  .compileComponents();
});
```

This replaces the real `SurveyStatusBadgeComponent` with a stub **without** changing the source component — the test controls what renders.

---

## 3. Testing with Service Dependencies (No NgModule)

```typescript
@Component({
  standalone: true,
  imports: [AsyncPipe],
  template: `@for (s of surveys$ | async; track s.id) { <li>{{ s.title }}</li> }`,
})
export class SurveyListComponent {
  surveys$ = inject(SurveyService).getAll();
}
```

```typescript
describe('SurveyListComponent', () => {
  let mockService: jasmine.SpyObj<SurveyService>;

  beforeEach(async () => {
    mockService = jasmine.createSpyObj('SurveyService', ['getAll']);
    mockService.getAll.and.returnValue(of([{ id: '1', title: 'Test Survey' }]));

    await TestBed.configureTestingModule({
      imports: [SurveyListComponent],
      providers: [
        { provide: SurveyService, useValue: mockService }
      ]
    }).compileComponents();
  });

  it('should render surveys', async () => {
    const fixture = TestBed.createComponent(SurveyListComponent);
    fixture.detectChanges();
    await fixture.whenStable();
    fixture.detectChanges();

    const items = fixture.nativeElement.querySelectorAll('li');
    expect(items.length).toBe(1);
    expect(items[0].textContent).toContain('Test Survey');
  });
});
```

---

## 4. Testing with Route Providers

Standalone components can use route-scoped services. Test them by providing directly:

```typescript
// Component uses inject(SurveyStore) where SurveyStore is provided at the route level
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [SurveyPageComponent],
    providers: [SurveyStore],    // provide the route-scoped service directly
  }).compileComponents();
});
```

---

## 5. Testing Components Using `inject()` (No Constructor Parameters)

Components using `inject()` field initializers are tested identically — `TestBed` resolves them via providers:

```typescript
@Component({ standalone: true, template: '' })
export class SurveyFormComponent {
  private facade = inject(SurveyFacade);     // inject() fields
  private router  = inject(Router);
}
```

```typescript
beforeEach(async () => {
  mockFacade = jasmine.createSpyObj('SurveyFacade', ['save'], { loading$: of(false) });

  await TestBed.configureTestingModule({
    imports: [SurveyFormComponent],
    providers: [
      { provide: SurveyFacade, useValue: mockFacade },
      RouterTestingModule,
    ]
  }).compileComponents();
});
```

---

## 6. Using `TestbedHarnessEnvironment` with Standalone

Component harnesses work unchanged with standalone:

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatInputHarness } from '@angular/material/input/testing';

it('should type into search input', async () => {
  const loader = TestbedHarnessEnvironment.loader(fixture);
  const input = await loader.getHarness(MatInputHarness);
  await input.setValue('Angular');

  expect(component.searchTerm).toBe('Angular');
});
```

---

## Architect Interview Notes

- The **only difference** from NgModule tests is `imports` vs `declarations` — the rest of `TestBed` API is identical.
- `overrideComponent` with `remove`/`add` for imports is the standalone equivalent of shallow rendering — keep this pattern in your back pocket.
- **Never import the real child components** in tests unless you're writing integration tests — always stub or `NO_ERRORS_SCHEMA` for unit tests.
- `NO_ERRORS_SCHEMA` is quick but hides typos in template element names — prefer explicit stub components for important children.
