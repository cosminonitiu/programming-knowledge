## CDK Overlay & Portal — Custom Dialogs and Tooltips

The Overlay and Portal APIs are the building blocks for any floating UI: dialogs, dropdowns, tooltips, sidebars. Understanding them lets you build accessible, well-positioned floating components without Angular Material's visual constraints.

---

## 1. Overlay Positioning Strategies

The CDK provides two positioning strategies:

```typescript
import { Overlay } from '@angular/cdk/overlay';

private overlay = inject(Overlay);

// 1. Global — centered/positioned relative to the viewport
const strategy = this.overlay.position().global()
  .centerHorizontally()
  .centerVertically();

// 2. Connected — positioned relative to an element
const strategy = this.overlay.position()
  .flexibleConnectedTo(triggerElement)
  .withPositions([
    // Preferred: below and aligned to left edge of trigger
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    // Fallback: above the trigger
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ])
  .withFlexibleDimensions(true)
  .withPush(true);  // push into viewport if it would overflow
```

---

## 2. Building a Custom Dialog Service

```typescript
// dialog.service.ts
@Injectable({ providedIn: 'root' })
export class DialogService {
  private overlay = inject(Overlay);

  open<T>(component: Type<T>, data?: unknown): OverlayRef {
    const positionStrategy = this.overlay.position()
      .global()
      .centerHorizontally()
      .centerVertically();

    const overlayRef = this.overlay.create({
      positionStrategy,
      hasBackdrop: true,
      backdropClass: 'dialog-backdrop',
      panelClass: 'dialog-panel',
      scrollStrategy: this.overlay.scrollStrategies.block()
    });

    // Close when backdrop is clicked
    overlayRef.backdropClick().subscribe(() => overlayRef.detach());

    // Close on Escape
    overlayRef.keydownEvents().pipe(
      filter(e => e.key === 'Escape')
    ).subscribe(() => overlayRef.detach());

    // Attach the component
    const portal = new ComponentPortal(component);
    const componentRef = overlayRef.attach(portal);

    // Pass data to the component
    if (data) {
      Object.assign(componentRef.instance as object, data);
    }

    return overlayRef;
  }
}
```

```typescript
// Usage in any component
private dialog = inject(DialogService);

openConfirmation() {
  const ref = this.dialog.open(ConfirmDialogComponent, {
    message: 'Are you sure?'
  });
  // ref.detach() to close programmatically
}
```

---

## 3. Scroll Strategies

Controls what happens to the overlay when the page scrolls:

```typescript
const scrollStrategy = this.overlay.scrollStrategies.block();    // block page scroll
const scrollStrategy = this.overlay.scrollStrategies.close();    // close on scroll
const scrollStrategy = this.overlay.scrollStrategies.reposition(); // reposition on scroll (for tooltips)
const scrollStrategy = this.overlay.scrollStrategies.noop();     // do nothing
```

---

## 4. Portal — Rendering Into Arbitrary DOM Locations

### `PortalOutlet` directive in templates

```html
<!-- app.component.html — the outlet -->
<ng-template [cdkPortalOutlet]="currentPortal"></ng-template>
```

```typescript
// Service that manages portal state
@Injectable({ providedIn: 'root' })
export class SidebarPortalService {
  currentPortal = signal<Portal<any> | null>(null);

  open<T>(component: Type<T>): void {
    this.currentPortal.set(new ComponentPortal(component));
  }

  close(): void {
    this.currentPortal.set(null);
  }
}
```

### `DomPortalOutlet` — Attach to Any DOM Element

```typescript
// Render a component into an arbitrary DOM node (e.g., a PDF viewer container)
const outlet = new DomPortalOutlet(
  document.querySelector('#external-container')!,
  this.componentFactoryResolver,  // optional in newer Angular
  this.appRef,
  this.injector
);

const portal = new ComponentPortal(MyComponent);
outlet.attach(portal);
```

---

## 5. Template Portal

Render an `<ng-template>` (not a full component) via a portal:

```typescript
@Component({ standalone: true, imports: [PortalModule], ... })
export class ParentComponent {
  @ViewChild('myTemplate') templateRef!: TemplateRef<any>;
  private viewContainerRef = inject(ViewContainerRef);
  private sidebarService = inject(SidebarPortalService);

  openSidebar() {
    const portal = new TemplatePortal(this.templateRef, this.viewContainerRef);
    this.sidebarService.currentPortal.set(portal);
  }
}
```

```html
<ng-template #myTemplate>
  <h2>Sidebar Content</h2>
  <p>This renders wherever the cdkPortalOutlet is.</p>
</ng-template>
```

---

## 6. Accessibility on Custom Overlays

Any overlay that acts like a dialog must:

```typescript
overlayRef.attach(portal);

// Set ARIA attributes on the panel
const panel = overlayRef.overlayElement;
panel.setAttribute('role', 'dialog');
panel.setAttribute('aria-modal', 'true');
panel.setAttribute('aria-label', 'Confirmation Dialog');

// Trap focus inside the dialog
const focusTrap = this.focusTrapFactory.create(panel);
focusTrap.focusInitialElementWhenReady();

// On close, restore focus and destroy focus trap
overlayRef.detachments().subscribe(() => {
  focusTrap.destroy();
  triggerElement.focus();
});
```

---

## Architect Notes

- Use CDK Overlay instead of `position: fixed` + `z-index` games — the CDK handles viewport overflow, scroll, and repositioning correctly
- The connected position strategy's fallback positions (the array) solve the "dropdown cuts off at screen edge" problem automatically
- Always pair overlays with `FocusTrap` and backdrop `keydownEvents` for accessibility
- Angular Material's `Dialog` service is a ready-made wrapper around these primitives — use it if Material design is acceptable
