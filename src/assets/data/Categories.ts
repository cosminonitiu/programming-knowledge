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
        {
          id: "csharpmedior",
          name: "C# - Medior",
          description: "Independent C# developers delving in",
          topics: [
            {
              id: "covacontra",
              title: "Covariance and Contravariance",
              description: "Covariance and contravariance support for method groups allows for matching method signatures with delegate types.",
              threads: [
                {
                  id: "covariance",
                  title: "Covariance",
                  contentPreview: "Covariance enables implicit conversion of an array of a more derived type to a less derived type. ",
                  contentPath: "csharpmedior/covacontra/covariance"
                },
                {
                  id: "contravariance",
                  title: "Contravariance",
                  contentPreview: "Contravariance is the in keyword and it denotes input types, usually in delegates. The principle is the same, it means that the delegate can accept more derived class.",
                  contentPath: "csharpmedior/covacontra/contravariance"
                }
              ]
            },
            {
              id: "reflection",
              title: "Reflection",
              description: "Reflection in .NET is a powerful feature that allows runtime inspection of assemblies, types, and their members (such as methods, fields, properties, and events).",
              threads: [
                {
                  id: "overview",
                  title: "Overview",
                  contentPreview: "Scenarios, Usefules and Definition",
                  contentPath: "csharpmedior/reflection/overview"
                }
              ]
            },
            {
              id: "memorymanagement",
              title: "Memory Management",
              description: "From Stack to Heap to Advanced Design Options",
              threads: [
                {
                  id: "stackheap",
                  title: "Stack and Heap",
                  contentPreview: "Overview of the 2 memory allocations available",
                  contentPath: "csharpmedior/memorymanagement/stackheap"
                },
                {
                  id: "refvaluetypes",
                  title: "Reference and Value Types",
                  contentPreview: "Types that stay on the heap or on the stack",
                  contentPath: "csharpmedior/memorymanagement/refvaluetypes"
                },
                {
                  id: "using",
                  title: "Using keyword",
                  contentPreview: "The usingstatement defines a scope at the end of which an object is disposed",
                  contentPath: "csharpmedior/memorymanagement/using"
                },
                {
                  id: "garbcollector",
                  title: "Garbage Collector",
                  contentPreview: "Automatically reclaims memory occupied by unreachable objects, freeing developers from manually deallocating memory and helping to avoid memory leaks.",
                  contentPath: "csharpmedior/memorymanagement/garbcollector"
                },
                {
                  id: "refandout",
                  title: "Ref keyword,Out keword",
                  contentPreview: "The ref and out keywords in C# are used to pass arguments by reference instead of by value. They allow methods to modify the value of the arguments passed to them",
                  contentPath: "csharpmedior/memorymanagement/refandout"
                },
                {
                  id: "boxing",
                  title: "Boxing and Unboxing",
                  contentPreview: "Boxing and unboxing are mechanisms in C# that allow value types (e.g., int, struct) to be treated as reference types (object) and vice versa. ",
                  contentPath: "csharpmedior/memorymanagement/boxing"
                },
                {
                  id: "varanddynamic",
                  title: "Var keyword vs Dynamic",
                  contentPreview: "Both var and dynamic are used for variable declaration in C#, but they serve different purposes and behave differently at compile time and runtime",
                  contentPath: "csharpmedior/memorymanagement/varanddynamic"
                },
                {
                  id: "typeerasure",
                  title: "Type Erasure",
                  contentPreview: "Type erasure is a concept commonly associated with generics in programming languages like Java and C#.",
                  contentPath: "csharpmedior/memorymanagement/typeerasure"
                },
                {
                  id: "stringbuilder",
                  title: "String vs StringBuilder",
                  contentPreview: "In C#, string and StringBuilder are both used to work with text, but they have different characteristics and use cases.",
                  contentPath: "csharpmedior/memorymanagement/stringbuilder"
                }
              ]
            },
            {
              id: "dependencyinjection",
              title: "Definition of Dependency Injection (DI)",
              description: "Dependency Injection (DI) is a design pattern and technique in software development that enables the decoupling of components by injecting an object's dependencies from the outside, rather than having the object create or obtain them itself. ",
              threads: [
                {
                  id: "definition",
                  title: "Definition",
                  contentPreview: "The basics of DI",
                  contentPath: "csharpmedior/dependencyinjection/definition"
                },
                {
                  id: "iocvsdep",
                  title: "Inversion of Control (IoC) vs. Dependency Injection",
                  contentPreview: "Although the terms are often used interchangeably, Inversion of Control (IoC) and Dependency Injection (DI) refer to related but distinct concepts in software design. ",
                  contentPath: "csharpmedior/dependencyinjection/iocvsdep"
                },
                {
                  id: "benefits",
                  title: "Benefits of DI",
                  contentPreview: "Dependency Injection (DI) offers numerous advantages in modern software development.",
                  contentPath: "csharpmedior/dependencyinjection/benefits"
                },
                {
                  id: "constructorin",
                  title: "Constructor Injection",
                  contentPreview: "Constructor Injection is the most common form of Dependency Injection (DI) in C#. It involves providing all required dependencies to a class through its constructor. ",
                  contentPath: "csharpmedior/dependencyinjection/constructorin"
                },
                {
                  id: "propertyin",
                  title: "Property (Setter) Injection",
                  contentPreview: "Property Injection involves exposing dependencies as public properties with setters. The DI container (or calling code) sets these properties after the object is created.",
                  contentPath: "csharpmedior/dependencyinjection/propertyin"
                },
                {
                  id: "methodin",
                  title: "Method Injection",
                  contentPreview: "Method Injection is a dependency injection (DI) technique where dependencies are provided as parameters to a method rather than through a constructor or property.",
                  contentPath: "csharpmedior/dependencyinjection/methodin"
                },
                {
                  id: "factoryin",
                  title: "Factory Injection",
                  contentPreview: "Factory Injection involves supplying a class with a factory object or a delegate that creates instances of a dependency.",
                  contentPath: "csharpmedior/dependencyinjection/factoryin"
                },
                {
                  id: "dip",
                  title: "Dependency Inversion Principle (DIP)",
                  contentPreview: "Both high-level and low-level modules should depend on abstractions (e.g., interfaces or abstract classes) rather than concrete implementations.",
                  contentPath: "csharpmedior/dependencyinjection/dip"
                },
                {
                  id: "srp",
                  title: "Single Responsibility Principle (SRP)",
                  contentPreview: "A class should have only one responsibility and, therefore, only one reason to change. This means that each class or module should focus on a single part of the functionality provided by the software.",
                  contentPath: "csharpmedior/dependencyinjection/srp"
                },
                {
                  id: "builtincontainer",
                  title: "Built-In .NET DI Container",
                  contentPreview: "A framework-provided container designed to manage the instantiation and lifetime of objects (services) in a decoupled, testable manner.",
                  contentPath: "csharpmedior/dependencyinjection/builtincontainer"
                },
                {
                  id: "thirdparcontainers",
                  title: "Third-Party DI Containers",
                  contentPreview: "Popular Third-Party DI Containers",
                  contentPath: "csharpmedior/dependencyinjection/thirdparcontainers"
                },
                {
                  id: "containerconfig",
                  title: "Container Configuration in Dependency Injection",
                  contentPreview: "Container configuration is the process of setting up and customizing a Dependency Injection (DI) container to manage the creation, lifetime, and dependencies of objects in your application.",
                  contentPath: "csharpmedior/dependencyinjection/containerconfig"
                },
                {
                  id: "mediatr",
                  title: "MediatR",
                  contentPreview: "MediatR centralizes communication between objects by acting as an intermediary. Instead of components directly calling each other, they send requests or notifications to MediatR, which then routes them to the appropriate handlers.",
                  contentPath: "csharpmedior/dependencyinjection/mediatr"
                },
                {
                  id: "lifetimes",
                  title: "Transient, Scoped, and Singleton Lifetimes",
                  contentPreview: "In the context of Dependency Injection (DI) in .NET, understanding service lifetimes is crucial for building efficient, scalable, and memory-safe applications. ",
                  contentPath: "csharpmedior/dependencyinjection/lifetimes"
                },
                {
                  id: "managingscope",
                  title: "Managing Scope",
                  contentPreview: "Managing scope refers to defining and controlling the lifetime boundaries within which services are created, used, and disposed.",
                  contentPath: "csharpmedior/dependencyinjection/managingscope"
                },
                {
                  id: "disposal",
                  title: "Disposal of Services",
                  contentPreview: "Many services hold unmanaged resources (or managed wrappers around unmanaged resources) that need to be explicitly released. Failure to do so can lead to resource exhaustion.",
                  contentPath: "csharpmedior/dependencyinjection/disposal"
                },
                {
                  id: "interception",
                  title: "Interception and Decorators",
                  contentPreview: "Interception and Decorators are advanced techniques used in .NET to extend or modify the behavior of objects without changing their code. ",
                  contentPath: "csharpmedior/dependencyinjection/interception"
                },
                {
                  id: "lazyinject",
                  title: "Lazy Injection and Factory Delegates",
                  contentPreview: "Lazy Injection and Factory Delegates are advanced dependency injection techniques in .NET that provide flexible and efficient ways to manage object creation.",
                  contentPath: "csharpmedior/dependencyinjection/lazyinject"
                },
                {
                  id: "circulardep",
                  title: "Handling Circular Dependencies",
                  contentPreview: "Circular dependencies occur when two or more services depend on each other, either directly or indirectly, creating a loop that can complicate or break the DI resolution process. ",
                  contentPath: "csharpmedior/dependencyinjection/circulardep"
                },
                {
                  id: "conditionalregis",
                  title: "Conditional Registration",
                  contentPreview: "Conditional Registration is a pattern where the DI container selects among multiple potential service implementations based on conditions determined at registration time or runtime. ",
                  contentPath: "csharpmedior/dependencyinjection/conditionalregis"
                },
                {
                  id: "customdi",
                  title: "Custom DI Container Implementations",
                  contentPreview: "Custom DI containers are often created to gain fine-grained control over object creation, lifetime management, and resolution behavior, or simply to understand the internal workings of DI. ",
                  contentPath: "csharpmedior/dependencyinjection/customdi"
                },
                {
                  id: "diasync",
                  title: "Asynchronous Programming and DI",
                  contentPreview: "DI containers resolve dependencies at runtime. When resolving services that support asynchronous operations, the DI container should correctly handle both synchronous and asynchronous lifecycles.",
                  contentPath: "csharpmedior/dependencyinjection/diasync"
                },
                {
                  id: "diasp",
                  title: "DI in ASP.NET Core",
                  contentPreview: "ASP.NET Core has dependency injection (DI) built into its core framework, making it a first-class citizen in the design of modern web applications.",
                  contentPath: "csharpmedior/dependencyinjection/diasp"
                },
                {
                  id: "didesktmobile",
                  title: "DI in Desktop and Mobile Applications",
                  contentPreview: "In these environments, DI enhances modularity, testability, and maintainability, especially in architectures like MVVM (Model-View-ViewModel) used in WPF, UWP, and Xamarin.",
                  contentPath: "csharpmedior/dependencyinjection/didesktmobile"
                },
                {
                  id: "microservicedi",
                  title: "Microservices and DI",
                  contentPreview: "Dependency Injection plays a vital role in this architecture by promoting modularity, improving testability, and managing service lifetimes within each microservice.",
                  contentPath: "csharpmedior/dependencyinjection/microservicedi"
                },
                {
                  id: "testmockdi",
                  title: "Testing and Mocking with DI",
                  contentPreview: "Dependency Injection (DI) greatly enhances testability by decoupling components from their concrete dependencies. ",
                  contentPath: "csharpmedior/dependencyinjection/testmockdi"
                },
                {
                  id: "performance",
                  title: "Performance Considerations",
                  contentPreview: "While Dependency Injection (DI) offers numerous benefits in terms of decoupling, testability, and maintainability, it is important to be aware of its potential performance implications. ",
                  contentPath: "csharpmedior/dependencyinjection/performance"
                }
              ]
            },
            {
              id: "realtimedata",
              title: "TCP/IP and UDP Socket Programming",
              description: "",
              threads: [
                {
                  id: "tcpudpprogam",
                  title: "Socket programming in .NET is primarily done using the classes in the System.Net.Sockets namespace. Two of the most common protocols for network communication are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), each serving different needs",
                  contentPreview: "",
                  contentPath: "csharpmedior/realtimedata/tcpudpprogam"
                },
                {
                  id: "http2",
                  title: "HTTP/HTTPS and HTTP/2",
                  contentPreview: "With the introduction of HTTP/2, significant performance improvements were achieved by addressing limitations in the older HTTP/1.x protocols.",
                  contentPath: "csharpmedior/realtimedata/http2"
                },
                {
                  id: "websockets",
                  title: "WebSockets",
                  contentPreview: "WebSockets are a protocol (defined in RFC 6455) that allows a persistent connection between a client (typically a web browser) and a server, enabling both parties to send data at any time.",
                  contentPath: "csharpmedior/realtimedata/websockets"
                },
                {
                  id: "sse",
                  title: "Server-Sent Events (SSE)",
                  contentPreview: "Server-Sent Events (SSE) are a standard allowing servers to push real-time updates to clients over a single, long-lived HTTP connection.",
                  contentPath: "csharpmedior/realtimedata/sse"
                },
                {
                  id: "signalr",
                  title: "SignalR in ASP.NET Core",
                  contentPreview: "SignalR is a high-level abstraction for real-time communication in ASP.NET Core. It simplifies the process of adding real-time web functionality to applications, enabling server-side code to push content instantly to connected clients.",
                  contentPath: "csharpmedior/realtimedata/signalr"
                },
                {
                  id: "rx",
                  title: "Reactive Extensions (Rx)",
                  contentPreview: "Reactive Extensions (Rx) is a powerful library for composing asynchronous and event-based programs using observable sequences and LINQ-style query operators. ",
                  contentPath: "csharpmedior/realtimedata/rx"
                },
                {
                  id: "async",
                  title: "Async/Await Pattern",
                  contentPreview: "The async/await pattern is a cornerstone of modern asynchronous programming in .NET.",
                  contentPath: "csharpmedior/realtimedata/async"
                },
                {
                  id: "paralleltpl",
                  title: "Parallel Programming and TPL",
                  contentPreview: "The Task Parallel Library (TPL) is a core component of .NET for parallel and asynchronous programming. ",
                  contentPath: "csharpmedior/realtimedata/paralleltpl"
                },
                {
                  id: "messagequeue",
                  title: "Message Queues and Brokers",
                  contentPreview: "Message queues and brokers are critical components for building distributed, decoupled, and scalable systems. ",
                  contentPath: "csharpmedior/realtimedata/messagequeue"
                },
                {
                  id: "eventsourcing",
                  title: "Event Sourcing and CQRS",
                  contentPreview: "Event Sourcing and Command Query Responsibility Segregation (CQRS) are complementary architectural patterns that help build scalable, maintainable, and auditable systems. ",
                  contentPath: "csharpmedior/realtimedata/eventsourcing"
                },
                {
                  id: "pubsub",
                  title: "Publish/Subscribe Patterns",
                  contentPreview: "Publish/Subscribe Patterns",
                  contentPath: "csharpmedior/realtimedata/pubsub"
                },
                {
                  id: "lowlatency",
                  title: "Low-Latency Data Processing",
                  contentPreview: "The goal is to process and deliver data with minimal delay, often measured in milliseconds or microseconds.",
                  contentPath: "csharpmedior/realtimedata/lowlatency"
                },
                {
                  id: "loadbala",
                  title: "Load Balancing and Scaling",
                  contentPreview: "The process of distributing incoming network traffic or workloads evenly across multiple servers or instances. ",
                  contentPath: "csharpmedior/realtimedata/loadbala"
                },
                {
                  id: "bufferingthrottle",
                  title: "Buffering, Throttling, and Backpressure",
                  contentPreview: "",
                  contentPath: "csharpmedior/realtimedata/bufferingthrottle"
                },
                {
                  id: "realtimeanal",
                  title: "Real-Time Analytics and Monitoring",
                  contentPreview: "Real-time analytics involves the continuous processing and analysis of data as it arrives, with minimal latency, to generate timely insights.",
                  contentPath: "csharpmedior/realtimedata/realtimeanal"
                },
                {
                  id: "sensorandiot",
                  title: "Sensor and IoT Data Acquisition",
                  contentPreview: "IoT (Internet of Things) data acquisition is the process of interfacing with physical sensors and devices to collect real-world data (e.g., temperature, humidity, motion) and transmit it for further processing.",
                  contentPath: "csharpmedior/realtimedata/sensorandiot"
                },
                {
                  id: "financialtrading",
                  title: "Financial and Trading Systems",
                  contentPreview: "Execution and data processing delays must be minimized to capture market opportunities.",
                  contentPath: "csharpmedior/realtimedata/financialtrading"
                },
                {
                  id: "gaming",
                  title: "Gaming and Interactive Applications",
                  contentPreview: "Fast response times are crucial for real-time interactions, whether for game physics, rendering, or input handling.",
                  contentPath: "csharpmedior/realtimedata/gaming"
                },
                {
                  id: "webrtc",
                  title: "WebRTC Integration in .NET",
                  contentPreview: "Enables peer-to-peer communication without the need for plugins.",
                  contentPath: "csharpmedior/realtimedata/webrtc"
                },
                {
                  id: "edgecomputing",
                  title: "Edge Computing and Real-Time Processing",
                  contentPreview: "Edge computing refers to the practice of processing data near the data source instead of sending it all to a centralized cloud. This reduces latency, saves bandwidth, and often enhances data security.",
                  contentPath: "csharpmedior/realtimedata/edgecomputing"
                },
                {
                  id: "realtimeml",
                  title: "Real-Time Machine Learning",
                  contentPreview: "nvolves training machine learning models on a complete, static dataset. Models are retrained periodically as new data accumulates.",
                  contentPath: "csharpmedior/realtimedata/realtimeml"
                },
                {
                  id: "distributedsystems",
                  title: "Distributed Systems and Consistency",
                  contentPreview: "Distributed systems consist of multiple autonomous components that communicate over a network to achieve a common goal. ",
                  contentPath: "csharpmedior/realtimedata/distributedsystems"
                }
              ]
            },
            {
              id: "exceptions",
              title: "Exceptions",
              description: "Exception Handling, Propagation and Advanced Handling",
              threads: [
                {
                  id: "recoverable",
                  title: "Recoverable Exceptions",
                  contentPreview: "These are errors that can be gracefully handled, allowing the application to continue running.",
                  contentPath: "csharpmedior/exceptions/recoverable"
                },
                {
                  id: "definition",
                  title: "Definition of Exceptions",
                  contentPreview: "Exceptions in .NET are objects that represent errors or unexpected conditions that occur during the execution of a program.",
                  contentPath: "csharpmedior/exceptions/definition"
                },
                {
                  id: "hierarchy",
                  title: "Exception Hierarchy in .NET",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/hierarchy"
                },
                {
                  id: "trycatch",
                  title: "try-catch-finally Blocks",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/trycatch"
                },
                {
                  id: "nestedtry",
                  title: "Nested try-catch Blocks",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/nestedtry"
                },
                {
                  id: "exceptionfilters",
                  title: "Using Exception Filters",
                  contentPreview: "Exception filters allow you to specify a boolean condition using a when clause on a catch block. The catch block is executed only if the condition evaluates to true. If it evaluates to false, the exception is not caught by that block, and the runtime continues searching for another handler.",
                  contentPath: "csharpmedior/exceptions/exceptionfilters"
                },
                {
                  id: "rethrow",
                  title: "Rethrowing Exceptions",
                  contentPreview: "",
                  contentPath: "csharpmedior/exceptions/rethrow"
                },
                {
                  id: "customexcep",
                  title: "Creating Custom Exception Classes",
                  contentPreview: "Represent errors that are specific to your application's business logic (e.g., InsufficientFundsException, OrderNotFoundException).",
                  contentPath: "csharpmedior/exceptions/customexcep"
                },
                {
                  id: "propagation",
                  title: "Propagation",
                  contentPreview: "When a method is invoked, a new frame is added to the call stack. If an exception is thrown, the runtime begins unwinding the stack, looking for a catch block that can handle the exception.",
                  contentPath: "csharpmedior/exceptions/propagation"
                },
                {
                  id: "swalla",
                  title: "Swallowing vs. Propagating Exceptions",
                  contentPreview: "Swallowing an exception means catching it and then not rethrowing it, effectively preventing the exception from propagating further up the call stack.",
                  contentPath: "csharpmedior/exceptions/swalla"
                },
                {
                  id: "async",
                  title: "Async/Await Exception Handling",
                  contentPreview: "When an async method throws an exception, the exception is captured and stored in the returned Task or Task<T>. It does not immediately crash the application or propagate up the call stack.",
                  contentPath: "csharpmedior/exceptions/async"
                },
                {
                  id: "aggregate",
                  title: "Handling AggregateException",
                  contentPreview: "AggregateException is an exception type that encapsulates multiple exceptions into a single object. It is typically thrown when one or more tasks in a parallel operation (or asynchronous operation) fail.",
                  contentPath: "csharpmedior/exceptions/aggregate"
                },
                {
                  id: "logging",
                  title: "Exception Logging",
                  contentPreview: "Capture the exception message, stack trace, inner exceptions, and contextual data to understand the cause and context of errors.",
                  contentPath: "csharpmedior/exceptions/logging"
                },
                {
                  id: "applevel",
                  title: "Application-Level Handlers",
                  contentPreview: "Captures exceptions that are not caught in any try-catch block on non-UI threads. It acts as a last-resort handler before the application terminates.",
                  contentPath: "csharpmedior/exceptions/applevel"
                },
                {
                  id: "middleware",
                  title: "Middleware in .NET",
                  contentPreview: "To catch unhandled exceptions thrown during the processing of HTTP requests, log them, and generate appropriate HTTP responses (such as error pages or JSON error messages).",
                  contentPath: "csharpmedior/exceptions/middleware"
                },
                {
                  id: "cost",
                  title: "Cost of Exceptions",
                  contentPreview: "When an exception is thrown, a new exception object is allocated on the managed heap. This involves memory allocation and, potentially, the collection of a stack trace, which can be expensive.",
                  contentPath: "csharpmedior/exceptions/cost"
                },
                {
                  id: "disclosure",
                  title: "Information Disclosure",
                  contentPreview: "The leakage of internal application details (such as file paths, configuration settings, database schemas, or system internals) that can be exploited by malicious actors to gain insights into the application’s structure, security weaknesses, or operational environment.",
                  contentPath: "csharpmedior/exceptions/disclosure"
                },
                {
                  id: "secure",
                  title: "Securing Exception Data",
                  contentPreview: "Only expose minimal, non-sensitive information in error messages displayed to users. Detailed technical data should be logged securely but not shown externally.",
                  contentPath: "csharpmedior/exceptions/secure"
                }
              ]
            },
            {
              id: "httpsessions",
              title: "HTTP Sessions",
              description: "All about HTTP Communications the right way",
              threads: [
                {
                  id: "httprequest",
                  title: "HTTP Request/Response Model",
                  contentPreview: "HTTP methods (also called verbs) specify the desired action to be performed on a resource (e.g., a web page, an API endpoint)",
                  contentPath: "csharpmedior/httpsessions/httprequest"
                },
                {
                  id: "http23",
                  title: "HTTP/2 and HTTP/3 Basics",
                  contentPreview: "The evolution from HTTP/1.1 to HTTP/2 and HTTP/3 aims to address long-standing performance and security challenges in web communication. Both HTTP/2 and HTTP/3 introduce significant improvements over HTTP/1.1.",
                  contentPath: "csharpmedior/httpsessions/http23"
                },
                {
                  id: "httpclient",
                  title: "HttpClient Overview",
                  contentPreview: "The HttpClient class is a high-level API for sending and receiving HTTP requests and responses in .NET applications. It simplifies creating, sending, and processing HTTP requests, whether you're consuming REST APIs, web pages, or other HTTP-based services.",
                  contentPath: "csharpmedior/httpsessions/httpclient"
                },
                {
                  id: "serialization",
                  title: "Serialization and Deserialization",
                  contentPreview: "When building HTTP-based applications (e.g., REST APIs or consuming external services), serialization (converting in-memory objects to textual or binary formats) and deserialization (converting data back to objects) are essential processes. ",
                  contentPath: "csharpmedior/httpsessions/serialization"
                },
                {
                  id: "middleware",
                  title: "Middleware",
                  contentPreview: "In ASP.NET Core, middleware are components that form a pipeline to handle incoming HTTP requests and outgoing responses.",
                  contentPath: "csharpmedior/httpsessions/middleware"
                },
                {
                  id: "routing",
                  title: "Routing",
                  contentPreview: "Routing in ASP.NET Core is the process of matching incoming HTTP requests to the correct endpoint (controller action, Razor Page, or other handler). ",
                  contentPath: "csharpmedior/httpsessions/routing"
                },
                {
                  id: "modelbinding",
                  title: "Model Binding and Validation",
                  contentPreview: "In ASP.NET Core, model binding automatically converts incoming HTTP request data (from route values, query strings, form fields, JSON bodies, etc.) into C# objects. Validation then checks these objects against defined rules, ensuring the data is valid before your application processes it.",
                  contentPath: "csharpmedior/httpsessions/modelbinding"
                },
                {
                  id: "statemanage",
                  title: "State Management Concepts",
                  contentPreview: "Because HTTP is stateless by default, the server does not automatically keep track of user data or session information between individual HTTP requests. Each request is treated as independent, with no built-in memory of previous requests. State management techniques allow you to persist user data or application data across multiple requests, creating a sense of continuity.",
                  contentPath: "csharpmedior/httpsessions/statemanage"
                },
                {
                  id: "sessionconfig",
                  title: "Session Configuration",
                  contentPreview: "HTTP is inherently stateless, but many web applications need to temporarily store user-specific data (e.g., a shopping cart, preferences, or temporary login tokens). Sessions allow you to associate data with a specific client across multiple requests. In ASP.NET Core, you can use the built-in session middleware and the ISession interface to manage session data.",
                  contentPath: "csharpmedior/httpsessions/sessionconfig"
                },
                {
                  id: "sessionlifetime",
                  title: "Session Lifetimes",
                  contentPreview: "Sessions in ASP.NET Core allow you to store temporary user-specific data across multiple requests. However, this data doesn’t persist indefinitely. You can control how long a session remains active with expiration settings. You also have the option to clear or abandon sessions when they’re no longer needed.",
                  contentPath: "csharpmedior/httpsessions/sessionlifetime"
                },
                {
                  id: "whycaching",
                  title: "Why Caching Matters",
                  contentPreview: "Caching is a strategy to store data in a way that enables faster access on subsequent requests. ",
                  contentPath: "csharpmedior/httpsessions/whycaching"
                },
                {
                  id: "responsedatacaching",
                  title: "Response Caching vs. Data Caching",
                  contentPreview: "Caching strategies in web applications can take different forms, generally falling into response-level caching (where the entire HTTP response is cached and reused) and data-level caching (where raw data or computed objects are cached on the server side). Understanding both approaches helps you design a more performant and scalable application.",
                  contentPath: "csharpmedior/httpsessions/responsedatacaching"
                },
                {
                  id: "cachingasp",
                  title: "Caching in ASP.NET Core",
                  contentPreview: "Caching helps reduce data retrieval costs, speed up response times, and improve scalability in your applications. ASP.NET Core offers built-in support for two primary caching models",
                  contentPath: "csharpmedior/httpsessions/cachingasp"
                },
                {
                  id: "expirationeviction",
                  title: "Expiration and Eviction Policies",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/expirationeviction"
                },
                {
                  id: "outputcache",
                  title: "Output Caching",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/outputcache"
                },
                {
                  id: "distributedcaching",
                  title: "Distributed Caching",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/distributedcaching"
                },
                {
                  id: "cacheinvalidstrategy",
                  title: "Cache Invalidation Strategies",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/cacheinvalidstrategy"
                },
                {
                  id: "cachestampedeprevention",
                  title: "Cache Stampede Prevention",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/cachestampedeprevention"
                },
                {
                  id: "contentnegotation",
                  title: "Content Negotiation",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/contentnegotation"
                },
                {
                  id: "httpcompression",
                  title: "HTTP Compression",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/httpcompression"
                },
                {
                  id: "chunkedtransfer",
                  title: "Chunked Transfer Encoding",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/chunkedtransfer"
                },
                {
                  id: "websockets",
                  title: "WebSockets and SignalR",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/websockets"
                },
                {
                  id: "httpstls",
                  title: "HTTPS and TLS",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/httpstls"
                },
                {
                  id: "auth",
                  title: "Authentication/Authorization",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/auth"
                },
                {
                  id: "xsscsrf",
                  title: "Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/xsscsrf"
                },
                {
                  id: "apikeys",
                  title: "API Keys, HMAC, and other Auth Schemes",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/apikeys"
                },
                {
                  id: "graphql",
                  title: "GraphQL on ASP.NET Core",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/graphql"
                },
                {
                  id: "grpc",
                  title: "gRPC in .NET",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/grpc"
                },
                {
                  id: "realtimeservices",
                  title: "Realtime Services",
                  contentPreview: "",
                  contentPath: "csharpmedior/httpsessions/realtimeservices"
                }
              ]
            }
          ]
        },
        {
          id: "csharpsenior",
          name: "C# - Senior",
          description: "Abstract and higher level architectural topics",
          topics: [
            {
              id: "architecture",
              title: "Architecture",
              description: "Design guidelines when defining your C# project at a high-level",
              threads: [
                {
                  id: "clean",
                  title: "Clean Architecture",
                  contentPreview: "Clean Architecture is an architectural pattern that separates the concerns of different parts of an application. It aims to make systems more maintainable and scalable by clearly separating different layers, such as business logic, data access, and user interfaces.",
                  contentPath: "csharpsenior/architecture/clean"
                },
                {
                  id: "solid",
                  title: "SOLID",
                  contentPreview: "The SOLID principles are a set of five design principles intended to make software more understandable, flexible, and maintainable. These principles can be applied in the context of object-oriented programming, and they align well with creating high-quality systems in .NET.",
                  contentPath: "csharpsenior/architecture/solid"
                },
                {
                  id: "cqrs",
                  title: "CQRS",
                  contentPreview: "CQRS is an architectural pattern that separates the handling of commands (write operations) and queries (read operations).",
                  contentPath: "csharpsenior/architecture/cqrs"
                },
                {
                  id: "eventsourcing",
                  title: "Event Sourcing",
                  contentPreview: "Event Sourcing is an architectural pattern where state changes are captured as a sequence of events. Instead of storing just the current state of an entity in a database, the system stores all the events that lead to the current state. ",
                  contentPath: "csharpsenior/architecture/eventsourcing"
                },
                {
                  id: "middleware",
                  title: "Middleware",
                  contentPreview: "Middleware in ASP.NET Core is software that's assembled into an application pipeline to handle requests and responses. Each component in the middleware pipeline is responsible for invoking the next component in the sequence or short-circuiting the chain if necessary. Middleware components can perform a variety of tasks, such as authentication, routing, session management, and logging.",
                  contentPath: "csharpsenior/architecture/middleware"
                }
              ]
            },
            {
              id: "threading",
              title: "Threading",
              description: "In Depth about Threading and Parallel Programming",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to Threading",
                  contentPreview: "Threading allows your application to run multiple blocks of code at the same time (or in parallel if your system has multiple CPU cores).",
                  contentPath: "csharpsenior/threading/introduction"
                },
                {
                  id: "threadmanage",
                  title: "Thread Creation and Management",
                  contentPreview: "Thread creation in C# gives you fine-grained control over how and when your code executes. In modern C#, you’ll often use Tasks or async/await for simplicity. However, understanding low-level thread creation remains valuable for complex or legacy scenarios.",
                  contentPath: "csharpsenior/threading/threadmanage"
                },
                {
                  id: "threadsync",
                  title: "Thread Synchronization",
                  contentPreview: "When multiple threads access shared resources, the order in which they operate can affect the outcome. ",
                  contentPath: "csharpsenior/threading/threadsync"
                },
                {
                  id: "threadcommun",
                  title: "Thread Communication",
                  contentPreview: "When multiple threads need to coordinate their work, they must communicate. In C#, thread communication typically happens through shared state (e.g., shared variables) or messaging (e.g., signaling with events or passing messages via thread-safe data structures). Proper communication ensures that each thread knows when it can safely proceed without causing data corruption or race conditions.",
                  contentPath: "csharpsenior/threading/threadcommun"
                },
                {
                  id: "threadpools",
                  title: "Thread Pools and Task Parallelism",
                  contentPreview: "Manually creating and managing threads can get complicated—especially when you have many short-lived tasks. The Thread Pool and Task Parallel Library (TPL) in C# are designed to simplify handling multiple tasks without the overhead of constantly spinning up new threads.",
                  contentPath: "csharpsenior/threading/threadpools"
                },
                {
                  id: "concurrpatterns",
                  title: "Concurrency Patterns",
                  contentPreview: "Concurrency patterns are high-level approaches or “blueprints” that help structure and coordinate multiple threads or tasks. Using these patterns effectively can simplify the complexity of multithreaded and asynchronous code.",
                  contentPath: "csharpsenior/threading/concurrpatterns"
                },
                {
                  id: "advancedthreading",
                  title: "Advanced Threading Techniques",
                  contentPreview: "Once you understand the fundamentals of threads, synchronization, and the higher-level abstractions (like Task and Parallel), you’re ready to explore advanced threading techniques. These techniques allow you to fine-tune performance, manage complex concurrency scenarios, and write more efficient, scalable applications.",
                  contentPath: "csharpsenior/threading/advancedthreading"
                }
              ]
            },
            {
              id: "async",
              title: "Asynchronous Programming",
              description: "In Depth about Asynchronous Programming",
              threads: [
                {
                  id: "introduction",
                  title: "Introduction to asynchronous programming",
                  contentPreview: "This feature allows developers to perform non-blocking operations without the complex code traditionally associated with asynchronous programming, such as callbacks or manual thread management",
                  contentPath: "csharpsenior/async/introduction"
                },
                {
                  id: "errorhandle",
                  title: "Handling Errors in Tasks",
                  contentPreview: "In asynchronous programming with C#, when a method returns a Task or Task<T>, exceptions should be handled within the task to avoid unhandled exceptions that can crash the application. ",
                  contentPath: "csharpsenior/async/errorhandle"
                }
              ]
            }
          ]
        }
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