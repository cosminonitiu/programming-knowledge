## Async reactivity with resources  
Most signal APIs are synchronous— signal, computed, input, etc. However, applications often need to deal with data that is available asynchronously. A ```Resource``` gives you a way to incorporate async data into your application's signal-based code.  
<br>

You can use a ```Resource``` to perform any kind of async operation, but the most common use-case for ```Resource``` is fetching data from a server. The following example creates a resource to fetch some user data.  
<br>

The easiest way to create a ```Resource``` is the ```resource``` function.  
```typescript
import {resource, Signal} from '@angular/core';
const userId: Signal<string> = getUserId();
const userResource = resource({
  // Define a reactive request computation.
  // The request value recomputes whenever any read signals change.
  request: () => ({id: userId()}),
  // Define an async loader that retrieves data.
  // The resource calls this function every time the `request` value changes.
  loader: ({request}) => fetchUser(request),
});
// Create a computed signal based on the result of the resource's loader function.
const firstName = computed(() => userResource.value().firstName);
```  
The ```resource``` function accepts a ```ResourceOptions``` object with two main properties: request and loader.  
<br>

The request property defines a reactive computation that produce a request value. Whenever signals read in this computation change, the ```resource``` produces a new request value, similar to computed.  
<br>

The loader property defines a ```ResourceLoader—``` an async function that retrieves some state. The ```resource``` calls the loader every time the request computation produces a new value, passing that value to the loader. See ```Resource``` loaders below for more details.  
<br>

### Resource loaders  
When creating a ```resource```, you specify a ResourceLoader. This loader is an async function that accepts a single parameter— a ResourceLoaderParams object— and returns a value.  
<br>

The ResourceLoaderParams object contains three properties: request, previous, and abortSignal.  
<br>

```Property```	```Description``` 

---  
```request```	The value of the ```resource```'s request computation.  

---  
```previous```	An object with a status property, containing the previous ResourceStatus.  

---  
```abortSignal```	An AbortSignal. See Aborting requests below for details.  
<br>

If the request computation returns undefined, the loader function does not run and the ```resource``` status becomes Idle.  
<br>

### Aborting requests  
A ```resource``` aborts an outstanding request if the request computation changes while the ```resource``` is loading.  
<br>

You can use the abortSignal in ResourceLoaderParams to respond to aborted requests. For example, the native fetch function accepts an AbortSignal:  
```typescript
const userId: Signal<string> = getUserId();
const userResource = resource({
  request: () => ({id: userId()}),
  loader: ({request, abortSignal}): Promise<User> => {
    // fetch cancels any outstanding HTTP requests when the given `AbortSignal`
    // indicates that the request has been aborted.
    return fetch(`users/${request.id}`, {signal: abortSignal});
  },
});
```  
See AbortSignal on MDN for more details on request cancellation with AbortSignal.  
<br>

### Reloading  
You can programmatically trigger a resource's loader by calling the reload method.  
```typescript
const userId: Signal<string> = getUserId();
const userResource = resource({
  request: () => ({id: userId()}),
  loader: ({request}) => fetchUser(request),
});
// ...
userResource.reload();
```  
<br>

### Resource status  
The resource object has several signal properties for reading the status of the asynchronous loader.  
<br>

```Property```	```Description``` 

---  
```value```	The most recent value of the resource, or ```undefined``` if no value has been received.

---  
```hasValue```		Whether the resource has a value.  

---  
```error```	The most recent error encountered while running the resource's loader, or ```undefined``` if no error has occurred.  

---  
```isLoading```	Whether the resource loader is currently running.   

---  
```status```		The resource's specific ```ResourceStatus```, as described below.  
<br>  

The ```status``` signal provides a specific ```ResourceStatus``` that describes the state of the resource.  
<br>

```Status```	```Value```   ```Description```    

---  
```Idle```  ```undefined```		The resource has no valid request and the loader has not run.  

---  
```Error```  ```undefined```		The loader has encountered an error.  

---  
```Loading```  ```undefined```		The loader is running as a result of the ```request``` value changing.  

---  
```Reloading```  ```Previous value	```	The loader is running as a result calling of the resource's ```reload``` method.  

---  
```Resolved```  ```Resolved value	```		The loader has completed.    

---  
```Local```  ```Locally set value```	The resource's value has been set locally via ```.set()``` or ```.update()```  
<br>

You can use this status information to conditionally display user interface elements, such loading indicators and error messages.