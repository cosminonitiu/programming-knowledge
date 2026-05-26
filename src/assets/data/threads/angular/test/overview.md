## Overview of Angular Testing

Angular's testing story is built on a layered approach: unit tests for isolated logic, component tests for UI behavior, and integration/E2E tests for full user flows. The Angular CLI sets everything up out of the box.

---

## 1. The Testing Pyramid

```
        /‾‾‾‾‾‾‾‾‾\
       /   E2E (few)  \
      /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
     / Integration (some) \
    /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
   /    Unit Tests (many)   \
  /‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾‾\
```

- **Unit tests** — test a single class, function, or pipe in isolation.
- **Integration tests** — test a component with its template, child components, and services working together.
- **E2E tests** — drive a real browser and assert full user journeys (Playwright or Cypress).

---

## 2. Default Toolchain

| Tool | Role |
|------|------|
| **Jasmine** | Test framework — `describe`, `it`, `expect`, spies |
| **Karma** | Browser-based test runner launched by `ng test` |
| **TestBed** | Angular's own DI and component factory for tests |
| **Angular CDK Harnesses** | Stable, implementation-agnostic component interactions |

> Angular 17+ projects can also be configured to run with **Jest** or **Web Test Runner** as a drop-in replacement for Karma.

---

## 3. File Conventions

- Spec files live **next to** the source file they test: `hero.service.spec.ts`.
- The CLI generates a `.spec.ts` stub automatically for every `ng generate` artifact.
- `ng test` picks up any file matching `**/*.spec.ts`.

---

## 4. Running Tests

```bash
# Run once and watch for changes
ng test

# Single run, no watch (CI)
ng test --watch=false

# With coverage report
ng test --code-coverage

# Run a specific project
ng test my-lib
```

---

## 5. The `TestBed`

`TestBed` is the heart of Angular component and service testing. It creates a mini Angular module for each test file:

```typescript
import { TestBed } from '@angular/core/testing';
import { HeroService } from './hero.service';

describe('HeroService', () => {
  let service: HeroService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
```

---

## 6. Key Testing APIs at a Glance

| API | Purpose |
|-----|---------|
| `TestBed.configureTestingModule()` | Declare components/providers for the test module |
| `TestBed.createComponent()` | Instantiate a component and get a `ComponentFixture` |
| `TestBed.inject()` | Retrieve a service from the test injector |
| `fixture.detectChanges()` | Trigger change detection manually |
| `fixture.debugElement` | DOM/element access with Angular metadata |
| `fakeAsync` / `tick()` | Control the async clock in tests |
| `waitForAsync` | Wrap async setup with real Promises |

---

## 7. What to Test

- **Components:** rendered output, user interaction, input/output bindings.
- **Services:** business logic, HTTP calls (with `HttpClientTestingModule`), state.
- **Pipes:** pure transformation logic.
- **Directives:** DOM mutations caused by attribute or structural directives.
- **Guards & Resolvers:** return values and navigation side-effects.

---

## 8. What to Avoid

- Don't test implementation details (private methods, exact DOM class names).
- Don't skip `fixture.detectChanges()` after state changes.
- Don't share mutable state between `it` blocks — use `beforeEach` to reset.
- Don't rely on test execution order — each spec must be independent.