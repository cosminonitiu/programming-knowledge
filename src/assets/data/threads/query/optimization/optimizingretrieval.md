When dealing with large datasets (e.g., millions of records), it's crucial to optimize data retrieval and processing to ensure performance, scalability, and memory efficiency. Two key techniques for handling such datasets are pagination and yield return. Below is a detailed explanation of how to use these techniques effectively.

**1. Pagination**
Definition: Pagination is the process of dividing a large dataset into smaller, manageable chunks (pages) and retrieving them one at a time.
Purpose: Reduces memory usage and improves performance by fetching only the required subset of data.

Common Use Cases:
Displaying data in a user interface (e.g., tables, grids).
Processing large datasets in batches.

**a. Offset-Based Pagination**
How It Works: Uses LIMIT and OFFSET clauses to fetch a specific page of data.
**b. Keyset Pagination (Cursor-Based Pagination)**
How It Works: Uses a unique key (e.g., id) to fetch the next page of data.

**2. yield return**
Definition: yield return is a C# feature that enables lazy evaluation, allowing you to generate and return elements one at a time without loading the entire dataset into memory.
Purpose: Improves memory efficiency by processing data on-demand.
Use Case: Iterating over large datasets without loading all records into memory.

```typescript
IEnumerable<Record> FetchRecords(int pageSize) {
    int offset = 0;
    while (true) {
        var records = FetchPageFromDatabase(offset, pageSize);
        if (records.Count == 0) yield break;
        foreach (var record in records) {
            yield return record;
        }
        offset += pageSize;
    }
}

List<Record> FetchPageFromDatabase(int offset, int pageSize) {
    // Simulate fetching a page of records from the database.
    return Enumerable.Range(offset, pageSize)
        .Select(i => new Record { Id = i, Data = $"Record {i}" })
        .ToList();
}

class Record {
    public int Id { get; set; }
    public string Data { get; set; }
}
```

**3. Combining Pagination and yield return**
By combining pagination and yield return, you can efficiently process large datasets while minimizing memory usage.

```typescript
IEnumerable<Record> FetchAllRecords(int pageSize) {
    int offset = 0;
    while (true) {
        var records = FetchPageFromDatabase(offset, pageSize);
        if (records.Count == 0) yield break;
        foreach (var record in records) {
            yield return record;
        }
        offset += pageSize;
    }
}

List<Record> FetchPageFromDatabase(int offset, int pageSize) {
    // Simulate fetching a page of records from the database.
    return Enumerable.Range(offset, pageSize)
        .Select(i => new Record { Id = i, Data = $"Record {i}" })
        .ToList();
}

class Record {
    public int Id { get; set; }
    public string Data { get; set; }
}

// Usage:
foreach (var record in FetchAllRecords(pageSize: 1000)) {
    Console.WriteLine(record.Data);
}
```