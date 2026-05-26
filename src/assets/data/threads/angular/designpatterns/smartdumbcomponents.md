## Smart & Dumb Components (Container / Presenter Pattern)

The most important architectural pattern for scaling Angular UIs. Separating components by responsibility makes code testable, reusable, and maintainable.

---

## 1. The Two Roles

| | Smart (Container) | Dumb (Presenter / Pure) |
|---|---|---|
| **Knows about** | State, services, store | Only its own `@Input` / `@Output` |
| **Injects** | Services, facades, stores | Nothing (or pure utilities) |
| **Communicates** | Dispatches actions, calls APIs | Emits events to parent |
| **Reusability** | Low — app-specific | High — works anywhere |
| **Testing** | Needs mocked services/store | Pure unit test — just pass inputs |
| **Change Detection** | Default or OnPush | Always `OnPush` |

---

## 2. Example — Survey Management Platform

### Smart container: owns state, talks to the store

```typescript
// survey-list-container.component.ts
@Component({
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <app-survey-list
      [surveys]="surveys$ | async"
      [loading]="loading$ | async"
      (surveySelected)="onSelect($event)"
      (surveyDeleted)="onDelete($event)"
    />
  `,
  imports: [SurveyListComponent, AsyncPipe],
})
export class SurveyListContainerComponent {
  surveys$ = this.facade.surveys$;
  loading$ = this.facade.loading$;

  constructor(private facade: SurveyFacade) {}

  ngOnInit() { this.facade.loadSurveys(); }

  onSelect(id: string) { this.router.navigate(['/survey', id]); }
  onDelete(id: string) { this.facade.deleteSurvey(id); }
}
```

### Dumb presenter: pure rendering, zero knowledge of state

```typescript
// survey-list.component.ts
@Component({
  standalone: true,
  selector: 'app-survey-list',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (loading) {
      <app-spinner />
    } @else {
      @for (survey of surveys; track survey.id) {
        <app-survey-card
          [survey]="survey"
          (selected)="surveySelected.emit(survey.id)"
          (deleted)="surveyDeleted.emit(survey.id)"
        />
      }
    }
  `,
  imports: [SpinnerComponent, SurveyCardComponent],
})
export class SurveyListComponent {
  @Input() surveys: Survey[] | null = [];
  @Input() loading: boolean | null = false;
  @Output() surveySelected = new EventEmitter<string>();
  @Output() surveyDeleted  = new EventEmitter<string>();
}
```

---

## 3. Why `OnPush` on Dumb Components?

Dumb components only change when their `@Input` references change. `OnPush` makes this explicit — Angular skips change detection unless:
- An `@Input` receives a new reference
- An `@Output` event fires
- An `async` pipe emits

This means the entire presenter subtree is skipped during most change detection cycles.

---

## 4. Testing Comparison

### Testing the dumb component — trivial, no mocks needed

```typescript
it('should emit surveySelected when card is clicked', () => {
  component.surveys = [{ id: '1', title: 'Test Survey' }];
  fixture.detectChanges();

  const emitSpy = spyOn(component.surveySelected, 'emit');
  fixture.nativeElement.querySelector('.survey-card').click();

  expect(emitSpy).toHaveBeenCalledWith('1');
});
```

### Testing the smart container — only needs mock store/facade

```typescript
beforeEach(() => {
  mockFacade = jasmine.createSpyObj('SurveyFacade', ['loadSurveys', 'deleteSurvey'], {
    surveys$: of([]),
    loading$: of(false),
  });
});
```

---

## 5. Where to Draw the Line

```
Route component (smart) ─────── Page-level container
  └── Feature container (smart) ── Owns feature state
        └── Section (smart/dumb) ── May need some local state
              └── Widget (dumb) ──── Pure display
                    └── Atom (dumb) ─ Button, input, label
```

**Rule of thumb:** If a component calls `inject(SomeFacadeOrService)`, it is smart. If it only has `@Input`/`@Output`, it is dumb.

---

## Architect Interview Notes

- **This pattern is the single most impactful thing** you can do for Angular app scalability — brings 30% faster deliverable throughput in practice.
- Dumb components compose — the same `app-survey-card` can be used in list views, modals, and dashboards without change.
- Smart containers are the **integration seam** — the only place you need to change if you swap NgRx for signals.
- **CV connection:** *"At Aumovio, I established this pattern as the architectural standard — it was core to enabling 30% faster client deliverables because new pages could be assembled from pre-tested, reusable presenter components."*
