Middleware in ASP.NET Core is software that's assembled into an application pipeline to handle requests and responses. Each component in the middleware pipeline is responsible for invoking the next component in the sequence or short-circuiting the chain if necessary. Middleware components can perform a variety of tasks, such as authentication, routing, session management, and logging.

1. **What is Middleware?** Middleware is software components that are assembled into an application pipeline to handle requests and responses.
**Purpose**: Each middleware component can:
Perform operations on the incoming request (e.g., authentication, logging).
Modify the outgoing response (e.g., adding headers, compressing responses).
Decide whether to pass the request to the next middleware in the pipeline or short-circuit the pipeline.
Pipeline: Middleware components are executed in the order they are added to the pipeline. Each component can:
Process the request and pass it to the next middleware.
Process the request and terminate the pipeline (short-circuiting).

2. **How Middleware Works**
Request Pipeline: When a request comes in, it flows through the middleware pipeline. Each middleware component can inspect, modify, or terminate the request.
Response Pipeline: After the request is processed by the application (e.g., a controller), the response flows back through the middleware pipeline in reverse order.

**3. Middleware Components**
Middleware components are typically implemented as classes with an Invoke or InvokeAsync method. They can be added to the pipeline using the Use, Run, or Map methods in the Startup class (or Program class in .NET 6+).

a. **Use Method**
Adds a middleware component to the pipeline. The middleware can call the next middleware in the pipeline using the next parameter.
b. **Run Method**
Adds a terminal middleware component (it does not call the next middleware).
c. **Map Method**
Branches the middleware pipeline based on the request path.

**Example**
```typescript
public class CustomMiddleware
{
    private readonly RequestDelegate _next;

    public CustomMiddleware(RequestDelegate next)
    {
        _next = next;
    }

    public async Task InvokeAsync(HttpContext context)
    {
        // Do something with the context before the next middleware
        Console.WriteLine("Before next middleware");

        await _next(context); // Call the next middleware in the pipeline

        // Do something with the context after the next middleware
        Console.WriteLine("After next middleware");
    }
}

// Extension method used to add the middleware to the application's request pipeline
public static class CustomMiddlewareExtensions
{
    public static IApplicationBuilder UseCustomMiddleware(this IApplicationBuilder builder)
    {
        return builder.UseMiddleware<CustomMiddleware>();
    }
}

public class Startup
{
    public void Configure(IApplicationBuilder app)
    {
        app.UseCustomMiddleware();
        // Other middleware registrations
    }
}
```

In this example, CustomMiddleware is defined with an InvokeAsync method that ASP.NET Core calls to process the HTTP request. The UseCustomMiddleware extension method adds the middleware to the application's request pipeline, and it's registered in the Configure method of the Startup class.