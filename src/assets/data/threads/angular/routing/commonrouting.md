## Common Routing Tasks  
This topic describes how to implement many of the common tasks associated with adding the Angular router to your application.  
<br>

### Generate an application with routing enabled  
The following command uses the Angular CLI to generate a basic Angular application with application routes. The application name in the following example is routing-app.  
```typescript
ng new routing-app
```  
<br>

### Adding components for routing  
To use the Angular router, an application needs to have at least two components so that it can navigate from one to the other. To create a component using the CLI, enter the following at the command line where first is the name of your component:  
```typescript
ng generate component first
```  
Repeat this step for a second component but give it a different name. Here, the new name is second.  
```typescript
ng generate component second
```  
The CLI automatically appends Component, so if you were to write first-component, your component would be FirstComponentComponent.  
<br>

This guide works with a CLI-generated Angular application. If you are working manually, make sure that you have <base href="/"> in the <head> of your index.html file. This assumes that the app folder is the application root, and uses "/".  
<br>

### Importing your new components  
To use your new components, import them into app.routes.ts at the top of the file, as follows:  
```typescript
import {FirstComponent} from './first/first.component';
import {SecondComponent} from './second/second.component';
```  
<br>

## Defining a basic route  
There are three fundamental building blocks to creating a route.  
Import the routes into app.config.ts and add it to the provideRouter function. The following is the default ApplicationConfig using the CLI.  
```typescript
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)]
};
```  
The Angular CLI performs this step for you. However, if you are creating an application manually or working with an existing, non-CLI application, verify that the imports and configuration are correct.  
<br>

### Set up a Routes array for your routes  
The Angular CLI performs this step automatically.  
```typescript
import { Routes } from '@angular/router';
export const routes: Routes = [];
```  
<br>

### Define your routes in your Routes array  
Each route in this array is a JavaScript object that contains two properties. The first property, path, defines the URL path for the route. The second property, component, defines the component Angular should use for the corresponding path.  
```typescript
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
];
```  
<br>

### Add your routes to your application  
Now that you have defined your routes, add them to your application. First, add links to the two components. Assign the anchor tag that you want to add the route to the routerLink attribute. Set the value of the attribute to the component to show when a user clicks on each link. Next, update your component template to include <router-outlet>. This element informs Angular to update the application view with the component for the selected route.  
```typescript
<h1>Angular Router App</h1>
<nav>
  <ul>
    <li><a routerLink="/first-component" routerLinkActive="active" ariaCurrentWhenActive="page">First Component</a></li>
    <li><a routerLink="/second-component" routerLinkActive="active" ariaCurrentWhenActive="page">Second Component</a></li>
  </ul>
</nav>
<!-- The routed views render in the <router-outlet>-->
<router-outlet />
```  
You also need to add the RouterLink, RouterLinkActive, and RouterOutlet to the imports array of AppComponent.  
```typescript
@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'routing-app';
}
```  
<br>

### Route order  
he order of routes is important because the Router uses a first-match wins strategy when matching routes, so more specific routes should be placed above less specific routes. List routes with a static path first, followed by an empty path route, which matches the default route. The wildcard route comes last because it matches every URL and the Router selects it only if no other routes match first.  
<br>

## Getting route information  
Often, as a user navigates your application, you want to pass information from one component to another. For example, consider an application that displays a shopping list of grocery items. Each item in the list has a unique id. To edit an item, users click an Edit button, which opens an EditGroceryItem component. You want that component to retrieve the id for the grocery item so it can display the right information to the user.  
<br>

Use a route to pass this type of information to your application components. To do so, you use the withComponentInputBinding feature with provideRouter or the bindToComponentInputs option of RouterModule.forRoot.  
<br>

### Add withComponentInputBinding  
Add the withComponentInputBinding feature to the provideRouter method.  
```typescript
providers: [
  provideRouter(appRoutes, withComponentInputBinding()),
]
```  
<br>

