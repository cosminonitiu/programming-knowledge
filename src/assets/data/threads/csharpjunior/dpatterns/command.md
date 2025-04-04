## 1. Overview

### Definition and Purpose
- **Definition:**  
  The Command Pattern encapsulates a request as an object (command) that contains all information needed to perform an action, including the method to call, the object that owns the method, and any parameters.
  
- **Primary Goals:**
  - **Decoupling:**  
    Separate the requester (invoker) of an action from the object that performs the action (receiver).
  - **Encapsulation:**  
    Encapsulate a request as an object, which allows for parameterization, queuing, logging, and undo/redo operations.
  - **Extensibility:**  
    New commands can be added without changing existing code, adhering to the Open/Closed Principle.

---

## 2. Key Components

### Command Interface
- **Role:**  
  Declares a method for executing a command.
- **Example:**
  ```typescript
  public interface ICommand
  {
      void Execute();
  }
  ```

  **Concrete Command**
**Role**:
Implements the Command interface and defines a binding between a Receiver object and an action.

Example:

```typescript
public class LightOnCommand : ICommand
{
    private readonly Light _light;
    
    public LightOnCommand(Light light)
    {
        _light = light;
    }
    
    public void Execute()
    {
        _light.TurnOn();
    }
}
```
**Receiver
Role:**
The object that performs the actual work when the command is executed.

Example:

```typescript
public class Light
{
    public void TurnOn() => Console.WriteLine("The light is on.");
    public void TurnOff() => Console.WriteLine("The light is off.");
}
```

**Invoker**
**Role:**
The object that holds a command and can execute it. It doesn’t know the details of the command's operation.

Example:

```typescript
public class RemoteControl
{
    private ICommand _command;
    
    public void SetCommand(ICommand command)
    {
        _command = command;
    }
    
    public void PressButton()
    {
        _command.Execute();
    }
}
```
**Client**
**Role:**
The client creates concrete command objects and sets their receiver, then passes these commands to the invoker.

Example:

```typescript
public class Program
{
    public static void Main()
    {
        // Create the receiver
        Light livingRoomLight = new Light();
        
        // Create a concrete command and associate it with the receiver
        ICommand lightOn = new LightOnCommand(livingRoomLight);
        
        // Set up the invoker
        RemoteControl remote = new RemoteControl();
        remote.SetCommand(lightOn);
        
        // Execute the command
        remote.PressButton(); // Output: The light is on.
    }
}
```

**3. How It Works Under the Hood
Encapsulation of Actions
Decoupling:**
The Command Pattern encapsulates the request details within the command object. The invoker calls Execute() without needing to know which operation is performed or how.

**Flexibility in Execution:**
Commands can be stored, queued, logged, or even undone. For example, an "undo" operation can be implemented by storing previous states or providing an Unexecute() method.

**Extensibility and Dynamic Behavior
Adding New Commands:**
New command types can be added without modifying the invoker or client code. They just need to implement the ICommand interface.

**Composite Commands:**
You can create composite commands (also known as macro commands) that execute multiple commands in sequence, enabling batch processing of operations.

**4. Real-World Use Cases
Undo/Redo Functionality
Scenario:**
In text editors or graphic applications, every operation (e.g., drawing, deleting) is encapsulated as a command. Commands are stored in a history stack, enabling undo/redo by reversing or reapplying the commands.

**Transactional Systems
Scenario:**
In systems where operations must be logged for audit or rollback purposes, each transaction can be encapsulated in a command object. This allows for logging and, if necessary, reverting operations.

**Remote Control Systems
Scenario:**
Home automation systems use command objects to encapsulate device actions (e.g., turning lights on/off, adjusting thermostats) which are then invoked by a remote control.

**Batch Processing
Scenario:**
In job scheduling, commands can be queued and executed sequentially or in parallel, allowing for flexible execution strategies.

**5. Design Considerations and Best Practices
Decoupling and Single Responsibility
Separate Concerns:**
Ensure that the command objects are focused solely on encapsulating the action and its parameters.

**Extensibility
Open/Closed Principle:**
Design your command interface and invoker such that new command types can be introduced without modifying existing code.

**Managing Command History
Undo/Redo:**
If implementing undo functionality, consider maintaining a stack of executed commands. Each command can implement an Unexecute() method if reversible.

**Testing and Debugging
Unit Testing:**
Test command implementations in isolation by injecting mock receivers. This helps ensure that commands perform the correct actions.

**Thread Safety
Concurrency Considerations:**
If commands are executed in a multi-threaded environment, ensure that shared resources are appropriately synchronized. The command pattern itself does not guarantee thread safety.

**6. Usage in .NET Framework
.NET Internals and Framework Use**
**Windows Communication Foundation (WCF):**
WCF uses command-like patterns to encapsulate service operations.

**UI Frameworks:**
Many UI frameworks implement command patterns for handling user actions (e.g., ICommand in WPF), enabling data binding and decoupling of UI and business logic.

**Dependency Injection and Command Handling
DI Containers:**
Command objects are often managed by dependency injection frameworks to ensure that their dependencies (like receivers) are resolved at runtime, enhancing testability and flexibility.