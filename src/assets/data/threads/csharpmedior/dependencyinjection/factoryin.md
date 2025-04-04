## 1. Overview

### What is Factory Injection?
- **Definition:**  
  Factory Injection involves supplying a class with a factory object or a delegate that creates instances of a dependency. This allows the class to obtain new instances as required, rather than receiving a single pre-constructed instance.
  
- **Key Objectives:**
  - **Lazy Instantiation:**  
    Objects are created only when needed.
  - **Decoupling:**  
    The class does not need to know about the concrete implementation details of the dependency; it only interacts with the factory’s interface or delegate.
  - **Dynamic Configuration:**  
    Factories can decide at runtime which implementation to create based on parameters or contextual information.

### Relationship with Other DI Techniques
- Factory Injection is often used in conjunction with constructor or property injection. Mandatory dependencies can be injected directly, while factories are used for creating transient or dynamically configured objects.
- It provides an abstraction over object creation, similar in spirit to the Factory Method Pattern, but in the context of DI.

---

## 2. How It Works Under the Hood

### The Factory as a Dependency
- **Factory Interface/Delegate:**  
  The factory is defined either as an interface (e.g., `IWidgetFactory` with a method `CreateWidget()`) or as a delegate (e.g., `Func<IWidget>`). This factory is injected into the dependent class.
  
- **Dynamic Object Creation:**  
  The dependent class calls the factory method whenever it needs a new instance of the dependency. The factory encapsulates the logic for creating the object, which may include configuration, caching, or complex instantiation logic.

### Deferred Creation
- **Lazy Evaluation:**  
  The dependency is not created until the factory method is invoked, allowing for deferred execution and reducing the upfront cost of object creation.
  
- **Runtime Decision-Making:**  
  The factory can determine the appropriate object to create based on runtime information, making the system more flexible and adaptable to changing requirements.

---

## 3. Real-World Use Cases

### Scenario 1: Transient Services in a DI Container
- **Example:**  
  When a service requires a new instance of a dependency each time a method is called (e.g., generating unique identifiers, session objects, or short-lived database connections), injecting a factory allows the service to create fresh instances on demand.

### Scenario 2: Parameterized Object Creation
- **Example:**  
  In a reporting system, you might have different report generators that require various parameters (like report type, format, or data source). A factory can be injected to create the appropriate report generator based on the input parameters provided at runtime.

### Scenario 3: Avoiding Heavy Initialization in Constructors
- **Example:**  
  For objects that are expensive to create or depend on dynamic configuration, using a factory delays instantiation until the object is actually needed, thereby improving application startup time and resource usage.

---

## 4. C# Implementation Example

### Using a Factory Interface
```typescript
// Define the product interface.
public interface IWidget
{
    void Display();
}

// A concrete implementation of IWidget.
public class Widget : IWidget
{
    private readonly string _name;
    public Widget(string name)
    {
        _name = name;
    }
    public void Display() => Console.WriteLine($"Displaying widget: {_name}");
}

// Define a factory interface for creating IWidget instances.
public interface IWidgetFactory
{
    IWidget CreateWidget(string name);
}

// Concrete factory implementation.
public class WidgetFactory : IWidgetFactory
{
    public IWidget CreateWidget(string name)
    {
        // Complex creation logic can be placed here.
        return new Widget(name);
    }
}

// A client class that depends on a factory.
public class WidgetService
{
    private readonly IWidgetFactory _factory;

    // The factory is injected via the constructor.
    public WidgetService(IWidgetFactory factory)
    {
        _factory = factory;
    }

    public void ShowWidget(string name)
    {
        // Create a widget on demand.
        IWidget widget = _factory.CreateWidget(name);
        widget.Display();
    }
}

// Usage:
public class Program
{
    public static void Main()
    {
        IWidgetFactory factory = new WidgetFactory();
        WidgetService service = new WidgetService(factory);
        service.ShowWidget("MyWidget");
    }
}
```

**Using a Delegate (Func<T>)**
```typescript
// The product interface.
public interface IReport
{
    void Generate();
}

// A concrete report implementation.
public class SalesReport : IReport
{
    public void Generate() => Console.WriteLine("Generating sales report...");
}

// A client class that uses a delegate to create reports.
public class ReportService
{
    // Dependency is injected as a factory delegate.
    private readonly Func<IReport> _reportFactory;

    public ReportService(Func<IReport> reportFactory)
    {
        _reportFactory = reportFactory;
    }

    public void RunReport()
    {
        IReport report = _reportFactory();
        report.Generate();
    }
}

// Usage:
public class Program
{
    public static void Main()
    {
        // Inject the factory delegate that creates a SalesReport.
        ReportService service = new ReportService(() => new SalesReport());
        service.RunReport();
    }
}
```
**5. Best Practices and Considerations
Best Practices**
**Explicit Factory Interfaces vs. Delegates:**
Use explicit factory interfaces when the object creation logic is complex or when multiple methods are required. Use delegate-based factories (e.g., Func<T>) for simple, straightforward instantiation.

**Separation of Concerns:**
Ensure that the responsibility for object creation remains separate from the business logic. The client should only call the factory without knowing the underlying construction details.

**Lazy Instantiation:**
Use Factory Injection to delay object creation until necessary, which can improve performance and resource utilization.

**Document Dependencies:**
Clearly document when a dependency is provided via a factory, so that maintainers understand that the dependency is created on demand.

**Considerations
Overhead:**
There is minimal overhead associated with calling a factory method compared to direct instantiation, but the benefits in flexibility and decoupling often outweigh this cost.

**Error Handling:**
Ensure that the factory methods handle errors gracefully and provide meaningful feedback if object creation fails.

**Testing:**
Factory Injection enhances testability by allowing you to easily substitute factories with mocks or stubs that create controlled instances.