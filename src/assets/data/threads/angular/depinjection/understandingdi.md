## Understanding dependency injection  
Dependency injection, or DI, is one of the fundamental concepts in Angular. DI is wired into the Angular framework and allows classes with Angular decorators, such as Components, Directives, Pipes, and Injectables, to configure dependencies that they need.  
<br>

Two main roles exist in the DI system: dependency consumer and dependency provider.  
<br>

Angular facilitates the interaction between dependency consumers and dependency providers using an abstraction called Injector. When a dependency is requested, the injector checks its registry to see if there is an instance already available there. If not, a new instance is created and stored in the registry. Angular creates an application-wide injector (also known as the "root" injector) during the application bootstrap process. In most cases you don't need to manually create injectors, but you should know that there is a layer that connects providers and consumers.  
<br>

This topic covers basic scenarios of how a class can act as a dependency. Angular also allows you to use functions, objects, primitive types such as string or Boolean, or any other types as dependencies. For more information, see Dependency providers.  
<br>

## Providing a dependency  
Consider a class called HeroService that needs to act as a dependency in a component.  
The first step is to add the @Injectable decorator to show that the class can be injected.  
```typescript
@Injectable()
class HeroService {}
```  
The next step is to make it available in the DI by providing it. A dependency can be provided in multiple places:  
<br>

Understanding dependency injection  
Providing a dependency  
Preferred: At the application root level using providedIn  
At the Component level  
At the application root level using ApplicationConfig  
NgModule based applications  
Injecting/consuming a dependency  
What's next  
<br>

### Preferred: At the application root level using providedIn  
Providing a service at the application root level using providedIn allows injecting the service into all other classes. Using providedIn enables Angular and JavaScript code optimizers to effectively remove services that are unused (known as tree-shaking).  
You can provide a service by using providedIn: 'root' in the @Injectable decorator:  
```typescript
@Injectable({
  providedIn: 'root'
})
class HeroService {}
```  
When you provide the service at the root level, Angular creates a single, shared instance of the HeroService and injects it into any class that asks for it.  
<br>

### At the Component level  
At the Component level
You can provide services at @Component level by using the providers field of the @Component decorator. In this case the HeroService becomes available to all instances of this component and other components and directives used in the template.  
```typescript
@Component({
  selector: 'hero-list',
  template: '...',
  providers: [HeroService]
})
class HeroListComponent {}
```  
When you register a provider at the component level, you get a new instance of the service with each new instance of that component.  
<br>

### At the application root level using ApplicationConfig  
You can use the providers field of the ApplicationConfig (passed to the bootstrapApplication function) to provide a service or other Injectable at the application level.  
In the example below, the HeroService is available to all components, directives, and pipes:  
```typescript
export const appConfig: ApplicationConfig = {
    providers: [
      { provide: HeroService },
    ]
};
```  
Then, in main.ts:  
```typescript
bootstrapApplication(AppComponent, appConfig)
```  
<br>

### NgModule based applications  
@NgModule-based applications use the providers field of the @NgModule decorator to provide a service or other Injectable available at the application level.  
A service provided in a module is available to all declarations of the module, or to any other modules which share the same ModuleInjector. To understand all edge-cases, see Hierarchical injectors.  
<br>

### Injecting/consuming a dependency  
Use Angular's inject function to retrieve dependencies.  
```typescript
import {inject, Component} from 'angular/core'; 
@Component({/* ... */})
export class UserProfile {
  // You can use the `inject` function in property initializers.
  private userClient = inject(UserClient);
  
  constructor() {
    // You can also use the `inject` function in a constructor.
    const logger = inject(Logger);
  }
}
```  
You can use the inject function in any injection context. Most of the time, this is in a class property initializer or a class constructor for components, directives, services, and pipes.  
<br>

When Angular discovers that a component depends on a service, it first checks if the injector has any existing instances of that service. If a requested service instance doesn't yet exist, the injector creates one using the registered provider, and adds it to the injector before returning the service to Angular.