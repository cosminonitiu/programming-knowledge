Understanding memory management is essential for building efficient .NET applications. The CLR (Common Language Runtime) handles memory automatically through garbage collection, which relieves developers from manual memory allocation and deallocation.

---

## 1. Overview of Garbage Collection

- **What is Garbage Collection?**
  - **Automatic Memory Management:**  
    Garbage Collection (GC) is a process where the CLR automatically frees memory occupied by objects that are no longer referenced by the application.
  - **Prevents Memory Leaks:**  
    By reclaiming memory from unreachable objects, GC helps prevent memory leaks and reduces manual memory management overhead.

- **How It Works:**
  - **Tracking References:**  
    The CLR monitors object references. When an object becomes unreachable (i.e., no longer referenced by any active code), it becomes eligible for collection.
  - **Generational Model:**  
    The managed heap is divided into generations:
    - **Generation 0 (Gen 0):**  
      Newly allocated, short-lived objects are placed here.
    - **Generation 1 (Gen 1):**  
      Acts as a buffer between short-lived and long-lived objects.
    - **Generation 2 (Gen 2):**  
      Contains long-lived objects that survive multiple collections.
  - **Collection Process:**  
    The GC periodically scans the heap, collects unreferenced objects, and compacts memory to optimize allocation.

---

# 2. Managed Memory, the Heap, and Object Lifetimes

- **Managed Memory:**
  - **Definition:**  
    Memory managed by the CLR where objects are allocated and deallocated automatically.
  - **Benefits:**  
    Developers focus on business logic rather than memory management details.

- **The Heap:**
  - **Structure:**  
    The managed heap is a large pool of memory divided into generations (Gen 0, Gen 1, Gen 2) to optimize garbage collection.
  - **Generations:**
    - **Gen 0:**  
      Holds short-lived objects. Frequent collections occur here.
    - **Gen 1:**  
      Intermediate generation for objects that survive Gen 0.
    - **Gen 2:**  
      Contains long-lived objects, collected less frequently.

- **Object Lifetimes:**
  - **Short-Lived Objects:**  
    Typically created and destroyed quickly (e.g., temporary local variables), generally collected in Gen 0.
  - **Long-Lived Objects:**  
    Persist longer (e.g., objects in global collections or static objects) and may be promoted to higher generations.
  - **Finalization and IDisposable:**  
    Objects holding unmanaged resources should implement `IDisposable` to allow deterministic cleanup, reducing reliance on finalizers which can delay collection.

```typescript
const language = 'typescript';
```

### **Example in C#:**
```typescript
public class MemoryExample
{
    public void CreateObjects()
    {
        // Short-lived object: likely to be collected in Gen 0
        var tempObject = new object();

        // Long-lived object: stored in a collection and may be promoted
        List<object> longLivedList = new List<object>();
        longLivedList.Add(new object());
    }
}
```
