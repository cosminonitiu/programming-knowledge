Covariance for arrays enables implicit conversion of an array of a more derived type to an array of a less derived type. But this operation is not type safe, as shown in the following code example.

```typescript
object[] array = new String[10];
// The following statement produces a run-time exception.
// array[0] = 10;
```

Covariance and contravariance support for method groups allows for matching method signatures with delegate types. This enables you to assign to delegates not only methods that have matching signatures, but also methods that return more derived types (covariance) or that accept parameters that have less derived types (contravariance) than that specified by the delegate type. For more information, see [Variance in Delegates (C#)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/variance-in-delegates) and [Using Variance in Delegates (C#)](https://learn.microsoft.com/en-us/dotnet/csharp/programming-guide/concepts/covariance-contravariance/using-variance-in-delegates).

The following code example shows covariance and contravariance support for method groups.

```typescript
static object GetObject() { return null; }
static void SetObject(object obj) { }

static string GetString() { return ""; }
static void SetString(string str) { }

static void Test()
{
    // Covariance. A delegate specifies a return type as object,
    // but you can assign a method that returns a string.
    Func<object> del = GetString;

    // Contravariance. A delegate specifies a parameter type as string,
    // but you can assign a method that takes an object.
    Action<string> del2 = SetObject;
}
```

**Example 1: Arrays (Built-in Covariance)**
Arrays in C# are covariant. This means you can assign an array of a derived type (e.g. Dog[]) to an array variable of a base type (Animal[]). However, note that this can lead to runtime exceptions if you try to store a different type than expected.

```typescript
class Animal 
{
    public virtual void Speak() => Console.WriteLine("Animal speaks");
}
  
class Dog : Animal 
{
    public override void Speak() => Console.WriteLine("Dog barks");
}
  
// Covariant assignment
Dog[] dogs = new Dog[3];
Animal[] animals = dogs; // Allowed because arrays are covariant

// This line compiles but will throw an ArrayTypeMismatchException at runtime:
try {
    animals[0] = new Animal();
} catch (ArrayTypeMismatchException ex) {
    Console.WriteLine("Runtime error: " + ex.Message);
}
```

**Example 2: Covariance in Delegates**
Delegates can be covariant with respect to their return type. This means a delegate that returns a base type can point to a method that returns a derived type.

```typescript
// Define a delegate that returns an Animal.
delegate Animal AnimalFactory();

class AnimalCreator {
    public static Dog CreateDog() => new Dog();
}
  
// Covariance: Dog is derived from Animal.
AnimalFactory factory = AnimalCreator.CreateDog;
Animal animal = factory();
animal.Speak(); // Outputs: Dog barks
```

**Example 3: Covariant Generic Interfaces**
Many built-in generic interfaces use the out keyword on their type parameter to indicate covariance. For example, IEnumerable<out T> is covariant.

```typescript
List<Dog> dogList = new List<Dog> { new Dog(), new Dog() };

// IEnumerable<Dog> is convertible to IEnumerable<Animal>
IEnumerable<Animal> animalEnumerable = dogList;

foreach (Animal a in animalEnumerable)
{
    a.Speak(); // Each will call Dog's override.
}
```

```typescript  
public interface IContainer<out T> // more derived to more specific 
    {
        T Add(); // Add(T item) compilation error
    }


    public interface IContainer2<in T> // more specific to more derived
    {
        void Method(T item); // T Method2(); compilation error

    } 
```