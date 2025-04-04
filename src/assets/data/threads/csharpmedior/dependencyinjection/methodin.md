Method Injection is a dependency injection (DI) technique where dependencies are provided as parameters to a method rather than through a constructor or property. This approach allows a method to be supplied with the objects it needs to perform its function at the time it is called, offering flexibility for dependencies that are only required for specific operations.

---

## 1. Overview

### Definition
- **Method Injection:**  
  A technique where dependencies are passed directly to a method as arguments. Instead of having the dependency as part of the object's state, the dependency is supplied at the moment the method is executed.

### When to Use Method Injection
- **Optional or Context-Specific Dependencies:**  
  Use when a dependency is only needed for a particular operation rather than for the entire lifetime of the object.
- **Reducing Class Dependencies:**  
  Helps keep the overall object state lean by not storing dependencies that are only occasionally needed.
- **Improved Flexibility:**  
  Allows the caller to determine which implementation of a dependency to use on a per-call basis.

---

## 2. How It Works Under the Hood

### Execution Flow
- **Method Signature:**  
  The method defines parameters corresponding to the required dependencies.
- **Dependency Provision:**  
  The caller is responsible for supplying the necessary dependency at the time of the method call.
- **No State Persistence:**  
  Unlike constructor or property injection, the dependency is not stored as part of the object’s state—it exists only for the duration of the method execution.

### Example Mechanics
- When a method is called with injected parameters, those parameters are used to execute the method’s logic. Once the method returns, the injected dependency is no longer retained by the object.
- This model works well in scenarios where the dependency might vary between method calls or is only needed temporarily.

---

## 3. Implementation Example

### Scenario: Payment Processing with Optional Logging

Imagine a payment processing service where logging is only necessary during certain operations (e.g., for debugging or audit purposes). Rather than injecting a logger into the service's constructor (which might force every operation to include logging), you can inject the logger only when needed.

```typescript
public interface ILogger
{
    void Log(string message);
}

public class ConsoleLogger : ILogger
{
    public void Log(string message) => Console.WriteLine($"Log: {message}");
}

public class PaymentService
{
    // Method Injection: Logger is injected only for this method.
    public void ProcessPayment(decimal amount, ILogger logger)
    {
        // Perform payment processing logic.
        // Use the logger for this specific operation.
        logger.Log($"Processing payment of ${amount}");
        // Payment processing steps...
        logger.Log($"Payment of ${amount} processed successfully.");
    }
}

// Usage:
public class Program
{
    public static void Main()
    {
        PaymentService paymentService = new PaymentService();
        ILogger logger = new ConsoleLogger();

        // Logger is provided only for this call.
        paymentService.ProcessPayment(100.00m, logger);
    }
}
```

**Explanation
Flexibility:**
The ProcessPayment method can be called with different logger implementations as needed, or even with a "null" logger if logging is not required.

**No Persistent Dependency:**
The logger is not stored as a member of PaymentService. This avoids coupling the entire service to a particular logging implementation.

**4. Benefits and Drawbacks
Benefits
Fine-Grained Control:**
Dependencies can be provided only when needed, which reduces unnecessary coupling.

**Increased Flexibility:**
Callers can choose different implementations for each method call, making the behavior more dynamic.

**Simplicity in Certain Scenarios:**
Useful for one-off operations where the dependency doesn’t need to persist for the entire lifetime of the object.

**Drawbacks
Repetitive Code:**
If many methods require similar dependencies, it can lead to repetitive parameter lists.

**Inconsistent Usage:**
Overuse can lead to unclear contracts; it's sometimes harder to understand which dependencies are required for the class as a whole.

**Testing Complexity:**
Unit tests must now provide the dependency every time the method is called, which might complicate test setup if overused.