- The value of a reference type is a reference (or null), meaning the value of a reference type is **the memory address of the object to which it refers**. So, a reference type variable does not hold the value of the object it refers to, it holds a reference to that object.
- Value types are numbers (floats, ints), chars, bools, structs, enumeration constants, records of structs, ref structs https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/ref-struct, tuples,
- The following keywords are used to declare reference types: [class](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/class) [interface](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/keywords/interface) [delegate](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/reference-types#the-delegate-type) [record](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/record)

C# also provides the following built-in reference types: [dynamic](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/reference-types#the-dynamic-type) [object](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/reference-types#the-object-type) [string](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/builtin-types/reference-types#the-string-type)

- x of type `int` (a value type) and value `2`. The block of memory associated with `x` therefore contains the integer `2` **(i.e. its binary representation**).

Reference type vs value type (struct vs class) What resides in the stack, can you only find values? (stack exception trace contains methods ?)**

**1. Value Types (struct) vs Reference Types (class):**
Value Types (struct):
Storage: Stack when declared as local variables or parameters. Heap if part of a class (as a field) or when boxed (e.g., cast to object).
Behavior: Directly contain their data. Copies are made on assignment.
Example: int, DateTime, or custom struct.

Reference Types (class):
Storage:Heap for the object instance.Stack holds the reference (pointer) to the heap memory if declared as a local variable.
Behavior: Store a reference to the data. Assignments copy the reference, not the data.
Example: string, List<T>, or custom class.

**2. Stack vs Heap: Context Matters**
Stack: 
Stores method execution contexts (frames for each method call).
Contains: Value types (e.g., local int, struct variables). References to objects on the heap (e.g., local class variables).
Fast, LIFO allocation, automatically reclaimed when methods exit.

Heap:
Dynamically allocated memory for objects.
Contains:Reference type objects (e.g., instances of class).Value types embedded in classes or boxed (e.g., object o = 42;).
Managed by the garbage collector (GC).

**3. Stack Exceptions and Traces**
Stack Overflow:
Caused by excessive stack usage (e.g., infinite recursion, large stack allocations).
The stack trace shows method calls (frames) leading to the exception, but not variable values.

Example: Recursive method without an exit condition.
What’s in the Stack Trace?
Method names and line numbers (execution path).
Not the actual values of variables (whether value or reference types).

**4. Key Clarifications**
Myth: "Value types always live on the stack."
Reality: They can reside on the heap if part of a class or boxed.
References vs Objects:
References (pointers) to objects are on the stack (for local variables).
The objects themselves are on the heap.