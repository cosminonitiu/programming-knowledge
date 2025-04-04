## 1. Definition and Key Concepts

### What is Property Injection?
- **Definition:**  
  Property Injection involves exposing dependencies as public properties with setters. The DI container (or calling code) sets these properties after the object is created.
- **Core Idea:**  
  Instead of requiring all dependencies at the time of construction (as in constructor injection), the class can be instantiated first and have its dependencies assigned later.

### When to Use Property Injection
- **Optional Dependencies:**  
  When a dependency is optional or can change over the lifetime of an object.
- **Circular Dependencies:**  
  When constructor injection would cause a circular dependency, property injection can be used as a workaround.
- **Configuration and Flexibility:**  
  When you want to allow the possibility to change the dependency after object creation (e.g., swapping out a logging strategy).

---

## 2. How It Works Under the Hood

### Lifecycle and Assignment
- **Object Creation:**  
  The object is first instantiated using a parameterless constructor or a constructor that does not require all dependencies.
- **Dependency Assignment:**  
  The DI container or manual setup then assigns the required dependencies to the object's properties.
- **Deferred Binding:**  
  This approach allows the dependencies to be set or updated after the object has been constructed, providing additional flexibility.

### Thread Safety and Mutability
- **Thread Safety Concerns:**  
  Since properties can be set at any time, care must be taken to ensure that properties are not modified concurrently or unexpectedly, especially in multi-threaded scenarios.
- **Mutable Dependencies:**  
  The injected dependencies may be replaced or modified, which can be beneficial in some cases but might also lead to issues if not managed carefully.

---

## 3. Implementation Example

### Example Scenario: Logging Dependency
Imagine an application service that requires a logger. With property injection, you can set the logger dependency after constructing the service.
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
    // Dependency is provided via a public property.
    public ILogger Logger { get; set; }

    public void ProcessOrder(int orderId)
    {
        // Use the injected logger if available.
        Logger?.Log($"Processing order {orderId}");
        // Order processing logic...
    }
}
```

Usage Example:
```typescript
public class Program
{
    public static void Main()
    {
        // Create the service without immediately providing a logger.
        OrderService orderService = new OrderService();
        
        // Later, inject the dependency via property injection.
        orderService.Logger = new ConsoleLogger();
        
        // Process an order; the logger will now log the message.
        orderService.ProcessOrder(123);
    }
}
```

**4. Benefits and Drawbacks
Benefits
Flexibility:**
Allows setting or updating dependencies after object construction.

**Handling Optional Dependencies:**
Ideal for dependencies that are optional or might have sensible defaults.

**Resolving Circular Dependencies:**
Can be used to break circular dependencies that cannot be resolved through constructor injection.

**Drawbacks
Visibility of Dependencies:**
Dependencies are less explicit compared to constructor injection, which may lead to confusion about the required dependencies for the class.

**Risk of Uninitialized Properties:**
The consumer of the class must remember to set the properties; otherwise, the class may operate with null dependencies.

**Thread Safety:**
Additional care is needed in multi-threaded contexts, as properties can be set or modified after construction.