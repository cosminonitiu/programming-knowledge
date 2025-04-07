## Referencing component children with queries  
A component can define queries that find child elements and read values from their injectors.  
Developers most commonly use queries to retrieve references to child components, directives, DOM elements, and more.  
<br>

All query functions return signals that reflect the most up-to-date results. You can read the result by calling the signal function, including in reactive contexts like computed and effect.  
There are two categories of query: view queries and content queries.  
<br>

### View queries  
View queries retrieve results from the elements in the component's view — the elements defined in the component's own template. You can query for a single result with the viewChild function.  
```typescript
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  header = viewChild(CustomCardHeader);
  headerText = computed(() => this.header()?.text);
}
```  
In this example, the CustomCard component queries for a child CustomCardHeader and uses the result in a computed.  
<br>

If the query does not find a result, its value is undefined. This may occur if the target element is hidden by @if. Angular keeps the result of viewChild up to date as your application state changes.  
<br>

You can also query for multiple results with the viewChildren function.  
```typescript
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}
@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  actions = viewChildren(CustomCardAction);
  actionsTexts = computed(() => this.actions().map(action => action.text);
}
```  
viewChildren creates a signal with an Array of the query results.  
<br>

Queries never pierce through component boundaries. View queries can only retrieve results from the component's template.  
<br>

### Content Queries  
Content queries retrieve results from the elements in the component's content— the elements nested inside the component in the template where it's used. You can query for a single result with the contentChild function.  
```typescript
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
  toggleText = computed(() => this.toggle()?.text);
}
@Component({ 
  /* ... */
  // CustomToggle is used inside CustomExpando as content.  
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
```  
In this example, the CustomExpando component queries for a child CustomToggle and accesses the result in a computed.  
<br>

If the query does not find a result, its value is undefined. This may occur if the target element is absent or hidden by @if. Angular keeps the result of contentChild up to date as your application state changes.  
<br>

By default, content queries find only direct children of the component and do not traverse into descendants.  
<br>

You can also query for multiple results with the contentChildren function.  
```typescript
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}
@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  items = contentChildren(CustomMenuItem);
  itemTexts = computed(() => this.items().map(item => item.text));
}
@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
```  
contentChildren creates a signal with an Array of the query results.  
<br>

Queries never pierce through component boundaries. Content queries can only retrieve results from the same template as the component itself.  
<br>

### Required queries  
If a child query (viewChild or contentChild) does not find a result, its value is undefined. This may occur if the target element is hidden by a control flow statement like @if or @for. Because of this, the child queries return a signal that include undefined in their value type.  
<br>

If some cases, especially with viewChild, you know with certainty that a specific child is always available. In other cases, you may want to strictly enforce that a specific child is present. For these cases, you can use a required query.  
```typescript
@Component({/* ... */})
export class CustomCard {
  header = viewChild.required(CustomCardHeader);
  body = contentChild.required(CustomCardBody);
}
```  
If a required query does not find a matching result, Angular reports an error. Because this guarantees that a result is available, require queries do not automatically include undefined in the signal's value type.  
<br>

### Query Locators  
This first parameter for each query decorator is its locator.  
Most of the time, you want to use a component or directive as your locator.  
<br>

You can alternatively specify a string locator corresponding to a template reference variable.  
```typescript
@Component({
  /*...*/
  template: `
    <button #save>Save</button>
    <button #cancel>Cancel</button>
  `
})
export class ActionBar {
  saveButton = viewChild<ElementRef<HTMLButtonElement>>('save');
}
```  
If more than one element defines the same template reference variable, the query retrieves the first matching element.  
Angular does not support CSS selectors as query locators.  
<br>

### Queries and the injector tree  
For more advanced cases, you can use any ProviderToken as a locator. This lets you locate elements based on component and directive providers.
```typescript
const SUB_ITEM = new InjectionToken<string>('sub-item');
@Component({
  /*...*/
  providers: [{provide: SUB_ITEM, useValue: 'special-item'}],
})
export class SpecialItem { }
@Component({/*...*/})
export class CustomList {
  subItemType = contentChild(SUB_ITEM);
}
```  
The above example uses an InjectionToken as a locator, but you can use any ProviderToken to locate specific elements.  
<br>

### Query options  
All query functions accept an options object as a second parameter. These options control how the query finds its results.  
<br>

### Reading specific values from an element's injector  
By default, the query locator indicates both the element you're searching for and the value retrieved. You can alternatively specify the read option to retrieve a different value from the element matched by the locator.  
```typescript
@Component({/*...*/})
export class CustomExpando {
  toggle = contentChild(ExpandoContent, {read: TemplateRef});
}
```  
The above example, locates an element with the directive ExpandoContent and retrieves the TemplateRef associated with that element.  
Developers most commonly use read to retrieve ElementRef and TemplateRef.  
<br>

