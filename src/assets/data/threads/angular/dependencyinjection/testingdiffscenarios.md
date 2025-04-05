** Injecting Dependencies in Different Scenarios**
1. Injecting Services into Components
```typescript
export class SomeComponent {
  constructor(private myService: MyService) { }
} 
```
2. Injecting Services into Other Services
```typescript
@Injectable({ providedIn: 'root' })
export class AnotherService {
  constructor(private myService: MyService) { }
} 
```
3. Injecting Built-in Services (e.g., HttpClient)
```typescript
import { HttpClient } from '@angular/common/http';

constructor(private http: HttpClient) { } 
```
4. Injecting Dependency Manually with inject()
```typescript
import { inject } from '@angular/core';

const myService = inject(MyService); 
```
Useful in environments where constructor injection isn't available (e.g., standalone functions).

**Testing Dependency Injection**
Mocking dependencies is crucial for unit testing.

Using TestBed to Override Dependencies
```typescript
TestBed.configureTestingModule({
  providers: [
    { provide: MyService, useClass: MockService }
  ]

}); 
```
Using spyOn for Mocks
```typescript
const service = TestBed.inject(MyService);
spyOn(service, 'method').and.returnValue(mockValue); 
```