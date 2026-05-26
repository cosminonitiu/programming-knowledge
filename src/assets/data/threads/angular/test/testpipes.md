## Testing Angular Pipes

Pipes are pure transformation functions — they take an input value and return a transformed output. This makes them the **simplest** Angular artifact to test: no DOM, no async, often no `TestBed` needed.

---

## 1. Testing a Pure Pipe Without `TestBed`

```typescript
// title-case.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'titleCase', standalone: true })
export class TitleCasePipe implements PipeTransform {
  transform(value: string): string {
    return value
      .toLowerCase()
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
```

```typescript
// title-case.pipe.spec.ts
import { TitleCasePipe } from './title-case.pipe';

describe('TitleCasePipe', () => {
  const pipe = new TitleCasePipe();

  it('should capitalise each word', () => {
    expect(pipe.transform('hello world')).toBe('Hello World');
  });

  it('should handle a single word', () => {
    expect(pipe.transform('angular')).toBe('Angular');
  });

  it('should handle an empty string', () => {
    expect(pipe.transform('')).toBe('');
  });

  it('should handle already-capitalised input', () => {
    expect(pipe.transform('HELLO WORLD')).toBe('Hello World');
  });
});
```

> Direct instantiation is the preferred approach for pure pipes — it is fast and doesn't involve Angular overhead.

---

## 2. Testing a Pipe That Depends on a Service

When a pipe injects a service, use `TestBed`:

```typescript
// translate.pipe.ts
@Pipe({ name: 'translate', standalone: true })
export class TranslatePipe implements PipeTransform {
  constructor(private i18n: I18nService) {}

  transform(key: string): string {
    return this.i18n.get(key);
  }
}
```

```typescript
describe('TranslatePipe', () => {
  let pipe: TranslatePipe;
  let i18nSpy: jasmine.SpyObj<I18nService>;

  beforeEach(() => {
    i18nSpy = jasmine.createSpyObj('I18nService', ['get']);
    i18nSpy.get.and.callFake((key: string) => `[${key}]`);

    TestBed.configureTestingModule({
      providers: [
        TranslatePipe,
        { provide: I18nService, useValue: i18nSpy },
      ],
    });

    pipe = TestBed.inject(TranslatePipe);
  });

  it('should return translated value', () => {
    expect(pipe.transform('HELLO')).toBe('[HELLO]');
  });
});
```

---

## 3. Testing a Pipe Inside a Component Template

To verify a pipe renders correctly inside a component, include it in the test module:

```typescript
@Component({
  standalone: true,
  imports: [TitleCasePipe],
  template: `<p>{{ name | titleCase }}</p>`,
})
class TestHostComponent {
  name = 'john doe';
}

describe('TitleCasePipe in template', () => {
  it('should display title-cased name', async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('p').textContent).toBe('John Doe');
  });
});
```

---

## 4. Testing Parameterised Pipes

```typescript
// truncate.pipe.ts
@Pipe({ name: 'truncate', standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 20, trail = '…'): string {
    return value.length > limit ? value.slice(0, limit) + trail : value;
  }
}
```

```typescript
describe('TruncatePipe', () => {
  const pipe = new TruncatePipe();

  it('should not truncate short strings', () => {
    expect(pipe.transform('short')).toBe('short');
  });

  it('should truncate with default limit', () => {
    expect(pipe.transform('a'.repeat(25))).toBe('a'.repeat(20) + '…');
  });

  it('should truncate with custom limit and trail', () => {
    expect(pipe.transform('Hello World', 5, '...')).toBe('Hello...');
  });
});
```

---

## 5. Testing Async (Impure) Pipes

An async pipe needs `TestBed` because it interacts with Angular's change detection:

```typescript
// status.pipe.ts
@Pipe({ name: 'status', pure: false, standalone: true })
export class StatusPipe implements PipeTransform {
  transform(obs$: Observable<string>): string {
    // simplified — real implementation would use AsyncPipe internally
    ...
  }
}
```

Use a host component and `fakeAsync` / `waitForAsync` to drive the async value:

```typescript
it('should display emitted value', fakeAsync(() => {
  const subject = new Subject<string>();
  component.value$ = subject.asObservable();
  fixture.detectChanges();

  subject.next('loaded');
  fixture.detectChanges();

  expect(fixture.nativeElement.textContent).toContain('loaded');
}));
```

---

## 6. Edge Cases to Always Cover

| Scenario | Example input |
|----------|--------------|
| Empty / null / undefined | `''`, `null`, `undefined` |
| Boundary values | Exactly at the truncation limit |
| Special characters | `'café & résumé'` |
| Locale-sensitive formatting | Numbers, dates, currencies |
| Large inputs | Very long strings, big arrays |