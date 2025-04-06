## Component selectors  
Every component defines a CSS selector that determines how the component is used:  
```typescript
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```  
You use a component by creating a matching HTML element in the templates of other components:  
```typescript
@Component({
  template: `
    <profile-photo />
    <button>Upload a new profile photo</button>`,
  ...,
})
export class UserProfile { }
```  
Angular matches selectors statically at compile-time. Changing the DOM at run-time, either via Angular bindings or with DOM APIs, does not affect the components rendered.  
<br>

An element can match exactly one component selector. If multiple component selectors match a single element, Angular reports an error.  
<br>

Component selectors are case-sensitive.  
<br>

### Types of selectors  
Angular supports a limited subset of basic CSS selector types in component selectors:  
<br>

```Selector type```	```Examples``` 

---  
```Type selector```	```profile-photo```  

---  
```Attribute selector``` ```[dropzone] [type="reset"]```  

---  
```Class selector```	```.menu-item```  
<br>

For attribute values, Angular supports matching an exact attribute value with the equals (=) operator. Angular does not support other attribute value operators.  
<br>

Angular component selectors do not support combinators, including the descendant combinator or child combinator.  
<br>

Angular component selectors do not support specifying namespaces.  
<br>

### The :not pseudo-class  
Angular supports the :not pseudo-class. You can append this pseudo-class to any other selector to narrow which elements a component's selector matches. For example, you could define a [dropzone] attribute selector and prevent matching textarea elements:  
```typescript
@Component({
  selector: '[dropzone]:not(textarea)',
  ...
})
export class DropZone { }
```  
Angular does not support any other pseudo-classes or pseudo-elements in component selectors.  
<br>

### Combining selectors  
You can combine multiple selectors by concatenating them. For example, you can match <button> elements that specify type="reset":  
```typescript
@Component({
  selector: 'button[type="reset"]',
  ...
})
export class ResetButton { }
```  
You can also define multiple selectors with a comma-separated list:  
```typescript
@Component({
  selector: 'drop-zone, [dropzone]',
  ...
})
export class DropZone { }
```  
Angular creates a component for each element that matches any of the selectors in the list.  
<br>

## Choosing a selector  
The vast majority of components should use a custom element name as their selector. All custom element names should include a hyphen as described by the HTML specification. By default, Angular reports an error if it encounters a custom tag name that does not match any available components, preventing bugs due to mistyped component names.  
<br>

See Advanced component configuration for details on using native custom elements in Angular templates.  
<br>

### Selector prefixes  
The Angular team recommends using a short, consistent prefix for all the custom components defined inside your project. For example, if you were to build YouTube with Angular, you might prefix your components with yt-, with components like yt-menu, yt-player, etc. Namespacing your selectors like this makes it immediately clear where a particular component comes from. By default, the Angular CLI uses app-.  
<br>

Angular uses the ng selector prefix for its own framework APIs. Never use ng as a selector prefix for your own custom components.  
<br>

### When to use an attribute selector  
You should consider an attribute selector when you want to create a component on a standard native element. For example, if you want to create a custom button component, you can take advantage of the standard <button> element by using an attribute selector:  
```typescript
@Component({
  selector: 'button[yt-upload]',
   ...
})
export class YouTubeUploadButton { }
```  
This approach allows consumers of the component to directly use all the element's standard APIs without extra work. This is especially valuable for ARIA attributes such as aria-label.  
<br>

Angular does not report errors when it encounters custom attributes that don't match an available component. When using components with attribute selectors, consumers may forget to import the component or its NgModule, resulting in the component not rendering.  
<br>

Components that define attribute selectors should use lowercase, dash-case attributes. You can follow the same prefixing recommendation described above.