Attributes in C# are a powerful way to add declarative information to your code. They are used to add metadata, such as compiler instructions, annotations, or custom information, to program elements (classes, methods, properties, etc.). Attributes can influence the behavior of certain components at runtime or compile time, and they can be queried through reflection.

**Common Uses of Attributes:**

- Marking methods as test methods in a unit testing framework (e.g., [TestMethod] in MSTest).
- Specifying serialization rules (e.g., [Serializable], [DataMember]).
- Controlling binding and model validation in ASP.NET Core (e.g., [Required], [Bind]).
- Defining aspects of web service behaviors (e.g., [WebMethod]).
- Custom attributes for domain-specific purposes.

**Example of Using an Attribute:**

A common use case is data validation in ASP.NET Core models. The [Required] attribute indicates that a property must have a value; if a model is passed to a controller method without this property set, model validation fails.

```typescript
using System.ComponentModel.DataAnnotations;

public class Person
{
    [Required]
    public string Name { get; set; }

    [Range(1, 120)]
    public int Age { get; set; }
}
```

**Creating Custom Attributes:**

You can also define custom attributes for specific needs. Here's a simple example:

```typescript
[AttributeUsage(AttributeTargets.Class | AttributeTargets.Method, AllowMultiple = false)]
public class MyCustomAttribute : Attribute
{
    public string Description { get; set; }

    public MyCustomAttribute(string description)
    {
        Description = description;
    }
}

[MyCustomAttribute("This is a class description.")]
public class MyClass
{
    [MyCustomAttribute("This is a method description.")]
    public void MyMethod() { }
}
```