## Incremental Hydration  
Incremental hydration is an advanced type of hydration that can leave sections of your application dehydrated and incrementally trigger hydration of those sections as they are needed.  
<br>

## Why use incremental hydration?  
Incremental hydration is a performance improvement that builds on top of full application hydration. It can produce smaller initial bundles while still providing an end-user experience that is comparable to a full application hydration experience. Smaller bundles improve initial load times, reducing First Input Delay (FID) and Cumulative Layout Shift (CLS).  
<br>

Incremental hydration also lets you use deferrable views (@defer) for content that may not have been deferrable before. Specifically, you can now use deferrable views for content that is above the fold. Prior to incremental hydration, putting a @defer block above the fold would result in placeholder content rendering and then being replaced by the @defer block's main template content. This would result in a layout shift. Incremental hydration means the main template of the @defer block will render with no layout shift on hydration.  
<br>

## How do you enable incremental hydration in Angular?  
You can enable incremental hydration for applications that already use server-side rendering (SSR) with hydration. Follow the Angular SSR Guide to enable server-side rendering and the Angular Hydration Guide to enable hydration first.  
<br>

Enable incremental hydration by adding the withIncrementalHydration() function to the provideClientHydration provider.  
```typescript
import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
```  
Incremental Hydration depends on and enables event replay automatically. If you already have withEventReplay() in your list, you can safely remove it after enabling incremental hydration.  
<br>

## How does incremental hydration work?  
Incremental hydration builds on top of full-application hydration, deferrable views, and event replay. With incremental hydration, you can add additional triggers to @defer blocks that define incremental hydration boundaries. Adding a hydrate trigger to a defer block tells Angular that it should load that defer block's dependencies during server-side rendering and render the main template rather than the @placeholder. When client-side rendering, the dependencies are still deferred, and the defer block content stays dehydrated until its hydrate trigger fires. That trigger tells the defer block to fetch its dependencies and hydrate the content. Any browser events, specifically those that match listeners registered in your component, that are triggered by the user prior to hydration are queued up and replayed once the hydration process is complete.  
<br>

## Controlling hydration of content with triggers  
You can specify hydrate triggers that control when Angular loads and hydrates deferred content. These are additional triggers that can be used alongside regular @defer triggers.  
<br>

Each @defer block may have multiple hydrate event triggers, separated with a semicolon (;). Angular triggers hydration when any of the triggers fire.  
<br>

There are three types of hydrate triggers: hydrate on, hydrate when, and hydrate never.  
<br>

## hydrate on  
hydrate on specifies a condition for when hydration is triggered for the @defer block.  
The available triggers are as follows:  
<br>


Trigger	Description  
hydrate on idle	Triggers when the browser is idle.  
hydrate on viewport	Triggers when specified content enters the viewport  
hydrate on interaction	Triggers when the user interacts with specified element  
hydrate on hover	Triggers when the mouse hovers over specified area  
hydrate on immediate	Triggers immediately after non-deferred content has finished rendering  
hydrate on timer	Triggers after a specific duration  
<br>

