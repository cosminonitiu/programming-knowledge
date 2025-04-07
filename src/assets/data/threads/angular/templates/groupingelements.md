## Grouping elements with ng-container  
<ng-container> is a special element in Angular that groups multiple elements together or marks a location in a template without rendering a real element in the DOM.  
```typescript
<!-- Component template -->
<section>
  <ng-container>
    <h3>User bio</h3>
    <p>Here's some info about the user</p>
  </ng-container>
</section>
```  
```typescript
<!-- Rendered DOM -->
<section>
  <h3>User bio</h3>
  <p>Here's some info about the user</p>
</section>
```  
You can apply directives to <ng-container> to add behaviors or configuration to a part of your template.  
Angular ignores all attribute bindings and event listeners applied to <ng-container>, including those applied via directive.  
<br>

## Using <ng-container> to display dynamic contents  
<ng-container> can act as a placeholder for rendering dynamic content.  
<br>

### Rendering components  
You can use Angular's built-in NgComponentOutlet directive to dynamically render a component to the location of the <ng-container>.  
```typescript
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngComponentOutlet]="profileComponent()" />
  `
})
export class UserProfile {
  isAdmin = input(false);
  profileComponent = computed(() => this.isAdmin() ? AdminProfile : BasicUserProfile);
}
```  
In the example above, the NgComponentOutlet directive dynamically renders either AdminProfile or BasicUserProfile in the location of the <ng-container> element.  
<br>

### Rendering template fragments  
You can use Angular's built-in NgTemplateOutlet directive to dynamically render a template fragment to the location of the <ng-container>.  
```typescript
@Component({
  template: `
    <h2>Your profile</h2>
    <ng-container [ngTemplateOutlet]="profileTemplate()" />
    <ng-template #admin>This is the admin profile</ng-template>
    <ng-template #basic>This is the basic profile</ng-template>
  `
})
export class UserProfile {
  isAdmin = input(false);
  adminTemplate = viewChild('admin', {read: TemplateRef});
  basicTemplate = viewChild('basic', {read: TemplateRef});
  profileTemplate = computed(() => this.isAdmin() ? this.adminTemplate() : this.basicTemplate());
}
```  
In the example above, the ngTemplateOutlet directive dynamically renders one of two template fragments in the location of the <ng-container> element.  
<br>

## Using <ng-container> with structural directives  
You can also apply structural directives to <ng-container> elements. Common examples of this include ngIfand ngFor.  
```typescript
<ng-container *ngIf="permissions == 'admin'">
  <h1>Admin Dashboard</h1>
  <admin-infographic></admin-infographic>
</ng-container>
<ng-container *ngFor="let item of items; index as i; trackBy: trackByFn">
  <h2>{{ item.title }}</h2>
  <p>{{ item.description }}</p>
</ng-container>
```  
<br>

## Using <ng-container> for injection  
When you apply a directive to <ng-container>, descendant elements can inject the directive or anything that the directive provides. Use this when you want to declaratively provide a value to a specific part of your template.  
```typescript
@Directive({
  selector: '[theme]',
})
export class Theme {
  // Create an input that accepts 'light' or 'dark`, defaulting to 'light'.
  mode = input<'light' | 'dark'>('light');
}
```  
```typescript
<ng-container theme="dark">
  <profile-pic />
  <user-bio />
</ng-container>
```  
In the example above, the ProfilePic and UserBio components can inject the Theme directive and apply styles based on its mode.