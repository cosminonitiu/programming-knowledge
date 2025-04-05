EF Core is highly extensible, allowing you to tailor its default behavior to suit your application's specific needs. This customization can be achieved by overriding default conventions, using advanced Fluent API configurations, and extending EF Core with your own custom logic.

---

## 1. Overriding Default Conventions and Creating Custom Conventions

### **Default Conventions:**
- **What They Are:**  
  EF Core comes with a set of built-in conventions that automatically configure aspects of the model based on common patterns. For example, it conventionally treats properties named "Id" or "<EntityName>Id" as primary keys, and it infers relationships based on navigation property names.
- **When to Override:**  
  Sometimes the default conventions do not match your domain model or naming requirements. In such cases, you can override these conventions.

### **Overriding Conventions:**
- **Using Fluent API in OnModelCreating:**  
  In your `DbContext`, override the `OnModelCreating` method to modify or replace the default behavior.
  ```typescript
  protected override void OnModelCreating(ModelBuilder modelBuilder)
  {
      // Example: Override default pluralizing table name convention
      foreach (var entity in modelBuilder.Model.GetEntityTypes())
      {
          entity.SetTableName(entity.DisplayName());
      }
      
      // Remove cascade delete for all relationships by default
      foreach (var foreignKey in modelBuilder.Model.GetEntityTypes()
                                                    .SelectMany(e => e.GetForeignKeys()))
      {
          foreignKey.DeleteBehavior = DeleteBehavior.Restrict;
      }
  }
```

**Creating Custom Conventions:
Custom Conventions:**
You can create your own conventions by implementing logic that applies to the entire model. Although EF Core doesn't have a built-in mechanism for plugging in new conventions as seamlessly as previous EF versions, you can simulate this by writing reusable extension methods.

Example:
Create an extension method to apply a custom naming convention.

```typescript
public static class ModelBuilderExtensions
{
    public static ModelBuilder ApplyCustomNamingConvention(this ModelBuilder modelBuilder)
    {
        foreach (var entity in modelBuilder.Model.GetEntityTypes())
        {
            // Example: Prefix table names with "tbl_"
            entity.SetTableName("tbl_" + entity.DisplayName());
        }
        return modelBuilder;
    }
}
```
**And use it in OnModelCreating:**

```typescript
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.ApplyCustomNamingConvention();
}
```

**2. Advanced Fluent API Configurations for Complex Models
Why Use Fluent API?
Flexibility:**
Fluent API offers fine-grained control over the model configuration, which is particularly useful for complex scenarios that cannot be handled solely by data annotations.

**Separation of Concerns:**
It keeps your domain classes clean from persistence concerns.

**Examples of Advanced Configurations:
Mapping Complex Relationships:
Many-to-Many Relationships:
Configure many-to-many relationships using the Fluent API in EF Core 5+.**

```typescript
modelBuilder.Entity<StudentCourse>()
    .HasKey(sc => new { sc.StudentId, sc.CourseId });

modelBuilder.Entity<StudentCourse>()
    .HasOne(sc => sc.Student)
    .WithMany(s => s.StudentCourses)
    .HasForeignKey(sc => sc.StudentId);

modelBuilder.Entity<StudentCourse>()
    .HasOne(sc => sc.Course)
    .WithMany(c => c.StudentCourses)
    .HasForeignKey(sc => sc.CourseId);
```
**Inheritance Mapping:
Table Per Hierarchy (TPH):**

```typescript
modelBuilder.Entity<Employee>()
    .HasDiscriminator<string>("EmployeeType")
    .HasValue<Manager>("Manager")
    .HasValue<Developer>("Developer");
```
**Complex Types and Owned Entities:
Owned Types:**

```typescript
modelBuilder.Entity<Order>()
    .OwnsOne(o => o.ShippingAddress, sa =>
    {
        sa.Property(a => a.Street).HasColumnName("StreetAddress");
        sa.Property(a => a.City).HasMaxLength(100);
    });
```
**Computed Columns and Value Conversions:
Computed Columns:
**
```typescript
modelBuilder.Entity<Product>()
    .Property(p => p.FullDescription)
    .HasComputedColumnSql("[Name] + ' ' + [Description]");
```
**Value Conversions:**

```typescript
modelBuilder.Entity<Product>()
    .Property(p => p.Price)
    .HasConversion(
        v => v.ToString("F2"), 
        v => decimal.Parse(v)
    );
```

**3. Extending EF Core with Custom Logic and Behaviors
Custom Conventions and Interceptors:
Interceptors:**
Use interceptors to modify or extend behavior at runtime. For example, you can intercept command execution for logging, validation, or even modifying SQL.

;```typescript
public class MyCustomCommandInterceptor : DbCommandInterceptor
{
    public override InterceptionResult<DbDataReader> ReaderExecuting(
        DbCommand command, CommandEventData eventData, InterceptionResult<DbDataReader> result)
    {
        // Custom logic: Log or modify the command here
        Console.WriteLine($"Intercepted SQL: {command.CommandText}");
        return base.ReaderExecuting(command, eventData, result);
    }
};
```
**Register the interceptor in your DbContext configuration:**

;```typescript
optionsBuilder.AddInterceptors(new MyCustomCommandInterceptor());
```

**Extending the Model:
Custom Value Comparers:**
Create custom value comparers for types that require special comparison logic.

```typescript
var comparer = new ValueComparer<MyCustomType>(
    (c1, c2) => c1.Equals(c2),
    c => c.GetHashCode(),
    c => c // Assuming MyCustomType is immutable
);

modelBuilder.Entity<MyEntity>()
    .Property(e => e.CustomProperty)
    .Metadata.SetValueComparer(comparer);
```
**Using Custom Services:
Overriding EF Core Services:**
You can replace or extend core EF Core services by registering your own implementations in the dependency injection container. For instance, you might replace the default SQL generator with a custom one that supports additional SQL functions.

```typescript
services.AddEntityFrameworkSqlServer()
        .AddDbContext<AppDbContext>((serviceProvider, optionsBuilder) =>
        {
            optionsBuilder.UseSqlServer(connectionString);
            optionsBuilder.ReplaceService<ISqlGenerationHelper, MyCustomSqlGenerationHelper>();
        });
```