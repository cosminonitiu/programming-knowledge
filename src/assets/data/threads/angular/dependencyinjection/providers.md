**Multi-Provider Pattern**
Sometimes, you may need multiple instances of a service.

Using Multi-Providers
```typescript
@Injectable()
export class LoggerService {
  log(msg: string) { console.log(msg); }
}

@NgModule({
  providers: [
    { provide: LoggerService, useClass: LoggerService, multi: true }
  ]
})
export class AppModule { } 
```
multi: true → Allows multiple providers for the same token.

**Different Types of Providers in Angular**
Angular allows various ways to define providers:

1. useClass (Alias for Another Class)
```typescript
class MockService extends MyService { }

providers: [{ provide: MyService, useClass: MockService }] 
```
Redirects MyService requests to MockService.

2. useExisting (Alias for an Existing Service)
```typescript
providers: [{ provide: LoggerService, useExisting: ConsoleLoggerService }] 
```
Both tokens (LoggerService and ConsoleLoggerService) share the same instance.

3. useValue (Provide a Constant)
```typescript
providers: [{ provide: 'API_URL', useValue: 'https://api.example.com' }] 
// 
```
Useful for injecting simple values like strings or numbers.

4. useFactory (Provide a Service with a Custom Factory)
```typescript
export function factoryFunction() {
  return new MyService();
}

providers: [{ provide: MyService, useFactory: factoryFunction }] 
```
Useful when a service needs custom logic during instantiation.