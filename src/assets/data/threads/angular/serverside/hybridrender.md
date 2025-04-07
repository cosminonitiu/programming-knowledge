## Hybrid rendering  
Hybrid rendering combines the benefits of server-side rendering (SSR), pre-rendering (also known as "static site generation" or SSG) and client-side rendering (CSR) to optimize your Angular application. It allows you to render different parts of your application using different strategies, giving you fine-grained control over how your app is delivered to users.  
<br>

Angular’s new developer preview server rendering APIs offer a more efficient and adaptable approach to building modern web applications. These APIs give you complete control over your app’s rendering, allowing for optimizations that enhance performance, Search Engine Optimization (SEO), and overall user experience.  
<br>

Benefits of these new APIs:  
<br>

Greater flexibility:  
Leverage fine-grained control over rendering allows you to optimize for performance and user experience in different parts of your application.  
Choose the best rendering strategy for each route, whether it's server-side rendering for fast initial load times, client-side rendering for dynamic interactivity, or a hybrid approach.  
<br>

Built-in internationalization (i18n):  
Easily adapt your application to different languages and regions with out-of-the-box i18n support.  
<br>

Environment agnostic:  
Use these APIs with any JavaScript runtime environment, not just Node.js.  
Enjoy the benefits of enhanced rendering capabilities regardless of your technology stack.  
<br>

Seamless dev server integration:  
Take advantage of a smooth and efficient development experience from a fully integrated development server.  
This developer preview gives you a first look at these powerful new features. The Angular team encourages you to explore them and provide feedback to help shape the future of Angular server rendering.  
<br>

## Server routing  
### Configuring server routes  
You can create a server route config by declaring an array of ServerRoute objects. This configuration typically lives in a file named app.routes.server.ts.  
```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: '', // This renders the "/" route on the client (CSR)
    renderMode: RenderMode.Client,
  },
  {
    path: 'about', // This page is static, so we prerender it (SSG)
    renderMode: RenderMode.Prerender,
  },
  {
    path: 'profile', // This page requires user-specific data, so we use SSR
    renderMode: RenderMode.Server,
  },
  {
    path: '**', // All other routes will be rendered on the server (SSR)
    renderMode: RenderMode.Server,
  },
];
```  
You can add this config to your application using the provideServerRouting function.  
```typescript
import { provideServerRouting } from '@angular/ssr';
import { serverRoutes } from './app.routes.server';
// app.config.server.ts
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(),
    provideServerRouting(serverRoutes),
    // ... other providers ...
  ]
};
```  
When using the App shell pattern, you must specify the route to be used as the app shell for client-side rendered routes. To do this, provide an options object with the appShellRoute property to provideServerRouting:  
```typescript
import { provideServerRouting, withAppShell } from '@angular/ssr';
import { AppShellComponent } from './app-shell/app-shell.component';
const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRouting(serverRoutes, withAppShell(AppShellComponent)),
    // ... other providers ...
  ]
};
```  
<br>

## Rendering modes  
The server routing configuration lets you specify how each route in your application should render by setting a RenderMode:  
<br>

Rendering mode	Description  
Server (SSR)	Renders the application on the server for each request, sending a fully populated HTML page to the browser.  See the Server-Side Rendering (SSR) guide for more information.  
Client (CSR)	Renders the application in the browser. This is the default Angular behavior.  
Prerender (SSG)	Prerenders the application at build time, generating static HTML files for each route. See the Prerendering guide for more information.  
<br>

## Choosing a rendering mode  
Each rendering mode has different benefits and drawbacks. You can choose rendering modes based on the specific needs of your application.  
<br>

### Client-side rendering  
Client-side rendering has the simplest development model, as you can write code that assumes it always runs in a web browser. This lets you use a wide range of client-side libraries that also assume they run in a browser.  
<br>

Client-side rendering generally has worse performance than other rendering modes, as it must download, parse, and execute your page's JavaScript before the user can see any rendered content. If your page fetches more data from the server as it renders, users also have to wait for those additional requests before they can view the complete content.  
<br>

If your page is indexed by search crawlers, client-side rendering may negatively affect search engine optimization (SEO), as search crawlers have limits to how much JavaScript they execute when indexing a page.  
<br>