### Add an Input to the component  
Update the component to have an Input matching the name of the parameter.  
```typescript
@Input()
set id(heroId: string) {
  this.hero$ = this.service.getHero(heroId);
}
```  
NOTE: You can bind all route data with key, value pairs to component inputs: static or resolved route data, path parameters, matrix parameters, and query parameters. If you want to use the parent components route info you will need to set the router paramsInheritanceStrategy option: withRouterConfig({paramsInheritanceStrategy: 'always'})  
<br>

## Setting up wildcard routes  
A well-functioning application should gracefully handle when users attempt to navigate to a part of your application that does not exist. To add this functionality to your application, you set up a wildcard route. The Angular router selects this route any time the requested URL doesn't match any router paths.  
<br>

To set up a wildcard route, add the following code to your routes definition.  
```typescript
{ path: '**', component: <component-name> }
```  
The two asterisks, **, indicate to Angular that this routes definition is a wildcard route. For the component property, you can define any component in your application. Common choices include an application-specific PageNotFoundComponent, which you can define to display a 404 page to your users; or a redirect to your application's main component. A wildcard route is the last route because it matches any URL. For more detail on why order matters for routes, see Route order.  
<br>

## Displaying a 404 page  
To display a 404 page, set up a wildcard route with the component property set to the component you'd like to use for your 404 page as follows:  
```typescript
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
``` 
The last route with the path of ** is a wildcard route. The router selects this route if the requested URL doesn't match any of the paths earlier in the list and sends the user to the PageNotFoundComponent.  
<br>

## Setting up redirects  
To set up a redirect, configure a route with the path you want to redirect from, the component you want to redirect to, and a pathMatch value that tells the router how to match the URL.  
```typescript
const routes: Routes = [
  { path: 'first-component', component: FirstComponent },
  { path: 'second-component', component: SecondComponent },
  { path: '',   redirectTo: '/first-component', pathMatch: 'full' }, // redirect to `first-component`
  { path: '**', component: PageNotFoundComponent },  // Wildcard route for a 404 page
];
```  
In this example, the third route is a redirect so that the router defaults to the first-component route. Notice that this redirect precedes the wildcard route. Here, path: '' means to use the initial relative URL ('').  
Sometimes a redirect is not a simple, static redirect. The redirectTo property can also be a function with more complex logic that returns a string or UrlTree.  
```typescript
const routes: Routes = [
  { path: "first-component", component: FirstComponent },
  {
    path: "old-user-page",
    redirectTo: ({ queryParams }) => {
      const errorHandler = inject(ErrorHandler);
      const userIdParam = queryParams['userId'];
      if (userIdParam !== undefined) {
        return `/user/${userIdParam}`;
      } else {
        errorHandler.handleError(new Error('Attempted navigation to user page without user ID.'));
        return `/not-found`;
      }
    },
  },
  { path: "user/:userId", component: OtherComponent },
];
```  
<br>

## Nesting  Routes  
As your application grows more complex, you might want to create routes that are relative to a component other than your root component. These types of nested routes are called child routes. This means you're adding a second <router-outlet> to your app, because it is in addition to the <router-outlet> in AppComponent.  
<br>

