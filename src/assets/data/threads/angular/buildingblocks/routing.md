## 1. Angular Routing Fundamentals

### Router Module and Configuration
- **RouterModule:**  
  Angular’s routing is provided by the `RouterModule`, which you import into your application’s module.
- **Routes Configuration:**  
  You define an array of route objects, each with properties such as `path`, `component`, `children`, and more.
  
  ```typescript
  import { NgModule } from '@angular/core';
  import { RouterModule, Routes } from '@angular/router';
  import { HomeComponent } from './home/home.component';
  import { AboutComponent } from './about/about.component';

  const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'about', component: AboutComponent }
  ];

  @NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
  })
  export class AppRoutingModule {}
```

**Router State
ActivatedRoute:**
Represents the current route information. It provides access to parameters, query parameters, and static data.

**Snapshot vs. Observable:**

**ActivatedRouteSnapshot**: A static representation of the route at a given point in time.

**ActivatedRoute **(Observable): Provides ongoing updates if the route parameters or data change during the lifecycle of a component.

```typescript
// Accessing route parameters using snapshot
constructor(private route: ActivatedRoute) {
  const id = this.route.snapshot.paramMap.get('id');
}

// Subscribing to parameter changes
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    console.log('Route param:', params.get('id'));
  });
} 
```

**2. Router Links and Navigation
RouterLink Directive**
Usage:
The routerLink directive is used to create navigable links in your templates.

```html
<a routerLink="/about">About</a>
<a [routerLink]="['/user', userId]">User Details</a> 
```

**RouterLinkActive Directive**
Purpose:
The routerLinkActive directive adds a CSS class to an element when its associated route is active. This is commonly used for highlighting the current navigation item.

```html
<a routerLink="/about" routerLinkActive="active-link">About</a>
```

**Programmatic Navigation**
Using the Router Service:

```typescript
import { Router } from '@angular/router';

constructor(private router: Router) {}

navigateToUser(userId: string) {
  this.router.navigate(['/user', userId]);
}
```

**3. Route Parameters and Query Parameters
Route Parameters**
Definition:
Part of the URL that represents a dynamic segment, defined in the route configuration using the colon syntax.

```typescript
const routes: Routes = [
  { path: 'user/:id', component: UserComponent }
];
```
**Accessing Parameters:**
Use ActivatedRoute to access the parameter values.

```typescript
ngOnInit() {
  this.route.paramMap.subscribe(params => {
    const userId = params.get('id');
    // Use userId for further logic
  });
}
```
**Query Parameters**
Definition:
Additional parameters appended to the URL after a ?, which can be used to filter or sort data.

```html
<a [routerLink]="['/users']" [queryParams]="{ sort: 'asc', page: 1 }">Users</a>
```
**Accessing Query Parameters:**
Similarly, use ActivatedRoute:

```typescript
this.route.queryParamMap.subscribe(params => {
  const sortOrder = params.get('sort');
});
```

**. Route Guards**
Route guards are used to control navigation in your application by deciding whether a route can be activated, deactivated, loaded, or even whether child routes can be activated.

**Types of Guards:
CanActivate:**
Prevents unauthorized users from accessing a route.

```typescript
import { Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(): boolean {
    if (/* user is authenticated */) {
      return true;
    } else {
      this.router.navigate(['/login']);
      return false;
    }
  }
}
```
**CanDeactivate:**
Prevents navigation away from a route, useful for unsaved changes.

```typescript
export interface CanComponentDeactivate {
  canDeactivate: () => Observable<boolean> | Promise<boolean> | boolean;
}

@Injectable({ providedIn: 'root' })
export class PendingChangesGuard implements CanDeactivate<CanComponentDeactivate> {
  canDeactivate(component: CanComponentDeactivate) {
    return component.canDeactivate ? component.canDeactivate() : true;
  }
}
```
**CanLoad:**
Controls loading of lazy-loaded modules.

**CanActivateChild:**
Controls access to child routes.

**5. Auxiliary Routes and Named Outlets**
Purpose:
Auxiliary routes enable you to display multiple routes in different parts of the UI simultaneously. They use named outlets.

Usage Example:

```html
<!-- Primary outlet -->
<router-outlet></router-outlet>

<!-- Named outlet for a sidebar -->
<router-outlet name="sidebar"></router-outlet>
```
**Route Configuration:**

```typescript
const routes: Routes = [
  { path: 'chat', component: ChatComponent, outlet: 'sidebar' },
  { path: 'home', component: HomeComponent }
];
```

**6. Advanced Routing Topics
Lazy Loading**
Definition:
Load feature modules only when the user navigates to them, reducing the initial bundle size.

Configuration:

```typescript
const routes: Routes = [
  {
    path: 'admin',
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  }
];
```
**Preloading Strategies**
Purpose:
Improve performance by preloading lazy-loaded modules after the initial load.

**Built-In Strategy:**
Use PreloadAllModules to load all lazy modules in the background.

```typescript
RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
```
**Router Events**
**Monitoring Navigation:**
Angular’s Router emits a variety of events (NavigationStart, NavigationEnd, NavigationCancel, NavigationError, etc.) that you can subscribe to for logging, analytics, or custom logic.

```typescript
import { Router, NavigationEnd } from '@angular/router';

constructor(private router: Router) {
  this.router.events.subscribe(event => {
    if (event instanceof NavigationEnd) {
      console.log('Navigation ended with URL:', event.urlAfterRedirects);
    }
  });
}
```