## Styling components  
Components can optionally include CSS styles that apply to that component's DOM:  
```typescript
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: ` img { border-radius: 50%; } `,
})
export class ProfilePhoto { }
```  
You can also choose to write your styles in separate files:  
```typescript
@Component({
  selector: 'profile-photo',
  templateUrl: 'profile-photo.html',
  styleUrl: 'profile-photo.css',
})
export class ProfilePhoto { }
```  
When Angular compiles your component, these styles are emitted with your component's JavaScript output. This means that component styles participate in the JavaScript module system. When you render an Angular component, the framework automatically includes its associated styles, even when lazy-loading a component.  
<br>

Angular works with any tool that outputs CSS, including Sass, less, and stylus.  
<br>

## Style scoping  
Every component has a view encapsulation setting that determines how the framework scopes a component's styles. There are three view encapsulation modes: ```Emulated```, ```ShadowDom```, and ```None```. You can specify the mode in the ```@Component``` decorator:
```typescript
@Component({
  ...,
  encapsulation: ViewEncapsulation.None,
})
export class ProfilePhoto { }
```  
<br>

### ViewEncapsulation.Emulated  
By default, Angular uses emulated encapsulation so that a component's styles only apply to elements defined in that component's template. In this mode, the framework generates a unique HTML attribute for each component instance, adds that attribute to elements in the component's template, and inserts that attribute into the CSS selectors defined in your component's styles.  
<br>

This mode ensures that a component's styles do not leak out and affect other components. However, global styles defined outside of a component may still affect elements inside a component with emulated encapsulation.  
<br>

In emulated mode, Angular supports the ```:host``` and ```:host-context()``` pseudo classes without using <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_shadow_DOM" alt="Shadow DOM">Shadow DOM</a>. During compilation, the framework transforms these pseudo classes into attributes so it doesn't comply with these native pseudo classes' rules at runtime (e.g. browser compatibility, specificity). Angular's emulated encapsulation mode does not support any other pseudo classes related to Shadow DOM, such as ```::shadow``` or ```::part```.  
<br>

### ::ng-deep  
Angular's emulated encapsulation mode supports a custom pseudo class, ```::ng-deep```. Applying this pseudo class to a CSS rule disables encapsulation for that rule, effectively turning it into a global style. The Angular team strongly discourages new use of ```::ng-deep```. These APIs remain exclusively for backwards compatibility.  
<br>

### ViewEncapsulation.ShadowDom  
This mode scopes styles within a component by using the web standard Shadow DOM API. When enabling this mode, Angular attaches a shadow root to the component's host element and renders the component's template and styles into the corresponding shadow tree.  
<br>

This mode strictly guarantees that only that component's styles apply to elements in the component's template. Global styles cannot affect elements in a shadow tree and styles inside the shadow tree cannot affect elements outside of that shadow tree.  
<br>

Enabling ```ShadowDom``` encapsulation, however, impacts more than style scoping. Rendering the component in a shadow tree affects event propagation, interaction with the <a target="_blank" href="https://developer.mozilla.org/en-US/docs/Web/API/Web_components/Using_templates_and_slots" alt="Slot API">slot API</a>, and how browser developer tools show elements. Always understand the full implications of using Shadow DOM in your application before enabling this option.  
<br>

### ViewEncapsulation.None
This mode disables all style encapsulation for the component. Any styles associated with the component behave as global styles.