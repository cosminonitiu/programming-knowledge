- The [`using` statement](https://learn.microsoft.com/en-us/dotnet/csharp/language-reference/statements/using) defines a scope at the end of which an object is disposed
- Garbage collection nu intra peste elementele din scope-ul de using, e facut dispose manual
- De asemenea ce se creaza in acel using, este o instanta noua, un http client nou → poate cauza probleem deoarece este un numar limitat de socketuri
- The `using` statement is particularly useful for working with objects that implement the `IDisposable` interface, such as:

**Streams**: `FileStream`, `MemoryStream`

**Database Connections**: `SqlConnection`, `OleDbConnection`

**Network Resources**: `TcpClient`, `UdpClient`

**Custom Resources**: Any class implementing `IDisposable` for managing unmanaged resources

- In C# 8.0 and later, you can use the `using` declaration, which ensures that an object is disposed of once the scope ends, without needing explicit braces.