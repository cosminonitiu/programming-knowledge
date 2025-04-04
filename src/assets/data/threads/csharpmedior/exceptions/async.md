## 1. Exception Flow in Async Methods

### How Exceptions Are Captured
- **Task-Based Exception Handling:**  
  When an async method throws an exception, the exception is captured and stored in the returned `Task` or `Task<T>`. It does not immediately crash the application or propagate up the call stack.
  
- **Awaiting a Task:**  
  When you await a task, the stored exception is rethrown at that point. This means that the try/catch blocks surrounding the `await` expression can catch the exception as if it were thrown synchronously.
  
- **AggregateException:**  
  In scenarios such as `Task.WhenAll`, multiple exceptions might be aggregated into an `AggregateException`. When awaiting such a task, if not handled properly, you may need to flatten the exceptions.

### Basic Example
```typescript
public async Task<int> DivideAsync(int numerator, int denominator)
{
    // This exception is captured by the Task.
    return await Task.Run(() => numerator / denominator);
}

public async Task ExecuteDivisionAsync()
{
    try
    {
        int result = await DivideAsync(10, 0);
        Console.WriteLine("Result: " + result);
    }
    catch (DivideByZeroException ex)
    {
        Console.WriteLine("Caught exception: " + ex.Message);
    }
}
```

**Explanation:**
In DivideAsync, the division by zero exception is captured in the task. When await DivideAsync(10, 0) is executed in ExecuteDivisionAsync, the exception is rethrown and caught in the try/catch block.

**2. Exception Handling Patterns in Async Code
Using try-catch with async/await
Local Exception Handling:**
Surround async calls with try/catch to handle exceptions at the point of consumption.

```typescript
public async Task ProcessDataAsync()
{
    try
    {
        await SomeAsyncOperation();
    }
    catch (Exception ex)
    {
        // Handle exception (e.g., logging, cleanup)
        Console.WriteLine("Error: " + ex.Message);
    }
}
```

**Exception Propagation
Rethrowing Exceptions:**
When catching exceptions in async methods, you can log or process the exception and then rethrow it using throw; to preserve the original stack trace.

```typescript
public async Task ProcessDataAsync()
{
    try
    {
        await SomeAsyncOperation();
    }
    catch (Exception ex)
    {
        // Log or process the error
        Console.WriteLine("Error occurred: " + ex.Message);
        throw; // Rethrow preserves the original stack trace
    }
}
```

**Handling Multiple Exceptions
Task.WhenAll and AggregateException:**
When running multiple tasks concurrently, exceptions are aggregated.

```typescript
public async Task ProcessMultipleOperationsAsync()
{
    Task op1 = SomeAsyncOperation1();
    Task op2 = SomeAsyncOperation2();

    try
    {
        await Task.WhenAll(op1, op2);
    }
    catch
    {
        // Use AggregateException to examine individual exceptions
        AggregateException aggregate = op1.Exception?.Flatten() ?? op2.Exception?.Flatten();
        foreach (var ex in aggregate.InnerExceptions)
        {
            Console.WriteLine("Operation error: " + ex.Message);
        }
    }
}
```
Note: When you await Task.WhenAll, if any task fails, the exception is rethrown. You can catch it as an AggregateException if you need to handle multiple errors.