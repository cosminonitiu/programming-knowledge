# Angular Structural Directives and Content Projection

Angular provides several powerful constructs to control rendering and composition in your templates. Three key features are **ng-container**, **ng-template**, and **ng-content**. Each serves a distinct purpose in how you build and compose your views.

---

## ng-container

- **What It Is:**  
  A logical container that doesn’t get rendered as a real DOM element. It’s used to group elements and apply directives without introducing extra nodes in the final HTML.

- **When to Use It:**  
  - When you need to apply structural directives (like *ngIf or *ngFor) without adding an extra wrapper element.
  - To keep the DOM clean and avoid unnecessary nesting.

- **Example:**

```html
  <ng-container *ngIf="showSection">
    <h2>Section Title</h2>
    <p>This content is conditionally rendered.</p>
  </ng-container>
Here, if showSection is false, no extra DOM element is created. The <ng-container> is just a grouping mechanism.
```

**ng-template**
**What It Is:**
A template definition that isn’t rendered immediately. It acts as a blueprint for instantiating views. Angular compiles the contents of an <ng-template> but only renders them when directed by a structural directive or when explicitly instantiated.

When to Use It:

To define reusable template blocks.

In combination with directives like *ngIf, *ngFor, or with the ngTemplateOutlet directive to dynamically render content.

When you want to delay rendering until a condition is met.

Example:

```html
<!-- Define the template -->
<ng-template #loadingTemplate>
  <p>Loading data, please wait...</p>
</ng-template>

<!-- Use the template with ngTemplateOutlet -->
<ng-container *ngIf="data$ | async as data; else loadingTemplate">
  <p>Data: {{ data }}</p>
</ng-container> 
```
In this example, if the data isn’t available yet, Angular renders the content of the template referenced by loadingTemplate.

**ng-content**
What It Is:
A placeholder in a component’s template that is used for content projection. It allows a component to render external content inside its own template.

When to Use It:

When building reusable components that need to display custom content provided by a parent component.

To implement “slot” like behavior (and you can even use selectors with <ng-content select="..."> for more refined projection).

Example:
```html
<!-- Parent component template -->
<app-card>
  <p>This paragraph is projected into the card component.</p>
</app-card>
html
Copy
<!-- app-card component template -->
<div class="card">
  <ng-content></ng-content>
</div> 
```
Here, the <ng-content> tag in the app-card component marks where the parent's content should be inserted.