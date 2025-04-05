Structural Directives modify the DOM by adding, removing, or manipulating elements dynamically.
They change the structure of the HTML at runtime.
Always prefixed with * (e.g., *ngIf, *ngFor, *ngSwitch).
They affect the host element and its children.

---

Core Structural Directives
*ngIf: Conditionally Show/Hide Elements
Used to conditionally render elements based on a boolean condition.

```typescript
<div *ngIf="isVisible">Visible Content</div> 

With else block:

<div *ngIf="isLoggedIn; else loggedOutTemplate">Welcome Back!</div>
<ng-template #loggedOutTemplate>
  <p>Please log in.</p>
</ng-template> 

With then and else:

<div *ngIf="dataLoaded; then dataTemplate; else loadingTemplate"></div>

<ng-template #dataTemplate>
  <p>Data is available.</p>
</ng-template>

<ng-template #loadingTemplate>
  <p>Loading...</p>
</ng-template>
```

:pushpin: How it Works:

If isVisible === false, the element is removed from the DOM.

ng-template is a placeholder for content not initially rendered.

:arrows_counterclockwise: ngFor: Looping Over Lists
Used to iterate over arrays and render elements dynamically.

```typescript
<ul>
  <lingFor="let item of items">{{ item }}</li>
</ul> 
Index and first/last checks:

<ul>
  <li ngFor="let item of items; index as i; first as isFirst; last as isLast">
    {{ i }}: {{ item }} - 
    <spanngIf="isFirst">:small_blue_diamond: First</span>
    <span ngIf="isLast">:small_red_triangle_down: Last</span>
  </li>
</ul> 
Using trackBy for better performance:
Prevents unnecessary DOM updates when modifying the array.

<lingFor="let item of items; trackBy: trackById">
  {{ item.name }}
</li> 
```
trackById(index: number, item: any) {
  return item.id; // Unique identifier for tracking changes
} 

Why Use trackBy?

Without it, Angular re-renders all items on any list update.

With trackBy, it only updates changed elements.

:twisted_rightwards_arrows: ngSwitch: Multiple Conditions
Used when you have multiple conditions to display different elements.

```typescript
<div [ngSwitch]="status">
  <pngSwitchCase="'active'">:green_circle: Active</p>
  <p ngSwitchCase="'inactive'">:red_circle: Inactive</p>
  <pngSwitchDefault>:white_circle: Unknown</p>
</div> 
```
Why Use ngSwitch?

More readable and efficient than multiple *ngIf statements.

Custom Structural Directives
Angular allows us to create our own structural directives using @Directive.

Example: Custom *appUnless
Works opposite to *ngIf (hides content if a condition is true).

Creating the Directive
```typescript
import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appUnless]'
})
export class UnlessDirective {
  constructor(
    private templateRef: TemplateRef<any>,
    private viewContainer: ViewContainerRef
  ) {}

  @Input() set appUnless(condition: boolean) {
    if (!condition) {
      this.viewContainer.createEmbeddedView(this.templateRef);
    } else {
      this.viewContainer.clear();
    }
  }
}
```
How it Works?

TemplateRef represents the template inside *appUnless.

ViewContainerRef allows inserting/removing the template dynamically.

If condition === false, it renders the content.

If condition === true, it removes the content from the DOM.

Using the Directive
```typescript
<p *appUnless="isLoggedIn">You are NOT logged in.</p>
```
If isLoggedIn is true, the paragraph is removed.

If isLoggedIn is false, the paragraph is displayed.