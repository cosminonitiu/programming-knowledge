## ARIA in Angular Templates

ARIA (Accessible Rich Internet Applications) attributes communicate element roles, states, and properties to assistive technologies. Angular makes it easy to bind ARIA attributes dynamically.

---

## 1. Static vs Dynamic ARIA

```html
<!-- Static ARIA — use when the value never changes -->
<nav aria-label="Main navigation">
<button aria-label="Close dialog">×</button>

<!-- Dynamic ARIA — bind with [attr.aria-*] -->
<button [attr.aria-expanded]="isOpen" [attr.aria-controls]="menuId">
  Toggle Menu
</button>

<div [id]="menuId" [attr.aria-hidden]="!isOpen">
  <!-- menu items -->
</div>
```

---

## 2. Common ARIA Patterns

### Expandable Content

```html
<button
  [attr.aria-expanded]="isExpanded"
  [attr.aria-controls]="'panel-' + id"
  (click)="isExpanded = !isExpanded">
  {{ title }}
  <span [attr.aria-hidden]="true">{{ isExpanded ? '▲' : '▼' }}</span>
</button>

<div
  [id]="'panel-' + id"
  [attr.aria-hidden]="!isExpanded"
  [hidden]="!isExpanded">
  <!-- content -->
</div>
```

### Form Validation

```html
<input
  [attr.aria-invalid]="control.invalid && control.touched"
  [attr.aria-describedby]="'error-' + controlName"
  [formControl]="control" />

<span
  [id]="'error-' + controlName"
  role="alert"
  [hidden]="!control.invalid || !control.touched">
  {{ getErrorMessage(control) }}
</span>
```

### Loading States

```html
<button
  [attr.aria-busy]="isLoading"
  [attr.aria-label]="isLoading ? 'Saving...' : 'Save'"
  [disabled]="isLoading">
  @if (isLoading) { <span aria-hidden="true">⏳</span> }
  {{ isLoading ? 'Saving...' : 'Save' }}
</button>
```

### Live Regions

```html
<!-- Polite: screen reader announces after current speech ends -->
<div aria-live="polite" aria-atomic="true">
  {{ statusMessage }}
</div>

<!-- Assertive: interrupts current speech (use sparingly) -->
<div aria-live="assertive" role="alert">
  {{ errorMessage }}
</div>
```

---

## 3. Semantic HTML First

Before reaching for ARIA, use semantic HTML — it comes with built-in accessibility for free:

```html
<!-- ❌ Don't do this — needs manual ARIA -->
<div class="button" role="button" tabindex="0" (click)="submit()" (keydown.enter)="submit()">
  Submit
</div>

<!-- ✅ Do this — native button has click, keyboard, and role built in -->
<button type="submit">Submit</button>
```

**First rule of ARIA:** Don't use ARIA if a semantic HTML element exists.

---

## 4. Landmark Roles

Angular apps are often single-page shells — make sure landmarks are in place:

```html
<header role="banner">
  <nav aria-label="Primary navigation">
    <ul>...</ul>
  </nav>
</header>

<main>
  <h1>Page Title</h1>
  <router-outlet></router-outlet>
</main>

<aside aria-label="Table of contents">...</aside>

<footer role="contentinfo">...</footer>
```

---

## 5. Skip Navigation Link

```html
<!-- First interactive element on the page -->
<a href="#main-content" class="skip-link">Skip to main content</a>

<main id="main-content" tabindex="-1">
  <!-- ... -->
</main>
```

```css
.skip-link {
  position: absolute;
  top: -40px;
  left: 0;
  background: #000;
  color: #fff;
  padding: 8px;
  z-index: 100;
}
.skip-link:focus {
  top: 0;
}
```

---

## 6. Router Focus Management

Angular's router doesn't manage focus by default — after navigation, focus stays on the previous element:

```typescript
// app.config.ts
provideRouter(routes, withViewTransitions(), 
  withRouterConfig({ 
    // Angular 19+: auto-focus the first h1 after navigation
    focusStrategy: 'enabled' 
  })
)
```

Or manually in each page component:
```typescript
@Component({ ... })
export class SurveyListPageComponent implements AfterViewInit {
  @ViewChild('pageTitle') titleRef!: ElementRef;

  ngAfterViewInit() {
    this.titleRef.nativeElement.focus();
  }
}
```

```html
<h1 #pageTitle tabindex="-1">Survey List</h1>
```

---

## Architect Notes

- `[attr.aria-*]` bindings return `null` (removes the attribute) when the bound value is `null`/`undefined` — use this to conditionally remove ARIA attributes
- Test with actual screen readers: NVDA + Chrome (free on Windows), VoiceOver + Safari (macOS/iOS), TalkBack (Android)
- The most common WCAG failures in Angular apps: missing form labels, no focus management after navigation, missing alt text, and no keyboard access to custom interactive elements
- ARIA doesn't make broken UI accessible — it only communicates semantics. The keyboard interaction still needs to work.
