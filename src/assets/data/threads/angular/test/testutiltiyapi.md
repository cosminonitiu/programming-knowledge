## Angular Testing Utility API

`@angular/core/testing` exports a set of functions and classes that form the backbone of every Angular spec. This thread is a comprehensive reference for all of them.

---

## 1. `TestBed`

The central utility — creates an Angular testing module that simulates a real `NgModule`.

### Configuration

```typescript
TestBed.configureTestingModule({
  imports: [...],       // standalone components, modules, pipes
  declarations: [...],  // legacy NgModule-based components
  providers: [...],     // services and DI overrides
});
```

### Key Methods

| Method | Description |
|--------|-------------|
| `configureTestingModule(config)` | Set up the testing module |
| `compileComponents()` | Async — compiles external templates/styles |
| `createComponent<T>(type)` | Returns a `ComponentFixture<T>` |
| `inject<T>(token)` | Retrieve a service from the test injector |
| `overrideComponent(type, override)` | Override component metadata mid-test |
| `overrideProvider(token, override)` | Override a specific provider |
| `resetTestingModule()` | Called automatically between tests by the test runner |

### Full Setup Example

```typescript
beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [HeroDetailComponent, HttpClientTestingModule],
    providers: [
      { provide: ActivatedRoute, useValue: fakeActivatedRoute },
    ],
  }).compileComponents();
});
```

---

## 2. `ComponentFixture<T>`

Wraps a component instance and its host DOM element.

| Property / Method | Type | Description |
|-------------------|------|-------------|
| `componentInstance` | `T` | The component class instance |
| `nativeElement` | `HTMLElement` | The component's root DOM element |
| `debugElement` | `DebugElement` | Angular's wrapper around the DOM |
| `changeDetectorRef` | `ChangeDetectorRef` | Manually trigger change detection |
| `detectChanges()` | `void` | Run one round of change detection |
| `autoDetectChanges(on?)` | `void` | Enable/disable automatic change detection |
| `whenStable()` | `Promise<void>` | Resolves when all async tasks complete |
| `destroy()` | `void` | Destroy the component |
| `isStable()` | `boolean` | Check if all async tasks are complete |

---

## 3. `DebugElement`

Provides Angular-aware DOM access and component metadata.

```typescript
import { By } from '@angular/platform-browser';

const de = fixture.debugElement;

de.query(By.css('h1'))            // first matching element
de.queryAll(By.css('li'))         // all matching elements
de.query(By.directive(MyDir))     // element with directive applied
de.triggerEventHandler('click', null)  // fire an Angular event handler

de.nativeElement   // underlying HTMLElement
de.children        // child DebugElements
de.parent          // parent DebugElement
de.attributes      // raw HTML attributes
de.properties      // bound property values
de.classes         // CSS class map
de.styles          // inline style map
de.injector        // the element's injector (access directives/components)
```

---

## 4. `By` — Query Predicates

```typescript
import { By } from '@angular/platform-browser';

By.css('.my-class')           // CSS selector
By.directive(MyDirective)     // has a specific directive
By.all()                      // all elements (rarely needed)
```

---

## 5. `fakeAsync` and `tick`

Simulate the passage of time synchronously inside a test.

```typescript
import { fakeAsync, tick, flush, discardPeriodicTasks } from '@angular/core/testing';

it('should process after delay', fakeAsync(() => {
  component.startTimer();

  tick(1000);           // advance clock by 1 second
  flush();              // run all remaining macrotasks
  discardPeriodicTasks(); // discard pending setIntervals

  expect(component.done).toBeTrue();
}));
```

| Function | Description |
|----------|-------------|
| `fakeAsync(fn)` | Wraps test in a fake async zone |
| `tick(millis?)` | Advance the virtual clock |
| `flush()` | Drain all pending macrotask queue |
| `flushMicrotasks()` | Drain the microtask queue |
| `discardPeriodicTasks()` | Discard pending `setInterval` tasks |

---

## 6. `waitForAsync`

Use when async operations are Promise-based or use real `async/await`:

```typescript
import { waitForAsync } from '@angular/core/testing';

it('should load data', waitForAsync(() => {
  service.loadData().then(data => {
    expect(data).toBeTruthy();
  });
}));
```

> `async` / `await` in specs works without `waitForAsync` in modern setups, but it's required when using `fixture.whenStable()`.

---

## 7. `inject` (Function Helper)

Shorthand for `TestBed.inject` inside `beforeEach` or `it` callbacks:

```typescript
import { inject } from '@angular/core/testing';

it('should have the service', inject([HeroService], (service: HeroService) => {
  expect(service).toBeTruthy();
}));
```

> Prefer `TestBed.inject()` in modern code — it has better TypeScript inference.

---

## 8. Spy Utilities (Jasmine)

```typescript
// Create a spy object with stub methods
const spy = jasmine.createSpyObj<HeroService>('HeroService', ['getHeroes', 'addHero']);

// Configure return values
spy.getHeroes.and.returnValue(of([{ id: 1, name: 'Windstorm' }]));
spy.addHero.and.returnValue(of({ id: 2, name: 'Magneta' }));

// Assert calls
expect(spy.getHeroes).toHaveBeenCalled();
expect(spy.addHero).toHaveBeenCalledWith({ name: 'Magneta' });

// Spy on an existing method
const logSpy = spyOn(console, 'log');
```

---

## 9. `HttpTestingController` Reference

```typescript
import { HttpTestingController } from '@angular/common/http/testing';

const http = TestBed.inject(HttpTestingController);

// Expect exactly one call
const req = http.expectOne('/api/heroes');

// Expect one call matching criteria
const req2 = http.expectOne(r => r.method === 'POST' && r.url === '/api/heroes');

// Deliver a response
req.flush([{ id: 1, name: 'Windstorm' }]);

// Simulate an error
req.flush('Not found', { status: 404, statusText: 'Not Found' });

// Verify no outstanding requests
http.verify();
```

---

## 10. `NO_ERRORS_SCHEMA` and `CUSTOM_ELEMENTS_SCHEMA`

Suppress template errors caused by unknown child components:

```typescript
import { NO_ERRORS_SCHEMA } from '@angular/core';

TestBed.configureTestingModule({
  declarations: [ParentComponent],
  schemas: [NO_ERRORS_SCHEMA], // ignore unknown child elements
});
```

> Use sparingly — it suppresses real template errors too. Prefer stubbing child components explicitly.