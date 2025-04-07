## Interceptors  
HttpClient supports two kinds of interceptors: functional and DI-based. Our recommendation is to use functional interceptors because they have more predictable behavior, especially in complex setups. Our examples in this guide use functional interceptors, and we cover DI-based interceptors in their own section at the end.  
<br>

## Overview  
Interceptors are generally functions which you can run for each request, and have broad capabilities to affect the contents and overall flow of requests and responses. You can install multiple interceptors, which form an interceptor chain where each interceptor processes the request or response before forwarding it to the next interceptor in the chain.  
<br>

You can use interceptors to implement a variety of common patterns, such as:  
<br>

Adding authentication headers to outgoing requests to a particular API.  
Retrying failed requests with exponential backoff.  
Caching responses for a period of time, or until invalidated by mutations.  
Customizing the parsing of responses.  
Measuring server response times and log them.  
Driving UI elements such as a loading spinner while network operations are in progress.  
Collecting and batch requests made within a certain timeframe.  
Automatically failing requests after a configurable deadline or timeout.  
Regularly polling the server and refreshing results.  
<br>

## Defining an interceptor  
 The basic form of an interceptor is a function which receives the outgoing HttpRequest and a next function representing the next processing step in the interceptor chain.  
 <br>

For example, this loggingInterceptor will log the outgoing request URL to console.log before forwarding the request:  
```typescript
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  console.log(req.url);
  return next(req);
}
```  
In order for this interceptor to actually intercept requests, you must configure HttpClient to use it.  
<br>

## Configuring interceptors  
You declare the set of interceptors to use when configuring HttpClient through dependency injection, by using the withInterceptors feature:  
```typescript
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    withInterceptors([loggingInterceptor, cachingInterceptor]),
  )
]});
```  
The interceptors you configure are chained together in the order that you've listed them in the providers. In the above example, the loggingInterceptor would process the request and then forward it to the cachingInterceptor.  
<br>

## Intercepting response events  
An interceptor may transform the Observable stream of HttpEvents returned by next in order to access or manipulate the response. Because this stream includes all response events, inspecting the .type of each event may be necessary in order to identify the final response object.  
```typescript
export function loggingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  return next(req).pipe(tap(event => {
    if (event.type === HttpEventType.Response) {
      console.log(req.url, 'returned a response with status', event.status);
    }
  }));
}
```  
## Modifying requests  
Most aspects of HttpRequest and HttpResponse instances are immutable, and interceptors cannot directly modify them. Instead, interceptors apply mutations by cloning these objects using the .clone() operation, and specifying which properties should be mutated in the new instance. This might involve performing immutable updates on the value itself (like HttpHeaders or HttpParams).  
```typescript
const reqWithHeader = req.clone({
  headers: req.headers.set('X-New-Header', 'new header value'),
});
```  
This immutability allows most interceptors to be idempotent if the same HttpRequest is submitted to the interceptor chain multiple times. This can happen for a few reasons, including when a request is retried after failure.  
<br>

## Dependency injection in interceptors  
Interceptors are run in the injection context of the injector which registered them, and can use Angular's inject API to retrieve dependencies.  
<br>


For example, suppose an application has a service called AuthService, which creates authentication tokens for outgoing requests. An interceptor can inject and use this service:  
```typescript
export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  // Inject the current `AuthService` and use it to get an authentication token:
  const authToken = inject(AuthService).getAuthToken();
  // Clone the request to add the authentication header.
  const newReq = req.clone({
    headers: req.headers.append('X-Authentication-Token', authToken),
  });
  return next(newReq);
}
```  
<br>

## Request and response metadata  
Often it's useful to include information in a request that's not sent to the backend, but is specifically meant for interceptors. HttpRequests have a .context object which stores this kind of metadata as an instance of HttpContext. This object functions as a typed map, with keys of type HttpContextToken.  
<br>

To illustrate how this system works, let's use metadata to control whether a caching interceptor is enabled for a given request.  
<br>

## Defining context tokens  
To store whether the caching interceptor should cache a particular request in that request's .context map, define a new HttpContextToken to act as a key:  
```typescript
export const CACHING_ENABLED = new HttpContextToken<boolean>(() => true);
```  
The provided function creates the default value for the token for requests that haven't explicitly set a value for it. Using a function ensures that if the token's value is an object or array, each request gets its own instance.  
<br>

## Reading the token in an interceptor  
An interceptor can then read the token and choose to apply caching logic or not based on its value:  
```typescript
export function cachingInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  if (req.context.get(CACHING_ENABLED)) {
    // apply caching logic
    return ...;
  } else {
    // caching has been disabled for this request
    return next(req);
  }
}
```  
<br>

## Setting context tokens when making a request  
When making a request via the HttpClient API, you can provide values for HttpContextTokens:  
```typescript
const data$ = http.get('/sensitive/data', {
  context: new HttpContext().set(CACHING_ENABLED, false),
});
```  
Interceptors can read these values from the HttpContext of the request.  
<br>

## The request context is mutable  
Unlike other properties of HttpRequests, the associated HttpContext is mutable. If an interceptor changes the context of a request that is later retried, the same interceptor will observe the context mutation when it runs again. This is useful for passing state across multiple retries if needed.  
<br>

## Synthetic responses  
Most interceptors will simply invoke the next handler while transforming either the request or the response, but this is not strictly a requirement. This section discusses several of the ways in which an interceptor may incorporate more advanced behavior.  
<br>

Interceptors are not required to invoke next. They may instead choose to construct responses through some other mechanism, such as from a cache or by sending the request through an alternate mechanism.  
<br>

Constructing a response is possible using the HttpResponse constructor:  
```typescript
const resp = new HttpResponse({
  body: 'response body',
});
```  
<br>

## DI-based interceptors  
HttpClient also supports interceptors which are defined as injectable classes and configured through the DI system. The capabilities of DI-based interceptors are identical to those of functional interceptors, but the configuration mechanism is different.  
<br>

A DI-based interceptor is an injectable class which implements the HttpInterceptor interface:  
```typescript
@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, handler: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request URL: ' + req.url);
    return handler.handle(req);
  }
}
```  
DI-based interceptors are configured through a dependency injection multi-provider:  
```typescript
bootstrapApplication(AppComponent, {providers: [
  provideHttpClient(
    // DI-based interceptors must be explicitly enabled.
    withInterceptorsFromDi(),
  ),
  {provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true},
]});
```  
DI-based interceptors run in the order that their providers are registered. In an app with an extensive and hierarchical DI configuration, this order can be very hard to predict. 