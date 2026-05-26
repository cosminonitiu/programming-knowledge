## Testing Signals and Signal-Based Components

Angular signals require specific testing patterns — unlike Observables, signals are synchronous and don't need `async` / `fakeAsync` for basic reads.

---

## 1. Testing a Signal-Based Service Directly

```typescript
// theme.service.ts
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private _theme = signal<'light' | 'dark'>('light');
  theme = this._theme.asReadonly();
  toggle() { this._theme.update(t => t === 'light' ? 'dark' : 'light'); }
}
```

```typescript
describe('ThemeService', () => {
  let service: ThemeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeService);
  });

  it('should default to light theme', () => {
    // Read signal value directly — no subscribe needed
    expect(service.theme()).toBe('light');
  });

  it('should toggle to dark', () => {
    service.toggle();
    expect(service.theme()).toBe('dark');
  });
});
```

Signal reads are **synchronous** — call the signal as a function to get the current value.

---

## 2. Testing Signal Store

```typescript
// Using the SurveyStore from @ngrx/signals
describe('SurveyStore', () => {
  let store: InstanceType<typeof SurveyStore>;
  let mockService: jasmine.SpyObj<SurveyService>;

  beforeEach(() => {
    mockService = jasmine.createSpyObj('SurveyService', ['getAll', 'delete']);
    mockService.getAll.and.returnValue(of([{ id: '1', title: 'Q4 Review' }]));

    TestBed.configureTestingModule({
      providers: [
        SurveyStore,
        { provide: SurveyService, useValue: mockService }
      ]
    });

    store = TestBed.inject(SurveyStore);
  });

  it('should load surveys', () => {
    TestBed.flushEffects();  // flush rxMethod and withHooks.onInit

    expect(store.entities().length).toBe(1);
    expect(store.entities()[0].title).toBe('Q4 Review');
  });

  it('should filter surveys', () => {
    TestBed.flushEffects();
    store.setFilter('Q4');

    expect(store.filteredSurveys().length).toBe(1);
    expect(store.filteredSurveys()[0].id).toBe('1');
  });
});
```

**`TestBed.flushEffects()`** — runs any pending Angular effects synchronously. Required when testing stores that use `withHooks.onInit` or `rxMethod`.

---

## 3. Testing Components with Signal Inputs

```typescript
// survey-card.component.ts
@Component({ standalone: true, /* ... */ })
export class SurveyCardComponent {
  survey = input.required<Survey>();    // signal input
  isSelected = input(false);           // signal input with default
}
```

```typescript
describe('SurveyCardComponent', () => {
  it('should display survey title from signal input', () => {
    const fixture = TestBed.createComponent(SurveyCardComponent);

    // Set signal inputs via fixture.componentRef
    fixture.componentRef.setInput('survey', { id: '1', title: 'Q4 Review' });
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('h3').textContent).toContain('Q4 Review');
  });
});
```

Use `fixture.componentRef.setInput('inputName', value)` instead of setting component properties directly — this properly triggers signal input updates.

---

## 4. Testing `computed` Signals

```typescript
// In a component
@Component({ standalone: true, template: '' })
export class SurveyStatsComponent {
  surveys = input<Survey[]>([]);
  completedCount = computed(() => this.surveys().filter(s => s.completed).length);
  completionRate = computed(() => {
    const total = this.surveys().length;
    return total ? (this.completedCount() / total) * 100 : 0;
  });
}
```

```typescript
it('should compute completion rate', () => {
  fixture.componentRef.setInput('surveys', [
    { id: '1', completed: true },
    { id: '2', completed: false },
    { id: '3', completed: true },
  ]);
  fixture.detectChanges();

  // computed signals update synchronously when their dependencies change
  expect(component.completedCount()).toBe(2);
  expect(component.completionRate()).toBeCloseTo(66.67, 1);
});
```

---

## 5. Testing `effect()` — Using `TestBed.flushEffects()`

```typescript
@Component({ standalone: true, template: '' })
export class LoggingComponent {
  private logger = inject(LoggingService);
  count = signal(0);

  constructor() {
    effect(() => {
      this.logger.log(`Count changed: ${this.count()}`);
    });
  }
}
```

```typescript
it('should call logger when count changes', () => {
  const mockLogger = jasmine.createSpyObj('LoggingService', ['log']);
  TestBed.overrideProvider(LoggingService, { useValue: mockLogger });

  const fixture = TestBed.createComponent(LoggingComponent);
  fixture.detectChanges();
  TestBed.flushEffects();  // flush initial effect run

  fixture.componentInstance.count.set(5);
  TestBed.flushEffects();  // flush effect triggered by signal change

  expect(mockLogger.log).toHaveBeenCalledWith('Count changed: 5');
});
```

---

## 6. `toSignal` — Testing Observable-to-Signal Conversions

```typescript
// service that converts Observable to signal
@Injectable({ providedIn: 'root' })
export class SurveyStateService {
  private service = inject(SurveyService);
  surveys = toSignal(this.service.getAll(), { initialValue: [] });
}
```

```typescript
it('should populate surveys signal from observable', () => {
  const mockSurveys = [{ id: '1', title: 'Test' }];
  mockService.getAll.and.returnValue(of(mockSurveys));

  TestBed.configureTestingModule({
    providers: [
      SurveyStateService,
      { provide: SurveyService, useValue: mockService }
    ]
  });

  const stateService = TestBed.inject(SurveyStateService);
  TestBed.flushEffects();

  // toSignal resolves synchronously for of() — reads immediately
  expect(stateService.surveys().length).toBe(1);
});
```

---

## Architect Interview Notes

- **Signals are synchronous** — no `fakeAsync`, no `done`, no `whenStable` for basic signal reads.
- **`TestBed.flushEffects()`** is the key testing utility for signals — use it any time you write an `effect()` or use `withHooks`.
- **`fixture.componentRef.setInput()`** is the correct way to set signal inputs in tests — direct property assignment bypasses the signal mechanism.
- `computed()` values update synchronously when their dependencies change inside a test — assert them immediately after changing inputs.
