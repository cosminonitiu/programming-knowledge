## Making HTTP requests  
HttpClient has methods corresponding to the different HTTP verbs used to make requests, both to load data and to apply mutations on the server. Each method returns an RxJS Observable which, when subscribed, sends the request and then emits the results when the server responds.  
<br>

Through an options object passed to the request method, various properties of the request and the returned response type can be adjusted.  
<br>

## Fetching JSON data  
Fetching data from a backend often requires making a GET request using the HttpClient.get() method. This method takes two arguments: the string endpoint URL from which to fetch, and an optional options object to configure the request.  
<br>

For example, to fetch configuration data from a hypothetical API using the HttpClient.get() method:  
```typescript
http.get<Config>('/api/config').subscribe(config => {
  // process the configuration.
});
```  
Note the generic type argument which specifies that the data returned by the server will be of type Config. This argument is optional, and if you omit it then the returned data will have type Object.  
<br>

## Fetching other types of data  
By default, HttpClient assumes that servers will return JSON data. When interacting with a non-JSON API, you can tell HttpClient what response type to expect and return when making the request. This is done with the responseType option.  
<br>

responseType value	Returned response type  
'json' (default)	JSON data of the given generic type  
'text'	string data  
'arraybuffer'	ArrayBuffer containing the raw response bytes  
'blob'	Blob instance  
<br>

For example, you can ask HttpClient to download the raw bytes of a .jpeg image into an ArrayBuffer:  
```typescript
http.get('/images/dog.jpg', {responseType: 'arraybuffer'}).subscribe(buffer => {
  console.log('The image is ' + buffer.byteLength + ' bytes large');
});
```  
Literal value for responseType  
<br>

Because the value of responseType affects the type returned by HttpClient, it must have a literal type and not a string type.  
<br>

This happens automatically if the options object passed to the request method is a literal object, but if you're extracting the request options out into a variable or helper method you might need to explicitly specify it as a literal, such as responseType: 'text' as const.  
<br>

## Mutating server state  
Server APIs which perform mutations often require making POST requests with a request body specifying the new state or the change to be made.  
<br>

The HttpClient.post() method behaves similarly to get(), and accepts an additional body argument before its options:  
```typescript
http.post<Config>('/api/config', newConfig).subscribe(config => {
  console.log('Updated config:', config);
});
```  
Many different types of values can be provided as the request's body, and HttpClient will serialize them accordingly:  
<br>

body type	Serialized as  
string	Plain text  
number, boolean, array, or plain object	JSON  
ArrayBuffer	raw data from the buffer  
Blob	raw data with the Blob's content type  
FormData	multipart/form-data encoded data  
HttpParams or URLSearchParams	application/x-www-form-urlencoded formatted string  
<br>

## Setting URL parameters  
Specify request parameters that should be included in the request URL using the params option.  
Passing an object literal is the simplest way of configuring URL parameters:  
```typescript
http.get('/api/config', {
  params: {filter: 'all'},
}).subscribe(config => {
  // ...
});
```  
Alternatively, pass an instance of HttpParams if you need more control over the construction or serialization of the parameters.  
```typescript
const baseParams = new HttpParams().set('filter', 'all');
http.get('/api/config', {
  params: baseParams.set('details', 'enabled'),
}).subscribe(config => {
  // ...
});
```  
You can instantiate HttpParams with a custom HttpParameterCodec that determines how HttpClient will encode the parameters into the URL.  
<br>

## Setting request headers  
Specify request headers that should be included in the request using the headers option.  
Passing an object literal is the simplest way of configuring request headers:  
```typescript
http.get('/api/config', {
  headers: {
    'X-Debug-Level': 'verbose',
  }
}).subscribe(config => {
  // ...
});
```  
Alternatively, pass an instance of HttpHeaders if you need more control over the construction of headers  
```typescript
const baseHeaders = new HttpHeaders().set('X-Debug-Level', 'minimal');
http.get<Config>('/api/config', {
  headers: baseHeaders.set('X-Debug-Level', 'verbose'),
}).subscribe(config => {
  // ...
});
```  
<br>

## Interacting with the server response events  
For convenience, HttpClient by default returns an Observable of the data returned by the server (the response body).   Occasionally it's desirable to examine the actual response, for example to retrieve specific response headers.  
<br>

To access the entire response, set the observe option to 'response':  
```typescript
http.get<Config>('/api/config', {observe: 'response'}).subscribe(res => {
  console.log('Response status:', res.status);
  console.log('Body:', res.body);
});
```  
Literal value for observe  
<br>

This happens automatically if the options object passed to the request method is a literal object, but if you're extracting the request options out into a variable or helper method you might need to explicitly specify it as a literal, such as observe: 'response' as const.  
<br>

## Receiving raw progress events  
In addition to the response body or response object, HttpClient can also return a stream of raw events corresponding to specific moments in the request lifecycle. These events include when the request is sent, when the response header is returned, and when the body is complete. These events can also include progress events which report upload and download status for large request or response bodies.  
<br>

