## 1. Types of Application-Level Exception Handlers

### 1.1. AppDomain.UnhandledException
- **Purpose:**  
  Captures exceptions that are not caught in any try-catch block on non-UI threads. It acts as a last-resort handler before the application terminates.
- **Usage:**  
```typescript
  AppDomain.CurrentDomain.UnhandledException += (sender, args) =>
  {
      Exception ex = (Exception)args.ExceptionObject;
      // Log exception details, perform cleanup, etc.
      Console.WriteLine("Unhandled exception: " + ex.Message);
  };
```

**1.2. TaskScheduler.UnobservedTaskException**
Purpose:
Handles exceptions thrown in tasks that are not observed (i.e., not awaited or caught). This helps prevent crashes in asynchronous operations.

Usage:

```typescript
TaskScheduler.UnobservedTaskException += (sender, args) =>
{
    // Log the exception
    Console.WriteLine("Unobserved task exception: " + args.Exception.Message);
    // Optionally mark the exception as observed
    args.SetObserved();
};
```
**1.3. UI Thread Exception Handlers
WinForms – Application.ThreadException:**
For Windows Forms applications, this event catches exceptions thrown on the UI thread.

```typescript
Application.ThreadException += (sender, args) =>
{
    // Log the exception and inform the user
    MessageBox.Show("An unexpected error occurred: " + args.Exception.Message);
};
```
**WPF – DispatcherUnhandledExceptio**n:
For WPF applications, the DispatcherUnhandledException event on the Application object handles unhandled exceptions on the UI thread.

```typescript
Application.Current.DispatcherUnhandledException += (sender, args) =>
{
    // Log the exception
    MessageBox.Show("An unexpected error occurred: " + args.Exception.Message);
    // Optionally, prevent default unhandled exception processing
    args.Handled = true;
};
```