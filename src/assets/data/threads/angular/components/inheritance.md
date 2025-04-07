## Inheritance  
Angular components are TypeScript classes and participate in standard JavaScript inheritance semantics.  
A component can extend any base class:  
```typescript
export class ListboxBase {
  value: string;
}
@Component({ ... })
export class CustomListbox extends ListboxBase {
  // CustomListbox inherits the `value` property.
}
```  
<br>

### Extending other components and directives  
When a component extends another component or a directive, it inherits some of the metadata defined in the base class's decorator and the base class's decorated members. This includes host bindings, inputs, outputs, lifecycle methods.  
```typescript
@Component({
  selector: 'base-listbox',
  template: `
    ...
  `,
  host: {
    '(keydown)': 'handleKey($event)',
  },
})
export class ListboxBase {
  @Input() value: string;
  handleKey(event: KeyboardEvent) {
    /* ... */
  }
}
@Component({
  selector: 'custom-listbox',
  template: `
    ...
  `,
  host: {
    '(click)': 'focusActiveOption()',
  },
})
export class CustomListbox extends ListboxBase {
  @Input() disabled = false;
  focusActiveOption() {
    /* ... */
  }
}
```  
In the example above, CustomListbox inherits all the information associated with ListboxBase, overriding the selector and template with its own values. CustomListbox has two inputs (value and disabled) and two event listeners (keydown and click).  
<br>

Child classes end up with the union of all of their ancestors' inputs, outputs, and host bindings and their own.  
<br>

### Forwarding injected dependencies  
If a base class injects dependencies as constructor parameters, the child class must explicitly class these dependencies to super.  
```typescript
@Component({ ... })
export class ListboxBase {
  constructor(private element: ElementRef) { }
}
@Component({ ... })
export class CustomListbox extends ListboxBase {
  constructor(element: ElementRef) {
    super(element);
  }
}
```  
<br>

### Overriding lifecycle methods  
If a base class defines a lifecycle method, such as ngOnInit, a child class that also implements ngOnInit overrides the base class's implementation. If you want to preserve the base class's lifecycle method, explicitly call the method with super:  
```typescript
@Component({ ... })
export class ListboxBase {
  protected isInitialized = false;
  ngOnInit() {
    this.isInitialized = true;
  }
}
@Component({ ... })
export class CustomListbox extends ListboxBase {
  override ngOnInit() {
    super.ngOnInit();
    /* ... */
  }
}
```  