In this example, there are two additional child components, child-a, and child-b. Here, FirstComponent has its own <nav> and a second <router-outlet> in addition to the one in AppComponent.  
```typescript
<h2>First Component</h2>
<nav>
  <ul>
    <li><a routerLink="child-a">Child A</a></li>
    <li><a routerLink="child-b">Child B</a></li>
  </ul>
</nav>
<router-outlet />
```  
A child route is like any other route, in that it needs both a path and a component. The one difference is that you place child routes in a children array within the parent route.  
```typescript
const routes: Routes = [
  {
    path: 'first-component',
    component: FirstComponent, // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a', // child route path
        component: ChildAComponent, // child route component that the router renders
      },
      {
        path: 'child-b',
        component: ChildBComponent, // another child route component that the router renders
      },
    ],
  },
];
```  
## Setting the page title  
Each page in your application should have a unique title so that they can be identified in the browser history. The Router sets the document's title using the title property from the Route config.  
```typescript
const routes: Routes = [
  {
    path: 'first-component',
    title: 'First component',
    component: FirstComponent,  // this is the component with the <router-outlet> in the template
    children: [
      {
        path: 'child-a',  // child route path
        title: resolvedChildATitle,
        component: ChildAComponent,  // child route component that the router renders
      },
      {
        path: 'child-b',
        title: 'child b',
        component: ChildBComponent,  // another child route component that the router renders
      },
    ],
  },
];
const resolvedChildATitle: ResolveFn<string> = () => Promise.resolve('child a');
```  
You can also provide a custom title strategy by extending the TitleStrategy.  
```typescript
@Injectable({ providedIn: 'root' })
export class TemplatePageTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);
  override updateTitle(routerState: RouterStateSnapshot) {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(`My Application | ${title}`);
    }
  }
}
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    { provide: TitleStrategy, useClass: TemplatePageTitleStrategy },
  ]
};
```  
<br>

## Using relative paths  
Relative paths let you define paths that are relative to the current URL segment. The following example shows a relative route to another component, second-component. FirstComponent and SecondComponent are at the same level in the tree, however, the link to SecondComponent is situated within the FirstComponent, meaning that the router has to go up a level and then into the second directory to find the SecondComponent. Rather than writing out the whole path to get to SecondComponent, use the ../ notation to go up a level.  
```typescript
<h2>First Component</h2>
<nav>
  <ul>
    <li><a routerLink="../second-component">Relative Route to second component</a></li>
  </ul>
</nav>
<router-outlet />
```  
In addition to ../, use ./ or no leading slash to specify the current level.  
<br>

### Specifying a relative route  
To specify a relative route, use the NavigationExtras relativeTo property. In the component class, import NavigationExtras from the @angular/router.  
<br>

Then use relativeTo in your navigation method. After the link parameters array, which here contains items, add an object with the relativeTo property set to the ActivatedRoute, which is this.route.  
```typescript
goToItems() {
  this.router.navigate(['items'], { relativeTo: this.route });
}
```  
The navigate() arguments configure the router to use the current route as a basis upon which to append items.  
<br>

The goToItems() method interprets the destination URI as relative to the activated route and navigates to the items route.  
<br>

## Accessing query parameters and fragments  
Sometimes, a feature of your application requires accessing a part of a route, such as a query parameter or a fragment. In this example, the route contains an id parameter we can use to target a specific hero page.  
```typescript
import { ApplicationConfig } from "@angular/core";
import { Routes } from '@angular/router';
import { HeroListComponent } from './hero-list.component';
export const routes: Routes = [
  { path: 'hero/:id', component: HeroDetailComponent }
];
export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes)],
};
```  
First, import the following members in the component you want to navigate from.  
```typescript
import { inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
```  
Next inject the activated route service:  
```typescript
private readonly route = inject(ActivatedRoute);
```  
Configure the class so that you have an observable, heroes$, a selectedId to hold the id number of the hero, and the heroes in the ngOnInit(), add the following code to get the id of the selected hero. This code snippet assumes that you have a heroes list, a hero service, a function to get your heroes, and the HTML to render your list and details, just as in the Tour of Heroes example.  
```typescript
heroes$: Observable<Hero[]>;
selectedId: number;
heroes = HEROES;
ngOnInit() {
  this.heroes$ = this.route.paramMap.pipe(
    switchMap(params => {
      this.selectedId = Number(params.get('id'));
      return this.service.getHeroes();
    })
  );
}
```  
Next, in the component that you want to navigate to, import the following members.  
```typescript
import { Router, ActivatedRoute, ParamMap } from '@angular/router';
import { Observable } from 'rxjs';
```  
Inject ActivatedRoute and Router in the constructor of the component class so they are available to this component:  
```typescript
private readonly route = inject(ActivatedRoute);
private readonly router = inject(Router);
hero$: Observable<Hero>;
ngOnInit() {
  const heroId = this.route.snapshot.paramMap.get('id');
  this.hero$ = this.service.getHero(heroId);
}
gotoItems(hero: Hero) {
  const heroId = hero ? hero.id : null;
  // Pass along the hero id if available
  // so that the HeroList component can select that item.
  this.router.navigate(['/heroes', { id: heroId }]);
}
```  
<br>

