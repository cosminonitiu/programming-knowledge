Dependency Injection (DI) is a design pattern in Angular that allows objects (services, components, directives, etc.) to receive dependencies from an external source rather than creating them manually. This enhances modularity, maintainability, and testability.

**1. What is Dependency Injection (DI)?**
DI is a way to manage dependencies in an application by injecting required services instead of creating them inside a class. Angular has a built-in DI framework that provides services where needed.

Without DI:
```typescript
class Component {
  service = new SomeService(); // Hardcoded dependency
}
```
With DI:
```typescript
class Component {
  constructor(private service: SomeService) {} // Injected dependency
}
```

Reduces coupling between components and services.
Allows easy swapping of implementations (e.g., mocking for testing).

**2. How DI Works in Angular**
Angular’s DI system consists of three main parts:
Injector → A container that provides dependencies.
Provider → Configures how an injectable is created.
Dependency Resolution → The process by which Angular resolves requested dependencies.

**Dependency Resolution Process**
The injector searches for a requested dependency.
If found, it provides an instance.
If not found in the current injector, it checks parent injectors.
If still not found, an error occurs (No provider for X).  

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

Services must be registered before they can be injected. Angular provides different ways to do this.

**Method 1: providedIn (Preferred)**
```typescript
@Injectable({
  providedIn: 'root' // Service is available throughout the app
})
export class MyService { } 
```
Registers the service at the root level (singleton).

Automatically removes unused services (tree-shakable).

No need to manually import the service into providers.

Other options:
```typescript
@Injectable({
  providedIn: 'platform' // Available at the platform level
})
@Injectable({
  providedIn: 'any' // Unique instance per module
}) 
```
**Method 2: Registering in providers (Per Module)**
You can provide a service at the module level:

```typescript
@NgModule({
  providers: [MyService]
})
export class SomeModule { } 
```
This creates a new instance per module, not a singleton.

**Method 3: Registering in Component Providers**
You can provide a service at the component level:

```typescript
@Component({
  selector: 'app-example',
  providers: [MyService]
})
export class ExampleComponent { } 
```
This creates a new instance of the service for each component instance.

Useful for isolated service instances.