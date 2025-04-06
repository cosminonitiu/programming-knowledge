## RxJS interop with Angular signals  
The ```@angular/rxjs-interop``` package offers APIs that help you integrate RxJS and Angular signals.  
<br>

### Create a signal from an RxJs Observable with toSignal  
Use the ```toSignal``` function to create a signal which tracks the value of an ```Observable```. It behaves similarly to the async pipe in templates, but is more flexible and can be used anywhere in an application.  
```typescript
import { Component } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { interval } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';
@Component({
  template: `{{ counter() }}`,
})
export class Ticker {
  counterObservable = interval(1000);
  // Get a `Signal` representing the `counterObservable`'s value.
  counter = toSignal(this.counterObservable, {initialValue: 0});
}
```  
Like the async pipe, toSignal subscribes to the Observable immediately, which may trigger side effects. The subscription created by toSignal automatically unsubscribes from the given Observable when the component or service which calls toSignal is destroyed.  
<br>

**IMPORTANT**: toSignal creates a subscription. You should avoid calling it repeatedly for the same Observable, and instead reuse the signal it returns.  
<br>

#### Injection context  
toSignal by default needs to run in an injection context, such as during construction of a component or service. If an injection context is not available, you can manually specify the Injector to use instead.  
<br>

#### Initial values
Observables may not produce a value synchronously on subscription, but signals always require a current value. There are several ways to deal with this "initial" value of toSignal signals.  
<br>

#### The initialValue option  
As in the example above, you can specify an initialValue option with the value the signal should return before the Observable emits for the first time.  
<br>

#### undefined initial values  
If you don't provide an initialValue, the resulting signal will return undefined until the Observable emits. This is similar to the async pipe's behavior of returning null.  
<br>

#### The requireSync option  
Some Observables are guaranteed to emit synchronously, such as BehaviorSubject. In those cases, you can specify the requireSync: true option.  
<br>

When requiredSync is true, toSignal enforces that the Observable emits synchronously on subscription. This guarantees that the signal always has a value, and no undefined type or initial value is required.  
<br>

#### manualCleanup  
By default, toSignal automatically unsubscribes from the Observable when the component or service that creates it is destroyed.  
<br>

To override this behavior, you can pass the manualCleanup option. You can use this setting for Observables that complete themselves naturally.  
<br>

#### Error and Completion  
If an Observable used in toSignal produces an error, that error is thrown when the signal is read.  
<br>

If an Observable used in toSignal completes, the signal continues to return the most recently emitted value before completion.  
<br>

### Create an RxJS Observable from a signal with toObservable  
Use the toObservable utility to create an Observable which tracks the value of a signal. The signal's value is monitored with an effect which emits the value to the Observable when it changes.  
```typescript
import { Component, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
@Component(...)
export class SearchResults {
  query: Signal<string> = inject(QueryService).query;
  query$ = toObservable(this.query);
  results$ = this.query$.pipe(
    switchMap(query => this.http.get('/search?q=' + query ))
  );
}
```  
As the query signal changes, the query$ Observable emits the latest query and triggers a new HTTP request.  
<br>

#### Injection context  
toObservable by default needs to run in an injection context, such as during construction of a component or service. If an injection context is not available, you can manually specify the Injector to use instead.  
<br>

### Timing of toObservable  
toObservable uses an effect to track the value of the signal in a ReplaySubject. On subscription, the first value (if available) may be emitted synchronously, and all subsequent values will be asynchronous.  
<br>

Unlike Observables, signals never provide a synchronous notification of changes. Even if you update a signal's value multiple times, toObservable will only emit the value after the signal stabilizes.  
```typescript
const obs$ = toObservable(mySignal);
obs$.subscribe(value => console.log(value));
mySignal.set(1);
mySignal.set(2);
mySignal.set(3);
```  
Here, only the last value (3) will be logged.  
<br>

### Creating an output based on an RxJs Observable  
The outputFromObservable lets you create a component or directive output that emits based on an RxJS observable:  
```typescript
import {Directive} from '@angular/core';
import {outputFromObservable} from '@angular/core/rxjs-interop';
@Directive({/*...*/})
class Draggable {
  pointerMoves$: Observable<PointerMovements> = listenToPointerMoves();
  
  // Whenever `pointerMoves$` emits, the `pointerMove` event fires.
  pointerMove = outputFromObservable(this.pointerMoves$);
}
```  
The outputFromObservable function has special meaning to the Angular compiler. You may only call outputFromObservable in component and directive property initializers.  
<br>

When you subscribe to the output, Angular automatically forwards the subscription to the underlying observable. Angular stops forwarding values when the component or directive is destroyed.  
<br>

**Helpful**  Consider using output() directly if you can emit values imperatively.  
<br>

### Creating an RxJS Observable from a component or directive output  
The outputToObservable function lets you create an RxJS observable from a component output.  
```typescript
import {outputToObservable} from '@angular/core/rxjs-interop';
@Component(/*...*/)
class CustomSlider {
  valueChange = output<number>();
}
// Instance reference to `CustomSlider`.
const slider: CustomSlider = createSlider();
outputToObservable(slider.valueChange) // Observable<number>
  .pipe(...)
  .subscribe(...);
```  
**HELPFUL** Consider using the subscribe method on OutputRef directly if it meets your needs.