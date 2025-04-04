### **3. Polymorphism**

**Polymorphism** allows objects of different types to be treated as objects of a common base type. The most common form of polymorphism in .NET is **method overriding** and **method overloading**.

- **Method Overloading**: Multiple methods in the same class with the same name but different parameters.
- **Method Overriding**: A derived class provides a specific implementation of a method that is already defined in its base class.

Polymorphism is achieved through **virtual**, **override**, and **new** keywords.

### **Key Concepts of Polymorphism:**

- **Method Overloading**: Allows defining multiple methods with the same name, but with different parameters (number or type of parameters).
- **Method Overriding**: A derived class can provide its own implementation of a method defined in the base class.

### **Example of Polymorphism in .NET (Method Overriding):**

```typescript
// Base class (Parent class)
public class Animal
{
    public virtual void MakeSound()
    {
        Console.WriteLine("Some generic animal sound.");
    }
}

// Derived class (Child class)
public class Dog : Animal
{
    public override void MakeSound()  // Overriding the base class method
    {
        Console.WriteLine("Bark");
    }
}

public class Program
{
    public static void Main(string[] args)
    {
        Animal animal = new Animal();
        animal.MakeSound();  // Output: Some generic animal sound.

        Dog dog = new Dog();
        dog.MakeSound();     // Output: Bark

        // Polymorphic behavior
        Animal polymorphicDog = new Dog();
        polymorphicDog.MakeSound(); // Output: Bark
    }
}

```

In this example:

- The `MakeSound()` method in the `Animal` class is marked as `virtual`, allowing it to be overridden by the derived class `Dog`.
- The `Dog` class overrides the `MakeSound()` method to provide a specific implementation.
- Polymorphism is demonstrated when an `Animal` reference is used to hold a `Dog` object, and the overridden method is called.

## 1. Understanding Polymorphism

### Definition
- **Polymorphism** means "many forms". In C#, it enables objects of different classes to be treated through a common interface, typically via a base class or interface.
- **Runtime (Dynamic) Polymorphism:**  
  Achieved through method overriding and dynamic binding. The decision about which method to call is made at runtime based on the actual object's type, not the reference type.

---

## 2. Key Mechanisms in C# Polymorphism

### Virtual Methods and Overriding
- **Virtual Methods:**  
  Methods in a base class marked with the `virtual` keyword can be overridden by derived classes.
  
- **Overriding Methods:**  
  Derived classes override virtual methods using the `override` keyword. This allows a derived class to provide a specific implementation while maintaining the same method signature.
  
- **Dynamic Binding:**  
  When a method is marked virtual, C# uses a virtual method table (vtable) to resolve the call at runtime. The vtable holds pointers to the actual implementations of the virtual methods.
  
**Example:**
```typescript
public class Animal
{
    public virtual void Speak()
    {
        Console.WriteLine("Animal sound");
    }
}

public class Dog : Animal
{
    public override void Speak()
    {
        Console.WriteLine("Bark");
    }
}

public class Cat : Animal
{
    public override void Speak()
    {
        Console.WriteLine("Meow");
    }
}

public void MakeAnimalSpeak(Animal animal)
{
    // The call to Speak() is resolved at runtime based on the actual object type.
    animal.Speak();
}

// Usage:
Animal myDog = new Dog();
Animal myCat = new Cat();
MakeAnimalSpeak(myDog); // Outputs: Bark
MakeAnimalSpeak(myCat); // Outputs: Meow
```

**Interfaces and Polymorphism
Interfaces:**
Interfaces define contracts that classes can implement. A class that implements an interface guarantees that it provides implementations for the interface’s members.

**Multiple Interface Implementations:**
A class can implement multiple interfaces, allowing for more flexible design and multiple inheritance of behavior.

Example:

