## Adding event listeners  
Angular supports defining event listeners on an element in your template by specifying the event name inside parentheses along with a statement that runs every time the event occurs.  
<br>

### Listening to native events  
When you want to add event listeners to an HTML element, you wrap the event with parentheses, (), which allows you to specify a listener statement.  
```typescript
@Component({
  template: `
    <input type="text" (keyup)="updateField()" />
  `,
  ...
})
export class AppComponent{
  updateField(): void {
    console.log('Field is updated!');
  }
}
```  
In this example, Angular calls updateField every time the <input> element emits a keyup event.  
<br>

You can add listeners for any native events, such as: click, keydown, mouseover, etc. To learn more, check out the all available events on elements on MDN.  
<br>

### Accessing the event argument  
In every template event listener, Angular provides a variable named $event that contains a reference to the event object.  
```typescript
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    console.log(`The user pressed: ${event.key}`);
  }
}
```  
<br>

### Using key modifiers  
When you want to capture specific keyboard events for a specific key, you might write some code like the following:  
```typescript
@Component({
  template: `
    <input type="text" (keyup)="updateField($event)" />
  `,
  ...
})
export class AppComponent {
  updateField(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
      console.log('The user pressed enter in the text field.');
    }
  }
}
```  
However, since this is a common scenario, Angular lets you filter the events by specifying a specific key using the period (.) character. By doing so, code can be simplified to:  
```typescript
@Component({
  template: `
    <input type="text" (keyup.enter)="updateField($event)" />
  `,
  ...
})
export class AppComponent{
  updateField(event: KeyboardEvent): void {
    console.log('The user pressed enter in the text field.');
  }
}
```  
You can also add additional key modifiers:  
```typescript
<!-- Matches shift and enter -->
<input type="text" (keyup.shift.enter)="updateField($event)" />
```  
Angular supports the modifiers alt, control, meta, and shift.  
<br>

You can specify the key or code that you would like to bind to keyboard events. The key and code fields are a native part of the browser keyboard event object. By default, event binding assumes you want to use the Key values for keyboard events.  
<br>

Angular also allows you to specify Code values for keyboard events by providing a built-in code suffix.  
```typescript
<!-- Matches alt and left shift -->
<input type="text" (keydown.code.alt.shiftleft)="updateField($event)" />
```  
This can be useful for handling keyboard events consistently across different operating systems. For example, when using the Alt key on MacOS devices, the key property reports the key based on the character already modified by the Alt key. This means that a combination like Alt + S reports a key value of 'ß'. The code property, however, corresponds to the physical or virtual button pressed rather than the character produced.