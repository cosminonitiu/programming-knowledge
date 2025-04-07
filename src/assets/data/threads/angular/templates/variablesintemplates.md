## Variables in templates  
Angular has two types of variable declarations in templates: local template variables and template reference variables.  
<br>

## Local template variables with @let  
Angular's @let syntax allows you to define a local variable and re-use it across a template, similar to the JavaScript let syntax.  
<br>

### Using @let  
Use @let to declare a variable whose value is based on the result of a template expression. Angular automatically keeps the variable's value up-to-date with the given expression, similar to bindings.  
```typescript
@let name = user.name;
@let greeting = 'Hello, ' + name;
@let data = data$ | async;
@let pi = 3.1459;
@let coordinates = {x: 50, y: 100};
@let longExpression = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit ' +
                      'sed do eiusmod tempor incididunt ut labore et dolore magna ' +
                      'Ut enim ad minim veniam...';
```  
Each @let block can declare exactly one variable. You cannot declare multiple variables in the same block with a comma.  
<br>

### Referencing the value of @let  
Once you've declared a variable with @let, you can reuse it in the same template:  
```typescript
@let user = user$ | async;
@if (user) {
  <h1>Hello, {{user.name}}</h1>
  <user-avatar [photo]="user.photo"/>
  <ul>
    @for (snack of user.favoriteSnacks; track snack.id) {
      <li>{{snack.name}}</li>
    }
  </ul>
  <button (click)="update(user)">Update profile</button>
}
```  
<br>

### Assignability  
A key difference between @let and JavaScript's let is that @let cannot be reassigned after declaration. However, Angular automatically keeps the variable's value up-to-date with the given expression.  
```typescript
@let value = 1;
<!-- Invalid - This does not work! -->
<button (click)="value = value + 1">Increment the value</button>
```  
<br>

### Variable scope  
@let declarations are scoped to the current view and its descendants. Angular creates a new view at component boundaries and wherever a template might contain dynamic content, such as control flow blocks, @defer blocks, or structural directives.  
Since @let declarations are not hoisted, they cannot be accessed by parent views or siblings:  
```typescript
@let topLevel = value;
<div>
  @let insideDiv = value;
</div>
{{topLevel}} <!-- Valid -->
{{insideDiv}} <!-- Valid -->
@if (condition) {
  {{topLevel + insideDiv}} <!-- Valid -->
  @let nested = value;
  @if (condition) {
    {{topLevel + insideDiv + nested}} <!-- Valid -->
  }
}
<div *ngIf="condition">
  {{topLevel + insideDiv}} <!-- Valid -->
  @let nestedNgIf = value;
  <div *ngIf="condition">
     {{topLevel + insideDiv + nestedNgIf}} <!-- Valid -->
  </div>
</div>
{{nested}} <!-- Error, not hoisted from @if -->
{{nestedNgIf}} <!-- Error, not hoisted from *ngIf -->
```  
<br>

### Full syntax  
The @let syntax is formally defined as:  
<br>

The @let keyword. 
Followed by one or more whitespaces, not including new lines. 
Followed by a valid JavaScript name and zero or more whitespaces. 
Followed by the = symbol and zero or more whitespaces. 
Followed by an Angular expression which can be multi-line. 
Terminated by the ; symbol. 
<br>

## Template reference variables  
Template reference variables give you a way to declare a variable that references a value from an element in your template.  
A template reference variable can refer to the following:  
<br>

a DOM element within a template (including custom elements)  
an Angular component or directive  
a TemplateRef from an ng-template  
<br>

You can use template reference variables to read information from one part of the template in another part of the same template.  
<br>

### Declaring a template reference variable  
You can declare a variable on an element in a template by adding an attribute that starts with the hash character (#) followed by the variable name.  
```typescript
<!-- Create a template reference variable named "taskInput", referring to the HTMLInputElement. -->
<input #taskInput placeholder="Enter task name">
```  
<br>

### Assigning values to template reference variables  
Angular assigns a value to template variables based on the element on which the variable is declared.  
If you declare the variable on a Angular component, the variable refers to the component instance.  
```typescript
<!-- The `startDate` variable is assigned the instance of `MyDatepicker`. -->
<my-datepicker #startDate />
```  
If you declare the variable on an <ng-template> element, the variable refers to a TemplateRef instance which represents the template. For more information, see How Angular uses the asterisk, *, syntax in Structural directives.  
```typescript
<!-- The `myFragment` variable is assigned the `TemplateRef` instance corresponding to this template fragment. -->
<ng-template #myFragment>
  <p>This is a template fragment</p>
</ng-template>
```  
If you declare the variable on any other displayed element, the variable refers to the HTMLElement instance.  
```typescript
<!-- The "taskInput" variable refers to the HTMLInputElement instance. -->
<input #taskInput placeholder="Enter task name">
```  
<br>

### Assigning a reference to an Angular directive  
Angular directives may have an exportAs property that defines a name by which the directive can be referenced in a template:  
```typescript
@Directive({
  selector: '[dropZone]',
  exportAs: 'dropZone',
})
export class DropZone { /* ... */ }
```  
When you declare a template variable on an element, you can assign that variable a directive instance by specifying this exportAs name:  
```typescript
<!-- The `firstZone` variable refers to the `DropZone` directive instance. -->
<section dropZone #firstZone="dropZone"> ... </section>
```  
You cannot refer to a directive that does not specify an exportAs name.  
<br>

### Using template reference variables with queries  
In addition to using template variables to read values from another part of the same template, you can also use this style of variable declaration to "mark" an element for component and directive queries.  
<br>

When you want to query for a specific element in a template, you can declare a template variable on that element and then query for the element based on the variable name.  
```typescript
<input #description value="Original description">
```  
```typescript
@Component({
  /* ... */,
  template: `<input #description value="Original description">`,
})
export class AppComponent {
  // Query for the input element based on the template variable name.
  @ViewChild('description') input: ElementRef | undefined;
}
```  