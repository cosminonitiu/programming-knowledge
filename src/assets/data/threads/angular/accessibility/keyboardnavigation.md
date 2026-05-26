## Keyboard Navigation Patterns in Angular

Keyboard accessibility means every interactive feature must be operable without a mouse. This is both a legal requirement (WCAG 2.1) and good UX for power users.

---

## 1. The Fundamentals

### Tab Order

Tab moves focus through interactive elements in DOM order. Rules:
- `tabindex="0"` — adds element to natural tab order
- `tabindex="-1"` — focusable programmatically (`.focus()`), not in tab order
- `tabindex="1+"` — **avoid** — creates unpredictable tab order

```html
<!-- ✅ Let DOM order control tab order -->
<button>First</button>
<button>Second</button>
<button>Third</button>

<!-- ❌ Avoid positive tabindex -->
<button tabindex="3">Third</button>
<button tabindex="1">First</button>
```

---

## 2. Keyboard Event Handling in Angular

```typescript
@Component({ standalone: true, ... })
export class MenuComponent {
  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    switch (event.key) {
      case 'Escape': this.close(); break;
      case 'ArrowDown': this.focusNext(); event.preventDefault(); break;
      case 'ArrowUp': this.focusPrevious(); event.preventDefault(); break;
      case 'Home': this.focusFirst(); event.preventDefault(); break;
      case 'End': this.focusLast(); event.preventDefault(); break;
    }
  }
}
```

Template shorthand:
```html
<div (keydown.escape)="close()"
     (keydown.arrowdown)="focusNext()"
     (keydown.arrowup)="focusPrevious()">
```

---

## 3. CDK `ListKeyManager` for Lists & Menus

```typescript
import { ListKeyManager } from '@angular/cdk/a11y';

@Component({ standalone: true, ... })
export class DropdownMenuComponent implements AfterViewInit {
  @ViewChildren(MenuItemComponent) items!: QueryList<MenuItemComponent>;
  keyManager!: ListKeyManager<MenuItemComponent>;

  ngAfterViewInit() {
    this.keyManager = new ListKeyManager(this.items)
      .withVerticalOrientation()    // up/down arrows
      .withHorizontalOrientation('ltr')  // left/right arrows too
      .withWrap()                   // wrap around at edges
      .withTypeAhead(200);          // type first letter to jump to item
  }

  @HostListener('keydown', ['$event'])
  onKeydown(event: KeyboardEvent) {
    if (event.key === 'Enter' || event.key === ' ') {
      this.keyManager.activeItem?.select();
      event.preventDefault();
    } else {
      this.keyManager.onKeydown(event);
    }
  }
}
```

Each `MenuItemComponent` must implement `Highlightable`:
```typescript
@Component({ ... })
export class MenuItemComponent implements Highlightable {
  isActive = false;
  setActiveStyles() { this.isActive = true; }
  setInactiveStyles() { this.isActive = false; }
  select() { /* emit selection */ }
}
```

---

## 4. Focus Management After Dynamic Changes

```typescript
@Component({ standalone: true, ... })
export class NotificationComponent {
  @ViewChild('closeButton') closeButton!: ElementRef;
  private previousFocus: HTMLElement | null = null;

  open() {
    this.previousFocus = document.activeElement as HTMLElement;
    // Wait for the DOM to update before focusing
    setTimeout(() => this.closeButton.nativeElement.focus(), 0);
  }

  close() {
    // Restore focus to where it was before the dialog opened
    this.previousFocus?.focus();
  }
}
```

**Critical:** When a dialog/modal closes, focus must return to the element that triggered it.

---

## 5. Router Focus After Navigation

Focus doesn't automatically move to the new page after Angular navigation — users are left wherever focus was:

```typescript
// app.component.ts — manage focus after every navigation
@Component({ ... })
export class AppComponent {
  private router = inject(Router);

  constructor() {
    this.router.events.pipe(
      filter(e => e instanceof NavigationEnd)
    ).subscribe(() => {
      const h1 = document.querySelector('h1');
      if (h1) {
        (h1 as HTMLElement).setAttribute('tabindex', '-1');
        (h1 as HTMLElement).focus();
      }
    });
  }
}
```

---

## 6. Custom Interactive Components Checklist

For any custom interactive element (not a native `<button>`, `<input>`, etc.):

```html
<div
  role="button"              <!-- semantic role -->
  tabindex="0"               <!-- add to tab order -->
  [attr.aria-pressed]="isPressed"
  (click)="toggle()"
  (keydown.enter)="toggle()" <!-- keyboard activation -->
  (keydown.space)="toggle(); $event.preventDefault()">
  Custom Button
</div>
```

Checklist:
- [ ] `role` communicates the element type
- [ ] `tabindex="0"` makes it focusable
- [ ] Enter and Space keys activate it (for button-like elements)
- [ ] Visual focus indicator is visible
- [ ] State communicated via ARIA (expanded, pressed, selected, disabled)

---

## Architect Notes

- **Prefer native elements** — `<button>` works without any of the above. Build custom controls only when native ones won't work for your use case.
- `cdkTrapFocus` from the CDK a11y module handles modal focus trapping — don't implement it manually
- Test with keyboard-only (no mouse) before every release — it takes 5 minutes and catches all the obvious issues
- `@HostListener('keydown.arrowdown', ['$event'])` syntax prevents the need for switch statements for individual keys
