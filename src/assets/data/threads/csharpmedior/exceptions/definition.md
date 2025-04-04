**Exceptions** in .NET are objects that represent errors or unexpected conditions that occur during the execution of a program. When an error occurs, the runtime creates an exception object that contains information about the error and then “throws” it, transferring control to an exception handler. Exceptions are a key part of the error handling mechanism in .NET, enabling applications to recover from or gracefully report unexpected situations.

## Key Characteristics

- **Object-Oriented Representation:**  
  Exceptions are instances of classes that derive from `System.Exception`. This class hierarchy allows for a rich set of error types, from general errors (`System.Exception`) to more specific ones like `ArgumentNullException` or `InvalidOperationException`.

- **Encapsulation of Error Information:**  
  An exception object typically contains:
  - A **message** that describes the error.
  - A **stack trace** showing the sequence of method calls that led to the exception.
  - Inner exceptions, which can provide additional context if an exception is caused by another exception.

- **Control Flow Mechanism:**  
  When an exception is thrown using the `throw` keyword, normal execution is interrupted, and the runtime begins searching for a matching `catch` block. If none is found, the application terminates.

## Basic Exception Handling Constructs

- **try-catch-finally:**  
  These blocks allow you to catch exceptions and handle them, while the `finally` block is used for cleanup actions that must occur regardless of whether an exception was thrown.
  ```typescript
  try
  {
      // Code that might throw an exception
  }
  catch (Exception ex)
  {
      // Handle the exception
      Console.WriteLine($"An error occurred: {ex.Message}");
  }
  finally
  {
      // Cleanup code that always executes
  }
```

**Throwing Exceptions:**
You can throw exceptions manually using the throw statement:

```typescript
if (input == null)
{
    throw new ArgumentNullException(nameof(input), "Input cannot be null.");
}
```

**Purpose of Exceptions
Error Reporting:**
They provide a standardized way to report errors across different parts of an application.

**Flow Control for Unexpected Situations:**
Exceptions allow you to separate normal processing logic from error handling, making code cleaner and more maintainable.

**Enabling Robust Applications:**
By catching and handling exceptions appropriately, applications can recover from errors or fail gracefully instead of crashing abruptly.