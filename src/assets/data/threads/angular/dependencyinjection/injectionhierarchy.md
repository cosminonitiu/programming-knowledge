Angular injectors follow a hierarchical structure:

Root Injector (Singleton services)
Services declared with providedIn: 'root'
Module Injector (Scoped per module)
Services declared inside providers in a module.
Component Injector (Scoped per component)
Services declared inside providers in a component.

**How Angular Searches for Dependencies**
When a dependency is requested in a component, Angular:

Checks the component injector.
If not found, checks the module injector.
If not found, checks the root injector.
If still not found, throws an error.

:point_right: Example

```typescript
@Injectable({ providedIn: 'root' })
export class RootService { }

@NgModule({
  providers: [ModuleService]
})
export class SomeModule { }

@Component({
  selector: 'app-example',
  providers: [ComponentService]
})
export class ExampleComponent {
  constructor(private root: RootService, private module: ModuleService, private component: ComponentService) { }
} 
```

RootService → Provided globally.
ModuleService → Only available in SomeModule.
ComponentService → Only available in ExampleComponent.