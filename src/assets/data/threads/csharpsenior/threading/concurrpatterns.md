Concurrency patterns are high-level approaches or “blueprints” that help structure and coordinate multiple threads or tasks. Using these patterns effectively can simplify the complexity of multithreaded and asynchronous code. Below are some common concurrency patterns in C#:

---

## 1. Producer-Consumer Pattern

### Overview
- **Producer** threads generate data (or tasks) and place it into a buffer.
- **Consumer** threads read data from that buffer and process it.
- A **queue** (or similar structure) is typically used as the shared buffer.

### Why Use It?
- Decouples data creation (producer) from data processing (consumer).  
- Improves overall throughput by allowing producers and consumers to work concurrently.

### Example with `BlockingCollection<T>`

```csharp
using System;
using System.Collections.Concurrent;
using System.Threading;
using System.Threading.Tasks;

public class ProducerConsumerExample
{
    private static BlockingCollection<int> _buffer 
        = new BlockingCollection<int>(boundedCapacity: 5);

    public static void Run()
    {
        // Start producer
        Task producerTask = Task.Run(() => Producer());

        // Start consumer
        Task consumerTask = Task.Run(() => Consumer());

        Task.WaitAll(producerTask, consumerTask);
    }

    private static void Producer()
    {
        for (int i = 0; i < 10; i++)
        {
            _buffer.Add(i);
            Console.WriteLine($"Produced: {i}");
            Thread.Sleep(200); // Simulate production time
        }
        _buffer.CompleteAdding();
    }

    private static void Consumer()
    {
        foreach (var item in _buffer.GetConsumingEnumerable())
        {
            Console.WriteLine($"Consumed: {item}");
            Thread.Sleep(300); // Simulate consumption time
        }
    }
}
```

**Key Points**
BlockingCollection<T> handles synchronization and blocking automatically.

When the producer calls CompleteAdding(), the consumer loop ends once all items are consumed.

**2. Pipeline Pattern
Overview**
Breaks down a complex task into multiple stages. Each stage performs a step of the task and passes the result to the next stage.

Often implemented with a series of producer-consumer steps.

**Why Use It?**
Each stage runs in parallel, improving throughput.

Simplifies large tasks by breaking them into smaller, reusable components.

**Conceptual Example**

RawData -> [ Stage1: Parse ] -> ParsedData -> [ Stage2: Transform ] -> TransformedData -> [ Stage3: Write ] -> ...
```csharp
// Pseudocode for Pipeline with TPL Dataflow
using System;
using System.Threading.Tasks;
using System.Threading.Tasks.Dataflow;

public class PipelineExample
{
    public static void Run()
    {
        // Stage 1: Parse block
        var parseBlock = new TransformBlock<string, string>(data =>
        {
            // Parse or manipulate input
            return data.ToUpper();
        });

        // Stage 2: Transform block
        var transformBlock = new TransformBlock<string, string>(parsed =>
        {
            // Further transform the parsed data
            return $"Transformed: {parsed}";
        });

        // Stage 3: Action block (final stage)
        var actionBlock = new ActionBlock<string>(finalData =>
        {
            Console.WriteLine($"Final Output: {finalData}");
        });

        // Link the blocks (Pipeline)
        parseBlock.LinkTo(transformBlock, new DataflowLinkOptions { PropagateCompletion = true });
        transformBlock.LinkTo(actionBlock, new DataflowLinkOptions { PropagateCompletion = true });

        // Send data
        parseBlock.Post("hello");
        parseBlock.Post("world");
        parseBlock.Complete();  // Signal no more input

        actionBlock.Completion.Wait();
    }`
}
```
**Key Points**
TPL Dataflow is a library providing robust building blocks (e.g., TransformBlock, ActionBlock) for pipeline creation.

Each block can process data concurrently, improving throughput.

**3. Fan-Out / Fan-In Pattern**
Overview
Fan-Out: Split a task into multiple parallel subtasks.

Fan-In: Aggregate results from those subtasks back into a single path.

**Why Use It?**
Allows you to exploit multiple CPU cores or threads to speed up processing for CPU-bound tasks.

Aggregation can simplify combining partial results.

**Example with Parallel.Invoke**
```csharp
using System;
using System.Threading.Tasks;

