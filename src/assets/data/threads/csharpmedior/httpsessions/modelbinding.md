In ASP.NET Core, **model binding** automatically converts incoming HTTP request data (from route values, query strings, form fields, JSON bodies, etc.) into C# objects. **Validation** then checks these objects against defined rules, ensuring the data is valid before your application processes it.

---

## 1. Model Binding Basics

### 1.1 How Model Binding Works
When an HTTP request reaches an ASP.NET Core controller action, the **model binder** looks at:
- **Route Data** (e.g., `{id}` in your route template),
- **Query String** (e.g., `?page=2`),
- **Form Data** (if using a form with POST),
- **Request Body** (e.g., JSON in a REST API).

It uses **naming conventions** to match these inputs to your action method parameters or to the properties of complex objects.

### 1.2 Simple Example

```typescript
[HttpGet("products/{id}")]
public IActionResult GetProduct(int id)
{
    // Model binder automatically maps {id} from route to the 'id' parameter
    var product = _repository.GetProductById(id);
    return Ok(product);
}
```

The value id is taken from the route (products/{id}).
The int id parameter is automatically populated.

**1.3 Binding Complex Objects**
```typescript
public class SearchCriteria
{
    public string Query { get; set; }
    public int Page { get; set; }
    public int PageSize { get; set; }
}

[HttpGet("search")]
public IActionResult Search([FromQuery] SearchCriteria criteria)
{
    // The model binder looks for query parameters "Query", "Page", "PageSize"
    // and binds them to SearchCriteria properties.
    // e.g. /search?Query=laptop&Page=2&PageSize=20
    var results = _searchService.Search(criteria);
    return Ok(results);
}
```
[FromQuery] explicitly tells the binder to look in the query string for criteria properties.

Without this attribute, ASP.NET Core might also look in route data or other sources, but [FromQuery] is more explicit and recommended for clarity.

**2. Automatic Validation via Data Annotations**
Validation can be done via data annotation attributes on your model properties. ASP.NET Core can automatically check these and add any errors to ModelState.

**2.1 Common Data Annotations**
[Required] – Ensures the property is not null or empty.
[StringLength(100)] – Restricts the length of a string property.
[Range(min, max)] – Restricts a numeric or date value to a certain range.
[EmailAddress] – Validates that the property is a valid email format.
[Url] – Validates the property as a well-formed URL.
[RegularExpression("pattern")] – Validates against a regex pattern.

**2.2 Example Model**
```typescript
public class ProductCreateDto
{
    [Required]
    public string Name { get; set; }

    [StringLength(200)]
    public string Description { get; set; }

    [Range(0.01, 9999.99)]
    public decimal Price { get; set; }
}
```

**2.3 Validating in Controller Actions**
```typescript
[ApiController] // Enforces auto-model validation if using .NET Core 3.0+ or later
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    [HttpPost]
    public IActionResult CreateProduct([FromBody] ProductCreateDto productDto)
    {
        // If [ApiController] is present, invalid ModelState automatically results in a 400 Bad Request.
        // If you don't use [ApiController], you can manually check:
        // if (!ModelState.IsValid) { return BadRequest(ModelState); }

        var productId = _repository.CreateProduct(productDto);
        return CreatedAtAction(nameof(GetProduct), new { id = productId }, productDto);
    }

    [HttpGet("{id}")]
    public IActionResult GetProduct(int id)
    {
        var product = _repository.GetProductById(id);
        if (product == null) return NotFound();
        return Ok(product);
    }
}
```

**[ApiController] attribute:**
Automatically validates the model before the action executes.
If validation fails, returns 400 Bad Request with a summary of errors.

**Manually Checking (ModelState.IsValid):**
For older versions or advanced scenarios, you can manually handle model state.

**3. More Validation Techniques
3.1 Custom Validation Attributes**
Create custom validation attributes by inheriting from ValidationAttribute:

```typescript
public class ValidPriceAttribute : ValidationAttribute
{
    protected override ValidationResult IsValid(
        object value, 
        ValidationContext validationContext)
    {
        if (value is decimal decimalValue && decimalValue > 0 && decimalValue < 10000)
        {
            return ValidationResult.Success;
        }
        return new ValidationResult("Price must be between 0 and 10000.");
    }
}

// Usage
public class ProductCreateDto
{
    [Required]
    public string Name { get; set; }

    [ValidPrice]
    public decimal Price { get; set; }
}
```

**3.2 IValidatableObject Interface**
For advanced scenarios where you need to validate multiple properties together, implement IValidatableObject:

```typescript
public class Reservation : IValidatableObject
{
    public DateTime StartDate { get; set; }
    public DateTime EndDate { get; set; }

    public IEnumerable<ValidationResult> Validate(ValidationContext validationContext)
    {
        if (EndDate <= StartDate)
        {
            yield return new ValidationResult("End date must be after start date", new[] { "EndDate" });
        }
    }
}
```
**3.3 Fluent Validation or Other Libraries**
FluentValidation is a popular library offering a fluent API for validation rules.
Some teams prefer it over data annotations for testability and separation of concerns.

**4. Binding Sources**
In ASP.NET Core, you can control where data is bound from:

[FromBody] – Binds data from the request body (often JSON).
[FromQuery] – Binds data from the query string.
[FromRoute] – Binds data from the route parameters.
[FromHeader] – Binds data from HTTP headers.
[FromForm] – Binds form-data (e.g., posted from an HTML form).

```typescript
[HttpPost("upload")]
public IActionResult UploadFile([FromForm] IFormFile file)
{
    // Process uploaded file
    return Ok();
}
```