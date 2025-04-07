## Structural directives  
Structural directives are directives applied to an <ng-template> element that conditionally or repeatedly render the content of that <ng-template>.  
<br>

### Example use case  
In this guide you'll build a structural directive which fetches data from a given data source and renders its template when that data is available. This directive is called SelectDirective, after the SQL keyword SELECT, and match it with an attribute selector [select].  
<br>

SelectDirective will have an input naming the data source to be used, which you will call selectFrom. The select prefix for this input is important for the shorthand syntax. The directive will instantiate its <ng-template> with a template context providing the selected data.  
<br>

The following is an example of using this directive directly on an <ng-template> would look like:  
```typescript
<ng-template select let-data [selectFrom]="source">
  <p>The data is: {{ data }}</p>
</ng-template>
```  
The structural directive can wait for the data to become available and then render its <ng-template>.  
<br>

### Structural directive shorthand  
Angular supports a shorthand syntax for structural directives which avoids the need to explicitly author an <ng-template> element.  
<br>

Structural directives can be applied directly on an element by prefixing the directive attribute selector with an asterisk (*), such as *select. Angular transforms the asterisk in front of a structural directive into an <ng-template> that hosts the directive and surrounds the element and its descendants.  
```typescript
<p *select="let data from source">The data is: {{data}}</p>
```  
When used in this way, only the structural directive and its bindings are applied to the <ng-template>. Any other attributes or bindings on the <p> tag are left alone. For example, these two forms are equivalent:  
```typescript
<!-- Shorthand syntax: -->
<p class="data-view" *select="let data from source">The data is: {{data}}</p>
<!-- Long-form syntax: -->
<ng-template select let-data [selectFrom]="source">
  <p class="data-view">The data is: {{data}}</p>
</ng-template>
```  
The first part of the *select expression is let data, which declares a template variable data. Since no assignment follows, the template variable is bound to the template context property $implicit.  
<br>

The second piece of syntax is a key-expression pair, from source. from is a binding key and source is a regular template expression. Binding keys are mapped to properties by transforming them to PascalCase and prepending the structural directive selector. The from key is mapped to selectFrom, which is then bound to the expression source. This is why many structural directives will have inputs that are all prefixed with the structural directive's selector.  
<br>

### One structural directive per element  
You can only apply one structural directive per element when using the shorthand syntax. This is because there is only one <ng-template> element onto which that directive gets unwrapped. Multiple directives would require multiple nested <ng-template>, and it's unclear which directive should be first. <ng-container> can be used when to create wrapper layers when multiple structural directives need to be applied around the same physical DOM element or component, which allows the user to define the nested structure.  

### Creating a structural directive  
<br>

Using the Angular CLI, run the following command, where select is the name of the directive:  
```typescript
ng generate directive select
```  
Import TemplateRef, and ViewContainerRef. Inject TemplateRef and ViewContainerRef in the directive as private properties.  
```typescript
import {Directive, TemplateRef, ViewContainerRef} from '@angular/core';
@Directive({
  selector: '[select]',
})
export class SelectDirective {
  private templateRef = inject(TemplateRef);
  private ViewContainerRef = inject(ViewContainerRef);
}
```  
Add a selectFrom @Input() property.  
```typescript
export class SelectDirective {
  // ...
  @Input({required: true}) selectFrom!: DataSource;
}
```  
With SelectDirective now scaffolded as a structural directive with its input, you can now add the logic to fetch the data and render the template with it:  
```typescript
export class SelectDirective {
  // ...
  async ngOnInit() {
    const data = await this.selectFrom.load();
    this.viewContainerRef.createEmbeddedView(this.templateRef, {
      // Create the embedded view with a context object that contains
      // the data via the key `$implicit`.
      $implicit: data,
    });
  }
}
```  
<br>

### Structural directive syntax reference  
When you write your own structural directives, use the following syntax:  
```typescript
*:prefix="( :let | :expression ) (';' | ',')? ( :let | :as | :keyExp )*"
```  
The following patterns describe each portion of the structural directive grammar:  
```typescript
as = :export "as" :local ";"?
keyExp = :key ":"? :expression ("as" :local)? ";"?
let = "let" :local "=" :export ";"?
```  
<br>

## Improving template type checking for custom directives  
You can improve template type checking for custom directives by adding template guards to your directive definition. These guards help the Angular template type checker find mistakes in the template at compile time, which can avoid runtime errors. Two different types of guards are possible:  
<br>

ngTemplateGuard_(input) lets you control how an input expression should be narrowed based on the type of a specific input.  
ngTemplateContextGuard is used to determine the type of the context object for the template, based on the type of the directive itself.  

### Type narrowing with template guards  
A structural directive in a template controls whether that template is rendered at run time. Some structural directives want to perform type narrowing based on the type of input expression.  
<br>

There are two narrowings which are possible with input guards:  
<br>

Narrowing the input expression based on a TypeScript type assertion function.  
Narrowing the input expression based on its truthiness.  
To narrow the input expression by defining a type assertion function:  
```typescript
// This directive only renders its template if the actor is a user.
// You want to assert that within the template, the type of the `actor`
// expression is narrowed to `User`.
@Directive(...)
class ActorIsUser {
  @Input() actor: User|Robot;
  static ngTemplateGuard_actor(dir: ActorIsUser, expr: User|Robot): expr is User {
    // The return statement is unnecessary in practice, but included to
    // prevent TypeScript errors.
    return true;
  }
}
```  
Type-checking will behave within the template as if the ngTemplateGuard_actor has been asserted on the expression bound to the input.  
<br>

Some directives only render their templates when an input is truthy. It's not possible to capture the full semantics of truthiness in a type assertion function, so instead a literal type of 'binding' can be used to signal to the template type-checker that the binding expression itself should be used as the guard:  
```typescript
@Directive(...)
class CustomIf {
  @Input() condition!: any;
  static ngTemplateGuard_condition: 'binding';
}
```  
The template type-checker will behave as if the expression bound to condition was asserted to be truthy within the template.  
<br>

### Typing the directive's context  
If your structural directive provides a context to the instantiated template, you can properly type it inside the template by providing a static ngTemplateContextGuard type assertion function. This function can use the type of the directive to derive the type of the context, which is useful when the type of the directive is generic.  
<br>

For the SelectDirective described above, you can implement an ngTemplateContextGuard to correctly specify the data type, even if the data source is generic.  
```typescript
// Declare an interface for the template context:
export interface SelectTemplateContext<T> {
  $implicit: T;
}
@Directive(...)
export class SelectDirective<T> {
  // The directive's generic type `T` will be inferred from the `DataSource` type
  // passed to the input.
  @Input({required: true}) selectFrom!: DataSource<T>;
  // Narrow the type of the context using the generic type of the directive.
  static ngTemplateContextGuard<T>(dir: SelectDirective<T>, ctx: any): ctx is SelectTemplateContext<T> {
    // As before the guard body is not used at runtime, and included only to avoid
    // TypeScript errors.
    return true;
  }
}
```  