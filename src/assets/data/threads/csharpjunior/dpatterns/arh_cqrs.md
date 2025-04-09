## CQRS pattern  
Command Query Responsibility Segregation (CQRS) is a design pattern that segregates read and write operations for a data store into separate data models. This approach allows each model to be optimized independently and can improve the performance, scalability, and security of an application.  
<br>

### Context and problem  
In a traditional architecture, a single data model is often used for both read and write operations. This approach is straightforward and is suited for basic create, read, update, and delete (CRUD) operations.  
<br>

As applications grow, it can become increasingly difficult to optimize read and write operations on a single data model. Read and write operations often have different performance and scaling requirements. A traditional CRUD architecture doesn't take this asymmetry into account, which can result in the following challenges:  
<br>

```Data mismatch```: The read and write representations of data often differ. Some fields that are required during updates might be unnecessary during read operations.  
```Lock contention```: Parallel operations on the same data set can cause lock contention.  
```Performance problems```: The traditional approach can have a negative effect on performance because of load on the data store and data access layer, and the complexity of queries required to retrieve information.  
```Security challenges```: It can be difficult to manage security when entities are subject to read and write operations. This overlap can expose data in unintended contexts.  
<br>

Combining these responsibilities can result in an overly complicated model.  
<br>

## Solution  
Use the CQRS pattern to separate write operations, or commands, from read operations, or queries. Commands update data. Queries retrieve data. The CQRS pattern is useful in scenarios that require a clear separation between commands and reads.  
<br>

```Understand commands.``` Commands should represent specific business tasks instead of low-level data updates. For example, in a hotel-booking app, use the command "Book hotel room" instead of "Set ReservationStatus to Reserved." This approach better captures the intent of the user and aligns commands with business processes. To help ensure that commands are successful, you might need to refine the user interaction flow and server-side logic and consider asynchronous processing.  
<br>

```Area of refinement```	```Recommendation```  
```Client-side validation```	Validate specific conditions before you send the command to prevent obvious failures. For example, if no rooms are available, disable the "Book" button and provide a clear, user-friendly message in the UI that explains why booking isn’t possible. This setup reduces unnecessary server requests and provides immediate feedback to users, which enhances their experience.  
```Server-side logic```	Enhance the business logic to handle edge cases and failures gracefully. For example, to address race conditions such as multiple users attempting to book the last available room, consider adding users to a waiting list or suggesting alternatives.  
```Asynchronous processing```	Process commands asynchronously by placing them in a queue, instead of handling them synchronously.  
<br>

```Understand queries```. Queries never alter data. Instead, they return data transfer objects (DTOs) that present the required data in a convenient format, without any domain logic. This distinct separation of responsibilities simplifies the design and implementation of the system.  
<br>

## Separate read models and write models  
Separating the read model from the write model simplifies system design and implementation by addressing specific concerns for data writes and data reads. This separation improves clarity, scalability, and performance but introduces trade-offs. For example, scaffolding tools like object-relational mapping (O/RM) frameworks can't automatically generate CQRS code from a database schema, so you need custom logic to bridge the gap.  
<br>

The following sections describe two primary approaches to implement read model and write model separation in CQRS. Each approach has unique benefits and challenges, such as synchronization and consistency management.  
<br>

## Separate models in a single data store  
This approach represents the foundational level of CQRS, where both the read and write models share a single underlying database but maintain distinct logic for their operations. A basic CQRS architecture allows you to delineate the write model from the read model while relying on a shared data store.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_cqrs_1.png" alt="CQRS Pattern 1"></div>
<br>

This approach improves clarity, performance, and scalability by defining distinct models for handling read and write concerns.  
<br>

A ```write model``` is designed to handle commands that update or persist data. It includes validation and domain logic, and helps ensure data consistency by optimizing for transactional integrity and business processes.  
A ```read model``` is designed to serve queries for retrieving data. It focuses on generating DTOs or projections that are optimized for the presentation layer. It enhances query performance and responsiveness by avoiding domain logic.  
<br>