When client-side rendering, the server does not need to do any work to render a page beyond serving static JavaScript assets. You may consider this factor if server cost is a concern.  
<br>

Applications that support installable, offline experiences with service workers can rely on client-side rendering without needing to communicate with a server.  
<br>

### Server-side rendering  
Server-side rendering offers faster page loads than client-side rendering. Instead of waiting for JavaScript to download and run, the server directly renders an HTML document upon receiving a request from the browser. The user experiences only the latency necessary for the server to fetch data and render the requested page. This mode also eliminates the need for additional network requests from the browser, as your code can fetch data during rendering on the server.  
<br>

Server-side rendering generally has excellent search engine optimization (SEO), as search crawlers receive a fully rendered HTML document.  
<br>

Server-side rendering requires you to author code that does not strictly depend on browser APIs and limits your selection of JavaScript libraries that assume they run in a browser.  
<br>

When server-side rendering, your server runs Angular to produce an HTML response for every request. This additional cost may affect server hosting costs.  
<br>

### Build-time prerendering  
Prerendering offers faster page loads than both client-side rendering and server-side rendering. Because prerendering creates HTML documents at build-time, the server can directly respond to requests with the static HTML document without any additional work.  
<br>

Prerendering requires that all information necessary to render a page is available at build-time. This means that prerendered pages cannot include any data to the specific user loading the page. This means that prerendering is primarily useful for pages that are the same for all users of your application.  
<br>

Because prerendering occurs at build-time, it may add significant time to your production builds. Using getPrerenderParams to produce a large number of HTML documents may affect the total file size of your deployments, and thus lead to slower deployments.  
<br>

It may also add time to your deployments based on the number of static HTML documents included in your build output.  
<br>

Prerendering generally has excellent search engine optimization (SEO), as search crawlers receive a fully rendered HTML document.  
<br>

Prerendering requires you to author code that does not strictly depend on browser APIs and limits your selection of JavaScript libraries that assume they run in a browser.  
<br>

Prerendering incurs extremely little overhead per server request, as your server responds with static HTML documents. Static files are also easily cached by Content Delivery Networks (CDNs), browsers, and intermediate caching layers for even faster subsequent page loads. Deploying static HTML files to a CDN improves scalability by offloading work from your application web server, which is impactful for high-traffic applications.  
<br>

## Setting headers and status codes  
You can set custom headers and status codes for individual server routes using the headers and status properties in the ServerRoute configuration.  
```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'profile',
    renderMode: RenderMode.Server,
    headers: {
      'X-My-Custom-Header': 'some-value',
    },
    status: 201,
  },
  // ... other routes
];
```  
<br>

## Redirects  
Angular handles redirects specified by the redirectTo property in route configurations, differently on the server-side.  
<br>

Server-Side Rendering (SSR) Redirects are performed using standard HTTP redirects (e.g., 301, 302) within the server-side rendering process.  
<br>

Prerendering (SSG) Redirects are implemented as "soft redirects" using <meta http-equiv="refresh"> tags in the prerendered HTML. This allows for redirects without requiring a round trip to the server.  
<br>

## Customizing build-time prerendering (SSG)  
When using RenderMode.Prerender, you can specify several configuration options to customize the prerendering and serving process.  
<br>

### Parameterized routes  
For each route with RenderMode.Prerender, you can specify a getPrerenderParams function. This function lets you control which specific parameters produce separate prerendered documents.  
<br>

The getPrerenderParams function returns a Promise that resolves to an array of objects. Each object is a key-value map of route parameter name to value. For example, if you define a route like posts/:id, getPrerenderParams could return the array [{id: 123}, {id: 456}], and thus render separate documents for posts/123 and posts/456.  
<br>

