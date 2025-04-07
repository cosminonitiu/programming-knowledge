## Injection context  
The dependency injection (DI) system relies internally on a runtime context where the current injector is available. This means that injectors can only work when code is executed in such a context.  
<br>

The injection context is available in these situations:  
<br>

During construction (via the constructor) of a class being instantiated by the DI system, such as an @Injectable or @Component.  
In the initializer for fields of such classes.  
In the factory function specified for useFactory of a Provider or an @Injectable.  
In the factory function specified for an InjectionToken.  
Within a stack frame that runs in an injection context.  
<br>

Knowing when you are in an injection context will allow you to use the inject function to inject instances.  
<br>

## Class constructors  
Every time the DI system instantiates a class, it does so in an injection context. This is handled by the framework itself. The constructor of the class is executed in that runtime context, which also allows injection of a token using the inject function.  
```typescript
class MyComponent  {
  private service1: Service1;
  private service2: Service2 = inject(Service2); // In context
  constructor() {
    this.service1 = inject(Service1) // In context
  }
}
```  
<br>

### Stack frame in context  
Some APIs are designed to be run in an injection context. This is the case, for example, with router guards. This allows the use of inject within the guard function to access a service.  
Here is an example for CanActivateFn  
```typescript
const canActivateTeam: CanActivateFn =
    (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
      return inject(PermissionsService).canActivate(inject(UserToken), route.params.id);
    };
```  
<br>

### Run within an injection context  
When you want to run a given function in an injection context without already being in one, you can do so with runInInjectionContext. This requires access to a given injector, like the EnvironmentInjector, for example:  
```typescript
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private environmentInjector = inject(EnvironmentInjector);
  someMethod() {
    runInInjectionContext(this.environmentInjector, () => {
      inject(SomeService); // Do what you need with the injected service
    });
  }
}
```  
Note that inject will return an instance only if the injector can resolve the required token.