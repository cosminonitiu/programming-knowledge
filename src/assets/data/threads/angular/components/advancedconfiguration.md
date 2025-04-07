## Advanced component configuration  
### ChangeDetectionStrategy  
The @Component decorator accepts a changeDetection option that controls the component's change detection mode. There are two change detection mode options.  
<br>

ChangeDetectionStrategy.Default is, unsurprisingly, the default strategy. In this mode, Angular checks whether the component's DOM needs an update whenever any activity may have occurred application-wide. Activities that trigger this checking include user interaction, network response, timers, and more.  
<br>

ChangeDetectionStrategy.OnPush is an optional mode that reduces the amount of checking Angular needs to perform. In this mode, the framework only checks if a component's DOM needs an update when:  
<br>

&nbsp;&nbsp;1. A component input has changes as a result of a binding in a template, or  
&nbsp;&nbsp;2. An event listener in this component runs  
&nbsp;&nbsp;3. The component is explicitly marked for check, via ChangeDetectorRef.markForCheck or something which wraps it, like AsyncPipe.  
<br>

Additionally, when an OnPush component is checked, Angular also checks all of its ancestor components, traversing upwards through the application tree. 
<br>

### PreserveWhitespaces  
By default, Angular removes and collapses superfluous whitespace in templates, most commonly from newlines and indentation. You can change this setting by explicitly setting preserveWhitespaces to true in a component's metadata.  
<br>

### Custom element schemas  
By default, Angular throws an error when it encounters an unknown HTML element. You can disable this behavior for a component by including CUSTOM_ELEMENTS_SCHEMA in the schemas property in your component metadata.  
```typescript
import {Component, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
@Component({
  ...,
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  template: '<some-unknown-component></some-unknown-component>'
})
export class ComponentWithCustomElements { }
```  
Angular does not support any other schemas at this time.