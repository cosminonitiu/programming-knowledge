## Hydration  
Hydration is the process that restores the server-side rendered application on the client. This includes things like reusing the server rendered DOM structures, persisting the application state, transferring application data that was retrieved already by the server, and other processes.  
<br>

## Why is hydration important?  
Hydration improves application performance by avoiding extra work to re-create DOM nodes. Instead, Angular tries to match existing DOM elements to the applications structure at runtime and reuses DOM nodes when possible. This results in a performance improvement that can be measured using Core Web Vitals (CWV) statistics, such as reducing the First Input Delay (FID) and Largest Contentful Paint (LCP), as well as Cumulative Layout Shift (CLS). Improving these numbers also affects things like SEO performance.  
<br>

Without hydration enabled, server-side rendered Angular applications will destroy and re-render the application's DOM, which may result in a visible UI flicker. This re-rendering can negatively impact Core Web Vitals like LCP and cause a layout shift. Enabling hydration allows the existing DOM to be re-used and prevents a flicker.  
<br>

## How do you enable hydration in Angular  
Hydration can be enabled for server-side rendered (SSR) applications only.   
<br>

### Using Angular CLI  
If you've used Angular CLI to enable SSR (either by enabling it during application creation or later via ng add @angular/ssr), the code that enables hydration should already be included into your application.  
<br>

### Manual setup  
If you have a custom setup and didn't use Angular CLI to enable SSR, you can enable hydration manually by visiting your main application component or module and importing provideClientHydration from @angular/platform-browser. You'll then add that provider to your app's bootstrapping providers list.  
```typescript
import {
  bootstrapApplication,
  provideClientHydration,
} from '@angular/platform-browser';
...
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration()]
});
```  
Alternatively if you are using NgModules, you would add provideClientHydration to your root app module's provider list.  
```typescript
import {provideClientHydration} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
@NgModule({
  declarations: [AppComponent],
  exports: [AppComponent],
  bootstrap: [AppComponent],
  providers: [provideClientHydration()],
})
export class AppModule {}
```  
<br>

### Verify that hydration is enabled  
After you've configured hydration and have started up your server, load your application in the browser.  
<br>

HELPFUL: You will likely need to fix instances of Direct DOM Manipulation before hydration will fully work either by switching to Angular constructs or by using ngSkipHydration. See Constraints, Direct DOM Manipulation, and How to skip hydration for particular components for more details.  
<br>

While running an application in dev mode, you can confirm hydration is enabled by opening the Developer Tools in your browser and viewing the console. You should see a message that includes hydration-related stats, such as the number of components and nodes hydrated. Angular calculates the stats based on all components rendered on a page, including those that come from third-party libraries.  
<br>

You can also use Angular DevTools browser extension to see hydration status of components on a page. Angular DevTools also allows to enable an overlay to indicate which parts of the page were hydrated. If there is a hydration mismatch error - DevTools would also highlight a component that caused the error.  
<br>

## Capturing and replaying events  
When an application is rendered on the server, it is visible in a browser as soon as produced HTML loads. Users may assume that they can interact with the page, but event listeners are not attached until hydration completes. Starting from v18, you can enable the Event Replay feature that allows to capture all events that happen before hydration and replay those events once hydration has completed. You can enable it using the withEventReplay() function, for example:  
```typescript
import {provideClientHydration, withEventReplay} from '@angular/platform-browser';
bootstrapApplication(App, {
  providers: [
    provideClientHydration(withEventReplay())
  ]
});
```  
<br>

### How event replay works  
Event Replay is a feature that improves user experience by capturing user events that were triggered before the hydration process is complete. Then those events are replayed, ensuring none of that interaction was lost.  
<br>

The Event Replay is divided into three main phases:  
<br>

Capturing user interactions  
Prior to Hydration, Event Replay captures and stores all interactions that the user may perform, such as clicks and other browser native events.  
<br>

Storing events  
The Event Contract keeps in memory all the interactions recorded in the previous step, ensuring that they are not lost for later replay.  
<br>

Relaunch of events  
Once Hydration is complete, Angular re-invokes the captured events.  
<br>

Event replay supports native browser events, for example click, mouseover, and focusin. If you'd like to learn more about JSAction, the library that powers event replay, you can read more on the readme.  
<br>

This feature ensures a consistent user experience, preventing user actions performed before Hydration from being ignored. Note: if you have incremental hydration enabled, event replay is automatically enabled under the hood.  
<br>

## Constraints  
Hydration imposes a few constraints on your application that are not present without hydration enabled. Your application must have the same generated DOM structure on both the server and the client. The process of hydration expects the DOM tree to have the same structure in both places. This also includes whitespaces and comment nodes that Angular produces during the rendering on the server. Those whitespaces and nodes must be present in the HTML generated by the server-side rendering process.  
<br>

If there is a mismatch between server and client DOM tree structures, the hydration process will encounter problems attempting to match up what was expected to what is actually present in the DOM. Components that do direct DOM manipulation using native DOM APIs are the most common culprit.  
<br>

### Direct DOM Manipulation  
If you have components that manipulate the DOM using native DOM APIs or use innerHTML or outerHTML, the hydration process will encounter errors. Specific cases where DOM manipulation is a problem are situations like accessing the document, querying for specific elements, and injecting additional nodes using appendChild. Detaching DOM nodes and moving them to other locations will also result in errors.  
<br>

This is because Angular is unaware of these DOM changes and cannot resolve them during the hydration process. Angular will expect a certain structure, but it will encounter a different structure when attempting to hydrate. This mismatch will result in hydration failure and throw a DOM mismatch error (see below).  
<br>