### Content descendants  
By default, content queries find only direct children of the component and do not traverse into descendants.  
```typescript
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  toggle = contentChild(CustomToggle);
}
@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <some-other-component>
        <!-- custom-toggle will not be found! -->
        <custom-toggle>Show</custom-toggle>
      </some-other-component>
    </custom-expando>
  `
})
export class UserProfile { }
```  
In the example above, CustomExpando cannot find <custom-toggle> because it is not a direct child of <custom-expando>. By setting descendants: true, you configure the query to traverse all descendants in the same template. Queries, however, never pierce into components to traverse elements in other templates.  
<br>

View queries do not have this option because they always traverse into descendants.  
<br>

## Decorator-based queries  
You can alternatively declare queries by adding the corresponding decorator to a property. Decorator-based queries behave the same way as signal-based queries except as described below.  
<br>

### View queries  
You can query for a single result with the @ViewChild decorator.  
```typescript
@Component({
  selector: 'custom-card-header',
  /*...*/
})
export class CustomCardHeader {
  text: string;
}
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader) header: CustomCardHeader;
  ngAfterViewInit() {
    console.log(this.header.text);
  }
}
```  
In this example, the CustomCard component queries for a child CustomCardHeader and accesses the result in ngAfterViewInit.  
<br>

Angular keeps the result of @ViewChild up to date as your application state changes.  
<br>

View query results become available in the ngAfterViewInit lifecycle method. Before this point, the value is undefined. See the Lifecycle section for details on the component lifecycle.  
<br>

You can also query for multiple results with the @ViewChildren decorator.  
```typescript
@Component({
  selector: 'custom-card-action',
  /*...*/
})
export class CustomCardAction {
  text: string;
}
@Component({
  selector: 'custom-card',
  template: `
    <custom-card-action>Save</custom-card-action>
    <custom-card-action>Cancel</custom-card-action>
  `,
})
export class CustomCard {
  @ViewChildren(CustomCardAction) actions: QueryList<CustomCardAction>;
  ngAfterViewInit() {
    this.actions.forEach(action => {
      console.log(action.text);
    });
  }
}
```  
@ViewChildren creates a QueryList object that contains the query results. You can subscribe to changes to the query results over time via the changes property.  
<br>

### Content Queries  
You can query for a single result with the @ContentChild decorator.  
```typescript
@Component({
  selector: 'custom-toggle',
  /*...*/
})
export class CustomToggle {
  text: string;
}
@Component({
  selector: 'custom-expando',
  /*...*/
})
export class CustomExpando {
  @ContentChild(CustomToggle) toggle: CustomToggle;
  ngAfterContentInit() {
    console.log(this.toggle.text);
  }
}
@Component({
  selector: 'user-profile',
  template: `
    <custom-expando>
      <custom-toggle>Show</custom-toggle>
    </custom-expando>
  `
})
export class UserProfile { }
```  
In this example, the CustomExpando component queries for a child CustomToggle and accesses the result in ngAfterContentInit.  
<br>

Angular keeps the result of @ContentChild up to date as your application state changes.  
<br>

Content query results become available in the ngAfterContentInit lifecycle method. Before this point, the value is undefined. See the Lifecycle section for details on the component lifecycle.  
<br>

You can also query for multiple results with the @ContentChildren decorator.  
```typescript
@Component({
  selector: 'custom-menu-item',
  /*...*/
})
export class CustomMenuItem {
  text: string;
}
@Component({
  selector: 'custom-menu',
  /*...*/
})
export class CustomMenu {
  @ContentChildren(CustomMenuItem) items: QueryList<CustomMenuItem>;
  ngAfterContentInit() {
    this.items.forEach(item => {
      console.log(item.text);
    });
  }
}
@Component({
  selector: 'user-profile',
  template: `
    <custom-menu>
      <custom-menu-item>Cheese</custom-menu-item>
      <custom-menu-item>Tomato</custom-menu-item>
    </custom-menu>
  `
})
export class UserProfile { }
```  
@ContentChildren creates a QueryList object that contains the query results. You can subscribe to changes to the query results over time via the changes property.  
<br>

### Decorator-based query options  
All query decorators accept an options object as a second parameter. These options work the same way as signal-based queries except where described below.  
<br>

### Static Queries  
@ViewChild and @ContentChild decorators accept the static option.  
```typescript
@Component({
  selector: 'custom-card',
  template: '<custom-card-header>Visit sunny California!</custom-card-header>',
})
export class CustomCard {
  @ViewChild(CustomCardHeader, {static: true}) header: CustomCardHeader;
  ngOnInit() {
    console.log(this.header.text);
  }
}
```  
By setting static: true, you guarantee to Angular that the target of this query is always present and is not conditionally rendered. This makes the result available earlier, in the ngOnInit lifecycle method.  
<br>

Static query results do not update after initialization.  
<br>

The static option is not available for @ViewChildren and @ContentChildren queries.  
<br>

### Using QueryLis  
@ViewChildren and @ContentChildren both provide a QueryList object that contains a list of results.  
<br>

QueryList offers a number of convenience APIs for working with results in an array-like manner, such as map, reduce, and forEach. You can get an array of the current results by calling toArray.  
<br>

You can subscribe to the changes property to do something any time the results change.  
<br>

## Common query pitfalls  
When using queries, common pitfalls can make your code harder to understand and maintain.  
<br>

Always maintain a single source of truth for state shared between multiple components. This avoids scenarios where repeated state in different components becomes out of sync.  
<br>

Avoid directly writing state to child components. This pattern can lead to brittle code that is hard to understand and is prone to ExpressionChangedAfterItHasBeenChecked errors.  
<br>

Never directly write state to parent or ancestor components. This pattern can lead to brittle code that is hard to understand and is prone to ExpressionChangedAfterItHasBeenChecked errors.  