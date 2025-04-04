## 1. Overview

### Definition and Purpose
- **Definition:**  
  The Memento Pattern involves three key roles: the Originator, which is the object whose state you want to capture; the Memento, which stores the state; and the Caretaker, which manages the mementos.
- **Primary Goals:**
  - **State Preservation:**  
    Capture an object's state at a specific point in time.
  - **Encapsulation:**  
    Keep the internal details of the object hidden from the caretaker.
  - **Undo/Redo Functionality:**  
    Enable reverting an object to a previous state without exposing its internal structure.

### When to Use It
- Implementing features like undo/redo in text editors, drawing applications, or any system that benefits from maintaining historical snapshots of object states.
- Situations where you need to restore an object's state after a failed operation or error recovery.

---

## 2. How It Works Under the Hood

### Key Components
- **Originator:**  
  The object whose state needs to be saved and restored. It creates a memento containing a snapshot of its current internal state and can use the memento to restore that state later.
  
- **Memento:**  
  An object that stores the internal state of the Originator. It is typically immutable and only accessible by the Originator.
  
- **Caretaker:**  
  Manages the mementos. It keeps track of the state history but does not modify or examine the contents of the mementos.

### Internal Mechanism
- **Encapsulation of State:**  
  The Memento Pattern preserves encapsulation by ensuring that the memento’s internal state is not exposed to the caretaker. Only the Originator can access and modify the state.
- **Immutable Snapshots:**  
  Mementos are often implemented as immutable objects. Once a snapshot is taken, it should not be altered, ensuring the integrity of the saved state.
- **State Restoration:**  
  When a state rollback is needed, the Originator retrieves the memento from the caretaker and restores its state. This decouples state management from the business logic.

---

## 3. C# Implementation Example

### Defining the Memento Class
```typescript
// Memento class: encapsulates the state of the Originator.
// It is typically immutable to ensure that the saved state remains unchanged.
public class Memento
{
    public string State { get; }

    public Memento(string state)
    {
        State = state;
    }
}
```

**The Originator Class**
```typescript
// The Originator maintains its state and can create a memento containing a snapshot of its state.
public class Originator
{
    public string State { get; set; }

    // Creates a memento that contains a snapshot of the current state.
    public Memento SaveState()
    {
        return new Memento(State);
    }

    // Restores the Originator's state from a memento.
    public void RestoreState(Memento memento)
    {
        State = memento.State;
    }
}
```

**The Caretaker Class**
```typescript
// The Caretaker is responsible for keeping the mementos. It does not, and should not, modify or inspect the mementos.
public class Caretaker
{
    private readonly List<Memento> _mementos = new List<Memento>();

    public void AddMemento(Memento memento)
    {
        _mementos.Add(memento);
    }

    public Memento GetMemento(int index)
    {
        return _mementos[index];
    }
}
```

**Putting It All Together**
```typescript
public class Program
{
    public static void Main()
    {
        Originator originator = new Originator();
        Caretaker caretaker = new Caretaker();

        // Initial state
        originator.State = "State #1";
        caretaker.AddMemento(originator.SaveState());

        // Changing state
        originator.State = "State #2";
        caretaker.AddMemento(originator.SaveState());

        // Further state change
        originator.State = "State #3";
        Console.WriteLine("Current State: " + originator.State);  // Outputs: State #3

        // Restore to a previous state
        originator.RestoreState(caretaker.GetMemento(1));
        Console.WriteLine("Restored State: " + originator.State);  // Outputs: State #2
    }
}
```

**4. Real-World Use Cases
Example: Undo/Redo Functionality**
Scenario:
A text editor that allows users to undo and redo actions can use the Memento Pattern to capture the state of the document after each change. When the user performs an undo operation, the editor restores the document to a previous state from the caretaker’s memento list.

**Example: Transaction Rollback**
Scenario:
In a banking application, if a transaction fails or needs to be rolled back, the system can revert the account’s state to a previous snapshot, ensuring consistency and reliability.
**
Example: Game State Management**
Scenario:
In a game, the Memento Pattern can be used to save game states at checkpoints. If the player fails or wants to retry, the game can restore the saved state.

**5. Best Practices and Interview Tips
Best Practices**
**Keep Mementos Immutable:**
Ensure that once a memento is created, its state does not change. This prevents accidental modifications and ensures consistency.

**Encapsulate State Details:**
The caretaker should not examine or modify the memento's internal state. Only the originator should manage its state.

**Manage Memory Usage:**
When capturing many mementos, be mindful of memory usage. Implement mechanisms to limit or compress stored states if necessary.

**Separate Concerns:**
Ensure that the memento pattern is used solely for state preservation, without embedding business logic in the memento or caretaker.

**Interview Tips
Explain the Roles:**
Clearly describe the roles of Originator, Memento, and Caretaker, and explain why encapsulation is important in this pattern.

**Discuss Immutability:**
Highlight why immutability is critical for mementos and how it prevents state corruption.

**Real-World Scenarios:**
Provide examples such as text editors, transaction systems, or game state management to illustrate practical applications.

**Trade-Offs:**
Mention potential downsides, such as increased memory usage when many mementos are stored, and strategies to mitigate these issues.