## Lazy loading  
You can configure your routes to lazy load modules, which means that Angular only loads modules as needed, rather than loading all modules when the application launches. Additionally, preload parts of your application in the background to improve the user experience.  
<br>

Any route can lazily load its routed, standalone component by using loadComponent:  
```typescript
const routes: Routes = [
  {
    path: 'lazy',
    loadComponent: () => import('./lazy.component').then(c => c.LazyComponent)
  }
];
```  
This works as long as the loaded component is standalone.  
<br>

## Preventing Unauthorized Access  
Use route guards to prevent users from navigating to parts of an application without authorization. The following route guards are available in Angular:  
<br>

canActivate  
canActivateChild  
canDeactivate  
canMatch  
resolve  
canLoad  
To use route guards, consider using component-less routes as this facilitates guarding child routes.  

Create a file for your guard:  
```typescript
ng generate guard your-guard
```  
In your guard file, add the guard functions you want to use. The following example uses canActivateFn to guard the route.  
```typescript
export const yourGuardFunction: CanActivateFn = (
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
) => {
  // your  logic goes here
}
```  
In your routing module, use the appropriate property in your routes configuration. Here, canActivate tells the router to mediate navigation to this particular route.  
```typescript
{
  path: '/your-path',
  component: YourComponent,
  canActivate: [yourGuardFunction],
}
```  
<br>

## Link parameters array  
A link parameters array holds the following ingredients for router navigation:  
<br>

The path of the route to the destination component  
Required and optional route parameters that go into the route URL  
<br>

Bind the RouterLink directive to such an array like this:  
```typescript
<a [routerLink]="['/heroes']">Heroes</a>
```  
The following is a two-element array when specifying a route parameter:  
```typescript
<a [routerLink]="['/hero', hero.id]">
  <span class="badge">{{ hero.id }}</span>{{ hero.name }}
</a>
```  
Provide optional route parameters in an object, as in { foo: 'foo' }:  
```typescript
<a [routerLink]="['/crisis-center', { foo: 'foo' }]">Crisis Center</a>
```  
These three examples cover the needs of an application with one level of routing. However, with a child router, such as in the crisis center, you create new link array possibilities.  
<br>

The following minimal RouterLink example builds upon a specified default child route for the crisis center.  
```typescript
<a [routerLink]="['/crisis-center']">Crisis Center</a>
```  
Review the following:  
<br>

The first item in the array identifies the parent route (/crisis-center)  
There are no parameters for this parent route  
There is no default for the child route so you need to pick one  
You're navigating to the CrisisListComponent, whose route path is /, but you don't need to explicitly add the slash  
<br>

Consider the following router link that navigates from the root of the application down to the Dragon Crisis:  
```typescript
<a [routerLink]="['/crisis-center', 1]">Dragon Crisis</a>
```  
The first item in the array identifies the parent route (/crisis-center)  
There are no parameters for this parent route  
The second item identifies the child route details about a particular crisis (/:id)  
The details child route requires an id route parameter  
You added the id of the Dragon Crisis as the second item in the array (1)  
The resulting path is /crisis-center/1  
<br>

