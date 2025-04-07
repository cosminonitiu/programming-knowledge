## DI in action  
### Custom providers with @Inject  
Using a custom provider allows you to provide a concrete implementation for implicit dependencies, such as built-in browser APIs. The following example uses an InjectionToken to provide the localStorage browser API as a dependency in the BrowserStorageService:  
```typescript
import { Inject, Injectable, InjectionToken } from '@angular/core';
export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});
@Injectable({
  providedIn: 'root'
})
export class BrowserStorageService {
  public storage = inject(BROWSER_STORAGE);
  get(key: string) {
    return this.storage.getItem(key);
  }
  set(key: string, value: string) {
    this.storage.setItem(key, value);
  }
}
```  
The factory function returns the localStorage property that is attached to the browser's window object. The inject function initializes the storage property with an instance of the token.  
<br>

This custom provider can now be overridden during testing with a mock API of localStorage instead of interacting with real browser APIs.  
<br>

### Inject the component's DOM element  
Although developers strive to avoid it, some visual effects and third-party tools require direct DOM access. As a result, you might need to access a component's DOM element.  
<br>

Angular exposes the underlying element of a @Component or @Directive via injection using the ElementRef injection token:  
```typescript
import { Directive, ElementRef } from '@angular/core';
@Directive({
  selector: '[appHighlight]'
})
export class HighlightDirective {
  private element = inject(ElementRef)
  update() {
    this.element.nativeElement.style.color = 'red';
  }
}
```  
<br>

### Resolve circular dependencies with a forward reference  
The order of class declaration matters in TypeScript. You can't refer directly to a class until it's been defined.  
<br>

This isn't usually a problem, especially if you adhere to the recommended one class per file rule. But sometimes circular references are unavoidable. For example, when class 'A' refers to class 'B' and 'B' refers to 'A', one of them has to be defined first.  
<br>

The Angular forwardRef() function creates an indirect reference that Angular can resolve later.  
<br>

You face a similar problem when a class makes a reference to itself. For example, in its providers array. The providers array is a property of the @Component() decorator function, which must appear before the class definition. You can break such circular references by using forwardRef.  
```typescript
providers: [
  {
    provide: PARENT_MENU_ITEM,
    useExisting: forwardRef(() => MenuItem),
  },
],
```  