Type erasure is a concept commonly associated with generics in programming languages like Java and C#. It refers to the process by which the compiler removes (or "erases") generic type information at runtime, replacing it with a non-generic representation. This allows generics to be implemented in a way that maintains backward compatibility with non-generic code.

**1. What is Type Erasure?**
Definition: Type erasure is the process of removing generic type information at runtime, replacing it with a non-generic representation (e.g., object in C# or Object in Java).
Purpose: Enables generics to work with existing non-generic code and reduces runtime overhead.

**2. How Type Erasure Works**
At Compile Time:
The compiler checks generic type constraints and ensures type safety.
Generics are fully enforced, and type-specific code is generated.

At Runtime:
Generic type parameters are replaced with their upper bound (e.g., object in C#).
This allows generic code to be executed on the same runtime as non-generic code.