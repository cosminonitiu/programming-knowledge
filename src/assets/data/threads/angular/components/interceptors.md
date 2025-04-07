## 1. Overview of Interceptors

- **What Are Interceptors?**  
  Interceptors are middleware-like services that implement Angular's `HttpInterceptor` interface. They sit between your application and the backend, allowing you to preprocess outgoing HTTP requests and postprocess incoming HTTP responses.

- **Why Use Interceptors?**  
  - **Centralized Logic:**  
    Implement cross-cutting concerns (e.g., authentication tokens, logging, error handling) in one place.
  - **Code Reuse:**  
    Avoid duplicating logic across multiple services.
  - **Security & Performance:**  
    Modify or block requests/responses as needed, improving security and error resilience.

*(Reference: Angular official documentation on HttpInterceptors)*

---

## 2. Creating a Custom HTTP Interceptor

### Implementing the HttpInterceptor Interface
To create an HTTP interceptor, you need to implement the `HttpInterceptor` interface. This interface requires a single method: `intercept()`, which takes an `HttpRequest` and a `HttpHandler`.

#### Example: Adding an Authentication Token
```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Get the auth token from a service (e.g., AuthService)
    const authToken = 'your-auth-token';

    // Clone the request and set the new header in one step.
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });

    // Pass on the cloned request instead of the original request.
    return next.handle(authReq);
  }
}
```

**Registering the Interceptor**
Register your interceptor in the providers array of your Angular module with the multi-provider configuration:

```typescript
import { HTTP_INTERCEPTORS } from '@angular/common/http';

@NgModule({
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }
  ]
})
export class AppModule { }
```

**3. Chaining and Order of Interceptors**
**Multiple Interceptors:**
Angular supports registering multiple interceptors. They are called in the order in which they are provided in the module.

**Execution Flow:**

**Outgoing Requests:**
Each interceptor’s intercept() method is called sequentially, and each interceptor can modify the request before passing it on.

**Incoming Responses:**
The response is processed in the reverse order—last interceptor’s response handler is executed first.

**Best Practice:**
Order your interceptors logically. For example, an authentication interceptor should generally run before a logging interceptor so that logged requests include the authentication header.

**4. Advanced Error Handling in Interceptors**
Interceptors are an excellent place to implement global error handling. You can catch errors from the HTTP response stream and handle them appropriately.

Example: Global Error Handling Interceptor
```typescript
import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private router: Router) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        // Handle different error statuses here
        if (error.status === 401) {
          // For example, redirect to login on unauthorized access
          this.router.navigate(['/login']);
        }
        // Log error or send it to a logging service
        console.error('Error intercepted:', error);
        // Rethrow the error so it can be caught by subscribing components if needed
        return throwError(() => error);
      })
    );
  }
}
```

**5. Beyond HTTP: Other Interceptor Concepts**
While HTTP interceptors are the most common, the interceptor pattern can be extended to other parts of an application. For instance:

**Router Interceptors:**
Although not built-in like HTTP interceptors, you can create guard-like mechanisms to intercept routing events.

**Custom Service Interceptors:**
You might implement your own intercepting layer for service calls or WebSocket communications by following similar design patterns—centralizing common logic and error handling.