## 1. What is AggregateException?

- **Definition:**  
  `AggregateException` is an exception type that encapsulates multiple exceptions into a single object. It is typically thrown when one or more tasks in a parallel operation (or asynchronous operation) fail.
  
- **Common Scenarios:**  
  - Parallel loops (e.g., `Parallel.For`, `Parallel.ForEach`)
  - Awaiting multiple tasks with `Task.WhenAll`
  - When asynchronous operations encounter multiple failures simultaneously

---

## 2. Structure of AggregateException

- **InnerExceptions Property:**  
  Contains a collection of the individual exceptions that caused the aggregate.
  
- **Flatten Method:**  
  If nested `AggregateException` instances exist (e.g., if tasks throw aggregate exceptions that themselves contain aggregate exceptions), calling `Flatten()` returns a new `AggregateException` with a single, flat list of inner exceptions.

---

## 3. Handling AggregateException

### Basic Handling with try-catch

When you call `await Task.WhenAll(...)`, if one or more tasks fail, the awaiter will throw an `AggregateException` that you can catch:

```typescript
try
{
    // Run multiple tasks concurrently.
    await Task.WhenAll(task1, task2, task3);
}
catch (AggregateException aggEx)
{
    foreach (var ex in aggEx.InnerExceptions)
    {
        Console.WriteLine($"Error: {ex.Message}");
    }
}
```

**Using Flatten() to Simplify Handling**
If your tasks might throw nested aggregate exceptions, use Flatten() to get a single collection of inner exceptions:

```typescript
try
{
    await Task.WhenAll(task1, task2, task3);
}
catch (AggregateException aggEx)
{
    // Flatten nested AggregateExceptions.
    var flattenedExceptions = aggEx.Flatten().InnerExceptions;
    foreach (var ex in flattenedExceptions)
    {
        Console.WriteLine($"Flattened error: {ex.Message}");
    }
}
```

**Handling Exceptions in Parallel Loops**
When using parallel constructs like Parallel.For or Parallel.ForEach, exceptions from multiple iterations are aggregated into an AggregateException:

```typescript
try
{
    Parallel.For(0, 10, i =>
    {
        // Some code that might throw an exception.
        if (i % 2 == 0)
            throw new InvalidOperationException($"Error on iteration {i}");
    });
}
catch (AggregateException aggEx)
{
    // Process each exception.
    foreach (var ex in aggEx.InnerExceptions)
    {
        Console.WriteLine($"Iteration error: {ex.Message}");
    }
}
```