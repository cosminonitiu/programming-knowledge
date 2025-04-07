## Creating an injectable service  
Service is a broad category encompassing any value, function, or feature that an application needs. A service is typically a class with a narrow, well-defined purpose. A component is one type of class that can use DI.  
<br>

Angular distinguishes components from services to increase modularity and reusability. By separating a component's view-related features from other kinds of processing, you can make your component classes lean and efficient.  
<br>

Ideally, a component's job is to enable the user experience and nothing more. A component should present properties and methods for data binding, to mediate between the view (rendered by the template) and the application logic (which often includes some notion of a model).  
<br>

A component can delegate certain tasks to services, such as fetching data from the server, validating user input, or logging directly to the console. By defining such processing tasks in an injectable service class, you make those tasks available to any component. You can also make your application more adaptable by configuring different providers of the same kind of service, as appropriate in different circumstances.  
<br>

Angular does not enforce these principles. Angular helps you follow these principles by making it easy to factor your application logic into services and make those services available to components through DI.  
<br>

### Service examples  
Here's an example of a service class that logs to the browser console:  
```typescript
export class Logger {
  log(msg: unknown) { console.log(msg); }
  error(msg: unknown) { console.error(msg); }
  warn(msg: unknown) { console.warn(msg); }
}
```  
Services can depend on other services. For example, here's a HeroService that depends on the Logger service, and also uses BackendService to get heroes. That service in turn might depend on the HttpClient service to fetch heroes asynchronously from a server:  
```typescript
import { inject } from "@angular/core";
export class HeroService {
  private heroes: Hero[] = [];
  private backend = inject(BackendService);
  private logger = inject(Logger);
  async getHeroes() {
    // Fetch
    this.heroes = await this.backend.getAll(Hero);
    // Log
    this.logger.log(`Fetched ${this.heroes.length} heroes.`);
    return this.heroes;
  }
}
```  
<br>

### Creating an injectable service  
The Angular CLI provides a command to create a new service. In the following example, you add a new service to an existing application.  
To generate a new HeroService class in the src/app/heroes folder, follow these steps:  
```typescript
ng generate service heroes/hero
```  
This command creates the following default HeroService:  
```typescript
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root',
})
export class HeroService {}
```  
The @Injectable() decorator specifies that Angular can use this class in the DI system. The metadata, providedIn: 'root', means that the HeroService is provided throughout the application.  
Add a getHeroes() method that returns the heroes from mock.heroes.ts to get the hero mock data:  
```typescript
import { Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
@Injectable({
  // declares that this service should be created
  // by the root application injector.
  providedIn: 'root',
})
export class HeroService {
  getHeroes() {
    return HEROES;
  }
}
```  
For clarity and maintainability, it is recommended that you define components and services in separate files.  
<br>

### Injecting services  
To inject a service as a dependency into a component, you can declare a class field representing the dependency and use Angular's inject function to initialize it.  
The following example specifies the HeroService in the HeroListComponent. The type of heroService is HeroService.  
```typescript
import { inject } from "@angular/core";
export class HeroListComponent {
  private heroService = inject(HeroService);
}
```  
It is also possible to inject a service into a component using the component's constructor:  
```typescript
constructor(private heroService: HeroService)
```  
The inject method can be used in both classes and functions, while the constructor method can naturally only be used in a class constructor. However, in either case a dependency may only be injected in a valid injection context, usually in the construction or initialization of a component.  
<br>

### Injecting services in other services  
When a service depends on another service, follow the same pattern as injecting into a component. In the following example, HeroService depends on a Logger service to report its activities:  
```typescript
import { inject, Injectable } from '@angular/core';
import { HEROES } from './mock-heroes';
import { Logger } from '../logger.service';
@Injectable({
  providedIn: 'root',
})
export class HeroService {
  private logger = inject(Logger);
  getHeroes() {
    this.logger.log('Getting heroes.');
    return HEROES;
  }
}
```  
In this example, the getHeroes() method uses the Logger service by logging a message when fetching heroes.