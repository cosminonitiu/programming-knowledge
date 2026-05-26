## Harness Environment Support

The Angular CDK harness system is **environment-agnostic** — the same harness class works in unit tests (Karma/Jest), Playwright E2E tests, and potentially any other runner. This is achieved through the `HarnessEnvironment` abstraction layer.

---

## 1. Architecture Overview

```
┌─────────────────────────────────────────┐
│            Your Test Code               │
│   loader.getHarness(MyHarness)          │
└──────────────┬──────────────────────────┘
               │ HarnessLoader (abstract)
┌──────────────▼──────────────────────────┐
│         HarnessEnvironment              │  ← abstract bridge
│  (defines how to query & interact)      │
└──────┬───────────────────┬──────────────┘
       │                   │
┌──────▼──────┐   ┌────────▼────────┐
│  Testbed    │   │   Playwright /  │
│ Environment │   │   Selenium Env  │
│ (unit tests)│   │  (E2E tests)    │
└─────────────┘   └─────────────────┘
```

---

## 2. `TestbedHarnessEnvironment` — Unit Tests

Used with Karma or Jest + `@angular/core/testing`:

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';

// Loader scoped to the fixture's host element
const loader = TestbedHarnessEnvironment.loader(fixture);

// Loader for overlays/portals rendered outside the fixture (dialogs, snackbars)
const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);

// Create a harness directly without a loader
const harness = await TestbedHarnessEnvironment.harnessForFixture(fixture, MyHarness);
```

---

## 3. `PlaywrightHarnessEnvironment` — E2E Tests

Install the optional package:

```bash
npm install @jscutlery/playwright-ct-angular --save-dev
# or the official CDK playwright adapter if available for your version
```

```typescript
import { PlaywrightHarnessEnvironment } from '@jscutlery/playwright-ct-angular';

test('should submit the form', async ({ page }) => {
  const env = new PlaywrightHarnessEnvironment(page);
  const loader = env.loader();
  const form = await loader.getHarness(LoginFormHarness);

  await form.setEmail('user@example.com');
  await form.clickSubmit();

  await expect(page).toHaveURL('/dashboard');
});
```

The same `LoginFormHarness` class works in both unit and E2E tests.

---

## 4. Writing an Environment-Agnostic Harness

A harness is automatically environment-agnostic as long as it only uses the CDK harness API:

**Allowed:**
- `this.locatorFor()`, `this.locatorForAll()`, `this.host()`
- `TestElement` methods: `.click()`, `.text()`, `.getAttribute()`, `.hasClass()`

**Avoid:**
- Direct `document.querySelector()` calls
- Angular-specific APIs (`DebugElement`, `ComponentRef`)
- Direct DOM manipulation (`element.style.display = 'none'`)

---

## 5. `TestElement` API Reference

`TestElement` is the environment-neutral handle on a DOM node:

| Method | Description |
|--------|-------------|
| `click(relativeX?, relativeY?)` | Simulate a click |
| `sendKeys(...keys)` | Type keys into an input |
| `text()` | Get trimmed text content |
| `getAttribute(name)` | Get an HTML attribute value |
| `getProperty<T>(name)` | Get a DOM property value |
| `hasClass(name)` | Check for a CSS class |
| `getDimensions()` | Get `{ width, height, top, left }` |
| `isFocused()` | Check if element has focus |
| `matchesSelector(selector)` | Check if element matches a CSS selector |
| `dispatchEvent(name, data?)` | Fire a synthetic event |

---

## 6. Supporting Both Environments in One Harness

```typescript
export class ChipHarness extends ComponentHarness {
  static hostSelector = 'mat-chip, app-chip';

  async remove(): Promise<void> {
    const removeBtn = await this.locatorForOptional('[matChipRemove]')();
    if (removeBtn) {
      await removeBtn.click();
    } else {
      // Fallback: send Delete key to the chip itself
      await (await this.host()).sendKeys(TestKey.DELETE);
    }
  }
}
```

---

## 7. Parallel Test Execution

Because harness methods are all `async`/`await` and environment-isolated, harness-based tests are naturally compatible with parallel test runners. Avoid shared state between test instances to keep them safe to run concurrently.

---

## 8. Angular Material's Built-In Harnesses

Every Angular Material component ships a harness in `@angular/material/<component>/testing`:

| Component | Harness |
|-----------|---------|
| Button | `MatButtonHarness` |
| Input | `MatInputHarness` |
| Select | `MatSelectHarness` |
| Dialog | `MatDialogHarness` |
| Table | `MatTableHarness` |
| Checkbox | `MatCheckboxHarness` |
| Radio | `MatRadioGroupHarness` |
| Slide Toggle | `MatSlideToggleHarness` |
| Datepicker | `MatDatepickerInputHarness` |

Import them from their respective testing entry points — no additional install required.