### hydrate on idle  
The hydrate on idle trigger loads the deferrable view's dependencies and hydrates the content once the browser has reached an idle state, based on requestIdleCallback.  
```typescript
@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate on viewport  
The hydrate on viewport trigger loads the deferrable view's dependencies and hydrates the corresponding page of the app when the specified content enters the viewport using the Intersection Observer API.  
```typescript
@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate on interaction  
The hydrate on interaction trigger loads the deferrable view's dependencies and hydrates the content when the user interacts with the specified element through click or keydown events.  
```typescript
@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate on hover  
The hydrate on hover trigger loads the deferrable view's dependencies and hydrates the content when the mouse has hovered over the triggered area through the mouseover and focusin events.  
```typescript
@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate on immediate  
The hydrate on immediate trigger loads the deferrable view's dependencies and hydrates the content immediately. This means that the deferred block loads as soon as all other non-deferred content has finished rendering.  
```typescript
@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate on timer  
The hydrate on timer trigger loads the deferrable view's dependencies and hydrates the content after a specified duration.  
```typescript
@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate when  
The hydrate when trigger accepts a custom conditional expression and loads the deferrable view's dependencies and hydrates the content when the condition becomes truthy.  
```typescript
@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

### hydrate never  
The hydrate never allows users to specify that the content in the defer block should remain dehydrated indefinitely, effectively becoming static content. Note that this applies to the initial render only. During a subsequent client-side render, a @defer block with hydrate never would still fetch dependencies, as hydration only applies to initial load of server-side rendered content. In the example below, subsequent client-side renders would load the @defer block dependencies on viewport.  
```typescript
@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
```  
<br>

## Hydrate triggers alongside regular triggers  
Hydrate triggers are additional triggers that are used alongside regular triggers on a @defer block. Hydration is an initial load optimization, and that means hydrate triggers only apply to that initial load. Any subsequent client side render will still use the regular trigger.  
```typescript
@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder{
  <div>Example Placeholder</div>
}
```  
In this example, on the initial load, the hydrate on interaction applies. Hydration will be triggered on interaction with the <example-cmp /> component. On any subsequent page load that is client-side rendered, for example when a user clicks a routerLink that loads a page with this component, the on idle will apply.  
<br>

## How does incremental hydration work with nested @defer blocks?  

In-depth Guides
Server-side & hybrid-rendering
Incremental Hydration
edit
Tip: Incremental hydration is currently in developer preview.

Incremental hydration is an advanced type of hydration that can leave sections of your application dehydrated and incrementally trigger hydration of those sections as they are needed.

On this page
Why use incremental hydration?
How do you enable incremental hydration in Angular?
How does incremental hydration work?
Controlling hydration of content with triggers
hydrate on
hydrate when
hydrate never
Hydrate triggers alongside regular triggers
How does incremental hydration work with nested @defer blocks?
Constraints
Do I still need to specify @placeholder blocks?
Why use incremental hydration?
Incremental hydration is a performance improvement that builds on top of full application hydration. It can produce smaller initial bundles while still providing an end-user experience that is comparable to a full application hydration experience. Smaller bundles improve initial load times, reducing First Input Delay (FID) and Cumulative Layout Shift (CLS).

Incremental hydration also lets you use deferrable views (@defer) for content that may not have been deferrable before. Specifically, you can now use deferrable views for content that is above the fold. Prior to incremental hydration, putting a @defer block above the fold would result in placeholder content rendering and then being replaced by the @defer block's main template content. This would result in a layout shift. Incremental hydration means the main template of the @defer block will render with no layout shift on hydration.

How do you enable incremental hydration in Angular?
You can enable incremental hydration for applications that already use server-side rendering (SSR) with hydration. Follow the Angular SSR Guide to enable server-side rendering and the Angular Hydration Guide to enable hydration first.

Enable incremental hydration by adding the withIncrementalHydration() function to the provideClientHydration provider.

import {
  bootstrapApplication,
  provideClientHydration,
  withIncrementalHydration,
} from '@angular/platform-browser';
...
bootstrapApplication(AppComponent, {
  providers: [provideClientHydration(withIncrementalHydration())]
});
check
Incremental Hydration depends on and enables event replay automatically. If you already have withEventReplay() in your list, you can safely remove it after enabling incremental hydration.

How does incremental hydration work?
Incremental hydration builds on top of full-application hydration, deferrable views, and event replay. With incremental hydration, you can add additional triggers to @defer blocks that define incremental hydration boundaries. Adding a hydrate trigger to a defer block tells Angular that it should load that defer block's dependencies during server-side rendering and render the main template rather than the @placeholder. When client-side rendering, the dependencies are still deferred, and the defer block content stays dehydrated until its hydrate trigger fires. That trigger tells the defer block to fetch its dependencies and hydrate the content. Any browser events, specifically those that match listeners registered in your component, that are triggered by the user prior to hydration are queued up and replayed once the hydration process is complete.

Controlling hydration of content with triggers
You can specify hydrate triggers that control when Angular loads and hydrates deferred content. These are additional triggers that can be used alongside regular @defer triggers.

Each @defer block may have multiple hydrate event triggers, separated with a semicolon (;). Angular triggers hydration when any of the triggers fire.

There are three types of hydrate triggers: hydrate on, hydrate when, and hydrate never.

hydrate on
hydrate on specifies a condition for when hydration is triggered for the @defer block.

The available triggers are as follows:

Trigger	Description
hydrate on idle	Triggers when the browser is idle.
hydrate on viewport	Triggers when specified content enters the viewport
hydrate on interaction	Triggers when the user interacts with specified element
hydrate on hover	Triggers when the mouse hovers over specified area
hydrate on immediate	Triggers immediately after non-deferred content has finished rendering
hydrate on timer	Triggers after a specific duration
hydrate on idle
The hydrate on idle trigger loads the deferrable view's dependencies and hydrates the content once the browser has reached an idle state, based on requestIdleCallback.

@defer (hydrate on idle) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
hydrate on viewport
The hydrate on viewport trigger loads the deferrable view's dependencies and hydrates the corresponding page of the app when the specified content enters the viewport using the Intersection Observer API.

@defer (hydrate on viewport) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
hydrate on interaction
The hydrate on interaction trigger loads the deferrable view's dependencies and hydrates the content when the user interacts with the specified element through click or keydown events.

@defer (hydrate on interaction) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
hydrate on hover
The hydrate on hover trigger loads the deferrable view's dependencies and hydrates the content when the mouse has hovered over the triggered area through the mouseover and focusin events.

@defer (hydrate on hover) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
hydrate on immediate
The hydrate on immediate trigger loads the deferrable view's dependencies and hydrates the content immediately. This means that the deferred block loads as soon as all other non-deferred content has finished rendering.

@defer (hydrate on immediate) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
hydrate on timer
The hydrate on timer trigger loads the deferrable view's dependencies and hydrates the content after a specified duration.

@defer (hydrate on timer(500ms)) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
The duration parameter must be specified in milliseconds (ms) or seconds (s).

hydrate when
The hydrate when trigger accepts a custom conditional expression and loads the deferrable view's dependencies and hydrates the content when the condition becomes truthy.

@defer (hydrate when condition) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
Note: hydrate when conditions only trigger when they are the top-most dehydrated @defer block. The condition provided for the trigger is specified in the parent component, which needs to exist before it can be triggered. If the parent block is dehydrated, that expression will not yet be resolvable by Angular.

hydrate never
The hydrate never allows users to specify that the content in the defer block should remain dehydrated indefinitely, effectively becoming static content. Note that this applies to the initial render only. During a subsequent client-side render, a @defer block with hydrate never would still fetch dependencies, as hydration only applies to initial load of server-side rendered content. In the example below, subsequent client-side renders would load the @defer block dependencies on viewport.

@defer (on viewport; hydrate never) {
  <large-cmp />
} @placeholder {
  <div>Large component placeholder</div>
}
check
Note: Using hydrate never prevents hydration of the entire nested subtree of a given @defer block. No other hydrate triggers fire for content nested underneath that block.

Hydrate triggers alongside regular triggers
Hydrate triggers are additional triggers that are used alongside regular triggers on a @defer block. Hydration is an initial load optimization, and that means hydrate triggers only apply to that initial load. Any subsequent client side render will still use the regular trigger.

@defer (on idle; hydrate on interaction) {
  <example-cmp />
} @placeholder{
  <div>Example Placeholder</div>
}
check
In this example, on the initial load, the hydrate on interaction applies. Hydration will be triggered on interaction with the <example-cmp /> component. On any subsequent page load that is client-side rendered, for example when a user clicks a routerLink that loads a page with this component, the on idle will apply.

How does incremental hydration work with nested @defer blocks?
Angular's component and dependency system is hierarchical, which means hydrating any component requires all of its parents also be hydrated. So if hydration is triggered for a child @defer block of a nested set of dehydrated @defer blocks, hydration is triggered from the top-most dehydrated @defer block down to the triggered child and fire in that order.  
```typescript
@defer (hydrate on interaction) {
  <parent-block-cmp />
  @defer (hydrate on hover) {
    <child-block-cmp />
  } @placeholder {
    <div>Child placeholder</div>
  }
} @placeholder{
  <div>Parent Placeholder</div>
}
```  
In the above example, hovering over the nested @defer block triggers hydration. The parent @defer block with the <parent-block-cmp /> hydrates first, then the child @defer block with <child-block-cmp /> hydrates after.  
<br>

## Constraints  
Incremental hydration has the same constraints as full-application hydration, including limits on direct DOM manipulation and requiring valid HTML structure. Visit the Hydration guide constraints section for more details.  
<br>

## Do I still need to specify @placeholder blocks?  
Yes. @placeholder block content is not used for incremental hydration, but a @placeholder is still necessary for subsequent client-side rendering cases. If your content was not on the route that was part of the initial load, then any navigation to the route that has your @defer block content renders like a regular @defer block. So the @placeholder is rendered in those client-side rendering cases.