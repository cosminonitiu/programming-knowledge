## Built-in directives  
### Built-in attribute directives  
Attribute directives listen to and modify the behavior of other HTML elements, attributes, properties, and components.  
<br>

```Common directives```	```Details```  
```NgClass```	Adds and removes a set of CSS classes.  
```NgStyle```	Adds and removes a set of HTML styles.  
```NgModel```	Adds two-way data binding to an HTML form element.  
<br>

### Adding and removing classes with NgClass  
Add or remove multiple CSS classes simultaneously with ngClass.  
```typescript
import {NgClass} from '@angular/common';
...
@Component({
...
    NgClass, // <-- import into the component
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
<br>

### Using NgClass with an expression  
On the element you'd like to style, add [ngClass] and set it equal to an expression. In this case, isSpecial is a boolean set to true in app.component.ts. Because isSpecial is true, ngClass applies the class of special to the <div>.  
```typescript
<!-- toggle the "special" class on/off with a property -->
<div [ngClass]="isSpecial ? 'special' : ''">This div is special</div>
```  
<br>

### Using NgClass with a method  
To use NgClass with a method, add the method to the component class. In the following example, setCurrentClasses() sets the property currentClasses with an object that adds or removes three classes based on the true or false state of three other component properties.  
Each key of the object is a CSS class name. If a key is true, ngClass adds the class. If a key is false, ngClass removes the class.  
```typescript
currentClasses: Record<string, boolean> = {};
...
  setCurrentClasses() {
    // CSS classes: added/removed per current state of component properties
    this.currentClasses = {
      saveable: this.canSave,
      modified: !this.isUnchanged,
      special: this.isSpecial,
    };
  }
