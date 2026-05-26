## Component Test Harnesses

A **component test harness** is a class that wraps a component's DOM interactions behind a stable, semantic API. Instead of querying raw CSS selectors in every test, you interact through named methods like `clickSave()` or `getTitle()`.

Angular CDK provides the infrastructure; Angular Material ships ready-made harnesses for all its components.

---

## 1. Why Use Harnesses?

| Direct DOM querying | Harness approach |
|---------------------|-----------------|
| Brittle — breaks on class/structure changes | Stable — harness author owns the API |
| Duplicated selectors across tests | Single definition, reused everywhere |
| Hard to read intent | Readable, semantic method names |
| Couples tests to implementation | Decouples tests from internal structure |

---

## 2. `ComponentHarness` Base Class

Every harness extends `ComponentHarness` from `@angular/cdk/testing`:

```typescript
import { ComponentHarness } from '@angular/cdk/testing';

export class ButtonHarness extends ComponentHarness {
  // Selector that uniquely identifies this component's root element
  static hostSelector = 'app-button';

  // Locate child elements
  private getButton = this.locatorFor('button');

  async click(): Promise<void> {
    return (await this.getButton()).click();
  }

  async getText(): Promise<string> {
    return (await this.getButton()).text();
  }

  async isDisabled(): Promise<boolean> {
    return (await this.getButton()).getProperty<boolean>('disabled');
  }
}
```

---

## 3. `HarnessPredicate` — Filtering Harness Instances

When a page contains many instances of the same component, `HarnessPredicate` lets you filter by property:

```typescript
import { HarnessPredicate } from '@angular/cdk/testing';

export interface ButtonHarnessFilters {
  text?: string | RegExp;
}

export class ButtonHarness extends ComponentHarness {
  static hostSelector = 'app-button';

  static with(options: ButtonHarnessFilters = {}): HarnessPredicate<ButtonHarness> {
    return new HarnessPredicate(ButtonHarness, options).addOption(
      'text',
      options.text,
      (harness, text) => HarnessPredicate.stringMatches(harness.getText(), text)
    );
  }

  async getText(): Promise<string> {
    return this.host().then(h => h.text());
  }
}
```

Usage in a test:

```typescript
const saveBtn = await loader.getHarness(ButtonHarness.with({ text: 'Save' }));
await saveBtn.click();
```

---

## 4. Locator Methods

| Method | Returns | Description |
|--------|---------|-------------|
| `locatorFor(selector)` | `() => Promise<TestElement>` | Always finds exactly one element (throws if missing) |
| `locatorForOptional(selector)` | `() => Promise<TestElement \| null>` | Returns `null` if not found |
| `locatorForAll(selector)` | `() => Promise<TestElement[]>` | Returns all matching elements |
| `harnessLoaderFor(selector)` | `() => Promise<HarnessLoader>` | Loader scoped to a child subtree |

---

## 5. Composing Nested Harnesses

Harnesses can contain other harnesses, mirroring the component tree:

```typescript
export class DialogHarness extends ComponentHarness {
  static hostSelector = 'app-dialog';

  private getConfirmButton = this.locatorFor(ButtonHarness.with({ text: 'Confirm' }));

  async confirm(): Promise<void> {
    return (await this.getConfirmButton()).click();
  }
}
```

---

## 6. Async Considerations

All harness methods return **Promises**, even for synchronous DOM reads. Always `await` them:

```typescript
it('should show disabled state', async () => {
  component.disabled = true;
  fixture.detectChanges();

  const harness = await loader.getHarness(ButtonHarness);
  expect(await harness.isDisabled()).toBeTrue();
});
```

---

## 7. Best Practices

- Keep harness APIs **semantic** — `clickSave()`, not `clickButtonWithClass('btn-primary')`.
- Ship harnesses as part of the component library so consumers don't need to know internals.
- Prefer harnesses over direct DOM access in integration tests for shared/library components.
- Use `HarnessPredicate.with()` to make test intent clear at the call site.