## Using DOM APIs  
Angular handles most DOM creation, updates, and removals for you. However, you might rarely need to directly interact with a component's DOM. Components can inject ElementRef to get a reference to the component's host element:  
```typescript
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    console.log(elementRef.nativeElement);
  }
}
```  
The nativeElement property references the host <a target="_blank" alt="Web Element" href="https://developer.mozilla.org/en-US/docs/Web/API/Element">Element</a> instance.  
<br>

You can use Angular's afterRender and afterNextRender functions to register a render callback that runs when Angular has finished rendering the page.  
```typescript
@Component({...})
export class ProfilePhoto {
  constructor() {
    const elementRef = inject(ElementRef);
    afterRender(() => {
      // Focus the first input element in this component.
      elementRef.nativeElement.querySelector('input')?.focus();
    });
  }
}
```  
afterRender and afterNextRender must be called in an injection context, typically a component's constructor.  
<br>

Avoid direct DOM manipulation whenever possible. Always prefer expressing your DOM's structure in component templates and updating that DOM with bindings.  
<br>

Render callbacks never run during server-side rendering or build-time pre-rendering.  
<br>

Never directly manipulate the DOM inside of other Angular lifecycle hooks. Angular does not guarantee that a component's DOM is fully rendered at any point other than in render callbacks. Further, reading or modifying the DOM during other lifecycle hooks can negatively impact page performance by causing <a target="_blank" alt="Layout trashing" href="https://web.dev/articles/avoid-large-complex-layouts-and-layout-thrashing">layout thrashing</a>.  
<br>

### Using a component's renderer  
Components can inject an instance of Renderer2 to perform certain DOM manipulations that are tied to other Angular features.  
<br>

Any DOM elements created by a component's Renderer2 participate in that component's style encapsulation.  
<br>

Certain Renderer2 APIs also tie into Angular's animation system. You can use the setProperty method to update synthetic animation properties and the listen method to add event listeners for synthetic animation events. See the Animations guide for details.  
<br>

Aside from these two narrow use-cases, there is no difference between using Renderer2 and native DOM APIs. Renderer2 APIs do not support DOM manipulation in server-side rendering or build-time pre-rendering contexts.  
<br>

### When to use DOM APIs  
When to use DOM APIs
While Angular handles most rendering concerns, some behaviors may still require using DOM APIs. Some common use cases include:  
&nbsp;&nbsp;1. Managing element focus  
&nbsp;&nbsp;2. Measuring element geometry, such as with getBoundingClientRect  
&nbsp;&nbsp;3. Reading an element's text content  
&nbsp;&nbsp;4. Setting up native observers such as MutationObserver, ResizeObserver, or IntersectionObserver.  
<br>

Avoid inserting, removing, and modifying DOM elements. In particular, never directly set an element's innerHTML property, which can make your application vulnerable to cross-site scripting (XSS) exploits. Angular's template bindings, including bindings for innerHTML, include safeguards that help protect against XSS attacks. See the Security guide for details.