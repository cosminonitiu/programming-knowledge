**Dependency Injection (DI)** is a design pattern and technique in software development that enables the decoupling of components by injecting an object's dependencies from the outside, rather than having the object create or obtain them itself. This means that instead of a class instantiating its own dependencies internally, those dependencies are provided (or "injected") by an external entity, such as a DI container or framework.

## Key Aspects of Dependency Injection

- **Inversion of Control (IoC):**  
  DI is a specific form of Inversion of Control. Instead of a class controlling its own dependencies, control is inverted: the responsibility for providing dependencies is delegated to an external mechanism.

- **Loose Coupling:**  
  By removing the responsibility of dependency creation from the class itself, components become more modular and easier to test. Classes depend on abstractions (usually interfaces) rather than concrete implementations.

- **Improved Testability:**  
  Since dependencies are injected, it becomes easier to substitute them with mock or stub implementations during unit testing. This leads to more maintainable and reliable code.

- **Flexibility and Configurability:**  
  DI enables the configuration of components at runtime, allowing different implementations of a dependency to be used based on the environment, configuration settings, or other criteria.

## How Dependency Injection Works

1. **Dependency Declaration:**  
   A class declares its dependencies (usually via its constructor, properties, or methods).

2. **Injection:**  
   An external entity (often a DI container) creates and supplies the required dependencies when instantiating the class.

3. **Usage:**  
   The class uses the injected dependencies to perform its functions without being concerned about their creation or lifecycle management.

## Example Scenario

Imagine you have an `OrderService` that needs to log its activities. Instead of creating a `Logger` instance internally, the `OrderService` declares a dependency on an `ILogger` interface:

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

    // Dependency is injected through the constructor.
    public OrderService(ILogger logger)
    {
        _logger = logger;
    }

    public void ProcessOrder(int orderId)
    {
        _logger.Log($"Processing order {orderId}");
        // Order processing logic...
    }
}
```

In a DI container (e.g., Microsoft.Extensions.DependencyInjection), you would register these services and let the container resolve OrderService with the appropriate ILogger implementation:

```typescript
var services = new ServiceCollection();
services.AddSingleton<ILogger, ConsoleLogger>();
services.AddTransient<OrderService>();

// Build the service provider and resolve OrderService.
var serviceProvider = services.BuildServiceProvider();
var orderService = serviceProvider.GetService<OrderService>();

orderService.ProcessOrder(123);
```
This approach ensures that OrderService remains agnostic about how its dependencies are constructed, making the code easier to manage, test, and extend.