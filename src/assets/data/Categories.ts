import { Category } from "../../shared/models/Category ";
import { BookIcon, ServerIcon, Cog, Network, Database } from 'lucide-angular';

export const categories_mock: Category[] = [
    {
      id: "frontend",
      name: "Frontend",
      icon: BookIcon,
      subcategories: [
        {
          id: "react",
          name: "React",
          description: "A JavaScript library for building user interfaces",
          topics: []
        },
        {
          id: "css",
          name: "CSS",
          description: "Cascading Style Sheets for web design",
          topics: []
        },
      ],
    },
    {
      id: "backend",
      name: "Backend",
      icon: ServerIcon,
      subcategories: [
        {
          id: "csharpjunior",
          name: "C# - Junior",
          description: "Essential C# concepts for junior developers",
          topics: [
            {
              id: "clr",
              title: "Common Language Runtime",
              description: "Understanding the CLR and how it executes .NET applications",
              threads: [
                {
                  id: "overview",
                  title: "CLR Overview",
                  contentPreview: "The Common Language Runtime (CLR) is the virtual machine component of Microsoft's .NET framework that manages the execution of .NET programs.",
                  contentPath: "csharpjunior/clr/overview"
                },
                {
                  id: "assemblies",
                  title: "Assemblies and Intermediary Language",
                  contentPreview: "In the .NET ecosystem, assemblies and the Intermediate Language (IL) are core concepts that form the foundation of how applications are built, deployed, and executed by the Common Language Runtime (CLR).",
                  contentPath: "csharpjunior/clr/assemblies"
                },
                {
                  id: "jit",
                  title: "Just-In-Time Compilation",
                  contentPreview: "JIT compilation is a key mechanism used by the CLR to convert Intermediate Language (IL) into native machine code at runtime. This process allows .NET applications to run efficiently on the target hardware, while also enabling runtime optimizations.",
                  contentPath: "csharpjunior/clr/jit"
                },
                {
                  id: "memorymanagement",
                  title: "Basic Memory Management and Garbage Collection",
                  contentPreview: "Understanding memory management is essential for building efficient .NET applications. The CLR (Common Language Runtime) handles memory automatically through garbage collection, which relieves developers from manual memory allocation and deallocation.",
                  contentPath: "csharpjunior/clr/memorymanagement"
                },
                {
                  id: "exceptionhandling",
                  title: "Exception Handling in the CLR",
                  contentPreview: "The CLR provides a robust, structured exception handling mechanism that allows .NET applications to gracefully manage errors and unexpected conditions during execution. This mechanism is based on try/catch/finally constructs and supports features like exception propagation, stack unwinding, and the use of finalizers for cleanup.",
                  contentPath: "csharpjunior/clr/exceptionhandling"
                },
                {
                  id: "garbage",
                  title: "Garbage Collection Mechanisms",
                  contentPreview: "The .NET garbage collector (GC) is responsible for automatically managing memory, ensuring that objects no longer in use are reclaimed to free up resources. It employs several advanced mechanisms to optimize performance and efficiency.",
                  contentPath: "csharpjunior/clr/garbage"
                },
                {
                  id: "reflection",
                  title: "Reflection and Metadata Inspection",
                  contentPreview: "Reflection is a powerful feature in .NET that allows you to inspect assemblies, types, and their members at runtime. It enables dynamic type creation, runtime code execution, and various other advanced programming scenarios.",
                  contentPath: "csharpjunior/clr/reflection"
                },
                {
                  id: "assemlyversioning",
                  title: "Assembly Versioning and Strong Naming",
                  contentPreview: "Understanding assembly versioning and strong naming is essential for maintaining reliable, secure, and interoperable .NET applications. This topic covers the fundamentals of strong naming, assembly versioning, and the role of the Global Assembly Cache (GAC), along with best practices for managing assembly versions.",
                  contentPath: "csharpjunior/clr/assemlyversioning"
                },
                {
                  id: "typesafety",
                  title: "Type Safety and Security",
                  contentPreview: "The Common Language Runtime (CLR) plays a pivotal role in ensuring that .NET applications are secure and reliable. Two key aspects of this are enforcing type safety and managing code security through mechanisms like Code Access Security (CAS) and modern security practices.",
                  contentPath: "csharpjunior/clr/typesafety"
                },
                {
                  id: "profiling",
                  title: "Profiling and Performance Tuning in the CLR",
                  contentPreview: "Profiling and performance tuning are essential practices for optimizing .NET applications. By using specialized tools and techniques, you can identify performance bottlenecks in managed code and fine-tune your application for better responsiveness and efficiency.",
                  contentPath: "csharpjunior/clr/profiling"
                },
                {
                  id: "dynamiccode",
                  title: "Low-Level IL and Dynamic Code Generation",
                  contentPreview: "Exploring low-level Intermediate Language (IL) and dynamic code generation provides deep insights into how .NET executes code and opens up advanced scenarios for runtime optimization and flexibility.",
                  contentPath: "csharpjunior/clr/dynamiccode"
                },
                {
                  id: "interoperability",
                  title: "Interoperability with Unmanaged Code",
                  contentPreview: "Interoperability enables managed .NET applications to call into native libraries or components written in unmanaged code (e.g., C/C++ or COM components). This capability allows you to leverage existing code and system APIs while still benefiting from the productivity and safety of the .NET environment.",
                  contentPath: "csharpjunior/clr/interoperability"
                },
                {
                  id: "internals",
                  title: "CLR Internals and Hosting the CLR",
                  contentPreview: "Understanding the internals of the CLR and learning how to host it in custom applications can provide deep insights into how .NET manages code execution, memory, and security. This knowledge is useful for advanced scenarios such as optimizing performance, dynamic assembly loading, and embedding .NET into native applications.",
                  contentPath: "csharpjunior/clr/internals"
                },
                {
                  id: "memorylayout",
                  title: "Memory Layout and Low-Level Memory Management",
                  contentPreview: "Understanding how memory is allocated and managed is critical for writing high-performance .NET applications. This topic covers the differences between stack and heap allocation, as well as how memory fragmentation can impact performance.",
                  contentPath: "csharpjunior/clr/memorylayout"
                },
                {
                  id: "async",
                  title: "Asynchronous Programming and the CLR",
                  contentPreview: "Asynchronous programming is a core aspect of modern .NET development, and the CLR provides extensive support for asynchronous operations through the async/await pattern, Task-based Asynchronous Pattern (TAP), and an efficient thread pool.",
                  contentPath: "csharpjunior/clr/async"
                },
                {
                  id: "gac",
                  title: "Global Assembly Cache",
                  contentPreview: "The Global Assembly Cache (GAC) is a machine-wide code cache for the Common Language Runtime (CLR) in the .NET Framework. It stores assemblies specifically designated to be shared by several applications on the computer.",
                  contentPath: "csharpjunior/clr/gac"
                }
              ]
            },
            {
              id: "othermajor",
              title: "Other Major Components of .Net",
              description: "Besides the CLR, the main keys of the .Net platform",
              threads: [
                {
                  id: "fcl",
                  title: "Framework Class Library(FCL)",
                  contentPreview: "The Framework Class Library (FCL) is a comprehensive collection of reusable classes, interfaces, and value types that are part of Microsoft's .NET Framework. These libraries provide the underlying building blocks for any .NET-based application, handling everything from file I/O and string manipulation to advanced networking and data access.",
                  contentPath: "csharpjunior/othermajor/fcl"
                },
                {
                  id: "bcl",
                  title: "The .NET Base Class Library (BCL)",
                  contentPreview: "The Base Class Library (BCL) is a subset of the .NET Framework Class Library (FCL) that provides the most fundamental and commonly used core APIs. It includes basic types (e.g., System.Object, System.String), collections, I/O, and other essential functionality. ",
                  contentPath: "csharpjunior/othermajor/bcl"
                },
                {
                  id: "cts",
                  title: "Common Type System(CTS)",
                  contentPreview: "The Common Type System (CTS) is a fundamental part of the .NET architecture that defines how types (classes, interfaces, structs, enums, etc.) are declared, used, and managed in the runtime.",
                  contentPath: "csharpjunior/othermajor/cts"
                },
                {
                  id: "cls",
                  title: "Common Language Specification (CLS)",
                  contentPreview: "The Common Language Specification (CLS) is a key part of the .NET platform that defines a subset of language features and rules that all .NET languages can agree upon. ",
                  contentPath: "csharpjunior/othermajor/cls"
                }
              ]
            },
            {
              id: "oop",
              title: "Object Oriented Programming in C#",
              description: "How principles of OOP are reflected in C# .Net and examples on how to follow best practices when designing your code.",
              threads: [
                {
                  id: "encapsulation",
                  title: "Encapsulation",
                  contentPreview: "Encapsulation is the principle of bundling the data (fields) and the methods (functions) that operate on the data into a single unit or class, and restricting access to some of the object's components. ",
                  contentPath: "csharpjunior/oop/encapsulation"
                },
                {
                  id: "inheritance",
                  title: "Inheritance",
                  contentPreview: "nheritance allows one class (a derived or child class) to inherit the properties and behaviors (methods) from another class (the base or parent class).",
                  contentPath: "csharpjunior/oop/inheritance"
                },
                {
                  id: "polymorphism",
                  title: "Polymorphism",
                  contentPreview: "Polymorphism allows objects of different types to be treated as objects of a common base type. The most common form of polymorphism in .NET is method overriding and method overloading.",
                  contentPath: "csharpjunior/oop/polymorphism"
                },
                {
                  id: "abstraction",
                  title: "Abstraction",
                  contentPreview: "Abstraction is the process of hiding the complex implementation details and exposing only the essential features of an object or system. ",
                  contentPath: "csharpjunior/oop/abstraction"
                },
                {
                  id: "classes",
                  title: "Different Classes in C#",
                  contentPreview: "Short Overview of the categories of classes in C#",
                  contentPath: "csharpjunior/oop/classes"
                },
                {
                  id: "extensionmethods",
                  title: "Extension Methods in C#",
                  contentPreview: "Extension methods in C# allow developers to add new methods to existing types without modifying, deriving from, or recompiling the original types.",
                  contentPath: "csharpjunior/oop/extensionmethods"
                },
                {
                  id: "attributes",
                  title: "Attributes in C#",
                  contentPreview: "Attributes in C# are a powerful way to add declarative information to your code. They are used to add metadata, such as compiler instructions, annotations, or custom information, to program elements (classes, methods, properties, etc.). ",
                  contentPath: "csharpjunior/oop/attributes"
                }
              ]
            },
            {
              id: 'datastructures',
              title: "Data structures in C#",
              description: "From the basics of usage, to memory allocation and Interfaces Implemented in C# Data structures",
              threads: [
                {
                  id: "array",
                  title: "Arrays, Multi-Dimensional Arrays, and Jagged Arrays",
                  contentPreview: "Understanding the various forms of arrays in C# is crucial not only for everyday programming but also for tackling advanced interview questions. ",
                  contentPath: "csharpjunior/datastructures/array"
                },
                {
                  id: "list",
                  title: "List",
                  contentPreview: "List<T> is a resizable array implementation provided by the .NET Framework in the System.Collections.Generic namespace.",
                  contentPath: "csharpjunior/datastructures/list"
                },
                {
                  id: "linkedlist",
                  title: "LinkedList",
                  contentPreview: "A generic collection where each element (node) contains a reference to both the previous and the next node, forming a bi-directional chain. ",
                  contentPath: "csharpjunior/datastructures/linkedlist"
                },
                {
                  id: "stackqueue",
                  title: "Stack And Queue",
                  contentPreview: "First in First Out or Last in First Out",
                  contentPath: "csharpjunior/datastructures/stackqueue"
                },
                {
                  id: "dictionary",
                  title: "Dictionary, SortedDictionary",
                  contentPreview: "The main key value data structure in C#",
                  contentPath: "csharpjunior/datastructures/dictionary"
                },
                {
                  id: "sortedlist",
                  title: "SortedList, Hashtable",
                  contentPreview: "SortedList<TKey, TValue> is a collection that stores key-value pairs in sorted order by key. ",
                  contentPath: "csharpjunior/datastructures/sortedlist"
                },
                {
                  id: "hashset",
                  title: "HashSet, SortedSet",
                  contentPreview: "HashSet<T> is a collection that stores unique elements without any particular order. It is optimized for fast lookup, insertion, and deletion operations.",
                  contentPath: "csharpjunior/datastructures/hashset"
                },
                {
                  id: "concurrent",
                  title: "ConcurrentQueue, ConcurrentStack, ConcurrentBag, ConcurrentDictionary",
                  contentPreview: "Thread safe versions of their counterparts",
                  contentPath: "csharpjunior/datastructures/concurrent"
                },
                {
                  id: "bitarray",
                  title: "BitArray",
                  contentPreview: "BitArray is a collection that stores Boolean values in a compact, bit-level representation. ",
                  contentPath: "csharpjunior/datastructures/bitarray"
                },
                {
                  id: "immutable",
                  title: "Immutable List,Dictionary, HashSet, Queue, Stack",
                  contentPreview: "Immutable versions of their counterparts",
                  contentPath: "csharpjunior/datastructures/immutable"
                },
                {
                  id: "tuple",
                  title: "Tuple and ValueTuple",
                  contentPreview: "The Tuple class (e.g., Tuple<T1, T2, ...>) is a reference type introduced in .NET Framework 4.0. Tuples are immutable, meaning once created, their values cannot change.",
                  contentPath: "csharpjunior/datastructures/tuple"
                },
                {
                  id: "span",
                  title: "Span and Memory",
                  contentPreview: "Span<T> is a stack-only type (a ref struct) that represents a contiguous region of arbitrary memory. It can point to arrays, stack-allocated memory, or unmanaged memory.",
                  contentPath: "csharpjunior/datastructures/span"
                },
                {
                  id: "priority",
                  title: "PriorityQueue",
                  contentPreview: "PriorityQueue<TElement, TPriority> is a collection that stores elements along with an associated priority. ",
                  contentPath: "csharpjunior/datastructures/priority"
                }
              ]
            },
            {
              id: 'linq',
              title: 'LINQ',
              description: 'LINQ (Language Integrated Query) is a powerful feature in C# that allows you to query collections, databases, and other data sources using a consistent, SQL-like syntax.',
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "What is LINQ and it's components",
                  contentPath: "csharpjunior/linq/overview"
                }
              ]
            },
            {
              id: 'serialization',
              title: 'Serialization and Encryption',
              description: 'Serialization is the process of converting an object or data structure into a format that can be easily stored, transmitted, or reconstructed later.',
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "Basis of Serialization and Encryption",
                  contentPath: "csharpjunior/serialization/overview"
                }
              ]
            },
            {
              id: 'algorithms',
              title: 'Algorithms',
              description: 'Common Algorithms used in Programming implemented in C#',
              threads: [
                {
                  id: "list",
                  title: "List Overview",
                  contentPreview: "Listing all common algorithms",
                  contentPath: "csharpjunior/algorithms/list"
                }
              ]
            },
            {
              id: 'interfaces',
              title: 'Common Interfaces',
              description: '',
              threads: [
                {
                  id: "ienumerable",
                  title: "IEnumerable, IEnumerable<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ienumerable"
                },
                {
                  id: "ienumerator",
                  title: "IEnumerator and IEnumerator<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ienumerator"
                },
                {
                  id: "icollection",
                  title: "ICollection and ICollection<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icollection"
                },
                {
                  id: "ilist",
                  title: "IList and IList<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ilist"
                },
                {
                  id: "idictionary",
                  title: "IDictionary and  IDictionary<TKey, TValue>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/idictionary"
                },
                {
                  id: "ireadonlycollection",
                  title: "IReadOnlyCollection<T> and IReadOnlyList<T> and IReadOnlyDictionary<TKey, TValue>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/ireadonlycollection"
                },
                {
                  id: "icomparable",
                  title: "IComparable and IComparable<T> and IEquatable<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icomparable"
                },
                {
                  id: "icloneable",
                  title: "ICloneable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icloneable"
                },
                {
                  id: "idisposable",
                  title: "IDisposable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/idisposable"
                },
                {
                  id: "iserializable",
                  title: "ISerializable and IDeserializationCallback",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iserializable"
                },
                {
                  id: "iformattable",
                  title: "ICustomFormatter and IFormattable",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iformattable"
                },
                {
                  id: "inotify",
                  title: "INotifyPropertyChanged and INotifyCollectionChanged and INotifyDataErrorInfo and INotifyPropertyChanging and INotifyCompletion and ICriticalNotifyCompletion",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/inotify"
                },
                {
                  id: "icomparer",
                  title: "IComparer and IComparer<T> and IEqualityComparer and IEqualityComparer<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/icomparer"
                },
                {
                  id: "iasync",
                  title: "IAsyncDisposable and IAsyncEnumerable<T> and IAsyncEnumerator<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iasync"
                },
                {
                  id: "iobservable",
                  title: "IObservable<T> and IObserver<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iobservable"
                },
                {
                  id: "iprogress",
                  title: "IProgress<T>",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iprogress"
                },
                {
                  id: "iconvertible",
                  title: "IConvertible",
                  contentPreview: "",
                  contentPath: "csharpjunior/interfaces/iconvertible"
                }
              ]
            },
            {
              id: 'delegates',
              title: 'Delegates',
              description: '',
              threads: [
                {
                  id: "overview",
                  title: "Introduction to Delegates",
                  contentPreview: "Delegates in C# are similar to function pointers in other languages but are type-safe and object-oriented. They allow you to reference methods as variables, pass them as parameters, and invoke them dynamically.",
                  contentPath: "csharpjunior/delegates/overview"
                },
                {
                  id: "multicast",
                  title: "Multicast Delegates",
                  contentPreview: "A multicast delegate is a delegate that can reference more than one method. In C#, all delegates are multicast by default. When you use the += operator, you add methods to the delegate's invocation list.",
                  contentPath: "csharpjunior/delegates/multicast"
                },
                {
                  id: "anonymous",
                  title: "Anonymous Methods and Lambda Expressions",
                  contentPreview: "Anonymous methods and lambda expressions in C# allow you to define inline functions without having to declare a separate method.",
                  contentPath: "csharpjunior/delegates/anonymous"
                },
                {
                  id: "covacontra",
                  title: "Covariance and Contravariance in Delegates",
                  contentPreview: "Covariance and contravariance allow for more flexible delegate assignments by enabling method signatures to vary in return types and parameter types under certain conditions.",
                  contentPath: "csharpjunior/delegates/covacontra"
                },
                {
                  id: "performance",
                  title: "Performance considerations in delegates",
                  contentPreview: "Delegates in C# provide a flexible mechanism for referencing and invoking methods. However, it's important to understand their performance implications, especially in performance-critical applications. ",
                  contentPath: "csharpjunior/delegates/performance"
                },
                {
                  id: "reflection",
                  title: "Reflection and Dynamic Invocation with Delegates",
                  contentPreview: "Delegates in C# provide a powerful mechanism for encapsulating method references, enabling dynamic method invocation and reflection-based operations. ",
                  contentPath: "csharpjunior/delegates/reflection"
                },
                {
                  id: "custom",
                  title: "Building Custom Delegate-Based Frameworks",
                  contentPreview: "​Delegates in C# are powerful tools that enable developers to design flexible and extensible frameworks. ",
                  contentPath: "csharpjunior/delegates/custom"
                },
                {
                  id: "async",
                  title: "Delegates in Asynchronous programming and MultiThreading",
                  contentPreview: "Delegates in C# serve as type-safe method pointers, enabling developers to encapsulate method references and invoke them dynamically. ",
                  contentPath: "csharpjunior/delegates/async"
                }
              ]
            },
            {
              id: 'events',
              title: 'Events',
              description: 'An event is a special kind of delegate that provides a publisher-subscriber model. It restricts how delegates are invoked and assigned, ensuring better encapsulation and safety.',
              threads: [
                {
                  id: "overview",
                  title: "Overview and History",
                  contentPreview: "While delegates are powerful, they have some limitations when used directly for event-driven programming. The event keyword was introduced to address these limitations",
                  contentPath: "csharpjunior/events/overview"
                }
              ]
            },
            {
              id: 'dpatterns',
              title: 'Design Patterns',
              description: 'Most common design patterns, and their use and implementations in C#',
              threads: [
                {
                  id: "singleton",
                  title: "Singleton Pattern",
                  contentPreview: "Guarantees that a class has a single, globally accessible instance, and restricts instantiation to one object.",
                  contentPath: "csharpjunior/dpatterns/singleton"
                },
                {
                  id: "factory",
                  title: "Factory Method Pattern",
                  contentPreview: "A design pattern that defines an interface for creating an object, but lets subclasses decide which class to instantiate.",
                  contentPath: "csharpjunior/dpatterns/factory"
                },
                {
                  id: "abstractfactory",
                  title: "Abstract Factory Pattern",
                  contentPreview: "The Abstract Factory Pattern defines an interface for creating a suite of related products. Each concrete factory implements this interface to create a set of objects that are designed to work together.",
                  contentPath: "csharpjunior/dpatterns/abstractfactory"
                },
                {
                  id: "adapter",
                  title: "Adapter Pattern",
                  contentPreview: "The Adapter Pattern converts the interface of a class into another interface that clients expect. It allows classes to work together that otherwise couldn't because of incompatible interfaces.",
                  contentPath: "csharpjunior/dpatterns/adapter"
                },
                {
                  id: "proxy",
                  title: "Proxy Pattern",
                  contentPreview: "The Proxy Pattern involves creating a proxy object that implements the same interface as the real subject (the object being proxied).",
                  contentPath: "csharpjunior/dpatterns/proxy"
                },{
                  id: "strategy",
                  title: "Strategy Pattern",
                  contentPreview: "The Strategy Pattern defines a common interface for a group of algorithms and allows the client to select the appropriate algorithm at runtime without changing the client’s code.",
                  contentPath: "csharpjunior/dpatterns/strategy"
                },
                {
                  id: "observer",
                  title: "Observer Pattern",
                  contentPreview: "The Observer Pattern establishes a subscription mechanism to allow multiple observer objects to be notified of changes in a subject object. ",
                  contentPath: "csharpjunior/dpatterns/observer"
                },
                {
                  id: "command",
                  title: "Command Pattern",
                  contentPreview: "The Command Pattern encapsulates a request as an object (command) that contains all information needed to perform an action, including the method to call, the object that owns the method, and any parameters.",
                  contentPath: "csharpjunior/dpatterns/command"
                },
                {
                  id: "yieldreturn",
                  title: "Yield Return",
                  contentPreview: "The yield return pattern is a powerful feature in C# that enables lazy evaluation and on-demand generation of sequences. ",
                  contentPath: "csharpjunior/dpatterns/yieldreturn"
                },
                {
                  id: "decorator",
                  title: "Decorator Pattern",
                  contentPreview: "The Decorator Pattern involves creating a set of decorator classes that are used to wrap concrete components.",
                  contentPath: "csharpjunior/dpatterns/decorator"
                },
                {
                  id: "builder",
                  title: "Builder Pattern",
                  contentPreview: "The Builder Pattern encapsulates the construction of an object in a separate Builder object.",
                  contentPath: "csharpjunior/dpatterns/builder"
                },
                {
                  id: "prototype",
                  title: "Prototype Pattern",
                  contentPreview: "The Prototype Pattern specifies the kind of objects to create using a prototypical instance, and creates new objects by copying this prototype.",
                  contentPath: "csharpjunior/dpatterns/prototype"
                },
                {
                  id: "facade",
                  title: "Facade Pattern",
                  contentPreview: "The Facade Pattern involves creating a facade class that offers a simplified interface to a set of interfaces in a subsystem. ",
                  contentPath: "csharpjunior/dpatterns/facade"
                },
                {
                  id: "mediator",
                  title: "Mediator Pattern",
                  contentPreview: "The Mediator Pattern defines an object that encapsulates how a set of objects interact. ",
                  contentPath: "csharpjunior/dpatterns/mediator"
                },
                {
                  id: "memento",
                  title: "Memento Pattern",
                  contentPreview: "The Memento Pattern involves three key roles: the Originator, which is the object whose state you want to capture; the Memento, which stores the state; and the Caretaker, which manages the mementos.",
                  contentPath: "csharpjunior/dpatterns/memento"
                },
                {
                  id: "iterator",
                  title: "Iterator Pattern",
                  contentPreview: "The Iterator Pattern defines a standard interface for traversing a collection, enabling clients to access its elements one at a time without knowing the internal structure of the collection.",
                  contentPath: "csharpjunior/dpatterns/iterator"
                },
                {
                  id: "composite",
                  title: "Composite Pattern",
                  contentPreview: "The Composite Pattern allows you to build a tree-like structure where individual objects (leaves) and groups of objects (composites) are treated the same way by the client through a common interface.",
                  contentPath: "csharpjunior/dpatterns/composite"
                },
                {
                  id: "flyweight",
                  title: "Flyweight Pattern",
                  contentPreview: "The Flyweight Pattern involves creating a flyweight object that contains the intrinsic state (shared among many objects) and storing extrinsic state (unique to each object) externally. This enables many objects to share the same flyweight, minimizing memory usage.",
                  contentPath: "csharpjunior/dpatterns/flyweight"
                },
                {
                  id: "visitor",
                  title: "Visitor Pattern",
                  contentPreview: "The Visitor Pattern lets you add further operations to objects without modifying them. It achieves this by having a visitor object that implements an operation for each concrete type of element in an object structure.",
                  contentPath: "csharpjunior/dpatterns/visitor"
                },
                {
                  id: "nullobject",
                  title: "Null Object Pattern",
                  contentPreview: "The Null Object Pattern involves creating a class that implements the expected interface but whose methods have no effect. This “null” implementation is used instead of returning null, thereby allowing clients to invoke methods without the need for null checks.",
                  contentPath: "csharpjunior/dpatterns/nullobject"
                },
                {
                  id: "templatemethod",
                  title: "Template Method Pattern",
                  contentPreview: "The Template Method Pattern defines a method (the template method) in an abstract class that outlines the steps of an algorithm. ",
                  contentPath: "csharpjunior/dpatterns/templatemethod"
                },
                {
                  id: "repository",
                  title: "Repository and Unit Of Work ",
                  contentPreview: "The Repository Pattern abstracts the data layer by providing a collection-like interface for accessing domain objects. This encapsulates data access logic, hiding details of the underlying persistence mechanism.",
                  contentPath: "csharpjunior/dpatterns/repository"
                },
                {
                  id: "depeninj",
                  title: "Dependency Injection",
                  contentPreview: "Dependency Injection is a technique where an object's dependencies (i.e., the services or objects it needs to function) are injected into it rather than being created internally. This allows the behavior of the class to be configured from the outside.",
                  contentPath: "csharpjunior/dpatterns/depeninj"
                },
                {
                  id: "bridge",
                  title: "Bridge Pattern",
                  contentPreview: "The Bridge Pattern separates an abstraction from its implementation by providing two independent class hierarchies: one for the abstraction and one for the implementation.",
                  contentPath: "csharpjunior/dpatterns/bridge"
                }
              ]
            }
          ]
        },
      ],
    },
    {
      id: "devops",
      name: "DevOps",
      icon: Cog,
      subcategories: [
        {
          id: "docker",
          name: "Docker",
          description: "Platform for developing, shipping, and running applications",
          topics: []
        },
        {
          id: "kubernetes",
          name: "Kubernetes",
          description: "Container orchestration system for automating deployment",
          topics: []
        },
      ],
    },
    {
      id: "networking",
      name: "Networking",
      icon: Network,
      subcategories: [
        {
          id: "http",
          name: "HTTP",
          description: "The foundation of data communication for the web",
          topics: []
        },
        {
          id: "tcp-ip",
          name: "TCP/IP",
          description: "Fundamental protocols for internet communications",
          topics: []
        },
      ],
    },
    {
      id: "sql",
      name: "SQL",
      icon: Database,
      subcategories: [
        {
          id: "mysql",
          name: "MySQL",
          description: "Open-source relational database management system",
          topics: []
        },
        {
          id: "postgresql",
          name: "PostgreSQL",
          description: "Advanced open-source relational database",
          topics: []
        },
      ],
    },
  ];