```  
In the template, add the ngClass property binding to currentClasses to set the element's classes:  
```typescript
<div [ngClass]="currentClasses">This div is initially saveable, unchanged, and special.</div>
```  
For this use case, Angular applies the classes on initialization and in case of changes caused by reassigning the currentClasses object. The full example calls setCurrentClasses() initially with ngOnInit() when the user clicks on the Refresh currentClasses button. These steps are not necessary to implement ngClass.  
<br>

## Setting inline styles with NgStyle  
```typescript
import {NgStyle} from '@angular/common';
...
@Component({
...
    NgStyle, // <-- import into the component
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
Use NgStyle to set multiple inline styles simultaneously, based on the state of the component.  
<br>

To use NgStyle, add a method to the component class.  
In the following example, setCurrentStyles() sets the property currentStyles with an object that defines three styles, based on the state of three other component properties.  
```typescript
currentStyles: Record<string, string> = {};
...
  setCurrentStyles() {
    // CSS styles: set per current state of component properties
    this.currentStyles = {
      'font-style': this.canSave ? 'italic' : 'normal',
      'font-weight': !this.isUnchanged ? 'bold' : 'normal',
      'font-size': this.isSpecial ? '24px' : '12px',
    };
  }
```  
To set the element's styles, add an ngStyle property binding to currentStyles.  
```typescript
<div [ngStyle]="currentStyles">
  This div is initially italic, normal weight, and extra large (24px).
</div>
```  
For this use case, Angular applies the styles upon initialization and in case of changes. To do this, the full example calls setCurrentStyles() initially with ngOnInit() and when the dependent properties change through a button click. However, these steps are not necessary to implement ngStyle on its own.  
<br>

## Displaying and updating properties with ngModel  
Use the NgModel directive to display a data property and update that property when the user makes changes.  
Import FormsModule and add it to the AppComponent's imports list.  
```typescript
import {FormsModule} from '@angular/forms';
...
@Component({
...
    FormsModule, // <--- import into the component
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
Add an [(ngModel)] binding on an HTML <form> element and set it equal to the property, here name.  
```typescript
<label for="example-ngModel">[(ngModel)]:</label>
    <input [(ngModel)]="currentItem.name" id="example-ngModel">
```  
This [(ngModel)] syntax can only set a data-bound property.  
<br>

 customize your configuration, write the expanded form, which separates the property and event binding. Use property binding to set the property and event binding to respond to changes. The following example changes the <input> value to uppercase:  
```typescript
<input [ngModel]="currentItem.name" (ngModelChange)="setUppercaseName($event)" id="example-uppercase">
```  
<br>

### NgModel and value accessors  
The NgModel directive works for an element supported by a ControlValueAccessor. Angular provides value accessors for all of the basic HTML form elements. For more information, see Forms.  
<br>

To apply [(ngModel)] to a non-form built-in element or a third-party custom component, you have to write a value accessor. For more information, see the API documentation on DefaultValueAccessor.  
<br>

### Built-in structural directives  
Structural directives are responsible for HTML layout. They shape or reshape the DOM's structure, typically by adding, removing, and manipulating the host elements to which they are attached.  
This section introduces the most common built-in structural directives:  
<br>

```Common built-in structural directives```	```Details```  
```NgIf```	Conditionally creates or disposes of subviews from the template.  
```NgFor```	Repeat a node for each item in a list.  
```NgSwitch```	A set of directives that switch among alternative views.  
<br>

## Adding or removing an element with NgIf  
When NgIf is false, Angular removes an element and its descendants from the DOM. Angular then disposes of their components, which frees up memory and resources.  
```typescript
import {NgIf} from '@angular/common';
...
@Component({
...
    NgIf, // <-- import into the component
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
To add or remove an element, bind *ngIf to a condition expression such as isActive in the following example.  
```typescript
<app-item-detail *ngIf="isActive" [item]="item"></app-item-detail>
```  
When the isActive expression returns a truthy value, NgIf adds the ItemDetailComponent to the DOM. When the expression is falsy, NgIf removes the ItemDetailComponent from the DOM and disposes of the component and all of its subcomponents.  
<br>

### Guarding against null  
By default, NgIf prevents display of an element bound to a null value.  
To use NgIf to guard a <div>, add *ngIf="yourProperty" to the <div>. In the following example, the currentCustomer name appears because there is a currentCustomer.  
```typescript
<div *ngIf="currentCustomer">Hello, {{ currentCustomer.name }}</div>
```  
However, if the property is null, Angular does not display the <div>. In this example, Angular does not display the nullCustomer because it is null.  
```typescript
<div *ngIf="nullCustomer">Hello, <span>{{ nullCustomer }}</span></div>
```  
<br>

## Listing items with NgFor
```typescript
import {NgFor} from '@angular/common';
...
@Component({
...
    NgFor, // <-- import into the component
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
To use NgFor, you have to:  
<br>

Define a block of HTML that determines how Angular renders a single item.  
To list your items, assign the shorthand let item of items to *ngFor.  
```typescript
<div *ngFor="let item of items">{{ item.name }}</div>
```  
The string "let item of items" instructs Angular to do the following:  
<br>

Store each item in the items array in the local item looping variable  
Make each item available to the templated HTML for each iteration  
Translate "let item of items" into an <ng-template> around the host element  
Repeat the <ng-template> for each item in the list  
<br>

### Repeating a component view  
To repeat a component element, apply *ngFor to the selector. In the following example, the selector is <app-item-detail>.  
```typescript
<app-item-detail *ngFor="let item of items" [item]="item"></app-item-detail>
```  
Reference a template input variable, such as item, in the following locations:  
<br>

Within the ngFor host element  
Within the host element descendants to access the item's properties  
<br>

The following example references item first in an interpolation and then passes in a binding to the item property of the <app-item-detail> component.  
```typescript
<div *ngFor="let item of items">{{ item.name }}</div>
...
  <app-item-detail *ngFor="let item of items" [item]="item"></app-item-detail>
```  
<br>

### Getting the index of *ngFor  
Get the index of *ngFor in a template input variable and use it in the template.  
In the *ngFor, add a semicolon and let i=index to the shorthand. The following example gets the index in a variable named i and displays it with the item name.  
```typescript
<div *ngFor="let item of items; let i=index">{{ i + 1 }} - {{ item.name }}</div>
```  
The index property of the NgFor directive context returns the zero-based index of the item in each iteration.  
Angular translates this instruction into an <ng-template> around the host element, then uses this template repeatedly to create a new set of elements and bindings for each item in the list.   
<br>

### Repeating elements when a condition is true  
To repeat a block of HTML when a particular condition is true, put the *ngIf on a container element that wraps an *ngFor element.  
<br>

### Tracking items with *ngFor trackBy  
Reduce the number of calls your application makes to the server by tracking changes to an item list. With the *ngFor trackBy property, Angular can change and re-render only those items that have changed, rather than reloading the entire list of items.  
<br>

Add a method to the component that returns the value NgFor should track. In this example, the value to track is the item's id. If the browser has already rendered id, Angular keeps track of it and doesn't re-query the server for the same id.  
```typescript
trackByItems(index: number, item: Item): number {
    return item.id;
  }
```  
In the shorthand expression, set trackBy to the trackByItems() method.  
```typescript
<div *ngFor="let item of items; trackBy: trackByItems">
    ({{ item.id }}) {{ item.name }}
  </div>
```  
Change ids creates new items with new item.ids. In the following illustration of the trackBy effect, Reset items creates new items with the same item.ids.  
<br>

With no trackBy, both buttons trigger complete DOM element replacement.  
With trackBy, only changing the id triggers element replacement.  
<br>

## Hosting a directive without a DOM element  
The Angular <ng-container> is a grouping element that doesn't interfere with styles or layout because Angular doesn't put it in the DOM.  
Use <ng-container> when there's no single element to host the directive.  
Here's a conditional paragraph using <ng-container>.  
```typescript
<p>
  I turned the corner
  <ng-container *ngIf="hero">
    and saw {{hero.name}}. I waved
  </ng-container>
  and continued on my way.
</p>
```  
Import the ngModel directive from FormsModule.  
Add FormsModule to the imports section of the relevant Angular module.  
To conditionally exclude an <option>, wrap the <option> in an <ng-container>.  
```typescript
<div>
  Pick your favorite hero
  (<label for="showSad"><input id="showSad" type="checkbox" checked (change)="showSad = !showSad">show sad</label>)
</div>
<select [(ngModel)]="hero">
  <ng-container *ngFor="let h of heroes">
    <ng-container *ngIf="showSad || h.emotion !== 'sad'">
      <option [ngValue]="h">{{h.name}} ({{h.emotion}})</option>
    </ng-container>
  </ng-container>
</select>
```  
<br>

## Switching cases with NgSwitch  
Like the JavaScript switch statement, NgSwitch displays one element from among several possible elements, based on a switch condition. Angular puts only the selected element into the DOM.  
<br>

```NgSwitch directives```	```Details```  
```NgSwitch```	An attribute directive that changes the behavior of its companion directives.  
```NgSwitchCase```	Structural directive that adds its element to the DOM when its bound value equals the switch value and removes its bound value when it doesn't equal the switch value.  
```NgSwitchDefault```	Structural directive that adds its element to the DOM when there is no selected NgSwitchCase.  
<br>

To use the directives, add the NgSwitch, NgSwitchCase and NgSwitchDefault to the component's imports list.  
```typescript
import {NgSwitch, NgSwitchCase, NgSwitchDefault} from '@angular/common';
...
@Component({
...
    NgSwitch, // <-- import into the component
    NgSwitchCase,
    NgSwitchDefault,
...
  ],
})
export class AppComponent implements OnInit {
...
}
```  
On an element, such as a <div>, add [ngSwitch] bound to an expression that returns the switch value, such as feature. Though the feature value in this example is a string, the switch value can be of any type.  
Bind to *ngSwitchCase and *ngSwitchDefault on the elements for the cases.  
```typescript
<div [ngSwitch]="currentItem.feature">
  <app-stout-item    *ngSwitchCase="'stout'"    [item]="currentItem"></app-stout-item>
  <app-device-item   *ngSwitchCase="'slim'"     [item]="currentItem"></app-device-item>
  <app-lost-item     *ngSwitchCase="'vintage'"  [item]="currentItem"></app-lost-item>
  <app-best-item     *ngSwitchCase="'bright'"   [item]="currentItem"></app-best-item>
...
  <app-unknown-item  *ngSwitchDefault           [item]="currentItem"></app-unknown-item>
</div>
```  
In the parent component, define currentItem, to use it in the [ngSwitch] expression.  
```typescript
currentItem!: Item;
```  
In each child component, add an item input property which is bound to the currentItem of the parent component. The following two snippets show the parent component and one of the child components. The other child components are identical to StoutItemComponent.  
```typescript
export class StoutItemComponent {
  @Input() item!: Item;
}
```  
Switch directives also work with built-in HTML elements and web components. For example, you could replace the <app-best-item> switch case with a <div> as follows.  
```typescript
<div *ngSwitchCase="'bright'">Are you as bright as {{ currentItem.name }}?</div>
```  