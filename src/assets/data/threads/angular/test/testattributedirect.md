## Testing Attribute Directives

Attribute directives modify the appearance or behavior of an existing host element. Because they have no template of their own, tests create a simple **host component** that applies the directive.

---

## 1. The Directive Under Test

```typescript
// highlight.directive.ts
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({ selector: '[appHighlight]', standalone: true })
export class HighlightDirective {
  @Input() appHighlight = 'yellow';

  constructor(private el: ElementRef<HTMLElement>) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.appHighlight;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = '';
  }
}
```

---

## 2. Creating a Host Component for Tests

```typescript
import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { HighlightDirective } from './highlight.directive';

@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: `<p appHighlight="cyan">Hover me</p>`,
})
class TestHostComponent {}

describe('HighlightDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();
  });

  it('should apply the color on mouseenter', () => {
    const p = fixture.debugElement.query(By.css('p'));
    p.triggerEventHandler('mouseenter', null);

    expect(p.nativeElement.style.backgroundColor).toBe('cyan');
  });

  it('should clear the color on mouseleave', () => {
    const p = fixture.debugElement.query(By.css('p'));
    p.triggerEventHandler('mouseenter', null);
    p.triggerEventHandler('mouseleave', null);

    expect(p.nativeElement.style.backgroundColor).toBe('');
  });
});
```

---

## 3. Testing with `By.directive`

Locate all elements that have the directive applied:

```typescript
import { By } from '@angular/platform-browser';

const highlightedEls = fixture.debugElement.queryAll(By.directive(HighlightDirective));
expect(highlightedEls.length).toBe(1);
```

---

## 4. Accessing the Directive Instance

```typescript
const pDe = fixture.debugElement.query(By.directive(HighlightDirective));
const directive = pDe.injector.get(HighlightDirective);

expect(directive.appHighlight).toBe('cyan');
```

---

## 5. Testing an Input Change

```typescript
@Component({
  standalone: true,
  imports: [HighlightDirective],
  template: `<p [appHighlight]="color">Text</p>`,
})
class DynamicHostComponent {
  color = 'yellow';
}

it('should react to input changes', () => {
  const hostFixture = TestBed.createComponent(DynamicHostComponent);
  hostFixture.detectChanges();

  hostFixture.componentInstance.color = 'pink';
  hostFixture.detectChanges();

  const p = hostFixture.debugElement.query(By.css('p'));
  p.triggerEventHandler('mouseenter', null);
  expect(p.nativeElement.style.backgroundColor).toBe('pink');
});
```

---

## 6. Testing a Structural Directive

Structural directives (`*ngIf`-style) are tested the same way — via a host component:

```typescript
// unless.directive.ts
@Directive({ selector: '[appUnless]', standalone: true })
export class UnlessDirective {
  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.vcr.createEmbeddedView(this.tmpl);
    } else {
      this.vcr.clear();
    }
  }
  constructor(private tmpl: TemplateRef<unknown>, private vcr: ViewContainerRef) {}
}

@Component({
  standalone: true,
  imports: [UnlessDirective],
  template: `<div *appUnless="hide">Visible</div>`,
})
class UnlessHostComponent {
  hide = false;
}

it('should show content when condition is false', () => {
  const f = TestBed.createComponent(UnlessHostComponent);
  f.detectChanges();
  expect(f.nativeElement.querySelector('div')).toBeTruthy();
});

it('should hide content when condition is true', () => {
  const f = TestBed.createComponent(UnlessHostComponent);
  f.componentInstance.hide = true;
  f.detectChanges();
  expect(f.nativeElement.querySelector('div')).toBeNull();
});
```

---

## 7. Testing `@HostBinding`

```typescript
// active.directive.ts
@Directive({ selector: '[appActive]', standalone: true })
export class ActiveDirective {
  @Input() appActive = false;
  @HostBinding('class.active') get isActive() { return this.appActive; }
}

it('should add active class when input is true', () => {
  // host component with [appActive]="true"
  const el = fixture.debugElement.query(By.directive(ActiveDirective));
  expect(el.nativeElement.classList.contains('active')).toBeTrue();
});
```

---

## 8. Summary: Key Points

- Always use a **host component** — directives are never tested in isolation.
- Use `By.directive(DirectiveClass)` to locate directive-adorned elements.
- Use `debugElement.injector.get(DirectiveClass)` to access the directive instance.
- `triggerEventHandler` fires `@HostListener` methods without real browser events.