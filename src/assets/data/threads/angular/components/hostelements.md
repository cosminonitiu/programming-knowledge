## Component host elements  
Angular creates an instance of a component for every HTML element that matches the component's selector. The DOM element that matches a component's selector is that component's host element. The contents of a component's template are rendered inside its host element.  
```typescript
// Component source
@Component({
  selector: 'profile-photo',
  template: `
    <img src="profile-photo.jpg" alt="Your profile photo" />
  `,
})
export class ProfilePhoto {}
```  
```typescript
<!-- Using the component -->
<h3>Your profile photo</h3>
<profile-photo />
<button>Upload a new profile photo</button>
```  
```typescript
<!-- Rendered DOM -->
<h3>Your profile photo</h3>
<profile-photo>
  <img src="profile-photo.jpg" alt="Your profile photo" />
</profile-photo>
<button>Upload a new profile photo</button>
```  
In the above example, <profile-photo> is the host element of the ProfilePhoto component.  
<br>

### Binding to the host element  
A component can bind properties, attributes, and events to its host element. This behaves identically to bindings on elements inside the component's template, but instead defined with the host property in the @Component decorator:  
```typescript
@Component({
  ...,
  host: {
    'role': 'slider',
    '[attr.aria-valuenow]': 'value',
    '[class.active]': 'isActive()',
    '[tabIndex]': 'disabled ? -1 : 0',
    '(keydown)': 'updateValue($event)',
  },
})
export class CustomSlider {
  value: number = 0;
  disabled: boolean = false;
  isActive = signal(false);
  updateValue(event: KeyboardEvent) { /* ... */ }
  /* ... */
}
```  
<br>

### The @HostBinding and @HostListener decorators  
You can alternatively bind to the host element by applying the @HostBinding and @HostListener decorator to class members.  
<br>

@HostBinding lets you bind host properties and attributes to properties and methods:  
```typescript
@Component({
  /* ... */
})
export class CustomSlider {
  @HostBinding('attr.aria-valuenow')
  value: number = 0;
  @HostBinding('tabIndex')
  getTabIndex() {
    return this.disabled ? -1 : 0;
  }
  /* ... */
}
```  
@HostListener lets you bind event listeners to the host element. The decorator accepts an event name and an optional array of arguments:  
```typescript
export class CustomSlider {
  @HostListener('keydown', ['$event'])
  updateValue(event: KeyboardEvent) {
    /* ... */
  }
}
```  
Always prefer using the host property over @HostBinding and @HostListener. These decorators exist exclusively for backwards compatibility.  
<br>

### Binding collisions  
When you use a component in a template, you can add bindings to that component instance's element. The component may also define host bindings for the same properties or attributes.  
```typescript
@Component({
  ...,
  host: {
    'role': 'presentation',
    '[id]': 'id',
  }
})
export class ProfilePhoto { /* ... */ }
```  

```typescript
<profile-photo role="group" [id]="otherId" />
```  
In cases like this, the following rules determine which value wins:  
<br>

If both values are static, the instance binding wins.  
If one value is static and the other dynamic, the dynamic value wins.  
If both values are dynamic, the component's host binding wins.  