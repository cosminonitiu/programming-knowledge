Recoverable Exceptions
These are errors that can be gracefully handled, allowing the application to continue running. They often occur due to predictable issues (e.g., invalid user input, missing files, network timeouts) where you can implement a fallback or retry mechanism.

Examples:

FileNotFoundException (create a default file).

FormatException (ask the user to re-enter valid input).

HttpRequestException (retry a network call).

try
{
    var data = File.ReadAllText("data.json");
}
catch (FileNotFoundException)
{
    // Recover: Create a default file and proceed
    File.WriteAllText("data.json", "[]");
    Console.WriteLine("Created default data file.");
}
Here, the app recovers by creating a missing file and continues execution.

Unrecoverable Exceptions
These are critical errors where the application cannot safely proceed. They often indicate severe system-level issues (e.g., memory corruption, invalid program state) or unrecoverable resource failures. Attempting to "handle" these errors may leave the app in an unstable state.

Examples:

OutOfMemoryException (no memory left to allocate).

StackOverflowException (call stack overflow, often due to infinite recursion).

AccessViolationException (illegal memory access, e.g., in unsafe code).

Code Example:

try
{
    // Allocate a massive array (may throw OutOfMemoryException)
    int[] hugeArray = new int[int.MaxValue];
}
catch (Exception ex) // Generic catch is BAD here!
{
    Console.WriteLine("Error: " + ex.Message);
    // App continues, but is likely corrupted.
}
Problem: The app tries to "handle" OutOfMemoryException, but there’s no safe way to recover. Continuing execution risks further instability. 