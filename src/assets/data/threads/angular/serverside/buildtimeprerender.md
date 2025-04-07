## Prerendering (SSG)  
Prerendering, commonly referred to as Static Site Generation (SSG), represents the method by which pages are rendered to static HTML files during the build process.  
<br>

Prerendering maintains the same performance benefits of server-side rendering (SSR) but achieves a reduced Time to First Byte (TTFB), ultimately enhancing user experience. The key distinction lies in its approach that pages are served as static content, and there is no request-based rendering.  
<br>

When the data necessary for server-side rendering remains consistent across all users, the strategy of prerendering emerges as a valuable alternative. Rather than dynamically rendering pages for each user request, prerendering takes a proactive approach by rendering them in advance.  
<br>

## How to prerender a page  
To prerender a static page, add SSR capabilities to your application  
Once SSR is added, you can generate the static pages by running the build command:  
```typescript
ng build
```  
<br>

## Build options for prerender  
The application builder prerender option can be either a Boolean or an Object for more fine-tuned configuration. When the option is false, no prerendering is done. When it is true, all options use the default value. When it is an Object, each option can be individually configured.  
<br>

Options	Details	Default Value  
discoverRoutes	Whether the builder should process the Angular Router configuration to find all unparameterized routes and prerender them.	true  
routesFile	The path to a file that contains a list of all routes to prerender, separated by newlines. This option is useful if you want to prerender routes with parameterized URLs.    
<br>

```typescript
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "discoverRoutes": false
            }
          }
        }
      }
    }
  }
}
```  
<br>

## Prerendering parameterized routes  
You can prerender parameterized routes using the routesFile option. An example of a parameterized route is product/:id, where id is dynamically provided. To specify these routes, they should be listed in a text file, with each route on a separate line.  
<br>

For an app with a large number of parameterized routes, consider generating this file using a script before running ng build.  
```typescript
/products/1
/products/555
```  
With routes specified in the routes.txt file, use the routesFile option to configure the builder to prerender the product routes.  
```typescript
{
  "projects": {
    "my-app": {
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": {
            "prerender": {
              "routesFile": "routes.txt"
            }
          }
        }
      }
    }
  }
}
```  