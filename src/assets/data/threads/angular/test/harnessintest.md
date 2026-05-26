## Using Component Harnesses in Tests

This thread focuses on the **consumer side** — how to load and interact with harnesses inside your test files using `HarnessLoader` and `TestbedHarnessEnvironment`.

---

## 1. Setting Up the Harness Loader

```typescript
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { HarnessLoader } from '@angular/cdk/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';

describe('LoginFormComponent', () => {
  let fixture: ComponentFixture<LoginFormComponent>;
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoginFormComponent, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginFormComponent);
    // Create a loader scoped to the entire fixture's DOM
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });
});
```

---

## 2. `HarnessLoader` Methods

| Method | Description |
|--------|-------------|
| `getHarness(HarnessType)` | Get the first matching harness — throws if not found |
| `getHarnessOrNull(HarnessType)` | Returns `null` if not found |
| `getAllHarnesses(HarnessType)` | Returns an array of all matches |
| `getChildLoader(selector)` | Returns a loader scoped to a child element |

---

## 3. Getting a Single Harness

```typescript
it('should submit form', async () => {
  const form = await loader.getHarness(LoginFormHarness);

  await form.setEmail('user@example.com');
  await form.setPassword('secret');
  await form.clickSubmit();

  expect(component.submitted).toBeTrue();
});
```

---

## 4. Getting Multiple Harnesses

```typescript
it('should render all menu items', async () => {
  const items = await loader.getAllHarnesses(MenuItemHarness);
  expect(items.length).toBe(5);

  for (const item of items) {
    expect(await item.isDisabled()).toBeFalse();
  }
});
```

---

## 5. Filtering with `HarnessPredicate`

```typescript
import { MatButtonHarness } from '@angular/material/button/testing';

it('should click the primary action', async () => {
  const btn = await loader.getHarness(
    MatButtonHarness.with({ text: 'Save', variant: 'flat' })
  );
  await btn.click();

  expect(component.saved).toBeTrue();
});
```

Filters are composed of the options defined by the harness's `with()` factory.

---

## 6. Scoping the Loader to a Subtree

When a component contains repeated sections, scope the loader to avoid ambiguity:

```typescript
it('should disable delete in read-only row', async () => {
  const rows = await loader.getAllHarnesses(TableRowHarness);
  const firstRow = rows[0];

  // Get a loader scoped to the first row's DOM
  const rowLoader = await loader.getChildLoader('.row:first-child');
  const deleteBtn = await rowLoader.getHarness(MatButtonHarness.with({ text: 'Delete' }));

  expect(await deleteBtn.isDisabled()).toBeTrue();
});
```

---

## 7. Using Angular Material Harnesses

Angular Material ships ready-made harnesses for every component in `@angular/material/*/testing`:

```typescript
import { MatInputHarness } from '@angular/material/input/testing';
import { MatSelectHarness } from '@angular/material/select/testing';
import { MatDialogHarness } from '@angular/material/dialog/testing';

it('should open the dialog', async () => {
  const trigger = await loader.getHarness(MatButtonHarness.with({ text: 'Open' }));
  await trigger.click();

  const dialog = await loader.getHarness(MatDialogHarness);
  expect(await dialog.getId()).toBeTruthy();

  await dialog.close();
});
```

---

## 8. Mixing Harnesses with Direct DOM Access

Harnesses and raw DOM queries can coexist. Use harnesses for reusable component interactions and `nativeElement` for one-off assertions:

```typescript
it('should update the status banner', async () => {
  const form = await loader.getHarness(LoginFormHarness);
  await form.submitWithInvalidData();

  // Harness for the form interaction; raw DOM for the banner
  const banner = fixture.nativeElement.querySelector('.status-banner');
  expect(banner.textContent).toContain('Invalid credentials');
});
```

---

## 9. `documentRootLoader` — Overlays and Portals

For components that render outside the fixture's DOM (dialogs, tooltips, snack bars) use the document-level loader:

```typescript
const rootLoader = TestbedHarnessEnvironment.documentRootLoader(fixture);
const snackBar = await rootLoader.getHarness(MatSnackBarHarness);
expect(await snackBar.getMessage()).toBe('Saved!');
```

---

## 10. Auto Change Detection

By default, `TestbedHarnessEnvironment` calls `detectChanges()` automatically after each harness interaction. You can disable this for more control:

```typescript
loader = TestbedHarnessEnvironment.loader(fixture, { manualChangeDetection: true });
```