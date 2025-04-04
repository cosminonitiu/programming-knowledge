## 1. Overview

### What is MediatR?
- **Mediator Pattern Implementation:**  
  MediatR centralizes communication between objects by acting as an intermediary. Instead of components directly calling each other, they send requests or notifications to MediatR, which then routes them to the appropriate handlers.
  
- **Decoupling:**  
  The sender (e.g., a controller, service, or command) does not need to know about the implementation of its handler. This decoupling leads to more modular, testable, and maintainable code.

- **Core Use Cases:**  
  - **Commands:** For operations that change state.
  - **Queries:** For read-only operations.
  - **Notifications:** For broadcasting events to multiple handlers.
  - **Pipelines:** For adding cross-cutting concerns like logging, validation, or performance monitoring.

---

## 2. Key Components

### Requests and Handlers
- **Request (or Command/Query):**  
  A request object implements either `IRequest<TResponse>` (for requests expecting a response) or `IRequest` (for commands that do not return data). This encapsulates the data for an operation.
  ```typescript
  public class CreateOrderCommand : IRequest<Order>
  {
      public int CustomerId { get; set; }
      public List<OrderItem> Items { get; set; }
  }
```

**Handler:**
A handler implements IRequestHandler<TRequest, TResponse> for a given request type. It contains the business logic to process the request.

```typescript
public class CreateOrderCommandHandler : IRequestHandler<CreateOrderCommand, Order>
{
    public async Task<Order> Handle(CreateOrderCommand request, CancellationToken cancellationToken)
    {
        // Business logic for creating an order
        var order = new Order { Id = new Random().Next(1000), CustomerId = request.CustomerId, Items = request.Items };
        // Simulate asynchronous work
        await Task.Delay(100, cancellationToken);
        return order;
    }
}
```

**Notifications and Handlers
Notification:**
Represents an event that does not return a response. It implements INotification.

```typescript
public class OrderCreatedNotification : INotification
{
    public Order Order { get; set; }
}
```
**Notification Handler:**
Implements INotificationHandler<TNotification> and processes notifications. Multiple handlers can subscribe to a single notification.

```typescript
public class OrderCreatedHandler : INotificationHandler<OrderCreatedNotification>
{
    public async Task Handle(OrderCreatedNotification notification, CancellationToken cancellationToken)
    {
        // Handle the notification (e.g., send an email, update a dashboard)
        await Task.Delay(50, cancellationToken);
        Console.WriteLine($"Order {notification.Order.Id} created and processed.");
    }
}
```

**Pipeline Behaviors
What They Are:**
Pipeline behaviors are middleware components that allow you to run code before and after request handling. They are useful for implementing cross-cutting concerns like logging, validation, caching, and performance monitoring.

**Implementation:**
Implement the IPipelineBehavior<TRequest, TResponse> interface.

```typescript
public class LoggingBehavior<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
{
    public async Task<TResponse> Handle(
        TRequest request,
        CancellationToken cancellationToken,
        RequestHandlerDelegate<TResponse> next)
    {
        Console.WriteLine($"Handling {typeof(TRequest).Name}");
        var response = await next();
        Console.WriteLine($"Handled {typeof(TResponse).Name}");
        return response;
    }
}
```

**3. How MediatR Works Under the Hood
Dependency Injection Integration
Service Registration:**
MediatR is designed to integrate with DI containers. In ASP.NET Core, you typically register MediatR services in the Startup.cs:

```typescript
services.AddMediatR(typeof(Startup));
```
This registers all handlers, requests, and pipeline behaviors found in the specified assembly.

**Request Processing Flow
Sending a Request:**
A client sends a request using IMediator.Send().

```typescript
public class OrdersController : ControllerBase
{
    private readonly IMediator _mediator;

    public OrdersController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderCommand command)
    {
        var order = await _mediator.Send(command);
        return Ok(order);
    }
}
```

**Pipeline Execution:**
Before the request reaches its handler, it passes through any registered pipeline behaviors.

**Handler Execution:**
The appropriate handler’s Handle method processes the request.

**Response Return:**
The response is returned back through the pipeline to the caller.

**Notification Publishing
Broadcasting Notifications:**
When a notification is published via IMediator.Publish(), all registered INotificationHandler<T> implementations are invoked asynchronously, enabling multiple components to react to a single event.

**4. Real-World Use Cases
Command-Query Separation (CQRS)
Scenario:**
Separating write operations (commands) from read operations (queries) in a complex application.

**Application:**
Use MediatR to dispatch commands to their handlers for processing and queries for retrieving data, promoting a clean architecture.

**Cross-Cutting Concerns
Scenario:**
Implementing logging, validation, or transaction management that needs to run for every request.

**Application:**
Pipeline behaviors in MediatR allow you to add these concerns in a central, reusable manner without cluttering your business logic.

**Decoupled Communication
Scenario:**
In a microservices architecture or modular monolith, different parts of the application need to communicate without tight coupling.

**Application:**
MediatR facilitates in-process messaging, allowing components to interact via requests and notifications without directly referencing each other.

**Example from WisePerform**

builder.Services.AddTransient<ExceptionHandlingMiddleware>();

var userAccessAssembly = typeof(WisePerform.Modules.UserAccess.Application.AssemblyReference).Assembly;
var feedbackAssembly = typeof(WisePerform.Modules.Feedback.Application.AssemblyReference).Assembly;
var surveyAssembly = typeof(WisePerform.Modules.Survey.Application.AssemblyReference).Assembly;
var respondentsAssembly = typeof(WisePerform.Modules.Respondents.Application.AssemblyReference).Assembly;

builder.Services.AddMediatR(cfg =>
{
cfg.RegisterServicesFromAssembly(userAccessAssembly);
cfg.RegisterServicesFromAssembly(feedbackAssembly);
cfg.RegisterServicesFromAssembly(surveyAssembly);
cfg.RegisterServicesFromAssemblies(respondentsAssembly);
});

builder.Services.AddTransient(typeof(IPipelineBehavior<,>), typeof(ValidationBehavior<,>));

builder.Services.AddValidatorsFromAssembly(userAccessAssembly);
builder.Services.AddValidatorsFromAssembly(feedbackAssembly);
builder.Services.AddValidatorsFromAssembly(surveyAssembly);
builder.Services.AddValidatorsFromAssembly(respondentsAssembly);

**And the IRequest handler extended**

public interface ICommandHandler<in TCommand, TResult> :
IRequestHandler<TCommand, TResult>
where TCommand : ICommand<TResult>

public interface IQueryHandler<in TQuery, TResult> :
IRequestHandler<TQuery, TResult>
where TQuery : IQuery<TResult>

**Advanced Topics with MediatR:**

1. **Request Aggregation**:
You can handle multiple requests at once by combining them into a single request.
2. **Transaction Management**:
MediatR can be used in scenarios where you need to manage transactions. A common pattern is to use a pipeline behavior that wraps all commands in a transaction scope.
3. **Error Handling**:
Since MediatR promotes separation of concerns, you can handle exceptions and validation errors centrally using behaviors or middleware.
4. **Caching**:
MediatR can also be used with caching patterns by integrating caching strategies in your request/response handling.