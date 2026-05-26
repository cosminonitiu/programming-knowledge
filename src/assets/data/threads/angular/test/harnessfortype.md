## Creating a Harness for a Component Type

This thread walks through writing a **complete component test harness** from scratch, following the Angular CDK `ComponentHarness` contract. It complements the conceptual overview in `componentharness.md`.

---

## 1. When to Write a Harness

Write a harness when:
- A component is used in **many test files** — one harness replaces repeated selectors.
- The component is part of a **shared UI library** and consumers shouldn't know its internals.
- The component has **complex interactions** (multi-step flows, async state) that are noisy to test directly.

---

## 2. Anatomy of a Harness File

```
src/
  app/
    ui/
      rating/
        rating.component.ts
        rating.component.html
        rating.harness.ts      ← the harness
        rating.component.spec.ts
```

---

## 3. Full Example — `RatingHarness`

**Component under test (`rating.component.html`):**
```html
<div class="rating" role="group" [attr.aria-label]="label">
  <button
    *ngFor="let star of stars; let i = index"
    class="star"
    [class.filled]="i < value"
    (click)="setValue(i + 1)">
    ★
  </button>
  <span class="value">{{ value }}</span>
</div>
```

**Harness (`rating.harness.ts`):**
```typescript
import { ComponentHarness, HarnessPredicate } from '@angular/cdk/testing';

export interface RatingHarnessFilters {
  label?: string | RegExp;
}

export class RatingHarness extends ComponentHarness {
  /** CSS selector that identifies the root element of this component. */
  static hostSelector = 'app-rating';

  // ---- Locators --------------------------------------------------------
  private getStars = this.locatorForAll('.star');
  private getValueSpan = this.locatorFor('.star');  // span.value

  // ---- Filter factory --------------------------------------------------
  static with(options: RatingHarnessFilters = {}): HarnessPredicate<RatingHarness> {
    return new HarnessPredicate(RatingHarness, options).addOption(
      'label',
      options.label,
      async (harness, label) =>
        HarnessPredicate.stringMatches(
          (await harness.host()).getAttribute('aria-label'),
          label,
        ),
    );
  }

  // ---- Public API ------------------------------------------------------

  /** Returns the number of rendered star buttons. */
  async getStarCount(): Promise<number> {
    return (await this.getStars()).length;
  }

  /** Clicks the star at the given 1-based index. */
  async clickStar(index: number): Promise<void> {
    const stars = await this.getStars();
    if (index < 1 || index > stars.length) {
      throw Error(`Star index ${index} out of range (1–${stars.length})`);
    }
    await stars[index - 1].click();
  }

  /** Returns the number of filled stars. */
  async getValue(): Promise<number> {
    const stars = await this.getStars();
    let count = 0;
    for (const star of stars) {
      if (await star.hasClass('filled')) count++;
    }
    return count;
  }

  /** Returns true if the star at 1-based index is filled. */
  async isStarFilled(index: number): Promise<boolean> {
    const stars = await this.getStars();
    return stars[index - 1].hasClass('filled');
  }
}
```

---

## 4. Using `locatorFor` vs `locatorForAll`

| Method | Use case |
|--------|---------|
| `locatorFor(selector)` | Exactly one element expected — throws if absent |
| `locatorForOptional(selector)` | Zero or one — returns `null` when absent |
| `locatorForAll(selector)` | Zero or more — returns an array |
| `locatorFor(HarnessType)` | Finds a child harness by type |
| `locatorForAll(HarnessType)` | Finds all child harnesses of a type |

---

## 5. Accessing Host Element Properties

```typescript
async getAriaLabel(): Promise<string | null> {
  return (await this.host()).getAttribute('aria-label');
}

async isDisabled(): Promise<boolean> {
  return (await this.host()).hasClass('disabled');
}
```

---

## 6. Delegating to Child Harnesses

If your component contains Angular Material components, delegate to their harnesses:

```typescript
import { MatButtonHarness } from '@angular/material/button/testing';

private getClearButton = this.locatorFor(MatButtonHarness.with({ text: 'Clear' }));

async clear(): Promise<void> {
  return (await this.getClearButton()).click();
}
```

---

## 7. Exporting the Harness

Export the harness from the library's public API barrel:

```typescript
// public-api.ts
export * from './lib/ui/rating/rating.harness';
export * from './lib/ui/rating/rating.component';
```

Consumers can then import it cleanly:

```typescript
import { RatingHarness } from '@my-org/ui';
```

---

## 8. Testing the Harness Itself

Even harnesses benefit from a quick smoke test:

```typescript
describe('RatingHarness', () => {
  let loader: HarnessLoader;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RatingComponent],
    }).compileComponents();

    const fixture = TestBed.createComponent(RatingComponent);
    loader = TestbedHarnessEnvironment.loader(fixture);
    fixture.detectChanges();
  });

  it('should click the second star', async () => {
    const harness = await loader.getHarness(RatingHarness);
    await harness.clickStar(2);
    expect(await harness.getValue()).toBe(2);
  });
});
```