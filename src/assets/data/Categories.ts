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