You could also redefine the AppComponent template with Crisis Center routes exclusively:  
```typescript
@Component({
  template: `
    <h1 class="title">Angular Router</h1>
    <nav>
      <a [routerLink]="['/crisis-center']">Crisis Center</a>
      <a [routerLink]="['/crisis-center/1', { foo: 'foo' }]">Dragon Crisis</a>
      <a [routerLink]="['/crisis-center/2']">Shark Crisis</a>
    </nav>
    <router-outlet />
  `
})
export class AppComponent {}
```  
In summary, you can write applications with one, two or more levels of routing. The link parameters array affords the flexibility to represent any routing depth and any legal sequence of route paths, (required) router parameters, and (optional) route parameter objects.  
<br>

## LocationStrategy and browser URL styles  
When the router navigates to a new component view, it updates the browser's location and history with a URL for that view.  
<br>

Modern HTML5 browsers support history.pushState, a technique that changes a browser's location and history without triggering a server page request. The router can compose a "natural" URL that is indistinguishable from one that would otherwise require a page load.  
<br>

Here's the Crisis Center URL in this "HTML5 pushState" style:  
```typescript
localhost:3002/crisis-center
```  
Older browsers send page requests to the server when the location URL changes unless the change occurs after a "#" (called the "hash"). Routers can take advantage of this exception by composing in-application route URLs with hashes. Here's a "hash URL" that routes to the Crisis Center.  
```typescript
localhost:3002/src/#/crisis-center
```  
The router supports both styles with two LocationStrategy providers  
<br>

The RouterModule.forRoot() function sets the LocationStrategy to the PathLocationStrategy, which makes it the default strategy. You also have the option of switching to the HashLocationStrategy with an override during the bootstrapping process.  
<br>

## Choosing a routing strategy  
You must choose a routing strategy early in the development of your project because once the application is in production, visitors to your site use and depend on application URL references.  
<br>

Almost all Angular projects should use the default HTML5 style. It produces URLs that are easier for users to understand and it preserves the option to do server-side rendering.  
<br>

Rendering critical pages on the server is a technique that can greatly improve perceived responsiveness when the application first loads. An application that would otherwise take ten or more seconds to start could be rendered on the server and delivered to the user's device in less than a second.  
<br>

This option is only available if application URLs look like normal web URLs without hash (#) characters in the middle.  
<br>

## <base href>  
The router uses the browser's history.pushState for navigation. pushState lets you customize in-application URL paths; for example, localhost:4200/crisis-center. The in-application URLs can be indistinguishable from server URLs.  
<br>

Modern HTML5 browsers were the first to support pushState which is why many people refer to these URLs as "HTML5 style" URLs.  
<br>

You must add a <base href> element to the application's index.html for pushState routing to work. The browser uses the <base href> value to prefix relative URLs when referencing CSS files, scripts, and images.  
<br>

Add the <base> element just after the <head> tag. If the app folder is the application root, as it is for this application, set the href value in index.html as shown here.  
```typescript
<base href="/">
```  
<br>

### HTML5 URLs and the <base href>  
The guidelines that follow will refer to different parts of a URL. This diagram outlines what those parts refer to:  
```typescript
foo://example.com:8042/over/there?name=ferret#nose
\_/   \______________/\_________/ \_________/ \__/
 |           |            |            |        |
scheme    authority      path        query   fragment
```  
While the router uses the HTML5 pushState style by default, you must configure that strategy with a <base href>.   
The preferred way to configure the strategy is to add a <base href> element tag in the <head> of the index.html.  
```typescript
<base href="/">
```  
Without that tag, the browser might not be able to load resources (images, CSS, scripts) when "deep linking" into the application.  
Some developers might not be able to add the <base> element, perhaps because they don't have access to <head> or the index.html.  
<br>

### HashLocationStrategy  
Use HashLocationStrategy by providing the useHash: true in an object as the second argument of the RouterModule.forRoot() in the AppModule.  
```typescript
providers: [
  provideRouter(appRoutes, withHashLocation())
]
```  
When using RouterModule.forRoot, this is configured with the useHash: true in the second argument: RouterModule.forRoot(routes, {useHash: true}).  