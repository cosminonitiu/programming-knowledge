In **ASP.NET Core**, **middleware** are components that form a pipeline to handle incoming HTTP requests and outgoing responses. Each middleware can:
- Perform operations before and/or after calling the next middleware in the pipeline.
- Short-circuit the pipeline if it decides an immediate response is appropriate.

---

## 1. What Is Middleware?

A **middleware** is simply a piece of logic run on every request (and/or response) that passes through it. They are called in sequence:
1. An **incoming request** arrives.
2. The request flows through each middleware **in the order** they were added.
3. The final middleware (or endpoint) produces a **response**.
4. The response then travels **back up** the pipeline, so each middleware can also handle post-processing.

---

## 2. Creating Custom Middleware

### 2.1 Minimal Example (Inline)

```typescript
app.Use(async (context, next) =>
{
    // Do something before
    Console.WriteLine("Before next middleware");

    await next();

    // Do something after
    Console.WriteLine("After next middleware");
});
```

app.Use(...): Calls the provided delegate.

await next(): Passes control to the next middleware in the pipeline.

**2.2 Class-Based Middleware**
You can also encapsulate logic into a class:

```typescript
public class MyCustomMiddleware
{
    private readonly RequestDelegate _next;

    public MyCustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Pre-processing logic
        Console.WriteLine("MyCustomMiddleware: Pre-processing");

        // Call the next middleware
        await _next(context);

        // Post-processing logic
        Console.WriteLine("MyCustomMiddleware: Post-processing");
    }
}
```

**Registration**
```typescript
public static class MyCustomMiddlewareExtensions
{
    public static IApplicationBuilder UseMyCustomMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<MyCustomMiddleware>();
    }
}```
And in Program.cs (or Startup.cs in older templates):

```typescript
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();
app.UseMyCustomMiddleware();
app.Run();
```

**3. Ordering and the Pipeline
3.1 app.Use, app.Run, and app.Map**
Use(...)

Adds a middleware delegate to the pipeline. You typically call await next() to pass control on.

Run(...)

A terminal middleware. It doesn’t call the next middleware, effectively ending the pipeline for that request.

Map(...)

Branches the pipeline based on a request path. For example:

```typescript
app.Map("/admin", adminApp =>
{
    adminApp.Run(async context => 
    {
        await context.Response.WriteAsync("Admin area");
    });
});
```
Requests starting with /admin will enter this branch, others skip it.

**3.2 Pipeline Example**
```typescript
// 1. Logging middleware
app.Use(async (context, next) =>
{
    Console.WriteLine("Logging start");
    await next();  // pass to next
    Console.WriteLine("Logging end");
});

// 2. Authentication middleware
app.Use(async (context, next) =>
{
    // Check if user is authenticated...
    bool userAuthenticated = true; // for illustration

    if (!userAuthenticated)
    {
        context.Response.StatusCode = 401;
        return; // short-circuit
    }
    
    await next();
});

// 3. Terminal middleware
app.Run(async context =>
{
    await context.Response.WriteAsync("Hello from the terminal middleware!");
});
```

**Execution Flow**
**Logging start**

**Next -> Authentication**

If user is authenticated -> Next -> Terminal middleware

Terminal middleware writes "Hello..."

On the way back: Logging end

**4. Additional Techniques
4.1 MapWhen(...)**
Conditionally branch the pipeline based on any arbitrary criteria (rather than just path).

```typescript
app.MapWhen(
    context => context.Request.Query.ContainsKey("debug"), 
    branch =>
    {
        branch.Run(async context =>
        {
            await context.Response.WriteAsync("Debug mode is ON.");
        });
    }
);
```
**4.2 IApplicationBuilder vs. WebApplication**
In the new minimal hosting model, you often see WebApplication methods (app.Use..., app.Map...). Under the hood, it still uses the IApplicationBuilder and middleware pipeline concept.

**4.3 Middleware vs. Filters (MVC)**
In an ASP.NET Core MVC or Razor Pages app, consider Filters for logic that’s specific to controllers/actions (e.g., authorization, validation).

Middleware is for cross-cutting concerns across all endpoints (static files, MVC controllers, APIs, etc.).