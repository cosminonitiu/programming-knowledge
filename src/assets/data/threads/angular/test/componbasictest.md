## Basic Component Testing

Component tests verify that a component renders correctly, reacts to inputs, and emits the right outputs. They use `TestBed` and `ComponentFixture` to host the component in a lightweight Angular environment.

---

## 1. Minimal Setup

```typescript
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BannerComponent } from './banner.component';

describe('BannerComponent', () => {
  let component: BannerComponent;
  let fixture: ComponentFixture<BannerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BannerComponent], // standalone component
    }).compileComponents();

    fixture = TestBed.createComponent(BannerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // triggers ngOnInit + initial binding
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
```

> For **NgModule-based** components, use `declarations: [BannerComponent]` instead of `imports`.

---

## 2. The `ComponentFixture`

`ComponentFixture<T>` wraps the component instance and its host element:

| Property / Method | Purpose |
|-------------------|---------|
| `fixture.componentInstance` | The component class instance |
| `fixture.nativeElement` | The raw DOM element (`HTMLElement`) |
| `fixture.debugElement` | Angular's wrapper around the DOM node |
| `fixture.detectChanges()` | Manually run change detection |
| `fixture.whenStable()` | Promise that resolves when all async tasks finish |

---

## 3. Querying the DOM

```typescript
const compiled = fixture.nativeElement as HTMLElement;

// By CSS selector
const h1 = compiled.querySelector('h1')!;
expect(h1.textContent).toContain('Hello');

// By debugElement
import { By } from '@angular/platform-browser';
const btn = fixture.debugElement.query(By.css('button'));
expect(btn).toBeTruthy();
```

---

## 4. Testing `@Input` Bindings

```typescript
it('should display the provided title', () => {
  component.title = 'My Title';
  fixture.detectChanges();

  const h2 = fixture.nativeElement.querySelector('h2');
  expect(h2.textContent).toBe('My Title');
});
```

Always call `fixture.detectChanges()` after changing an input — Angular does not do this automatically in tests.

---

## 5. Testing `@Output` Events

```typescript
it('should emit save event on button click', () => {
  let emitted = false;
  component.save.subscribe(() => (emitted = true));

  const btn = fixture.nativeElement.querySelector('button.save');
  btn.click();
  fixture.detectChanges();

  expect(emitted).toBeTrue();
});
```

---

## 6. Triggering DOM Events

```typescript
import { By } from '@angular/platform-browser';

it('should toggle on checkbox change', () => {
  const checkbox = fixture.debugElement.query(By.css('input[type=checkbox]'));
  checkbox.triggerEventHandler('change', { target: { checked: true } });
  fixture.detectChanges();

  expect(component.isChecked).toBeTrue();
});
```

---

## 7. Testing with `fakeAsync`

Use `fakeAsync` + `tick()` for components that use `setTimeout`, `setInterval`, or `debounceTime`:

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should show message after delay', fakeAsync(() => {
  component.triggerDelay();
  tick(300); // advance virtual clock by 300 ms
  fixture.detectChanges();

  const msg = fixture.nativeElement.querySelector('.message');
  expect(msg.textContent).toBe('Done');
}));
```

---

## 8. Common Pitfalls

- **Forgetting `detectChanges()`** — component won't re-render after state changes.
- **Not declaring dependencies** — add child components, directives, and pipes to `imports`/`declarations`.
- **Shared mutable state** — always reset component state in `beforeEach`.
- **Testing private methods** — test the public API and observable output instead.