## Separate models in different data stores  
A more advanced CQRS implementation uses distinct data stores for the read and write models. Separation of the read and write data stores allows you to scale each model to match the load. It also enables you to use a different storage technology for each data store. You can use a document database for the read data store and a relational database for the write data store.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_cqrs_2.png" alt="CQRS Pattern 2"></div>  
<br>

When you use separate data stores, you must ensure that both remain synchronized. A common pattern is to have the write model publish events when it updates the database, which the read model uses to refresh its data. For more information about how to use events, see Event-driven architecture style. Because you usually can't enlist message brokers and databases into a single distributed transaction, challenges in consistency can occur when you update the database and publishing events. For more information, see Idempotent message processing.  
<br>

The read data store can use its own data schema that's optimized for queries. For example, it can store a materialized view of the data to avoid complex joins or O/RM mappings. The read data store can be a read-only replica of the write store or have a different structure. Deploying multiple read-only replicas can improve performance by reducing latency and increasing availability, especially in distributed scenarios.  
<br>

## Benefits of CQRS  
&nbsp;&nbsp;1. Independent scaling. CQRS enables the read models and write models to scale independently. This approach can help minimize lock contention and improve system performance under load.  
&nbsp;&nbsp;2. Optimized data schemas. Read operations can use a schema that's optimized for queries. Write operations use a schema that's optimized for updates.  
&nbsp;&nbsp;3. Security. By separating reads and writes, you can ensure that only the appropriate domain entities or operations have permission to perform write actions on the data.  
&nbsp;&nbsp;4. Separation of concerns. Separating the read and write responsibilities results in cleaner, more maintainable models. The write side typically handles complex business logic. The read side can remain simple and focused on query efficiency.  
&nbsp;&nbsp;5. Simpler queries. When you store a materialized view in the read database, the application can avoid complex joins when it queries.  
<br>

## Problems and considerations  
Consider the following points as you decide how to implement this pattern:  
<br>

&nbsp;&nbsp;1. Increased complexity. The core concept of CQRS is straightforward, but it can introduce significant complexity into the application design, specifically when combined with the Event Sourcing pattern.  
&nbsp;&nbsp;2. Messaging challenges. Messaging isn't a requirement for CQRS, but you often use it to process commands and publish update events. When messaging is included, the system must account for potential problems such as message failures, duplicates, and retries. For more information about strategies to handle commands that have varying priorities, see Priority queues.  
&nbsp;&nbsp;3. Eventual consistency. When the read databases and write databases are separated, the read data might not show the most recent changes immediately. This delay results in stale data. Ensuring that the read model store stays up-to-date with changes in the write model store can be challenging.   Also, detecting and handling scenarios where a user acts on stale data requires careful consideration.  
<br>

## When to use this pattern  
### Use this pattern when:  
&nbsp;&nbsp;1. You work in collaborative environments. In environments where multiple users access and modify the same data simultaneously, CQRS helps reduce merge conflicts. Commands can include enough granularity to prevent conflicts, and the system can resolve any conflicts that occur within the command logic.  
&nbsp;&nbsp;2. You have task-based user interfaces. Applications that guide users through complex processes as a series of steps or with complex domain models benefit from CQRS.  
&nbsp;&nbsp;3. The write model has a full command-processing stack with business logic, input validation, and business validation. The write model might treat a set of associated objects as a single unit for data changes, which is known as an aggregate in domain-driven design terminology. The write model might also help ensure that these objects are always in a consistent state.  
&nbsp;&nbsp;4. The read model has no business logic or validation stack. It returns a DTO for use in a view model. The read model is eventually consistent with the write model.  
&nbsp;&nbsp;5. You need performance tuning. Systems where the performance of data reads must be fine-tuned separately from performance of data writes benefit from CQRS. This pattern is especially beneficial when the number of reads is greater than the number of writes. The read model scales horizontally to handle large query volumes. The write model runs on fewer instances to minimize merge conflicts and maintain consistency.  
&nbsp;&nbsp;6. You have separation of development concerns. CQRS allows teams to work independently. One team implements the complex business logic in the write model, and another team develops the read model and user interface components.  
&nbsp;&nbsp;7. You have evolving systems. CQRS supports systems that evolve over time. It accommodates new model versions, frequent changes to business rules, or other modifications without affecting existing functionality.  
&nbsp;&nbsp;8. You need system integration: Systems that integrate with other subsystems, especially systems that use the Event Sourcing pattern, remain available even if a subsystem temporarily fails. CQRS isolates failures, which prevents a single component from affecting the entire system.  
<br>

