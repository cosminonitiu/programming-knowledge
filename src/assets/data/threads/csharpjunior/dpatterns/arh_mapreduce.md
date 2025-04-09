## MapReduce Pattern  
https://weblogs.asp.net/podwysocki/exploring-mapreduce-with-f  
https://dzone.com/articles/mapreduce-design-patterns  
<br>

The MapReduce pattern is a programming model for processing large datasets in parallel across distributed systems, breaking tasks into map and reduce phases. In C#, this pattern can be implemented using functional programming concepts or LINQ operations, enabling scalable big data processing.  
<br>

### MapReduce Overview  
&nbsp;&nbsp;1. ```Map Phase```:  
Transforms input data into intermediate key-value pairs.  
Example: Splitting text into words and emitting each word as a key with a value of 1.  
<br>

&nbsp;&nbsp;2. ```Shuffle Phase```:  
Groups intermediate data by key (automatic in distributed systems like Hadoop).  
<br>

&nbsp;&nbsp;3. ```Reduce Phase```:  
Aggregates values for each key to produce final results (e.g., summing counts).  
<br>

### C# Implementation Using LINQ  
MapReduce can be modeled using LINQ operations:  
<br>

```SelectMany (Map)```: Processes each input item into multiple intermediate pairs.  
```GroupBy (Shuffle)```: Groups pairs by key.  
```Aggregate (Reduce)```: Combines grouped values.  
<br>

#### Example: Word Count  
```typescript
var input = new[] { "hello world", "hello mapreduce" };

// Map: Split sentences into words and emit (word, 1)
var mapped = input.SelectMany(sentence => 
    sentence.Split(' ').Select(word => new { Key = word, Value = 1 })
);

// Shuffle: Group by word (automatic via GroupBy)
var grouped = mapped.GroupBy(pair => pair.Key);

// Reduce: Sum counts for each word
var reduced = grouped.Select(group => 
    new { Key = group.Key, Count = group.Sum(pair => pair.Value) }
);

// Output: [{ Key = "hello", Count = 2 }, { Key = "world", Count = 1 }, ...]
```  
<br>

## Design Patterns for Big Data  
### Input-Map-Reduce-Output  
Use Case: Aggregating data (e.g., calculating total sales per region).  
<br>

Steps:  
Map: Emit (Region, SaleAmount).  
Reduce: Sum amounts by region.  
<br>

### Input-Map-Combiner-Reduce-Output  
Use Case: Optimizing performance by reducing data early (e.g., local aggregation before shuffling).  
<br>

Combiner: Acts as a mini-reducer on mapper outputs to minimize network traffic.  
<br>

### Multiple Input Sources  
Use Case: Merging data from disparate schemas (e.g., joining user logs with metadata).  
Map: Normalize inputs into a common format before reducing.  
<br>

## When to Use MapReduce in C#  
&nbsp;&nbsp;1. ```Large Datasets```: Ideal for batch processing terabytes of data across clusters.  
&nbsp;&nbsp;2. ```Embarrassingly Parallel Problems```: Tasks like log analysis, ETL, or indexing.  
&nbsp;&nbsp;3. ```Fault Tolerance```: Built-in retries for node failures in frameworks like Hadoop.  
<br>

### Key Considerations  
Scalability: Use frameworks like Hadoop/Spark for distributed execution.
Functional Style: Avoid side effects in map/reduce functions for thread safety.  
<br>

### Optimization:  
Combiners reduce network load by pre-aggregating data.  
Partitioning ensures even distribution of keys across reducers.  
By leveraging LINQ or distributed frameworks, C# developers can apply the MapReduce pattern to efficiently process big data while maintaining code clarity and scalability.  
<br>

## Examples  
### 1. Word Count  
This is the classic MapReduce example, where the goal is to count the occurrences of each word in a large collection of text documents.  
```typescript
var documents = new[] { "hello world", "hello mapreduce", "mapreduce is powerful" };

// Map: Split sentences into words and emit (word, 1)
var mapped = documents.SelectMany(doc => 
    doc.Split(' ').Select(word => new { Key = word, Value = 1 })
);

// Shuffle: Group by word
var grouped = mapped.GroupBy(pair => pair.Key);

// Reduce: Sum counts for each word
var reduced = grouped.Select(group => 
    new { Word = group.Key, Count = group.Sum(pair => pair.Value) }
);

// Output: [{ Word = "hello", Count = 2 }, { Word = "world", Count = 1 }, ...]
foreach (var result in reduced)
{
    Console.WriteLine($"{result.Word}: {result.Count}");
}
```  
Use Case: Analyzing logs, indexing documents, or summarizing text data.  
<br>

### 2. Sales Data Aggregation  
Aggregate sales data to calculate total revenue per region or product.  
Scenario: You have a dataset where each entry represents a sale with attributes like Region, Product, and Amount.  

