## Rendering Optimizations: trackBy, track, and Beyond

Preventing unnecessary DOM re-renders is one of the highest-impact performance optimizations in Angular. The key tool is `trackBy` in `*ngFor` (old) and `track` in `@for` (new).

---

## 1. The Problem: Default `*ngFor` / `@for` Behavior

Without tracking, Angular uses object reference identity:

```typescript
// If this array is replaced (e.g., from an API response), Angular destroys
// and recreates ALL DOM elements, even if the data is identical
this.surveys = await this.api.getSurveys(); // new array reference = all items re-rendered
```

Symptom: input focus lost, animations reset, components flashing on "reload".

---

## 2. `trackBy` in `*ngFor`

```typescript
// component
trackById(index: number, item: Survey): string {
  return item.id;
}

// template
<li *ngFor="let survey of surveys; trackBy: trackById">
  {{ survey.title }}
</li>
```

With tracking: Angular reuses existing DOM elements when `id` is the same, even if the object reference changed.

---

## 3. `track` in the New `@for` Block (Angular 17+)

The new control flow block requires `track` — it's not optional:

```html
@for (survey of surveys; track survey.id) {
  <li>{{ survey.title }}</li>
}

<!-- For static/index-based lists where identity doesn't matter -->
@for (item of staticList; track $index) {
  <li>{{ item }}</li>
}
```

`$index` tracking should only be used for truly static lists — never for lists that change, as it defeats the purpose.

---

## 4. OnPush + Immutable Updates

Combine `trackBy`/`track` with `OnPush` change detection for maximum effect:

```typescript
// ✅ Correct — immutable update, OnPush detects input change
this.surveys = this.surveys.map(s =>
  s.id === updatedSurvey.id ? { ...s, ...updatedSurvey } : s
);

// ❌ Wrong — mutates array, OnPush won't detect change, DOM won't update
this.surveys.find(s => s.id === updatedSurvey.id)!.title = 'New Title';
```

---

## 5. `@defer` for Lazy Rendering Performance

The `@defer` block lazy-loads components until they're needed:

```html
<!-- Load the heavy chart only when visible in viewport -->
@defer (on viewport) {
  <app-analytics-chart [data]="chartData" />
} @placeholder {
  <div class="chart-skeleton"></div>
} @loading {
  <app-spinner />
}

<!-- Load only when idle (after initial render) -->
@defer (on idle) {
  <app-recommendations />
}

<!-- Load when a specific interaction happens -->
@defer (on interaction(triggerElement)) {
  <app-comments />
}
```

---

## 6. Pure Pipes Over Methods in Templates

Template methods are called on every change detection cycle:

```html
<!-- ❌ Calls formatDate() on every CD cycle -->
<td>{{ formatDate(survey.createdAt) }}</td>

<!-- ✅ Pipe result is cached — only recalculates when input changes -->
<td>{{ survey.createdAt | date:'shortDate' }}</td>
```

For custom transformations:

```typescript
@Pipe({ name: 'truncate', pure: true, standalone: true })
export class TruncatePipe implements PipeTransform {
  transform(value: string, limit = 100): string {
    return value.length > limit ? value.slice(0, limit) + '...' : value;
  }
}
```

**`pure: true`** (default) means Angular only re-evaluates when the input reference changes — same as `memoize`.

---

## 7. `runOutsideAngular` for Non-UI Operations

```typescript
private ngZone = inject(NgZone);

// Runs a chart animation without triggering Angular's change detection
this.ngZone.runOutsideAngular(() => {
  this.chart.animate(); // heavy animation — doesn't need CD
});

// When you need to re-enter Angular's zone to update the view
this.ngZone.run(() => {
  this.chartReady.set(true);
});
```

---

## 8. Performance Audit Checklist

| Symptom | Likely Cause | Fix |
|---|---|---|
| Entire list re-renders on data refresh | No `trackBy`/`track` | Add `track item.id` |
| Component re-renders when parent changes | Default CD strategy | Add `OnPush` |
| UI freezes on scroll | Too many DOM nodes | Virtual scroll |
| Template method called excessively | Method in template | Replace with pipe |
| 3rd party library triggers CD continuously | Not in zone | `runOutsideAngular` |

---

## Architect Notes

- `@for` with `track` is strictly better than `*ngFor` with `trackBy` — migrate when on Angular 17+
- The biggest wins in order: (1) virtual scroll for large lists, (2) `OnPush` everywhere, (3) `track` on all loops
- Measure before optimizing — use Angular DevTools' profiler to find which components are actually slow
