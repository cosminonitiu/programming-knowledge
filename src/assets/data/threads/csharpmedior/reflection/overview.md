### Reflection

Reflection in .NET is a powerful feature that allows runtime inspection of assemblies, types, and their members (such as methods, fields, properties, and events). It enables creating instances of types, invoking methods, and accessing fields and properties dynamically, without knowing the types at compile time. Reflection is used for various purposes, including building type browsers, dynamically invoking methods, and reading custom attributes.

Reflection can be particularly useful in scenarios such as:

**Dynamically loading and using assemblies.
Implementing object browsers or debuggers.
Creating instances of types for dependency injection frameworks.
Accessing and manipulating metadata for assemblies and types.**

In C#, reflection is primarily provided through the `System.Reflection` namespace. This namespace contains classes that allow you to inspect the **types** of objects, **properties**, **methods**, **fields**, and **attributes** at runtime.

Reflection is commonly used in scenarios like:

- **Dynamic Object Creation**: Creating objects at runtime when the type isn't known until execution.
- **Invoking Methods Dynamically**: Calling methods when you don't have direct knowledge of the method at compile time.
- **Accessing Private Members**: Accessing members (fields, methods, properties) that are marked as private or protected, which you normally can't access directly.
- **Metadata Inspection**: Reading assembly metadata, including versioning and custom attributes.
- **Serialization/Deserialization**: Reflection is commonly used in libraries like JSON.NET or XML serialization to dynamically read and write object properties.

---

Here's a simple example demonstrating how to use reflection to inspect and invoke methods of a class dynamically:
```typescript
using System;
using System.Reflection;

public class MyClass
{
    public void MethodToInvoke()
    {
        Console.WriteLine("Method Invoked.");
    }
}

class Program
{
    static void Main(string[] args)
    {
        // Obtaining the Type object for MyClass
        Type myClassType = typeof(MyClass);
        
        // Creating an instance of MyClass
        object myClassInstance = Activator.CreateInstance(myClassType);
        
        // Getting the MethodInfo object for MethodToInvoke
        MethodInfo methodInfo = myClassType.GetMethod("MethodToInvoke");
        
        // Invoking the method on the instance
        methodInfo.Invoke(myClassInstance, null);
    }
}
```

In this example, reflection is used to obtain the Type object for MyClass, create an instance of MyClass, and then retrieve and invoke the MethodToInvoke method. This demonstrates how reflection allows for dynamic type inspection and invocation, providing flexibility and power in how code interacts with objects.

Using reflection comes with a performance cost, so it should be used judiciously, especially in performance-critical paths of an application.

**Key Concepts and Classes in Reflection**

1. **Type Class**

The `Type` class is at the core of reflection. It represents a type in C# and provides methods and properties to inspect its members, inheritance, and more.

- **Getting Type Information**:
    - Every type in C# (including arrays, primitive types, and user-defined types) is associated with an instance of the `Type` class.
    - You can get a `Type` object for a class, interface, or struct by using `typeof(T)` or `object.GetType()`.

**Example**:

```typescript
Type type = typeof(string);
Console.WriteLine(type.FullName);  // Output: System.String
```

Or for an object instance:

```typescript
var myObject = new MyClass();
Type type = myObject.GetType();
Console.WriteLine(type.Name);  // Output: MyClass
```

2. **Getting Members of a Type**

You can inspect the properties, methods, fields, and events of a type using the `Type` class.

- **Methods**: Use `GetMethods()` to get all methods of a type.
- **Properties**: Use `GetProperties()` to get all properties.
- **Fields**: Use `GetFields()` to get all fields.
- **Constructors**: Use `GetConstructors()` to get all constructors.

**Example**:

```typescript
Type type = typeof(MyClass);
MethodInfo[] methods = type.GetMethods();
foreach (var method in methods)
{
    Console.WriteLine(method.Name);  // Prints method names in MyClass
}
```

You can also access specific members like properties or fields:

```typescript
PropertyInfo property = type.GetProperty("MyProperty");
FieldInfo field = type.GetField("MyField");
```

3. **Invoking Methods via Reflection**

You can invoke methods dynamically using reflection. This is useful when you don't know the method you want to call at compile time.

- Use `MethodInfo.Invoke()` to invoke a method.
- You can also pass parameters dynamically using reflection.

**Example**:

```typescript
public class MyClass
{
    public void SayHello(string name)
    {
        Console.WriteLine($"Hello, {name}!");
    }
}

Type type = typeof(MyClass);
MethodInfo method = type.GetMethod("SayHello");
object instance = Activator.CreateInstance(type);
method.Invoke(instance, new object[] { "John" });  // Output: Hello, John!
```

4. **Dynamic Object Creation via Reflection**

You can create instances of types dynamically using reflection. This is useful when the type you want to create is not known at compile time.

- Use `Activator.CreateInstance()` to create an object from a type.

**Example**:

```typescript
Type type = typeof(MyClass);
object instance = Activator.CreateInstance(type);
```

If the class has a parameterized constructor, you can pass parameters to it:

```typescript
Type type = typeof(MyClass);
ConstructorInfo constructor = type.GetConstructor(new[] { typeof(string) });
object instance = constructor.Invoke(new object[] { "Hello" });
```

5. **Accessing Fields and Properties**

Reflection allows you to access and modify both public and non-public fields and properties.

- Use `GetField()` and `SetValue()` for fields.
- Use `GetProperty()` and `SetValue()` for properties.

**Example**:

```typescript
public class Person
{
    private string Name { get; set; }
}

Type type = typeof(Person);
object personInstance = Activator.CreateInstance(type);

// Access private property using reflection
PropertyInfo property = type.GetProperty("Name", BindingFlags.NonPublic | BindingFlags.Instance);
property.SetValue(personInstance, "John");

// Retrieve the value of the property
string name = (string)property.GetValue(personInstance);
Console.WriteLine(name);  // Output: John
```

6. **Attributes and Custom Attributes**

Reflection allows you to inspect custom attributes applied to types, methods, properties, etc.

- Use `GetCustomAttributes()` to retrieve attributes.

**Example**:

```typescript
[Obsolete("This method is obsolete.")]
public void OldMethod() { }

Type type = typeof(MyClass);
MethodInfo method = type.GetMethod("OldMethod");
var attributes = method.GetCustomAttributes(typeof(ObsoleteAttribute), false);
foreach (ObsoleteAttribute attribute in attributes)
{
    Console.WriteLine(attribute.Message);  // Output: This method is obsolete.
}
```