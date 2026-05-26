## Debugging Angular Tests

When a test fails unexpectedly, knowing where to look is half the battle. This thread covers the most effective debugging techniques for Angular unit and component tests.

---

## 1. Running Tests in a Browser (Karma)

```bash
ng test
```

Karma opens a real browser window. You can:

- Open **DevTools** (`F12`) and set breakpoints in the Sources panel.
- Use `debugger;` statements in your spec or source files — Karma will pause on them.
- Click the **DEBUG** button in the Karma browser window to open a separate debug page with source maps.

---

## 2. `fdescribe` and `fit` — Focused Tests

Run only the tests you care about without changing config:

```typescript
// Run only this suite
fdescribe('HeroService', () => { ... });

// Run only this spec
fit('should return heroes', () => { ... });
```

> `fdescribe`/`fit` mark everything else as **pending** (`x`). Remember to change them back before committing — most CI pipelines fail on focused specs via `--forbid-focused`.

---

## 3. `xdescribe` and `xit` — Skip Tests

```typescript
xdescribe('Flaky suite', () => { ... });
xit('not ready yet', () => { ... });
```

Skipped specs show as **pending** in the report without failing the build.

---

## 4. Inspecting the Rendered DOM

Print the component's current HTML to the console:

```typescript
it('should render correctly', () => {
  fixture.detectChanges();
  // Dump the current HTML
  console.log(fixture.nativeElement.innerHTML);
});
```

For a structured view use Angular's `DebugElement`:

```typescript
import { By } from '@angular/platform-browser';

const de = fixture.debugElement.query(By.css('.my-class'));
console.log(de.nativeElement.outerHTML);
console.log(de.properties); // bound Angular properties
console.log(de.attributes); // raw HTML attributes
```

---

## 5. Checking Change Detection State

If a binding is not updating, check whether `detectChanges()` was called:

```typescript
component.title = 'New Title';
// Without detectChanges() the DOM still shows the old value
fixture.detectChanges(); // now the DOM updates
```

For `OnPush` components, you may need `fixture.changeDetectorRef.markForCheck()` before `detectChanges()`.

---

## 6. Debugging Async Issues

### `fakeAsync` + `tick`
```typescript
it('should complete after timeout', fakeAsync(() => {
  component.start();
  tick(1000); // advance clock by 1 s
  fixture.detectChanges();
  expect(component.done).toBeTrue();
}));
```

### `waitForAsync`
```typescript
it('should resolve promise', waitForAsync(() => {
  component.loadData().then(() => {
    fixture.detectChanges();
    expect(component.data).toBeTruthy();
  });
}));
```

### Pending async tasks error  
If you see *"1 timer(s) still in the queue"*, a `setTimeout`/`setInterval` wasn't flushed. Use `discardPeriodicTasks()` or `flush()` at the end of the test:

```typescript
import { fakeAsync, flush, discardPeriodicTasks } from '@angular/core/testing';

afterEach(() => {
  discardPeriodicTasks();
});
```

---

## 7. Diagnosing `No provider for X` Errors

```
NullInjectorError: No provider for HeroService!
```

Fix: add the service (or a mock) to `providers` in `configureTestingModule`:

```typescript
TestBed.configureTestingModule({
  imports: [HeroListComponent],
  providers: [{ provide: HeroService, useValue: heroServiceSpy }],
});
```

---

## 8. Source Maps in Karma

Ensure `sourceMap` is enabled in `angular.json` test config:

```json
"test": {
  "options": {
    "sourceMap": true
  }
}
```

With source maps active, stack traces in the browser console point to TypeScript source lines instead of compiled JS.

---

## 9. Using `--include` to Narrow Test Runs

```bash
# Only run specs in a specific folder
ng test --include='src/app/heroes/**/*.spec.ts'
```

---

## 10. Common Error Messages

| Error | Likely cause |
|-------|-------------|
| `Can't bind to 'ngModel'` | `FormsModule` not imported |
| `Template parse error: 'app-hero' is not a known element` | Child component not declared/imported |
| `TypeError: Cannot read properties of undefined` | `fixture.detectChanges()` not called or component data not initialized |
| `Error: expect(...).toBeTrue is not a function` | Jasmine version mismatch — use `toBe(true)` |
| `UnhandledPromiseRejection` | Missing `await` or `done()` callback in async test |