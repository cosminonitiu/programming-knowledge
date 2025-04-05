The Change Detection Process
Change Detection is Triggered
User interactions (click, input, keydown).

HTTP requests resolving.

Timers (setTimeout(), setInterval()).

Promises resolving (Promise.then()).

Angular events (@Output event emitter).

Angular Walks the Component Tree
Starts at the root component.

Checks each child component recursively.

Skips components with OnPush if no @Input() reference changed.

DOM Updates if Changes Are Found
If a component’s state changed, Angular updates its view.

:rocket: **Optimizing Change Detection**
:one: OnPush with Immutable Data
Avoid modifying objects directly.
Instead, create new references to trigger Change Detection.
:x: Mutating an array (does NOT trigger OnPush):

```typescript
this.items.push(newItem); // UI will NOT update with OnPush 
```

Replacing the array (triggers OnPush):

```typescript
this.items = [...this.items, newItem]; // UI updates! 
```
markForCheck() (Manually Trigger Change Detection)
Useful when OnPush doesn't detect a change automatically.

```typescript
import { ChangeDetectorRef } from '@angular/core';

constructor(private cdr: ChangeDetectorRef) {}

updateUI() {
  this.cdr.markForCheck(); // Tells Angular to check this component
}
detectChanges() (Force Immediate Update) 
```
Forces Change Detection only on the current component and its children.

```typescript
this.cdr.detectChanges();
```
Use cautiously! It can hurt performance.