## 1. catchError

- **Purpose:**  
  Intercepts an error from the source Observable and returns a new Observable (which may emit replacement values, a fallback Observable, or simply complete).

- **Usage Example:**
  ```typescript
  import { of, throwError } from 'rxjs';
  import { catchError } from 'rxjs/operators';

  const source$ = throwError(() => new Error('Oops! Something went wrong'));

  source$.pipe(
    catchError(err => {
      console.error('Error caught:', err.message);
      // Return a fallback Observable
      return of('Fallback value');
    })
  ).subscribe({
    next: value => console.log('Received:', value),
    complete: () => console.log('Completed')
  });
  // Output:
  // Error caught: Oops! Something went wrong
  // Received: Fallback value
  // Completed
  ```

  **2. retry**
Purpose:
Automatically re-subscribes to the source Observable when an error occurs, up to a specified number of retry attempts.

Usage Example:

```typescript
import { throwError, of } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';

let attempt = 0;
const source$ = throwError(() => {
  attempt++;
  return new Error(`Failure on attempt ${attempt}`);
});

source$.pipe(
  retry(2), // Retry 2 additional times
  catchError(err => of(`Handled error: ${err.message}`))
).subscribe({
  next: value => console.log('Output:', value),
  complete: () => console.log('Completed')
});
// Output:
// Output: Handled error: Failure on attempt 3
// Completed
```

**3. retryWhen**
Purpose:
Provides a more flexible retry mechanism by allowing you to determine when and how to retry, based on notifications from an error Observable.

Usage Example:

```typescript
import { throwError, timer } from 'rxjs';
import { retryWhen, mergeMap } from 'rxjs/operators';

let attempt = 0;
const source$ = throwError(() => {
  attempt++;
  return new Error(`Error on attempt ${attempt}`);
});

source$.pipe(
  retryWhen(errors =>
    errors.pipe(
      mergeMap(err => {
        if (attempt < 3) {
          // Wait 1 second before retrying
          console.log('Retrying in 1 second...');
          return timer(1000);
        } else {
          // If retries are exhausted, throw error
          return throwError(() => err);
        }
      })
    )
  )
).subscribe({
  next: value => console.log('Output:', value),
  error: err => console.error('Final error:', err.message),
  complete: () => console.log('Completed')
});
// Output:
// Retrying in 1 second...
// Retrying in 1 second...
// Final error: Error on attempt 3 
```

**4. throwError**
Purpose:
Creates an Observable that immediately emits an error. Useful for testing error handling or generating an error condition in a pipeline.

Usage Example:

```typescript
import { throwError } from 'rxjs';

const error$ = throwError(() => new Error('Immediate error'));
error$.subscribe({
  next: () => {},
  error: err => console.error('Error:', err.message),
  complete: () => console.log('Completed')
});
// Output:
// Error: Immediate error
```

**5. finaliz**e
Purpose:
Invokes a specified function when the Observable terminates—whether it completes successfully, errors out, or is unsubscribed. It’s useful for cleanup tasks.

Usage Example:

```typescript
import { of } from 'rxjs';
import { finalize } from 'rxjs/operators';

of('a', 'b', 'c').pipe(
  finalize(() => console.log('Cleanup: Observable terminated'))
).subscribe({
  next: value => console.log('Value:', value),
  complete: () => console.log('Completed')
});
// Output:
// Value: a
// Value: b
// Value: c
// Completed
// Cleanup: Observable terminated
```