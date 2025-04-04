### Stack and Heap

https://endjin.com/blog/2022/07/understanding-the-stack-and-heap-in-csharp-dotnet?utm_source=csharpdigest&utm_medium&utm_campaign=1386

- **The stack** has two main purposes: (1) to keep track of the **method that control should return** to once the currently executing method has finished, (2) to hold the **values of local variables** (i.e. the variables that are not needed once their containing method finishes executing).
- The local variables pertaining to a given method are grouped together in what's called a `stack frame`; when a method finishes executing, the corresponding stack frame is popped from the stack, meaning all of the variables contained within are removed together and become unavailable.
- Whereas the stack only allows items to be added and removed to/from the top, **any item in a heap can be accessed at any time**. The purpose of the heap is to store data that needs to outlive specific methods. This means the heap is used to **store reference type variables**, which are referred to as ***objects*.** **The garbage collector** (GC) is a program that manages the objects on the heap, it allocates objects and reclaims objects that are no longer being used - freeing memory for future allocations
- **Where do variables get stored?  the general rules:**
- Local variables (i.e. those that are declared inside methods) are stored on the stack. This means their values are stored on the stack, therefore meaning that local reference type variables have references stored on the stack and local value type variables have actual values stored on the stack.
- Objects of reference type variables (i.e. the things that references point to) always live on the heap.

- Instance variables that are part of a reference type instance (e.g. a field on a class) are stored on the heap with the object itself
- Instance variables that are part of a value type instance are stored in the same context as the variable that declares the value type. This means that a variable of a struct that is declared in a method will live on the stack, whilst a variable of a struct that is declared inside a class (i.e. a field on the class) will live on the heap.
- **Exceptions:**
- Static variables always live on *a* heap, and there's only ever a single heap block that holds the value of the variable.
- Anonymous functions, which include lambda expressions, complicate matters slightly. When you declare an anonymous function, it has access to the local variables from the containing method, these are called captured variables.
- Asynchronous methods return before completing to allow the calling method to continue executing whilst something time consuming takes place. At some point the asynchronous methods resumes execution, which means the state inside the method at the point in time at which it returned needs to have been preserved, even though it returned. Therefore the stack frame associated with an asynchronous method cannot be deallocated in the way I described when the method returns to work asynchronously; the compiler has to do some work to achieve this.