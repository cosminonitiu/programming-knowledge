## 1. Mapping Operators

### map()
- **Purpose:**  
  Transforms each emission from the source Observable by applying a projection function.
- **Example:**
  ```typescript
  import { of } from 'rxjs';
  import { map } from 'rxjs/operators';

  const numbers$ = of(1, 2, 3, 4);
  const squared$ = numbers$.pipe(
    map(num => num * num)
  );

  squared$.subscribe(val => console.log(val));
  // Output: 1, 4, 9, 16
```

**mapTo()**
Purpose:
Maps every emission to the same constant value.

Example:

```typescript
import { of } from 'rxjs';
import { mapTo } from 'rxjs/operators';

of('a', 'b', 'c')
  .pipe(mapTo('constant'))
  .subscribe(val => console.log(val));
// Output: 'constant' 'constant' 'constant' 
```

**pluck()**
Purpose:
Extracts a specific property from each object emitted by the source.

Example:

```typescript
import { of } from 'rxjs';
import { pluck } from 'rxjs/operators';

const users$ = of(
  { name: 'Alice', age: 30 },
  { name: 'Bob', age: 25 }
);

users$.pipe(pluck('name'))
  .subscribe(name => console.log(name));
// Output: 'Alice', 'Bob' 
```

**2. Accumulation and Reduction Operators**
**scan()**
Purpose:
Works like reduce() but emits the intermediate accumulated results with each emission.

Example:

```typescript
import { of } from 'rxjs';
import { scan } from 'rxjs/operators';

const numbers$ = of(1, 2, 3, 4);
const accumulated$ = numbers$.pipe(
  scan((acc, curr) => acc + curr, 0)
);

accumulated$.subscribe(total => console.log(total));
// Output: 1, 3, 6, 10 
```

**3. Flattening Operators (Higher-Order Mapping)**
These operators transform each emitted value into a new Observable, and then “flatten” the emissions into a single Observable stream.

**mergeMap (a.k.a. flatMap)**
Purpose:
Projects each source value to an Observable, then merges the emissions of these inner Observables concurrently.

Example:

```typescript
import { of } from 'rxjs';
import { delay, mergeMap } from 'rxjs/operators';

const source$ = of('A', 'B');
source$.pipe(
  mergeMap(letter => of(letter + '1').pipe(delay(1000)))
).subscribe(val => console.log(val));
// Output: 'A1' and 'B1' emitted as soon as their inner Observable completes (order not guaranteed) 
```

**switchMap**
Purpose:
Projects each source value to an Observable, but switches to the new Observable on each emission—canceling any previous inner Observable.

Example:

```typescript
import { of, interval } from 'rxjs';
import { switchMap, take } from 'rxjs/operators';

// Simulate a stream of clicks that trigger an interval Observable
const clicks$ = of('click');
clicks$.pipe(
  switchMap(() => interval(1000).pipe(take(3)))
).subscribe(val => console.log(val));
// Output: 0, 1, 2 (only the latest inner Observable is subscribed) 
```

**concatMap**
Purpose:
Projects each value to an Observable and concatenates them—waiting for each inner Observable to complete before moving to the next.

Example:

```typescript
import { of } from 'rxjs';
import { concatMap, delay } from 'rxjs/operators';

const source$ = of('X', 'Y', 'Z');
source$.pipe(
  concatMap(letter => of(letter + '!').pipe(delay(500)))
).subscribe(val => console.log(val));
// Output: 'X!', then 'Y!', then 'Z!' in order 
```

**exhaustMap**
Purpose:
Projects each source value to an Observable, but ignores new emissions while a previous inner Observable is still executing.

Example:
```typescript
import { of, interval } from 'rxjs';
import { exhaustMap, take } from 'rxjs/operators';

// Simulate rapid emissions
const rapid$ = of('Start', 'Ignore', 'Ignore');
rapid$.pipe(
  exhaustMap(() => interval(1000).pipe(take(2)))
).subscribe(val => console.log(val));
// Output: 0, 1 (ignores subsequent emissions while the inner Observable is active) 
```