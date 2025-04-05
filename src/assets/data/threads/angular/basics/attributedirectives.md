## :mag: What Are Attribute Directives?
Attribute Directives **modify the appearance or behavior of an element, component, or other directives**.  
Unlike **Structural Directives** (`*ngIf`, `*ngFor`), **they don’t add or remove elements from the DOM**.

### :trophy: Built-in Attribute Directives:
- `[ngClass]` → Dynamically apply CSS classes.
- `[ngStyle]` → Apply dynamic inline styles.
- `required`, `disabled`, etc. → Native attributes that can be bound dynamically.

---

## :tools: Creating a Custom Attribute Directive
Let's create a directive that **changes the background color on hover**.

### :hammer: **:one: Creating the Directive**
```typescript
import { Directive, ElementRef, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  @Input('appHighlight') highlightColor: string = 'yellow';

  constructor(private el: ElementRef) {}

  @HostListener('mouseenter') onMouseEnter() {
    this.el.nativeElement.style.backgroundColor = this.highlightColor;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.el.nativeElement.style.backgroundColor = 'transparent';
  }
}
```

How It Works?
ElementRef → Accesses the host element and modifies its style.

@HostListener → Listens for DOM events (mouseenter, mouseleave).

@Input('appHighlight') → Allows customization of the color.

Using the Directive in HTML
```typescript
<p appHighlight="lightblue">Hover over me to change background color!</p> 
```
When you hover over the paragraph, the background turns light blue!

**Built-in Attribute Directives**
[ngClass] → Apply CSS Classes Dynamically
```typescript
<p [ngClass]="{ 'active': isActive, 'error': hasError }">Styled Text</p>```
```
isActive = true;
hasError = false; ```

[ngStyle] → Apply Styles Dynamically
```typescript
<p [ngStyle]="{ 'color': textColor, 'font-size': fontSize }">Styled Text</p> 
```
```typescript
textColor = 'blue';
fontSize = '20px'; 
```

Advanced: Directive with HostBinding
We can use @HostBinding instead of ElementRef.

**Creating a Directive Using @HostBinding**
```typescript
import { Directive, HostBinding, HostListener, Input } from '@angular/core';

@Directive({
  selector: '[appBorder]'
})
export class BorderDirective {
  @Input('appBorder') borderColor: string = 'black';

  @HostBinding('style.border') border!: string;

  @HostListener('mouseenter') onMouseEnter() {
    this.border = `2px solid ${this.borderColor}`;
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.border = 'none';
  }
} 
```
Using the Directive
```typescript
<p appBorder="red">Hover to add a red border!</p>
```
Adds a red border when hovered! 