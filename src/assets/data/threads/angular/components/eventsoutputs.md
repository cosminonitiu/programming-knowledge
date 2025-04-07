## Custom events with outputs  
Angular components can define custom events by assigning a property to the output function:  
```typescript
@Component({/*...*/})
export class ExpandablePanel {
  panelClosed = output<void>();
}
```  
```typescript
<expandable-panel (panelClosed)="savePanelState()" />
```  
The output function returns an OutputEmitterRef. You can emit an event by calling the emit method on the OutputEmitterRef:  
```typescript
this.panelClosed.emit();
```  
Angular refers to properties initialized with the output function as outputs. You can use outputs to raise custom events, similar to native browser events like click.  
<br>

Angular custom events do not bubble up the DOM.  
Output names are case-sensitive.  
When extending a component class, outputs are inherited by the child class.  
The output function has special meaning to the Angular compiler. You can exclusively call output in component and directive property initializers.  
<br>

### Emitting event data  
You can pass event data when calling emit:  
```typescript
// You can emit primitive values.
this.valueChanged.emit(7);
// You can emit custom event objects
this.thumbDropped.emit({
  pointerX: 123,
  pointerY: 456,
})
```  
When defining an event listener in a template, you can access the event data from the $event variable:  
```typescript
<custom-slider (valueChanged)="logValue($event)" />
```  
<br>

### Customizing output names  
The output function accepts a parameter that lets you specify a different name for the event in a template:
```typescript
@Component({/*...*/})
export class CustomSlider {
  changed = output({alias: 'valueChanged'});
}
```  
```typescript
<custom-slider (valueChanged)="saveVolume()" />
```  
This alias does not affect usage of the property in TypeScript code.  
<br>

While you should generally avoid aliasing outputs for components, this feature can be useful for renaming properties while preserving an alias for the original name or for avoiding collisions with the name of native DOM events.  
<br>

### Subscribing to outputs programmatically  
When creating a component dynamically, you can programmatically subscribe to output events from the component instance. The OutputRef type includes a subscribe method:  
```typescript
const someComponentRef: ComponentRef<SomeComponent> = viewContainerRef.createComponent(/*...*/);
someComponentRef.instance.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});
```  
Angular automatically cleans up event subscriptions when it destroys components with subscribers. Alternatively, you can manually unsubscribe from an event. The subscribe function returns an OutputRefSubscription with an unsubscribe method:  
```typescript
const eventSubscription = someComponent.someEventProperty.subscribe(eventData => {
  console.log(eventData);
});
// ...
eventSubscription.unsubscribe();
```  
<br>

### Choosing event names  
Avoid choosing output names that collide with events on DOM elements like HTMLElement. Name collisions introduce confusion about whether the bound property belongs to the component or the DOM element.  
Avoid adding prefixes for component outputs like you would with component selectors. Since a given element can only host one component, any custom properties can be assumed to belong to the component.  
Always use camelCase output names. Avoid prefixing output names with "on".  
<br>

### Using outputs with RxJS
See RxJS interop with component and directive outputs for details on interoperability between outputs and RxJS.  
<br>

### Declaring outputs with the @Output decorator  
You can alternatively define custom events by assigning a property to a new EventEmitter and adding the @Output decorator:  
```typescript
@Component({/*...*/})
export class ExpandablePanel {
  @Output() panelClosed = new EventEmitter<void>();
}
```  
You can emit an event by calling the emit method on the EventEmitter.  
<br>

### Aliases with the @Output decorator  
The @Output decorator accepts a parameter that lets you specify a different name for the event in a template:  
```typescript
@Component({/*...*/})
export class CustomSlider {
  @Output('valueChanged') changed = new EventEmitter<number>();
}
```  
```typescript
<custom-slider (valueChanged)="saveVolume()" />
```  
This alias does not affect usage of the property in TypeScript code.  
<br>

### Specify outputs in the @Component decorator  
In addition to the @Output decorator, you can also specify a component's outputs with the outputs property in the @Component decorator. This can be useful when a component inherits a property from a base class:  
```typescript
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged'],
})
export class CustomSlider extends BaseSlider {}
```  
You can additionally specify an output alias in the outputs list by putting the alias after a colon in the string:  
```typescript
// `CustomSlider` inherits the `valueChanged` property from `BaseSlider`.
@Component({
  /*...*/
  outputs: ['valueChanged: volumeChanged'],
})
export class CustomSlider extends BaseSlider {}
```  