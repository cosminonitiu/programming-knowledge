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