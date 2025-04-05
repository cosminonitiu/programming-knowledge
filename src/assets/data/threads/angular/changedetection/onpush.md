:rocket: OnPush Strategy (Check Only When Inputs Change)
Components only check for changes when input properties change (@Input()).

More efficient than Default since it skips unnecessary checks.

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ExampleComponent { } 
```
Change Detection only triggers when:

A new reference is assigned to an @Input().
The component emits an event.
markForCheck() or detectChanges() is manually called.