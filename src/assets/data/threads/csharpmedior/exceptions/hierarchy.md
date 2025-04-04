## 1. The Base Class: System.Exception

- **System.Exception:**  
  The root of all exceptions in .NET. It provides the fundamental properties and methods for exception handling:
  - **Properties:**  
    - `Message`: A description of the error.
    - `StackTrace`: A string representation of the call stack at the point where the exception was thrown.
    - `InnerException`: References the original exception that caused the current exception (if any), allowing for exception chaining.
    - `Data`: A collection of key-value pairs that can hold additional user-defined information.
    - `Source`: The name of the application or the object that causes the error.
    - `HelpLink`: A link to a help file associated with the exception.
  - **Methods:**  
    - `ToString()`: Returns a string that represents the current exception, including the message, stack trace, and inner exception information.

---

## 2. Major Branches of the Exception Hierarchy

### System.SystemException
- **Purpose:**  
  Serves as the base class for exceptions that are thrown by the .NET runtime. These exceptions typically indicate issues with the execution environment.
- **Common Derived Exceptions:**
  - `NullReferenceException`
  - `IndexOutOfRangeException`
  - `InvalidOperationException`
  - `OutOfMemoryException`
  - `StackOverflowException`
  - `DivideByZeroException`
  
### System.ApplicationException
- **Purpose:**  
  Intended as a base class for exceptions defined by applications. However, its use is now discouraged, and it is generally recommended to derive custom exceptions directly from `System.Exception`.
- **Note:**  
  The .NET guidelines suggest that custom exceptions should inherit from `Exception` instead of `ApplicationException`.

---

## 3. Custom Exceptions
- **Creating Custom Exceptions:**  
  When creating your own exceptions, you should derive from `System.Exception`. Custom exceptions can include additional properties and methods as needed.
- **Best Practices:**  
  - Provide standard constructors (default, message, message with inner exception).
  - Ensure your custom exception is serializable by implementing the serialization constructor if the exception needs to be remoted.
  - Document the exception purpose and usage clearly.

---

## 4. Common Built-In Exceptions
- **ArgumentException and its Derivatives:**
  - `ArgumentNullException`: Thrown when a null argument is passed to a method that does not accept it.
  - `ArgumentOutOfRangeException`: Thrown when an argument is outside the allowable range.
- **InvalidOperationException:**  
  Thrown when a method call is invalid for the object's current state.
- **IOException:**  
  The base class for exceptions that occur during I/O operations.
- **SecurityException:**  
  Thrown when a security error is detected.
- **FormatException:**  
  Thrown when the format of an argument is invalid.

---

## 5. Exception Handling Philosophy
- **Use Exceptions for Exceptional Cases:**  
  Exceptions should be used for truly unexpected conditions, not for regular control flow.
- **Preserve Stack Traces:**  
  When rethrowing exceptions, use `throw;` instead of `throw ex;` to maintain the original stack trace.
- **Inner Exceptions:**  
  Utilize inner exceptions to provide a full context of error causation, especially in layered or distributed applications.

---