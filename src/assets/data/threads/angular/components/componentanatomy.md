## Anatomy of a component  
Every component must have:  
&nbsp;&nbsp;- A TypeScript class with behaviors such as handling user input and fetching data from a server  
&nbsp;&nbsp;- An HTML template that controls what renders into the DOM  
&nbsp;&nbsp;- A CSS selector that defines how the component is used in HTML  
<br>

You provide Angular-specific information for a component by adding a @Component <a target="_blank" href="https://www.typescriptlang.org/docs/handbook/decorators.html" alt="Decorator Handbook">decorator</a> on top of the TypeScript class:  
```typescript
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
})
export class ProfilePhoto { }
```  
For full details on writing Angular templates, including data binding, event handling, and control flow, see the Templates guide.  
<br>

The object passed to the @Component decorator is called the component's metadata. This includes the selector, template, and other properties described throughout this guide.  
<br>

Components can optionally include a list of CSS styles that apply to that component's DOM:  
```typescript
@Component({
  selector: 'profile-photo',
  template: `<img src="profile-photo.jpg" alt="Your profile photo">`,
  styles: `img { border-radius: 50%; }`,
})
export class ProfilePhoto { }
```  
By default, a component's styles only affect elements defined in that component's template. See Styling Components for details on Angular's approach to styling.  
<br>

Both templateUrl and styleUrl are relative to the directory in which the component resides.  
<br>

## Using components  
### Imports in the @Component decorator  
To use a component, directive, or pipe, you must add it to the imports array in the @Component decorator:  
```typescript
import {ProfilePhoto} from './profile-photo';
@Component({
  // Import the `ProfilePhoto` component in
  // order to use it in this component's template.
  imports: [ProfilePhoto],
  /* ... */
})
export class UserProfile { }
```  
By default, Angular components are standalone, meaning that you can directly add them to the imports array of other components. Components created with an earlier version of Angular may instead specify standalone: false in their @Component decorator. For these components, you instead import the NgModule in which the component is defined. See the full NgModule guide for details.  
<br>

Important: In Angular versions before 19.0.0, the standalone option defaults to false.  
<br>

### Showing components in a template  
Every component defines a CSS selector:  
```typescript
@Component({
  selector: 'profile-photo',
  ...
})
export class ProfilePhoto { }
```  
See Component Selectors for details about which types of selectors Angular supports and guidance on choosing a selector.  
<br>

You show a component by creating a matching HTML element in the template of other components:  
<br>

```typescript
@Component({
  selector: 'profile-photo',
})
export class ProfilePhoto { }
@Component({
  imports: [ProfilePhoto],
  template: `<profile-photo />`
})
export class UserProfile { }
```  
Angular creates an instance of the component for every matching HTML element it encounters. The DOM element that matches a component's selector is referred to as that component's host element. The contents of a component's template are rendered inside its host element.  
<br>

The DOM rendered by a component, corresponding to that component's template, is called that component's view.