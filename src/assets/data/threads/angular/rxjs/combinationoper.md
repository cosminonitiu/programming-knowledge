## 1. merge()

- **Purpose:**  
  Merge emissions from two or more Observables concurrently into a single Observable.
  
- **Key Points:**  
  - Does not wait for one Observable to complete before subscribing to the next.
  - Order of emissions is interleaved, based on when each Observable emits.

- **Example:**
  ```typescript
  import { of, merge } from 'rxjs';
  import { delay } from 'rxjs/operators';

  const obs1$ = of('A').pipe(delay(1000));
  const obs2$ = of('B').pipe(delay(500));
  const obs3$ = of('C');

  merge(obs1$, obs2$, obs3$).subscribe(value => console.log('merge:', value));
  // Expected Output (order may vary):
  // merge: C
  // merge: B
  // merge: A
  ```

  **2. concat()**
Purpose:
Concatenates multiple Observables sequentially, waiting for each to complete before subscribing to the next.

Key Points:

Ensures order of emissions based on the order of concatenation.

Useful when the sequence of events matters.

Example:

```typescript
import { of, concat } from 'rxjs';
import { delay } from 'rxjs/operators';

const first$ = of('First').pipe(delay(500));
const second$ = of('Second').pipe(delay(300));
const third$ = of('Third');

concat(first$, second$, third$).subscribe(value => console.log('concat:', value));
// Output:
// concat: First
// concat: Second
// concat: Third
```

**3. combineLatest()**
Purpose:
Combines the latest values from multiple Observables whenever any of them emits.

Key Points:

Emits only after all source Observables have emitted at least once.

Useful for synchronizing streams that update at different intervals.

Example:

```typescript
import { of, combineLatest, interval } from 'rxjs';
import { delay, take } from 'rxjs/operators';

const source1$ = of('A').pipe(delay(1000)); // Emits once after 1 second
const source2$ = interval(500).pipe(take(3)); // Emits 0, 1, 2

combineLatest([source1$, source2$]).subscribe(([val1, val2]) => {
  console.log('combineLatest:', val1, val2);
});
// Output (after both have emitted):
// combineLatest: A 0
// combineLatest: A 1
// combineLatest: A 2
```

**4. forkJoin()**
Purpose:
Waits for all input Observables to complete, then emits a single array (or projected value) of their last emitted values.

Key Points:

Ideal for parallel requests that need to be synchronized after completion.

If any Observable does not complete, forkJoin will never emit.

Example:

```typescript
import { forkJoin, of } from 'rxjs';
import { delay } from 'rxjs/operators';

const request1$ = of('Result 1').pipe(delay(1000));
const request2$ = of('Result 2').pipe(delay(1500));
const request3$ = of('Result 3').pipe(delay(500));

forkJoin([request1$, request2$, request3$]).subscribe(results => {
  console.log('forkJoin:', results);
});
// Output (after all complete):
// forkJoin: ['Result 1', 'Result 2', 'Result 3']
```

**5. zip()**
Purpose:
Combines emissions from multiple Observables by grouping the nth emission from each Observable together.

Key Points:

Waits for each Observable to emit before combining them.

If one Observable emits fewer values, zip completes once that Observable completes.

Example:

```typescript
import { of, zip } from 'rxjs';

const letters$ = of('A', 'B', 'C');
const numbers$ = of(1, 2, 3, 4);

zip(letters$, numbers$).subscribe(([letter, number]) => {
  console.log('zip:', letter, number);
});
// Output:
// zip: A 1
// zip: B 2
// zip: C 3
// Note: The fourth value from numbers$ is ignored.
```

**6. withLatestFrom()**
Purpose:
When the source Observable emits, it combines that value with the latest values from one or more other Observables.

Key Points:

The main source drives the emission.

Useful for combining a triggering event with the latest available state.

Example:

```typescript
import { interval, of } from 'rxjs';
import { withLatestFrom, take } from 'rxjs/operators';

const source$ = interval(1000).pipe(take(3)); // Emits 0, 1, 2 every second
const state$ = of('State'); // Emits once immediately

source$.pipe(
  withLatestFrom(state$)
).subscribe(([num, state]) => {
  console.log('withLatestFrom:', num, state);
});
// Output:
// withLatestFrom: 0 State
// withLatestFrom: 1 State
// withLatestFrom: 2 State
```