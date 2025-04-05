## 1. What is RxJS?

RxJS (Reactive Extensions for JavaScript) is a library that enables reactive programming by using Observables. It allows you to work with asynchronous data streams (such as events, HTTP requests, or timers) with a consistent and declarative API.

- **Reactive Programming:**  
  A programming paradigm focused on data streams and the propagation of change. Instead of imperatively handling events or state, you describe how your data should flow and transform over time.

- **Why RxJS?**  
  It simplifies complex asynchronous tasks, offers powerful operators for transformation and composition, and promotes a clear separation of concerns.

---

## 2. Observables

### Definition
An **Observable** is the core primitive in RxJS. It represents a stream of data that can emit zero or more values over time, and then either completes or errors out.

### Creating an Observable
You can create an Observable using the `Observable` constructor or helper creation functions like `of()`, `from()`, `interval()`, etc.

#### Example:
```typescript
import { Observable } from 'rxjs';

const observable = new Observable<number>(subscriber => {
  let counter = 0;
  // Emit a value every second
  const intervalId = setInterval(() => {
    subscriber.next(counter++);
    // Complete after 5 emissions
    if (counter > 5) {
      subscriber.complete();
      clearInterval(intervalId);
    }
  }, 1000);

  // Teardown logic: executed upon unsubscription
  return () => {
    console.log('Unsubscribed!');
    clearInterval(intervalId);
  };
});
```

**Characteristics:**
**Lazy:**
Observables don’t produce values until there is a subscriber.
**
Composable:**
You can transform, filter, and combine streams using operators.

**Cancelable:**
Subscriptions can be unsubscribed to prevent memory leaks or stop execution.

**3. Observers and Subscriptions**
**Observers**
An Observer is an object that defines how to handle the values, errors, and completion notifications emitted by an Observable. It typically implements three callbacks:

next: Called with each new value.
error: Called if an error occurs.
complete: Called when the Observable completes.

```typescript
const observer = {
  next: (value: number) => console.log('Value:', value),
  error: (err: any) => console.error('Error:', err),
  complete: () => console.log('Completed')
};
```

**Subscriptions**
A Subscription represents the execution of an Observable. When you subscribe to an Observable, you receive a Subscription object that allows you to cancel the subscription (unsubscribe).

Example:
```typescript
const subscription = observable.subscribe(observer);

// Unsubscribe after 4 seconds to cancel further emissions.
setTimeout(() => {
  subscription.unsubscribe();
}, 4000); 
```

**4. Cold vs. Hot Observables**
**Cold Observables**
Definition:
Cold Observables start emitting values only when they are subscribed to. Every subscriber gets its own independent execution.

Example:
HTTP requests typically create cold Observables so each subscription triggers a separate request.

**Hot Observables**
Definition:
Hot Observables emit values regardless of individual subscriptions. Subscribers share the same execution and might miss values emitted before subscription.

Example:
User input events (e.g., mouse movements) are hot; if you subscribe late, you won’t see past events.

Understanding the difference is crucial for scenarios like multicasting and resource sharing.