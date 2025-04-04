ASP.NET Core has dependency injection (DI) built into its core framework, making it a first-class citizen in the design of modern web applications. The built-in DI container is lightweight yet powerful, enabling developers to manage service lifetimes, resolve dependencies automatically, and promote loose coupling and testability across the application.

---

## 1. Core Concepts

### What is Dependency Injection?
- **Definition:**  
  Dependency Injection is a design pattern that allows an object’s dependencies to be provided (or "injected") from an external source rather than the object creating them itself. This enables better modularity, testability, and easier maintenance.

### Inversion of Control (IoC)
- **Relationship to DI:**  
  DI is a specific form of Inversion of Control, where the control of creating and managing dependencies is inverted from the application logic to a container or framework.

---

## 2. Built-In DI Container in ASP.NET Core

### Registration and Composition Root
- **Composition Root:**  
  All service registrations are performed in the `ConfigureServices` method in `Startup.cs` (or `Program.cs` in minimal hosting models). This centralizes dependency configuration.
  
- **Service Collection:**  
  ASP.NET Core uses an `IServiceCollection` to collect all service registrations, which is then built into an `IServiceProvider` by the framework.
  ```typescript
  public void ConfigureServices(IServiceCollection services)
  {
      // Register framework services (e.g., MVC controllers)
      services.AddControllers();

      // Register custom services with various lifetimes
      services.AddTransient<IMyTransientService, MyTransientService>();
      services.AddScoped<IMyScopedService, MyScopedService>();
      services.AddSingleton<IMySingletonService, MySingletonService>();
  }
```

**Service Lifetimes
Transient:**
A new instance is created every time a service is requested.

**Scoped:**
A single instance is maintained within a scope, such as an HTTP request.

**Singleto**n:
A single instance is created once and shared for the entire application lifetime.

**Service Resolution
Constructor Injection:**
ASP.NET Core controllers and middleware use constructor injection. The DI container automatically resolves dependencies by examining the constructor parameters.

```typescript
public class HomeController : Controller
{
    private readonly IMyScopedService _scopedService;

    public HomeController(IMyScopedService scopedService)
    {
        _scopedService = scopedService;
    }
    
    public IActionResult Index()
    {
        // Use _scopedService for business logic
        return View();
    }
}
```

**3. Integration with the ASP.NET Core Pipeline
Middleware and DI
Middleware Registration:**
Middleware components can also use DI by defining constructor parameters for their dependencies.

```typescript
public class CustomMiddleware
{
    private readonly RequestDelegate _next;
    private readonly IMyService _myService;

    public CustomMiddleware(RequestDelegate next, IMyService myService)
    {
        _next = next;
        _myService = myService;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        _myService.PerformOperation();
        await _next(context);
    }
}

// In Startup.Configure:
public void Configure(IApplicationBuilder app)
{
    app.UseMiddleware<CustomMiddleware>();
    app.UseRouting();
    app.UseEndpoints(endpoints => endpoints.MapControllers());
}
```

**Integration with Framework Features
Controllers, Razor Pages, and SignalR:**
ASP.NET Core automatically injects dependencies into controllers, Razor pages, and hubs (SignalR) via constructor injection, leveraging the built-in DI container.

**4. Advanced Topics in ASP.NET Core DI
Open Generic Registrations
Definition:**
Registering open generic types allows you to register a generic service without specifying type parameters.

```typescript
services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
```
**Conditional and Named Registrations
Conditional Logic:**
Use conditional statements or factory delegates in ConfigureServices to register different implementations based on configuration or environment.

```typescript
bool useMock = Configuration.GetValue<bool>("UseMockService");
if (useMock)
{
    services.AddTransient<IMyService, MockService>();
}
else
{
    services.AddTransient<IMyService, RealService>();
}
```
**Lifetime and Disposal Management
Scope Disposal:**
Scoped services are disposed automatically at the end of the request. Singleton services are disposed when the application shuts down.
**
Asynchronous Disposal:**
The container in .NET 6+ supports IAsyncDisposable, ensuring that asynchronous resources are cleaned up properly.