## Directive composition API  
Angular directives offer a great way to encapsulate reusable behaviors— directives can apply attributes, CSS classes, and event listeners to an element.  
<br>

The directive composition API lets you apply directives to a component's host element from within the component TypeScript class.  
<br>

## Adding directives to a component  
You apply directives to a component by adding a hostDirectives property to a component's decorator. We call such directives host directives.  
<br>

In this example, we apply the directive MenuBehavior to the host element of AdminMenu. This works similarly to applying the MenuBehavior to the <admin-menu> element in a template.  
```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```  
When the framework renders a component, Angular also creates an instance of each host directive. The directives' host bindings apply to the component's host element. By default, host directive inputs and outputs are not exposed as part of the component's public API. See Including inputs and outputs below for more information.  
<br>

Angular applies host directives statically at compile time. You cannot dynamically add directives at runtime.  
Directives used in hostDirectives may not specify standalone: false.  
Angular ignores the selector of directives applied in the hostDirectives property.  
<br>

## Including inputs and outputs  
When you apply hostDirectives to your component, the inputs and outputs from the host directives are not included in your component's API by default. You can explicitly include inputs and outputs in your component's API by expanding the entry in hostDirectives:  
```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId'],
    outputs: ['menuClosed'],
  }],
})
export class AdminMenu { }
```  
By explicitly specifying the inputs and outputs, consumers of the component with hostDirective can bind them in a template:  
```typescript
<admin-menu menuId="top-menu" (menuClosed)="logMenuClosed()">
```  
Furthermore, you can alias inputs and outputs from hostDirective to customize the API of your component:  
```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [{
    directive: MenuBehavior,
    inputs: ['menuId: id'],
    outputs: ['menuClosed: closed'],
  }],
})
export class AdminMenu { }
```  
```typescript
<admin-menu id="top-menu" (closed)="logMenuClosed()">
```  
<br>

## Adding directives to another directive  
You can also add hostDirectives to other directives, in addition to components. This enables the transitive aggregation of multiple behaviors.  
<br>

In the following example, we define two directives, Menu and Tooltip. We then compose the behavior of these two directives in MenuWithTooltip. Finally, we apply MenuWithTooltip to SpecializedMenuWithTooltip.  
<br>

When SpecializedMenuWithTooltip is used in a template, it creates instances of all of Menu , Tooltip, and MenuWithTooltip. Each of these directives' host bindings apply to the host element of SpecializedMenuWithTooltip.  
```typescript
@Directive({...})
export class Menu { }
@Directive({...})
export class Tooltip { }
// MenuWithTooltip can compose behaviors from multiple other directives
@Directive({
  hostDirectives: [Tooltip, Menu],
})
export class MenuWithTooltip { }
// CustomWidget can apply the already-composed behaviors from MenuWithTooltip
@Directive({
  hostDirectives: [MenuWithTooltip],
})
export class SpecializedMenuWithTooltip { }
```  
<br>

## Host directive semantics  
### Directive execution order  
Host directives go through the same lifecycle as components and directives used directly in a template. However, host directives always execute their constructor, lifecycle hooks, and bindings before the component or directive on which they are applied.  
```typescript
@Component({
  selector: 'admin-menu',
  template: 'admin-menu.html',
  hostDirectives: [MenuBehavior],
})
export class AdminMenu { }
```  
The order of execution here is:  
<br>

MenuBehavior instantiated  
AdminMenu instantiated  
MenuBehavior receives inputs (ngOnInit)  
AdminMenu receives inputs (ngOnInit)  
MenuBehavior applies host bindings  
AdminMenu applies host bindings  
<br>

This order of operations means that components with hostDirectives can override any host bindings specified by a host directive.  
<br>

This order of operations extends to nested chains of host directives, as shown in the following example.  
```typescript
@Directive({...})
export class Tooltip { }
@Directive({
  hostDirectives: [Tooltip],
})
export class CustomTooltip { }
@Directive({
  hostDirectives: [CustomTooltip],
})
export class EvenMoreCustomTooltip { }
```  
In the example above, the order of execution is:  
<br>

Tooltip instantiated  
CustomTooltip instantiated  
EvenMoreCustomTooltip instantiated  
Tooltip receives inputs (ngOnInit)  
CustomTooltip receives inputs (ngOnInit)  
EvenMoreCustomTooltip receives inputs (ngOnInit)  
Tooltip applies host bindings  
CustomTooltip applies host bindings  
EvenMoreCustomTooltip applies host bindings  
<br>

## Dependency injection  
A component or directive that specifies hostDirectives can inject the instances of those host directives and vice versa.  
<br>

When applying host directives to a component, both the component and host directives can define providers.  
<br>

If a component or directive with hostDirectives and those host directives both provide the same injection token, the providers defined by class with hostDirectives take precedence over providers defined by the host directives.  