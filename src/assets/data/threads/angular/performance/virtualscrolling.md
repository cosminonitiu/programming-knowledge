## CDK Virtual Scrolling

Virtual scrolling renders only the DOM elements visible in the viewport — the rest are rendered on demand as the user scrolls. Essential for lists of hundreds or thousands of items.

---

## 1. Why Virtual Scroll?

Without virtual scroll:
- 10,000 items → 10,000 DOM nodes
- Rendering, layout, and change detection for every item
- Browser becomes sluggish or freezes

With virtual scroll:
- 10,000 items → ~20 DOM nodes visible at once
- Only visible items are rendered/updated

---

## 2. Basic Usage

```bash
npm install @angular/cdk
```

```typescript
import { ScrollingModule } from '@angular/cdk/scrolling';

@Component({
  standalone: true,
  imports: [ScrollingModule],
  template: `
    <cdk-virtual-scroll-viewport itemSize="48" class="list-viewport">
      <div *cdkVirtualFor="let item of items" class="list-item">
        {{ item.name }}
      </div>
    </cdk-virtual-scroll-viewport>
  `,
  styles: [`
    .list-viewport { height: 400px; }
    .list-item { height: 48px; }   /* must match itemSize */
  `]
})
export class SurveyListComponent {
  items = signal<Survey[]>([]);
}
```

**Critical:** `itemSize` must be set in pixels and match the actual rendered height of each item.

---

## 3. With a DataSource (Recommended for Large Datasets)

For very large datasets, use a `DataSource` to load data on demand:

```typescript
import { DataSource, CollectionViewer } from '@angular/cdk/collections';

@Injectable()
export class SurveyDataSource extends DataSource<Survey> {
  private surveys = signal<Survey[]>([]);
  private loading = signal(false);

  connect(viewer: CollectionViewer): Observable<Survey[]> {
    // Load more data as the user scrolls
    viewer.viewChange.subscribe(({ start, end }) => {
      this.loadRange(start, end);
    });
    return toObservable(this.surveys);
  }

  disconnect() {}

  private loadRange(start: number, end: number) {
    // Load from API if needed
  }
}
```

```html
<cdk-virtual-scroll-viewport itemSize="64">
  <div *cdkVirtualFor="let survey of dataSource" class="survey-row">
    {{ survey.title }}
  </div>
</cdk-virtual-scroll-viewport>
```

---

## 4. Variable Size Items

When items have different heights, use `AutoSizeVirtualScrollStrategy` (experimental) or pre-calculate sizes:

```typescript
import { AutoSizeVirtualScrollStrategy, VIRTUAL_SCROLL_STRATEGY } from '@angular/cdk/scrolling';

@Component({
  providers: [{
    provide: VIRTUAL_SCROLL_STRATEGY,
    useClass: AutoSizeVirtualScrollStrategy
  }],
  template: `
    <cdk-virtual-scroll-viewport>
      <div *cdkVirtualFor="let item of items">
        <!-- variable height content -->
      </div>
    </cdk-virtual-scroll-viewport>
  `
})
export class VariableListComponent {}
```

---

## 5. With `*cdkVirtualFor` Options

```html
<cdk-virtual-scroll-viewport itemSize="56">
  <div *cdkVirtualFor="let item of items;
                        let i = index;
                        trackBy: trackById;
                        bufferSize: 5;
                        minBufferPx: 200;
                        maxBufferPx: 400"
       class="item">
    {{ i }}: {{ item.name }}
  </div>
</cdk-virtual-scroll-viewport>
```

| Option | Meaning |
|---|---|
| `itemSize` | Height in px of each item (required for FixedSizeVirtualScrollStrategy) |
| `bufferSize` | Extra items to render beyond the viewport (in item count) |
| `minBufferPx` | Minimum buffer in px before new items are rendered |
| `maxBufferPx` | Maximum buffer in px to pre-render |

---

## 6. Scroll to a Specific Item

```typescript
@ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

scrollToItem(index: number) {
  this.viewport.scrollToIndex(index, 'smooth');
}

scrollToTop() {
  this.viewport.scrollToOffset(0, 'smooth');
}
```

---

## 7. Infinite Scroll Pattern

```typescript
@Component({ standalone: true, imports: [ScrollingModule], ... })
export class InfiniteListComponent {
  private surveys = inject(SurveyFacade);

  items = this.surveys.surveys;
  isLoading = this.surveys.isLoading;

  @ViewChild(CdkVirtualScrollViewport) viewport!: CdkVirtualScrollViewport;

  onScrolledIndexChange(index: number) {
    const totalItems = this.items().length;
    const buffer = 20;
    if (index >= totalItems - buffer && !this.isLoading()) {
      this.surveys.loadNextPage();
    }
  }
}
```

```html
<cdk-virtual-scroll-viewport
  itemSize="56"
  (scrolledIndexChange)="onScrolledIndexChange($event)">
  <div *cdkVirtualFor="let item of items" class="item">
    {{ item.title }}
  </div>
  @if (isLoading()) {
    <div class="loading">Loading more...</div>
  }
</cdk-virtual-scroll-viewport>
```

---

## Architect Notes

- **Virtual scroll requires a fixed or known height on the viewport container** — `height: 400px` or `height: 100%` with a bounded parent
- Don't virtual scroll small lists (< 100 items) — the complexity isn't worth it
- `trackBy` is even more important with virtual scroll — without it, every scroll event re-renders all visible items
- For tables with virtual scroll, look at Angular CDK's `Table` + `VirtualScrollViewport` combination or consider `@angular/material` table with virtual scroll support