Progress events are disabled by default (as they have a performance cost) but can be enabled with the reportProgress option.  
To observe the event stream, set the observe option to 'events':  
```typescript
http.post('/api/upload', myData, {
  reportProgress: true,
  observe: 'events',
}).subscribe(event => {
  switch (event.type) {
    case HttpEventType.UploadProgress:
      console.log('Uploaded ' + event.loaded + ' out of ' + event.total + ' bytes');
      break;
    case HttpEventType.Response:
      console.log('Finished uploading!');
      break;
  }
});
```  
Literal value for observe  
<br>

Because the value of observe affects the type returned by HttpClient, it must have a literal type and not a string type.  
<br>

This happens automatically if the options object passed to the request method is a literal object, but if you're extracting the request options out into a variable or helper method you might need to explicitly specify it as a literal, such as observe: 'events' as const.  
<br>

Each HttpEvent reported in the event stream has a type which distinguishes what the event represents:  
<br>

type value	Event meaning  
HttpEventType.Sent	The request has been dispatched to the server  
HttpEventType.UploadProgress	An HttpUploadProgressEvent reporting progress on uploading the request body  
HttpEventType.ResponseHeader	The head of the response has been received, including status and headers  
HttpEventType.DownloadProgress	An HttpDownloadProgressEvent reporting progress on downloading the response body  
HttpEventType.Response	The entire response has been received, including the response body  
HttpEventType.User	A custom event from an Http interceptor.  
<br>

## Handling request failure  
There are two ways an HTTP request can fail:  
<br>

A network or connection error can prevent the request from reaching the backend server.  
The backend can receive the request but fail to process it, and return an error response.  
<br>

HttpClient captures both kinds of errors in an HttpErrorResponse which it returns through the Observable's error channel. Network errors have a status code of 0 and an error which is an instance of ProgressEvent. Backend errors have the failing status code returned by the backend, and the error response as the error. Inspect the response to identify the error's cause and the appropriate action to handle the error.  
<br>

The RxJS library offers several operators which can be useful for error handling.  
<br>

You can use the catchError operator to transform an error response into a value for the UI. This value can tell the UI to display an error page or value, and capture the error's cause if necessary.  
<br>

Sometimes transient errors such as network interruptions can cause a request to fail unexpectedly, and simply retrying the request will allow it to succeed. RxJS provides several retry operators which automatically re-subscribe to a failed Observable under certain conditions. For example, the retry() operator will automatically attempt to re-subscribe a specified number of times.  
<br>

## Http Observables  
Each request method on HttpClient constructs and returns an Observable of the requested response type. Understanding how these Observables work is important when using HttpClient.  
<br>

HttpClient produces what RxJS calls "cold" Observables, meaning that no actual request happens until the Observable is subscribed. Only then is the request actually dispatched to the server. Subscribing to the same Observable multiple times will trigger multiple backend requests. Each subscription is independent.  
<br>

TIP: You can think of HttpClient Observables as blueprints for actual server requests.  
<br>

Once subscribed, unsubscribing will abort the in-progress request. This is very useful if the Observable is subscribed via the async pipe, as it will automatically cancel the request if the user navigates away from the current page. Additionally, if you use the Observable with an RxJS combinator like switchMap, this cancellation will clean up any stale requests.  
<br>

Once the response returns, Observables from HttpClient usually complete (although interceptors can influence this).  
<br>

Because of the automatic completion, there is usually no risk of memory leaks if HttpClient subscriptions are not cleaned up. However, as with any async operation, we strongly recommend that you clean up subscriptions when the component using them is destroyed, as the subscription callback may otherwise run and encounter errors when it attempts to interact with the destroyed component.  
<br>

TIP: Using the async pipe or the toSignal operation to subscribe to Observables ensures that subscriptions are disposed properly.  
<br>

## Best practices  
While HttpClient can be injected and used directly from components, generally we recommend you create reusable, injectable services which isolate and encapsulate data access logic. For example, this UserService encapsulates the logic to request data for a user by their id:  
```typescript
@Injectable({providedIn: 'root'})
export class UserService {
  private http = inject(HttpClient);
  getUser(id: string): Observable<User> {
    return this.http.get<User>(`/api/user/${id}`);
  }
}
```  
Within a component, you can combine @if with the async pipe to render the UI for the data only after it's finished loading:  
```typescript
import { AsyncPipe } from '@angular/common';
@Component({
  imports: [AsyncPipe],
  template: `
    @if (user$ | async; as user) {
      <p>Name: {{ user.name }}</p>
      <p>Biography: {{ user.biography }}</p>
    }
  `,
})
export class UserProfileComponent {
  @Input() userId!: string;
  user$!: Observable<User>;
  private userService = inject(UserService);
  constructor(): void {
    this.user$ = this.userService.getUser(this.userId);
  }
}
```  