It is best to refactor your component to avoid this sort of DOM manipulation. Try to use Angular APIs to do this work, if you can. If you cannot refactor this behavior, use the ngSkipHydration attribute (described below) until you can refactor into a hydration friendly solution.  
<br>

### Valid HTML structure  
There are a few cases where if you have a component template that does not have valid HTML structure, this could result in a DOM mismatch error during hydration.  
<br>

As an example, here are some of the most common cases of this issue.  
<br>

<table> without a <tbody>  
<div> inside a <p>  
<a> inside another <a>  
<br>

If you are uncertain about whether your HTML is valid, you can use a syntax validator to check it.  
<br>

### Preserve Whitespaces Configuration  
When using the hydration feature, we recommend using the default setting of false for preserveWhitespaces. If this setting is not in your tsconfig, the value will be false and no changes are required. If you choose to enable preserving whitespaces by adding preserveWhitespaces: true to your tsconfig, it is possible you may encounter issues with hydration. This is not yet a fully supported configuration.  
<br>

HELPFUL: Make sure that this setting is set consistently in tsconfig.server.json for your server and tsconfig.app.json for your browser builds. A mismatched value will cause hydration to break.  
<br>

If you choose to set this setting in your tsconfig, we recommend to set it only in tsconfig.app.json which by default the tsconfig.server.json will inherit it from.  
<br>

### Custom or Noop Zone.js are not yet supported  
Hydration relies on a signal from Zone.js when it becomes stable inside an application, so that Angular can start the serialization process on the server or post-hydration cleanup on the client to remove DOM nodes that remained unclaimed.  
<br>

Providing a custom or a "noop" Zone.js implementation may lead to a different timing of the "stable" event, thus triggering the serialization or the cleanup too early or too late. This is not yet a fully supported configuration and you may need to adjust the timing of the onStable event in the custom Zone.js implementation.  
<br>

## Errors  
There are several hydration related errors you may encounter ranging from node mismatches to cases when the ngSkipHydration was used on an invalid host node. The most common error case that may occur is due to direct DOM manipulation using native APIs that results in hydration being unable to find or match the expected DOM tree structure on the client that was rendered by the server. The other case you may encounter this type of error was mentioned in the Valid HTML structure section earlier. So, make sure the HTML in your templates are using valid structure, and you'll avoid that error case.  
<br>

## How to skip hydration for particular components  
How to skip hydration for particular components
Some components may not work properly with hydration enabled due to some of the aforementioned issues, like Direct DOM Manipulation. As a workaround, you can add the ngSkipHydration attribute to a component's tag in order to skip hydrating the entire component.  
```typescript
<app-example ngSkipHydration />
```  
Alternatively you can set ngSkipHydration as a host binding.  
```typescript
@Component({
  ...
  host: {ngSkipHydration: 'true'},
})
class ExampleComponent {}
```  
The ngSkipHydration attribute will force Angular to skip hydrating the entire component and its children. Using this attribute means that the component will behave as if hydration is not enabled, meaning it will destroy and re-render itself.  
<br>

HELPFUL: This will fix rendering issues, but it means that for this component (and its children), you don't get the benefits of hydration. You will need to adjust your component's implementation to avoid hydration-breaking patterns (i.e. Direct DOM Manipulation) to be able to remove the skip hydration annotation.  
<br>

The ngSkipHydration attribute can only be used on component host nodes. Angular throws an error if this attribute is added to other nodes.  
<br>

Keep in mind that adding the ngSkipHydration attribute to your root application component would effectively disable hydration for your entire application. Be careful and thoughtful about using this attribute. It is intended as a last resort workaround. Components that break hydration should be considered bugs that need to be fixed.  
<br>

## Hydration Timing and Application Stability  
Application stability is an important part of the hydration process. Hydration and any post-hydration processes only occur once the application has reported stability. There are a number of ways that stability can be delayed. Examples include setting timeouts and intervals, unresolved promises, and pending microtasks. In those cases, you may encounter the Application remains unstable error, which indicates that your app has not yet reached the stable state after 10 seconds. If you're finding that your application is not hydrating right away, take a look at what is impacting application stability and refactor to avoid causing these delays.  
<br>

## I18N  
HELPFUL: Support for internationalization with hydration is currently in developer preview. By default, Angular will skip hydration for components that use i18n blocks, effectively re-rendering those components from scratch.  
<br>

To enable hydration for i18n blocks, you can add withI18nSupport to your provideClientHydration call.
```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withI18nSupport,
} from '@angular/platform-browser';
...
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withI18nSupport())]
});
```  
<br>

## Consistent rendering across server-side and client-side  
Avoid introducing @if blocks and other conditionals that display different content when server-side rendering than client-side rendering, such as using an @if block with Angular's isPlatformBrowser function. These rendering differences cause layout shifts, negatively impacting end-user experience and core web vitals.  
<br>

## Third Party Libraries with DOM Manipulation  
There are a number of third party libraries that depend on DOM manipulation to be able to render. D3 charts is a prime example. These libraries worked without hydration, but they may cause DOM mismatch errors when hydration is enabled. For now, if you encounter DOM mismatch errors using one of these libraries, you can add the ngSkipHydration attribute to the component that renders using that library.  
<br>

## Third Party Scripts with DOM Manipulation  
Many third party scripts, such as ad trackers and analytics, modify the DOM before hydration can occur. These scripts may cause hydration errors because the page no longer matches the structure expected by Angular. Prefer deferring this type of script until after hydration whenever possible. Consider using AfterNextRender to delay the script until post-hydration processes have occured.