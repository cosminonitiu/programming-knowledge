import { Category } from "../../shared/models/Category ";
import { BookIcon, ServerIcon, Cog, Network, Database, CloudIcon } from 'lucide-angular';

export const categories_mock: Category[] = [
    {
      id: "frontend",
      name: "Frontend",
      icon: BookIcon,
      subcategories: [
        {
          id: "generalfrontend",
          name: "General Frontend",
          description: "General Native Frontend Concepts",
          topics: []
        },
        {
          id: "angular",
          name: "Angular",
          description: "Angular 19 Updated Knowledge",
          topics: [
            {
              id: "components",
              title: "Components",
              description: "Angular Building Blocks",
              threads: [
                {
                  id: "componentanatomy",
                  title: "Anatomy of a component",
                  contentPreview: "Metadata passed to the component and Basic Usage",
                  contentPath: "angular/components/componentanatomy"
                },
                {
                  id: "componentselectors",
                  title: "Component Selectors",
                  contentPreview: "Angular matches selectors statically at compile-time. Changing the DOM at run-time, either via Angular bindings or with DOM APIs, does not affect the components rendered.",
                  contentPath: "angular/components/componentselectors"
                },
                {
                  id: "stylingcomponents",
                  title: "Styling Components",
                  contentPreview: "When Angular compiles your component, these styles are emitted with your component's JavaScript output. This means that component styles participate in the JavaScript module system.",
                  contentPath: "angular/components/stylingcomponents"
                },
                {
                  id: "inputproperties",
                  title: "Accepting data with input properties",
                  contentPreview: "When you use a component, you commonly want to pass some data to it. A component specifies the data that it accepts by declaring inputs",
                  contentPath: "angular/components/inputproperties"
                },
                {
                  id: "eventsoutputs",
                  title: "Custom events with outputs",
                  contentPreview: "Angular refers to properties initialized with the output function as outputs. You can use outputs to raise custom events, similar to native browser events like click.",
                  contentPath: "angular/components/eventsoutputs"
                },
                {
                  id: "ngcontent",
                  title: "Content projection with ng-content",
                  contentPreview: "You often need to create components that act as containers for different types of content. For example, you may want to create a custom card component:",
                  contentPath: "angular/components/ngcontent"
                },
                {
                  id: "hostelements",
                  title: "Component host elements",
                  contentPreview: "Angular creates an instance of a component for every HTML element that matches the component's selector. The DOM element that matches a component's selector is that component's host element. The contents of a component's template are rendered inside its host element.",
                  contentPath: "angular/components/hostelements"
                },
                {
                  id: "lifecycle",
                  title: "Component Lifecycle",
                  contentPreview: "A component's lifecycle is the sequence of steps that happen between the component's creation and its destruction. Each step represents a different part of Angular's process for rendering components and checking them for updates over time.",
                  contentPath: "angular/components/lifecycle"
                },
                {
                  id: "referencingcomponents",
                  title: "Referencing component children with queries",
                  contentPreview: "ll query functions return signals that reflect the most up-to-date results. You can read the result by calling the signal function, including in reactive contexts like computed and effect.",
                  contentPath: "angular/components/referencingcomponents"
                },
                {
                  id: "usingdomapi",
                  title: "Using DOM APIs",
                  contentPreview: "Angular handles most DOM creation, updates, and removals for you. However, you might rarely need to directly interact with a component's DOM. Components can inject ElementRef to get a reference to the component's host element",
                  contentPath: "angular/components/usingdomapi"
                },
                {
                  id: "inheritance",
                  title: "Inheritance",
                  contentPreview: "Angular components are TypeScript classes and participate in standard JavaScript inheritance semantics.",
                  contentPath: "angular/components/inheritance"
                },
                {
                  id: "programaticalrendering",
                  title: "Programmatically rendering components",
                  contentPreview: "In addition to using a component directly in a template, you can also dynamically render components. There are two main ways to dynamically render a component: in a template with NgComponentOutlet, or in your TypeScript code with ViewContainerRef.",
                  contentPath: "angular/components/programaticalrendering"
                },
                {
                  id: "advancedconfiguration",
                  title: "Advanced component configuration",
                  contentPreview: "Advanced component configuration",
                  contentPath: "angular/components/advancedconfiguration"
                },
                {
                  id: "customelements",
                  title: "Angular elements overview",
                  contentPreview: "Angular elements are Angular components packaged as custom elements (also called Web Components), a web standard for defining new HTML elements in a framework-agnostic way.",
                  contentPath: "angular/components/customelements"
                },
                {
                  id: "interceptors",
                  title: "Interceptors",
                  contentPreview: "Interceptors are middleware-like services that implement Angular's HttpInterceptor interface. ",
                  contentPath: "angular/components/interceptors"
                },
                {
                  id: "observables",
                  title: "Observables",
                  contentPreview: "An Observable is a stream of data that can emit multiple values over time. It is a core concept in reactive programming, especially in libraries like RxJS, which Angular heavily relies on.",
                  contentPath: "angular/components/observables"
                },
                {
                  id: "standalonecomponents",
                  title: "Standalone Components",
                  contentPreview: "Standalone components declare their own dependencies directly — no NgModule required. The default architecture since Angular 17.",
                  contentPath: "angular/components/standalonecomponents"
                }
              ]
            },
            {
              id: "templates",
              title: "Templates",
              description: "Every Angular component has a template that defines the DOM that the component renders onto the page. By using templates, Angular is able to automatically keep your page up-to-date as data changes.",
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "Every Angular component has a template that defines the DOM that the component renders onto the page. By using templates, Angular is able to automatically keep your page up-to-date as data changes.",
                  contentPath: "angular/templates/overview"
                },
                {
                  id: "bindingdynamic",
                  title: "Binding dynamic text, properties and attributes",
                  contentPreview: "In Angular, a binding creates a dynamic connection between a component's template and its data. This connection ensures that changes to the component's data automatically update the rendered template.",
                  contentPath: "angular/templates/bindingdynamic"
                },
                {
                  id: "addingevenliste",
                  title: "Adding event listeners",
                  contentPreview: "Angular supports defining event listeners on an element in your template by specifying the event name inside parentheses along with a statement that runs every time the event occurs.",
                  contentPath: "angular/templates/addingevenliste"
                },
                {
                  id: "twowaybinding",
                  title: "Two-way binding",
                  contentPreview: "Two way binding is a shorthand to simultaneously bind a value into an element, while also giving that element the ability to propagate changes back through this binding.",
                  contentPath: "angular/templates/twowaybinding"
                },
                {
                  id: "controlflow",
                  title: "Control flow",
                  contentPreview: "Angular templates support control flow blocks that let you conditionally show, hide, and repeat elements.",
                  contentPath: "angular/templates/controlflow"
                },
                {
                  id: "pipes",
                  title: "Pipes",
                  contentPreview: "Pipes are a special operator in Angular template expressions that allows you to transform data declaratively in your template. Pipes let you declare a transformation function once and then use that transformation across multiple templates. Angular pipes use the vertical bar character (|), inspired by the Unix pipe.",
                  contentPath: "angular/templates/pipes"
                },
                {
                  id: "slottingchilds",
                  title: "Render templates from a parent component with ng-content",
                  contentPreview: "<ng-content> is a special element that accepts markup or a template fragment and controls how components render content. It does not render a real DOM element.",
                  contentPath: "angular/templates/slottingchilds"
                },
                {
                  id: "createtemplatefragments",
                  title: "Create template fragments with ng-template",
                  contentPreview: "Inspired by the native <template> element, the <ng-template> element lets you declare a template fragment – a section of content that you can dynamically or programmatically render.",
                  contentPath: "angular/templates/createtemplatefragments"
                },
                {
                  id: "groupingelements",
                  title: "Grouping elements with ng-container",
                  contentPreview: "<ng-container> is a special element in Angular that groups multiple elements together or marks a location in a template without rendering a real element in the DOM.",
                  contentPath: "angular/templates/groupingelements"
                },
                {
                  id: "asyncpipe",
                  title: "Async pipe",
                  contentPreview: "When you use the async pipe in a template expression (e.g., {{ data$ | async }}), Angular automatically subscribes to the Observable or Promise. When the data changes (a new value is emitted), Angular updates the view with the latest value.",
                  contentPath: "angular/templates/asyncpipe"
                },
                {
                  id: "variablesintemplates",
                  title: "Variables in templates",
                  contentPreview: "Angular has two types of variable declarations in templates: local template variables and template reference variables.",
                  contentPath: "angular/templates/variablesintemplates"
                },
                {
                  id: "defferedloading",
                  title: "Deferred loading with @defer",
                  contentPreview: "Deferrable views, also known as @defer blocks, reduce the initial bundle size of your application by deferring the loading of code that is not strictly necessary for the initial rendering of a page. This often results in a faster initial load and improvement in Core Web Vitals (CWV), primarily Largest Contentful Paint (LCP) and Time to First Byte (TTFB).",
                  contentPath: "angular/templates/defferedloading"
                }
              ]
            },
            {
              id: "directives",
              title: "Directives",
              description: "Component, Attribute and Structural Directives",
              threads: [
                {
                  id: "overview",
                  title: "Built-in directives",
                  contentPreview: "Directives are classes that add additional behavior to elements in your Angular applications.",
                  contentPath: "angular/directives/overview"
                },
                {
                  id: "attributedirectives",
                  title: "Attribute directives",
                  contentPreview: "Change the appearance or behavior of DOM elements and Angular components with attribute directives.",
                  contentPath: "angular/directives/attributedirectives"
                },
                {
                  id: "structuraldirectives",
                  title: "Structural directives",
                  contentPreview: "Structural directives are directives applied to an <ng-template> element that conditionally or repeatedly render the content of that <ng-template>.",
                  contentPath: "angular/directives/structuraldirectives"
                },
                {
                  id: "directivecompapi",
                  title: "Directive composition API",
                  contentPreview: "Angular directives offer a great way to encapsulate reusable behaviors— directives can apply attributes, CSS classes, and event listeners to an element.",
                  contentPath: "angular/directives/directivecompapi"
                },
                {
                  id: "decorators",
                  title: "Decorators",
                  contentPreview: "Decorators are a fundamental concept in TypeScript, and because Angular heavily relies on TypeScript, decorators have become an important element of Angular as well.",
                  contentPath: "angular/directives/decorators"
                },
                {
                  id: "ngoptimizedimage",
                  title: "Getting started with NgOptimizedImage",
                  contentPreview: "The NgOptimizedImage directive makes it easy to adopt performance best practices for loading images.",
                  contentPath: "angular/directives/ngoptimizedimage"
                }
              ]
            },
            {
              id: "depinjection",
              title: "Dependency Injection",
              description: "Dependency Injection, or DI, is a design pattern and mechanism for creating and delivering some parts of an application to other parts of an application that require them. Angular supports this design pattern and you can use it in your applications to increase flexibility and modularity.",
              threads: [
                {
                  id: "understandingdi",
                  title: "Understanding dependency injection",
                  contentPreview: "Dependency injection, or DI, is one of the fundamental concepts in Angular. DI is wired into the Angular framework and allows classes with Angular decorators, such as Components, Directives, Pipes, and Injectables, to configure dependencies that they need.",
                  contentPath: "angular/depinjection/understandingdi"
                },
                {
                  id: "createinjservice",
                  title: "Creating an injectable service",
                  contentPreview: "Service is a broad category encompassing any value, function, or feature that an application needs. A service is typically a class with a narrow, well-defined purpose. A component is one type of class that can use DI.",
                  contentPath: "angular/depinjection/createinjservice"
                },
                {
                  id: "definingproviders",
                  title: "Configuring dependency providers",
                  contentPreview: "The previous sections described how to use class instances as dependencies. Aside from classes, you can also use values such as boolean, string, Date, and objects as dependencies. Angular provides the necessary APIs to make the dependency configuration flexible, so you can make those values available in DI.",
                  contentPath: "angular/depinjection/definingproviders"
                },
                {
                  id: "injectioncontext",
                  title: "Injection context",
                  contentPreview: "The dependency injection (DI) system relies internally on a runtime context where the current injector is available. This means that injectors can only work when code is executed in such a context.",
                  contentPath: "angular/depinjection/injectioncontext"
                },
                {
                  id: "optimizinginjectiontokens",
                  title: "Optimizing client application size with lightweight injection tokens",
                  contentPreview: "This page provides a conceptual overview of a dependency injection technique that is recommended for library developers. Designing your library with lightweight injection tokens helps optimize the bundle size of client applications that use your library.",
                  contentPath: "angular/depinjection/optimizinginjectiontokens"
                },
                {
                  id: "diinaction",
                  title: "DI in action",
                  contentPreview: "This guide explores additional features of dependency injection in Angular.",
                  contentPath: "angular/depinjection/diinaction"
                },
                {
                  id: "hierarchicalinjectors",
                  title: "Hierarchical Injectors",
                  contentPreview: "ModuleInjector vs ElementInjector trees, @Self, @SkipSelf, @Host, @Optional — how Angular resolves dependencies and how to scope them correctly.",
                  contentPath: "angular/depinjection/hierarchicalinjectors"
                },
                {
                  id: "injectfunction",
                  title: "The inject() Function",
                  contentPreview: "Modern DI without constructor parameters — required for functional guards, interceptors, resolvers, and APP_INITIALIZER patterns.",
                  contentPath: "angular/depinjection/injectfunction"
                },
                {
                  id: "appinitializer",
                  title: "APP_INITIALIZER & provideAppInitializer",
                  contentPreview: "Run async logic before the app renders — loading remote config, silent token refresh, permission preloading. provideAppInitializer is the Angular 18+ syntax.",
                  contentPath: "angular/depinjection/appinitializer"
                }
              ]
            },
            {
              id: "routing",
              title: "Routing",
              description: "In a single-page app, you change what the user sees by showing or hiding portions of the display that correspond to particular components, rather than going out to the server to get a new page.",
              threads: [
                {
                  id: "commonrouting",
                  title: "Common Routing Tasks",
                  contentPreview: "This topic describes how to implement many of the common tasks associated with adding the Angular router to your application.",
                  contentPath: "angular/routing/commonrouting"
                },
                {
                  id: "routerreference",
                  title: "Router reference",
                  contentPreview: "Advanced topics on routing",
                  contentPath: "angular/routing/routerreference"
                },
                {
                  id: "entrypoint",
                  title: "Angular Entry Point",
                  contentPreview: "Every Angular app consists of a file named angular.json. This file will contain all the configurations of the app.",
                  contentPath: "angular/routing/entrypoint"
                },
                {
                  id: "routeguards",
                  title: "Route Guards",
                  contentPreview: "CanActivate, CanDeactivate, CanMatch, CanActivateChild — protecting routes with functional and class-based guards, async guards, and redirect patterns.",
                  contentPath: "angular/routing/routeguards"
                },
                {
                  id: "resolvers",
                  title: "Route Resolvers",
                  contentPreview: "Pre-fetch data before a component activates — components receive guaranteed data from ActivatedRoute with no loading spinners needed.",
                  contentPath: "angular/routing/resolvers"
                },
                {
                  id: "preloadingstrategies",
                  title: "Preloading Strategies",
                  contentPreview: "PreloadAllModules, QuicklinkStrategy, and custom role-based preloading — download lazy modules in the background after initial load.",
                  contentPath: "angular/routing/preloadingstrategies"
                },
                {
                  id: "lazyloadingstandalone",
                  title: "Lazy Loading with Standalone",
                  contentPreview: "loadComponent, loadChildren with routes arrays, route-scoped providers — the modern NgModule-free lazy loading architecture.",
                  contentPath: "angular/routing/lazyloadingstandalone"
                },
                {
                  id: "auxiliaryroutes",
                  title: "Auxiliary Routes & Named Outlets",
                  contentPreview: "Multiple independent router-outlet elements on the same page — side panels, dialogs, and master-detail layouts that are deep-linkable.",
                  contentPath: "angular/routing/auxiliaryroutes"
                },
                {
                  id: "routerevents",
                  title: "Router Events Lifecycle",
                  contentPreview: "NavigationStart to NavigationEnd, guards execution order, loading indicators, scroll restoration, and analytics page-view tracking.",
                  contentPath: "angular/routing/routerevents"
                }
              ]
            },
            {
              id: "forms",
              title: "Forms",
              description: "Angular provides two different approaches to handling user input through forms: reactive and template-driven. Both capture user input events from the view, validate the user input, create a form model and data model to update, and provide a way to track changes.",
              threads: [
                {
                  id: "overview",
                  title: "Forms in Angular",
                  contentPreview: "Applications use forms to enable users to log in, to update a profile, to enter sensitive information, and to perform many other data-entry tasks.",
                  contentPath: "angular/forms/overview"
                },
                {
                  id: "reactiveforms",
                  title: "Reactive forms",
                  contentPreview: "Reactive forms provide a model-driven approach to handling form inputs whose values change over time.",
                  contentPath: "angular/forms/reactiveforms"
                },
                {
                  id: "strictlytypedreactiveforms",
                  title: "Typed Forms",
                  contentPreview: "With Angular reactive forms, you explicitly specify a form model. ",
                  contentPath: "angular/forms/strictlytypedreactiveforms"
                },
                {
                  id: "templatedrivenforms",
                  title: "Building a template-driven form",
                  contentPreview: "Template-driven forms use two-way data binding to update the data model in the component as changes are made in the template and vice versa.",
                  contentPath: "angular/forms/templatedrivenforms"
                },
                {
                  id: "validateforminput",
                  title: "Validating form input",
                  contentPreview: "You can improve overall data quality by validating user input for accuracy and completeness. This page shows how to validate user input from the UI and display useful validation messages, in both reactive and template-driven forms.",
                  contentPath: "angular/forms/validateforminput"
                },
                {
                  id: "dynamicforms",
                  title: "Building dynamic forms",
                  contentPreview: "Many forms, such as questionnaires, can be very similar to one another in format and intent. To make it faster and easier to generate different versions of such a form, you can create a dynamic form template based on metadata that describes the business object model. Then, use the template to generate new forms automatically, according to changes in the data model.",
                  contentPath: "angular/forms/dynamicforms"
                }
              ]
            },
            {
              id: "httpclient",
              title: "HTTP Client",
              description: "Most front-end applications need to communicate with a server over the HTTP protocol, to download or upload data and access other back-end services. Angular provides a client HTTP API for Angular applications, the HttpClient service class in @angular/common/http.",
              threads: [
                {
                  id: "settingup",
                  title: "Setting up HttpClient",
                  contentPreview: "HttpClient is provided using the provideHttpClient helper function, which most apps include in the application providers in app.config.ts.",
                  contentPath: "angular/httpclient/settingup"
                },
                {
                  id: "makingrequests",
                  title: "Making HTTP requests",
                  contentPreview: "HttpClient has methods corresponding to the different HTTP verbs used to make requests, both to load data and to apply mutations on the server. Each method returns an RxJS Observable which, when subscribed, sends the request and then emits the results when the server responds.",
                  contentPath: "angular/httpclient/makingrequests"
                },
                {
                  id: "interceptingrequests",
                  title: "Interceptors",
                  contentPreview: "HttpClient supports two kinds of interceptors: functional and DI-based. Our recommendation is to use functional interceptors because they have more predictable behavior, especially in complex setups. Our examples in this guide use functional interceptors, and we cover DI-based interceptors in their own section at the end.",
                  contentPath: "angular/httpclient/interceptingrequests"
                },
                {
                  id: "testing",
                  title: "Test requests",
                  contentPreview: "s for any external dependency, you must mock the HTTP backend so your tests can simulate interaction with a remote server. The @angular/common/http/testing library provides tools to capture requests made by the application, make assertions about them, and mock the responses to emulate your backend's behavior.",
                  contentPath: "angular/httpclient/testing"
                }
              ]
            },
            {
              id: "serverside",
              title: "Server-side & hybrid rendering",
              description: "One of the top priorities of any developer is ensuring that their application is as performant as possible. These guides are here to help you follow best practices for building performant applications by taking advantage of different rendering strategies.",
              threads: [
                {
                  id: "ssr",
                  title: "Server-side rendering",
                  contentPreview: "Server-side rendering (SSR) is a process that involves rendering pages on the server, resulting in initial HTML content which contains initial page state. Once the HTML content is delivered to a browser, Angular initializes the application and utilizes the data contained within the HTML.",
                  contentPath: "angular/serverside/ssr"
                },
                {
                  id: "buildtimeprerender",
                  title: "Prerendering (SSG)",
                  contentPreview: "Prerendering, commonly referred to as Static Site Generation (SSG), represents the method by which pages are rendered to static HTML files during the build process.",
                  contentPath: "angular/serverside/buildtimeprerender"
                },
                {
                  id: "hybridrender",
                  title: "Hybrid rendering",
                  contentPreview: "Hybrid rendering combines the benefits of server-side rendering (SSR), pre-rendering (also known as static site generation or SSG) and client-side rendering (CSR) to optimize your Angular application. It allows you to render different parts of your application using different strategies, giving you fine-grained control over how your app is delivered to users.",
                  contentPath: "angular/serverside/hybridrender"
                },
                {
                  id: "hydration",
                  title: "Hydration",
                  contentPreview: "Hydration is the process that restores the server-side rendered application on the client. This includes things like reusing the server rendered DOM structures, persisting the application state, transferring application data that was retrieved already by the server, and other processes.",
                  contentPath: "angular/serverside/hydration"
                },
                {
                  id: "incrementalhydration",
                  title: "Incremental Hydration",
                  contentPreview: "Incremental hydration is an advanced type of hydration that can leave sections of your application dehydrated and incrementally trigger hydration of those sections as they are needed.",
                  contentPath: "angular/serverside/incrementalhydration"
                }
              ]
            },
            {
              id: "test",
              title: "Testing",
              description: "Testing your Angular application helps you check that your application is working as you expect.",
              threads: [
                {
                  id: "overview",
                  title: "Testing",
                  contentPreview: "The Angular CLI downloads and installs everything you need to test an Angular application with Jasmine testing framework.",
                  contentPath: "angular/test/overview"
                },
                {
                  id: "codecoverage",
                  title: "Find out how much code you're testing",
                  contentPreview: "The Angular CLI can run unit tests and create code coverage reports. Code coverage reports show you any parts of your code base that might not be properly tested by your unit tests.",
                  contentPath: "angular/test/codecoverage"
                },
                {
                  id: "testingservices",
                  title: "Testing services",
                  contentPreview: "Services are often the smoothest files to unit test. Here are some synchronous and asynchronous unit tests of the ValueService written without assistance from Angular testing utilities.",
                  contentPath: "angular/test/testingservices"
                },
                {
                  id: "componbasictest",
                  title: "Basics of testing components",
                  contentPreview: "A component, unlike all other parts of an Angular application, combines an HTML template and a TypeScript class. The component truly is the template and the class working together. To adequately test a component, you should test that they work together as intended.",
                  contentPath: "angular/test/componbasictest"
                },
                {
                  id: "compotestscenarios",
                  title: "Component testing scenarios",
                  contentPreview: "Compilation of all component testing scenarios",
                  contentPath: "angular/test/compotestscenarios"
                },
                {
                  id: "testattributedirect",
                  title: "Testing Attribute Directives",
                  contentPreview: "An attribute directive modifies the behavior of an element, component or another directive. Its name reflects the way the directive is applied: as an attribute on a host element.",
                  contentPath: "angular/test/testattributedirect"
                },
                {
                  id: "testpipes",
                  title: "Testing Pipes",
                  contentPreview: "A pipe class has one method, transform, that manipulates the input value into a transformed output value. The transform implementation rarely interacts with the DOM. Most pipes have no dependence on Angular other than the @Pipe metadata and an interface.",
                  contentPath: "angular/test/testpipes"
                },
                {
                  id: "debugtests",
                  title: "Debugging tests",
                  contentPreview: "Debug specs in the browser in the same way that you debug an application.",
                  contentPath: "angular/test/debugtests"
                },
                {
                  id: "testutiltiyapi",
                  title: "Testing Utility APIs",
                  contentPreview: "The Angular testing utilities include the TestBed, the ComponentFixture, and a handful of functions that control the test environment. The TestBed and ComponentFixture classes are covered separately.",
                  contentPath: "angular/test/testutiltiyapi"
                },
                {
                  id: "componentharness",
                  title: "Component harnesses overview",
                  contentPreview: "A component harness is a class that allows tests to interact with components the way an end user does via a supported API. You can create test harnesses for any component, ranging from small reusable widgets to full pages.",
                  contentPath: "angular/test/componentharness"
                },
                {
                  id: "harnessintest",
                  title: "Using component harnesses in tests",
                  contentPreview: "The Component Dev Kit (CDK) is a set of behavior primitives for building components. To use the component harnesses, first install @angular/cdk from npm. You can do this from your terminal using the Angular CLI",
                  contentPath: "angular/test/harnessintest"
                },
                {
                  id: "harnessfortype",
                  title: "Creating harnesses for your components",
                  contentPreview: "The Angular team recommends creating component test harnesses for shared components that are used in many places and have some user interactivity. ",
                  contentPath: "angular/test/harnessfortype"
                },
                {
                  id: "harnesssupport",
                  title: "Adding harness support for additional testing environments",
                  contentPreview: "Adding harness support for additional testing environments",
                  contentPath: "angular/test/harnesssupport"
                },
                {
                  id: "testintro",
                  title: "Introduction to Angular Testing",
                  contentPreview: "Catch errors early in development, which reduces the risk of regressions.",
                  contentPath: "angular/test/testintro"
                },
                {
                  id: "unittest",
                  title: "Unit Testing",
                  contentPreview: "To test a component, you need to create a testing module that declares the component and any dependencies (like pipes, directives, and sub-components).",
                  contentPath: "angular/test/unittest"
                },
                {
                  id: "reactivecode",
                  title: "Reactive Code and RxJS",
                  contentPreview: "",
                  contentPath: "angular/test/reactivecode"
                },
                {
                  id: "integrationtest",
                  title: "Integration Testing",
                  contentPreview: "Unlike isolated unit tests, integration tests load real templates, resolve dependencies through Angular’s dependency injection, and simulate user interactions to validate the overall behavior.",
                  contentPath: "angular/test/integrationtest"
                },
                {
                  id: "e2etest",
                  title: "End-to-End (E2E) Testing",
                  contentPreview: "E2E tests simulate complete user journeys, ensuring that all parts of your application (components, services, routing, and backend interactions) work together correctly.",
                  contentPath: "angular/test/e2etest"
                },
                {
                  id: "bestpract",
                  title: "Best Practices and Patterns",
                  contentPreview: "",
                  contentPath: "angular/test/bestpract"
                },
                {
                  id: "tools",
                  title: "Tools and Resources",
                  contentPreview: "",
                  contentPath: "angular/test/tools"
                },
                {
                  id: "jasminekarma",
                  title: "Jasmine & Karma: Practical Guide",
                  contentPreview: "Spies, mocks, fakeAsync, HttpClientTestingModule, MockStore — interview-ready Jasmine/Karma patterns for Angular components, services, and NgRx.",
                  contentPath: "angular/test/jasminekarma"
                },
                {
                  id: "testingstandalone",
                  title: "Testing Standalone Components",
                  contentPreview: "imports instead of declarations in TestBed, overrideComponent for stub children, route-scoped services — standalone-specific testing patterns.",
                  contentPath: "angular/test/testingstandalone"
                },
                {
                  id: "testingsignals",
                  title: "Testing Signals & Signal Stores",
                  contentPreview: "Signal reads are synchronous — TestBed.flushEffects(), fixture.componentRef.setInput(), computed assertions, and Signal Store testing patterns.",
                  contentPath: "angular/test/testingsignals"
                },
                {
                  id: "testarchitecturedecisions",
                  title: "Test Architecture Decisions",
                  contentPreview: "Testing pyramid in Angular context, what to mock vs not, data-testid over CSS selectors, async patterns, NgRx facade vs MockStore — the strategy behind good tests.",
                  contentPath: "angular/test/testarchitecturedecisions"
                }
              ]
            },
            {
              id: "internalization",
              title: "Angular Internationalization",
              description: "Internationalization, sometimes referenced as i18n, is the process of designing and preparing your project for use in different locales around the world.",
              threads: [
                {
                  id: "overview",
                  title: "Angular Internationalization",
                  contentPreview: "nternationalization, sometimes referenced as i18n, is the process of designing and preparing your project for use in different locales around the world. Localization is the process of building versions of your project for different locales. The localization process includes the following actions.",
                  contentPath: "angular/internalization/overview"
                },
                {
                  id: "localizepackage",
                  title: "Add the localize package",
                  contentPreview: "To take advantage of the localization features of Angular, use the Angular CLI to add the @angular/localize package to your project.",
                  contentPath: "angular/internalization/localizepackage"
                },
                {
                  id: "referlocalesid",
                  title: "Refer to locales by ID",
                  contentPreview: "Angular uses the Unicode locale identifier (Unicode locale ID) to find the correct locale data for internationalization of text strings.",
                  contentPath: "angular/internalization/referlocalesid"
                },
                {
                  id: "formatdateonlocale",
                  title: "Format data based on locale",
                  contentPreview: "Angular provides the following built-in data transformation pipes. The data transformation pipes use the LOCALE_ID token to format data based on rules of each locale.",
                  contentPath: "angular/internalization/formatdateonlocale"
                },
                {
                  id: "preparecomponent",
                  title: "Prepare component for translation",
                  contentPreview: "Prepare component for translation",
                  contentPath: "angular/internalization/preparecomponent"
                },
                {
                  id: "workwithtransfile",
                  title: "Work with translation files",
                  contentPreview: "After you prepare a component for translation, use the extract-i18n Angular CLI command to extract the marked text in the component into a source language file.",
                  contentPath: "angular/internalization/workwithtransfile"
                },
                {
                  id: "mergetranslations",
                  title: "Merge translations into the application",
                  contentPreview: "Merge translations into the application",
                  contentPath: "angular/internalization/mergetranslations"
                },
                {
                  id: "deploymultiplelocales",
                  title: "Deploy multiple locales",
                  contentPreview: "If myapp is the directory that contains the distributable files of your project, you typically make different versions available for different locales in locale directories. ",
                  contentPath: "angular/internalization/deploymultiplelocales"
                },
                {
                  id: "importglobalvariants",
                  title: "Import global variants of the locale data",
                  contentPreview: "The Angular CLI automatically includes locale data if you run the ng build command with the --localize option.",
                  contentPath: "angular/internalization/importglobalvariants"
                },
                {
                  id: "managemarkedtext",
                  title: "Manage marked text with custom IDs",
                  contentPreview: "The Angular extractor generates a file with a translation unit entry",
                  contentPath: "angular/internalization/managemarkedtext"
                },
                {
                  id: "exampleangularapp",
                  title: "Example Angular Internationalization application",
                  contentPreview: "Example Angular Internationalization application",
                  contentPath: "angular/internalization/exampleangularapp"
                }
              ]
            },
            {
              id: "experimentalfeatures",
              title: "Experimental Features",
              description: "Zoneless focus",
              threads: [
                {
                  id: "zoneless",
                  title: "Angular without ZoneJS (Zoneless)",
                  contentPreview: "The API for enabling Zoneless is currently experimental. Neither the shape, nor the underlying behavior is stable and can change in patch versions. ",
                  contentPath: "angular/experimentalfeatures/zoneless"
                }
              ]
            },
            {
              id: "changedetection",
              title: "Change Detection",
              description: "Change Detection in Angular ensures the synchronization of the application state with the UI.",
              threads: [
                {
                  id: "whatiscd",
                  title: "What is Change Detection",
                  contentPreview: "Change Detection in Angular ensures the synchronization of the application state with the UI.",
                  contentPath: "angular/changedetection/whatiscd"
                },
                {
                  id: "onpush",
                  title: "OnPush ",
                  contentPreview: "OnPush Strategy (Check Only When Inputs Change) Components only check for changes when input properties change (@Input()).",
                  contentPath: "angular/changedetection/onpush"
                },
                {
                  id: "ngzone",
                  title: "Angular ngZone",
                  contentPreview: "Angular’s change detection is powered by Zone.js through the NgZone service. NgZone provides an execution context that automatically detects and responds to asynchronous events—ensuring that your view stays in sync with your data without manual intervention.",
                  contentPath: "angular/changedetection/ngzone"
                },
                {
                  id: "dominangular",
                  title: "DOM in Angular",
                  contentPreview: "Angular works directly with the real browser DOM. Unlike some frameworks (such as React) that use a Virtual DOM to manage updates, Angular interacts with the actual DOM but employs sophisticated change detection mechanisms to efficiently update views.",
                  contentPath: "angular/changedetection/dominangular"
                },
                {
                  id: "treeshaking",
                  title: "Tree Shaking",
                  contentPreview: "Tree shaking is a form of dead-code elimination that statically analyzes your code and “shakes off” parts that are never used (i.e., not referenced by any part of your application).",
                  contentPath: "angular/changedetection/treeshaking"
                },
                {
                  id: "ivy",
                  title: "Ivy",
                  contentPreview: "Ivy is Angular’s modern rendering engine and compilation pipeline. It transforms Angular templates and components into highly optimized JavaScript code that directly manipulates the DOM.",
                  contentPath: "angular/changedetection/ivy"
                },
                {
                  id: "onpushdeep",
                  title: "OnPush - Architect-Level Guide",
                  contentPreview: "The four OnPush triggers, markForCheck vs detectChanges, immutability, and signals + OnPush.",
                  contentPath: "angular/changedetection/onpushdeep"
                }
              ]
            },
            {
              id: "rxjs",
              title: "RxJs",
              description: "RxJs Reactive Programming",
              threads: [
                {
                  id: "fundamentals",
                  title: "Fundamentals",
                  contentPreview: "RxJS (Reactive Extensions for JavaScript) is a library that enables reactive programming by using Observables.",
                  contentPath: "angular/rxjs/fundamentals"
                },
                {
                  id: "subjects",
                  title: "Subjects and Multicasting",
                  contentPreview: "A Subject is a special type of Observable that acts both as an Observable and an Observer. ",
                  contentPath: "angular/rxjs/subjects"
                },
                {
                  id: "creationoper",
                  title: "Creation Operators",
                  contentPreview: "Creates an Observable that emits the arguments you pass and then completes.",
                  contentPath: "angular/rxjs/creationoper"
                },
                {
                  id: "transformationoper",
                  title: "Transformation Operators",
                  contentPreview: "Transforms each emission from the source Observable by applying a projection function.",
                  contentPath: "angular/rxjs/transformationoper"
                },
                {
                  id: "filteringoper",
                  title: "Filtering Operators",
                  contentPreview: "The filter() operator emits only those values that pass a given predicate (a function that returns a boolean).",
                  contentPath: "angular/rxjs/filteringoper"
                },
                {
                  id: "combinationoper",
                  title: "Combination Operators",
                  contentPreview: "Merge emissions from two or more Observables concurrently into a single Observable.",
                  contentPath: "angular/rxjs/combinationoper"
                },
                {
                  id: "errorhandlingoper",
                  title: "Error Handling Operators",
                  contentPreview: "Intercepts an error from the source Observable and returns a new Observable (which may emit replacement values, a fallback Observable, or simply complete).",
                  contentPath: "angular/rxjs/errorhandlingoper"
                },
                {
                  id: "utilityoper",
                  title: "Utility Operators",
                  contentPreview: "Perform side effects for notifications from the source Observable without altering the stream. Ideal for debugging or logging.",
                  contentPath: "angular/rxjs/utilityoper"
                },
                {
                  id: "schedulers",
                  title: "Schedulers",
                  contentPreview: "A Scheduler is an abstraction for controlling when a task or piece of code is executed.",
                  contentPath: "angular/rxjs/schedulers"
                },
                {
                  id: "advanced",
                  title: "Advanced Topics",
                  contentPreview: "",
                  contentPath: "angular/rxjs/advanced"
                },
                {
                  id: "patterns",
                  title: "Best Practices and Patterns",
                  contentPreview: "",
                  contentPath: "angular/rxjs/patterns"
                }
              ]
            },
            {
              id: "ngrx",
              title: "NgRx",
              description: "NgRx Store Management",
              threads: [
                {
                  id: "core",
                  title: "Core Concepts",
                  contentPreview: "",
                  contentPath: "angular/ngrx/core"
                },
                {
                  id: "sideeffects",
                  title: "Side Effects",
                  contentPreview: "Reducers are pure functions that should only calculate the next state. Side effects (like API calls) must be handled separately.",
                  contentPath: "angular/ngrx/sideeffects"
                },
                {
                  id: "ngrxentity",
                  title: "NgRx Entity",
                  contentPreview: "It encourages storing your collection of items in a normalized format (i.e., a dictionary of entities and an array of entity IDs) to avoid data duplication and improve lookup performance.",
                  contentPath: "angular/ngrx/ngrxentity"
                },
                {
                  id: "metareducers",
                  title: "Meta Reducers",
                  contentPreview: "Meta-reducers are functions that take a reducer as input and return a new reducer. They act as middleware at the reducer level, modifying state or logging actions before (or after) the base reducer processes an action.",
                  contentPath: "angular/ngrx/metareducers"
                },
                {
                  id: "architecturalpatterns",
                  title: "Architectural Patterns",
                  contentPreview: "",
                  contentPath: "angular/ngrx/architecturalpatterns"
                },
                {
                  id: "testingngrx",
                  title: "Testing with NgRx",
                  contentPreview: "",
                  contentPath: "angular/ngrx/testingngrx"
                },
                {
                  id: "advanced",
                  title: "Advanced Topics",
                  contentPreview: "",
                  contentPath: "angular/ngrx/advanced"
                },
                {
                  id: "componentstore",
                  title: "ComponentStore — Feature-Level State",
                  contentPreview: "@ngrx/component-store: scoped, instance-per-component state management with updaters and effects. The lightweight alternative to global NgRx.",
                  contentPath: "angular/ngrx/componentstore"
                },
                {
                  id: "signalstore",
                  title: "Signal Store (@ngrx/signals)",
                  contentPreview: "NgRx Signal Store — signal-native state management with withState, withComputed, withMethods, withEntities, and composable custom features.",
                  contentPath: "angular/ngrx/signalstore"
                },
                {
                  id: "cvexamples",
                  title: "CV Examples & Interview Patterns",
                  contentPreview: "Facade pattern, lazy-loaded feature state, selector-driven KPI dashboards, and role-based UI — real-world NgRx patterns from enterprise Angular work.",
                  contentPath: "angular/ngrx/cvexamples"
                }
              ]
            },
            {
              id: "signals",
              title: "Signals",
              description: "Angular Signals is a system that granularly tracks how and where your state is used throughout an application, allowing the framework to optimize rendering updates.",
              threads: [
                {
                  id: "signalintroduction",
                  title: "Introduction to Angular Signals",
                  contentPreview: "A signal is a wrapper around a value that notifies interested consumers when that value changes. Signals can contain any value, from primitives to complex data structures.",
                  contentPath: "angular/signals/signalintroduction"
                },
                {
                  id: "linkedsignal",
                  title: "Dependent state with linkedSignal",
                  contentPreview: "The linkedSignal function lets you create a signal to hold some state that is intrinsically linked to some other state. ",
                  contentPath: "angular/signals/linkedsignal"
                },
                {
                  id: "asyncreactivity",
                  title: "Async reactivity with resources",
                  contentPreview: "Most signal APIs are synchronous— signal, computed, input, etc. However, applications often need to deal with data that is available asynchronously. A Resource gives you a way to incorporate async data into your application's signal-based code.",
                  contentPath: "angular/signals/asyncreactivity"
                },
                {
                  id: "signalswithrxjs",
                  title: "Using signals with RxJs",
                  contentPreview: "The @angular/rxjs-interop package offers APIs that help you integrate RxJS and Angular signals.",
                  contentPath: "angular/signals/signalswithrxjs"
                }
              ]
            },
            {
              id: "security",
              title: "Security",
              description: "Angular security: XSS prevention, authentication patterns, CSRF protection, and secure architectural patterns.",
              threads: [
                {
                  id: "xssprevention",
                  title: "XSS Prevention",
                  contentPreview: "Angular's automatic sanitization, DomSanitizer, bypassSecurityTrust* risks, and Content Security Policy — building XSS-safe Angular apps.",
                  contentPath: "angular/security/xssprevention"
                },
                {
                  id: "authpatterns",
                  title: "Authentication Patterns",
                  contentPreview: "JWT storage strategies, token refresh interceptor, concurrent refresh queuing, OAuth2/OIDC with angular-oauth2-oidc — production auth architecture.",
                  contentPath: "angular/security/authpatterns"
                },
                {
                  id: "csrfprotection",
                  title: "CSRF Protection",
                  contentPreview: "HttpClientXsrfModule, SameSite cookies, server-side CSRF token validation — when CSRF matters and how Angular handles it.",
                  contentPath: "angular/security/csrfprotection"
                },
                {
                  id: "csp",
                  title: "Content Security Policy",
                  contentPreview: "CSP headers for Angular apps, nonce-based approach for component styles, nginx configuration, and the security headers every Angular app should have.",
                  contentPath: "angular/security/csp"
                }
              ]
            },
            {
              id: "designpatterns",
              title: "Design Patterns",
              description: "Architectural patterns for scalable, maintainable Angular applications: component patterns, SOLID principles, state management decisions, and error handling.",
              threads: [
                {
                  id: "smartdumbcomponents",
                  title: "Smart & Dumb Components",
                  contentPreview: "Container/presenter pattern — the most impactful architectural decision for Angular UI scalability. Smart containers own state, dumb presenters own rendering.",
                  contentPath: "angular/designpatterns/smartdumbcomponents"
                },
                {
                  id: "solidinangular",
                  title: "SOLID Principles in Angular",
                  contentPreview: "SRP services, OCP via InjectionToken strategy pattern, LSP abstract services, ISP narrow interfaces, DIP with abstract classes — SOLID applied to Angular.",
                  contentPath: "angular/designpatterns/solidinangular"
                },
                {
                  id: "statemanagementdecisions",
                  title: "State Management Decision Framework",
                  contentPreview: "When to use component signals vs shared service vs ComponentStore vs global NgRx vs Signal Store — justified architectural choices.",
                  contentPath: "angular/designpatterns/statemanagementdecisions"
                },
                {
                  id: "errorhandling",
                  title: "Global Error Handling Architecture",
                  contentPreview: "ErrorHandler, HTTP error interceptor, route error boundaries, abstract LoggingService with Sentry/AppInsights — centralized error management.",
                  contentPath: "angular/designpatterns/errorhandling"
                },
                {
                  id: "facadepattern",
                  title: "Facade Pattern for NgRx",
                  contentPreview: "Wrapping the NgRx store behind a Facade service — components talk to the Facade, never to the store directly. Simplifies testing and decouples architecture.",
                  contentPath: "angular/designpatterns/facadepattern"
                },
                {
                  id: "projectstructure",
                  title: "Project Structure Decisions",
                  contentPreview: "Feature-first vs layer-first architecture, core vs shared distinction, co-locating state with features, barrel exports, and path aliases for large Angular apps.",
                  contentPath: "angular/designpatterns/projectstructure"
                }
              ]
            },
            {
              id: "buildtooling",
              title: "Build & Tooling",
              description: "Angular build configuration, environment strategy, and deployment patterns.",
              threads: [
                {
                  id: "environments",
                  title: "Environment Configuration Strategy",
                  contentPreview: "fileReplacements, InjectionToken for config, runtime config via APP_INITIALIZER for container deployments, and build budgets in angular.json.",
                  contentPath: "angular/buildtooling/environments"
                },
                {
                  id: "esbuild",
                  title: "esbuild in Angular 17+",
                  contentPreview: "The new default builder replaces Webpack — 10x faster builds, Vite dev server, migration steps, and what breaks during migration.",
                  contentPath: "angular/buildtooling/esbuild"
                },
                {
                  id: "workspaceconfig",
                  title: "Workspace Configuration & Libraries",
                  contentPreview: "Multi-project Angular workspaces, ng-packagr for library publishing, secondary entry points, path aliases, and the Angular Package Format.",
                  contentPath: "angular/buildtooling/workspaceconfig"
                },
                {
                  id: "monorepo",
                  title: "Monorepo Strategies: Nx vs Angular Workspace",
                  contentPreview: "When to use Angular CLI multi-project vs Nx — build caching, affected computation, module boundary enforcement, and the 4 library types pattern.",
                  contentPath: "angular/buildtooling/monorepo"
                },
                {
                  id: "buildconfiguration",
                  title: "Build Configuration & Optimizations",
                  contentPreview: "Production build options, optimization flags, output hashing for caching, source map strategies, bundle analysis, and ng build configurations.",
                  contentPath: "angular/buildtooling/buildconfiguration"
                }
              ]
            },
            {
              id: "microfrontends",
              title: "Micro-Frontends",
              description: "Independent deployment of Angular feature apps using Module Federation. Shell + remote architecture, shared state strategies, and Nx tooling.",
              threads: [
                {
                  id: "overview",
                  title: "Micro-Frontends Overview",
                  contentPreview: "Micro-frontends extend the microservices pattern to the UI layer — independent teams own separate Angular slices, each with its own CI/CD, composed into a single shell at runtime.",
                  contentPath: "angular/microfrontends/overview"
                },
                {
                  id: "modulefederation",
                  title: "Module Federation with Angular",
                  contentPreview: "Webpack 5 Module Federation via @angular-architects/module-federation — remote config, shell routing with loadRemoteModule, shared singletons, and environment-driven URLs.",
                  contentPath: "angular/microfrontends/modulefederation"
                },
                {
                  id: "dockerdeployment",
                  title: "Docker Deployment",
                  contentPreview: "Deploying each micro-frontend as an independent Docker container — nginx reverse proxy, runtime URL injection via APP_INITIALIZER, docker-compose setup, and Kubernetes deployments.",
                  contentPath: "angular/microfrontends/docker-deployment"
                },
                {
                  id: "examples",
                  title: "Common Examples",
                  contentPreview: "Practical micro-frontend patterns: e-commerce platform, banking dashboard, SaaS multi-tenant portal, and admin tools — with cross-MFE communication, auth sharing, and anti-patterns.",
                  contentPath: "angular/microfrontends/examples"
                }
              ]
            },
            {
              id: "accessibility",
              title: "Accessibility (a11y)",
              description: "Building accessible Angular applications: CDK a11y tools, ARIA in templates, keyboard navigation, and WCAG compliance patterns.",
              threads: [
                {
                  id: "cdka11y",
                  title: "Angular CDK a11y Module",
                  contentPreview: "FocusTrap for modals, LiveAnnouncer for screen readers, FocusMonitor for keyboard vs mouse detection, and ListKeyManager for custom list navigation.",
                  contentPath: "angular/accessibility/cdka11y"
                },
                {
                  id: "aria",
                  title: "ARIA in Angular Templates",
                  contentPreview: "Dynamic [attr.aria-*] bindings, expandable content, form validation, live regions, landmark roles, skip navigation, and router focus management.",
                  contentPath: "angular/accessibility/aria"
                },
                {
                  id: "keyboardnavigation",
                  title: "Keyboard Navigation Patterns",
                  contentPreview: "Tab order management, HostListener key events, CDK ListKeyManager for custom menus, focus restoration after dialogs, and the custom interactive component checklist.",
                  contentPath: "angular/accessibility/keyboardnavigation"
                }
              ]
            },
            {
              id: "performance",
              title: "Performance",
              description: "Angular performance optimization: virtual scrolling, rendering optimizations, OnPush strategy, and build-time improvements.",
              threads: [
                {
                  id: "virtualscrolling",
                  title: "CDK Virtual Scrolling",
                  contentPreview: "Render only visible items — CdkVirtualScrollViewport, itemSize, DataSource for on-demand loading, variable-size items, scroll-to-index, and infinite scroll patterns.",
                  contentPath: "angular/performance/virtualscrolling"
                },
                {
                  id: "renderingoptimizations",
                  title: "Rendering Optimizations",
                  contentPreview: "trackBy and @for track to prevent DOM churn, OnPush with immutable updates, @defer for lazy rendering, pure pipes over template methods, runOutsideAngular.",
                  contentPath: "angular/performance/renderingoptimizations"
                }
              ]
            },
            {
              id: "cdk",
              title: "Angular CDK",
              description: "Component Development Kit — low-level primitives for building accessible, well-positioned custom components without Angular Material visual design.",
              threads: [
                {
                  id: "overview",
                  title: "CDK Overview",
                  contentPreview: "All CDK modules: a11y, overlay, portal, drag-drop, scrolling, clipboard, layout, observers — what each does and when to use CDK vs Angular Material.",
                  contentPath: "angular/cdk/overview"
                },
                {
                  id: "overlayportal",
                  title: "Overlay & Portal",
                  contentPreview: "Building custom dialogs and tooltips — connected position strategies, scroll strategies, backdrop, focus trapping, PortalOutlet for rendering anywhere in the DOM.",
                  contentPath: "angular/cdk/overlayportal"
                }
              ]
            },
            {
              id: "pwa",
              title: "Progressive Web Apps",
              description: "Angular Service Workers for offline capability, caching strategies, app update handling, and push notifications.",
              threads: [
                {
                  id: "serviceworker",
                  title: "Angular Service Workers",
                  contentPreview: "ng add @angular/pwa, ngsw-config.json caching strategies (freshness vs performance), VERSION_READY update flow, push notifications, and SSR compatibility.",
                  contentPath: "angular/pwa/serviceworker"
                }
              ]
            }
          ]
        }
      ],
    },
    {
      id: "backend",
      name: "Backend",
      icon: ServerIcon,
      subcategories: [
        {
          id: "csharpjunior",
          name: "C# - Junior",
          description: "Essential C# concepts for junior developers",
          topics: [
            {
              id: "clr",
              title: "Common Language Runtime",
              description: "Understanding the CLR and how it executes .NET applications",
              threads: [
                {
                  id: "overview",
                  title: "CLR Overview",
                  contentPreview: "The Common Language Runtime (CLR) is the virtual machine component of Microsoft's .NET framework that manages the execution of .NET programs.",
                  contentPath: "csharpjunior/clr/overview"
                },
                {
                  id: "assemblies",
                  title: "Assemblies and Intermediary Language",
                  contentPreview: "In the .NET ecosystem, assemblies and the Intermediate Language (IL) are core concepts that form the foundation of how applications are built, deployed, and executed by the Common Language Runtime (CLR).",
                  contentPath: "csharpjunior/clr/assemblies"
                },
                {
                  id: "jit",
                  title: "Just-In-Time Compilation",
                  contentPreview: "JIT compilation is a key mechanism used by the CLR to convert Intermediate Language (IL) into native machine code at runtime. This process allows .NET applications to run efficiently on the target hardware, while also enabling runtime optimizations.",
                  contentPath: "csharpjunior/clr/jit"
                },
                {
                  id: "memorymanagement",
                  title: "Basic Memory Management and Garbage Collection",
                  contentPreview: "Understanding memory management is essential for building efficient .NET applications. The CLR (Common Language Runtime) handles memory automatically through garbage collection, which relieves developers from manual memory allocation and deallocation.",
                  contentPath: "csharpjunior/clr/memorymanagement"
                },
                {
                  id: "exceptionhandling",
                  title: "Exception Handling in the CLR",
                  contentPreview: "The CLR provides a robust, structured exception handling mechanism that allows .NET applications to gracefully manage errors and unexpected conditions during execution. This mechanism is based on try/catch/finally constructs and supports features like exception propagation, stack unwinding, and the use of finalizers for cleanup.",
                  contentPath: "csharpjunior/clr/exceptionhandling"
                },
                {
                  id: "garbage",
                  title: "Garbage Collection Mechanisms",
                  contentPreview: "The .NET garbage collector (GC) is responsible for automatically managing memory, ensuring that objects no longer in use are reclaimed to free up resources. It employs several advanced mechanisms to optimize performance and efficiency.",
                  contentPath: "csharpjunior/clr/garbage"
                },
                {
                  id: "reflection",
                  title: "Reflection and Metadata Inspection",
                  contentPreview: "Reflection is a powerful feature in .NET that allows you to inspect assemblies, types, and their members at runtime. It enables dynamic type creation, runtime code execution, and various other advanced programming scenarios.",
                  contentPath: "csharpjunior/clr/reflection"
                },
                {
                  id: "assemlyversioning",
                  title: "Assembly Versioning and Strong Naming",
                  contentPreview: "Understanding assembly versioning and strong naming is essential for maintaining reliable, secure, and interoperable .NET applications. This topic covers the fundamentals of strong naming, assembly versioning, and the role of the Global Assembly Cache (GAC), along with best practices for managing assembly versions.",
                  contentPath: "csharpjunior/clr/assemlyversioning"
                },
                {
                  id: "typesafety",
                  title: "Type Safety and Security",
                  contentPreview: "The Common Language Runtime (CLR) plays a pivotal role in ensuring that .NET applications are secure and reliable. Two key aspects of this are enforcing type safety and managing code security through mechanisms like Code Access Security (CAS) and modern security practices.",
                  contentPath: "csharpjunior/clr/typesafety"
                },
                {
                  id: "profiling",
                  title: "Profiling and Performance Tuning in the CLR",
                  contentPreview: "Profiling and performance tuning are essential practices for optimizing .NET applications. By using specialized tools and techniques, you can identify performance bottlenecks in managed code and fine-tune your application for better responsiveness and efficiency.",
                  contentPath: "csharpjunior/clr/profiling"
                },
                {
                  id: "dynamiccode",
                  title: "Low-Level IL and Dynamic Code Generation",
                  contentPreview: "Exploring low-level Intermediate Language (IL) and dynamic code generation provides deep insights into how .NET executes code and opens up advanced scenarios for runtime optimization and flexibility.",
                  contentPath: "csharpjunior/clr/dynamiccode"
                },
                {
                  id: "interoperability",
                  title: "Interoperability with Unmanaged Code",
                  contentPreview: "Interoperability enables managed .NET applications to call into native libraries or components written in unmanaged code (e.g., C/C++ or COM components). This capability allows you to leverage existing code and system APIs while still benefiting from the productivity and safety of the .NET environment.",
                  contentPath: "csharpjunior/clr/interoperability"
                },
                {
                  id: "internals",
                  title: "CLR Internals and Hosting the CLR",
                  contentPreview: "Understanding the internals of the CLR and learning how to host it in custom applications can provide deep insights into how .NET manages code execution, memory, and security. This knowledge is useful for advanced scenarios such as optimizing performance, dynamic assembly loading, and embedding .NET into native applications.",
                  contentPath: "csharpjunior/clr/internals"
                },
                {
                  id: "memorylayout",
                  title: "Memory Layout and Low-Level Memory Management",
                  contentPreview: "Understanding how memory is allocated and managed is critical for writing high-performance .NET applications. This topic covers the differences between stack and heap allocation, as well as how memory fragmentation can impact performance.",
                  contentPath: "csharpjunior/clr/memorylayout"
                },
                {
                  id: "async",
                  title: "Asynchronous Programming and the CLR",
                  contentPreview: "Asynchronous programming is a core aspect of modern .NET development, and the CLR provides extensive support for asynchronous operations through the async/await pattern, Task-based Asynchronous Pattern (TAP), and an efficient thread pool.",
                  contentPath: "csharpjunior/clr/async"
                },
                {
                  id: "gac",
                  title: "Global Assembly Cache",
                  contentPreview: "The Global Assembly Cache (GAC) is a machine-wide code cache for the Common Language Runtime (CLR) in the .NET Framework. It stores assemblies specifically designated to be shared by several applications on the computer.",
                  contentPath: "csharpjunior/clr/gac"
                }
              ]
            },
            {
              id: "othermajor",
              title: "Other Major Components of .Net",
              description: "Besides the CLR, the main keys of the .Net platform",
              threads: [
                {
                  id: "fcl",
                  title: "Framework Class Library(FCL)",
                  contentPreview: "The Framework Class Library (FCL) is a comprehensive collection of reusable classes, interfaces, and value types that are part of Microsoft's .NET Framework. These libraries provide the underlying building blocks for any .NET-based application, handling everything from file I/O and string manipulation to advanced networking and data access.",
                  contentPath: "csharpjunior/othermajor/fcl"
                },
                {
                  id: "bcl",
                  title: "The .NET Base Class Library (BCL)",
                  contentPreview: "The Base Class Library (BCL) is a subset of the .NET Framework Class Library (FCL) that provides the most fundamental and commonly used core APIs. It includes basic types (e.g., System.Object, System.String), collections, I/O, and other essential functionality. ",
                  contentPath: "csharpjunior/othermajor/bcl"
                },
                {
                  id: "cts",
                  title: "Common Type System(CTS)",
                  contentPreview: "The Common Type System (CTS) is a fundamental part of the .NET architecture that defines how types (classes, interfaces, structs, enums, etc.) are declared, used, and managed in the runtime.",
                  contentPath: "csharpjunior/othermajor/cts"
                },
                {
                  id: "cls",
                  title: "Common Language Specification (CLS)",
                  contentPreview: "The Common Language Specification (CLS) is a key part of the .NET platform that defines a subset of language features and rules that all .NET languages can agree upon. ",
                  contentPath: "csharpjunior/othermajor/cls"
                }
              ]
            },
            {
              id: "oop",
              title: "Object Oriented Programming in C#",
              description: "How principles of OOP are reflected in C# .Net and examples on how to follow best practices when designing your code.",
              threads: [
                {
                  id: "encapsulation",
                  title: "Encapsulation",
                  contentPreview: "Encapsulation is the principle of bundling the data (fields) and the methods (functions) that operate on the data into a single unit or class, and restricting access to some of the object's components. ",
                  contentPath: "csharpjunior/oop/encapsulation"
                },
                {
                  id: "inheritance",
                  title: "Inheritance",
                  contentPreview: "nheritance allows one class (a derived or child class) to inherit the properties and behaviors (methods) from another class (the base or parent class).",
                  contentPath: "csharpjunior/oop/inheritance"
                },
                {
                  id: "polymorphism",
                  title: "Polymorphism",
                  contentPreview: "Polymorphism allows objects of different types to be treated as objects of a common base type. The most common form of polymorphism in .NET is method overriding and method overloading.",
                  contentPath: "csharpjunior/oop/polymorphism"
                },
                {
                  id: "abstraction",
                  title: "Abstraction",
                  contentPreview: "Abstraction is the process of hiding the complex implementation details and exposing only the essential features of an object or system. ",
                  contentPath: "csharpjunior/oop/abstraction"
                },
                {
                  id: "classes",
                  title: "Different Classes in C#",
                  contentPreview: "Short Overview of the categories of classes in C#",
                  contentPath: "csharpjunior/oop/classes"
                },
                {
                  id: "extensionmethods",
                  title: "Extension Methods in C#",
                  contentPreview: "Extension methods in C# allow developers to add new methods to existing types without modifying, deriving from, or recompiling the original types.",
                  contentPath: "csharpjunior/oop/extensionmethods"
                },
                {
                  id: "attributes",
                  title: "Attributes in C#",
                  contentPreview: "Attributes in C# are a powerful way to add declarative information to your code. They are used to add metadata, such as compiler instructions, annotations, or custom information, to program elements (classes, methods, properties, etc.). ",
                  contentPath: "csharpjunior/oop/attributes"
                }
              ]
            },
            {
              id: 'datastructures',
              title: "Data structures in C#",
              description: "From the basics of usage, to memory allocation and Interfaces Implemented in C# Data structures",
              threads: [
                {
                  id: "array",
                  title: "Arrays, Multi-Dimensional Arrays, and Jagged Arrays",
                  contentPreview: "Understanding the various forms of arrays in C# is crucial not only for everyday programming but also for tackling advanced interview questions. ",
                  contentPath: "csharpjunior/datastructures/array"
                },
                {
                  id: "list",
                  title: "List",
                  contentPreview: "List<T> is a resizable array implementation provided by the .NET Framework in the System.Collections.Generic namespace.",
                  contentPath: "csharpjunior/datastructures/list"
                },
                {
                  id: "linkedlist",
                  title: "LinkedList",
                  contentPreview: "A generic collection where each element (node) contains a reference to both the previous and the next node, forming a bi-directional chain. ",
                  contentPath: "csharpjunior/datastructures/linkedlist"
                },
                {
                  id: "stackqueue",
                  title: "Stack And Queue",
                  contentPreview: "First in First Out or Last in First Out",
                  contentPath: "csharpjunior/datastructures/stackqueue"
                },
                {
                  id: "dictionary",
                  title: "Dictionary, SortedDictionary",
                  contentPreview: "The main key value data structure in C#",
                  contentPath: "csharpjunior/datastructures/dictionary"
                },
                {
                  id: "sortedlist",
                  title: "SortedList, Hashtable",
                  contentPreview: "SortedList<TKey, TValue> is a collection that stores key-value pairs in sorted order by key. ",
                  contentPath: "csharpjunior/datastructures/sortedlist"
                },
                {
                  id: "hashset",
                  title: "HashSet, SortedSet",
                  contentPreview: "HashSet<T> is a collection that stores unique elements without any particular order. It is optimized for fast lookup, insertion, and deletion operations.",
                  contentPath: "csharpjunior/datastructures/hashset"
                },
                {
                  id: "concurrent",
                  title: "ConcurrentQueue, ConcurrentStack, ConcurrentBag, ConcurrentDictionary",
                  contentPreview: "Thread safe versions of their counterparts",
                  contentPath: "csharpjunior/datastructures/concurrent"
                },
                {
                  id: "bitarray",
                  title: "BitArray",
                  contentPreview: "BitArray is a collection that stores Boolean values in a compact, bit-level representation. ",
                  contentPath: "csharpjunior/datastructures/bitarray"
                },
                {
                  id: "immutable",
                  title: "Immutable List,Dictionary, HashSet, Queue, Stack",
                  contentPreview: "Immutable versions of their counterparts",
                  contentPath: "csharpjunior/datastructures/immutable"
                },
                {
                  id: "tuple",
                  title: "Tuple and ValueTuple",
                  contentPreview: "The Tuple class (e.g., Tuple<T1, T2, ...>) is a reference type introduced in .NET Framework 4.0. Tuples are immutable, meaning once created, their values cannot change.",
                  contentPath: "csharpjunior/datastructures/tuple"
                },
                {
                  id: "span",
                  title: "Span and Memory",
                  contentPreview: "Span<T> is a stack-only type (a ref struct) that represents a contiguous region of arbitrary memory. It can point to arrays, stack-allocated memory, or unmanaged memory.",
                  contentPath: "csharpjunior/datastructures/span"
                },
                {
                  id: "priority",
                  title: "PriorityQueue",
                  contentPreview: "PriorityQueue<TElement, TPriority> is a collection that stores elements along with an associated priority. ",
                  contentPath: "csharpjunior/datastructures/priority"
                }
              ]
            },
            {
              id: 'linq',
              title: 'LINQ',
              description: 'LINQ (Language Integrated Query) is a powerful feature in C# that allows you to query collections, databases, and other data sources using a consistent, SQL-like syntax.',
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "What is LINQ and it's components",
                  contentPath: "csharpjunior/linq/overview"
                }
              ]
            },
            {
              id: 'serialization',
              title: 'Serialization and Encryption',
              description: 'Serialization is the process of converting an object or data structure into a format that can be easily stored, transmitted, or reconstructed later.',
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "Basis of Serialization and Encryption",
                  contentPath: "csharpjunior/serialization/overview"
                }
              ]
            },
            {
              id: 'algorithms',
              title: 'Algorithms',
              description: 'Common Algorithms used in Programming implemented in C#',
              threads: [
                {
                  id: "list",
                  title: "List Overview",
                  contentPreview: "Listing all common algorithms",
                  contentPath: "csharpjunior/algorithms/list"
                }
              ]
            },
            {
              id: 'interfaces',
              title: 'Common Interfaces',
              description: '',
              threads: [
                {
                  id: "ienumerable",
                  title: "IEnumerable, IEnumerable<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ienumerable"
                },
                {
                  id: "ienumerator",
                  title: "IEnumerator and IEnumerator<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ienumerator"
                },
                {
                  id: "icollection",
                  title: "ICollection and ICollection<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icollection"
                },
                {
                  id: "ilist",
                  title: "IList and IList<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ilist"
                },
                {
                  id: "idictionary",
                  title: "IDictionary and  IDictionary<TKey, TValue>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/idictionary"
                },
                {
                  id: "ireadonlycollection",
                  title: "IReadOnlyCollection<T> and IReadOnlyList<T> and IReadOnlyDictionary<TKey, TValue>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ireadonlycollection"
                },
                {
                  id: "icomparable",
                  title: "IComparable and IComparable<T> and IEquatable<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icomparable"
                },
                {
                  id: "icloneable",
                  title: "ICloneable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icloneable"
                },
                {
                  id: "idisposable",
                  title: "IDisposable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/idisposable"
                },
                {
                  id: "iserializable",
                  title: "ISerializable and IDeserializationCallback",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iserializable"
                },
                {
                  id: "iformattable",
                  title: "ICustomFormatter and IFormattable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iformattable"
                },
                {
                  id: "inotify",
                  title: "INotifyPropertyChanged and INotifyCollectionChanged and INotifyDataErrorInfo and INotifyPropertyChanging and INotifyCompletion and ICriticalNotifyCompletion",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/inotify"
                },
                {
                  id: "icomparer",
                  title: "IComparer and IComparer<T> and IEqualityComparer and IEqualityComparer<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icomparer"
                },
                {
                  id: "iasync",
                  title: "IAsyncDisposable and IAsyncEnumerable<T> and IAsyncEnumerator<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iasync"
                },
                {
                  id: "iobservable",
                  title: "IObservable<T> and IObserver<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iobservable"
                },
                {
                  id: "iprogress",
                  title: "IProgress<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iprogress"
                },
                {
                  id: "iconvertible",
                  title: "IConvertible",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iconvertible"
                }
              ]
            },
            {
              id: 'delegates',
              title: 'Delegates',
              description: '',
              threads: [
                {
                  id: "overview",
                  title: "Introduction to Delegates",
                  contentPreview: "Delegates in C# are similar to function pointers in other languages but are type-safe and object-oriented. They allow you to reference methods as variables, pass them as parameters, and invoke them dynamically.",
                  contentPath: "csharpjunior/delegates/overview"
                },
                {
                  id: "multicast",
                  title: "Multicast Delegates",
                  contentPreview: "A multicast delegate is a delegate that can reference more than one method. In C#, all delegates are multicast by default. When you use the += operator, you add methods to the delegate's invocation list.",
                  contentPath: "csharpjunior/delegates/multicast"
                },
                {
                  id: "anonymous",
                  title: "Anonymous Methods and Lambda Expressions",
                  contentPreview: "Anonymous methods and lambda expressions in C# allow you to define inline functions without having to declare a separate method.",
                  contentPath: "csharpjunior/delegates/anonymous"
                },
                {
                  id: "covacontra",
                  title: "Covariance and Contravariance in Delegates",
                  contentPreview: "Covariance and contravariance allow for more flexible delegate assignments by enabling method signatures to vary in return types and parameter types under certain conditions.",
                  contentPath: "csharpjunior/delegates/covacontra"
                },
                {
                  id: "performance",
                  title: "Performance considerations in delegates",
                  contentPreview: "Delegates in C# provide a flexible mechanism for referencing and invoking methods. However, it's important to understand their performance implications, especially in performance-critical applications. ",
                  contentPath: "csharpjunior/delegates/performance"
                },
                {
                  id: "reflection",
                  title: "Reflection and Dynamic Invocation with Delegates",
                  contentPreview: "Delegates in C# provide a powerful mechanism for encapsulating method references, enabling dynamic method invocation and reflection-based operations. ",
                  contentPath: "csharpjunior/delegates/reflection"
                },
                {
                  id: "custom",
                  title: "Building Custom Delegate-Based Frameworks",
                  contentPreview: "​Delegates in C# are powerful tools that enable developers to design flexible and extensible frameworks. ",
                  contentPath: "csharpjunior/delegates/custom"
                },
                {
                  id: "async",
                  title: "Delegates in Asynchronous programming and MultiThreading",
                  contentPreview: "Delegates in C# serve as type-safe method pointers, enabling developers to encapsulate method references and invoke them dynamically. ",
                  contentPath: "csharpjunior/delegates/async"
                }
              ]
            },
            {
              id: 'events',
              title: 'Events',
              description: 'An event is a special kind of delegate that provides a publisher-subscriber model. It restricts how delegates are invoked and assigned, ensuring better encapsulation and safety.',
              threads: [
                {
                  id: "overview",
                  title: "Overview and History",
                  contentPreview: "While delegates are powerful, they have some limitations when used directly for event-driven programming. The event keyword was introduced to address these limitations",
                  contentPath: "csharpjunior/events/overview"
                }
              ]
            },
            {
              id: 'dpatterns',
              title: 'Design Patterns',
              description: 'Most common design patterns, and their use and implementations in C#',
              threads: [
                {
                  id: "arh_pipesandfilter",
                  title: "Architectural (Scalability) - Pipes and Filters Pattern",
                  contentPreview: "Software developers utilize the Pipes and Filters architectural design pattern to establish a modular and flexible system for sequentially and independently processing data or tasks.",
                  contentPath: "csharpjunior/dpatterns/arh_pipesandfilter"
                },
                {
                  id: "arh_scattergather",
                  title: "Architectural (Scalability) - Scatter Gather Pattern",
                  contentPreview: "The Scatter-Gather pattern is a message routing pattern that receives a request, distributes it to multiple recipients, and aggregates their responses into a single message. ",
                  contentPath: "csharpjunior/dpatterns/arh_scattergather"
                },
                {
                  id: "arh_mapreduce",
                  title: "Architectural (Performance) - Map Reduce Pattern for Big Data Processing",
                  contentPreview: "The MapReduce pattern is a programming model for processing large datasets in parallel across distributed systems, breaking tasks into map and reduce phases.",
                  contentPath: "csharpjunior/dpatterns/arh_mapreduce"
                },
                {
                  id: "arh_saga",
                  title: "Architectural (Performance) - The Saga Pattern",
                  contentPreview: "The Saga design pattern helps maintain data consistency in distributed systems by coordinating transactions across multiple services. A saga is a sequence of local transactions where each service performs its operation and initiates the next step through events or messages. ",
                  contentPath: "csharpjunior/dpatterns/arh_saga"
                },
                {
                  id: "arh_transactionaloutbox",
                  title: "Architectural (Performance) - Transactional Outbox Pattern",
                  contentPreview: " It ensures events are saved in a datastore (typically in an Outbox table in your database) before they're ultimately pushed to a message broker. If the business object and the corresponding events are saved within the same database transaction, it's guaranteed that no data will be lost.",
                  contentPath: "csharpjunior/dpatterns/arh_transactionaloutbox"
                },
                {
                  id: "arh_cqrs",
                  title: "Architectural (Performance) - CQRS Pattern (Combined with Materialized View and Event Sourcing)",
                  contentPreview: "Command Query Responsibility Segregation (CQRS) is a design pattern that segregates read and write operations for a data store into separate data models. This approach allows each model to be optimized independently and can improve the performance, scalability, and security of an application.",
                  contentPath: "csharpjunior/dpatterns/arh_cqrs"
                },
                {
                  id: "arh_eventsourcing",
                  title: "Architectural (Performance) - Event Sourcing Pattern",
                  contentPreview: "The Event Sourcing pattern defines an approach to handling operations on data that's driven by a sequence of events, each of which is recorded in an append-only store. Application code raises events that imperatively describe the action taken on the object.",
                  contentPath: "csharpjunior/dpatterns/arh_eventsourcing"
                },
                {
                  id: "arh_sidecarambassador",
                  title: "Architectural (Extensibility) - Sidecar & Ambassador Pattern",
                  contentPreview: "Deploy components of an application into a separate process or container to provide isolation and encapsulation. This pattern can also enable applications to be composed of heterogeneous components and technologies.",
                  contentPath: "csharpjunior/dpatterns/arh_sidecarambassador"
                },
                {
                  id: "arh_anticorradapter",
                  title: "Architectural (Extensibility) - Anti-Corruption Adapter Pattern",
                  contentPreview: "Implement a façade or adapter layer between different subsystems that don't share the same semantics. This layer translates requests that one subsystem makes to the other subsystem. Use this pattern to ensure that an application's design is not limited by dependencies on outside subsystems. This pattern was first described by Eric Evans in Domain-Driven Design.",
                  contentPath: "csharpjunior/dpatterns/arh_anticorradapter"
                },
                {
                  id: "arh_backforfront",
                  title: "Architectural (Extensibility) - Backends for Frontends Pattern",
                  contentPreview: "Decouple backend services from the frontend implementations to tailor experiences for different client interfaces. This pattern is useful when you want to avoid customizing a backend that serves multiple interfaces.",
                  contentPath: "csharpjunior/dpatterns/arh_backforfront"
                },
                {
                  id: "singleton",
                  title: "Singleton Pattern",
                  contentPreview: "Guarantees that a class has a single, globally accessible instance, and restricts instantiation to one object.",
                  contentPath: "csharpjunior/dpatterns/singleton"
                },
                {
                  id: "factory",
                  title: "Factory Method Pattern",
                  contentPreview: "A design pattern that defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
                  contentPath: "csharpjunior/dpatterns/factory"
                },
                {
                  id: "abstractfactory",
                  title: "Abstract Factory Pattern",
                  contentPreview: "The Abstract Factory Pattern defines an interface for creating a suite of related products. Each concrete factory implements this interface to create a set of objects that are designed to work together.",
                  contentPath: "csharpjunior/dpatterns/abstractfactory"
                },
                {
                  id: "adapter",
                  title: "Adapter Pattern",
                  contentPreview: "The Adapter Pattern converts the interface of a class into another interface that clients expect. It allows classes to work together that otherwise couldn't because of incompatible interfaces.",
                  contentPath: "csharpjunior/dpatterns/adapter"
                },
                {
                  id: "proxy",
                  title: "Proxy Pattern",
                  contentPreview: "The Proxy Pattern involves creating a proxy object that implements the same interface as the real subject (the object being proxied).",
                  contentPath: "csharpjunior/dpatterns/proxy"
                },{
                  id: "strategy",
                  title: "Strategy Pattern",
                  contentPreview: "The Strategy Pattern defines a common interface for a group of algorithms and allows the client to select the appropriate algorithm at runtime without changing the client’s code.",
                  contentPath: "csharpjunior/dpatterns/strategy"
                },
                {
                  id: "observer",
                  title: "Observer Pattern",
                  contentPreview: "The Observer Pattern establishes a subscription mechanism to allow multiple observer objects to be notified of changes in a subject object. ",
                  contentPath: "csharpjunior/dpatterns/observer"
                },
                {
                  id: "command",
                  title: "Command Pattern",
                  contentPreview: "The Command Pattern encapsulates a request as an object (command) that contains all information needed to perform an action, including the method to call, the object that owns the method, and any parameters.",
                  contentPath: "csharpjunior/dpatterns/command"
                },
                {
                  id: "yieldreturn",
                  title: "Yield Return",
                  contentPreview: "The yield return pattern is a powerful feature in C# that enables lazy evaluation and on-demand generation of sequences. ",
                  contentPath: "csharpjunior/dpatterns/yieldreturn"
                },
                {
                  id: "decorator",
                  title: "Decorator Pattern",
                  contentPreview: "The Decorator Pattern involves creating a set of decorator classes that are used to wrap concrete components.",
                  contentPath: "csharpjunior/dpatterns/decorator"
                },
                {
                  id: "builder",
                  title: "Builder Pattern",
                  contentPreview: "The Builder Pattern encapsulates the construction of an object in a separate Builder object.",
                  contentPath: "csharpjunior/dpatterns/builder"
                },
                {
                  id: "prototype",
                  title: "Prototype Pattern",
                  contentPreview: "The Prototype Pattern specifies the kind of objects to create using a prototypical instance, and creates new objects by copying this prototype.",
                  contentPath: "csharpjunior/dpatterns/prototype"
                },
                {
                  id: "facade",
                  title: "Facade Pattern",
                  contentPreview: "The Facade Pattern involves creating a facade class that offers a simplified interface to a set of interfaces in a subsystem. ",
                  contentPath: "csharpjunior/dpatterns/facade"
                },
                {
                  id: "mediator",
                  title: "Mediator Pattern",
                  contentPreview: "The Mediator Pattern defines an object that encapsulates how a set of objects interact. ",
                  contentPath: "csharpjunior/dpatterns/mediator"
                },
                {
                  id: "memento",
                  title: "Memento Pattern",
                  contentPreview: "The Memento Pattern involves three key roles: the Originator, which is the object whose state you want to capture; the Memento, which stores the state; and the Caretaker, which manages the mementos.",
                  contentPath: "csharpjunior/dpatterns/memento"
                },
                {
                  id: "iterator",
                  title: "Iterator Pattern",
                  contentPreview: "The Iterator Pattern defines a standard interface for traversing a collection, enabling clients to access its elements one at a time without knowing the internal structure of the collection.",
                  contentPath: "csharpjunior/dpatterns/iterator"
                },
                {
                  id: "composite",
                  title: "Composite Pattern",
                  contentPreview: "The Composite Pattern allows you to build a tree-like structure where individual objects (leaves) and groups of objects (composites) are treated the same way by the client through a common interface.",
                  contentPath: "csharpjunior/dpatterns/composite"
                },
                {
                  id: "flyweight",
                  title: "Flyweight Pattern",
                  contentPreview: "The Flyweight Pattern involves creating a flyweight object that contains the intrinsic state (shared among many objects) and storing extrinsic state (unique to each object) externally. This enables many objects to share the same flyweight, minimizing memory usage.",
                  contentPath: "csharpjunior/dpatterns/flyweight"
                },
                {
                  id: "visitor",
                  title: "Visitor Pattern",
                  contentPreview: "The Visitor Pattern lets you add further operations to objects without modifying them. It achieves this by having a visitor object that implements an operation for each concrete type of element in an object structure.",
                  contentPath: "csharpjunior/dpatterns/visitor"
                },
                {
                  id: "nullobject",
                  title: "Null Object Pattern",
                  contentPreview: "The Null Object Pattern involves creating a class that implements the expected interface but whose methods have no effect. This “null” implementation is used instead of returning null, thereby allowing clients to invoke methods without the need for null checks.",
                  contentPath: "csharpjunior/dpatterns/nullobject"
                },
                {
                  id: "templatemethod",
                  title: "Template Method Pattern",
                  contentPreview: "The Template Method Pattern defines a method (the template method) in an abstract class that outlines the steps of an algorithm. ",
                  contentPath: "csharpjunior/dpatterns/templatemethod"
                },
                {
                  id: "repository",
                  title: "Repository and Unit Of Work ",
                  contentPreview: "The Repository Pattern abstracts the data layer by providing a collection-like interface for accessing domain objects. This encapsulates data access logic, hiding details of the underlying persistence mechanism.",
                  contentPath: "csharpjunior/dpatterns/repository"
                },
                {
                  id: "depeninj",
                  title: "Dependency Injection",
                  contentPreview: "Dependency Injection is a technique where an object's dependencies (i.e., the services or objects it needs to function) are injected into it rather than being created internally. This allows the behavior of the class to be configured from the outside.",
                  contentPath: "csharpjunior/dpatterns/depeninj"
                },
                {
                  id: "bridge",
                  title: "Bridge Pattern",
                  contentPreview: "The Bridge Pattern separates an abstraction from its implementation by providing two independent class hierarchies: one for the abstraction and one for the implementation.",
                  contentPath: "csharpjunior/dpatterns/bridge"
                }
              ]
            }
          ]
        },
        {
          id: "csharpmedior",
          name: "C# - Medior",
          description: "Independent C# developers delving in",
          topics: [
            {
              id: "covacontra",
              title: "Covariance and Contravariance",
              description: "Covariance and contravariance support for method groups allows for matching method signatures with delegate types.",
              threads: [
                {
                  id: "covariance",
                  title: "Covariance",
                  contentPreview: "Covariance enables implicit conversion of an array of a more derived type to a less derived type. ",
                  contentPath: "csharpmedior/covacontra/covariance"
                },
                {
                  id: "contravariance",
                  title: "Contravariance",
                  contentPreview: "Contravariance is the in keyword and it denotes input types, usually in delegates. The principle is the same, it means that the delegate can accept more derived class.",
                  contentPath: "csharpmedior/covacontra/contravariance"
                }
              ]
            },
            {
              id: "testing",
              title: "Testing",
              description: "This article introduces the concept of testing and illustrates how different kinds of tests can be used to validate code. Various tools are available for testing .NET applications",
              threads: [
                {
                  id: "behaviordrivenspecflow",
                  title: "Behavior Driven Testing with Specflow",
                  contentPreview: "Behavior-Driven Development (BDD) is an agile methodology that enhances collaboration among all project participants, regardless of technical knowledge.",
                  contentPath: "csharpmedior/testing/behaviordrivenspecflow"
                }
              ]
            },
            {
              id: "reflection",
              title: "Reflection",
              description: "Reflection in .NET is a powerful feature that allows runtime inspection of assemblies, types, and their members (such as methods, fields, properties, and events).",
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "Scenarios, Usefules and Definition",
                  contentPath: "csharpmedior/reflection/overview"
                }
              ]
            },
            {
              id: "memorymanagement",
              title: "Memory Management",
              description: "From Stack to Heap to Advanced Design Options",
              threads: [
                {
                  id: "stackheap",
                  title: "Stack and Heap",
                  contentPreview: "Overview of the 2 memory allocations available",
                  contentPath: "csharpmedior/memorymanagement/stackheap"
                },
                {
                  id: "refvaluetypes",
                  title: "Reference and Value Types",
                  contentPreview: "Types that stay on the heap or on the stack",
                  contentPath: "csharpmedior/memorymanagement/refvaluetypes"
                },
                {
                  id: "using",
                  title: "Using keyword",
                  contentPreview: "The usingstatement defines a scope at the end of which an object is disposed",
                  contentPath: "csharpmedior/memorymanagement/using"
                },
                {
                  id: "garbcollector",
                  title: "Garbage Collector",
                  contentPreview: "Automatically reclaims memory occupied by unreachable objects, freeing developers from manually deallocating memory and helping to avoid memory leaks.",
                  contentPath: "csharpmedior/memorymanagement/garbcollector"
                },
                {
                  id: "refandout",
                  title: "Ref keyword,Out keword",
                  contentPreview: "The ref and out keywords in C# are used to pass arguments by reference instead of by value. They allow methods to modify the value of the arguments passed to them",
                  contentPath: "csharpmedior/memorymanagement/refandout"
                },
                {
                  id: "boxing",
                  title: "Boxing and Unboxing",
                  contentPreview: "Boxing and unboxing are mechanisms in C# that allow value types (e.g., int, struct) to be treated as reference types (object) and vice versa. ",
                  contentPath: "csharpmedior/memorymanagement/boxing"
                },
                {
                  id: "varanddynamic",
                  title: "Var keyword vs Dynamic",
                  contentPreview: "Both var and dynamic are used for variable declaration in C#, but they serve different purposes and behave differently at compile time and runtime",
                  contentPath: "csharpmedior/memorymanagement/varanddynamic"
                },
                {
                  id: "typeerasure",
                  title: "Type Erasure",
                  contentPreview: "Type erasure is a concept commonly associated with generics in programming languages like Java and C#.",
                  contentPath: "csharpmedior/memorymanagement/typeerasure"
                },
                {
                  id: "stringbuilder",
                  title: "String vs StringBuilder",
                  contentPreview: "In C#, string and StringBuilder are both used to work with text, but they have different characteristics and use cases.",
                  contentPath: "csharpmedior/memorymanagement/stringbuilder"
                }
              ]
            },
            {
              id: "dependencyinjection",
              title: "Definition of Dependency Injection (DI)",
              description: "Dependency Injection (DI) is a design pattern and technique in software development that enables the decoupling of components by injecting an object's dependencies from the outside, rather than having the object create or obtain them itself. ",
              threads: [
                {
                  id: "definition",
                  title: "Definition",
                  contentPreview: "The basics of DI",
                  contentPath: "csharpmedior/dependencyinjection/definition"
                },
                {
                  id: "iocvsdep",
                  title: "Inversion of Control (IoC) vs. Dependency Injection",
                  contentPreview: "Although the terms are often used interchangeably, Inversion of Control (IoC) and Dependency Injection (DI) refer to related but distinct concepts in software design. ",
                  contentPath: "csharpmedior/dependencyinjection/iocvsdep"
                },
                {
                  id: "benefits",
                  title: "Benefits of DI",
                  contentPreview: "Dependency Injection (DI) offers numerous advantages in modern software development.",
                  contentPath: "csharpmedior/dependencyinjection/benefits"
                },
                {
                  id: "constructorin",
                  title: "Constructor Injection",
                  contentPreview: "Constructor Injection is the most common form of Dependency Injection (DI) in C#. It involves providing all required dependencies to a class through its constructor. ",
                  contentPath: "csharpmedior/dependencyinjection/constructorin"
                },
                {
                  id: "propertyin",
                  title: "Property (Setter) Injection",
                  contentPreview: "Property Injection involves exposing dependencies as public properties with setters. The DI container (or calling code) sets these properties after the object is created.",
                  contentPath: "csharpmedior/dependencyinjection/propertyin"
                },
                {
                  id: "methodin",
                  title: "Method Injection",
                  contentPreview: "Method Injection is a dependency injection (DI) technique where dependencies are provided as parameters to a method rather than through a constructor or property.",
                  contentPath: "csharpmedior/dependencyinjection/methodin"
                },
                {
                  id: "factoryin",
                  title: "Factory Injection",
                  contentPreview: "Factory Injection involves supplying a class with a factory object or a delegate that creates instances of a dependency.",
                  contentPath: "csharpmedior/dependencyinjection/factoryin"
                },
                {
                  id: "dip",
                  title: "Dependency Inversion Principle (DIP)",
                  contentPreview: "Both high-level and low-level modules should depend on abstractions (e.g., interfaces or abstract classes) rather than concrete implementations.",
                  contentPath: "csharpmedior/dependencyinjection/dip"
                },
                {
                  id: "srp",
                  title: "Single Responsibility Principle (SRP)",
                  contentPreview: "A class should have only one responsibility and, therefore, only one reason to change. This means that each class or module should focus on a single part of the functionality provided by the software.",
                  contentPath: "csharpmedior/dependencyinjection/srp"
                },
                {
                  id: "builtincontainer",
                  title: "Built-In .NET DI Container",
                  contentPreview: "A framework-provided container designed to manage the instantiation and lifetime of objects (services) in a decoupled, testable manner.",
                  contentPath: "csharpmedior/dependencyinjection/builtincontainer"
                },
                {
                  id: "thirdparcontainers",
                  title: "Third-Party DI Containers",
                  contentPreview: "Popular Third-Party DI Containers",
                  contentPath: "csharpmedior/dependencyinjection/thirdparcontainers"
                },
                {
                  id: "containerconfig",
                  title: "Container Configuration in Dependency Injection",
                  contentPreview: "Container configuration is the process of setting up and customizing a Dependency Injection (DI) container to manage the creation, lifetime, and dependencies of objects in your application.",
                  contentPath: "csharpmedior/dependencyinjection/containerconfig"
                },
                {
                  id: "mediatr",
                  title: "MediatR",
                  contentPreview: "MediatR centralizes communication between objects by acting as an intermediary. Instead of components directly calling each other, they send requests or notifications to MediatR, which then routes them to the appropriate handlers.",
                  contentPath: "csharpmedior/dependencyinjection/mediatr"
                },
                {
                  id: "lifetimes",
                  title: "Transient, Scoped, and Singleton Lifetimes",
                  contentPreview: "In the context of Dependency Injection (DI) in .NET, understanding service lifetimes is crucial for building efficient, scalable, and memory-safe applications. ",
                  contentPath: "csharpmedior/dependencyinjection/lifetimes"
                },
                {
                  id: "managingscope",
                  title: "Managing Scope",
                  contentPreview: "Managing scope refers to defining and controlling the lifetime boundaries within which services are created, used, and disposed.",
                  contentPath: "csharpmedior/dependencyinjection/managingscope"
                },
                {
                  id: "disposal",
                  title: "Disposal of Services",
                  contentPreview: "Many services hold unmanaged resources (or managed wrappers around unmanaged resources) that need to be explicitly released. Failure to do so can lead to resource exhaustion.",
                  contentPath: "csharpmedior/dependencyinjection/disposal"
                },
                {
                  id: "interception",
                  title: "Interception and Decorators",
                  contentPreview: "Interception and Decorators are advanced techniques used in .NET to extend or modify the behavior of objects without changing their code. ",
                  contentPath: "csharpmedior/dependencyinjection/interception"
                },
                {
                  id: "lazyinject",
                  title: "Lazy Injection and Factory Delegates",
                  contentPreview: "Lazy Injection and Factory Delegates are advanced dependency injection techniques in .NET that provide flexible and efficient ways to manage object creation.",
                  contentPath: "csharpmedior/dependencyinjection/lazyinject"
                },
                {
                  id: "circulardep",
                  title: "Handling Circular Dependencies",
                  contentPreview: "Circular dependencies occur when two or more services depend on each other, either directly or indirectly, creating a loop that can complicate or break the DI resolution process. ",
                  contentPath: "csharpmedior/dependencyinjection/circulardep"
                },
                {
                  id: "conditionalregis",
                  title: "Conditional Registration",
                  contentPreview: "Conditional Registration is a pattern where the DI container selects among multiple potential service implementations based on conditions determined at registration time or runtime. ",
                  contentPath: "csharpmedior/dependencyinjection/conditionalregis"
                },
                {
                  id: "customdi",
                  title: "Custom DI Container Implementations",
                  contentPreview: "Custom DI containers are often created to gain fine-grained control over object creation, lifetime management, and resolution behavior, or simply to understand the internal workings of DI. ",
                  contentPath: "csharpmedior/dependencyinjection/customdi"
                },
                {
                  id: "diasync",
                  title: "Asynchronous Programming and DI",
                  contentPreview: "DI containers resolve dependencies at runtime. When resolving services that support asynchronous operations, the DI container should correctly handle both synchronous and asynchronous lifecycles.",
                  contentPath: "csharpmedior/dependencyinjection/diasync"
                },
                {
                  id: "diasp",
                  title: "DI in ASP.NET Core",
                  contentPreview: "ASP.NET Core has dependency injection (DI) built into its core framework, making it a first-class citizen in the design of modern web applications.",
                  contentPath: "csharpmedior/dependencyinjection/diasp"
                },
                {
                  id: "didesktmobile",
                  title: "DI in Desktop and Mobile Applications",
                  contentPreview: "In these environments, DI enhances modularity, testability, and maintainability, especially in architectures like MVVM (Model-View-ViewModel) used in WPF, UWP, and Xamarin.",
                  contentPath: "csharpmedior/dependencyinjection/didesktmobile"
                },
                {
                  id: "microservicedi",
                  title: "Microservices and DI",
                  contentPreview: "Dependency Injection plays a vital role in this architecture by promoting modularity, improving testability, and managing service lifetimes within each microservice.",
                  contentPath: "csharpmedior/dependencyinjection/microservicedi"
                },
                {
                  id: "testmockdi",
                  title: "Testing and Mocking with DI",
                  contentPreview: "Dependency Injection (DI) greatly enhances testability by decoupling components from their concrete dependencies. ",
                  contentPath: "csharpmedior/dependencyinjection/testmockdi"
                },
                {
                  id: "performance",
                  title: "Performance Considerations",
                  contentPreview: "While Dependency Injection (DI) offers numerous benefits in terms of decoupling, testability, and maintainability, it is important to be aware of its potential performance implications. ",
                  contentPath: "csharpmedior/dependencyinjection/performance"
                }
              ]
            },
            {
              id: "realtimedata",
              title: "TCP/IP and UDP Socket Programming",
              description: "",
              threads: [
                {
                  id: "tcpudpprogam",
                  title: "Socket programming in .NET is primarily done using the classes in the System.Net.Sockets namespace. Two of the most common protocols for network communication are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), each serving different needs",
                  contentPreview: "",
                  contentPath: "csharpmedior/realtimedata/tcpudpprogam"
                },
                {
                  id: "http2",
                  title: "HTTP/HTTPS and HTTP/2",
                  contentPreview: "With the introduction of HTTP/2, significant performance improvements were achieved by addressing limitations in the older HTTP/1.x protocols.",
                  contentPath: "csharpmedior/realtimedata/http2"
                },
                {
                  id: "websockets",
                  title: "WebSockets",
                  contentPreview: "WebSockets are a protocol (defined in RFC 6455) that allows a persistent connection between a client (typically a web browser) and a server, enabling both parties to send data at any time.",
                  contentPath: "csharpmedior/realtimedata/websockets"
                },
                {
                  id: "sse",
                  title: "Server-Sent Events (SSE)",
                  contentPreview: "Server-Sent Events (SSE) are a standard allowing servers to push real-time updates to clients over a single, long-lived HTTP connection.",
                  contentPath: "csharpmedior/realtimedata/sse"
                },
                {
                  id: "signalr",
                  title: "SignalR in ASP.NET Core",
                  contentPreview: "SignalR is a high-level abstraction for real-time communication in ASP.NET Core. It simplifies the process of adding real-time web functionality to applications, enabling server-side code to push content instantly to connected clients.",
                  contentPath: "csharpmedior/realtimedata/signalr"
                },
                {
                  id: "rx",
                  title: "Reactive Extensions (Rx)",
                  contentPreview: "Reactive Extensions (Rx) is a powerful library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators. ",
                  contentPath: "csharpmedior/realtimedata/rx"
                },
                {
                  id: "async",
                  title: "Async/Await Pattern",
                  contentPreview: "The async/await pattern is a cornerstone of modern asynchronous programming in .NET.",
                  contentPath: "csharpmedior/realtimedata/async"
                },
                {
                  id: "paralleltpl",
                  title: "Parallel Programming and TPL",
                  contentPreview: "The Task Parallel Library (TPL) is a core component of .NET for parallel and asynchronous programming. ",
                  contentPath: "csharpmedior/realtimedata/paralleltpl"
                },
                {
                  id: "messagequeue",
                  title: "Message Queues and Brokers",
                  contentPreview: "Message queues and brokers are critical components for building distributed, decoupled, and scalable systems. ",
                  contentPath: "csharpmedior/realtimedata/messagequeue"
                },
                {
                  id: "eventsourcing",
                  title: "Event Sourcing and CQRS",
                  contentPreview: "Event Sourcing and Command Query Responsibility Segregation (CQRS) are complementary architectural patterns that help build scalable, maintainable, and auditable systems. ",
                  contentPath: "csharpmedior/realtimedata/eventsourcing"
                },
                {
                  id: "pubsub",
                  title: "Publish/Subscribe Patterns",
                  contentPreview: "Publish/Subscribe Patterns",
                  contentPath: "csharpmedior/realtimedata/pubsub"
                },
                {
                  id: "lowlatency",
                  title: "Low-Latency Data Processing",
                  contentPreview: "The goal is to process and deliver data with minimal delay, often measured in milliseconds or microseconds.",
                  contentPath: "csharpmedior/realtimedata/lowlatency"
                },
                {
                  id: "loadbala",
                  title: "Load Balancing and Scaling",
                  contentPreview: "The process of distributing incoming network traffic or workloads evenly across multiple servers or instances. ",
                  contentPath: "csharpmedior/realtimedata/loadbala"
                },
                {
                  id: "bufferingthrottle",
                  title: "Buffering, Throttling, and Backpressure",
                  contentPreview: "",
                  contentPath: "csharpmedior/realtimedata/bufferingthrottle"
                },
                {
                  id: "realtimeanal",
                  title: "Real-Time Analytics and Monitoring",
                  contentPreview: "Real-time analytics involves the continuous processing and analysis of data as it arrives, with minimal latency, to generate timely insights.",
                  contentPath: "csharpmedior/realtimedata/realtimeanal"
                },
                {
                  id: "sensorandiot",
                  title: "Sensor and IoT Data Acquisition",
                  contentPreview: "IoT (Internet of Things) data acquisition is the process of interfacing with physical sensors and devices to collect real-world data (e.g., temperature, humidity, motion) and transmit it for further processing.",
                  contentPath: "csharpmedior/realtimedata/sensorandiot"
                },
                {
                  id: "financialtrading",
                  title: "Financial and Trading Systems",
                  contentPreview: "Execution and data processing delays must be minimized to capture market opportunities.",
                  contentPath: "csharpmedior/realtimedata/financialtrading"
                },
                {
                  id: "gaming",
                  title: "Gaming and Interactive Applications",
                  contentPreview: "Fast response times are crucial for real-time interactions, whether for game physics, rendering, or input handling.",
                  contentPath: "csharpmedior/realtimedata/gaming"
                },
                {
                  id: "webrtc",
                  title: "WebRTC Integration in .NET",
                  contentPreview: "Enables peer-to-peer communication without the need for plugins.",
                  contentPath: "csharpmedior/realtimedata/webrtc"
                },
                {
                  id: "edgecomputing",
                  title: "Edge Computing and Real-Time Processing",
                  contentPreview: "Edge computing refers to the practice of processing data near the data source instead of sending it all to a centralized cloud. This reduces latency, saves bandwidth, and often enhances data security.",
                  contentPath: "csharpmedior/realtimedata/edgecomputing"
                },
                {
                  id: "realtimeml",
                  title: "Real-Time Machine Learning",
                  contentPreview: "nvolves training machine learning models on a complete, static dataset. Models are retrained periodically as new data accumulates.",
                  contentPath: "csharpmedior/realtimedata/realtimeml"
                },
                {
                  id: "distributedsystems",
                  title: "Distributed Systems and Consistency",
                  contentPreview: "Distributed systems consist of multiple autonomous components that communicate over a network to achieve a common goal. ",
                  contentPath: "csharpmedior/realtimedata/distributedsystems"
                }
              ]
            },
            {
              id: "exceptions",
              title: "Exceptions",
              description: "Exception Handling, Propagation and Advanced Handling",
              threads: [
                {
                  id: "recoverable",
                  title: "Recoverable Exceptions",
                  contentPreview: "These are errors that can be gracefully handled, allowing the application to continue running.",
                  contentPath: "csharpmedior/exceptions/recoverable"
                },
                {
                  id: "definition",
                  title: "Definition of Exceptions",
                  contentPreview: "Exceptions in .NET are objects that represent errors or unexpected conditions that occur during the execution of a program.",
                  contentPath: "csharpmedior/exceptions/definition"
                },
                {
                  id: "hierarchy",
                  title: "Exception Hierarchy in .NET",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/hierarchy"
                },
                {
                  id: "trycatch",
                  title: "try-catch-finally Blocks",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/trycatch"
                },
                {
                  id: "nestedtry",
                  title: "Nested try-catch Blocks",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/nestedtry"
                },
                {
                  id: "exceptionfilters",
                  title: "Using Exception Filters",
                  contentPreview: "Exception filters allow you to specify a boolean condition using a when clause on a catch block. The catch block is executed only if the condition evaluates to true. If it evaluates to false, the exception is not caught by that block, and the runtime continues searching for another handler.",
                  contentPath: "csharpmedior/exceptions/exceptionfilters"
                },
                {
                  id: "rethrow",
                  title: "Rethrowing Exceptions",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/rethrow"
                },
                {
                  id: "customexcep",
                  title: "Creating Custom Exception Classes",
                  contentPreview: "Represent errors that are specific to your application's business logic (e.g., InsufficientFundsException, OrderNotFoundException).",
                  contentPath: "csharpmedior/exceptions/customexcep"
                },
                {
                  id: "propagation",
                  title: "Propagation",
                  contentPreview: "When a method is invoked, a new frame is added to the call stack. If an exception is thrown, the runtime begins unwinding the stack, looking for a catch block that can handle the exception.",
                  contentPath: "csharpmedior/exceptions/propagation"
                },
                {
                  id: "swalla",
                  title: "Swallowing vs. Propagating Exceptions",
                  contentPreview: "Swallowing an exception means catching it and then not rethrowing it, effectively preventing the exception from propagating further up the call stack.",
                  contentPath: "csharpmedior/exceptions/swalla"
                },
                {
                  id: "async",
                  title: "Async/Await Exception Handling",
                  contentPreview: "When an async method throws an exception, the exception is captured and stored in the returned Task or Task<T>. It does not immediately crash the application or propagate up the call stack.",
                  contentPath: "csharpmedior/exceptions/async"
                },
                {
                  id: "aggregate",
                  title: "Handling AggregateException",
                  contentPreview: "AggregateException is an exception type that encapsulates multiple exceptions into a single object. It is typically thrown when one or more tasks in a parallel operation (or asynchronous operation) fail.",
                  contentPath: "csharpmedior/exceptions/aggregate"
                },
                {
                  id: "logging",
                  title: "Exception Logging",
                  contentPreview: "Capture the exception message, stack trace, inner exceptions, and contextual data to understand the cause and context of errors.",
                  contentPath: "csharpmedior/exceptions/logging"
                },
                {
                  id: "applevel",
                  title: "Application-Level Handlers",
                  contentPreview: "Captures exceptions that are not caught in any try-catch block on non-UI threads. It acts as a last-resort handler before the application terminates.",
                  contentPath: "csharpmedior/exceptions/applevel"
                },
                {
                  id: "middleware",
                  title: "Middleware in .NET",
                  contentPreview: "To catch unhandled exceptions thrown during the processing of HTTP requests, log them, and generate appropriate HTTP responses (such as error pages or JSON error messages).",
                  contentPath: "csharpmedior/exceptions/middleware"
                },
                {
                  id: "cost",
                  title: "Cost of Exceptions",
                  contentPreview: "When an exception is thrown, a new exception object is allocated on the managed heap. This involves memory allocation and, potentially, the collection of a stack trace, which can be expensive.",
                  contentPath: "csharpmedior/exceptions/cost"
                },
                {
                  id: "disclosure",
                  title: "Information Disclosure",
                  contentPreview: "The leakage of internal application details (such as file paths, configuration settings, database schemas, or system internals) that can be exploited by malicious actors to gain insights into the application’s structure, security weaknesses, or operational environment.",
                  contentPath: "csharpmedior/exceptions/disclosure"
                },
                {
                  id: "secure",
                  title: "Securing Exception Data",
                  contentPreview: "Only expose minimal, non-sensitive information in error messages displayed to users. Detailed technical data should be logged securely but not shown externally.",
                  contentPath: "csharpmedior/exceptions/secure"
                }
              ]
            },
            {
              id: "httpsessions",
              title: "HTTP Sessions",
              description: "All about HTTP Communications the right way",
              threads: [
                {
                  id: "httprequest",
                  title: "HTTP Request/Response Model",
                  contentPreview: "HTTP methods (also called verbs) specify the desired action to be performed on a resource (e.g., a web page, an API endpoint)",
                  contentPath: "csharpmedior/httpsessions/httprequest"
                },
                {
                  id: "http23",
                  title: "HTTP/2 and HTTP/3 Basics",
                  contentPreview: "The evolution from HTTP/1.1 to HTTP/2 and HTTP/3 aims to address long-standing performance and security challenges in web communication. Both HTTP/2 and HTTP/3 introduce significant improvements over HTTP/1.1.",
                  contentPath: "csharpmedior/httpsessions/http23"
                },
                {
                  id: "httpclient",
                  title: "HttpClient Overview",
                  contentPreview: "The HttpClient class is a high-level API for sending and receiving HTTP requests and responses in .NET applications. It simplifies creating, sending, and processing HTTP requests, whether you're consuming REST APIs, web pages, or other HTTP-based services.",
                  contentPath: "csharpmedior/httpsessions/httpclient"
                },
                {
                  id: "serialization",
                  title: "Serialization and Deserialization",
                  contentPreview: "When building HTTP-based applications (e.g., REST APIs or consuming external services), serialization (converting in-memory objects to textual or binary formats) and deserialization (converting data back to objects) are essential processes. ",
                  contentPath: "csharpmedior/httpsessions/serialization"
                },
                {
                  id: "middleware",
                  title: "Middleware",
                  contentPreview: "In ASP.NET Core, middleware are components that form a pipeline to handle incoming HTTP requests and outgoing responses.",
                  contentPath: "csharpmedior/httpsessions/middleware"
                },
                {
                  id: "routing",
                  title: "Routing",
                  contentPreview: "Routing in ASP.NET Core is the process of matching incoming HTTP requests to the correct endpoint (controller action, Razor Page, or other handler). ",
                  contentPath: "csharpmedior/httpsessions/routing"
                },
                {
                  id: "modelbinding",
                  title: "Model Binding and Validation",
                  contentPreview: "In ASP.NET Core, model binding automatically converts incoming HTTP request data (from route values, query strings, form fields, JSON bodies, etc.) into C# objects. Validation then checks these objects against defined rules, ensuring the data is valid before your application processes it.",
                  contentPath: "csharpmedior/httpsessions/modelbinding"
                },
                {
                  id: "statemanage",
                  title: "State Management Concepts",
                  contentPreview: "Because HTTP is stateless by default, the server does not automatically keep track of user data or session information between individual HTTP requests. Each request is treated as independent, with no built-in memory of previous requests. State management techniques allow you to persist user data or application data across multiple requests, creating a sense of continuity.",
                  contentPath: "csharpmedior/httpsessions/statemanage"
                },
                {
                  id: "sessionconfig",
                  title: "Session Configuration",
                  contentPreview: "HTTP is inherently stateless, but many web applications need to temporarily store user-specific data (e.g., a shopping cart, preferences, or temporary login tokens). Sessions allow you to associate data with a specific client across multiple requests. In ASP.NET Core, you can use the built-in session middleware and the ISession interface to manage session data.",
                  contentPath: "csharpmedior/httpsessions/sessionconfig"
                },
                {
                  id: "sessionlifetime",
                  title: "Session Lifetimes",
                  contentPreview: "Sessions in ASP.NET Core allow you to store temporary user-specific data across multiple requests. However, this data doesn’t persist indefinitely. You can control how long a session remains active with expiration settings. You also have the option to clear or abandon sessions when they’re no longer needed.",
                  contentPath: "csharpmedior/httpsessions/sessionlifetime"
                },
                {
                  id: "whycaching",
                  title: "Why Caching Matters",
                  contentPreview: "Caching is a strategy to store data in a way that enables faster access on subsequent requests. ",
                  contentPath: "csharpmedior/httpsessions/whycaching"
                },
                {
                  id: "responsedatacaching",
                  title: "Response Caching vs. Data Caching",
                  contentPreview: "Caching strategies in web applications can take different forms, generally falling into response-level caching (where the entire HTTP response is cached and reused) and data-level caching (where raw data or computed objects are cached on the server side). Understanding both approaches helps you design a more performant and scalable application.",
                  contentPath: "csharpmedior/httpsessions/responsedatacaching"
                },
                {
                  id: "cachingasp",
                  title: "Caching in ASP.NET Core",
                  contentPreview: "Caching helps reduce data retrieval costs, speed up response times, and improve scalability in your applications. ASP.NET Core offers built-in support for two primary caching models",
                  contentPath: "csharpmedior/httpsessions/cachingasp"
                },
                {
                  id: "expirationeviction",
                  title: "Expiration and Eviction Policies",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/expirationeviction"
                },
                {
                  id: "outputcache",
                  title: "Output Caching",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/outputcache"
                },
                {
                  id: "distributedcaching",
                  title: "Distributed Caching",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/distributedcaching"
                },
                {
                  id: "cacheinvalidstrategy",
                  title: "Cache Invalidation Strategies",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/cacheinvalidstrategy"
                },
                {
                  id: "cachestampedeprevention",
                  title: "Cache Stampede Prevention",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/cachestampedeprevention"
                },
                {
                  id: "contentnegotation",
                  title: "Content Negotiation",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/contentnegotation"
                },
                {
                  id: "httpcompression",
                  title: "HTTP Compression",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/httpcompression"
                },
                {
                  id: "chunkedtransfer",
                  title: "Chunked Transfer Encoding",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/chunkedtransfer"
                },
                {
                  id: "websockets",
                  title: "WebSockets and SignalR",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/websockets"
                },
                {
                  id: "httpstls",
                  title: "HTTPS and TLS",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/httpstls"
                },
                {
                  id: "auth",
                  title: "Authentication/Authorization",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/auth"
                },
                {
                  id: "xsscsrf",
                  title: "Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/xsscsrf"
                },
                {
                  id: "apikeys",
                  title: "API Keys, HMAC, and other Auth Schemes",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/apikeys"
                },
                {
                  id: "graphql",
                  title: "GraphQL on ASP.NET Core",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/graphql"
                },
                {
                  id: "grpc",
                  title: "gRPC in .NET",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/grpc"
                },
                {
                  id: "realtimeservices",
                  title: "Realtime Services",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/realtimeservices"
                }
              ]
            }
          ]
        },
        {
          id: "csharpsenior",
          name: "C# - Senior",
          description: "Abstract and higher level architectural topics",
          topics: [
            {
              id: "architecture",
              title: "Architecture",
              description: "Design guidelines when defining your C# project at a high-level",
              threads: [
                {
                  id: "clean",
                  title: "Clean Architecture",
                  contentPreview: "Clean Architecture is an architectural pattern that separates the concerns of different parts of an application. It aims to make systems more maintainable and scalable by clearly separating different layers, such as business logic, data access, and user interfaces.",
                  contentPath: "csharpsenior/architecture/clean"
                },
                {
                  id: "solid",
                  title: "SOLID",
                  contentPreview: "The SOLID principles are a set of five design principles intended to make software more understandable, flexible, and maintainable. These principles can be applied in the context of object-oriented programming, and they align well with creating high-quality systems in .NET.",
                  contentPath: "csharpsenior/architecture/solid"
                },
                {
                  id: "middleware",
                  title: "Middleware",
                  contentPreview: "Middleware in ASP.NET Core is software that's assembled into an application pipeline to handle requests and responses. Each component in the middleware pipeline is responsible for invoking the next component in the sequence or short-circuiting the chain if necessary. Middleware components can perform a variety of tasks, such as authentication, routing, session management, and logging.",
                  contentPath: "csharpsenior/architecture/middleware"
                }
              ]
            },
            {
              id: "threading",
              title: "Threading",
              description: "In Depth about Threading and Parallel Programming",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to Threading",
                  contentPreview: "Threading allows your application to run multiple blocks of code at the same time (or in parallel if your system has multiple CPU cores).",
                  contentPath: "csharpsenior/threading/introduction"
                },
                {
                  id: "threadmanage",
                  title: "Thread Creation and Management",
                  contentPreview: "Thread creation in C# gives you fine-grained control over how and when your code executes. In modern C#, you’ll often use Tasks or async/await for simplicity. However, understanding low-level thread creation remains valuable for complex or legacy scenarios.",
                  contentPath: "csharpsenior/threading/threadmanage"
                },
                {
                  id: "threadsync",
                  title: "Thread Synchronization",
                  contentPreview: "When multiple threads access shared resources, the order in which they operate can affect the outcome. ",
                  contentPath: "csharpsenior/threading/threadsync"
                },
                {
                  id: "threadcommun",
                  title: "Thread Communication",
                  contentPreview: "When multiple threads need to coordinate their work, they must communicate. In C#, thread communication typically happens through shared state (e.g., shared variables) or messaging (e.g., signaling with events or passing messages via thread-safe data structures). Proper communication ensures that each thread knows when it can safely proceed without causing data corruption or race conditions.",
                  contentPath: "csharpsenior/threading/threadcommun"
                },
                {
                  id: "threadpools",
                  title: "Thread Pools and Task Parallelism",
                  contentPreview: "Manually creating and managing threads can get complicated—especially when you have many short-lived tasks. The Thread Pool and Task Parallel Library (TPL) in C# are designed to simplify handling multiple tasks without the overhead of constantly spinning up new threads.",
                  contentPath: "csharpsenior/threading/threadpools"
                },
                {
                  id: "concurrpatterns",
                  title: "Concurrency Patterns",
                  contentPreview: "Concurrency patterns are high-level approaches or “blueprints” that help structure and coordinate multiple threads or tasks. Using these patterns effectively can simplify the complexity of multithreaded and asynchronous code.",
                  contentPath: "csharpsenior/threading/concurrpatterns"
                },
                {
                  id: "advancedthreading",
                  title: "Advanced Threading Techniques",
                  contentPreview: "Once you understand the fundamentals of threads, synchronization, and the higher-level abstractions (like Task and Parallel), you’re ready to explore advanced threading techniques. These techniques allow you to fine-tune performance, manage complex concurrency scenarios, and write more efficient, scalable applications.",
                  contentPath: "csharpsenior/threading/advancedthreading"
                }
              ]
            },
            {
              id: "async",
              title: "Asynchronous Programming",
              description: "In Depth about Asynchronous Programming",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to asynchronous programming",
                  contentPreview: "This feature allows developers to perform non-blocking operations without the complex code traditionally associated with asynchronous programming, such as callbacks or manual thread management",
                  contentPath: "csharpsenior/async/introduction"
                },
                {
                  id: "errorhandle",
                  title: "Handling Errors in Tasks",
                  contentPreview: "In asynchronous programming with C#, when a method returns a Task or Task<T>, exceptions should be handled within the task to avoid unhandled exceptions that can crash the application. ",
                  contentPath: "csharpsenior/async/errorhandle"
                }
              ]
            }
          ]
        },
        {
          id: "python",
          name: "Python",
          description: "Python for backend development — from fundamentals to FastAPI, PySpark and Databricks",
          topics: [
            {
              id: "pythonfundamentals",
              title: "Python Fundamentals",
              description: "Core language concepts for beginners",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to Python",
                  contentPreview: "Python is a high-level, interpreted, dynamically-typed language known for its readable syntax. It supports multiple paradigms (procedural, OOP, functional) and ships with a rich standard library, making it popular for web backends, data engineering, scripting and automation.",
                  contentPath: "python/pythonfundamentals/introduction"
                },
                {
                  id: "datatypes",
                  title: "Data Types and Variables",
                  contentPreview: "Python's built-in types include int, float, complex, str, bool, bytes and NoneType. Variables are references to objects; type() and isinstance() help inspect them at runtime. Mutability is a key distinction: ints and strings are immutable while lists and dicts are mutable.",
                  contentPath: "python/pythonfundamentals/datatypes"
                },
                {
                  id: "controlflow",
                  title: "Control Flow",
                  contentPreview: "Python control flow constructs include if/elif/else, for and while loops, break, continue and pass. The for loop iterates over any iterable. Walrus operator (:=) lets you assign and test in one expression. Pattern matching (match/case) was introduced in Python 3.10.",
                  contentPath: "python/pythonfundamentals/controlflow"
                },
                {
                  id: "functions",
                  title: "Functions, Arguments and Scope",
                  contentPreview: "Functions are first-class objects in Python. Arguments can be positional, keyword, *args or **kwargs. Python uses LEGB scope resolution (Local → Enclosing → Global → Built-in). Closures capture variables from the enclosing scope; the global and nonlocal keywords let you mutate them.",
                  contentPath: "python/pythonfundamentals/functions"
                },
                {
                  id: "datastructures",
                  title: "Built-in Data Structures",
                  contentPreview: "Python ships with powerful built-in structures: list (ordered, mutable), tuple (ordered, immutable), set (unordered, unique), dict (key-value mapping). The collections module adds Counter, deque, defaultdict and OrderedDict for specialised use-cases.",
                  contentPath: "python/pythonfundamentals/datastructures"
                },
                {
                  id: "modules",
                  title: "Modules and Packages",
                  contentPreview: "A module is a .py file; a package is a directory with __init__.py. Python's import system resolves names through sys.path. Relative imports use dot notation. Virtual environments (venv, virtualenv) isolate dependencies per project.",
                  contentPath: "python/pythonfundamentals/modules"
                },
                {
                  id: "fileio",
                  title: "File I/O and the open() Built-in",
                  contentPreview: "open() returns a file object. The with statement ensures proper resource cleanup via __enter__ and __exit__. Modes include r, w, a, b (binary) and + (read-write). The pathlib module offers an object-oriented path API as an alternative to os.path.",
                  contentPath: "python/pythonfundamentals/fileio"
                },
                {
                  id: "errorhandling",
                  title: "Error Handling and Exceptions",
                  contentPreview: "Python's exception hierarchy derives from BaseException. try/except/else/finally lets you catch specific exception types, execute cleanup code and provide fallback logic. Raise custom exceptions by subclassing Exception. Context variables can be preserved with raise ... from.",
                  contentPath: "python/pythonfundamentals/errorhandling"
                },
                {
                  id: "stdliboverview",
                  title: "Standard Library Highlights",
                  contentPreview: "The standard library includes os, sys, pathlib, shutil for file system work; datetime and zoneinfo for time; json, csv, xml.etree for serialisation; logging for structured output; re for regular expressions; urllib and http.client for HTTP; and subprocess for shell commands.",
                  contentPath: "python/pythonfundamentals/stdliboverview"
                }
              ]
            },
            {
              id: "oop",
              title: "Object-Oriented Python",
              description: "Classes, inheritance, protocols and advanced OOP patterns",
              threads: [
                {
                  id: "classesandobjects",
                  title: "Classes and Objects",
                  contentPreview: "class defines a new type. __init__ initialises instances. Instance attributes live on the instance dict; class attributes are shared. self is the conventional name for the instance reference. Python's data model means almost everything is an object with a type and identity.",
                  contentPath: "python/oop/classesandobjects"
                },
                {
                  id: "inheritance",
                  title: "Inheritance and Polymorphism",
                  contentPreview: "Python supports single and multiple inheritance. The Method Resolution Order (MRO) follows the C3 linearisation algorithm and is inspected via ClassName.__mro__. super() calls the next class in the MRO. Duck typing and structural subtyping mean explicit inheritance is often optional.",
                  contentPath: "python/oop/inheritance"
                },
                {
                  id: "magicmethods",
                  title: "Magic (Dunder) Methods",
                  contentPreview: "Dunder methods let your objects integrate with Python's built-in operators and protocols. Common examples: __repr__/__str__ for string representation, __len__/__getitem__ for sequences, __eq__/__hash__ for equality, __enter__/__exit__ for context managers, __call__ for callable instances.",
                  contentPath: "python/oop/magicmethods"
                },
                {
                  id: "abstractclasses",
                  title: "Abstract Classes and Protocols",
                  contentPreview: "abc.ABC and @abstractmethod enforce interface contracts at instantiation time. typing.Protocol (PEP 544) enables structural subtyping — if an object has the right methods it satisfies the protocol, regardless of inheritance. This supports duck-typed, statically-checkable code.",
                  contentPath: "python/oop/abstractclasses"
                },
                {
                  id: "dataclasses",
                  title: "Dataclasses and NamedTuples",
                  contentPreview: "@dataclass auto-generates __init__, __repr__ and __eq__. Fields can be frozen (immutable), have defaults via field(), or be excluded from comparison. typing.NamedTuple provides immutable, named tuples with type annotations. Both are preferable to raw classes for simple data holders.",
                  contentPath: "python/oop/dataclasses"
                },
                {
                  id: "slots",
                  title: "__slots__ and Memory Optimisation",
                  contentPreview: "By default each instance carries a __dict__ for attribute storage. Declaring __slots__ replaces the per-instance dict with a fixed set of descriptors, reducing memory footprint significantly for classes with many instances and preventing accidental attribute creation.",
                  contentPath: "python/oop/slots"
                }
              ]
            },
            {
              id: "idiomatic",
              title: "Idiomatic Python",
              description: "Pythonic patterns: comprehensions, decorators, generators and more",
              threads: [
                {
                  id: "comprehensions",
                  title: "Comprehensions and Generator Expressions",
                  contentPreview: "List, dict and set comprehensions offer concise syntax for building collections: [x*2 for x in range(10) if x % 2 == 0]. Generator expressions use () instead of [] and are lazy — they yield values on demand, keeping memory usage constant regardless of input size.",
                  contentPath: "python/idiomatic/comprehensions"
                },
                {
                  id: "iteratorsprotocol",
                  title: "Iterators and the Iteration Protocol",
                  contentPreview: "An iterable implements __iter__ returning an iterator; an iterator implements __next__ raising StopIteration when exhausted. Generator functions use yield to produce iterators lazily. itertools (chain, islice, groupby, product) compose iterators without materialising intermediate lists.",
                  contentPath: "python/idiomatic/iteratorsprotocol"
                },
                {
                  id: "decorators",
                  title: "Decorators",
                  contentPreview: "A decorator is a callable that wraps another callable to add behaviour. functools.wraps preserves the wrapped function's metadata. Decorators can accept arguments by adding an outer factory function. Class-based decorators implement __call__. Common use-cases: logging, timing, caching, access control.",
                  contentPath: "python/idiomatic/decorators"
                },
                {
                  id: "contextmanagers",
                  title: "Context Managers",
                  contentPreview: "The with statement calls __enter__ on entry and __exit__ on exit, even if an exception occurs. contextlib.contextmanager turns a generator function into a context manager using yield. ExitStack manages a dynamic number of context managers — useful for conditionally opening resources.",
                  contentPath: "python/idiomatic/contextmanagers"
                },
                {
                  id: "typing",
                  title: "Type Hints and Static Analysis",
                  contentPreview: "PEP 484 introduced optional type hints. Common annotations: int, str, list[int], dict[str, Any], Optional[T], Union[A, B], Callable, TypeVar. mypy and pyright perform static type checking. TypedDict annotates dict shapes; TypeAlias gives names to complex types. Python 3.12 introduced type statement.",
                  contentPath: "python/idiomatic/typing"
                },
                {
                  id: "functionaltools",
                  title: "Functional Programming Tools",
                  contentPreview: "functools provides lru_cache, cache, partial, reduce and wraps. operator offers function equivalents of built-in operators. map(), filter() and zip() return lazy iterators. Python avoids true tail-call optimisation, so deep recursion should be converted to iteration.",
                  contentPath: "python/idiomatic/functionaltools"
                },
                {
                  id: "envpackaging",
                  title: "Virtual Environments and Packaging",
                  contentPreview: "venv creates isolated Python environments. pip manages packages; requirements.txt pins versions. pyproject.toml (PEP 517/518) is the modern project metadata standard. Poetry and Hatch are popular build tools. pip-tools and pip-compile keep lockfiles reproducible.",
                  contentPath: "python/idiomatic/envpackaging"
                }
              ]
            },
            {
              id: "concurrency",
              title: "Concurrency and Async I/O",
              description: "Threading, multiprocessing and asyncio for concurrent Python programs",
              threads: [
                {
                  id: "gil",
                  title: "The Global Interpreter Lock (GIL)",
                  contentPreview: "CPython's GIL is a mutex that protects the interpreter's object model — only one thread executes Python bytecode at a time. This makes multithreaded CPU-bound code effectively single-threaded. The GIL does not affect multiprocessing or I/O-bound threading. Python 3.13 introduced an experimental free-threaded (no-GIL) build.",
                  contentPath: "python/concurrency/gil"
                },
                {
                  id: "threading",
                  title: "Threading Module",
                  contentPreview: "threading.Thread runs callables in separate OS threads. Synchronisation primitives include Lock, RLock, Semaphore, Event, Condition and Barrier. Thread-local storage is available via threading.local(). Best suited for I/O-bound tasks where threads spend most time waiting.",
                  contentPath: "python/concurrency/threading"
                },
                {
                  id: "multiprocessing",
                  title: "Multiprocessing Module",
                  contentPreview: "multiprocessing spawns separate interpreter processes, bypassing the GIL — ideal for CPU-bound work. Process, Pool, Queue and Pipe are the main primitives. multiprocessing.shared_memory (Python 3.8+) shares memory between processes without serialisation overhead.",
                  contentPath: "python/concurrency/multiprocessing"
                },
                {
                  id: "asyncio",
                  title: "asyncio and the Event Loop",
                  contentPreview: "asyncio implements cooperative multitasking via an event loop and coroutines. async def defines a coroutine; await suspends it until the awaitable completes. asyncio.run() is the canonical entry point. Tasks wrap coroutines and are scheduled on the event loop. asyncio.gather() runs tasks concurrently.",
                  contentPath: "python/concurrency/asyncio"
                },
                {
                  id: "asyncpatterns",
                  title: "Async Patterns and Best Practices",
                  contentPreview: "Avoid mixing blocking code with async code — use run_in_executor() to offload blocking calls. async for iterates async iterables; async with manages async context managers. Structured concurrency with TaskGroup (Python 3.11) ensures tasks are cancelled on error. aiohttp and httpx provide async HTTP clients.",
                  contentPath: "python/concurrency/asyncpatterns"
                },
                {
                  id: "concurrentfutures",
                  title: "concurrent.futures Executors",
                  contentPreview: "concurrent.futures provides a high-level interface over both threads and processes. ThreadPoolExecutor suits I/O-bound work; ProcessPoolExecutor suits CPU-bound work. submit() returns a Future; map() applies a function concurrently. as_completed() iterates futures in order of completion.",
                  contentPath: "python/concurrency/concurrentfutures"
                }
              ]
            },
            {
              id: "advancedpython",
              title: "Advanced Python Internals",
              description: "Metaclasses, descriptors, memory management and CPython internals",
              threads: [
                {
                  id: "metaclasses",
                  title: "Metaclasses",
                  contentPreview: "A metaclass is the class of a class — it controls class creation. type is the default metaclass. Custom metaclasses override __new__ and __init__ to intercept and modify class definitions at creation time. Common uses: ORMs, plugin registries, enforcing interface contracts and auto-instrumentation.",
                  contentPath: "python/advancedpython/metaclasses"
                },
                {
                  id: "descriptors",
                  title: "Descriptors Protocol",
                  contentPreview: "A descriptor implements __get__, __set__ and/or __delete__. Data descriptors (both __get__ and __set__) take precedence over instance __dict__; non-data descriptors do not. property, classmethod and staticmethod are all implemented as descriptors in CPython.",
                  contentPath: "python/advancedpython/descriptors"
                },
                {
                  id: "memorymanagement",
                  title: "Memory Management and Garbage Collection",
                  contentPreview: "CPython uses reference counting as its primary memory management strategy; objects with zero references are immediately freed. A cyclic garbage collector (gc module) handles reference cycles. The gc module exposes generations, thresholds and manual collection. weakref allows references that don't increment the refcount.",
                  contentPath: "python/advancedpython/memorymanagement"
                },
                {
                  id: "profiling",
                  title: "Profiling and Performance Optimisation",
                  contentPreview: "cProfile and profile produce call statistics. line_profiler measures line-by-line execution time. memory_profiler tracks memory usage. timeit benchmarks small snippets. Optimisation strategies include choosing appropriate data structures, avoiding global lookups, using built-ins written in C and leveraging numpy/pandas for numeric work.",
                  contentPath: "python/advancedpython/profiling"
                },
                {
                  id: "importsystem",
                  title: "Import System and Custom Importers",
                  contentPreview: "Python's import system uses finders and loaders. sys.meta_path is a list of finders tried in order. importlib.import_module provides programmatic imports. Custom importers (implementing importlib.abc.Finder and Loader) can load modules from non-standard sources such as databases or remote URLs.",
                  contentPath: "python/advancedpython/importsystem"
                },
                {
                  id: "bytecodeandcpython",
                  title: "Bytecode and CPython Internals",
                  contentPreview: "Python compiles source to bytecode (.pyc files in __pycache__). dis module disassembles bytecode for inspection. Code objects carry constants, names, and bytecode instructions. Understanding the eval loop (ceval.c) helps explain performance characteristics. Tools like codon and Cython compile Python to native code.",
                  contentPath: "python/advancedpython/bytecodeandcpython"
                }
              ]
            },
            {
              id: "testingpython",
              title: "Testing in Python",
              description: "pytest, fixtures, mocking and test-driven development",
              threads: [
                {
                  id: "unittestmodule",
                  title: "unittest Module",
                  contentPreview: "unittest is Python's built-in xUnit-style test framework. Test cases extend unittest.TestCase. setUp/tearDown manage per-test state; setUpClass/tearDownClass manage per-class state. Assertions: assertEqual, assertRaises, assertIn, etc. unittest.mock provides Mock, MagicMock and patch.",
                  contentPath: "python/testingpython/unittestmodule"
                },
                {
                  id: "pytest",
                  title: "pytest Framework",
                  contentPreview: "pytest discovers tests by convention (test_*.py, *_test.py). Plain assert statements replace verbose assertion methods. Plugins extend pytest: pytest-cov for coverage, pytest-asyncio for async tests, pytest-mock for mocking. Running: pytest -v --tb=short -x stops on first failure.",
                  contentPath: "python/testingpython/pytest"
                },
                {
                  id: "fixtures",
                  title: "Fixtures and Parametrize",
                  contentPreview: "@pytest.fixture defines reusable setup/teardown with scope (function, class, module, session). Fixtures can yield to provide teardown after the test. @pytest.mark.parametrize runs a test with multiple input sets. conftest.py shares fixtures across test modules without explicit imports.",
                  contentPath: "python/testingpython/fixtures"
                },
                {
                  id: "mocking",
                  title: "Mocking with unittest.mock",
                  contentPreview: "unittest.mock.patch replaces objects during a test. MagicMock automatically creates magic method implementations. side_effect lets you raise exceptions or return dynamic values. assert_called_once_with verifies interactions. Mock the boundary (network, DB) not the implementation details.",
                  contentPath: "python/testingpython/mocking"
                },
                {
                  id: "tdd",
                  title: "Test-Driven Development",
                  contentPreview: "TDD follows Red-Green-Refactor: write a failing test, write minimal code to pass it, then clean up. Benefits include design feedback, confidence during refactoring, and living documentation. Property-based testing with Hypothesis generates edge-case inputs automatically.",
                  contentPath: "python/testingpython/tdd"
                }
              ]
            },
            {
              id: "fastapi",
              title: "FastAPI",
              description: "Building high-performance async APIs with FastAPI and Pydantic",
              threads: [
                {
                  id: "fastapiintro",
                  title: "Introduction to FastAPI",
                  contentPreview: "FastAPI is a modern, high-performance Python web framework built on Starlette (ASGI) and Pydantic. It auto-generates OpenAPI + JSON Schema docs. Benchmarks place it on par with Node.js/Go for I/O-bound workloads. Minimum viable app: from fastapi import FastAPI; app = FastAPI(); @app.get('/') async def root(): return {'hello': 'world'}.",
                  contentPath: "python/fastapi/fastapiintro"
                },
                {
                  id: "pathandquery",
                  title: "Path Operations and Parameters",
                  contentPreview: "Route decorators (@app.get, @app.post, etc.) map HTTP methods and URL patterns to handler functions. Path parameters are declared in the URL template {item_id} and as typed function arguments. Query parameters are plain function arguments with defaults. FastAPI validates and coerces types automatically via Pydantic.",
                  contentPath: "python/fastapi/pathandquery"
                },
                {
                  id: "requestbody",
                  title: "Request Bodies and Pydantic Models",
                  contentPreview: "Pydantic BaseModel subclasses define the shape, types and validation rules for request and response bodies. Field() adds metadata (title, description, constraints). Nested models and lists are supported. response_model on the decorator strips extra fields before serialisation. Model validators allow cross-field rules.",
                  contentPath: "python/fastapi/requestbody"
                },
                {
                  id: "dependency",
                  title: "Dependency Injection System",
                  contentPreview: "FastAPI's Depends() builds a dependency graph at startup. Dependencies can declare their own dependencies. Common use-cases: getting DB sessions, parsing common query params, verifying auth tokens. yield-based dependencies act as context managers with automatic teardown after the response is sent.",
                  contentPath: "python/fastapi/dependency"
                },
                {
                  id: "authentication",
                  title: "Authentication and Security",
                  contentPreview: "FastAPI has built-in OAuth2PasswordBearer and HTTPBearer security schemes. JWT tokens are validated inside a Depends() callable. python-jose or PyJWT handle encoding/decoding. Passwords are hashed with passlib. Role-based access control is implemented via additional Depends() guards.",
                  contentPath: "python/fastapi/authentication"
                },
                {
                  id: "middleware",
                  title: "Middleware and CORS",
                  contentPreview: "ASGI middleware wraps the entire request-response cycle. @app.middleware('http') creates custom middleware. CORSMiddleware (from starlette.middleware.cors) is added via app.add_middleware() to configure allowed origins, methods and headers. GZipMiddleware, TrustedHostMiddleware and ProxyHeadersMiddleware are common additions.",
                  contentPath: "python/fastapi/middleware"
                },
                {
                  id: "routers",
                  title: "APIRouter and Application Structure",
                  contentPreview: "APIRouter groups related endpoints into modules. include_router() mounts them on the main app with an optional prefix and tags. Large apps follow a feature-based directory layout: each feature folder contains router.py, schemas.py, models.py and services.py. Lifespan events replace deprecated on_event.",
                  contentPath: "python/fastapi/routers"
                },
                {
                  id: "database",
                  title: "Database Integration",
                  contentPreview: "SQLAlchemy 2.0 with the async engine (create_async_engine) integrates via a Depends() session factory. Alembic handles migrations. For NoSQL, Motor provides an async MongoDB driver. SQLModel combines SQLAlchemy and Pydantic into a single model definition. Repository pattern cleanly separates data access from business logic.",
                  contentPath: "python/fastapi/database"
                },
                {
                  id: "backgroundtasks",
                  title: "Background Tasks and WebSockets",
                  contentPreview: "BackgroundTasks schedules callables to run after the response is sent — ideal for sending emails or logging. For heavier work, offload to Celery or ARQ (async Redis queue). WebSocket endpoints accept a WebSocket parameter; await websocket.accept() then loop reading messages. Broadcasting requires an in-memory or pub/sub channel layer.",
                  contentPath: "python/fastapi/backgroundtasks"
                },
                {
                  id: "testingfastapi",
                  title: "Testing FastAPI Applications",
                  contentPreview: "TestClient (httpx-based) performs synchronous requests to the app in tests. For async tests use AsyncClient with ASGITransport. Override dependencies with app.dependency_overrides. Use pytest fixtures to create isolated test DB sessions or roll back transactions after each test.",
                  contentPath: "python/fastapi/testingfastapi"
                },
                {
                  id: "fastapiproduction",
                  title: "Deployment and Production Considerations",
                  contentPreview: "Run FastAPI with Uvicorn (single process) or Gunicorn with UvicornWorker (multi-process). Containerise with Docker; configure health-check endpoints. Use environment variables for secrets via pydantic-settings BaseSettings. Add structured logging (structlog or python-json-logger). Reverse proxy with nginx or a cloud load balancer.",
                  contentPath: "python/fastapi/fastapiproduction"
                }
              ]
            },
            {
              id: "restapi",
              title: "REST API Design and Integration",
              description: "REST principles, versioning, security patterns and frontend-backend integration",
              threads: [
                {
                  id: "restprinciples",
                  title: "REST Principles and HTTP Methods",
                  contentPreview: "REST (Representational State Transfer) is an architectural style built on six constraints: uniform interface, statelessness, cacheability, layered system, code on demand and client-server separation. HTTP methods map to CRUD: GET (read), POST (create), PUT/PATCH (update), DELETE (remove). Idempotency: PUT and DELETE are idempotent; POST is not.",
                  contentPath: "python/restapi/restprinciples"
                },
                {
                  id: "resourcedesign",
                  title: "Resource Design and URL Conventions",
                  contentPreview: "Resources are nouns, never verbs: /orders not /getOrders. Use plural collection paths (/users) and singular item paths (/users/{id}). Nest sub-resources to express relationships: /users/{id}/orders. Keep URLs lowercase with hyphens. Avoid deep nesting beyond two levels.",
                  contentPath: "python/restapi/resourcedesign"
                },
                {
                  id: "versioning",
                  title: "API Versioning Strategies",
                  contentPreview: "Common versioning strategies: URI path versioning (/v1/users), Accept header versioning (application/vnd.api.v1+json), query parameter versioning (?version=1). URI versioning is the most visible; header versioning is the most RESTful. Semantic versioning applies: breaking changes require a major version bump.",
                  contentPath: "python/restapi/versioning"
                },
                {
                  id: "apiauthpatterns",
                  title: "Authentication Patterns",
                  contentPreview: "API Key: simple, but no expiry by default — suitable for server-to-server calls. Basic Auth: base64-encoded credentials in the Authorization header — never over plain HTTP. Bearer tokens (JWT): stateless, self-contained, expirable. OAuth2 + OIDC: delegated authorisation for third-party access. mTLS for high-security service meshes.",
                  contentPath: "python/restapi/apiauthpatterns"
                },
                {
                  id: "pagination",
                  title: "Pagination, Filtering and Sorting",
                  contentPreview: "Offset pagination (?offset=20&limit=10) is simple but skips records on concurrent inserts. Cursor/keyset pagination uses an opaque pointer to the last seen item — stable under mutations. Return total count and next/prev links in response metadata. Allow filtering via query params; sorting via ?sort=field:asc.",
                  contentPath: "python/restapi/pagination"
                },
                {
                  id: "errorcodes",
                  title: "Error Handling and Status Codes",
                  contentPreview: "Use semantically correct HTTP status codes: 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 409 Conflict, 422 Unprocessable Entity (FastAPI default for validation errors), 429 Too Many Requests, 500 Internal Server Error. Return a consistent error body: {error: string, detail: string, traceId: string}.",
                  contentPath: "python/restapi/errorcodes"
                },
                {
                  id: "openapi",
                  title: "OpenAPI and Swagger Documentation",
                  contentPreview: "OpenAPI 3.x is the de-facto standard for describing REST APIs. FastAPI auto-generates /docs (Swagger UI) and /redoc. Annotate models and endpoints with descriptions, examples and response schemas. Use operationId for SDK generation. Export the spec with app.openapi() for contract testing or code generation.",
                  contentPath: "python/restapi/openapi"
                },
                {
                  id: "ratelimiting",
                  title: "Rate Limiting and Throttling",
                  contentPreview: "Rate limiting protects APIs from abuse and ensures fair use. Algorithms: fixed window, sliding window, token bucket and leaky bucket. slowapi (Limits + FastAPI) or middleware-level Redis counters are common Python implementations. Return 429 with Retry-After header. Differentiate limits by API key or authenticated user.",
                  contentPath: "python/restapi/ratelimiting"
                },
                {
                  id: "integration",
                  title: "Frontend-Backend Integration Patterns",
                  contentPreview: "HTTP clients (fetch, axios, Angular HttpClient) consume REST APIs. The Backend-for-Frontend (BFF) pattern creates a dedicated backend per UI type to avoid over-fetching. CORS must be configured for cross-origin browser requests. Contract testing (Pact) verifies that the consumer and provider agree on the API shape without requiring both to be running.",
                  contentPath: "python/restapi/integration"
                }
              ]
            },
            {
              id: "dataprocessing",
              title: "Data Processing Concepts",
              description: "ETL/ELT, batch and streaming pipelines, Pandas and data quality",
              threads: [
                {
                  id: "etlelt",
                  title: "ETL vs ELT",
                  contentPreview: "ETL (Extract-Transform-Load) transforms data before loading into the target — suited for legacy data warehouses with limited compute. ELT (Extract-Load-Transform) loads raw data first then transforms inside the warehouse (e.g., Snowflake, BigQuery, Databricks) — leverages the warehouse's distributed compute for transformation, enabling schema-on-read and easier re-processing.",
                  contentPath: "python/dataprocessing/etlelt"
                },
                {
                  id: "batchprocessing",
                  title: "Batch Processing Fundamentals",
                  contentPreview: "Batch jobs process bounded datasets on a schedule. Key concerns: idempotency (re-runnable without duplicates), atomicity (all-or-nothing writes), partitioning strategy (date, region) and checkpoint/restart capability. Tools: Apache Spark, dbt, Pandas, Python scripts orchestrated by Airflow, Prefect or Databricks Workflows.",
                  contentPath: "python/dataprocessing/batchprocessing"
                },
                {
                  id: "streamprocessing",
                  title: "Stream Processing Fundamentals",
                  contentPreview: "Stream processing handles unbounded, continuously arriving data. Paradigms: micro-batch (PySpark Structured Streaming, Spark Streaming) and true streaming (Apache Flink, Kafka Streams). Key concepts: event time vs processing time, watermarks for late data, windowing (tumbling, sliding, session), exactly-once semantics.",
                  contentPath: "python/dataprocessing/streamprocessing"
                },
                {
                  id: "datapipelinepatterns",
                  title: "Data Pipeline Design Patterns",
                  contentPreview: "Common patterns: Fan-out (one source to many sinks), Fan-in (many sources to one sink), Saga / two-phase commit for distributed transactions, Dead-letter queues for failed messages, Idempotent consumers. Medallion architecture (Bronze → Silver → Gold) organises data by quality layer. Think about lineage, observability and SLA from the start.",
                  contentPath: "python/dataprocessing/datapipelinepatterns"
                },
                {
                  id: "pandas",
                  title: "Data Manipulation with Pandas",
                  contentPreview: "Pandas DataFrame is the workhorse for in-memory tabular data. Core operations: read_csv/read_parquet, merge/join, groupby/agg, apply, pivot_table, melt/stack. Use vectorised operations over loops. For large datasets chunked reading and Dask provide out-of-core processing. Polars is a Rust-based alternative with a lazy evaluation API similar to Spark.",
                  contentPath: "python/dataprocessing/pandas"
                },
                {
                  id: "datavalidation",
                  title: "Data Validation and Quality",
                  contentPreview: "Data quality dimensions: completeness, accuracy, consistency, timeliness and uniqueness. Tools: Great Expectations (rule-based expectations with profiling), Pandera (Pandas schema validation), Pydantic for per-record validation, dbt tests for SQL transformations. Build quality checks into every pipeline stage, not just at the end.",
                  contentPath: "python/dataprocessing/datavalidation"
                },
                {
                  id: "serialisationformats",
                  title: "Serialisation Formats",
                  contentPreview: "JSON: human-readable, universal. Parquet: columnar, highly compressed, Spark/Pandas native — best for analytics. Avro: row-oriented with schema evolution support — popular in Kafka pipelines. ORC: columnar, Hive-optimised. Delta Lake uses Parquet as the underlying storage format with a transaction log for ACID guarantees.",
                  contentPath: "python/dataprocessing/serialisationformats"
                },
                {
                  id: "orchestration",
                  title: "Pipeline Orchestration and Scheduling",
                  contentPreview: "Orchestrators manage execution order, retries, alerting and observability. Apache Airflow uses Python-defined DAGs. Prefect and Dagster offer a more modern, code-first experience. Databricks Workflows is a built-in orchestrator for notebook and task-based pipelines. Key concerns: backfill strategy, SLA alerting, idempotent task design.",
                  contentPath: "python/dataprocessing/orchestration"
                }
              ]
            },
            {
              id: "pysparkfundamentals",
              title: "PySpark Fundamentals",
              description: "Apache Spark with Python for distributed large-scale data processing",
              threads: [
                {
                  id: "sparkarchitecture",
                  title: "Spark Architecture Overview",
                  contentPreview: "Spark runs in a master-worker topology: a Driver program creates a SparkContext, splits work into Tasks and sends them to Executors on Worker nodes via a Cluster Manager (YARN, Kubernetes, Databricks). The Directed Acyclic Graph (DAG) scheduler optimises execution plans into Stages separated by shuffle boundaries.",
                  contentPath: "python/pysparkfundamentals/sparkarchitecture"
                },
                {
                  id: "rdd",
                  title: "Resilient Distributed Datasets (RDDs)",
                  contentPreview: "RDD is Spark's low-level distributed collection: immutable, fault-tolerant and partitioned. Transformations (map, filter, flatMap) are lazy; actions (collect, count, saveAsTextFile) trigger execution. Lineage graph enables recomputation on node failure. DataFrame/Dataset APIs are preferred over RDDs for most use-cases due to Catalyst optimisation.",
                  contentPath: "python/pysparkfundamentals/rdd"
                },
                {
                  id: "dataframes",
                  title: "Spark DataFrames and Datasets",
                  contentPreview: "DataFrame is a distributed collection of rows with a named, typed schema. Built on top of RDDs but optimised by the Catalyst query planner. Created from files (spark.read.parquet), databases (jdbc), streaming sources or RDDs. Common operations: select, filter, withColumn, groupBy, agg, join, union. Dataset API (Scala/Java only) adds compile-time type safety.",
                  contentPath: "python/pysparkfundamentals/dataframes"
                },
                {
                  id: "transformationsactions",
                  title: "Transformations vs Actions",
                  contentPreview: "Transformations are lazy — they build up a logical plan without executing: map, filter, select, join, groupBy. Actions trigger execution of the plan: count(), show(), collect(), write. Calling collect() on large datasets transfers all data to the driver — avoid it in production. Use take(n) or write directly to storage instead.",
                  contentPath: "python/pysparkfundamentals/transformationsactions"
                },
                {
                  id: "sparksql",
                  title: "Spark SQL and Temporary Views",
                  contentPreview: "Spark SQL allows querying DataFrames using standard SQL. createOrReplaceTempView registers a DataFrame as a SQL table scoped to the SparkSession. spark.sql() returns a DataFrame. The Catalog API (spark.catalog) lists databases, tables and columns. SparkSession.builder.enableHiveSupport() enables Hive metastore integration.",
                  contentPath: "python/pysparkfundamentals/sparksql"
                },
                {
                  id: "partitioning",
                  title: "Partitioning and Shuffling",
                  contentPreview: "Partitioning controls data distribution across cluster nodes. Too few partitions under-utilise the cluster; too many create scheduling overhead. repartition() performs a full shuffle; coalesce() merges partitions without a full shuffle. Shuffle is the most expensive operation — triggered by joins, groupBy and repartition. spark.sql.shuffle.partitions defaults to 200.",
                  contentPath: "python/pysparkfundamentals/partitioning"
                },
                {
                  id: "joinstrategies",
                  title: "Join Strategies in Spark",
                  contentPreview: "Broadcast join (hint or automatic for small tables): the smaller table is sent to all executors — avoids shuffle entirely. Sort-Merge join (default for large tables): both sides sorted and merged partition by partition. Skew join: uneven data distribution causes hot partitions — mitigate with salting or AQE skew join hints. Adaptive Query Execution (AQE) dynamically picks the best join strategy at runtime.",
                  contentPath: "python/pysparkfundamentals/joinstrategies"
                },
                {
                  id: "caching",
                  title: "Caching and Persistence",
                  contentPreview: "cache() stores a DataFrame in memory using the default MEMORY_AND_DISK storage level. persist(StorageLevel) allows choosing MEMORY_ONLY, DISK_ONLY, OFF_HEAP, etc. Cached DataFrames speed up iterative algorithms but consume executor memory. Always unpersist() when no longer needed. Checkpointing breaks lineage and writes to reliable storage.",
                  contentPath: "python/pysparkfundamentals/caching"
                },
                {
                  id: "sparktuning",
                  title: "Spark Performance Tuning",
                  contentPreview: "Key tuning levers: executor memory (spark.executor.memory), cores per executor, parallelism (spark.default.parallelism), shuffle partitions. Use Spark UI to identify slow stages, skew and spill. Prefer DataFrames over RDDs for Catalyst optimisation. Avoid UDFs where native Spark functions exist — UDFs bypass the optimiser and require Python serialisation.",
                  contentPath: "python/pysparkfundamentals/sparktuning"
                }
              ]
            },
            {
              id: "structuredstreaming",
              title: "Structured Streaming",
              description: "Real-time data processing with PySpark Structured Streaming",
              threads: [
                {
                  id: "streamingconcepts",
                  title: "Streaming Concepts and Micro-Batch Model",
                  contentPreview: "Structured Streaming treats a live data stream as an unbounded table. New data arrives as new rows; queries run incrementally. By default it uses micro-batch processing (minimum latency ~100 ms). Continuous processing mode (experimental) achieves ~1 ms latency. Output modes: Append, Update, Complete.",
                  contentPath: "python/structuredstreaming/streamingconcepts"
                },
                {
                  id: "readingstreams",
                  title: "Reading from Streaming Sources",
                  contentPreview: "spark.readStream supports Kafka (subscribe/assign options), file sources (auto-Loader for cloud storage), Delta Lake and socket/rate sources for testing. Kafka integration requires the spark-sql-kafka connector. Auto Loader (Databricks) uses file notifications for efficient incremental file ingestion from cloud storage.",
                  contentPath: "python/structuredstreaming/readingstreams"
                },
                {
                  id: "outputmodes",
                  title: "Output Modes and Sinks",
                  contentPreview: "Append mode: only new rows are written — safe for stateless aggregations and raw ingestion. Update mode: only changed rows are written — for stateful aggregations. Complete mode: entire result table is rewritten each trigger — for small aggregations. Sinks: console (debugging), Kafka, Delta Lake, Parquet, JDBC, foreachBatch (custom logic).",
                  contentPath: "python/structuredstreaming/outputmodes"
                },
                {
                  id: "statemanagement",
                  title: "Stateful Operations and Watermarking",
                  contentPreview: "Stateful operations (groupBy + agg, dropDuplicates, stream-stream joins) maintain state across micro-batches in a state store. Watermarking sets the threshold for late data: withWatermark('eventTime', '10 minutes') tells Spark to discard state for events more than 10 minutes behind the maximum seen event time.",
                  contentPath: "python/structuredstreaming/statemanagement"
                },
                {
                  id: "checkpointing",
                  title: "Checkpointing and Fault Tolerance",
                  contentPreview: "Checkpointing writes the query's progress (offsets) and state to a durable location (DBFS, S3, ADLS). On restart the query resumes from the checkpoint without reprocessing old data. option('checkpointLocation', path) is mandatory for stateful queries. State store can also be backed by RocksDB for lower memory usage in large-scale deployments.",
                  contentPath: "python/structuredstreaming/checkpointing"
                },
                {
                  id: "eventtime",
                  title: "Event Time and Late Data Handling",
                  contentPreview: "Event time is the timestamp embedded in the data itself; processing time is when Spark receives it. Using event time with windowing and watermarks gives correct results regardless of out-of-order arrival. Tumbling windows (non-overlapping), sliding windows (overlapping) and session windows (activity-based gaps) are all supported.",
                  contentPath: "python/structuredstreaming/eventtime"
                }
              ]
            },
            {
              id: "databricks",
              title: "Databricks and Delta Lake",
              description: "Databricks platform, Delta Lake, data governance and production pipeline patterns",
              threads: [
                {
                  id: "databricksoverview",
                  title: "Databricks Platform Overview",
                  contentPreview: "Databricks is a unified analytics platform built on Apache Spark, providing managed clusters, collaborative notebooks, MLflow integration and a built-in scheduler. It runs on major cloud providers (AWS, Azure, GCP). Unity Catalog provides a unified governance layer. The Lakehouse paradigm combines the flexibility of a data lake with the reliability of a data warehouse.",
                  contentPath: "python/databricks/databricksoverview"
                },
                {
                  id: "clusters",
                  title: "Clusters: Types, Configuration and Autoscaling",
                  contentPreview: "All-Purpose clusters are interactive and persistent; Job clusters are ephemeral and created per job run (cheaper). SQL Warehouses are optimised for SQL analytics. Autoscaling adds/removes workers based on load. Cluster policies enforce cost controls. Instance profiles (AWS) or managed identities (Azure) grant data access without storing credentials in notebooks.",
                  contentPath: "python/databricks/clusters"
                },
                {
                  id: "notebooks",
                  title: "Databricks Notebooks and Workflows",
                  contentPreview: "Databricks notebooks support Python, SQL, Scala and R in the same notebook using %language magic commands. dbutils.fs provides file system utilities; dbutils.widgets manages notebook parameters. Notebooks can be chained into multi-task Workflows with dependency edges, retry policies and notification alerts.",
                  contentPath: "python/databricks/notebooks"
                },
                {
                  id: "deltalakeintro",
                  title: "Introduction to Delta Lake",
                  contentPreview: "Delta Lake is an open-source storage layer on top of Parquet that adds ACID transactions, schema enforcement and scalable metadata handling. Every write creates a new version in the _delta_log transaction log. delta.io is the open-source project; Databricks Runtime includes optimised proprietary enhancements.",
                  contentPath: "python/databricks/deltalakeintro"
                },
                {
                  id: "deltacrud",
                  title: "Delta Lake CRUD Operations",
                  contentPreview: "DeltaTable.forPath(spark, path) or spark.read.format('delta') accesses a Delta table. MERGE INTO (upsert) handles CDC patterns — insert new records, update existing ones, delete removed ones in a single atomic statement. UPDATE and DELETE also support full predicate pushdown. COPY INTO and Auto Loader handle incremental ingestion.",
                  contentPath: "python/databricks/deltacrud"
                },
                {
                  id: "timetraveldelta",
                  title: "Time Travel and Data Versioning",
                  contentPreview: "Delta Lake retains historical versions of data in the transaction log. Query a past snapshot: spark.read.format('delta').option('versionAsOf', 5).load(path) or option('timestampAsOf', '2024-01-01'). RESTORE TABLE rolls back to a prior version. DESCRIBE HISTORY shows the full audit trail. Retention is controlled by delta.logRetentionDuration.",
                  contentPath: "python/databricks/timetraveldelta"
                },
                {
                  id: "optimisedreads",
                  title: "OPTIMIZE, Z-ORDER and VACUUM",
                  contentPreview: "OPTIMIZE compacts many small Parquet files into larger ones, improving read performance. Z-ORDER BY co-locates related data in the same files to enable aggressive data skipping on filter predicates. VACUUM removes old Parquet files that are no longer referenced by the transaction log. Default retention is 7 days; do not reduce below 7 days when using streaming readers.",
                  contentPath: "python/databricks/optimisedreads"
                },
                {
                  id: "unitycatalog",
                  title: "Unity Catalog and Data Governance",
                  contentPreview: "Unity Catalog provides a centralised, cloud-agnostic metastore for Databricks. It uses a three-level namespace: catalog.schema.table. Fine-grained access control (column masking, row filtering) is enforced at query time. Data lineage is tracked automatically. Shares enable secure cross-workspace and cross-cloud data sharing via Delta Sharing protocol.",
                  contentPath: "python/databricks/unitycatalog"
                },
                {
                  id: "medallionarchitecture",
                  title: "Medallion Architecture (Bronze / Silver / Gold)",
                  contentPreview: "Bronze layer: raw, unvalidated data ingested as-is from the source (append-only). Silver layer: cleansed, deduplicated and conformed data — business entities are recognisable. Gold layer: aggregated, business-specific datasets optimised for reporting and ML feature stores. Each layer is a Delta table; movement between layers is driven by Spark jobs or DLT pipelines.",
                  contentPath: "python/databricks/medallionarchitecture"
                },
                {
                  id: "dlt",
                  title: "Delta Live Tables (DLT)",
                  contentPreview: "DLT is a declarative framework for building reliable batch and streaming pipelines on Databricks. Pipelines are defined using @dlt.table and @dlt.view decorators. Expectations (@dlt.expect, @dlt.expect_or_drop) enforce data quality inline. DLT manages dependencies, retries and incremental processing automatically. Development, staging and production pipeline modes control SLA and restart behaviour.",
                  contentPath: "python/databricks/dlt"
                },
                {
                  id: "cdc",
                  title: "Change Data Capture (CDC) with Delta",
                  contentPreview: "CDC captures row-level changes (INSERT, UPDATE, DELETE) from transactional databases and applies them to a Delta target. Debezium + Kafka is a common CDC source. APPLY CHANGES INTO (DLT) or MERGE INTO (PySpark) are used to apply CDC events. SCD Type 1 (overwrite) and Type 2 (keep history with effective dates) are both achievable with Delta MERGE.",
                  contentPath: "python/databricks/cdc"
                }
              ]
            }
          ]
        }
      ],
    },
    {
      id: "devops",
      name: "DevOps",
      icon: Cog,
      subcategories: [
        {
          id: "docker",
          name: "Docker",
          description: "Platform for developing, shipping, and running applications",
          topics: [
            {
              id: "dockerintroduction",
              title: "Baiscs of Docker",
              description: "Introduction, Components and running your first container",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to Docker and Containerization",
                  contentPreview: "Docker is a platform that enables you to build, ship, and run applications in lightweight, isolated environments called containers. It abstracts the underlying infrastructure, allowing developers to focus on writing code without worrying about deployment environments.",
                  contentPath: "docker/dockerintroduction/introduction"
                },
                {
                  id: "dockerarchi",
                  title: "Understanding Docker Architecture",
                  contentPreview: "",
                  contentPath: "docker/dockerintroduction/dockerarchi"
                },
                {
                  id: "installing",
                  title: "Installing Docker",
                  contentPreview: "",
                  contentPath: "docker/dockerintroduction/installing"
                },
                {
                  id: "basiccommands",
                  title: "Basic Docker Commands",
                  contentPreview: "",
                  contentPath: "docker/dockerintroduction/basiccommands"
                },
                {
                  id: "buildimage",
                  title: "Building Docker Images with Dockerfile",
                  contentPreview: "A Dockerfile consists of a set of instructions that Docker reads sequentially to build an image. Each instruction creates a new layer in the image, which makes it easier to cache and update parts of the build process.",
                  contentPath: "docker/dockerintroduction/buildimage"
                },
                {
                  id: "workwithcontainer",
                  title: "Working with Docker Containers",
                  contentPreview: "A Docker container is an isolated runtime environment that encapsulates your application and its dependencies, ensuring consistency across development, testing, and production environments.",
                  contentPath: "docker/dockerintroduction/workwithcontainer"
                },
                {
                  id: "networkbasics",
                  title: "Docker Networking Basics",
                  contentPreview: "Docker uses different network drivers to provide various connectivity options. ",
                  contentPath: "docker/dockerintroduction/networkbasics"
                }
              ]
            },
            {
              id: "dockeradvanced",
              title: "Docker Advanced",
              description: "Docker's role in Infrastructures, Kubernetes and Networking",
              threads: [
                {
                  id: "multicontainer",
                  title: "Docker Compose for Multi-Container Applications",
                  contentPreview: "Docker Compose allows you to define multiple containers and their configurations in a single YAML file (docker-compose.yml). This file specifies how containers interact, share networks, and manage persistent data.",
                  contentPath: "docker/dockeradvanced/multicontainer"
                },
                {
                  id: "registries",
                  title: "Docker Registries and Image Management",
                  contentPreview: "A Docker registry is a storage and distribution system for Docker images. It allows you to store, share, and manage container images, enabling collaboration and deployment across different environments.",
                  contentPath: "docker/dockeradvanced/registries"
                },
                {
                  id: "advanceddockerfile",
                  title: "Advanced Dockerfile Techniques",
                  contentPreview: "Multistage, build cache and image size",
                  contentPath: "docker/dockeradvanced/advanceddockerfile"
                },
                {
                  id: "debugcontainer",
                  title: "Debugging and Troubleshooting Containers",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/debugcontainer"
                },
                {
                  id: "volumespersistence",
                  title: "Docker Volumes and Data Persistence",
                  contentPreview: "Docker volumes provide persistent storage for containers. Unlike container file systems, volumes exist outside the lifecycle of individual containers and can be shared among multiple containers.",
                  contentPath: "docker/dockeradvanced/volumespersistence"
                },
                {
                  id: "securitypractices",
                  title: "Security Best Practices in Docker",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/securitypractices"
                },
                {
                  id: "orchestrationswarm",
                  title: "Container Orchestration with Docker Swarm",
                  contentPreview: "Docker Swarm is a container orchestration tool that allows you to manage a cluster of Docker engines, called a swarm, as a single virtual system. It provides built-in clustering, service discovery, and load balancing for containers.",
                  contentPath: "docker/dockeradvanced/orchestrationswarm"
                },
                {
                  id: "kubedocker",
                  title: "Introduction to Kubernetes",
                  contentPreview: "Kubernetes, often abbreviated as K8s, is a container orchestration system that manages clusters of containerized applications. It was originally developed by Google and is now maintained by the Cloud Native Computing Foundation (CNCF).",
                  contentPath: "docker/dockeradvanced/kubedocker"
                },
                {
                  id: "kubeorche",
                  title: "Advanced Kubernetes Orchestration",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/kubeorche"
                },
                {
                  id: "cicddocker",
                  title: "CI/CD Integration with Docker",
                  contentPreview: "Automate the build and testing process every time code changes are committed. Docker ensures that your application runs consistently across development, testing, and production environments by packaging it into a container.",
                  contentPath: "docker/dockeradvanced/cicddocker"
                },
                {
                  id: "performdocker",
                  title: "Performance Optimization and Resource Management",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/performdocker"
                },
                {
                  id: "advanceddockernetwork",
                  title: "Advanced Docker Networking",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/advanceddockernetwork"
                },
                {
                  id: "dockersecurity",
                  title: "Docker Security and Compliance",
                  contentPreview: "",
                  contentPath: "docker/dockeradvanced/dockersecurity"
                },
                {
                  id: "multiclouddocker",
                  title: "Multi-Cloud and Hybrid Deployments with Docker",
                  contentPreview: "Deploying containerized applications across two or more public cloud providers (e.g., AWS, Azure, GCP) to achieve redundancy, performance optimization, and vendor diversification.",
                  contentPath: "docker/dockeradvanced/multiclouddocker"
                },
                {
                  id: "dockerenterprise",
                  title: "Docker Enterprise Solutions and Management Tools",
                  contentPreview: "Docker Enterprise is a comprehensive container management platform designed for large-scale, production environments. It provides a secure and robust framework for building, deploying, and managing containers across clusters.",
                  contentPath: "docker/dockeradvanced/dockerenterprise"
                }
              ]
            }
          ]
        },
        {
          id: "kubernetes",
          name: "Kubernetes",
          description: "Container orchestration system for automating deployment",
          topics: [
            {
              id: "baseresources",
              title: "Overview and Built-in Resources",
              description: "Get started with kubernetes",
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "",
                  contentPath: "kubernetes/baseresources/overview"
                },
                {
                  id: "standardinterfaces",
                  title: "Standard Interfaces",
                  contentPreview: "",
                  contentPath: "kubernetes/baseresources/standardinterfaces"
                },
                {
                  id: "testenv",
                  title: "Setting Up a Test Environment",
                  contentPreview: "",
                  contentPath: "kubernetes/baseresources/testenv"
                },
                {
                  id: "builtinresources",
                  title: "Built-in Kubernetes Resources",
                  contentPreview: "",
                  contentPath: "kubernetes/baseresources/builtinresources"
                }
              ]
            },
            {
              id: "helm",
              title: "Helm and Helm Charts",
              description: "De-facto standard for distributing software for Kube Combination of: Package Manager and Template Engine",
              threads: [
                {
                  id: "overview",
                  title: "Overview of Helm",
                  contentPreview: "",
                  contentPath: "kubernetes/helm/overview"
                }
              ]
            }
          ]
        },
        {
          id: "terraform",
          name: "Terraform",
          description: "Most popular Infrastructure as Code platform",
          topics: [
            {
              id: "introduction",
              title: "Introduction to Terraform",
              description: "",
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "",
                  contentPath: "terraform/introduction/overview"
                },
                {
                  id: "usage",
                  title: "Usage",
                  contentPreview: "",
                  contentPath: "terraform/introduction/usage"
                },
                {
                  id: "variables",
                  title: "Variables",
                  contentPreview: "",
                  contentPath: "terraform/introduction/variables"
                },
                {
                  id: "projectorg",
                  title: "Project Organization + Modules",
                  contentPreview: "",
                  contentPath: "terraform/introduction/projectorg"
                },
                {
                  id: "testterra",
                  title: "Testing Terraform Code",
                  contentPreview: "",
                  contentPath: "terraform/introduction/testterra"
                }
              ]
            }
          ]
        },
        {
          id: "grpc",
          name: "gRPC",
          description: "gRPC is a modern, high-performance framework for Remote Procedure Calls (RPCs). It allows programs to communicate with each other as if they were calling local functions, even when they run on different machines",
          topics: [
            {
              id: "beginnergrpc",
              title: "gRPC Beginner - Introduction, Protobuf, vs REST",
              description: "",
              threads: [
                {
                  id: "whatisgrpc",
                  title: "What is gRPC?",
                  contentPreview: "gRPC is a modern, high-performance framework for Remote Procedure Calls (RPCs). It allows programs to communicate with each other as if they were calling local functions, even when they run on different machines. ",
                  contentPath: "grpc/beginnergrpc/whatisgrpc"
                },
                {
                  id: "protobuf",
                  title: "Understanding Protocol Buffers (Protobuf)",
                  contentPreview: "Protocol Buffers are a language-neutral, platform-neutral way of encoding structured data into a compact binary format.",
                  contentPath: "grpc/beginnergrpc/protobuf"
                },
                {
                  id: "vsrest",
                  title: "gRPC vs. REST",
                  contentPreview: "Both gRPC and REST are popular approaches for enabling communication between services, but they have fundamental differences in design, performance, and use cases.",
                  contentPath: "grpc/beginnergrpc/vsrest"
                }
              ]
            },
            {
              id: "intermediategrpc",
              title: "gRPC Intermediate - Services, Clients",
              description: "",
              threads: [
                {
                  id: "servicedef",
                  title: "Service Definition and Stubs",
                  contentPreview: "In gRPC, the service definition and stubs are at the heart of how clients and servers communicate. This section explains how to define a service using Protocol Buffers, generate code stubs, and use these stubs in your application.",
                  contentPath: "grpc/intermediategrpc/servicedef"
                },
                {
                  id: "servicetypes",
                  title: "gRPC Service Types",
                  contentPreview: "gRPC supports various service types that allow you to choose the communication pattern that best suits your application's needs.",
                  contentPath: "grpc/intermediategrpc/servicetypes"
                },
                {
                  id: "defineservice",
                  title: "Building a Basic gRPC Service in .NET",
                  contentPreview: "Building a basic gRPC service in .NET is straightforward, thanks to built-in templates and tools.",
                  contentPath: "grpc/intermediategrpc/defineservice"
                },
                {
                  id: "grpcnet",
                  title: "gRPC Client in .NET",
                  contentPreview: "A gRPC client in .NET is used to call remote methods defined in a gRPC service. Once you have a running gRPC service and generated client code from your .proto definitions, creating a client is straightforward. ",
                  contentPath: "grpc/intermediategrpc/grpcnet"
                }
              ]
            },
            {
              id: "advancedgrpc",
              title: "gRPC Advanced - Streaming, Error handling, Integration, Security",
              description: "",
              threads: [
                {
                  id: "streampatterns",
                  title: "Streaming Advanced Patterns",
                  contentPreview: "Advanced streaming patterns in gRPC build upon the basic streaming models by addressing challenges such as flow control, error handling, backpressure, and efficient resource management. ",
                  contentPath: "grpc/advancedgrpc/streampatterns"
                },
                {
                  id: "grpcmiddleware",
                  title: "Interceptors and Middleware",
                  contentPreview: "In gRPC, interceptors can be applied on both the client and server sides to perform tasks like logging, authentication, monitoring, or modifying requests/responses.",
                  contentPath: "grpc/advancedgrpc/grpcmiddleware"
                },
                {
                  id: "grpcerrorhandle",
                  title: "Error Handling and Status Codes",
                  contentPreview: "Error handling in gRPC is built into the protocol itself, providing a standardized way to report and manage errors across client-server boundaries. ",
                  contentPath: "grpc/advancedgrpc/grpcerrorhandle"
                },
                {
                  id: "grpcsecurity",
                  title: "Security and Authentication",
                  contentPreview: "Securing gRPC communication is essential in production environments. gRPC offers robust security mechanisms primarily through TLS for transport security and various approaches for authentication. Below is a comprehensive guide on securing gRPC services.",
                  contentPath: "grpc/advancedgrpc/grpcsecurity"
                },
                {
                  id: "grpcdapr",
                  title: "Integrating gRPC with Dapr",
                  contentPreview: "Integrating gRPC with Dapr allows you to leverage both the high-performance, strongly-typed communication offered by gRPC and Dapr’s powerful abstractions for service invocation, state management, and observability in microservices architectures.",
                  contentPath: "grpc/advancedgrpc/grpcdapr"
                },
                {
                  id: "grpckubeazure",
                  title: "Advanced gRPC in Kubernetes & Azure",
                  contentPreview: "Deploying gRPC services in production often means dealing with challenges like scalability, security, observability, and integration with cloud-native features. ",
                  contentPath: "grpc/advancedgrpc/grpckubeazure"
                }
              ]
            }
          ]
        }
      ],
    },
    {
      id: "networking",
      name: "Networking",
      icon: Network,
      subcategories: [
        {
          id: "http",
          name: "HTTP",
          description: "The foundation of data communication for the web",
          topics: []
        },
        {
          id: "tcp-ip",
          name: "TCP/IP",
          description: "Fundamental protocols for internet communications",
          topics: []
        },
      ],
    },
    {
      id: "sql",
      name: "SQL",
      icon: Database,
      subcategories: [
        {
          id: "efcore",
          name: "EF Core",
          description: "Entity Framework Core ORM",
          topics: [
            {
              id: "fundamentals",
              title: "Fundamentals and Core Concepts",
              description: "Introduction and Key Components",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to EF Core",
                  contentPreview: "EF Core (Entity Framework Core) is a modern, lightweight, and cross-platform Object-Relational Mapper (ORM) for .NET. It enables developers to work with databases using .NET objects, abstracting away much of the boilerplate code associated with database access.",
                  contentPath: "efcore/fundamentals/introduction"
                },
                {
                  id: "dbcontext",
                  title: "DbContext and DbSet",
                  contentPreview: "Understanding DbContext and DbSet<T> is central to effectively using EF Core. These components are the backbone of the EF Core data access layer.",
                  contentPath: "efcore/fundamentals/dbcontext"
                },
                {
                  id: "entitymodelling",
                  title: "Entity Modeling",
                  contentPreview: "Entity modeling is at the core of using EF Core effectively. It involves defining your domain classes (entities) and how they relate to each other, as well as configuring how these entities map to the database schema.",
                  contentPath: "efcore/fundamentals/entitymodelling"
                },
                {
                  id: "changetracking",
                  title: "Change Tracking",
                  contentPreview: "Change tracking is a core feature of EF Core that automatically detects modifications made to entities retrieved from the database. This mechanism allows EF Core to determine what changes need to be persisted when you call SaveChanges(), without requiring you to manually specify the state of each entity.",
                  contentPath: "efcore/fundamentals/changetracking"
                }
              ]
            },
            {
              id: "underhood",
              title: "Under-the-Hood Mechanisms",
              description: "SQL Generation, Transactions and LINQ",
              threads: [
                {
                  id: "querytranslation",
                  title: "Query Translation and Execution Pipeline",
                  contentPreview: "EF Core transforms your LINQ queries into SQL statements through a multi-step process that involves parsing expression trees, compiling queries, and executing them efficiently. This pipeline is crucial for bridging the gap between the high-level abstraction of LINQ and the underlying relational database.",
                  contentPath: "efcore/underhood/querytranslation"
                },
                {
                  id: "sqlgen",
                  title: "SQL Generation",
                  contentPreview: "EF Core’s SQL generation process is a critical part of how your LINQ queries are transformed into efficient SQL commands that run against your database. This process involves several steps, from translating expression trees to applying optimizations and finally logging the generated SQL for debugging purposes.",
                  contentPath: "efcore/underhood/sqlgen"
                },
                {
                  id: "cachingcompile",
                  title: "Caching and Compiled Queries",
                  contentPreview: "EF Core employs several caching mechanisms and compiled query strategies to enhance performance by reducing the overhead associated with query translation and execution. This section explores these techniques in depth.",
                  contentPath: "efcore/underhood/cachingcompile"
                },
                {
                  id: "transacmanage",
                  title: "Concurrency and Transaction Management",
                  contentPreview: "EF Core provides robust support for handling concurrency and transactions. Understanding these mechanisms is key to ensuring data consistency and integrity, especially in high-load or distributed systems.",
                  contentPath: "efcore/underhood/transacmanage"
                }
              ]
            },
            {
              id: "advanced",
              title: "Advanced Features and Customizations",
              description: "Advanced Queries, Diagnostics, Providers and Testing",
              threads: [
                {
                  id: "migrations",
                  title: "Migrations and Model Snapshots",
                  contentPreview: "EF Core migrations provide a systematic way to evolve your database schema as your model changes over time. They enable you to update your database in a controlled manner while keeping track of historical changes and supporting deployment strategies that minimize downtime.",
                  contentPath: "efcore/advanced/migrations"
                },
                {
                  id: "advancequery",
                  title: "Advanced Querying",
                  contentPreview: "Advanced querying in EF Core covers several techniques for retrieving data in complex scenarios. This includes executing raw SQL commands, calling stored procedures, using interpolated SQL, writing complex LINQ queries and projections, and addressing common performance pitfalls like N+1 query issues through query splitting.",
                  contentPath: "efcore/advanced/advancequery"
                },
                {
                  id: "interceptor",
                  title: "Interceptors and Diagnostics",
                  contentPreview: "EF Core provides powerful mechanisms to inspect, log, and modify the behavior of database operations through interceptors and diagnostics. These features allow you to capture detailed information about queries, commands, and other operations, and integrate with external monitoring systems like Application Insights.",
                  contentPath: "efcore/advanced/interceptor"
                },
                {
                  id: "providerexte",
                  title: "Provider Extensibility",
                  contentPreview: "EF Core is designed with extensibility in mind, allowing developers to support a variety of databases through providers. Providers are libraries that implement EF Core’s abstractions for a specific database system. ",
                  contentPath: "efcore/advanced/providerexte"
                },
                {
                  id: "testingefcore",
                  title: "Testing with EF Core",
                  contentPreview: "Testing data access code is crucial to ensure your application behaves as expected, and EF Core provides several strategies to support effective testing. Here we discuss different testing approaches and best practices for working with DbContext in tests.",
                  contentPath: "efcore/advanced/testingefcore"
                }
              ]
            },
            {
              id: "performance",
              title: "Edge Scenarios and Performance Tuning",
              description: "Using EF Core in High Performance Low Latency Scenarios",
              threads: [
                {
                  id: "bulkoperations",
                  title: "Bulk Operations and Batch Processing",
                  contentPreview: "When working with large volumes of data, performing bulk operations (inserts, updates, and deletes) efficiently is critical. EF Core’s default behavior issues individual SQL commands for each entity operation, which can lead to performance bottlenecks.",
                  contentPath: "efcore/performance/bulkoperations"
                },
                {
                  id: "handlelargedata",
                  title: "Handling Large Data Volumes",
                  contentPreview: "Working with large datasets requires careful design to ensure efficient data retrieval and minimal memory overhead. EF Core offers several techniques to handle such scenarios, including pagination, streaming, and performance tuning.",
                  contentPath: "efcore/performance/handlelargedata"
                },
                {
                  id: "concurrency",
                  title: "Concurrency in Distributed Systems",
                  contentPreview: "Handling concurrency in distributed systems is challenging due to the possibility of multiple users or services modifying the same data simultaneously. ",
                  contentPath: "efcore/performance/concurrency"
                },
                {
                  id: "advancedconnection",
                  title: "Advanced Connection and Resiliency Strategies",
                  contentPreview: "When building robust applications, it's essential to design data access layers that gracefully handle connectivity issues and transient faults. EF Core provides several built-in features, and you can also integrate with external libraries like Polly to enhance resiliency.",
                  contentPath: "efcore/performance/advancedconnection"
                },
                {
                  id: "custombehavior",
                  title: "Customizing EF Core Behavior",
                  contentPreview: "EF Core is highly extensible, allowing you to tailor its default behavior to suit your application's specific needs. This customization can be achieved by overriding default conventions, using advanced Fluent API configurations, and extending EF Core with your own custom logic.",
                  contentPath: "efcore/performance/custombehavior"
                }
              ]
            },
            {
              id: "efcoremicros",
              title: "EF Core in Microservices and Cloud Environments",
              description: "Patterns and Usage in a Microservices Environment",
              threads: [
                {
                  id: "patterns",
                  title: "Patterns for Microservices",
                  contentPreview: "In a microservices architecture, data management is decentralized, and each service typically operates within its own bounded context. EF Core plays a crucial role in this environment by providing an ORM that can be tailored to each microservice’s domain. ",
                  contentPath: "efcore/efcoremicros/patterns"
                }
              ]
            }
          ]
        },
        {
          id: 'query',
          name: 'Querying in Depth',
          description: 'Optimizations, transactions, analyzers of data retrieval',
          topics: [
            {
              id: "optimization",
              title: "Query Optimization",
              description: "",
              threads: [
                {
                  id: "optimizing",
                  title: "Optimizing Queries",
                  contentPreview: "Optimizing SQL queries involving multiple table joins and filtering is crucial for improving database performance. Poorly optimized queries can lead to slow response times, high resource usage, and scalability issues. Below are strategies and best practices for optimizing such queries.",
                  contentPath: "query/optimization/optimizing"
                },
                {
                  id: "transactionisolation",
                  title: "Transaction Isolation",
                  contentPreview: "Transaction isolation is a critical concept in database management systems (DBMS) that determines how transactions interact with each other and how changes made by one transaction are visible to others. Proper isolation ensures data integrity and consistency while balancing performance and concurrency.",
                  contentPath: "query/optimization/transactionisolation"
                },
                {
                  id: "optimizingretrieval",
                  title: "Optimizing Data Retrieval",
                  contentPreview: "When dealing with large datasets (e.g., millions of records), it's crucial to optimize data retrieval and processing to ensure performance, scalability, and memory efficiency. Two key techniques for handling such datasets are pagination and yield return.",
                  contentPath: "query/optimization/optimizingretrieval"
                },
                {
                  id: "queryanalyzer",
                  title: "Query Analyzers",
                  contentPreview: "Query analyzers are tools or features provided by database management systems (DBMS) to help developers and database administrators (DBAs) understand and optimize the performance of SQL queries. ",
                  contentPath: "query/optimization/queryanalyzer"
                }
              ]
            }
          ]
        }
      ],
    },
    {
      id: "cloud",
      name: "Cloud",
      icon: CloudIcon,
      subcategories: [
        {
          id: "azure",
          name: "Azure",
          description: "Microsoft Azure cloud platform — services, architecture, and data engineering tools",
          topics: [
            {
              id: "azurefundamentals",
              title: "Azure Fundamentals",
              description: "Core concepts of the Microsoft Azure cloud platform",
              threads: [
                {
                  id: "azureoverview",
                  title: "Azure Overview",
                  contentPreview: "Microsoft Azure is a cloud computing platform offering over 200 products and services across compute, storage, networking, databases, analytics, AI, and DevOps. It supports IaaS, PaaS, and SaaS deployment models.",
                  contentPath: "azure/fundamentals/azureoverview"
                },
                {
                  id: "azureregions",
                  title: "Regions, Availability Zones & Resource Groups",
                  contentPreview: "Azure organises infrastructure into geographic regions, paired regions for disaster recovery, availability zones for high availability within a region, and resource groups as logical containers for managing related resources.",
                  contentPath: "azure/fundamentals/azureregions"
                },
                {
                  id: "azureiam",
                  title: "Identity & Access Management (Azure AD / Entra ID)",
                  contentPreview: "Microsoft Entra ID (formerly Azure Active Directory) is the cloud-based identity and access management service. Core concepts: tenants, users, groups, service principals, managed identities, RBAC roles, and Conditional Access policies.",
                  contentPath: "azure/fundamentals/azureiam"
                }
              ]
            },
            {
              id: "adls",
              title: "Azure Data Lake Storage",
              description: "Azure Data Lake Storage Gen2 — scalable, hierarchical big-data storage on top of Azure Blob Storage",
              threads: [
                {
                  id: "adlsoverview",
                  title: "ADLS Gen2 Overview",
                  contentPreview: "Azure Data Lake Storage Gen2 combines the scalability and cost-effectiveness of Azure Blob Storage with a Hadoop-compatible file system. It uses a hierarchical namespace to organise data into directories and files, enabling efficient analytics workloads at petabyte scale.",
                  contentPath: "azure/adls/adlsoverview"
                },
                {
                  id: "adlssecurity",
                  title: "Security & Access Control",
                  contentPreview: "ADLS Gen2 supports POSIX-like Access Control Lists (ACLs) at the file and directory level in addition to Azure RBAC. Managed identities and service principals are the recommended way to grant workloads (Databricks, ADF, Synapse) access without storing credentials.",
                  contentPath: "azure/adls/adlssecurity"
                },
                {
                  id: "adlstiers",
                  title: "Storage Tiers & Lifecycle Management",
                  contentPreview: "ADLS Gen2 inherits Blob Storage access tiers: Hot (frequent access), Cool (infrequent access, lower storage cost), Cold, and Archive. Lifecycle management policies automatically transition or delete blobs based on age or last-modified date, optimising cost.",
                  contentPath: "azure/adls/adlstiers"
                },
                {
                  id: "adlsintegration",
                  title: "Integration with Azure Services",
                  contentPreview: "ADLS Gen2 is the landing zone for most Azure data engineering pipelines. Azure Data Factory and Synapse Pipelines use it as source and sink. Azure Databricks mounts it via ABFSS or Unity Catalog External Locations. Synapse Analytics accesses it directly through serverless SQL pools.",
                  contentPath: "azure/adls/adlsintegration"
                }
              ]
            },
            {
              id: "azuredatabricks",
              title: "Azure Databricks",
              description: "Managed Apache Spark platform on Azure — notebooks, clusters, Delta Lake, MLflow, and Unity Catalog",
              threads: [
                {
                  id: "databricksoverview",
                  title: "Azure Databricks Overview",
                  contentPreview: "Azure Databricks is a first-party Microsoft service that provides a fully managed Apache Spark environment. It integrates natively with ADLS Gen2, Azure DevOps, Azure Active Directory, and other Azure services. The Lakehouse paradigm unifies data lake flexibility with data warehouse reliability via Delta Lake.",
                  contentPath: "azure/azuredatabricks/databricksoverview"
                },
                {
                  id: "clusters",
                  title: "Clusters & Compute",
                  contentPreview: "Databricks supports All-Purpose clusters (interactive notebooks), Job clusters (single-run automation), and SQL Warehouses (BI / SQL analytics). Cluster policies enforce cost controls. Photon engine accelerates SQL and ETL workloads. Instance pools reduce startup latency by pre-warming VMs.",
                  contentPath: "azure/azuredatabricks/clusters"
                },
                {
                  id: "notebooks",
                  title: "Notebooks & Collaboration",
                  contentPreview: "Databricks notebooks support Python, Scala, SQL, and R in the same notebook using %language magic commands. Real-time co-authoring, version history, and Git integration (Repos) enable collaborative data engineering. Widgets parameterise notebooks for reusable pipelines.",
                  contentPath: "azure/azuredatabricks/notebooks"
                },
                {
                  id: "deltalake",
                  title: "Delta Lake",
                  contentPreview: "Delta Lake is an open-source storage layer that brings ACID transactions, schema enforcement, time travel (versioning), and scalable metadata to data lakes. It is the default table format in Azure Databricks. Key operations: MERGE (upsert), OPTIMIZE (compaction), VACUUM (cleanup), DESCRIBE HISTORY.",
                  contentPath: "azure/azuredatabricks/deltalake"
                },
                {
                  id: "unitycatalog",
                  title: "Unity Catalog",
                  contentPreview: "Unity Catalog is the unified governance layer for Databricks, providing a three-level namespace (catalog.schema.table), fine-grained access control, column masking, row filtering, and automatic data lineage. External Locations and Storage Credentials abstract ADLS Gen2 paths behind governed access.",
                  contentPath: "azure/azuredatabricks/unitycatalog"
                },
                {
                  id: "workflowsjobs",
                  title: "Workflows & Jobs",
                  contentPreview: "Databricks Workflows is the native orchestration service. A Job can be a single notebook, a Python script, a JAR, a Delta Live Tables pipeline, or a dbt task. Multi-task jobs define DAGs with dependencies, retry policies, timeouts, and conditional task execution.",
                  contentPath: "azure/azuredatabricks/workflowsjobs"
                },
                {
                  id: "databrickssecurity",
                  title: "Security & Integration with Azure",
                  contentPreview: "Azure Databricks integrates with Entra ID for SSO and SCIM-based user provisioning. Managed identities and service principals authenticate to ADLS Gen2, Key Vault, and Event Hubs without embedded credentials. Private Link and VNet injection isolate the control and data planes inside a customer-managed virtual network.",
                  contentPath: "azure/azuredatabricks/databrickssecurity"
                }
              ]
            },
            {
              id: "azuredevops",
              title: "Azure DevOps for Data",
              description: "CI/CD pipelines, Git branching strategies, and Infrastructure-as-Code for Azure data workloads",
              threads: [
                {
                  id: "cicdnotebooks",
                  title: "CI/CD for Notebooks & Pipelines",
                  contentPreview: "Databricks Asset Bundles (DAB) or the legacy dbx tool package notebooks, jobs, and cluster configs into version-controlled bundles deployed via Azure DevOps YAML pipelines. Separate environments (dev, test, prod) map to separate Databricks workspaces with environment-specific variable groups in Azure DevOps.",
                  contentPath: "azure/azuredevops/cicdnotebooks"
                }
              ]
            }
          ]
        }
      ],
    },
  ];