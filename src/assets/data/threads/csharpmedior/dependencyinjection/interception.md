Interception and Decorators are advanced techniques used in .NET to extend or modify the behavior of objects without changing their code. They are especially useful for implementing cross-cutting concerns such as logging, caching, validation, and authorization. Although similar in their goal of augmenting functionality, they differ in their implementation and use cases.

---

## 1. Interception

### What is Interception?
- **Definition:**  
  Interception is the process by which method calls to an object are intercepted (or "wrapped") at runtime, allowing additional behavior to be executed before, after, or even instead of the original method.
- **Mechanism:**  
  Typically achieved using dynamic proxies that wrap the target object. The DI container or a third-party library (such as Castle DynamicProxy, Autofac’s interception features, or Unity Interception) generates a proxy at runtime. This proxy intercepts calls, applies additional logic, and then forwards the call to the actual implementation.

### How It Works Under the Hood
- **Dynamic Proxy Generation:**  
  The DI container creates a proxy that implements the same interface (or inherits from the same base class) as the target object. When a method is called, the proxy intercepts the call.
- **Invocation Pipeline:**  
  The intercepted call passes through an invocation pipeline where custom behaviors (such as logging, caching, or security checks) are applied. Each interceptor has the opportunity to execute code before and/or after the target method invocation.
- **Continuation:**  
  After processing the interceptors, the proxy calls the actual method on the target object, and once it returns, the interceptors can process the return value or handle exceptions.

  ### Use Cases for Interception
- **Cross-Cutting Concerns:**  
  Implement logging, caching, performance monitoring, and security without modifying business logic.
- **AOP (Aspect-Oriented Programming):**  
  Separate cross-cutting concerns from core business logic.
- **Conditional Behavior:**  
  Apply additional behavior based on runtime context or configuration.

### Example (Using Autofac Interceptors)
```typescript
public interface ICalculator
{
    int Add(int x, int y);
}

public class Calculator : ICalculator
{
    public int Add(int x, int y)
    {
        return x + y;
    }
}

public class LoggingInterceptor : IInterceptor
{
    public void Intercept(IInvocation invocation)
    {
        Console.WriteLine($"Calling method {invocation.Method.Name} with arguments {string.Join(", ", invocation.Arguments)}");
        invocation.Proceed(); // Call the original method.
        Console.WriteLine($"Method {invocation.Method.Name} returned {invocation.ReturnValue}");
    }
}

// Registration using Autofac:
var builder = new ContainerBuilder();
builder.RegisterType<Calculator>().As<ICalculator>()
       .EnableInterfaceInterceptors()
       .InterceptedBy(typeof(LoggingInterceptor));
builder.RegisterType<LoggingInterceptor>();
var container = builder.Build();

using (var scope = container.BeginLifetimeScope())
{
    var calc = scope.Resolve<ICalculator>();
    var result = calc.Add(5, 7);
}
```

**2. Decorators
What is a Decorator?
Definition:**
The Decorator Pattern is a structural design pattern that allows behavior to be added to individual objects dynamically by wrapping them with a decorator class. Each decorator implements the same interface as the component it wraps.

**Mechanism:**
The decorator holds a reference to the original object and delegates calls to it while adding its own behavior before or after the delegated call.

**How It Works Under the Hood
Wrapper Classes:**
A decorator class wraps a concrete implementation. The client interacts with the decorator through a common interface. The decorator may add functionality or modify behavior before passing calls to the underlying object.

**Chaining:**
Multiple decorators can be layered. Each decorator adds its behavior, forming a chain of responsibility where each layer has the opportunity to act on the method call.

**Static vs. Dynamic:**
Unlike dynamic interception (which is usually handled at runtime by a proxy), decorators are often implemented as concrete classes that wrap the target object explicitly.

**Use Cases for Decorators**
**Extending Functionality:**
Add features (e.g., caching, logging, or validation) to an object without modifying its code.

**Flexible Composition:**
Compose behaviors dynamically by wrapping objects with multiple decorators.
**
Enhancing Third-Party Components:**
Add behavior to components for which you do not have the source code.

```typescript
public interface INotifier
{
    void Send(string message);
}

public class EmailNotifier : INotifier
{
    public void Send(string message)
    {
        Console.WriteLine($"Sending Email: {message}");
    }
}

// Decorator Base Class
public abstract class NotifierDecorator : INotifier
{
    protected readonly INotifier _notifier;

    protected NotifierDecorator(INotifier notifier)
    {
        _notifier = notifier;
    }

    public virtual void Send(string message)
    {
        _notifier.Send(message);
    }
}

// Concrete Decorator for SMS
public class SMSNotifierDecorator : NotifierDecorator
{
    public SMSNotifierDecorator(INotifier notifier) : base(notifier) { }

    public override void Send(string message)
    {
        base.Send(message);
        Console.WriteLine($"Sending SMS: {message}");
    }
}

// Concrete Decorator for Facebook Notification
public class FacebookNotifierDecorator : NotifierDecorator
{
    public FacebookNotifierDecorator(INotifier notifier) : base(notifier) { }

    public override void Send(string message)
    {
        base.Send(message);
        Console.WriteLine($"Sending Facebook message: {message}");
    }
}

// Usage:
public class Program
{
    public static void Main()
    {
        INotifier notifier = new EmailNotifier();
        // Wrap with SMS decorator.
        notifier = new SMSNotifierDecorator(notifier);
        // Further wrap with Facebook decorator.
        notifier = new FacebookNotifierDecorator(notifier);

        // When Send is called, all decorators add their behavior.
        notifier.Send("Hello, world!");
    }
}
```

**3. Interception vs. Decorators: Comparison and Complementarity
Interception:

Dynamic:**
Achieved at runtime via dynamic proxies.

**Centralized:**
Often configured through DI containers, allowing cross-cutting concerns to be applied without modifying the code.

**Ideal for:**
Logging, caching, security checks, and other aspects where behavior should be applied uniformly across many components.

**Decorators:

Static:**
Implemented as explicit wrapper classes.

**Granular Control:**
Decorators are applied explicitly and can be composed in a chain.

**Ideal for:**
Adding or overriding behavior on a per-object basis, especially when design clarity and explicit composition are needed.

**Complementary Usage:**
In some cases, both patterns can be used together. For example, a DI container might use interception to inject logging behavior while developers use decorators to provide additional behavior to specific objects.