The body of getPrerenderParams can use Angular's inject function to inject dependencies and perform any work to determine which routes to prerender. This typically includes making requests to fetch data to construct the array of parameter values.  
```typescript
// app.routes.server.ts
import { RenderMode, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    async getPrerenderParams() {
      const dataService = inject(PostService);
      const ids = await dataService.getIds(); // Assuming this returns ['1', '2', '3']
      return ids.map(id => ({ id })); // Transforms IDs into an array of objects for prerendering
      // This will prerender the paths: `/post/1`, `/post/2` and `/post/3`
    },
  },
];
```  
Because getPrerenderParams exclusively applies to RenderMode.Prerender, this function always runs at build-time. getPrerenderParams must not rely on any browser-specific or server-specific APIs for data. If the route does not specify a fallback option, the route falls back to PrerenderFallback.Server (SSR) by default.  
<br>

### Fallback strategies  
When using RenderMode.Prerender mode, you can specify a fallback strategy to handle requests for paths that haven't been prerendered.  
<br>

The available fallback strategies are:  
<br>

Server: Fallback to server-side rendering. This is the default behavior if no fallback property is specified.  
Client: Fallback to client-side rendering.  
None: No fallback. Angular will not handle requests for paths that are not prerendered.  
```typescript
// app.routes.server.ts
import { RenderMode, PrerenderFallback, ServerRoute } from '@angular/ssr';
export const serverRoutes: ServerRoute[] = [
  {
    path: 'post/:id',
    renderMode: RenderMode.Prerender,
    fallback: PrerenderFallback.Client, // Fallback to CSR if not prerendered
    async getPrerenderParams() {
      // This function returns an array of objects representing prerendered posts at the paths:
      // `/post/1`, `/post/2`, and `/post/3`.
      // The path `/post/4` will utilize the fallback behavior if it's requested.
      return [{ id: 1 }, { id: 2 }, { id: 3 }];
    },
  },
];
```  
<br>

## Accessing Request and Response via DI  
The @angular/core package provides several tokens for interacting with the server-side rendering environment. These tokens give you access to crucial information and objects within your Angular application during SSR.  
<br>

REQUEST: Provides access to the current request object, which is of type Request from the Web API. This allows you to access headers, cookies, and other request information.  
RESPONSE_INIT: Provides access to the response initialization options, which is of type ResponseInit from the Web API. This allows you to set headers and the status code for the response dynamically. Use this token to set headers or status codes that need to be determined at runtime.  
REQUEST_CONTEXT: Provides access to additional context related to the current request. This context can be passed as the second parameter of the handle function. Typically, this is used to provide additional request-related information that is not part of the standard Web API.  
```typescript
import { inject, REQUEST } from '@angular/core';
@Component({
  selector: 'app-my-component',
  template: `<h1>My Component</h1>`,
})
export class MyComponent {
  constructor() {
    const request = inject(REQUEST);
    console.log(request?.url);
  }
}
```  
<br>

## Configuring a non-Node.js Server  
The @angular/ssr provides essential APIs for server-side rendering your Angular application on platforms other than Node.js. It leverages the standard Request and Response objects from the Web API, enabling you to integrate Angular SSR into various server environments. For detailed information and examples, refer to the @angular/ssr API reference.  
```typescript
// server.ts
import { AngularAppEngine, createRequestHandler } from '@angular/ssr';
const angularApp = new AngularAppEngine();
/**
 * This is a request handler used by the Angular CLI (dev-server and during build).
 */
const reqHandler = createRequestHandler(async (req: Request) => {
  const res: Response|null = await angularApp.render(req);
  // ...
});
``` 
<br>

## Configuring a Node.js Server  
The @angular/ssr/node extends @angular/ssr specifically for Node.js environments. It provides APIs that make it easier to implement server-side rendering within your Node.js application. For a complete list of functions and usage examples, refer to the @angular/ssr/node API reference API reference.  
```typescript
// server.ts
import { AngularNodeAppEngine, createNodeRequestHandler, writeResponseToNodeResponse } from '@angular/ssr/node';
import express from 'express';
const app = express();
const angularApp = new AngularNodeAppEngine();
app.use('*', (req, res, next) => {
  angularApp
    .handle(req)
    .then(response => {
      if (response) {
        writeResponseToNodeResponse(response, res);
      } else {
        next(); // Pass control to the next middleware
      }
    })
    .catch(next);
});
/**
 * The request handler used by the Angular CLI (dev-server and during build).
 */
export const reqHandler = createNodeRequestHandler(app);
```  