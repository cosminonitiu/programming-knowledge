## Angular CDK a11y Module

The Angular CDK's `a11y` module provides tools for building accessible components without reinventing the wheel. Essential for enterprise apps and any team that cares about WCAG compliance.

---

## 1. Installing CDK

```bash
npm install @angular/cdk
```

---

## 2. `FocusTrap` — Trapping Focus in Dialogs

When a modal opens, keyboard focus must be trapped inside it (Tab shouldn't cycle outside the dialog):

```typescript
import { A11yModule, FocusTrapFactory } from '@angular/cdk/a11y';

@Component({
  standalone: true,
  imports: [A11yModule],
  template: `
    <div cdkTrapFocus cdkTrapFocusAutoCapture>
      <h2>Dialog Title</h2>
      <button>Action</button>
      <button (click)="close()">Close</button>
    </div>
  `
})
export class DialogComponent {}
```

`cdkTrapFocusAutoCapture` moves focus into the trap immediately when the component renders.

**Programmatic usage:**
```typescript
private focusTrapFactory = inject(FocusTrapFactory);
private elementRef = inject(ElementRef);
private focusTrap!: FocusTrap;

ngAfterViewInit() {
  this.focusTrap = this.focusTrapFactory.create(this.elementRef.nativeElement);
  this.focusTrap.focusInitialElementWhenReady();
}

ngOnDestroy() {
  this.focusTrap.destroy();
}
```

---

## 3. `LiveAnnouncer` — Screen Reader Announcements

For dynamic content that isn't visible to screen readers (async updates, form validation results):

```typescript
@Component({ standalone: true, ... })
export class SurveyFormComponent {
  private announcer = inject(LiveAnnouncer);

  async submit() {
    const result = await this.surveyService.save();
    if (result.success) {
      this.announcer.announce('Survey saved successfully', 'assertive');
    } else {
      this.announcer.announce('Error saving survey: ' + result.error, 'assertive');
    }
  }
}
```

| Priority | When to Use |
|---|---|
| `'polite'` | Non-urgent updates (search results loaded, data refreshed) |
| `'assertive'` | Urgent updates (form errors, critical status changes) |

---

## 4. `FocusMonitor` — Track Focus State

Detect whether an element is focused and whether by keyboard or mouse:

```typescript
@Component({ standalone: true, ... })
export class ButtonComponent implements OnDestroy {
  private focusMonitor = inject(FocusMonitor);
  private elementRef = inject(ElementRef);

  isFocused = signal(false);
  focusOrigin = signal<FocusOrigin>(null);

  constructor() {
    this.focusMonitor.monitor(this.elementRef, true).subscribe(origin => {
      this.isFocused.set(!!origin);
      this.focusOrigin.set(origin);
    });
  }

  ngOnDestroy() {
    this.focusMonitor.stopMonitoring(this.elementRef);
  }
}
```

**Use cases:**
- Show focus rings only for keyboard navigation (not mouse clicks)
- Custom button components that need `:focus-visible` behavior

---

## 5. `ActiveDescendantKeyManager` & `ListKeyManager`

For custom list/menu components that need keyboard navigation (arrow keys):

```typescript
@Component({ standalone: true, ... })
export class DropdownComponent implements AfterViewInit {
  @ViewChildren(DropdownItemComponent) items!: QueryList<DropdownItemComponent>;
  private keyManager!: ActiveDescendantKeyManager<DropdownItemComponent>;

  ngAfterViewInit() {
    this.keyManager = new ActiveDescendantKeyManager(this.items)
      .withWrap()        // wrap around at end/start
      .withTypeAhead();  // type first letter to jump to item
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    this.keyManager.onKeydown(event);
  }
}
```

---

## 6. High Contrast Mode Detection

```typescript
import { HighContrastModeDetector } from '@angular/cdk/a11y';

@Component({ standalone: true, ... })
export class AppComponent {
  private hcDetector = inject(HighContrastModeDetector);

  constructor() {
    const mode = this.hcDetector.getHighContrastMode();
    // 'none' | 'black-on-white' | 'white-on-black'
    if (mode !== 'none') {
      document.body.classList.add('high-contrast');
    }
  }
}
```

---

## Architect Notes

- `FocusTrap` is the most critical CDK a11y tool — every custom modal/dialog must trap focus or it fails WCAG 2.1 SC 2.1.2
- `LiveAnnouncer` is easily overlooked but critical for screen reader users who can't see async status changes
- Angular Material's Dialog, Menu, and Select already use these CDK tools correctly — if you're building custom equivalents, replicate this behavior
- Run accessibility audits with axe-core or the browser's built-in accessibility tree during development, not just at the end
