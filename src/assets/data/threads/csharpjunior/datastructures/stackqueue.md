# 1. Stack<T>

### Overview
- **Definition:**  
  Stack<T> is a collection that stores elements in a LIFO order, meaning the last element added is the first one removed.
  
- **Common Operations:**  
  - **Push(T item):** Adds an item to the top of the stack.
  - **Pop():** Removes and returns the item from the top.
  - **Peek():** Returns the top item without removing it.

### Internal Implementation
- **Underlying Data Structure:**  
  Internally, Stack<T> uses a dynamically resizable array (`T[] _array`) to store elements.
- **Memory Layout:**  
  - **Contiguous Storage:** The elements are stored in contiguous memory blocks, which enables O(1) access for Peek and Pop.
  - **Resizing:** When the array reaches its capacity, a new larger array is allocated (typically doubling the size), and existing elements are copied over. This resizing operation is O(n), but since it happens infrequently, the amortized cost for push is O(1).

### Performance Characteristics
- **Push and Pop:**  
  Both operations are O(1) on average, with occasional O(n) cost during resizing.
- **Iteration:**  
  Iterating over a Stack<T> is efficient, but note that it is typically done in reverse order (from top to bottom).

### Use Cases
- **Expression Evaluation:**  
  Parsing mathematical expressions (e.g., converting infix to postfix notation).
- **Backtracking Algorithms:**  
  Implementing undo functionality or recursion alternatives (e.g., depth-first search).
- **State Management:**  
  Maintaining a history of operations (e.g., browser history, application undo stacks).

### Best Practices
- **Pre-Allocation:**  
  If the number of elements is known beforehand, initialize the stack with an appropriate capacity to minimize resizing.
  ```typescript
  var stack = new Stack<int>(100);
  ```

**Error Handling:**
Use methods like TryPeek() and TryPop() to safely handle empty stacks.
**
Encapsulation:**
Wrap Stack<T> operations within higher-level abstractions when implementing complex business logic to hide implementation details.

**2. Queue<T>
Overview**
Definition:
Queue<T> is a collection that stores elements in a FIFO order, meaning the first element added is the first one removed.
**
Common Operations:**

Enqueue(T item): Adds an item to the end of the queue.

Dequeue(): Removes and returns the item from the front.

Peek(): Returns the front item without removing it.
**
Internal Implementation
Underlying Data Structure**:
Queue<T> uses a circular buffer pattern implemented with a dynamically resizable array. It maintains two pointers: one for the head (front) and one for the tail (rear) of the queue.

**Circular Buffer Mechanics:

Wrap-Around:**
When the tail reaches the end of the array, it wraps around to the beginning if there is free space.

**Resizing:**
Similar to Stack<T>, the internal array is resized (usually doubling in size) when the queue becomes full. Resizing involves copying elements to a new array while preserving the logical order.

**Performance Characteristics
Enqueue and Dequeue:**
Both operations are O(1) on average due to the circular buffer design.

**Memory Overhead:**
The non-contiguous nature (due to potential wrap-around) can slightly affect cache performance compared to a single contiguous block, but it provides flexibility for variable queue lengths.
**
Use Cases
Task Scheduling:**
Managing jobs or tasks in the order they are received (e.g., print queues, background processing).
**
Breadth-First Search (BFS):**
Traversing data structures such as trees or graphs.

**Buffering:**
Storing data temporarily in streaming applications.

**Best Practices
Pre-Allocation:**
Similar to Stack<T>, if the expected number of elements is known, preallocate the queue to minimize resizing.

```typescript
var queue = new Queue<int>(100);
```
**Error Handling:**
Use methods like TryPeek() and TryDequeue() to avoid exceptions when the queue is empty.

**Monitor Capacity:**
Be mindful of the internal capacity and growth pattern if you have high-throughput scenarios, as resizing can momentarily impact performance.

**3. Comparative Analysis
Access Patterns
Stack<T>:**
Ideal for scenarios where the last element is needed first (LIFO), such as undo operations and recursive algorithms.

**Queue<T>:**
Best suited for order-sensitive operations (FIFO), such as task scheduling and breadth-first search.

**Memory and Performance
Resizing Impact:**
Both data structures use dynamic arrays that resize periodically. Although resizing is an O(n) operation, it is amortized over many operations.

**Cache Locality:**
Stack<T> may benefit slightly from better cache locality due to its simpler, contiguous structure when not resizing, while Queue<T>'s circular nature can lead to minor cache inefficiencies.