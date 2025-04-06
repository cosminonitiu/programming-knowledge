## Motivation and Background

### The Need for a New Reactive Primitive

- **Traditional State Management:**  
  Until recently, Angular developers largely relied on RxJS Observables, component properties, and NgRx-style state management to handle application state. While powerful, these patterns can introduce complexity with subscriptions, change detection triggers, and boilerplate code.  
  While Observables are designed for asynchronous data streams, signals are optimized for synchronous state updates.  
<br>

- **Fine-Grained Reactivity:**  
  Angular Signals aim to offer a more direct and granular way to manage reactive state. Unlike Observables that are designed to model streams of asynchronous events, signals are optimized for state that changes over time and require minimal overhead for propagation.
<br>

### How Signals Fit in Angular’s Ecosystem
- **Complementary to Existing Techniques:**  
  Signals can be used alongside Observables. They are especially useful for local component state and derived computations. A signal is essentially a function that internally tracks its dependencies.
<br>

- **Enhanced Change Detection:**  
  Signals are tightly integrated with Angular’s change detection. When a signal changes, only the parts of the template that depend on it are updated, leading to more efficient rendering.  
  When you bind a signal directly in an Angular template (e.g., {{ counter() }}), Angular automatically subscribes to changes. Unlike Observables that often require the AsyncPipe, signals update the view immediately upon change.

<br>

---
<br>

## 1. Introduction to Angular Signals

- **What They Are:**  
  Signals are reactive primitives that hold state and automatically notify subscribers when their values change. They provide a simple API for creating reactive state without the overhead of Observables.
<br>

- **Why They Matter:**  
&nbsp;&nbsp;1. **Fine-Grained Reactivity:** Signals trigger updates only where needed, leading to more efficient change detection.  
&nbsp;&nbsp;2. **Simplicity:** They offer a straightforward API (e.g., `signal()`, `computed()`, and `effect()`) that reduces boilerplate and improves code readability.  
&nbsp;&nbsp;3. **Integration:** Signals integrate seamlessly with Angular’s template binding and component architecture, paving the way for a more modern reactive model.  
<br>

---
<br>

## 2. Creating and Updating Signals

- **Creating a Signal:**  
  Use the `signal()` function to initialize a reactive value.
  ```typescript
  import { signal } from '@angular/core';

  const count = signal(0);
  ```

**Reading and Updating:**

Reading: Invoke the signal like a function to get its current value.

```typescript
console.log(count()); // Outputs: 0 
```
Updating: Use methods like .set(newValue) or .update(fn) to change the signal’s value.

```typescript
count.set(5);
// or update based on current value:
count.update(current => current + 1);
```
Best Practice:
Keep your signals as the single source of truth for component state. This promotes a more predictable data flow and minimizes side-effects.  
<br>

**3. Computed Signals**  
Computed signals derive their value from one or more other signals. They update automatically whenever their dependencies change.  

Creating a Computed Signal:

```typescript
import { computed } from '@angular/core';

const count: WritableSignal<number> = signal(0);
const doubleCount: Signal<number> = computed(() => count() * 2);

console.log(doubleCount()); // Outputs: 4 
```
Use Cases:
Deriving formatted data from raw state.
Aggregating or combining multiple signal values.  
<br>

### Computed signals are both lazily evaluated and memoized
`doubleCount`'s derivation function does not run to calculate its value until the first time you read `doubleCount`. The calculated value is then cached, and if you read `doubleCount` again, it will return the cached value without recalculating.
If you then change count, `Angular` knows that `doubleCount`'s cached value is no longer valid, and the next time you read `doubleCount` its new value will be calculated.
As a result, you can safely perform computationally expensive derivations in computed signals, such as filtering arrays.
*Note: Computed signals are not writable signals  
<br>

### Computed signal dependencies are dynamic
Only the signals actually read during the derivation are tracked. For example, in this computed the count signal is only read if the `showCount` signal is `true`:

```typescript
const showCount = signal(false);
const count = signal(0);
const conditionalCount = computed(() => {
  if (showCount()) {
    return `The count is ${count()}.`;
  } else {
    return 'Nothing to see here!';
  }
});
```

When you read `conditionalCount`, if `showCount` is `false` the `"Nothing to see here!"` message is returned without reading the `count` signal. This means that if you later update `count` it will not result in a recomputation of `conditionalCount`.
If you set `showCount` to true and then read `conditionalCount` again, the derivation will re-execute and take the branch where `showCount` is true, returning the message which shows the value of count. Changing `count` will then invalidate `conditionalCount`'s cached value.
Note that dependencies can be removed during a derivation as well as added. If you later set `showCount` back to false, then count will no longer be considered a dependency of `conditionalCount`.  
<br>

**4. Reading signals in `OnPush` components**
When you read a signal within an `OnPush` component's template, Angular tracks the signal as a dependency of that component. When the value of that signal changes, Angular automatically `marks` the component to ensure it gets updated the next time change detection runs. Refer to the `Skipping component` subtrees guide for more information about `OnPush` components.  
<br>

**5. Effects and Side-Effects**
What Are Effects?
Effects run a function in response to changes in one or more signals. They are ideal for executing side effects (e.g., logging, API calls) when state updates.  

Creating an Effect:

```typescript
import { effect } from '@angular/core';

const count = signal(0);
effect(() => {
  console.log('Count changed to:', count());
});

// Updating the signal triggers the effect.
count.set(10);  // Logs: Count changed to: 10 
```
Effects always run at least once. When an effect runs, it tracks any signal value reads. Whenever any of these signal values change, the effect runs again. Similar to computed signals, effects keep track of their dependencies dynamically, and only track signals which were read in the most recent execution.

