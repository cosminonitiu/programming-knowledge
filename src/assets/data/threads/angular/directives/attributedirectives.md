## Attribute directives  
Change the appearance or behavior of DOM elements and Angular components with attribute directives.  
<br>

## Building an attribute directive  
This section walks you through creating a highlight directive that sets the background color of the host element to yellow.  
<br>

To create a directive, use the CLI command ng generate directive.  
```typescript
ng generate directive highlight
```  
The CLI creates src/app/highlight.directive.ts, a corresponding test file src/app/highlight.directive.spec.ts.  
```typescript
import {Directive} from '@angular/core';
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {}
```  
The @Directive() decorator's configuration property specifies the directive's CSS attribute selector, [appHighlight].  

Import ElementRef from @angular/core. ElementRef grants direct access to the host DOM element through its nativeElement property.  

Add ElementRef in the directive's constructor() to inject a reference to the host DOM element, the element to which you apply appHighlight.  

Add logic to the HighlightDirective class that sets the background to yellow.  
```typescript
import {Directive, ElementRef, inject} from '@angular/core';
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef);
  constructor() {
    this.el.nativeElement.style.backgroundColor = 'yellow';
  }
}
```  
```typescript
<p app:Highlight>This is invalid</p>
```  
<br>

### Applying an attribute directive  
To use the HighlightDirective, add a <p> element to the HTML template with the directive as an attribute.  
```typescript
<p appHighlight>Highlight me!</p>
```  
Angular creates an instance of the HighlightDirective class and injects a reference to the <p> element into the directive's constructor, which sets the <p> element's background style to yellow.  
<br>

### Handling user events  
This section shows you how to detect when a user mouses into or out of the element and to respond by setting or clearing the highlight color.  
Import HostListener from '@angular/core'.  
```typescript
import {Directive, ElementRef, HostListener, inject} from '@angular/core';
```  
Add two event handlers that respond when the mouse enters or leaves, each with the @HostListener() decorator.  
```typescript
@HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
```  
Subscribe to events of the DOM element that hosts an attribute directive, the <p> in this case, with the @HostListener() decorator.  
```typescript
import {Directive, ElementRef, HostListener, inject} from '@angular/core';
@Directive({
  selector: '[appHighlight]',
})
export class HighlightDirective {
  private el = inject(ElementRef);
  @HostListener('mouseenter') onMouseEnter() {
    this.highlight('yellow');
  }
  @HostListener('mouseleave') onMouseLeave() {
    this.highlight('');
  }
  private highlight(color: string) {
    this.el.nativeElement.style.backgroundColor = color;
  }
}
```  
The background color appears when the pointer hovers over the paragraph element and disappears as the pointer moves out.  
<br>

### Passing values into an attribute directive  
This section walks you through setting the highlight color while applying the HighlightDirective.  
In highlight.directive.ts, import Input from @angular/core.  
```typescript
import {Directive, ElementRef, HostListener, inject, Input} from '@angular/core';
```  
Add an appHighlight @Input() property.  
```typescript
@Input() appHighlight = '';
```  
The @Input() decorator adds metadata to the class that makes the directive's appHighlight property available for binding.  
In app.component.ts, add a color property to the AppComponent.  
```typescript
export class AppComponent {
  color = 'yellow';
}
```  
To simultaneously apply the directive and the color, use property binding with the appHighlight directive selector, setting it equal to color.  
```typescript
<p [appHighlight]="color">Highlight me!</p>
```  
The [appHighlight] attribute binding performs two tasks:  
<br>

Applies the highlighting directive to the <p> element  
Sets the directive's highlight color with a property binding  
<br>

### Setting the value with user input  
This section guides you through adding radio buttons to bind your color choice to the appHighlight directive.  
Add markup to app.component.html for choosing a color as follows:  
```typescript
<h1>My First Attribute Directive</h1>
<h2>Pick a highlight color</h2>
<div>
  <input type="radio" name="colors" (click)="color='lightgreen'">Green
  <input type="radio" name="colors" (click)="color='yellow'">Yellow
  <input type="radio" name="colors" (click)="color='cyan'">Cyan
</div>
<p [appHighlight]="color">Highlight me!</p>
```  
Revise the AppComponent.color so that it has no initial value.  
```typescript
export class AppComponent {
  color = '';
}
```  
In highlight.directive.ts, revise onMouseEnter method so that it first tries to highlight with appHighlight and falls back to red if appHighlight is undefined.  
```typescript
@HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || 'red');
  }
```  
Serve your application to verify that the user can choose the color with the radio buttons.  
<br>

### Binding to a second property  
This section guides you through configuring your application so the developer can set the default color.  
Add a second Input() property to HighlightDirective called defaultColor.  
```typescript
@Input() defaultColor = '';
```  
Revise the directive's onMouseEnter so that it first tries to highlight with the appHighlight, then with the defaultColor, and falls back to red if both properties are undefined.  
```typescript
@HostListener('mouseenter') onMouseEnter() {
    this.highlight(this.appHighlight || this.defaultColor || 'red');
  }
```  
To bind to the AppComponent.color and fall back to "violet" as the default color, add the following HTML. In this case, the defaultColor binding doesn't use square brackets, [], because it is static.  
```typescript
<p [appHighlight]="color" defaultColor="violet">
  Highlight me too!
</p>
```  
As with components, you can add multiple directive property bindings to a host element.  
The default color is red if there is no default color binding. When the user chooses a color the selected color becomes the active highlight color.  
<br>

## Deactivating Angular processing with NgNonBindable  
To prevent expression evaluation in the browser, add ngNonBindable to the host element. ngNonBindable deactivates interpolation, directives, and binding in templates.  
<br>

In the following example, the expression {{ 1 + 1 }} renders just as it does in your code editor, and does not display 2.  
```typescript
<p>Use ngNonBindable to stop evaluation.</p>
<p ngNonBindable>This should not evaluate: {{ 1 + 1 }}</p>
```  
Applying ngNonBindable to an element stops binding for that element's child elements. However, ngNonBindable still lets directives work on the element where you apply ngNonBindable. In the following example, the appHighlight directive is still active but Angular does not evaluate the expression {{ 1 + 1 }}.  
```typescript
<h3>ngNonBindable with a directive</h3>
<div ngNonBindable [appHighlight]="'yellow'">This should not evaluate: {{ 1 +1 }}, but will highlight yellow.
</div>
```  
If you apply ngNonBindable to a parent element, Angular disables interpolation and binding of any sort, such as property binding or event binding, for the element's children.