## Event Sourcing pattern  
Instead of storing just the current state of the data in a relational database, store the full series of actions taken on an object in an append-only store. The store acts as the system of record and can be used to materialize the domain objects. This approach can improve performance, scalability, and auditability in complex systems.  
<br>

## Context and problem  
Most applications work with data, and the typical approach is for the application to store the latest state of the data in a relational database, inserting or updating data as required. For example, in the traditional create, read, update, and delete (CRUD) model, a typical data process is to read data from the store, make some modifications to it, and update the current state of the data with the new values—often by using transactions that lock the data.  
<br>

The CRUD approach is straightforward and fast for most scenarios. However, in high-load systems, this approach has some challenges:  
<br>

&nbsp;&nbsp;1. Performance: As the system scales, the performance will degrade due to contention for resources and locking issues.  
&nbsp;&nbsp;2. Scalability: CRUD systems are synchronous and data operations block on updates. This can lead to bottlenecks and higher latency when the system is under load.  
&nbsp;&nbsp;3. Auditability: CRUD systems only store the latest state of the data. Unless there's an auditing mechanism that records the details of each operation in a separate log, history is lost.  
<br>

## Solution  
The Event Sourcing pattern defines an approach to handling operations on data that's driven by a sequence of events, each of which is recorded in an append-only store. Application code raises events that imperatively describe the action taken on the object. The events are generally sent to a queue where a separate process, an event handler, listens to the queue and persists the events in an event store. Each event represents a logical change to the object, such as AddedItemToOrder or OrderCanceled.  
<br>

The events are persisted in an event store that acts as the system of record (the authoritative data source) about the current state of the data. Additional event handlers can listen for events they are interested in and take an appropriate action. Consumers could, for example, initiate tasks that apply the operations in the events to other systems, or perform any other associated action that's required to complete the operation. Notice that the application code that generates the events is decoupled from the systems that subscribe to the events.  
<br>

At any point, it's possible for applications to read the history of events. You can then use the events to materialize the current state of an entity by playing back and consuming all the events that are related to that entity. This process can occur on demand to materialize a domain object when handling a request.  
<br>

Because it is relatively expensive to read and replay events, applications typically implement materialized views, read-only projections of the event store that are optimized for querying. For example, a system can maintain a materialized view of all customer orders that's used to populate the UI. As the application adds new orders, adds or removes items on the order, or adds shipping information, events are raised and a handler updates the materialized view.  
<br>

The figure shows an overview of the pattern, including some typical implementations with the pattern, including the use of a queue, a read-only store, integrating events with external applications and systems, and replaying events to create projections of the current state of specific entities.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_eventsourcing_1.png" alt="Event Sourcing Pattern 1"></div>  
<br>

## Workflow  
The following describes a typical workflow for this pattern:  
<br>

&nbsp;&nbsp;1. The presentation layer calls an object responsible for reading from a read-only store. The data returned is used to populate the UI.  
&nbsp;&nbsp;2. The presentation layer calls command handlers to perform actions like create a cart, or add an item to the cart.  
&nbsp;&nbsp;3. The command handler calls the event store to get the historical events for the entity. For example, it may retrieve all cart events. Those events are played back in the object to materialize the current state of the entity, prior to any action taking place.  
&nbsp;&nbsp;4. The business logic is run and events are raised. In most implementations, the events are pushed to a queue or topic to decouple the event producers and event consumers.  
&nbsp;&nbsp;5. Event handlers listen for events they are interested in and perform the appropriate action for that handler. Some typical event handler actions are:  
<br>

Writing the events to the event store  
Updating a read-only store optimized for queries  
Integrating with external systems  
<br>

## Pattern advantages  
The Event Sourcing pattern provides the following advantages:  
<br>

