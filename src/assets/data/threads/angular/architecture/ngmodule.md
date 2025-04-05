**Declarations**

Components: UI elements with their logic.
Directives: Custom behavior attached to elements (e.g., ngIf, ngFor).
Pipes: Transformations applied in templates (e.g., date, uppercase).
Purpose: By listing these, Angular compiles them as part of the module.
Scope: Components, directives, and pipes are only available inside this module unless explicitly exported.

**Imports**

This array defines dependencies on other Angular modules, which can be:
Built-in modules (e.g., CommonModule, FormsModule, HttpClientModule).
Custom modules created within the application.
Purpose:
Grants access to components, directives, and services from other modules.
Encourages modularity by dividing large applications into feature modules.

**Providers**

Used for Dependency Injection (DI):
Registers services and providers that components and other classes can use.
Modern approach: Services often use providedIn: 'root' for tree-shaking benefits.
Module-specific providers: If declared in a feature module, the service is scoped to that module only.

**Bootstrap**

Used only in the root module (AppModule).
Defines the root component that Angular initializes when the app loads.
Example:

```
bootstrap: [AppComponent]```
Not needed in feature modules, as they don’t start the application.

**Exports**

Allows other modules to use components, directives, or pipes defined in this module.
Purpose:
If another module imports this one, it can access the exported elements.
Example: A SharedModule exporting a CustomButtonComponent so multiple modules can use it.