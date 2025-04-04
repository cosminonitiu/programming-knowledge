Although the terms are often used interchangeably, Inversion of Control (IoC) and Dependency Injection (DI) refer to related but distinct concepts in software design. Here’s an in-depth look at their differences, relationships, and how they are applied in C#.

---

## 1. Inversion of Control (IoC)

### Definition
- **Inversion of Control (IoC)** is a broader architectural principle where the control of objects or portions of a program is transferred to a container or framework. In an IoC scenario, the flow of control is inverted compared to traditional procedural programming, where instead of the application calling into reusable libraries, the framework calls into the application’s code.

### Key Characteristics
- **Decoupling Execution Flow:**  
  The framework or container dictates the flow, reducing direct dependencies between components.
- **Multiple Implementations:**  
  IoC can be achieved through various patterns such as Dependency Injection, Service Locator, Template Method, or Observer patterns.
- **Framework-Driven:**  
  Many modern frameworks (e.g., ASP.NET Core) are built on IoC principles, where the framework manages object lifetimes and execution flow.

### Examples in C#
- **Application Startup:**  
  In ASP.NET Core, the framework manages the application’s startup sequence, calling your configuration methods (like `ConfigureServices` and `Configure`) at the right time.
- **Event Handling:**  
  UI frameworks, such as WPF, use event-driven models where the framework invokes event handlers based on user interactions.

---

## 2. Dependency Injection (DI)

### Definition
- **Dependency Injection (DI)** is a specific design pattern and technique used to achieve IoC. It involves providing (or "injecting") an object's dependencies from an external source rather than having the object create them internally.

### Key Characteristics
- **Explicit Dependencies:**  
  Dependencies are declared (typically via constructors, properties, or methods), making them explicit and easier to manage.
- **Decoupling Components:**  
  DI allows classes to rely on abstractions (interfaces) rather than concrete implementations, improving modularity and testability.
- **Flexible Configuration:**  
  A DI container (or framework) can be used to wire up dependencies at runtime, supporting various lifetimes (e.g., transient, scoped, singleton).

### Examples in C#
- **Constructor Injection Example:**
```typescript
  public interface ILogger
  {
      void Log(string message);
  }

  public class ConsoleLogger : ILogger
  {
      public void Log(string message) => Console.WriteLine(message);
  }

  public class OrderService
  {
      private readonly ILogger _logger;

      // The dependency is injected via the constructor.
      public OrderService(ILogger logger)
      {
          _logger = logger;
      }

      public void ProcessOrder(int orderId)
      {
          _logger.Log($"Processing order {orderId}");
          // Additional order processing logic...
      }
  }
  ```

  Using a DI Container (ASP.NET Core example):

```typescript
public void ConfigureServices(IServiceCollection services)
{
    // Register services with different lifetimes.
    services.AddSingleton<ILogger, ConsoleLogger>();
    services.AddTransient<OrderService>();
}
```

**3. How IoC and DI Relate
Relationship
IoC as a Principle:**
Inversion of Control is the overarching principle that shifts the responsibility of controlling program flow and object creation from the application code to an external entity (like a framework or container).

**DI as an Implementation of IoC:**
Dependency Injection is one of the most popular and effective ways to implement IoC. By injecting dependencies from the outside, DI achieves the inversion where the class is no longer responsible for creating its own dependencies.

**Differences
Scope:**

**IoC**: A broad design principle that can be implemented in various ways (DI, Service Locator, etc.).

**DI**: A specific pattern that injects dependencies, making them explicit and configurable.

**Usage:**
DI is the most common and recommended way to achieve IoC in modern applications, especially when using frameworks like ASP.NET Core.