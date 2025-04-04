# Container Configuration in Dependency Injection

Container configuration is the process of setting up and customizing a Dependency Injection (DI) container to manage the creation, lifetime, and dependencies of objects in your application. In .NET, container configuration plays a central role in establishing a clean, decoupled architecture and is usually done in a centralized location (often called the composition root). This guide details various aspects of container configuration, from basic registrations to advanced scenarios.

---

### **Key Components:**

- **`IServiceCollection`**: A container that holds the registrations of services, i.e., how services are created and managed. You register services in `ConfigureServices` method in `Startup.cs` or `Program.cs`.
- **`IServiceProvider`**: An interface responsible for resolving the dependencies at runtime. The `IServiceProvider` is used to instantiate objects from the registered services. It's created by calling `BuildServiceProvider()` on an `IServiceCollection`. These instances can be injected into other services resolved from the same dependency injection container.
- **Service Descriptors**: These are created when you register services into the `IServiceCollection`. A service descriptor contains information about the service type, implementation, and its lifecycle (e.g., singleton, scoped, transient).
- After populating the IServiceCollection with ServiceDescriptors for all of our services, the next phase is to create an IServiceProvider. The service provider will be capable of resolving instances of the types needed by our application. It essentially wraps the contains the knowledge represented in the IServiceCollection.

This stage is achieved by calling BuildServiceProvider, another extension method on the IServiceCollection.

**`var`** `serviceCollection = **new**` `ServiceCollection();`

`serviceCollection.AddSingleton<ClassA>();`

`serviceCollection.AddSingleton<IThing, ClassB>();`

**`var`** `serviceProvider = serviceCollection.BuildServiceProvider();`

var myClass = serviceProvider.GetService<ClassA>();  // Resolves ClassA instance

## 1. Basic Service Registration

### Registering Services
- **Transient:**  
  A new instance is created every time the service is requested.
```typescript
  services.AddTransient<IMyService, MyService>();```

**Scoped:**
A single instance is created per scope (e.g., per HTTP request in web applications).

```typescript
services.AddScoped<IMyService, MyService>();```
**Singleton:**
A single instance is created and shared throughout the application’s lifetime.

```typescript
services.AddSingleton<IMyService, MyService>();
```
**Registration in ASP.NET Core**
**Composition Root:**
In ASP.NET Core, service registrations are typically performed in the ConfigureServices method of Startup.cs.

```typescript
public void ConfigureServices(IServiceCollection services)
{
    services.AddControllers();
    services.AddTransient<IMyService, MyService>();
    services.AddScoped<IOtherService, OtherService>();
    services.AddSingleton<ILogger, ConsoleLogger>();
}
```

**2. Advanced Service Registration Techniques
Open Generic Registrations**
Description:
Registering services for generic types without specifying the type parameters.

```typescript
services.AddTransient(typeof(IRepository<>), typeof(Repository<>));
```

**Conditional Registrations
Scenario:**
Register different implementations based on runtime conditions or configuration settings.

**Example:**
Use factory delegates or extension methods to conditionally register services.

```typescript
if (useMock)
{
    services.AddTransient<IMyService, MyServiceMock>();
}
else
{
    services.AddTransient<IMyService, MyService>();
}
```

**Using Factory Delegates
Custom Instantiation Logic:**
Sometimes, creating a service may involve complex logic or require parameters from configuration. A factory delegate can be used to control instantiation.

```typescript
services.AddTransient<IMyService>(provider =>
{
    var config = provider.GetRequiredService<IConfiguration>();
    var setting = config.GetValue<string>("MySetting");
    return new MyService(setting);
});
```

**Assembly Scanning
Automatic Registration:**
Many third-party DI containers (e.g., Autofac) offer assembly scanning, which automatically registers types based on conventions. Although the built-in container does not provide native scanning, you can extend it using community libraries or custom extensions.

```typescript
// Example using a community extension for IServiceCollection:
services.Scan(scan => scan
    .FromAssemblyOf<SomeType>()
    .AddClasses(classes => classes.AssignableTo<IMyService>())
    .AsImplementedInterfaces()
    .WithTransientLifetime());
```

**3. Managing Service Lifetimes and Scopes
Understanding Lifetimes
Transient:**
Use for lightweight, stateless services.

**Scoped:**
Ideal for services that should be unique per logical operation, such as per web request.
**
Singleton:**
Best for stateful services that are expensive to create or that manage global state, but be cautious with thread safety.

**Creating Child Scopes
Purpose:**
In non-web applications or in advanced scenarios, you might need to create nested scopes to manage lifetimes of objects that should be disposed together.

```typescript
using (var scope = serviceProvider.CreateScope())
{
    var service = scope.ServiceProvider.GetRequiredService<IMyService>();
    // Use the service within this scope
}
```

**Disposal of Services
Automatic Disposal:**
The DI container takes responsibility for disposing of services that implement IDisposable (or IAsyncDisposable) when their scope ends, especially for scoped and singleton services.

**4. Advanced Configuration in Third-Party DI Containers
Features Beyond the Built-In Container
Interception and AOP:**
Containers like Autofac or Castle Windsor support interception, allowing you to inject cross-cutting concerns (logging, caching) transparently.

**Property Injection:**
Some containers offer property injection, enabling dependencies to be set on public properties.

**Module and Convention-Based Registration:**
These features help to organize registrations in a modular way and reduce boilerplate code.

Example with Autofac
```typescript
var builder = new ContainerBuilder();

// Register by scanning an assembly
builder.RegisterAssemblyTypes(typeof(SomeType).Assembly)
       .Where(t => t.Name.EndsWith("Service"))
       .AsImplementedInterfaces();

// Register open generic types
builder.RegisterGeneric(typeof(Repository<>))
       .As(typeof(IRepository<>))
       .InstancePerLifetimeScope();

var container = builder.Build();

// Resolving services using Autofac's scope
using (var scope = container.BeginLifetimeScope())
{
    var service = scope.Resolve<IMyService>();
    service.DoWork();
}
```