EF Core provides powerful mechanisms to inspect, log, and modify the behavior of database operations through interceptors and diagnostics. These features allow you to capture detailed information about queries, commands, and other operations, and integrate with external monitoring systems like Application Insights.

---

## 1. Using Interceptors to Log or Modify Queries and Commands

### **What Are Interceptors?**
- **Definition:**  
  Interceptors in EF Core allow you to intercept and optionally modify various stages of database operations. They work much like middleware, enabling you to inject custom logic before or after specific actions.
- **Use Cases:**  
  - Logging executed SQL commands.
  - Modifying query behavior.
  - Enforcing security or business rules.
  - Capturing performance metrics.

### **Types of Interceptors:**
- **Command Interceptors:**  
  Intercept database commands (e.g., SQL queries or non-query commands).
- **SaveChanges Interceptors:**  
  Intercept the execution of `SaveChanges()` to log changes or enforce business rules.
- **Connection Interceptors:**  
  Monitor and modify connection opening/closing events.

### **Example: Logging Command Interceptor**
```typescript
using System.Data.Common;
using Microsoft.EntityFrameworkCore.Diagnostics;
using System.Threading;
using System.Threading.Tasks;
using System;

public class CommandLoggingInterceptor : DbCommandInterceptor
{
    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result)
    {
        Console.WriteLine($"Executing SQL Command: {command.CommandText}");
        return base.ReaderExecuting(command, eventData, result);
    }

    public override async Task<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
        DbCommand command,
        CommandEventData eventData,
        InterceptionResult<DbDataReader> result,
        CancellationToken cancellationToken = default)
    {
        Console.WriteLine($"Executing SQL Command: {command.CommandText}");
        return await base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
    }
}
```

**Registration:**
You register the interceptor in your DbContext options:

```typescript
protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
{
    optionsBuilder
        .UseSqlServer("YourConnectionString")
        .AddInterceptors(new CommandLoggingInterceptor());
}
```

**2. Diagnostic Sources and Integration with Application Insights
EF Core Diagnostics:
Diagnostic Source:**
EF Core emits events using .NET's DiagnosticSource and Activity APIs, which can be used to monitor and trace EF Core operations.

**Purpose:**
These diagnostic events allow you to capture detailed timing, performance, and error information for queries and commands.

**Integrating with Application Insights:
Telemetry Integration:**
You can hook into EF Core’s diagnostics to send telemetry data (e.g., execution time, errors, query details) to Application Insights.

**Example Strategy:**

**Subscribe to Diagnostic Events:**
Create a listener that subscribes to EF Core diagnostic events and then forwards this data to Application Insights.
**
Sample Diagnostic Listener:**

```typescript
using System;
using System.Diagnostics;

public class EfCoreDiagnosticListener : IObserver<KeyValuePair<string, object>>
{
    public void OnCompleted() { }

    public void OnError(Exception error) { }

    public void OnNext(KeyValuePair<string, object> value)
    {
        // For example, listen for command execution events
        if (value.Key == "Microsoft.EntityFrameworkCore.Database.Command.CommandExecuted")
        {
            var commandEvent = (dynamic)value.Value;
            Console.WriteLine($"Executed Command: {commandEvent.Command.CommandText}");
            // Here you could create a telemetry item and send it to Application Insights.
        }
    }
}
```
**Subscribing to the Diagnostic Source:**

```typescript
var listener = new EfCoreDiagnosticListener();
DiagnosticListener.AllListeners.Subscribe(new Observer<DiagnosticListener>(diagnosticListener =>
{
    if (diagnosticListener.Name == "Microsoft.EntityFrameworkCore")
    {
        diagnosticListener.Subscribe(listener);
    }
}));
```

**Application Insights:**
Use Application Insights SDK to track custom events or metrics generated from the diagnostic listener.

**3. Custom Logging and Performance Monitoring
Custom Logging:**
**Integrated Logging Providers:**
EF Core integrates with the ASP.NET Core logging framework, allowing you to configure log levels and sinks (Console, File, Application Insights, etc.).

**Configuring Logging Example:**

```typescript
optionsBuilder
    .UseSqlServer("YourConnectionString")
    .LogTo(Console.WriteLine, LogLevel.Information)
    .EnableSensitiveDataLogging();
```
**Custom Log Sinks:**
You can also implement your own logging sinks to capture and process logs according to your needs.

**Performance Monitoring:
Query Execution Metrics:**
Use interceptors and diagnostic listeners to measure execution time, query frequency, and errors.

**Monitoring Tools:**
Combine EF Core logging with external monitoring tools (e.g., Application Insights, Prometheus, Grafana) to create dashboards and alerts.

Example:
Log execution times in your interceptor:

```typescript
public override async Task<InterceptionResult<DbDataReader>> ReaderExecutingAsync(
    DbCommand command,
    CommandEventData eventData,
    InterceptionResult<DbDataReader> result,
    CancellationToken cancellationToken = default)
{
    var startTime = DateTime.UtcNow;
    var res = await base.ReaderExecutingAsync(command, eventData, result, cancellationToken);
    var duration = DateTime.UtcNow - startTime;
    Console.WriteLine($"SQL Command executed in {duration.TotalMilliseconds} ms");
    // Optionally send this metric to a monitoring system
    return res;
}
```