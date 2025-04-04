Reflection is a powerful feature in .NET that allows you to inspect assemblies, types, and their members at runtime. It enables dynamic type creation, runtime code execution, and various other advanced programming scenarios.

---

## 1. Using Reflection to Inspect Assemblies, Types, and Members

### **What is Reflection?**
- **Definition:**  
  Reflection is the process of examining metadata about assemblies, modules, and types at runtime. It lets you query the structure of your code, including classes, methods, properties, and events.

### **Key Capabilities:**
- **Load and Inspect Assemblies:**  
  Determine the types defined in an assembly.
- **Examine Type Information:**  
  Retrieve information about a type's members, such as its methods, properties, fields, and custom attributes.
- **Dynamic Invocation:**  
  Create instances of types and invoke methods at runtime without compile-time knowledge of their exact types.

  ### **Example: Inspecting an Assembly**
```typescript
using System;
using System.Reflection;

public class ReflectionExample
{
    public static void InspectAssembly(string assemblyPath)
    {
        Assembly assembly = Assembly.LoadFrom(assemblyPath);
        Console.WriteLine($"Loaded Assembly: {assembly.FullName}");

        // List all types in the assembly
        foreach (Type type in assembly.GetTypes())
        {
            Console.WriteLine($"Type: {type.FullName}");

            // List all public methods of the type
            foreach (MethodInfo method in type.GetMethods(BindingFlags.Public | BindingFlags.Instance | BindingFlags.Static))
            {
                Console.WriteLine($"  Method: {method.Name}");
            }
        }
    }
}
```

**2. Dynamic Type Creation and Runtime Code Execution
Dynamic Type Creation:
Definition:**
Create types at runtime using classes in the System.Reflection.Emit namespace. This allows you to generate new types and methods dynamically.

**Example: Creating a Dynamic Type**
```typescript
using System;
using System.Reflection;
using System.Reflection.Emit;

public class DynamicTypeExample
{
    public static void CreateAndUseDynamicType()
    {
        // Define a dynamic assembly and module
        AssemblyName assemblyName = new AssemblyName("DynamicAssembly");
        AssemblyBuilder assemblyBuilder = AssemblyBuilder.DefineDynamicAssembly(assemblyName, AssemblyBuilderAccess.Run);
        ModuleBuilder moduleBuilder = assemblyBuilder.DefineDynamicModule("MainModule");

        // Define a public class named "DynamicClass"
        TypeBuilder typeBuilder = moduleBuilder.DefineType("DynamicClass", TypeAttributes.Public);

        // Define a method "Hello" that returns a string
        MethodBuilder methodBuilder = typeBuilder.DefineMethod("Hello", MethodAttributes.Public, typeof(string), null);

        // Generate IL for the method
        ILGenerator ilGenerator = methodBuilder.GetILGenerator();
        ilGenerator.Emit(OpCodes.Ldstr, "Hello from the dynamic type!");
        ilGenerator.Emit(OpCodes.Ret);

        // Create the type
        Type dynamicType = typeBuilder.CreateType();

        // Instantiate the dynamic type and invoke the "Hello" method
        object dynamicInstance = Activator.CreateInstance(dynamicType);
        MethodInfo helloMethod = dynamicType.GetMethod("Hello");
        string result = (string)helloMethod.Invoke(dynamicInstance, null);

        Console.WriteLine(result);
    }
}
```

**Runtime Code Execution:
Dynamic Invocation:**
Use reflection to call methods on objects whose types were determined at runtime.

Example: Invoking a Method Dynamically
```typescript
using System;
using System.Reflection;

public class DynamicInvocationExample
{
    public void Greet(string name)
    {
        Console.WriteLine($"Hello, {name}!");
    }

    public static void InvokeMethodDynamically()
    {
        // Create an instance of DynamicInvocationExample
        DynamicInvocationExample instance = new DynamicInvocationExample();

        // Get the MethodInfo object for the "Greet" method
        MethodInfo greetMethod = typeof(DynamicInvocationExample).GetMethod("Greet");

        // Invoke the method dynamically
        greetMethod.Invoke(instance, new object[] { "World" });
    }
}
```