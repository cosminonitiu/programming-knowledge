## `OnPush` Change Detection — Architect-Level Guide

`OnPush` is the single most impactful change detection optimization in Angular. Understanding it deeply is mandatory for architect-level roles.

---

## 1. Default vs OnPush

| | Default (`CheckAlways`) | `OnPush` |
|---|---|---|
| When CD runs | On every browser event, timer, XHR | Only on specific triggers |
| Performance | Checks entire component tree | Skips subtree unless triggered |
| Mental model | Angular re-checks everything | You declare when state can change |

---

## 2. The Four `OnPush` Triggers

Angular skips an `OnPush` component during a change detection cycle **unless** one of these occurs:

### 1. A new object/array reference arrives via `@Input`

```typescript
// Parent template
<app-survey-list [surveys]="surveys" />

// This does NOT trigger OnPush CD — same reference
this.surveys.push(newSurvey);

// This DOES trigger OnPush CD — new reference
this.surveys = [...this.surveys, newSurvey];
```

### 2. An `@Output` event or DOM event fires inside the component

```typescript
// Clicking a button inside the OnPush component triggers CD for that component
<button (click)="onAdd()">Add</button>
```

### 3. An Observable bound with `async` pipe emits

```typescript
// The async pipe calls markForCheck() on emission — triggers the component
<li *ngFor="let s of surveys$ | async">{{ s.title }}</li>
```

### 4. `markForCheck()` or `detectChanges()` called manually

```typescript
constructor(private cdr: ChangeDetectorRef) {}

// Mark this component and its ancestors for checking on the next CD cycle
updateFromExternalSource(data: Survey[]) {
  this.surveys = data;
  this.cdr.markForCheck();
}

// Run CD synchronously for this component only
triggerImmediately() {
  this.cdr.detectChanges();
}
```

---

## 3. `markForCheck()` vs `detectChanges()`

| | `markForCheck()` | `detectChanges()` |
|---|---|---|
| When it runs | On the next CD cycle | Immediately / synchronously |
| What it checks | Component + ancestors | Component + descendants |
| Use case | Signal an async update | Imperative CD for embedded views |

---

## 4. Signals + `OnPush` — The Modern Pattern

With Angular signals, `OnPush` components update automatically when their signals change — no `markForCheck()` needed:

```typescript
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h2>{{ title() }}</h2>
    <p>Total surveys: {{ count() }}</p>
  `
})
export class SurveyHeaderComponent {
  title = input.required<string>();    // signal input
  count = input(0);                    // signal input

  // Signal reads in template — component marks itself when signal changes
}
```

Signal-based components with `OnPush` are the most efficient pattern in Angular 17+.

---

## 5. Common `OnPush` Bugs and Fixes

### Bug 1: Mutating input object

```typescript
// Parent
onEdit() {
  this.selectedSurvey.title = 'Updated';   // MUTATION — OnPush child won't update
}

// Fix: create new reference
onEdit() {
  this.selectedSurvey = { ...this.selectedSurvey, title: 'Updated' };
}
```

### Bug 2: setTimeout without `markForCheck`

```typescript
// OnPush component — won't update after timeout
ngOnInit() {
  setTimeout(() => {
    this.message = 'Loaded';
    // CD won't run — no trigger
  }, 1000);
}

// Fix
ngOnInit() {
  setTimeout(() => {
    this.message = 'Loaded';
    this.cdr.markForCheck();  // explicitly schedule CD
  }, 1000);
}
```

### Bug 3: Service pushes data without triggering CD

```typescript
// Service updates data — component won't know
// Fix: use Observable + async pipe, or signals

// Service
private _surveys = new BehaviorSubject<Survey[]>([]);
surveys$ = this._surveys.asObservable();

// Component: bind with async pipe — triggers markForCheck automatically
<li *ngFor="let s of surveys$ | async">{{ s.title }}</li>
```

---

## 6. Architecture Rule

> **Apply `OnPush` to every component by default, especially dumb/presenter components.**

The Angular performance story is: `OnPush` everywhere + immutable state + `async` pipe or signals = minimal change detection work.

---

## Architect Interview Notes

- **The `async` pipe is the cleanest `OnPush` solution** — it calls `markForCheck()` on every emission and unsubscribes on destroy automatically.
- **Signals are even cleaner** — no pipe, no `markForCheck`, just reads in the template.
- `detectChanges()` is a code smell in most cases — it indicates the component is fighting Angular's CD system. Prefer `markForCheck()` or reactive patterns.
- **Immutability is a prerequisite for `OnPush`** — the pattern breaks if you mutate objects instead of replacing references. This is why NgRx reducers return new state objects.
- **CV connection:** *"At Aumovio, setting `OnPush` as the default in our component templates reduced unnecessary change detection cycles significantly, especially on the survey response pages with hundreds of rendered items."*
