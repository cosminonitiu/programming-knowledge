## Binding dynamic text, properties and attributes  
In Angular, a binding creates a dynamic connection between a component's template and its data. This connection ensures that changes to the component's data automatically update the rendered template.  
<br>

### Render dynamic text with text interpolation  
You can bind dynamic text in templates with double curly braces, which tells Angular that it is responsible for the expression inside and ensuring it is updated correctly. This is called text interpolation.  
```typescript
@Component({
  template: `
    <p>Your color preference is {{ theme }}.</p>
  `,
  ...
})
export class AppComponent {
  theme = 'dark';
}
```  
In this example, when the snippet is rendered to the page, Angular will replace {{ theme }} with dark.  
```typescript
<!-- Rendered Output -->
<p>Your color preference is dark.</p>
```  
In addition to evaluating the expression at first render, Angular also updates the rendered content when the expression's value changes.  
<br>

Continuing the theme example, if a user clicks on a button that changes the value of theme to 'light' after the page loads, the page updates accordingly to:  
```typescript
<!-- Rendered Output -->
<p>Your color preference is light.</p>
```  
You can use text interpolation anywhere you would normally write text in HTML.  
<br>

All expression values are converted to a string. Objects and arrays are converted using the value’s toString method.  
<br>

### Binding dynamic properties and attributes  
Angular supports binding dynamic values into object properties and HTML attributes with square brackets.  
You can bind to properties on an HTML element's DOM instance, a component instance, or a directive instance.  
<br>

### Native element properties  
Every HTML element has a corresponding DOM representation. For example, each <button> HTML element corresponds to an instance of HTMLButtonElement in the DOM. In Angular, you use property bindings to set values directly to the DOM representation of the element.  
```typescript
<!-- Bind the `disabled` property on the button element's DOM object -->
<button [disabled]="isFormValid">Save</button>
```  
In this example, every time isFormValid changes, Angular automatically sets the disabled property of the HTMLButtonElement instance.  
<br>

### Component and directive properties  
When an element is an Angular component, you can use property bindings to set component input properties using the same square bracket syntax.  
```typescript
<!-- Bind the `value` property on the `MyListbox` component instance. -->
<my-listbox [value]="mySelection" />
```  
In this example, every time mySelection changes, Angular automatically sets the value property of the MyListbox instance.  
You can bind to directive properties as well.  
```typescript
<!-- Bind to the `ngSrc` property of the `NgOptimizedImage` directive  -->
<img [ngSrc]="profilePhotoUrl" alt="The current user's profile photo">
```  
<br>

### Attributes  
When you need to set HTML attributes that do not have corresponding DOM properties, such as ARIA attributes or SVG attributes, you can bind attributes to elements in your template with the attr. prefix.  
```typescript
<!-- Bind the `role` attribute on the `<ul>` element to the component's `listRole` property. -->
<ul [attr.role]="listRole">
```  
In this example, every time listRole changes, Angular automatically sets the role attribute of the <ul> element by calling setAttribute.  
If the value of an attribute binding is null, Angular removes the attribute by calling removeAttribute.  
<br>

### Text interpolation in properties and attributes  
You can also use text interpolation syntax in properties and attributes by using the double curly brace syntax instead of square braces around the property or attribute name. When using this syntax, Angular treats the assignment as a property binding. 
```typescript
<!-- Binds a value to the `alt` property of the image element's DOM object. -->
<img src="profile-photo.jpg" alt="Profile photo of {{ firstName }}" >
```  
To bind to an attribute with the text interpolation syntax, prefix the attribute name with attr.  
```typescript
<button attr.aria-label="Save changes to {{ objectType }}">
```  
<br>

## CSS class and style property bindings  
Angular supports additional features for binding CSS classes and CSS style properties to elements.  
<br>

### CSS classes  
You can create a CSS class binding to conditionally add or remove a CSS class on an element based on whether the bound value is truthy or falsy.  
```typescript
<!-- When `isExpanded` is truthy, add the `expanded` CSS class. -->
<ul [class.expanded]="isExpanded">
```  
You can also bind directly to the class property. Angular accepts three types of value:  
```typescript
@Component({
  template: `
    <ul [class]="listClasses"> ... </ul>
    <section [class]="sectionClasses"> ... </section>
    <button [class]="buttonClasses"> ... </button>
  `,
  ...
})
export class UserProfile {
  listClasses = 'full-width outlined';
  sectionClasses = ['expandable', 'elevated'];
  buttonClasses = {
    highlighted: true,
    embiggened: false,
  };
}
```  
The above example renders the following DOM:  
```typescript
<ul class="full-width outlined"> ... </ul>
<section class="expandable elevated"> ... </section>
<button class="highlighted"> ... </button>
```  
Angular ignores any string values that are not valid CSS class names.  
When using static CSS classes, directly binding class, and binding specific classes, Angular intelligently combines all of the classes in the rendered result.  
```typescript
@Component({
  template: `<ul class="list" [class]="listType" [class.expanded]="isExpanded"> ...`,
  ...
})
export class Listbox {
  listType = 'box';
  isExpanded = true;
}
```  
In the example above, Angular renders the ul element with all three CSS classes.  
```typescript
<ul class="list box expanded">
```  
Angular does not guarantee any specific order of CSS classes on rendered elements.  
<br>

When binding class to an array or an object, Angular compares the previous value to the current value with the triple-equals operator (===). You must create a new object or array instance when you modify these values in order for Angular to apply any updates.  
<br>

If an element has multiple bindings for the same CSS class, Angular resolves collisions by following its style precedence order.  
<br>

### CSS style properties  
You can also bind to CSS style properties directly on an element.  
```typescript
<!-- Set the CSS `display` property based on the `isExpanded` property. -->
<section [style.display]="isExpanded ? 'block' : 'none'">
```  
You can further specify units for CSS properties that accept units.  
```typescript
<!-- Set the CSS `height` property to a pixel value based on the `sectionHeightInPixels` property. -->
<section [style.height.px]="sectionHeightInPixels">
```  
You can also set multiple style values in one binding. Angular accepts the following types of value:  
```typescript
@Component({
  template: `
    <ul [style]="listStyles"> ... </ul>
    <section [style]="sectionStyles"> ... </section>
  `,
  ...
})
export class UserProfile {
  listStyles = 'display: flex; padding: 8px';
  sectionStyles = {
    border: '1px solid black',
    'font-weight': 'bold',
  };
}
```  
The above example renders the following DOM.  
```typescript
<ul style="display: flex; padding: 8px"> ... </ul>
<section style="border: 1px solid black; font-weight: bold"> ... </section>
```  
When binding style to an object, Angular compares the previous value to the current value with the triple-equals operator (===). You must create a new object instance when you modify these values in order to Angular to apply any updates.  
If an element has multiple bindings for the same style property, Angular resolves collisions by following its style precedence order.