### This pattern might not be suitable when:  
&nbsp;&nbsp;1. The domain or the business rules are simple.  
&nbsp;&nbsp;2. A simple CRUD-style user interface and data access operations are sufficient.  
<br>

## Materialized View pattern  
Generate prepopulated views over the data in one or more data stores when the data isn't ideally formatted for required query operations. This can help support efficient querying and data extraction, and improve application performance.  
<br>

## Context and problem  
When storing data, the priority for developers and data administrators is often focused on how the data is stored, as opposed to how it's read. The chosen storage format is usually closely related to the format of the data, requirements for managing data size and data integrity, and the kind of store in use. For example, when using NoSQL document store, the data is often represented as a series of aggregates, each containing all of the information for that entity.  
<br>

However, this can have a negative effect on queries. When a query only needs a subset of the data from some entities, such as a summary of orders for several customers without all of the order details, it must extract all of the data for the relevant entities in order to obtain the required information.  
<br>

## Solution  
To support efficient querying, a common solution is to generate, in advance, a view that materializes the data in a format suited to the required results set. The Materialized View pattern describes generating prepopulated views of data in environments where the source data isn't in a suitable format for querying, where generating a suitable query is difficult, or where query performance is poor due to the nature of the data or the data store.  
<br>

These materialized views, which only contain data required by a query, allow applications to quickly obtain the information they need. In addition to joining tables or combining data entities, materialized views can include the current values of calculated columns or data items, the results of combining values or executing transformations on the data items, and values specified as part of the query. A materialized view can even be optimized for just a single query.  
<br>

A key point is that a materialized view and the data it contains is completely disposable because it can be entirely rebuilt from the source data stores. A materialized view is never updated directly by an application, and so it's a specialized cache.  
<br>

When the source data for the view changes, the view must be updated to include the new information. You can schedule this to happen automatically, or when the system detects a change to the original data. In some cases it might be necessary to regenerate the view manually. The figure shows an example of how the Materialized View pattern might be used.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_cqrs_3.png" alt="CQRS Pattern 3"></div>  
<br>

## Issues and considerations  
Consider the following points when deciding how to implement this pattern:  
<br>

How and when the view will be updated. Ideally it'll regenerate in response to an event indicating a change to the source data, although this can lead to excessive overhead if the source data changes rapidly. Alternatively, consider using a scheduled task, an external trigger, or a manual action to regenerate the view.  
<br>

In some systems, such as when using the Event Sourcing pattern to maintain a store of only the events that modified the data, materialized views are necessary. Prepopulating views by examining all events to determine the current state might be the only way to obtain information from the event store. If you're not using Event Sourcing, you need to consider whether a materialized view is helpful or not. Materialized views tend to be specifically tailored to one, or a small number of queries. If many queries are used, materialized views can result in unacceptable storage capacity requirements and storage cost.  
<br>

Consider the impact on data consistency when generating the view, and when updating the view if this occurs on a schedule. If the source data is changing at the point when the view is generated, the copy of the data in the view won't be fully consistent with the original data.  
<br>

Consider where you'll store the view. The view doesn't have to be located in the same store or partition as the original data. It can be a subset from a few different partitions combined.  
<br>

A view can be rebuilt if lost. Because of that, if the view is transient and is only used to improve query performance by reflecting the current state of the data, or to improve scalability, it can be stored in a cache or in a less reliable location.  
<br>