```typescript
public interface IShape
{
    double GetArea();
}

public class Circle : IShape
{
    public double Radius { get; set; }
    public double GetArea() => Math.PI * Radius * Radius;
}

public class Rectangle : IShape
{
    public double Width { get; set; }
    public double Height { get; set; }
    public double GetArea() => Width * Height;
}

public void DisplayArea(IShape shape)
{
    Console.WriteLine($"Area: {shape.GetArea()}");
}

// Usage:
IShape circle = new Circle { Radius = 5 };
IShape rectangle = new Rectangle { Width = 4, Height = 6 };
DisplayArea(circle);    // Outputs the area of the circle
DisplayArea(rectangle); // Outputs the area of the rectangle
```

**Explicit Interface Implementation**
Purpose:
Allows a class to implement interface members in a way that they are only accessible through the interface reference, avoiding naming conflicts or exposing implementation details.

Example:

```typescript
public interface ILogger
{
    void Log(string message);
}

public class FileLogger : ILogger
{
    // Explicit interface implementation
    void ILogger.Log(string message)
    {
        // Log message to file
        Console.WriteLine($"Logging to file: {message}");
    }
}

// Usage:
ILogger logger = new FileLogger();
logger.Log("Test message"); // Works as expected.
// FileLogger fileLogger = new FileLogger();
// fileLogger.Log("Test message"); // Error: Log is not accessible through the class instance.
```

**. Advanced Concepts in Runtime Polymorphism
Virtual Method Table (vtable)
Mechanism:**

Each class with virtual methods maintains a vtable, a lookup table that maps virtual method calls to the correct function implementations.

When a method call is made on a base class reference, the runtime checks the vtable of the actual object to resolve the correct override.

**Implication:
**
The vtable mechanism enables polymorphism but may introduce a slight overhead compared to non-virtual calls. However, this overhead is generally negligible compared to the benefits of flexibility and extensibility.

**Late Binding and Dynamic Dispatch
Dynamic Dispatch:**

Virtual and overridden methods enable late binding, where the method to invoke is determined at runtime rather than compile-time.

**dynamic Keyword:**
C# supports dynamic binding with the dynamic keyword, which bypasses compile-time type checking. While powerful, it should be used sparingly due to potential runtime errors and performance costs.

Example:

```typescript
dynamic animal = new Dog();
animal.Speak(); // Resolved at runtime; outputs: Bark
```

**Polymorphic Collections and Covariance/Contravariance
Collections:**
You can store objects of derived types in a collection of base type, enabling polymorphic behavior.
**
Covariance and Contravariance:
**
Covariance: Allows you to use a more derived type than originally specified. For example, an IEnumerable<Dog> can be assigned to an IEnumerable<Animal>.

Contravariance: Allows you to use a less derived type than originally specified, commonly seen with delegates.

Example of Covariance:

```typescript
IEnumerable<Dog> dogs = new List<Dog> { new Dog(), new Dog() };
IEnumerable<Animal> animals = dogs; // Covariance in action
```

**4. Best Practices and Interview Tips
Best Practices:**
**Use Virtual Methods Judiciously:**
Only mark methods as virtual if you intend to allow overriding. Excessive use can lead to complex hierarchies and maintenance challenges.

**Prefer Composition Over Inheritance:**
When possible, favor composition to create flexible designs that reduce tight coupling.

**Immutable Designs:**
Combine polymorphism with immutability to design safer, thread-safe objects.

**Clear Documentation:**
Document overridden methods and inheritance hierarchies to make your design choices clear.

**Interview Tips:**
**Be Ready to Explain the vtable Mechanism:**
Understand how the virtual method table works, and be prepared to discuss its impact on performance.

**Discuss Real-World Scenarios:**
Provide examples of how polymorphism improves code maintainability, testability, and scalability in actual projects.

**Highlight Design Trade-offs:**
Talk about when to use inheritance versus composition, and discuss the implications of using polymorphism in large systems.

**Showcase Your Knowledge of Covariance/Contravariance:**
Explain how these concepts apply to collections, delegates, and interfaces in C#.

**Demonstrate Practical Code Examples:**
Be prepared to write or analyze code that uses polymorphism, including virtual method overrides, interface implementations, and dynamic binding with the dynamic keyword.