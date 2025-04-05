## :construction_site: What is the Angular Lifecycle?
Every Angular component follows a **lifecycle** that consists of **creation, update, and destruction** phases.  
Angular provides **lifecycle hooks** that allow you to execute custom logic at different stages.

---

## :scroll: Lifecycle Hooks Overview

| Hook Name          | Execution Phase | Description |
|--------------------|----------------|-------------|
| `constructor`      | **Instance Creation** | Initializes properties but no bindings are available yet. |
| `ngOnChanges`     | **On Input Changes** | Called when `@Input()` properties change. |
| `ngOnInit`        | **After First Init** | Called once after component is initialized. |
| `ngDoCheck`       | **Change Detection** | Called during every change detection cycle. |
| `ngAfterContentInit` | **Projected Content Initialized** | Called after `<ng-content>` is initialized. |
| `ngAfterContentChecked` | **Projected Content Checked** | Called after every content check. |
| `ngAfterViewInit` | **View (Child Components) Initialized** | Called after child components and templates are initialized. |
| `ngAfterViewChecked` | **View Checked** | Called after each view check. |
| `ngOnDestroy`     | **Component Destroyed** | Cleanup logic before component is removed. |

---

## :pushpin: **Component Lifecycle Flow**
:one: **Component Instance is Created (`constructor`)**  
:two: **`ngOnChanges()` fires if any `@Input()` values are passed**  
:three: **`ngOnInit()` runs after first initialization**  
:four: **Angular starts Change Detection (`ngDoCheck()`)**  
:five: **Content Projection (`<ng-content>`) initializes (`ngAfterContentInit()`)**  
:six: **Projected Content Checked (`ngAfterContentChecked()`)**  
:seven: **View (Template & Child Components) initializes (`ngAfterViewInit()`)**  
:eight: **View Checked (`ngAfterViewChecked()`)**  
:nine: **Component Updates Trigger Change Detection (`ngDoCheck()`)**  
:repeat: **Steps 4-8 Repeat on Changes**  
:keycap_ten: **Component Destroyed (`ngOnDestroy()`)**  

---

## :tools: Implementing Lifecycle Hooks in a Component
```typescript
import { Component, Input, OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-lifecycle-demo',
  template: `<p>Lifecycle demo: {{ data }}</p>`
})
export class LifecycleDemoComponent 
  implements OnChanges, OnInit, DoCheck, AfterContentInit, AfterContentChecked, AfterViewInit, AfterViewChecked, OnDestroy {
  
  @Input() data: string = '';

  constructor() {
    console.log('constructor 🚀');
  }

  ngOnChanges() {
    console.log('ngOnChanges 🔄 - Input property changed');
  }

  ngOnInit() {
    console.log('ngOnInit 🎯 - Component Initialized');
  }

  ngDoCheck() {
    console.log('ngDoCheck 🔍 - Change detection cycle running');
  }

  ngAfterContentInit() {
    console.log('ngAfterContentInit 🧩 - Projected content initialized');
  }

  ngAfterContentChecked() {
    console.log('ngAfterContentChecked ✅ - Projected content checked');
  }

  ngAfterViewInit() {
    console.log('ngAfterViewInit 👀 - View initialized');
  }

  ngAfterViewChecked() {
    console.log('ngAfterViewChecked 🔁 - View checked');
  }

  ngOnDestroy() {
    console.log('ngOnDestroy 💀 - Component destroyed');
  }
}
```

Key Lifecycle Hooks Explained
constructor()
Called first when the component is created.

Ideal for dependency injection, but avoid accessing bindings here.

gOnChanges(changes: SimpleChanges)
Fires before ngOnInit() and on every @Input() change.

Provides a SimpleChanges object with previous and current values.

ngOnChanges(changes: SimpleChanges) {
  console.log('Changes detected:', changes);
}
ngOnInit()
Runs once after the component initializes.

Ideal for fetching data, setting up subscriptions, etc.

ngDoCheck()
Fires on every change detection cycle.

Use this for custom change detection logic, but avoid heavy operations.

ngAfterContentInit()
Called once after content projection (<ng-content>) initializes.

Used to interact with content-projected components.

ngAfterContentChecked()
Runs after each change detection cycle, checking projected content.

ngAfterViewInit()
Called once after the view (template + child components) initializes.

Use it to access child components via @ViewChild().

@ViewChild('childComponent') childComp!: ChildComponent;

ngAfterViewInit() {
  console.log('Child component data:', this.childComp.someProperty);
}
ngAfterViewChecked()
Runs after every change detection cycle.

Used to respond to child component changes, but avoid performance-heavy logic.

:nine: ngOnDestroy()
Fires before the component is destroyed.

Ideal for cleanup tasks like:

Unsubscribing from Observables.

Detaching event listeners.

Stopping timers.

```typescript
ngOnDestroy() {
  this.subscription.unsubscribe(); // Prevent memory leaks
}
```
Best Practices
Use ngOnInit() instead of the constructor for initialization logic.
Unsubscribe from Observables in ngOnDestroy() to prevent memory leaks.
Avoid logic inside ngDoCheck() unless necessary (can impact performance).
Use ngAfterViewInit() for @ViewChild() access instead of ngOnInit().
Minimize logic in ngAfterViewChecked() to avoid performance issues.