When defining a materialized view, maximize its value by adding data items or columns to it based on computation or transformation of existing data items, on values passed in the query, or on combinations of these values when appropriate.   
<br>

Where the storage mechanism supports it, consider indexing the materialized view to further increase performance. Most relational databases support indexing for views, as do big data solutions based on Apache Hadoop.  
<br>

## When to use this pattern  
### This pattern is useful when:  

&nbsp;&nbsp;1. Creating materialized views over data that's difficult to query directly, or where queries must be very complex to extract data that's stored in a normalized, semi-structured, or unstructured way.  
&nbsp;&nbsp;2. Creating temporary views that can dramatically improve query performance, or can act directly as source views or data transfer objects for the UI, for reporting, or for display.  
&nbsp;&nbsp;3. Supporting occasionally connected or disconnected scenarios where connection to the data store isn't always available. The view can be cached locally in this case.  
&nbsp;&nbsp;4. Simplifying queries and exposing data for experimentation in a way that doesn't require knowledge of the source data format. For example, by joining different tables in one or more databases, or one or more domains in NoSQL stores, and then formatting the data to fit its eventual use.  
&nbsp;&nbsp;5. Providing access to specific subsets of the source data that, for security or privacy reasons, shouldn't be generally accessible, open to modification, or fully exposed to users.  
&nbsp;&nbsp;6. Bridging different data stores, to take advantage of their individual capabilities. For example, using a cloud store that's efficient for writing as the reference data store, and a relational database that offers good query and read performance to hold the materialized views.  
&nbsp;&nbsp;7. When using microservices, you are recommended to keep them loosely coupled, including their data storage. Therefore, materialized views can help you consolidate data from your services. If materialized views are not appropriate in your microservices architecture or specific scenario, please consider having well-defined boundaries that align to domain driven design (DDD) and aggregate their data when requested.  
<br>

### This pattern isn't useful in the following situations:  

&nbsp;&nbsp;1. The source data is simple and easy to query.  
&nbsp;&nbsp;2. The source data changes very quickly, or can be accessed without using a view. In these cases, you should avoid the processing overhead of creating views.  
&nbsp;&nbsp;3. Consistency is a high priority. The views might not always be fully consistent with the original data.  
<br>

## Example  
The following figure shows an example of using the Materialized View pattern to generate a summary of sales. Data in the Order, OrderItem, and Customer tables in separate partitions in an Azure storage account are combined to generate a view containing the total sales value for each product in the Electronics category, along with a count of the number of customers who made purchases of each item.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_cqrs_4.png" alt="CQRS Pattern 4"></div>  
<br>

Creating this materialized view requires complex queries. However, by exposing the query result as a materialized view, users can easily obtain the results and use them directly or incorporate them in another query. The view is likely to be used in a reporting system or dashboard, and can be updated on a scheduled basis such as weekly.  
<br>

## Combine the Event Sourcing and CQRS patterns  
Some implementations of CQRS incorporate the Event Sourcing pattern. This pattern stores the system's state as a chronological series of events. Each event captures the changes made to the data at a specific time. To determine the current state, the system replays these events in order. In this setup:  
<br>

The event store is the write model and the single source of truth.  
The read model generates materialized views from these events, typically in a highly denormalized form. These views optimize data retrieval by tailoring structures to query and display requirements.  
<br>

### Benefits of combining the Event Sourcing and CQRS patterns  
The same events that update the write model can serve as inputs to the read model. The read model can then build a real-time snapshot of the current state. These snapshots optimize queries by providing efficient and precomputed views of the data.  
<br>

Instead of directly storing the current state, the system uses a stream of events as the write store. This approach reduces update conflicts on aggregates and enhances performance and scalability. The system can process these events asynchronously to build or update materialized views for the read data store.  
<br>

Because the event store acts as the single source of truth, you can easily regenerate materialized views or adapt to changes in the read model by replaying historical events. Basically, materialized views function as a durable, read-only cache that's optimized for fast and efficient queries.  
<br>

