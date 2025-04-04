**Routing** in ASP.NET Core is the process of matching **incoming HTTP requests** to the **correct endpoint** (controller action, Razor Page, or other handler). It allows you to specify URLs that map to specific application logic. When a request arrives, the router looks at the path (and possibly query parameters or other data) to decide which code to run.

---

## 1. Attribute-Based Routing vs. Convention-Based Routing

### 1.1 Convention-Based Routing

- **Definition**: Routing rules are defined in a **central place** (typically in `Program.cs` or older `Startup.cs` files) and apply to all controllers/actions by **naming conventions**.
- **Traditional MVC Style**:
  ```typescript
  // In ASP.NET Core's Program.cs (inside app.UseEndpoints or MapControllerRoute)
  app.MapControllerRoute(
      name: "default",
      pattern: "{controller=Home}/{action=Index}/{id?}"
  );
```

**pattern **describes the URL format:

**controller=Home** sets a default controller to Home if none is specified.

**action=Index **sets a default action to Index.

**id?** means an optional id parameter.

**How It Works:**

When a request like /Products/List/123 comes in:
The router extracts controller = "Products", action = "List", id = 123.
ASP.NET Core locates ProductsController.List(int id) and calls it

**1.2 Attribute-Based Routing**
Definition: Routing rules are defined directly on the controller or action via attributes, rather than a centralized route definition.

Example:

```typescript
[Route("api/[controller]")]
public class ProductsController : Controller
{
    [HttpGet]
    public IActionResult GetAll() { ... }

    [HttpGet("{id}")]
    public IActionResult GetById(int id) { ... }

    [HttpPost]
    public IActionResult Create(Product product) { ... }
}
```
[Route("api/[controller]")] sets a base route path. Here, [controller] is a placeholder for the controller name (Products).

Actions use [HttpGet], [HttpGet("{id}")], [HttpPost], etc. to declare their routes.

**Benefits:**

Fine-grained control: Each action can have its own route.

Routes are self-documenting, since they’re close to the actual code.

**2. Advanced Routing Concepts
2.1 Route Constraints**
Route constraints allow you to validate or restrict route parameters. For example:

```typescript
[HttpGet("{id:int}")]
public IActionResult GetById(int id) { ... }

[HttpGet("{slug:alpha}")]
public IActionResult GetBySlug(string slug) { ... }
```

:int ensures id is an integer.

:alpha ensures it’s alphabetic characters only.

Some commonly used constraints:

:int – Matches 32-bit integer values.

:bool – Matches true or false.

:alpha – Matches one or more alphabetic characters (a-z, A-Z).

:regex(expression) – Matches a regular expression pattern.

:minlength(value) / :maxlength(value) – Enforces string length boundaries.

:range(min, max) – Ensures the numeric parameter is within a range.

Global Constraints can also be registered, but typically you inline them.

**2.2 Custom Route Constraints**
If the built-in constraints aren’t enough, you can write a custom constraint by implementing IRouteConstraint:

```typescript
public class CustomConstraint : IRouteConstraint
{
    public bool Match(HttpContext httpContext, 
                      IRouter route, 
                      string routeKey, 
                      RouteValueDictionary values,
                      RouteDirection routeDirection)
    {
        if (!values.ContainsKey(routeKey)) return false;
        
        var value = values[routeKey]?.ToString();
        // Implement your validation logic
        return SomeValidationFunction(value);
    }
}
```
Then register it (in older MVC style):

```typescript
routes.MapRoute(
    name: "default",
    template: "{controller=Home}/{action=Index}/{id:customConstraint}"
);
```

**2.3 Custom Route Handlers**
For specialized scenarios, you can create a custom route handler (implementing IRouter in older versions, or using an endpoint-centric approach in .NET 6+). This is more rare and typically needed for:

Legacy or unusual URL patterns.
Highly dynamic URL matching or rewriting.
Building a custom routing system that bypasses standard controllers.

**2.4 MapWhen and UseWhen**
You can conditionally branch the pipeline (including routing logic) based on non-route criteria (e.g., query strings, headers):

```typescript
app.MapWhen(
    context => context.Request.Query.ContainsKey("debug"),
    builder =>
    {
        // This branch is only used if ?debug is present
        builder.Run(async ctx =>
        {
            await ctx.Response.WriteAsync("Debugging route");
        });
    }
);
```
While not strictly “routing,” it’s a related technique for conditional handling.

**3. Combining Routing Approaches
Mixed Approach:**

You can mix attribute-based and convention-based routing in the same application, though typically you choose one primary style for consistency.

Endpoints (Endpoint Routing) in ASP.NET Core 3.0+ unify routing for MVC, Razor Pages, gRPC, and more.

Use methods like app.MapControllers() to enable attribute routing for controllers.

Use app.MapControllerRoute() to define conventional routes.

```typescript
var builder = WebApplication.CreateBuilder(args);
var app = builder.Build();

app.MapControllers();  // Enables attribute routing
app.MapControllerRoute(
    name: "default",
    pattern: "{controller=Home}/{action=Index}/{id?}"
);

app.Run();
```