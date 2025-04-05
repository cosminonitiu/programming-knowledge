## 1. tap()

- **Purpose:**  
  Perform side effects for notifications from the source Observable without altering the stream. Ideal for debugging or logging.
  
- **Example:**
  ```typescript
  import { of } from 'rxjs';
  import { tap, map } from 'rxjs/operators';

  of(1, 2, 3).pipe(
    tap(value => console.log('Before map:', value)),
    map(value => value * 10),
    tap(value => console.log('After map:', value))
  ).subscribe();
  // Logs:
  // Before map: 1
  // After map: 10
  // Before map: 2
  // After map: 20
  // Before map: 3
  // After map: 30
  ```

  **2. delay()**
Purpose:
Introduce a delay before each emission from the source Observable. Useful for simulating latency or deferring actions.

Example:

```typescript
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

of('Hello', 'World')
  .pipe(delay(1000)) // delays each emission by 1 second
  .subscribe(value => console.log(value));
// Output:
// (After 1 second) Hello
// (After another second) World
```

**3. timeout()**
Purpose:
Emits an error if a particular Observable does not emit a value within a given timeframe.

Example:

```typescript
import { of } from 'rxjs';
import { delay, timeout, catchError } from 'rxjs/operators';

of('Delayed Value')
  .pipe(
    delay(1500),
    timeout(1000), // throws an error if no value is emitted within 1 second
    catchError(err => of('Fallback Value'))
  )
  .subscribe(value => console.log(value));
// Output: Fallback Value
```

**4. defaultIfEmpty()**
Purpose:
Emits a default value if the source Observable completes without emitting any values.

Example:

```typescript
import { EMPTY } from 'rxjs';
import { defaultIfEmpty } from 'rxjs/operators';

EMPTY.pipe(
  defaultIfEmpty('No values emitted')
).subscribe(value => console.log(value));
// Output: No values emitted
```

**5. startWith() and endWith()**
startWith():
Prepends values to the beginning of the Observable sequence.

Example:

```typescript
import { of } from 'rxjs';
import { startWith } from 'rxjs/operators';

of(2, 3, 4)
  .pipe(startWith(1))
  .subscribe(value => console.log(value));
// Output: 1, 2, 3, 4 
```
endWith():
Appends values to the end of the Observable sequence.

Example:

```typescript
import { of } from 'rxjs';
import { endWith } from 'rxjs/operators';

of(1, 2, 3)
  .pipe(endWith(4))
  .subscribe(value => console.log(value));
// Output: 1, 2, 3, 4
```

**6. ignoreElements()**
Purpose:
Ignores all emissions from the source Observable, only passing through the complete or error notifications.

Example:

```typescript
import { of } from 'rxjs';
import { ignoreElements } from 'rxjs/operators';

of(1, 2, 3)
  .pipe(ignoreElements())
  .subscribe({
    next: () => console.log('This will not be logged'),
    complete: () => console.log('Completed without emissions')
  });
// Output: Completed without emissions
```

**7. observeOn() and subscribeOn()**
observeOn():
Specifies a scheduler on which to observe (i.e., when notifications are delivered to the observer). This can affect when the emissions are processed in relation to other asynchronous tasks.

Example:

```typescript
import { of, asyncScheduler } from 'rxjs';
import { observeOn } from 'rxjs/operators';

of('Task').pipe(
  observeOn(asyncScheduler)
).subscribe(value => console.log('Observed on async scheduler:', value)); 
```
subscribeOn():
Determines the scheduler on which the subscription side-effects will run. This is useful for deferring the work done when an Observable is subscribed to.

Example:
```typescript
import { of, asyncScheduler } from 'rxjs';
import { subscribeOn } from 'rxjs/operators';

of('Task').pipe(
  subscribeOn(asyncScheduler)
).subscribe(value => console.log('Subscribed on async scheduler:', value)); 
```