&nbsp;&nbsp;1. Events are immutable and can be stored using an append-only operation. The user interface, workflow, or process that initiated an event can continue, and tasks that handle the events can run in the background. This process, combined with the fact that there's no contention during the processing of transactions, can vastly improve performance and scalability for applications, especially for the presentation layer.  
&nbsp;&nbsp;2. Events are simple objects that describe some action that occurred, together with any associated data that's required to describe the action represented by the event. Events don't directly update a data store. They're simply recorded for handling at the appropriate time. Using events can simplify implementation and management.  
&nbsp;&nbsp;3. Events typically have meaning for a domain expert, whereas object-relational impedance mismatch can make complex database tables hard to understand. Tables are artificial constructs that represent the current state of the system, not the events that occurred.  
&nbsp;&nbsp;4. Event sourcing can help prevent concurrent updates from causing conflicts because it avoids the requirement to directly update objects in the data store. However, the domain model must still be designed to protect itself from requests that might result in an inconsistent state.  
&nbsp;&nbsp;5. The append-only storage of events provides an audit trail that can be used to monitor actions taken against a data store. It can regenerate the current state as materialized views or projections by replaying the events at any time, and it can assist in testing and debugging the system. In addition, the requirement to use compensating events to cancel changes can provide a history of changes that were reversed. This capability wouldn't be the case if the model stored the current state. The list of events can also be used to analyze application performance and to detect user behavior trends. Or, it can be used to obtain other useful business information.  
&nbsp;&nbsp;6. The command handlers raise events, and tasks perform operations in response to those events. This decoupling of the tasks from the events provides flexibility and extensibility. Tasks know about the type of event and the event data, but not about the operation that triggered the event. In addition, multiple tasks can handle each event. This enables easy integration with other services and systems that only listen for new events raised by the event store. However, the event sourcing events tend to be very low level, and it might be necessary to generate specific integration events instead.  
<br>

## Issues and considerations  
Consider the following points when deciding how to implement this pattern:  
<br>

&nbsp;&nbsp;1. Eventual consistency - The system will only be eventually consistent when creating materialized views or generating projections of data by replaying events. There's some delay between an application adding events to the event store as the result of handling a request, the events being published, and the consumers of the events handling them. During this period, new events that describe further changes to entities might have arrived at the event store. Your customers must be okay with the fact that data is eventually consistent and the system should be designed to account for eventual consistency in these scenarios.  
&nbsp;&nbsp;2. Versioning events - The event store is the permanent source of information, and so the event data should never be updated. The only way to update an entity or undo a change is to add a compensating event to the event store. If the schema (rather than the data) of the persisted events needs to change, perhaps during a migration, it can be difficult to combine existing events in the store with the new version. Your application will need to support changes to events structures. This can be done in several ways.  
&nbsp;&nbsp;3. Ensure your event handlers support all versions of events. This can be a challenge to maintain and test. This requires implementing a version stamp on each version of the event schema to maintain both the old and the new event formats.  
Implement an event handler to handle specific event versions. This can be a maintenance challenge in that bug fix changes might have to be made across multiple handlers. This requires implementing a version stamp on each version of the event schema to maintain both the old and the new event formats.  
Update historical events to the new schema when a new schema is implemented. This breaks the immutability of events.  
&nbsp;&nbsp;4. Event ordering - Multi-threaded applications and multiple instances of applications might be storing events in the event store. The consistency of events in the event store is vital, as is the order of events that affect a specific entity (the order that changes occur to an entity affects its current state). Adding a timestamp to every event can help to avoid issues. Another common practice is to annotate each event resulting from a request with an incremental identifier. If two actions attempt to add events for the same entity at the same time, the event store can reject an event that matches an existing entity identifier and event identifier.  
&nbsp;&nbsp;5. Querying events - There's no standard approach, or existing mechanisms such as SQL queries, for reading the events to obtain information. The only data that can be extracted is a stream of events using an event identifier as the criteria. The event ID typically maps to individual entities. The current state of an entity can be determined only by replaying all of the events that relate to it against the original state of that entity.  
&nbsp;&nbsp;6. Cost of recreating state for entities - The length of each event stream affects managing and updating the system. If the streams are large, consider creating snapshots at specific intervals such as a specified number of events. The current state of the entity can be obtained from the snapshot and by replaying any events that occurred after that point in time. For more information about creating snapshots of data, see Primary-Subordinate Snapshot Replication.  
&nbsp;&nbsp;7. Conflicts - Even though event sourcing minimizes the chance of conflicting updates to the data, the application must still be able to deal with inconsistencies that result from eventual consistency and the lack of transactions. For example, an event that indicates a reduction in stock inventory might arrive in the data store while an order for that item is being placed. This situation results in a requirement to reconcile the two operations, either by advising the customer or by creating a back order.  
&nbsp;&nbsp;8. Need for idempotency - Event publication might be at least once, and so consumers of the events must be idempotent. They must not reapply the update described in an event if the event is handled more than once. Multiple instances of a consumer can maintain and aggregate an entity's property, such as the total number of orders placed. Only one must succeed in incrementing the aggregate, when an order-placed event occurs. While this result isn't a key characteristic of event sourcing, it's the usual implementation decision.  
&nbsp;&nbsp;9. Circular logic - Be mindful of scenarios where the processing of one event involves the creation of one or more new events since this can cause an infinite loop.  
<br>

