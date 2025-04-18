## Render templates from a parent component with ng-content  
<ng-content> is a special element that accepts markup or a template fragment and controls how components render content. It does not render a real DOM element.  
```typescript
// ./base-button/base-button.component.ts
import { Component } from '@angular/core';
@Component({
  selector: 'button[baseButton]',
  template: `
      <ng-content />
  `,
})
export class BaseButton {}
```  
```typescript
// ./app.component.ts
import { Component } from '@angular/core';
import { BaseButton } from './base-button/base-button.component.ts';
@Component({
  selector: 'app-root',
  imports: [BaseButton],
  template: `
    <button baseButton>
      Next <span class="icon arrow-right" />
    </button>
  `,
})
export class AppComponent {}
```  