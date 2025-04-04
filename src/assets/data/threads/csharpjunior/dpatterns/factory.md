## 1. Overview

### Definition
- **Factory Method Pattern:**  
  A design pattern that defines an interface for creating an object, but lets subclasses decide which class to instantiate. It encapsulates object creation, allowing the code that uses the object to remain independent of its concrete class.

### Purpose and Benefits
- **Decoupling:**  
  Separates the creation logic from usage, reducing dependencies between classes.
- **Flexibility:**  
  Allows for dynamic selection of the object type at runtime based on input, configuration, or context.
- **Extensibility:**  
  Adding new types does not require changes in the client code, only in the subclasses that implement the factory method.

---

## 2. How It Works Under the Hood

### Key Components
- **Creator (Abstract Class or Interface):**  
  Declares the factory method, which returns an object of type Product. It may also define a default implementation of the factory method.
- **Concrete Creator:**  
  Implements the factory method to create and return instances of ConcreteProduct.
- **Product (Abstract Class or Interface):**  
  Defines the interface for objects the factory method creates.
- **Concrete Product:**  
  Implements the Product interface. Different concrete creators produce different concrete products.

### Internal Mechanism
- **Encapsulation of Object Creation:**  
  The Factory Method Pattern encapsulates the instantiation process inside a method. Instead of using `new` directly in client code, the client calls the factory method.
- **Dynamic Binding:**  
  The actual type of object created is determined at runtime by the concrete creator class, enabling polymorphism.
- **Lazy Instantiation:**  
  Often used to delay object creation until it is needed, thereby potentially improving performance and resource utilization.

### Diagram
Creator
     │
     ├── FactoryMethod() : Product
     │
     └── ConcreteCreatorA  ConcreteCreatorB
           │                      │
   FactoryMethod() : ConcreteProductA   FactoryMethod() : ConcreteProductB
           │                      │
         Product               Product

---

## 3. Real-World Use Cases

### Example 1: Document Generation System
- **Scenario:**  
  In a document generation system, you might need to create different types of documents (e.g., PDF, Word, HTML) based on user input or configuration.
- **Application:**  
  Define an abstract Document class with a method for rendering the document. Concrete document classes (PDFDocument, WordDocument, HTMLDocument) implement the rendering logic. The factory method in a DocumentCreator subclass instantiates the appropriate document type based on configuration or input.

### Example 2: Logging Framework
- **Scenario:**  
  A logging framework may support multiple output targets (e.g., console, file, database). The factory method can be used to create the appropriate logger.
- **Application:**  
  An abstract Logger class defines a method for logging messages. Concrete loggers (ConsoleLogger, FileLogger, DatabaseLogger) implement this method. A LoggerFactory creates the correct logger instance based on configuration.

---

## 4. C# Implementation Example

### Abstract Creator and Product
```typescript
// Product Interface
public interface IShape
{
    void Draw();
}

// Concrete Products
public class Circle : IShape
{
    public void Draw() => Console.WriteLine("Drawing a Circle.");
}

public class Square : IShape
{
    public void Draw() => Console.WriteLine("Drawing a Square.");
}

// Creator Abstract Class
public abstract class ShapeFactory
{
    // Factory Method
    public abstract IShape CreateShape();

    // An example of a template method that uses the factory method
    public void RenderShape()
    {
        IShape shape = CreateShape();
        shape.Draw();
    }
}
```

**Concrete Creator Implementations**
```typescript
public class CircleFactory : ShapeFactory
{
    public override IShape CreateShape() => new Circle();
}

public class SquareFactory : ShapeFactory
{
    public override IShape CreateShape() => new Square();
}
```
**Client Code Usage**
```typescript
public class Client
{
    public static void Main()
    {
        ShapeFactory circleFactory = new CircleFactory();
        circleFactory.RenderShape();  // Outputs: Drawing a Circle.

        ShapeFactory squareFactory = new SquareFactory();
        squareFactory.RenderShape();  // Outputs: Drawing a Square.
    }
}
```
**Explanation**:
**Abstraction**:
The ShapeFactory abstracts the process of creating shapes.

**Flexibility**:
The client code does not need to know the details of which shape is being created, just that it adheres to the IShape interface.

**Extensibility**:
To add a new shape, simply implement a new product and a corresponding concrete factory without modifying the client code.

**5. Singleton and Factory Method in .NET
Usage in .NET Framework
System.IO.Path and Environment Classes:**
The .NET Framework often uses factory methods for creating objects based on configuration or environment conditions. For instance, methods in classes like System.IO.Path or logging frameworks may use factory methods to return the correct implementation based on runtime parameters.

**Integration with DI:**
While many modern applications use Dependency Injection (DI) to handle object creation, the Factory Method Pattern still plays a role in scenarios where object creation needs to be abstracted and deferred.

**6. Best Practices and Interview Tips
Best Practices:**
**Define Clear Contracts:**
Clearly define the Product interface and ensure all Concrete Products adhere to it.

**Keep Creator and Product Coherent:**
Ensure that the creator class and the products it creates are logically related. Avoid using factory methods for unrelated object creation.

**Use Factories for Complexity:**
Employ the Factory Method Pattern when object creation is complex or when different conditions might lead to different types of objects.

**Consider Combining Patterns:**
In some scenarios, the Factory Method Pattern may be combined with other creational patterns like Abstract Factory or Builder to handle complex object creation logic.

**Interview Tips:
Explain the Benefits:**
Be ready to discuss how the Factory Method Pattern promotes loose coupling, makes code more maintainable, and facilitates easier testing.

**Discuss Thread-Safety and Singleton Interaction:**
Some implementations require thread-safe instantiation (e.g., if the factory holds state). Explain how you might integrate Singleton behavior if a global factory instance is needed.

**Real-World Examples:**
Provide concrete examples (e.g., a logging system or document generation) to illustrate when and why you would use this pattern.