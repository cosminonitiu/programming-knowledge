## Content projection with ng-content  
You often need to create components that act as containers for different types of content. For example, you may want to create a custom card component:  
```typescript
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
```  
You can use the <ng-content> element as a placeholder to mark where content should go:  
```typescript
@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content></ng-content> </div>',
})
export class CustomCard {/* ... */}
```  
When you use a component with <ng-content>, any children of the component host element are rendered, or projected, at the location of that <ng-content>:  
```typescript
// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
```  
```typescript
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
```  
```typescript
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
```  
Angular refers to any children of a component passed this way as that component's content. This is distinct from the component's view, which refers to the elements defined in the component's template.  
<br>

The <ng-content> element is neither a component nor DOM element. Instead, it is a special placeholder that tells Angular where to render content. Angular's compiler processes all <ng-content> elements at build-time. You cannot insert, remove, or modify <ng-content> at run time. You cannot add directives, styles, or arbitrary attributes to <ng-content>.  
<br>

You should not conditionally include <ng-content> with @if, @for, or @switch. Angular always instantiates and creates DOM nodes for content rendered to a <ng-content> placeholder, even if that <ng-content> placeholder is hidden. For conditional rendering of component content, see Template fragments.  
<br>

### Multiple content placeholders  
Angular supports projecting multiple different elements into different <ng-content> placeholders based on CSS selector. Expanding the card example from above, you could create two placeholders for a card title and a card body by using the select attribute:  
```typescript
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body"></ng-content>
</div>
```  
```typescript
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <card-body>Welcome to the example</card-body>
</custom-card>
```  
```typescript
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
```  
The <ng-content> placeholder supports the same CSS selectors as component selectors.  
<br>

If you include one or more <ng-content> placeholders with a select attribute and one <ng-content> placeholder without a select attribute, the latter captures all elements that did not match a select attribute:  
```typescript
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content></ng-content>
</div>
```  
```typescript
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
```  
```typescript
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
```  

In-depth Guides
Components
Content projection with ng-content
edit
Tip: This guide assumes you've already read the Essentials Guide. Read that first if you're new to Angular.

You often need to create components that act as containers for different types of content. For example, you may want to create a custom card component:

@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <!-- card content goes here --> </div>',
})
export class CustomCard {/* ... */}
check
You can use the <ng-content> element as a placeholder to mark where content should go:

@Component({
  selector: 'custom-card',
  template: '<div class="card-shadow"> <ng-content></ng-content> </div>',
})
export class CustomCard {/* ... */}
check
Tip: <ng-content> works similarly to the native <slot> element, but with some Angular-specific functionality.

When you use a component with <ng-content>, any children of the component host element are rendered, or projected, at the location of that <ng-content>:

// Component source
@Component({
  selector: 'custom-card',
  template: `
    <div class="card-shadow">
      <ng-content />
    </div>
  `,
})
export class CustomCard {/* ... */}
check
<!-- Using the component -->
<custom-card>
  <p>This is the projected content</p>
</custom-card>
check
<!-- The rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <p>This is the projected content</p>
  </div>
</custom-card>
check
Angular refers to any children of a component passed this way as that component's content. This is distinct from the component's view, which refers to the elements defined in the component's template.

The <ng-content> element is neither a component nor DOM element. Instead, it is a special placeholder that tells Angular where to render content. Angular's compiler processes all <ng-content> elements at build-time. You cannot insert, remove, or modify <ng-content> at run time. You cannot add directives, styles, or arbitrary attributes to <ng-content>.

You should not conditionally include <ng-content> with @if, @for, or @switch. Angular always instantiates and creates DOM nodes for content rendered to a <ng-content> placeholder, even if that <ng-content> placeholder is hidden. For conditional rendering of component content, see Template fragments.

On this page
Multiple content placeholders
Fallback content
Aliasing content for projection
Multiple content placeholders
Angular supports projecting multiple different elements into different <ng-content> placeholders based on CSS selector. Expanding the card example from above, you could create two placeholders for a card title and a card body by using the select attribute:

<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body"></ng-content>
</div>
check
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <card-body>Welcome to the example</card-body>
</custom-card>
check
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <card-body>Welcome to the example</card-body>
  </div>
</custom-card>
check
The <ng-content> placeholder supports the same CSS selectors as component selectors.

If you include one or more <ng-content> placeholders with a select attribute and one <ng-content> placeholder without a select attribute, the latter captures all elements that did not match a select attribute:

<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <!-- capture anything except "card-title" -->
  <ng-content></ng-content>
</div>
check
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <img src="..." />
  <p>Welcome to the example</p>
</custom-card>
check
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <card-title>Hello</card-title>
    <div class="card-divider"></div>
    <img src="..." />
    <p>Welcome to the example</p>
  </div>
</custom-card>
check
If a component does not include an <ng-content> placeholder without a select attribute, any elements that don't match one of the component's placeholders do not render into the DOM.  
<br>

### Fallback content  
Angular can show fallback content for a component's <ng-content> placeholder if that component doesn't have any matching child content. You can specify fallback content by adding child content to the <ng-content> element itself.  
```typescript
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title">Default Title</ng-content>
  <div class="card-divider"></div>
  <ng-content select="card-body">Default Body</ng-content>
</div>
```  
```typescript
<!-- Using the component -->
<custom-card>
  <card-title>Hello</card-title>
  <!-- No card-body provided -->
</custom-card>
```  
```typescript
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    Hello
    <div class="card-divider"></div>
    Default Body
  </div>
</custom-card>
```  
<br>

### Aliasing content for projection  
Angular supports a special attribute, ngProjectAs, that allows you to specify a CSS selector on any element. Whenever an element with ngProjectAs is checked against an <ng-content> placeholder, Angular compares against the ngProjectAs value instead of the element's identity:  
```typescript
<!-- Component template -->
<div class="card-shadow">
  <ng-content select="card-title"></ng-content>
  <div class="card-divider"></div>
  <ng-content></ng-content>
</div>
```  
```typescript
<!-- Using the component -->
<custom-card>
  <h3 ngProjectAs="card-title">Hello</h3>
  <p>Welcome to the example</p>
</custom-card>
```  
```typescript
<!-- Rendered DOM -->
<custom-card>
  <div class="card-shadow">
    <h3>Hello</h3>
    <div class="card-divider"></div>
    <p>Welcome to the example</p>
  </div>
</custom-card>
```  
ngProjectAs supports only static values and cannot be bound to dynamic expressions.