### Considerations for how to combine the Event Sourcing and CQRS patterns  
Before you combine the CQRS pattern with the Event Sourcing pattern, evaluate the following considerations:  
<br>

&nbsp;&nbsp;1. ```Eventual consistency```: Because the write and read data stores are separate, updates to the read data store might lag behind event generation. This delay results in eventual consistency.  
<br>

&nbsp;&nbsp;2. ```Increased complexity```: Combining the CQRS pattern with the Event Sourcing pattern requires a different design approach, which can make a successful implementation more challenging. You must write code to generate, process, and handle events, and assemble or update views for the read model. However, the Event Sourcing pattern simplifies domain modeling and allows you to rebuild or create new views easily by preserving the history and intent of all data changes.  
<br>

&nbsp;&nbsp;3. ```Performance of view generation```: Generating materialized views for the read model can consume significant time and resources. The same applies to projecting data by replaying and processing events for specific entities or collections. Complexity increases when calculations involve analyzing or summing values over long periods because all related events must be examined. Implement snapshots of the data at regular intervals. For example, store the current state of an entity or periodic snapshots of aggregated totals, which is the number of times a specific action occurs. Snapshots reduce the need to process the full event history repeatedly, which improves performance.  
<br>

## Example  
The following code shows extracts from an example of a CQRS implementation that uses different definitions for the read models and the write models. The model interfaces don't dictate features of the underlying data stores, and they can evolve and be fine-tuned independently because these interfaces are separate.  
<br>

The following code shows the read model definition.  
```typescript
// Query interface
namespace ReadModel
{
  public interface ProductsDao
  {
    ProductDisplay FindById(int productId);
    ICollection<ProductDisplay> FindByName(string name);
    ICollection<ProductInventory> FindOutOfStockProducts();
    ICollection<ProductDisplay> FindRelatedProducts(int productId);
  }

  public class ProductDisplay
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public string Description { get; set; }
    public decimal UnitPrice { get; set; }
    public bool IsOutOfStock { get; set; }
    public double UserRating { get; set; }
  }

  public class ProductInventory
  {
    public int Id { get; set; }
    public string Name { get; set; }
    public int CurrentStock { get; set; }
  }
}
```  
The system allows users to rate products. The application code does this by using the RateProduct command shown in the following code.  
```typescript
public interface ICommand
{
  Guid Id { get; }
}

public class RateProduct : ICommand
{
  public RateProduct()
  {
    this.Id = Guid.NewGuid();
  }
  public Guid Id { get; set; }
  public int ProductId { get; set; }
  public int Rating { get; set; }
  public int UserId {get; set; }
}
```  
The system uses the ProductsCommandHandler class to handle commands that the application sends. Clients typically send commands to the domain through a messaging system such as a queue. The command handler accepts these commands and invokes methods of the domain interface. The granularity of each command is designed to reduce the chance of conflicting requests. The following code shows an outline of the ProductsCommandHandler class.  
```typescript
public class ProductsCommandHandler :
    ICommandHandler<AddNewProduct>,
    ICommandHandler<RateProduct>,
    ICommandHandler<AddToInventory>,
    ICommandHandler<ConfirmItemShipped>,
    ICommandHandler<UpdateStockFromInventoryRecount>
{
  private readonly IRepository<Product> repository;

  public ProductsCommandHandler (IRepository<Product> repository)
  {
    this.repository = repository;
  }

  void Handle (AddNewProduct command)
  {
    ...
  }

  void Handle (RateProduct command)
  {
    var product = repository.Find(command.ProductId);
    if (product != null)
    {
      product.RateProduct(command.UserId, command.Rating);
      repository.Save(product);
    }
  }

  void Handle (AddToInventory command)
  {
    ...
  }

  void Handle (ConfirmItemsShipped command)
  {
    ...
  }

  void Handle (UpdateStockFromInventoryRecount command)
  {
    ...
  }
}
```  