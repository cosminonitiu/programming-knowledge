## 1. INotifyPropertyChanged

### Overview
- **Namespace:** `System.ComponentModel`
- **Purpose:**  
  Allows an object to notify clients, typically binding clients, that one or more of its properties have changed. It is fundamental to the Model-View-ViewModel (MVVM) pattern in UI frameworks like WPF, UWP, and Xamarin.
  
### Key Member
- **Event:**  
  ```typescript
  event PropertyChangedEventHandler PropertyChanged;
  ```

The PropertyChanged event should be raised whenever a property value changes.

**How It Works**
**Binding and UI Updates:**
Data-bound UI elements listen for the PropertyChanged event. When the event is raised, the UI updates to reflect the new property value.

Implementation Example:

```typescript
public class Person : INotifyPropertyChanged
{
    private string _name;
    
    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                _name = value;
                OnPropertyChanged(nameof(Name));
            }
        }
    }
    
    public event PropertyChangedEventHandler PropertyChanged;
    
    protected virtual void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```
**Use Cases**
**UI Data Binding:**
In MVVM applications, view models implement INotifyPropertyChanged to automatically update views.

**Live Data Updates:**
Objects that change over time (e.g., sensor data, stock prices) use this interface to propagate updates.

**2. INotifyCollectionChanged
Overview**
Namespace: System.Collections.Specialized

**Purpose:**
Notifies clients that a collection has changed, typically used with data-binding in UI frameworks.

**Key Member**
Event:

```typescript
event NotifyCollectionChangedEventHandler CollectionChanged;
```
This event provides detailed information about the changes, such as items added, removed, or the entire collection reset.

**How It Works**
**Observable Collections:**
Classes like ObservableCollection<T> implement this interface to signal updates to bound UI elements.

**Event Arguments:**
NotifyCollectionChangedEventArgs contains details about the change (action type, affected items, indices).

**Use Cases
Dynamic Lists:**
In WPF, when items are added or removed from a list, the UI updates automatically.

**Data Grids and Lists**:
Useful for any collection that supports dynamic updates where the UI must reflect changes in real time.

**3. INotifyDataErrorInfo
Overview**
Namespace: System.ComponentModel

**Purpose:**
Provides a way for an object to report validation errors. This is especially useful in data binding scenarios where validation feedback is needed (e.g., form inputs).

**Key Members**
Properties:

bool HasErrors { get; } – Indicates whether the object has validation errors.

Event:

```typescript
event EventHandler<DataErrorsChangedEventArgs> ErrorsChanged;```
**Methods**:

```typescript
IEnumerable GetErrors(string propertyName);
```
This method returns the validation errors for a specified property or for the entire object if the property name is null or empty.

**How It Works
Validation Feedback:**
The UI listens to the ErrorsChanged event to display validation messages.

**Integration with MVVM:**
View models implement this interface to provide immediate feedback when data entered by the user is invalid.

**Use Cases
Form Validation:**
Providing error messages next to input fields.

Data Entry Applications:
Ensuring data integrity by validating user input in real time.

**4. INotifyPropertyChanging
Overview**
Namespace: System.ComponentModel

**Purpose:**
Similar to INotifyPropertyChanged, but it notifies clients before a property value changes. This is useful when you need to perform actions or validations just prior to the change.

Key Member
Event:

```typescript
event PropertyChangingEventHandler PropertyChanging;```
**How It Works
Pre-Change Notification:**
The event is raised before the property’s value is updated, allowing listeners to cancel the change or perform preparatory actions.

Example:

```typescript
public class Person : INotifyPropertyChanging, INotifyPropertyChanged
{
    private string _name;

    public string Name
    {
        get => _name;
        set
        {
            if (_name != value)
            {
                OnPropertyChanging(nameof(Name));
                _name = value;
                OnPropertyChanged(nameof(Name));
            }
        }
    }

    public event PropertyChangingEventHandler PropertyChanging;
    public event PropertyChangedEventHandler PropertyChanged;

    protected virtual void OnPropertyChanging(string propertyName)
    {
        PropertyChanging?.Invoke(this, new PropertyChangingEventArgs(propertyName));
    }

    protected virtual void OnPropertyChanged(string propertyName)
    {
        PropertyChanged?.Invoke(this, new PropertyChangedEventArgs(propertyName));
    }
}
```
**Use Cases
Complex State Management:**
When changing a property requires cleanup or preparation before the change occurs.

**Transactional Updates:**
Allowing rollback or auditing of changes before they are finalized.

**5. INotifyCompletion and ICriticalNotifyCompletion
Overview
Namespace:**
System.Runtime.CompilerServices

**Purpose:**
These interfaces are integral to the implementation of the async/await pattern in C#. They enable custom awaitable types by providing notifications when asynchronous operations are complete.

**INotifyCompletion**
**Definition:**
Declares a single method:

```typescript
void OnCompleted(Action continuation);```
This method is used to schedule a continuation when the awaitable operation completes.

**ICriticalNotifyCompletion**
**Definition:**
Extends INotifyCompletion by adding critical notification capabilities:

```typescript
void UnsafeOnCompleted(Action continuation);
```
This method allows scheduling a continuation with reduced security checks, which is useful in performance-critical scenarios.

**How They Work
Integration with Async/Await:**
The C# compiler uses these interfaces to enable the await keyword. Custom awaitable types implement these interfaces to provide the necessary hooks for the compiler-generated state machine.

**Continuations:**
When an asynchronous operation completes, OnCompleted (or UnsafeOnCompleted) is called, resuming the execution of the async method.

**Security Considerations:**
UnsafeOnCompleted bypasses some safety checks and should be used only when you’re confident that the code is secure.

**Use Cases**
**Custom Awaitable Types:**
When designing custom asynchronous types, such as timers, network operations, or cooperative multitasking constructs.

**Performance Optimizations:**
In scenarios where the overhead of standard safety checks in OnCompleted is significant, UnsafeOnCompleted can be used after careful consideration.