## Test requests  
As for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server. The @angular/common/http/testing library provides tools to capture requests made by the application, make assertions about them, and mock the responses to emulate your backend's behavior.  
<br>

The testing library is designed for a pattern in which the app executes code and makes requests first. The test then expects that certain requests have or have not been made, performs assertions against those requests, and finally provides responses by "flushing" each expected request.  
<br>

At the end, tests can verify that the app made no unexpected requests.  
<br>

## Setup for testing  
To begin testing usage of HttpClient, configure TestBed and include provideHttpClient() and provideHttpClientTesting() in your test's setup. This configures HttpClient to use a test backend instead of the real network. It also provides HttpTestingController, which you'll use to interact with the test backend, set expectations about which requests have been made, and flush responses to those requests. HttpTestingController can be injected from TestBed once configured.  
<br>

Keep in mind to provide provideHttpClient() before provideHttpClientTesting(), as provideHttpClientTesting() will overwrite parts of provideHttpCient(). Doing it the other way around can potentially break your tests.  
```typescript
TestBed.configureTestingModule({
  providers: [
    // ... other test providers
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});
const httpTesting = TestBed.inject(HttpTestingController);
```  
Now when your tests make requests, they will hit the testing backend instead of the normal one. You can use httpTesting to make assertions about those requests.  
<br>

## Expecting and answering requests  
For example, you can write a test that expects a GET request to occur and provides a mock response:  
```typescript
TestBed.configureTestingModule({
  providers: [
    ConfigService,
    provideHttpClient(),
    provideHttpClientTesting(),
  ],
});
const httpTesting = TestBed.inject(HttpTestingController);
// Load `ConfigService` and request the current configuration.
const service = TestBed.inject(ConfigService);
const config$ = this.configService.getConfig<Config>();
// `firstValueFrom` subscribes to the `Observable`, which makes the HTTP request,
// and creates a `Promise` of the response.
const configPromise = firstValueFrom(config$);
// At this point, the request is pending, and we can assert it was made
// via the `HttpTestingController`:
const req = httpTesting.expectOne('/api/config', 'Request to load the configuration');
// We can assert various properties of the request if desired.
expect(req.request.method).toBe('GET');
// Flushing the request causes it to complete, delivering the result.
req.flush(DEFAULT_CONFIG);
// We can then assert that the response was successfully delivered by the `ConfigService`:
expect(await configPromise).toEqual(DEFAULT_CONFIG);
// Finally, we can assert that no other requests were made.
httpTesting.verify();
```  
As an alternative to asserting on req.method, you could instead use an expanded form of expectOne to also match the request method:  
```typescript
const req = httpTesting.expectOne({
  method: 'GET',
  url: '/api/config',
}, 'Request to load the configuration');
```  
The last step, verifying that no requests remain outstanding, is common enough for you to move it into an afterEach() step:  
```typescript
afterEach(() => {
  // Verify that none of the tests make any extra HTTP requests.
  TestBed.inject(HttpTestingController).verify();
});
```  
<br>

## Handling more than one request at once  
If you need to respond to duplicate requests in your test, use the match() API instead of expectOne(). It takes the same arguments but returns an array of matching requests. Once returned, these requests are removed from future matching and you are responsible for flushing and verifying them.  
```typescript
const allGetRequests = httpTesting.match({method: 'GET'});
for (const req of allGetRequests) {
  // Handle responding to each request.
}
```  
<br>

## Advanced matching  
All matching functions accept a predicate function for custom matching logic:  
```typescript
// Look for one request that has a request body.
const requestsWithBody = httpTesting.expectOne(req => req.body !== null);
```  
The expectNone function asserts that no requests match the given criteria.  
```typescript
// Assert that no mutation requests have been issued.
httpTesting.expectNone(req => req.method !== 'GET');
```  
<br>

## Testing error handling  
You should test your app's responses when HTTP requests fail.  

### Backend Errors  
To test handling of backend errors (when the server returns a non-successful status code), flush requests with an error response that emulates what your backend would return when a request fails.  
```typescript
const req = httpTesting.expectOne('/api/config');
req.flush('Failed!', {status: 500, statusText: 'Internal Server Error'});
// Assert that the application successfully handled the backend error.
```  
<br>

### Network Errors  
Requests can also fail due to network errors, which surface as ProgressEvent errors. These can be delivered with the error() method:  
```typescript
const req = httpTesting.expectOne('/api/config');
req.error(new ProgressEvent('network error!'));
// Assert that the application successfully handled the network error.
```  
<br>

## Testing an Interceptor  
You should test that your interceptors work under the desired circumstances.  
For example, an application may be required to add an authentication token generated by a service to each outgoing request. This behavior can be enforced with the use of an interceptor:  
```typescript
export function authInterceptor(request: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const clonedRequest = request.clone({
    headers: request.headers.append('X-Authentication-Token', authService.getAuthToken()),
  });
  return next(clonedRequest);
}
```  
The TestBed configuration for this interceptor should rely on the withInterceptors feature.  
```typescript
TestBed.configureTestingModule({
  providers: [
    AuthService,
    // Testing one interceptor at a time is recommended.
    provideHttpClient(withInterceptors([authInterceptor])),
    provideHttpClientTesting(),
  ],
});
```  
The HttpTestingController can retrieve the request instance which can then be inspected to ensure that the request was modified.  
```typescript
const service = TestBed.inject(AuthService);
const req = httpTesting.expectOne('/api/config');
expect(req.request.headers.get('X-Authentication-Token')).toEqual(service.getAuthToken());
```  
A similar interceptor could be implemented with class based interceptors:  
```typescript
@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private authService = inject(AuthService);
  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    const clonedRequest = request.clone({
      headers: request.headers.append('X-Authentication-Token', this.authService.getAuthToken()),
    });
    return next.handle(clonedRequest);
  }
}
```  
In order to test it, the TestBed configuration should instead be:  
```typescript
TestBed.configureTestingModule({
  providers: [
    AuthService,
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClientTesting(), 
    // We rely on the HTTP_INTERCEPTORS token to register the AuthInterceptor as an HttpInterceptor
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
  ],
});
```  