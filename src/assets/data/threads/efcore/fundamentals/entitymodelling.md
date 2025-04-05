Entity modeling is at the core of using EF Core effectively. It involves defining your domain classes (entities) and how they relate to each other, as well as configuring how these entities map to the database schema.

---

## 1. Defining Entities and Relationships

### **Defining Entities**
- **Entities:**  
  These are the .NET classes that represent data in your application. Each entity typically maps to a table in your database.
  
- **Example:**
```typescript
  public class Product
  {
      public int ProductId { get; set; }
      public string Name { get; set; }
      public decimal Price { get; set; }
      
      // Navigation property to related entities.
      public ICollection<OrderDetail> OrderDetails { get; set; }
  }
  
  public class OrderDetail
  {
      public int OrderDetailId { get; set; }
      public int Quantity { get; set; }
      
      // Foreign keys and navigation properties.
      public int ProductId { get; set; }
      public Product Product { get; set; }
  }
```

**Relationships
One-to-Many:**
One entity (e.g., Product) can be related to many instances of another entity (e.g., OrderDetail).

**One-to-One & Many-to-Many:**
EF Core supports these relationships as well, using foreign key properties and navigation properties to define them.

**Data Annotations vs. Fluent API
Data Annotations
What They Are:**
Attributes placed directly on your entity classes and properties to control how they map to the database.

**Advantages:**
Simple and declarative.
Easy to see mapping details in the class itself.

**Limitations:**
Less flexible for complex configurations.
Example:

```typescript
public class Customer
{
    public int CustomerId { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }
    
    // Foreign key example
    public int AddressId { get; set; }
    public Address Address { get; set; }
}
```
**Fluent API
What It Is:**
A configuration approach that uses code in the OnModelCreating method of your DbContext to configure mappings.

**Advantages:**
Greater flexibility and control.
Useful for complex mappings or when you prefer to keep your domain classes clean.

Example:

```typescript
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Customer>(entity =>
    {
        entity.HasKey(e => e.CustomerId);
        entity.Property(e => e.Name)
              .IsRequired()
              .HasMaxLength(100);
        
        entity.HasOne(e => e.Address)
              .WithMany(a => a.Customers)
              .HasForeignKey(e => e.AddressId);
    });
}
```

**2. Mapping Configurations: Table Splitting, Inheritance, Owned Types
Table Splitting**
Definition:
Table splitting allows you to map multiple entities to the same database table. This is useful when entities share a one-to-one relationship and logically belong together.

Example:

```typescript
public class User
{
    public int Id { get; set; }
    public string Username { get; set; }
    public UserProfile Profile { get; set; }
}

public class UserProfile
{
    public int Id { get; set; }
    public string Bio { get; set; }
    public string ProfilePictureUrl { get; set; }
}```
```typescript
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<User>()
        .ToTable("Users")
        .HasOne(u => u.Profile)
        .WithOne()
        .HasForeignKey<UserProfile>(p => p.Id);
    
    // Map UserProfile to the same table.
    modelBuilder.Entity<UserProfile>().ToTable("Users");
}
```

**Inheritance**
**Strategies:**

**Table per Hierarchy (TPH):**
All types in an inheritance hierarchy are mapped to a single table with a discriminator column.

**Table per Type (TPT):**
Each type is mapped to its own table, with tables joined on the primary key.

**Table per Concrete Type (TPC):**
Each non-abstract type gets its own table without shared columns.

**Example (TPH):**

```typescript
public abstract class Employee
{
    public int EmployeeId { get; set; }
    public string Name { get; set; }
}

public class Manager : Employee
{
    public string Department { get; set; }
}

public class Developer : Employee
{
    public string ProgrammingLanguage { get; set; }
}
```
```typescript
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Employee>()
        .HasDiscriminator<string>("EmployeeType")
        .HasValue<Manager>("Manager")
        .HasValue<Developer>("Developer");
}
```

**Owned Types
Definition:**
Owned types are used to represent complex value objects that do not have their own identity and are always part of another entity.

**Benefits:**
Encapsulate value object logic within the owning entity.
Stored in the same table as the owner, simplifying the schema.

Example:

```typescript
public class Order
{
    public int OrderId { get; set; }
    public ShippingAddress Address { get; set; }
}

[Owned]
public class ShippingAddress
{
    public string Street { get; set; }
    public string City { get; set; }
    public string ZipCode { get; set; }
}
```
```typescript
protected override void OnModelCreating(ModelBuilder modelBuilder)
{
    modelBuilder.Entity<Order>().OwnsOne(o => o.Address);
}
```