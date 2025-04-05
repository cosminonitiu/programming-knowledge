# Angular Data Binding

Angular’s data binding system is a core feature that connects your component’s data (the model) with its view (the template). This powerful mechanism lets you synchronize data in both directions—from the component to the view and back—while reducing boilerplate code and helping you build dynamic, responsive applications.

---

## Types of Data Binding

Angular provides several types of data binding techniques:

### 1. One-Way Data Binding

- **Interpolation:**  
  Uses double curly braces (`{{ }}`) to insert dynamic values into your HTML.  
  ```html
  <h1>{{ title }}</h1> 
  ```

Angular evaluates the expression and renders its value as text.

**Property Binding:**
Binds a DOM property to a component property using square brackets.

```
<img [src]="imageUrl" alt="Angular Logo">```
Here, the src attribute of the image is set to the value of imageUrl from the component.

**Event Binding:**
Listens for DOM events and triggers a method in the component when the event occurs, using parentheses.

```html
<button (click)="onClick()">Click Me</button>
```
This binds the button’s click event to the onClick() method in your component.

**2. Two-Way Data Binding**
ngModel (Two-Way Binding):
Combines property and event binding in a single syntax using the banana-in-a-box notation ([( )]).

```html
<input [(ngModel)]="username" placeholder="Enter your name">
<p>Hello, {{ username }}!</p> 
```
When the input value changes, the username property is automatically updated (and vice versa).

Note: Two-way binding with ngModel requires that you import the FormsModule in your Angular module.

**3. Additional Binding Options**
Attribute Binding:
For binding to non-standard HTML attributes or ARIA attributes.

```html
<button [attr.aria-label]="actionLabel">Action</button> 
```
Class Binding:
Dynamically add or remove CSS classes using a binding expression.

```html
<div [class.active]="isActive">Content</div> 
```
Style Binding:
Bind to an inline style property.

```html
<div [style.background-color]="bgColor">Styled Box</div>
```

**How Data Binding Works in Angular**
Angular’s change detection mechanism ensures that when a component’s data changes, the view is automatically updated. For example:

When you update a property in your component, Angular runs change detection and re-evaluates any expressions in the template (e.g., in interpolation or property bindings).

In two-way binding, any user interaction that changes the view also updates the component property seamlessly.

This unidirectional data flow (and bidirectional flow with two-way binding) helps keep your application’s state consistent and your code easy to reason about.