Effects always execute asynchronously, during the change detection process.  
<br>

### Use cases for effects

Effects are rarely needed in most application code, but may be useful in specific circumstances. Here are some examples of situations where an `effect` might be a good solution:

- Logging data being displayed and when it changes, either for analytics or as a debugging tool.
- Keeping data in sync with `window.localStorage`.
- Adding custom DOM behavior that can't be expressed with template syntax.
- Performing custom rendering to a `<canvas>`, charting library, or other third party UI library.

---

`When not to use effects`
Avoid using effects for propagation of state changes. This can result in `ExpressionChangedAfterItHasBeenChecked` errors, infinite circular updates, or unnecessary change detection cycles.

Instead, use `computed` signals to model state that depends on other state.  
<br>

---  
<br>

### Injection Context

By default, you can only create an `effect()` within an `injection context` (where you have access to the `inject` function). The easiest way to satisfy this requirement is to call `effect` within a component, directive, or service constructor:

```typescript
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  constructor() {
    // Register a new effect.
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    });
  }
}
```

Alternatively, you can assign the effect to a field (which also gives it a descriptive name).

```typescript
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  private loggingEffect = effect(() => {
    console.log(`The count is: ${this.count()}`);
  });
}
```

To create an effect outside the constructor, you can pass an `Injector` to `effect` via its options:

```typescript
@Component({...})
export class EffectiveCounterComponent {
  readonly count = signal(0);
  private injector = inject(Injector);
  initializeLogging(): void {
    effect(() => {
      console.log(`The count is: ${this.count()}`);
    }, {injector: this.injector});
  }
}
```  
<br>

### Destroying effects

When you create an effect, it is automatically destroyed when its enclosing context is destroyed. This means that effects created within components are destroyed when the component is destroyed. The same goes for effects within directives, services, etc.

Effects return an `EffectRef` that you can use to destroy them manually, by calling the `.destroy()` method. You can combine this with the `manualCleanup` option to create an effect that lasts until it is manually destroyed. Be careful to actually clean up such effects when they're no longer required.  
<br>

**6. Using Signals in Angular Templates**
Template Binding:
Signals can be used directly in Angular templates. When a signal’s value changes, Angular’s change detection automatically updates the view.

Example:

```html
<!-- In your component template -->
<p>Current count: {{ count() }}</p>
<button (click)="count.update(n => n + 1)">Increment</button> 
```
Here, count() is invoked in the template to read its current value, and the button click updates the signal.

Advantage:
This integration eliminates the need for manual change detection or additional pipes (like AsyncPipe) when working with state.  
<br>

**7. Advanced TOpics**  
<br>

### Signal equality functions
When creating a signal, you can optionally provide an equality function, which will be used to check whether the new value is actually different than the previous one.

```typescript
import _ from 'lodash';
const data = signal(['test'], {equal: _.isEqual});
// Even though this is a different array instance, the deep equality
// function will consider the values to be equal, and the signal won't
// trigger any updates.
data.set(['test']);
```
Equality functions can be provided to both writable and computed signals.
** By default, signals use referential equality (Object.is() comparison). **  
<br>

### Reading without tracking dependencies

Rarely, you may want to execute code which may read signals within a reactive function such as `computed` or `effect` without creating a dependency.

For example, suppose that when `currentUser` changes, the value of a `counter` should be logged. you could create an `effect` which reads both signals:

```typescript
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${counter()}`);
});
```

This example will log a message when either ```currentUser``` or ```counter``` changes. However, if the effect should only run when ```currentUser``` changes, then the read of ```counter``` is only incidental and changes to ```counter``` shouldn't log a new message.

You can prevent a signal read from being tracked by calling its getter with ```untracked```:

```typescript
effect(() => {
  console.log(`User set to ${currentUser()} and the counter is ${untracked(counter)}`);
});
```

```untracked``` is also useful when an effect needs to invoke some external code which shouldn't be treated as a dependency:
```typescript
effect(() => {
  const user = currentUser();
  untracked(() => {
    // If the `loggingService` reads signals, they won't be counted as
    // dependencies of this effect.
    this.loggingService.log(`User set to ${user}`);
  });
});
```  
<br>

### Effect cleanup functions
Effects might start long-running operations, which you should cancel if the effect is destroyed or runs again before the first operation finished. When you create an effect, your function can optionally accept an ```onCleanup``` function as its first parameter. This ```onCleanup``` function lets you register a callback that is invoked before the next run of the effect begins, or when the effect is destroyed.

```typescript
effect((onCleanup) => {
  const user = currentUser();
  const timer = setTimeout(() => {
    console.log(`1 second ago, the user became ${user}`);
  }, 1000);
  onCleanup(() => {
    clearTimeout(timer);
  });
});
```  
<br>

**8. Best Practices with Signals**  
<br>

**Encapsulate State:**
Use signals to hold local component state and expose only what’s necessary. This can help in building more modular and reusable components.  
<br>

**Favor Computed Over Manual Updates:**
Leverage computed signals for derived state instead of manually managing multiple Observables or recalculations.  
<br>

**Side Effects Should Be Isolated:**
Keep effects focused solely on side effects (e.g., logging, external API calls) and not on updating core state.  
<br>

**Gradual Adoption:**
Signals can coexist with traditional RxJS Observables. Consider gradually refactoring parts of your application to use signals where they simplify state management.  
<br>

**Testing:**
Signals are functions, making them straightforward to test. Ensure you write unit tests that assert the reactive behavior of both simple and computed signals.  
<br>