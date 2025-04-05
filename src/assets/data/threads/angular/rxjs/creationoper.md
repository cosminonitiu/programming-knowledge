## 1. Basic Creation Operators

### of()
- **What It Does:**  
  Creates an Observable that emits the arguments you pass and then completes.
- **Usage Example:**
  ```typescript
  import { of } from 'rxjs';

  const numbers$ = of(1, 2, 3, 4, 5);
  numbers$.subscribe({
    next: num => console.log(num),
    complete: () => console.log('Completed')
  });
  // Output: 1 2 3 4 5 Completed
```

**from()**
What It Does:
Converts an array, promise, iterable, or even an Observable-like object into an Observable.

Usage Example:

```typescript
import { from } from 'rxjs';

const array$ = from([10, 20, 30]);
array$.subscribe({
  next: num => console.log(num),
  complete: () => console.log('Completed')
});
// Output: 10 20 30 Completed 
```

**fromEvent()**
What It Does:
Creates an Observable from DOM events, making it easy to react to user interactions.

Usage Example:

```typescript
import { fromEvent } from 'rxjs';

const clicks$ = fromEvent(document, 'click');
clicks$.subscribe(event => console.log('Clicked:', event)); 
```
// Each click on the document logs the event.

**2. Time-Based Creation Operators**
interval()
What It Does:
Emits sequential numbers at a constant interval.

Usage Example:

```typescript
import { interval } from 'rxjs';

const seconds$ = interval(1000); // emits 0, 1, 2, ... every second
seconds$.subscribe(num => console.log(`Second ${num}`)); 
```

**timer() **
What It Does:
Can act like a delayed of() or a periodic interval; it emits a single value after a delay or starts emitting repeatedly after an initial delay.

Usage Example:
```typescript
import { timer } from 'rxjs';

// Emit 0 after a 2000ms delay
const delayed$ = timer(2000);
delayed$.subscribe(val => console.log(`Delayed value: ${val}`));

// Emit 0, 1, 2,... starting after 2000ms every 1000ms
const periodic$ = timer(2000, 1000);
periodic$.subscribe(val => console.log(`Periodic value: ${val}`));
```

**3. Conditional and Dynamic Creation Operators**
**defer()**
What It Does:
Creates a fresh Observable for each new subscriber by deferring the creation until subscription time. This is useful when the Observable’s creation depends on some state.

Usage Example:

```typescript
import { defer, of } from 'rxjs';

let toggle = false;
const deferred$ = defer(() => {
  toggle = !toggle;
  return of(toggle);
});

deferred$.subscribe(val => console.log('Subscriber 1:', val)); // true
deferred$.subscribe(val => console.log('Subscriber 2:', val)); // false 
```
**iif()**
What It Does:
Conditionally creates one Observable or another based on a boolean condition.

Usage Example:

```typescript
import { iif, of } from 'rxjs';

const condition = true;
const observable$ = iif(
  () => condition,
  of('Condition is true'),
  of('Condition is false')
);

observable$.subscribe(val => console.log(val)); 
```

**4. Special Purpose Observables**
**throwError()**
What It Does:
Creates an Observable that immediately emits an error notification.

Usage Example:

```typescript
import { throwError } from 'rxjs';

const error$ = throwError(() => new Error('Something went wrong!'));
error$.subscribe({
  next: () => {},
  error: err => console.error('Caught error:', err.message)
});
```
**EMPTY and NEVER**
EMPTY:
An Observable that immediately completes without emitting any items.

NEVER:
An Observable that never emits anything and never completes.

```typescript
import { EMPTY, NEVER } from 'rxjs';

EMPTY.subscribe({
  complete: () => console.log('EMPTY completed')
});
// Output: "EMPTY completed"

NEVER.subscribe({
  next: () => console.log('This will never log'),
  complete: () => console.log('Nor will this')
});
```