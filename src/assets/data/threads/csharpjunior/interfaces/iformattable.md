## 1. IFormattable

### Overview
- **Namespace:**  
  `System`
- **Definition:**  
  `IFormattable` defines a method that supports customized formatting of the value of an object.
  
### Signature
```csharp
public interface IFormattable
{
    string ToString(string format, IFormatProvider formatProvider);
}
```

**Purpose**
Allows custom control over how objects are converted to strings.

Provides culture-aware formatting by accepting an IFormatProvider.

**Common Implementations**
Built-in types like Int32, Double, DateTime, and Decimal implement IFormattable.

Custom types can implement it to provide meaningful formatting based on format strings.

Example
```csharp
public class Product : IFormattable
{
    public string Name { get; set; }
    public decimal Price { get; set; }

    public string ToString(string format, IFormatProvider formatProvider)
    {
        switch (format)
        {
            case "N":
                return Name;
            case "P":
                return Price.ToString("C", formatProvider);
            default:
                return $"{Name}: {Price.ToString("C", formatProvider)}";
        }
    }

    public override string ToString() => ToString(null, null);
}
```
Usage
```csharp
var p = new Product { Name = "Laptop", Price = 999.99m };
Console.WriteLine(p.ToString("P", CultureInfo.GetCultureInfo("en-US")));  // "$999.99"
```

**2. ICustomFormatter
Overview
Namespace:**
System

**Definition:**
Provides custom string formatting for objects beyond the default behaviors of .NET.

**Signature**
```csharp
public interface ICustomFormatter
{
    string Format(string format, object arg, IFormatProvider formatProvider);
}
```
**Purpose**
Enables application-wide custom formatting logic.

Typically used alongside a custom IFormatProvider.
**
How It Works**
The Format method is called when string.Format or ToString is invoked with a format provider that implements ICustomFormatter.

Example: Custom Hex Formatter
```csharp
public class HexFormatter : IFormatProvider, ICustomFormatter
{
    public object GetFormat(Type formatType)
    {
        return formatType == typeof(ICustomFormatter) ? this : null;
    }

    public string Format(string format, object arg, IFormatProvider formatProvider)
    {
        if (arg is int && format == "H")
        {
            return $"0x{((int)arg):X}";
        }
        return arg?.ToString() ?? string.Empty;
    }
}
```
Usage
```csharp
int value = 255;
Console.WriteLine(string.Format(new HexFormatter(), "{0:H}", value)); // "0xFF"
```

**3. Working Together
Integration Flow**
The runtime calls ToString(string, IFormatProvider) on an IFormattable object.

The IFormatProvider is passed in, which may provide an ICustomFormatter.

If a formatter is found, its Format method is used.

**Benefits**
Separation of formatting logic from data models.

Plug-and-play formatting via format providers.

Culture-sensitive and context-aware string generation.

**4. Best Practices
IFormattable**
Use format strings like "N", "C", "P" (Name, Currency, Percentage) for clarity.

Always provide a fallback for null format strings.

**ICustomFormatter**
Check for expected format codes and provide defaults for unknowns.

Always ensure Format returns a safe value for null inputs.