```typescript
var salesData = new[]
{
    new { Region = "North", Product = "A", Amount = 100 },
    new { Region = "South", Product = "B", Amount = 200 },
    new { Region = "North", Product = "A", Amount = 150 },
    new { Region = "South", Product = "B", Amount = 300 }
};

// Map: Emit (Region, Amount)
var mappedSales = salesData.Select(sale => new { Key = sale.Region, Value = sale.Amount });

// Shuffle: Group by Region
var groupedSales = mappedSales.GroupBy(sale => sale.Key);

// Reduce: Sum amounts for each region
var reducedSales = groupedSales.Select(group => 
    new { Region = group.Key, TotalRevenue = group.Sum(sale => sale.Value) }
);

// Output: [{ Region = "North", TotalRevenue = 250 }, { Region = "South", TotalRevenue = 500 }]
foreach (var result in reducedSales)
{
    Console.WriteLine($"{result.Region}: ${result.TotalRevenue}");
}
```  
Use Case: Financial reporting or regional performance analysis.

### 3. Log Analysis  
Analyze server logs to count the frequency of error codes.  
Scenario: Logs contain entries with timestamps and error codes. The goal is to count how often each error code appears.  
```typescript
var logs = new[]
{
    "2025-04-09 12:00:00 ERROR_404",
    "2025-04-09 12:01:00 ERROR_500",
    "2025-04-09 12:02:00 ERROR_404",
    "2025-04-09 12:03:00 ERROR_403"
};

// Map: Extract error codes and emit (ErrorCode, 1)
var mappedLogs = logs.Select(log => 
{
    var errorCode = log.Split(' ')[2]; // Extracting the error code
    return new { Key = errorCode, Value = 1 };
});

// Shuffle: Group by ErrorCode
var groupedLogs = mappedLogs.GroupBy(log => log.Key);

// Reduce: Count occurrences of each error code
var reducedLogs = groupedLogs.Select(group => 
    new { ErrorCode = group.Key, Count = group.Sum(log => log.Value) }
);

// Output: [{ ErrorCode="ERROR_404", Count=2 }, ...]
foreach (var result in reducedLogs)
{
    Console.WriteLine($"{result.ErrorCode}: {result.Count}");
}
```  
Use Case: Monitoring system health and troubleshooting issues.

### 4. E-commerce Analytics  
Analyze customer purchases to find the most popular products.  
Scenario: Each purchase record contains a ProductID and a Quantity. The goal is to find the total quantity sold for each product.  
```typescript
var purchases = new[]
{
    new { ProductID = "P001", Quantity = 2 },
    new { ProductID = "P002", Quantity = 5 },
    new { ProductID = "P001", Quantity = 3 },
    new { ProductID = "P003", Quantity = 7 }
};

// Map: Emit (ProductID, Quantity)
var mappedPurchases = purchases.Select(purchase => 
    new { Key = purchase.ProductID, Value = purchase.Quantity });

// Shuffle: Group by ProductID
var groupedPurchases = mappedPurchases.GroupBy(purchase => purchase.Key);

// Reduce: Sum quantities for each product
var reducedPurchases = groupedPurchases.Select(group => 
    new { ProductID = group.Key, TotalQuantitySold = group.Sum(purchase => purchase.Value) }
);

// Output: [{ ProductID="P001", TotalQuantitySold=5 }, ...]
foreach (var result in reducedPurchases)
{
    Console.WriteLine($"{result.ProductID}: {result.TotalQuantitySold}");
}
```  
Use Case: Inventory management or sales trend analysis.

### 5. Social Media Analytics  
Count hashtag usage across posts to identify trending topics.  
Scenario: Process a dataset of social media posts to count occurrences of hashtags.  
```typescript
var posts = new[]
{
    "#CSharp is awesome! #Programming",
    "#Programming with #CSharp",
    "#BigData #MapReduce"
};

// Map: Extract hashtags and emit (Hashtag, 1)
var mappedHashtags = posts.SelectMany(post =>
    post.Split(' ').Where(word => word.StartsWith("#")).Select(hashtag => 
        new { Key = hashtag, Value = 1 })
);

// Shuffle: Group by Hashtag
var groupedHashtags = mappedHashtags.GroupBy(hashtag => hashtag.Key);

// Reduce: Count occurrences of each hashtag
var reducedHashtags = groupedHashtags.Select(group =>
    new { Hashtag = group.Key, Count = group.Sum(hashtag => hashtag.Value) }
);

// Output hashtags with counts
foreach (var result in reducedHashtags)
{
    Console.WriteLine($"{result.Hashtag}: {result.Count}");
}
```  
Use Case: Social media trend analysis or marketing insights.