# :arrows_counterclockwise: Angular Change Detection: In-Depth Explanation

## :pushpin: What is Change Detection?
Change Detection in Angular ensures the **synchronization of the application state with the UI**.  
- If a component's data changes, Angular updates the DOM accordingly.  
- It prevents manual DOM manipulation and ensures a reactive UI.  

## :mag: How Change Detection Works
Angular follows a **unidirectional data flow**:
:one: **Model Updates** → Component state changes (due to events, HTTP calls, user input).  
:two: **Change Detection Runs** → Angular checks if any data has changed.  
:three: **DOM Updates** → If a change is detected, the UI is updated.  

---

## :gear: Angular Change Detection Strategies
Angular provides **two strategies** to control how Change Detection runs:  

### :white_check_mark: `Default` Strategy (Check Always)
- Every component **checks for changes on every event**.  
- If **one component changes, all components are checked** (even if they didn’t change).  
- **This is the default behavior in Angular.**  

```typescript
@Component({
  selector: 'app-example',
  changeDetection: ChangeDetectionStrategy.Default
})
export class ExampleComponent { }
```