## When to use this pattern  
### Use this pattern in the following scenarios:  
&nbsp;&nbsp;1. When you want to capture intent, purpose, or reason in the data. For example, changes to a customer entity can be captured as a series of specific event types, such as Moved home, Closed account, or Deceased.  
&nbsp;&nbsp;2. When it's vital to minimize or completely avoid the occurrence of conflicting updates to data.  
&nbsp;&nbsp;3. When you want to record events that occur, to replay them to restore the state of a system, to roll back changes, or to keep a history and audit log. For example, when a task involves multiple steps, you might need to execute actions to revert updates and then replay some steps to bring the data back into a consistent state.  
&nbsp;&nbsp;4. When you use events. It's a natural feature of the operation of the application, and it requires little extra development or implementation effort.  
&nbsp;&nbsp;5. When you need to decouple the process of inputting, or updating data from the tasks required to apply these actions. This change might be to improve UI performance, or to distribute events to other listeners that take action when the events occur. For example, you can integrate a payroll system with an expense submission website. The events that are raised by the event store in response to data updates made in the website would be consumed by both the website and the payroll system.  
&nbsp;&nbsp;6. When you want flexibility to be able to change the format of materialized models and entity data if requirements change, or—when used with CQRS—you need to adapt a read model or the views that expose the data.  
&nbsp;&nbsp;7. When used with CQRS, and eventual consistency is acceptable while a read model is updated, or the performance impact of rehydrating entities and data from an event stream is acceptable.  
<br>

### This pattern might not be useful in the following situations:  
&nbsp;&nbsp;1. Applications that do not require hyper-scale or performance.  
&nbsp;&nbsp;2. Small or simple domains, systems that have little or no business logic, or nondomain systems that naturally work well with traditional CRUD data management mechanisms.  
&nbsp;&nbsp;3. Systems where consistency and real-time updates to the views of the data are required.  
&nbsp;&nbsp;4. Systems where there's only a low occurrence of conflicting updates to the underlying data. For example, systems that predominantly add data rather than updating it.  
<br>

## Example  
A conference management system needs to track the number of completed bookings for a conference. This way it can check whether there are seats still available, when a potential attendee tries to make a booking. The system could store the total number of bookings for a conference in at least two ways:  
<br>

The system could store the information about the total number of bookings as a separate entity in a database that holds booking information. As bookings are made or canceled, the system could increment or decrement this number as appropriate. This approach is simple in theory, but can cause scalability issues if a large number of attendees are attempting to book seats during a short period of time. For example, in the last day or so prior to the booking period closing.  
<br>

The system could store information about bookings and cancellations as events held in an event store. It could then calculate the number of seats available by replaying these events. This approach can be more scalable due to the immutability of events. The system only needs to be able to read data from the event store, or append data to the event store. Event information about bookings and cancellations is never modified.  
<br>

<div class="white-background"><img src="assets/images/threads/arh_eventsourcing_2.png" alt="Event Sourcing Pattern 2"></div>  
<br>

The sequence of actions for reserving two seats is as follows:  
<br>

&nbsp;&nbsp;1. The user interface issues a command to reserve seats for two attendees. The command is handled by a separate command handler. A piece of logic that is decoupled from the user interface and is responsible for handling requests posted as commands.  
&nbsp;&nbsp;2. An entity containing information about all reservations for the conference is constructed by querying the events that describe bookings and cancellations. This entity is called SeatAvailability, and is contained within a domain model that exposes methods for querying and modifying the data in the entity.  
&nbsp;&nbsp;3. Some optimizations to consider are using snapshots (so that you don't need to query and replay the full list of events to obtain the current state of the entity), and maintaining a cached copy of the entity in memory.  
&nbsp;&nbsp;4. The command handler invokes a method exposed by the domain model to make the reservations.  
&nbsp;&nbsp;5. The SeatAvailability entity raises an event containing the number of seats that were reserved. The next time the entity applies events, all the reservations will be used to compute how many seats remain.  
&nbsp;&nbsp;6. The system appends the new event to the list of events in the event store.  
<br>

If a user cancels a seat, the system follows a similar process except the command handler issues a command that generates a seat cancellation event and appends it to the event store.