Advanced querying in EF Core covers several techniques for retrieving data in complex scenarios. This includes executing raw SQL commands, calling stored procedures, using interpolated SQL, writing complex LINQ queries and projections, and addressing common performance pitfalls like N+1 query issues through query splitting.

---

## 1. Raw SQL Queries, Stored Procedures, and Interpolated SQL

### **Raw SQL Queries**
- **Direct Execution:**  
  EF Core allows you to run raw SQL queries that return entity types. This can be useful when you need fine-grained control over the SQL or when working with legacy queries.
- **Example:**
```typescript
  var products = context.Products
                        .FromSqlRaw("SELECT * FROM Products WHERE Price > {0}", 100)
                        .ToList();
```

**Notes**:
Use parameter placeholders to avoid SQL injection and take advantage of SQL parameterization.

**Stored Procedures
Calling Stored Procedures:**
You can execute stored procedures using raw SQL commands.

Example:

```typescript
var result = context.Products
                    .FromSqlRaw("EXECUTE dbo.GetExpensiveProducts {0}", 100)
                    .ToList();
```

**Considerations:**
Stored procedures can encapsulate complex business logic within the database, but they also reduce portability and the benefits of LINQ's composability.

**Interpolated SQL Queries
Using Interpolated SQL:**
EF Core provides FromSqlInterpolated to simplify parameterization and improve readability.

Example:

```typescript
var minPrice = 100;
var products = context.Products
                      .FromSqlInterpolated($"SELECT * FROM Products WHERE Price > {minPrice}")
                      .ToList();
```

**Benefit:**
Automatically handles parameterization, reducing the risk of SQL injection while keeping your code clean.

**2. Using LINQ for Complex Queries and Projections
Complex Queries with LINQ
LINQ Power:**
EF Core allows you to write sophisticated queries using LINQ, including filtering, joining, grouping, and sorting.

Example:

```typescript
var query = from p in context.Products
            join c in context.Categories on p.CategoryId equals c.CategoryId
            where p.Price > 100
            orderby p.Name
            select new
            {
                ProductName = p.Name,
                CategoryName = c.Name,
                p.Price
            };

var results = query.ToList();
```

**Projections
Selecting Specific Data:**
Use LINQ projections (e.g., with the Select operator) to shape the result set, which can improve performance by only retrieving necessary fields.

Example:

```typescript
var productSummaries = context.Products
                              .Where(p => p.Price > 100)
                              .Select(p => new { p.Name, p.Price })
                              .ToList();
```

**Advanced Projections and Anonymous Types
Nested Projections:**
You can also project related data into nested anonymous types or DTOs.

Example:

```typescript
var detailedProducts = context.Products
                              .Where(p => p.Price > 100)
                              .Select(p => new 
                              {
                                  p.Name,
                                  p.Price,
                                  Category = new 
                                  {
                                      p.Category.Name,
                                      p.Category.Description
                                  }
                              })
                              .ToList();
```

**3. Handling N+1 Query Issues and Query Splitting
N+1 Query Problem
Definition:**
The N+1 query problem occurs when an application issues one query to retrieve a set of entities and then issues additional queries for each related entity, resulting in a large number of database calls.

**Example Scenario:**
Loading products and then accessing their categories one by one without eager loading can lead to this issue.

**Techniques to Avoid N+1 Problems
Eager Loading with Include:**
Use the Include method to fetch related data in a single query.

```typescript
var products = context.Products
                      .Include(p => p.Category)
                      .ToList();
```
**Explicit Loading:**
Load related entities after the initial query, but with control over when and how many queries are executed.

```typescript
var products = context.Products.ToList();
foreach (var product in products)
{
    context.Entry(product).Reference(p => p.Category).Load();
}
```

**Query Splitting
What is Query Splitting:**
Query splitting (or split queries) is an EF Core feature that splits a single LINQ query into multiple SQL queries to load related data. This can improve performance and reduce memory overhead when dealing with large object graphs.

**Enabling Split Queries:**

```typescript
var products = context.Products
                      .Include(p => p.OrderDetails)
                      .AsSplitQuery()
                      .ToList();
```
**Benefits:**

Reduces the complexity of the generated SQL.
Helps avoid cartesian explosion when joining large tables.

**Considerations:**

Split queries generate multiple round-trips to the database, so they must be evaluated against the cost of the joins in a single query.