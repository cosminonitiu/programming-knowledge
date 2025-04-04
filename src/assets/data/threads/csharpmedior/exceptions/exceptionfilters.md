## 1. What Are Exception Filters?

- **Definition:**  
  Exception filters allow you to specify a boolean condition using a `when` clause on a catch block. The catch block is executed only if the condition evaluates to true. If it evaluates to false, the exception is not caught by that block, and the runtime continues searching for another handler.

- **Syntax:**  
  ```typescript
  try
  {
      // Code that might throw an exception.
  }
  catch (Exception ex) when (/* condition */)
  {
      // This block executes only if the condition is true.
  }
  ```

**2. How Exception Filters Work
Evaluation Before Catching:**
Unlike traditional catch blocks that catch an exception and then evaluate a condition inside the block, exception filters evaluate the condition before entering the catch block. This means:

The filter does not modify the exception or affect the stack trace.

It prevents unnecessary handling when the condition is not met.

**Separation of Concerns:**
Exception filters help separate error detection logic from error handling logic, leading to cleaner and more maintainable code.

**3. Advantages of Using Exception Filters
Selective Handling:**
You can catch exceptions based on runtime conditions, such as the state of the application, configuration settings, or specific properties of the exception (e.g., error codes).
**
Preserved Stack Trace:**
Since the filter is evaluated before entering the catch block, using exception filters does not alter the original stack trace when rethrowing exceptions.
**
Avoids Unnecessary Catching**:
Exception filters allow you to avoid catching exceptions that you do not intend to handle, which can simplify error handling logic and reduce overhead.

**4. Example Usage
Example 1: Filtering Based on Exception Message**
```typescript
try
{
    // Simulate an operation that throws an exception.
    throw new InvalidOperationException("Critical failure: Resource not found.");
}
catch (InvalidOperationException ex) when (ex.Message.Contains("Critical"))
{
    Console.WriteLine("Handled critical error: " + ex.Message);
}
catch (InvalidOperationException ex)
{
    Console.WriteLine("Handled non-critical error: " + ex.Message);
}
```

**Explanation:**
The first catch block will only handle InvalidOperationException if the message contains the word "Critical". Otherwise, the exception falls through to the next catch block.

**Example 2: Filtering Based on Application State**
```cshar
bool isLoggingEnabled = false;

try
{
    // Operation that may throw an exception.
    DoRiskyOperation();
}
catch (Exception ex) when (isLoggingEnabled)
{
    // This block executes only if logging is enabled.
    LogException(ex);
}
catch (Exception ex)
{
    // Fallback handling when logging is not enabled.
    Console.WriteLine("An error occurred: " + ex.Message);
}
```

**Explanation:**
The first catch block is conditioned on a flag (isLoggingEnabled). When logging is disabled, the exception is caught by the subsequent catch block, preserving the desired behavior without unnecessary logging.