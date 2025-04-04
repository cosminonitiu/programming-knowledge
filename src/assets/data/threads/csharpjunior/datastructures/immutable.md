## 1. ImmutableList<T>

### Overview
- **Definition:**  
  `ImmutableList<T>` represents a list that cannot be modified after it is created. Any operation that appears to modify the list (e.g., Add, Remove) returns a new list with the change applied, sharing structure with the original list.

### Internal Implementation
- **Persistent Data Structure:**  
  Implemented as a persistent (or functional) data structure, `ImmutableList<T>` uses structural sharing. Only the parts of the list that change are recreated, which minimizes memory overhead and improves performance.
- **Underlying Structure:**  
  Often implemented as a tree or segmented array where modifications require copying only a small portion of the data.

### Performance Characteristics
- **Lookup:**  
  Indexed access is typically O(1) due to internal array-like behavior.
- **Modifications:**  
  Operations like Add or Remove are generally O(log n) or amortized near O(1) due to structural sharing.
  
### Use Cases
- **Thread-Safe Collections:**  
  Ideal when multiple threads need to read data without locks.
- **Functional Programming:**  
  Useful in scenarios where immutability is a core design principle.

### Example Usage
```typescript
using System.Collections.Immutable;

ImmutableList<int> list = ImmutableList.Create(1, 2, 3);
ImmutableList<int> newList = list.Add(4); // newList: {1,2,3,4}, list remains unchanged
```

**2. ImmutableDictionary<TKey, TValue>
Overview**
Definition:
An immutable dictionary that maps keys to values. It does not allow modification of existing entries; operations return a new dictionary instance with the changes.

**Internal Implementation**
**Hash Trie / Hash Array Mapped Trie (HAMT):**
Commonly implemented using a trie structure optimized for immutable dictionaries. This allows for efficient lookups and updates while sharing most of the structure between versions.

**Performance Characteristics
Lookup:**
Generally O(1) or O(log n) due to the trie structure.

**Modifications:**
Insertion and deletion are performed in O(log n) time, and changes share structure with the original dictionary.

**Use Cases**
**Concurrent Read-Only Data:**
Ideal for scenarios where data is frequently read but seldom modified.

**Snapshot Semantics:**
Useful when you need to maintain historical versions of a dataset.

Example Usage
```typescript
using System.Collections.Immutable;

ImmutableDictionary<string, int> dict = ImmutableDictionary.Create<string, int>()
    .Add("Alice", 30)
    .Add("Bob", 25);

ImmutableDictionary<string, int> updatedDict = dict.SetItem("Bob", 26);
```

**3. ImmutableHashSet<T>
Overview
Definition:**
An immutable collection that contains unique elements, similar to a HashSet, but with immutable semantics.

**Internal Implementation
Persistent Hash Trie:**
Typically implemented using a structure similar to a hash trie that supports efficient membership testing and set operations (union, intersection, etc.) with structural sharing.

**Performance Characteristics
Lookup:**
Offers near O(1) average-case performance for lookups.

**Modifications:**
Add and remove operations are performed in O(log n) time, with most of the structure being shared.

**Use Cases
Set Operations:**
Ideal for scenarios where you need to perform union, intersection, and difference operations on sets.

**Immutable Collections:**
Useful in functional programming or multi-threaded environments where immutability is required.

Example Usage
```typescript
using System.Collections.Immutable;

ImmutableHashSet<int> set = ImmutableHashSet.Create(1, 2, 3);
ImmutableHashSet<int> newSet = set.Add(4); // newSet contains {1,2,3,4}
```

**4. ImmutableQueue<T>
Overview
Definition:**
An immutable FIFO (first-in, first-out) queue where enqueue and dequeue operations return a new queue without modifying the existing one.

**Internal Implementation
Persistent Data Structure:**
Often implemented as a pair of stacks (one for enqueued items and one for dequeued items) or as a functional queue that supports efficient head and tail operations while sharing structure.

**Performance Characteristics
Enqueue/Dequeue:**
Typically O(1) for enqueue and amortized O(1) for dequeue operations due to structural sharing.

**Memory Efficiency:**
Operations share most of the internal structure, making it efficient in terms of memory usage.

**Use Cases
Task Scheduling:**
Ideal for managing a sequence of tasks or events in a thread-safe, immutable manner.

**Functional Programming:**
Useful in applications where immutability is a key requirement.

Example Usage
```typescript
using System.Collections.Immutable;

ImmutableQueue<int> queue = ImmutableQueue.Create<int>();
queue = queue.Enqueue(1);
queue = queue.Enqueue(2);
int firstItem;
queue = queue.Dequeue(out firstItem); // firstItem is 1
```

**5. ImmutableStack<T>
Overview
Definition:**
An immutable LIFO (last-in, first-out) stack that returns a new stack for every push or pop operation, preserving the previous versions.

**Internal Implementation
Persistent Linked Structure:**
Typically implemented as an immutable linked list (or a persistent stack) where each new push creates a new node pointing to the previous stack. This design enables efficient structural sharing.

**Performance Characteristics
Push/Pop:**
Both operations are O(1) as they simply add or remove a node from the top of the stack.

**Memory Sharing:**
New operations share the unchanged portion of the stack with previous versions.

**Use Cases
Undo Mechanisms:**
Ideal for implementing undo functionality where previous states must be preserved.
**
Functional Programming:**
Useful in applications where operations should not alter the original state, such as in recursive algorithms or state management.

Example Usage
```typescript
using System.Collections.Immutable;

ImmutableStack<int> stack = ImmutableStack.Create<int>();
stack = stack.Push(1);
stack = stack.Push(2);
int top;
stack = stack.Pop(out top); // top is 2
```

**6. Summary**
Immutable collections in C# provide a robust framework for building thread-safe and functional applications. By understanding the inner workings and performance characteristics of:

ImmutableList<T>: A dynamic, resizable array with efficient sharing.

ImmutableDictionary<TKey, TValue>: A key-value store with persistent trie structures.

ImmutableHashSet<T>: A set optimized for fast lookups and efficient set operations.

ImmutableQueue<T>: A FIFO structure that efficiently shares state.

ImmutableStack<T>: A LIFO collection that preserves history with constant-time operations.