public class FanOutFanInExample
{
    public static void Run()
    {
        Parallel.Invoke(
            () => Console.WriteLine("Subtask 1"),
            () => Console.WriteLine("Subtask 2"),
            () => Console.WriteLine("Subtask 3")
        );

        // After all subtasks complete, you can combine or analyze their results if needed
        Console.WriteLine("All subtasks finished.");
    }
}
```
**Key Points**
Parallel.Invoke fans out tasks. You can fan-in manually by collecting results in shared structures or by returning data from each subtask (using Task objects instead of Parallel.Invoke).

**4. Reader-Writer Pattern**
Overview
Multiple readers can safely read shared data simultaneously (no modifications).

A single writer can exclusively update data without interference.

**Why Use It?**
Efficient when reads are more frequent than writes (which is common in many applications).

**Example with ReaderWriterLockSlim**
```csharp
using System;
using System.Threading;

public class ReaderWriterExample
{
    private static ReaderWriterLockSlim _rwLock = new ReaderWriterLockSlim();
    private static int _data;

    public static void SafeWrite(int newValue)
    {
        _rwLock.EnterWriteLock();
        try
        {
            _data = newValue;
        }
        finally
        {
            _rwLock.ExitWriteLock();
        }
    }

    public static int SafeRead()
    {
        _rwLock.EnterReadLock();
        try
        {
            return _data;
        }
        finally
        {
            _rwLock.ExitReadLock();
        }
    }
}
```
**Key Points**
Multiple threads can call SafeRead() concurrently without blocking each other.

Only one writer thread can modify data at a time, blocking all readers and other writers.

**5. Actor Model (Message Passing)
Overview**
Each Actor is an isolated entity that processes messages sequentially.

Instead of sharing state, actors communicate by sending each other messages.

**Why Use It?**
Eliminates shared state, reducing or removing the need for locks.

Scales well in distributed systems (e.g., Akka.NET).

Example (Conceptual)
```csharp
// Pseudocode, using Akka.NET for example
public class MyActor : ReceiveActor
{
    public MyActor()
    {
        Receive<string>(message => HandleStringMessage(message));
    }

    private void HandleStringMessage(string msg)
    {
        Console.WriteLine($"Actor received: {msg}");
    }
}

// Somewhere else:
var system = ActorSystem.Create("MyActorSystem");
var myActorRef = system.ActorOf<MyActor>("MyActor");
myActorRef.Tell("Hello, Actor!");
```
Key Points**
**Each actor processes one message at a time, ensuring thread safety by design.

Communication is asynchronous and message-based rather than shared-state.

**6. Immutable Data / Copy-on-Write**
Overview
Instead of modifying shared objects, create new objects for each change.

Safe for multiple threads to read data without locks, because the data doesn’t change once created.

**Why Use It?**
Eliminates concurrency issues around mutable state.

Particularly useful in functional programming paradigms and high-concurrency scenarios.

```csharp
// Immutable record in C# 9+
public record Person(string Name, int Age);

public class ImmutableExample
{
    public static void Run()
    {
        var original = new Person("Alice", 30);
        var updated = original with { Age = 31 };

        // Two threads reading original or updated won't conflict,
        // because both objects are immutable.
    }
}
```
**Key Points**
Thread-safe reads, since data never changes in place.

However, can lead to higher memory usage due to extra allocations.

**7. Async/Await Pattern**
Though not always called a “pattern,” async/await is a programming model in C# that drastically simplifies asynchronous code:

```csharp
public class AsyncAwaitExample
{
    public static async Task RunAsync()
    {
        // I/O-bound async call
        await Task.Delay(1000);
        
        // CPU-bound parallel work
        var sum = await Task.Run(() => CalculateSum(1000000));
        Console.WriteLine($"Sum is {sum}");
    }

    private static long CalculateSum(long n)
    {
        long total = 0;
        for (long i = 0; i < n; i++)
        {
            total += i;
        }
        return total;
    }
}
```
**Key Points**
async/await frees the calling thread during I/O operations, improving responsiveness.

For CPU-bound work, you still might use Task.Run() to move it to a background thread.