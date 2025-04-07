Every Angular app consists of a file named angular.json. This file will contain all the configurations of the app. While building the app, the builder looks at this file to find the entry point of the application. Following is an image of the angular.json file

Inside the build section, the main property of the options object defines the entry point of the application which in this case is main.ts.

The main.ts file creates a browser environment for the application to run, and, along with this, it also calls a function called bootstrapModule, which bootstraps the application. These two steps are performed in the following order inside the main.ts file: 

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
platformBrowserDynamic().bootstrapModule(AppModule)

In the above line of code, AppModule is getting bootstrapped.

The AppModule is declared in the app.module.ts file. This module contains declarations of all the components.

**Flow of Angular**
1. Browser Request → index.html
The browser makes an HTTP request for index.html, the entry point of the Angular application.

2. Scripts Load (runtime, polyfills, styles, vendor, main)
runtime.js → Handles module loading and bootstrapping.

polyfills.js → Ensures browser compatibility (e.g., for older browsers).

styles.js → Contains global styles for the app.

vendor.js → Includes external libraries (e.g., Angular core, RxJS).

main.js → The application’s compiled JavaScript code.

3. Angular Bootstrap Process
The app starts with main.ts, which calls platformBrowserDynamic().bootstrapModule(AppModule).

Angular creates the AppModule, which provides dependencies and sets up services.

4. AppComponent Loads
The root component (AppComponent) is initialized and rendered inside <app-root></app-root>.

5. Lazy Modules (On-Demand)
If configured, lazy-loaded modules are only loaded when needed (via Angular Router).

Example:

```typescript
const routes: Routes = [
  { path: 'dashboard', loadChildren: () => import('./dashboard/dashboard.module').then(m => m.DashboardModule) }
];
```