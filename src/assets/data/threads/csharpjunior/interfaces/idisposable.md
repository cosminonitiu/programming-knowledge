## 1. Overview

### Definition
- **IDisposable Interface:**  
  Declares a single method, `Dispose()`, which should be called when an object is no longer needed to free up unmanaged resources.
  ```typescript
  public interface IDisposable
  {
      void Dispose();
  }
  ```
**Purpose**
**Resource Management:**
Ensures that unmanaged resources are explicitly released, avoiding resource leaks.

**Deterministic Finalization:**
Provides a mechanism for deterministic cleanup rather than waiting for the GC, which is non-deterministic.

**2. How It Works Under the Hood
Unmanaged vs. Managed Resources
Managed Resources:**
These are resources managed by the .NET runtime (e.g., objects on the managed heap). They are cleaned up by the garbage collector.

**Unmanaged Resources:**
Resources such as file handles, database connections, or unmanaged memory are not managed by the GC and must be explicitly released.

**The Dispose Pattern
Purpose:**
The Dispose Pattern provides a robust way to implement IDisposable in classes that hold unmanaged resources or large managed resources that require early release.

**Basic Structure:**
A typical implementation involves:

A public Dispose() method.

A protected virtual Dispose(bool disposing) method that distinguishes between explicit disposal and finalization.

A finalizer (~ClassName()) that calls Dispose(false) if the object was not explicitly