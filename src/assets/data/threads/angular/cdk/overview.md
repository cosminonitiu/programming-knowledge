## Angular CDK Overview

The Angular CDK (Component Development Kit) provides low-level primitives for building custom UI components — the foundation that Angular Material is built on. Use CDK when you need custom components without Material's visual design.

---

## 1. What CDK Provides

```bash
npm install @angular/cdk
```

| Module | What It Does |
|---|---|
| `a11y` | Focus management, ARIA, live announcements |
| `overlay` | Floating panels, tooltips, dropdowns |
| `portal` | Render components/templates anywhere in the DOM |
| `drag-drop` | Drag and drop with sorting |
| `scrolling` | Virtual scrolling for large lists |
| `clipboard` | Copy text to clipboard |
| `layout` | Breakpoint observer, media queries |
| `observers` | Content observer, resize observer |
| `text-field` | Auto-sizing textareas |
| `table` | Data table with virtual scroll support |
| `stepper` | Step wizard base |
| `tree` | Tree data structure with flat/nested modes |
| `coercion` | Type coercion utilities (`coerceBooleanProperty`, etc.) |

---

## 2. Overlay — Floating Elements

The Overlay module renders content in a floating layer positioned relative to an element or the viewport.

```typescript
import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';

@Component({ standalone: true, ... })
export class TooltipDirective {
  private overlay = inject(Overlay);
  private viewContainerRef = inject(ViewContainerRef);
  private overlayRef: OverlayRef | null = null;

  @HostListener('mouseenter')
  show() {
    const positionStrategy = this.overlay.position()
      .flexibleConnectedTo(this.elementRef)
      .withPositions([
        { originX: 'center', originY: 'bottom', overlayX: 'center', overlayY: 'top' }
      ]);

    this.overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: false,
      scrollStrategy: this.overlay.scrollStrategies.reposition()
    });

    const portal = new ComponentPortal(TooltipComponent, this.viewContainerRef);
    const ref = this.overlayRef.attach(portal);
    ref.instance.message = this.tooltipText;
  }

  @HostListener('mouseleave')
  hide() {
    this.overlayRef?.detach();
    this.overlayRef = null;
  }
}
```

---

## 3. Portal — Render Anywhere

Portals let you render a component or template into any DOM location, regardless of the component hierarchy.

```typescript
import { PortalModule, ComponentPortal, TemplatePortal } from '@angular/cdk/portal';
import { DomPortalOutlet } from '@angular/cdk/portal';
```

```html
<!-- portal-outlet.component.html — the destination -->
<ng-template [cdkPortalOutlet]="activePortal"></ng-template>
```

```typescript
// component that controls what's shown
activePortal: Portal<any> | null = null;

showSidebar() {
  this.activePortal = new ComponentPortal(SidebarComponent);
}

showTemplate() {
  this.activePortal = new TemplatePortal(this.myTemplateRef, this.viewContainerRef);
}
```

**Use case:** Rendering a dialog or notification from one component into a host container that's at the root of the app — avoids CSS z-index and overflow issues.

---

## 4. Drag and Drop

```typescript
import { DragDropModule } from '@angular/cdk/drag-drop';

@Component({
  standalone: true,
  imports: [DragDropModule],
  template: `
    <div cdkDropList (cdkDropListDropped)="onDrop($event)">
      <div *ngFor="let item of items" cdkDrag>
        {{ item.name }}
        <div class="cdk-drag-placeholder" *cdkDragPlaceholder></div>
      </div>
    </div>
  `
})
export class SortableListComponent {
  items = ['Alpha', 'Beta', 'Gamma', 'Delta'];

  onDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.items, event.previousIndex, event.currentIndex);
  }
}
```

**Connected lists (move between lists):**
```html
<div cdkDropList #listA="cdkDropList" [cdkDropListConnectedTo]="[listB]">
<div cdkDropList #listB="cdkDropList" [cdkDropListConnectedTo]="[listA]">
```

---

## 5. Clipboard

```typescript
import { Clipboard } from '@angular/cdk/clipboard';

@Component({ standalone: true, ... })
export class CodeBlockComponent {
  private clipboard = inject(Clipboard);

  copy(code: string) {
    const success = this.clipboard.copy(code);
    if (success) {
      this.announcer.announce('Code copied to clipboard');
    }
  }
}
```

---

## 6. Layout — Breakpoint Observer

```typescript
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Component({ standalone: true, ... })
export class NavigationComponent {
  private breakpoints = inject(BreakpointObserver);

  isMobile = toSignal(
    this.breakpoints.observe([Breakpoints.Handset]).pipe(
      map(result => result.matches)
    )
  );
}
```

```html
@if (isMobile()) {
  <app-mobile-nav />
} @else {
  <app-desktop-nav />
}
```

---

## Architect Notes

- CDK is the right choice when you need custom behavior with your own design system — don't import all of Material just for its behavior
- `Overlay` and `Portal` solve the "render outside the component tree" problem that's common for dialogs, tooltips, and notifications
- Always prefer CDK's `FocusTrap` and `ListKeyManager` for accessible custom components rather than rolling your own
- CDK modules are tree-shakeable — only the modules you import end up in the bundle
