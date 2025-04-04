Boxing and unboxing are mechanisms in C# that allow value types (e.g., int, struct) to be treated as reference types (object) and vice versa. However, they come with performance overhead and potential runtime exceptions if not used carefully.

1. **Boxing**: Converting a value type to a reference type (e.g., object).
Process:The value type is wrapped inside an object and stored on the heap. A reference to this object is then used.
**Performance Impact:**
Memory allocation on the heap.
Copying the value type to the heap.
Can lead to increased garbage collection pressure.

2. **Unboxing**: Converting a reference type (e.g., object) back to a value type.
Process:The value is extracted from the heap and copied back to the stack.
**Performance Impact:**
Type checking at runtime.
Copying the value back to the stack.

**Exceptions in Boxing and Unboxing**
a. **InvalidCastException**
Cause: Attempting to unbox a value to an incompatible type.
How to Avoid:
Ensure the type being unboxed matches the original type.
Use type checking (e.g., is or as operators) before unboxing.

b. **NullReferenceException**
Cause: Attempting to unbox a null reference.

c. **OverflowException**
Cause: Unboxing a value that is too large or too small for the target type.

**Avoiding Casting Exceptions**
a. Use is Operator for Type Checking
Check the type before casting.
b. Use as Operator for Reference Types
Safely cast reference types without throwing exceptions.
c. Use Generics to Avoid Boxing
Generics eliminate the need for boxing by working directly with the specified type.
d. Use Nullable<T> for Nullable Value Types
Avoid unboxing null by using Nullable<T>.
e. Use Pattern Matching (C# 7+)
Simplify type checking and casting.

la Nullable as adauga ca beware, it uses additional memory space for the boolean checking HasValue, un bool are 1 byte dar runtime=ul face padding sa ocupe fix 4 bytes
deci e bool memory + value type that is using nullable