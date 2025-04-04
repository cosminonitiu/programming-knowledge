## 1. What Are Multicast Delegates?

- **Definition:**  
  A multicast delegate is a delegate that can reference more than one method. In C#, all delegates are multicast by default. When you use the `+=` operator, you add methods to the delegate's invocation list.

- **Invocation List:**  
  Internally, a delegate maintains a list of method references. When the delegate is invoked, it sequentially calls each method in the list.

---

## 2. How Multicast Delegates Work

### **Combining Delegates:**
- **Using the `+` or `+=` Operator:**  
  You can add methods to a delegate's invocation list by using these operators.
  
```typescript
  public delegate void NotificationDelegate(string message);

  public class Notifier
  {
      public NotificationDelegate Notify;
  }

  public class Program
  {
      public static void Main()
      {
          Notifier notifier = new Notifier();

          // Add methods to the delegate
          notifier.Notify += SendEmail;
          notifier.Notify += SendSMS;
          
          // Invoke the multicast delegate
          notifier.Notify("System maintenance at midnight.");
      }

      public static void SendEmail(string message)
      {
          Console.WriteLine("Email: " + message);
      }

      public static void SendSMS(string message)
      {
          Console.WriteLine("SMS: " + message);
      }
  }
  ```

  **Invocation Order:
Sequential Execution:**
Methods are invoked in the order they were added to the delegate's invocation list.

**Return Values:**
For non-void delegates, only the return value of the last method in the list is returned. If you need to collect all return values, you must iterate over the invocation list manually.

**Removing Methods:
Using the -= Operator:**
You can remove a method from the delegate's invocation list.

```typescript
notifier.Notify -= SendSMS;  // Removes the SendSMS method from the invocation list.
```

**3. Exception Handling in Multicast Delegates
Exception Propagation:**
If one method in the invocation list throws an exception, the execution of the remaining methods is halted, and the exception is propagated to the caller.

**Handling Exceptions:**
To handle exceptions gracefully, you might need to manually iterate through the invocation list and wrap each invocation in a try/catch block.

```typescript
foreach (NotificationDelegate handler in notifier.Notify.GetInvocationList())
{
    try
    {
        handler("System maintenance at midnight.");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"Handler {handler.Method.Name} failed: {ex.Message}");
    }
}
```