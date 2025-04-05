gRPC supports various service types that allow you to choose the communication pattern that best suits your application's needs. Below, we break down each service type with detailed explanations and code examples.

---

## 1. Unary RPC

### **Description:**
- **Unary RPC** is the simplest form of gRPC call where the client sends a single request and receives a single response.
- **Use Case:**  
  Ideal for simple operations like fetching a record or submitting a form, where one request directly corresponds to one response.

### **Example:**
**Proto File Definition:**
```proto
syntax = "proto3";

package greeter;

// Define the request and response messages.
message HelloRequest {
  string name = 1;
}

message HelloReply {
  string message = 1;
}

// Define the service with a unary RPC.
service Greeter {
  rpc SayHello(HelloRequest) returns (HelloReply);
}
```

**Server-Side Implementation in C#:**

```csharp
using Grpc.Core;
using System.Threading.Tasks;

public class GreeterService : Greeter.GreeterBase
{
    public override Task<HelloReply> SayHello(HelloRequest request, ServerCallContext context)
    {
        return Task.FromResult(new HelloReply { Message = "Hello " + request.Name });
    }
}
```

**Client-Side Call in C#:**

```csharp
using Grpc.Net.Client;
using greeter;

using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new Greeter.GreeterClient(channel);
var reply = await client.SayHelloAsync(new HelloRequest { Name = "Alice" });
Console.WriteLine("Greeting: " + reply.Message);
```

**2. Server Streaming RPC
Description:**
Server Streaming RPC allows the client to send a single request and then receive a stream of responses from the server.

**Use Case:**
Ideal for scenarios where the server needs to send multiple pieces of data in response to one client request, such as live updates or notifications.

Example:
Proto File Definition:

```proto
syntax = "proto3";

package weather;

message WeatherRequest {
  string city = 1;
}

message WeatherUpdate {
  double temperature = 1;
  string condition = 2;
}

service WeatherService {
  rpc GetWeatherUpdates(WeatherRequest) returns (stream WeatherUpdate);
}
```

**Client-Side Streaming in C#:**

```csharp
using Grpc.Net.Client;
using weather;

using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new WeatherService.WeatherServiceClient(channel);
using var call = client.GetWeatherUpdates(new WeatherRequest { City = "Seattle" });
while (await call.ResponseStream.MoveNext())
{
    var update = call.ResponseStream.Current;
    Console.WriteLine($"Temperature: {update.Temperature}, Condition: {update.Condition}");
}
```

**3. Client Streaming RPC
Description:**
Client Streaming RPC enables the client to send a stream of requests to the server and then receive a single response after sending all the data.

**Use Case:**
Suitable for operations like file uploads or batch processing, where multiple pieces of data are sent to the server in one go.

Example:
Proto File Definition:

```proto
syntax = "proto3";

package fileupload;

message FileChunk {
  bytes data = 1;
}

message UploadStatus {
  bool success = 1;
  string message = 2;
}

service FileService {
  rpc UploadFile(stream FileChunk) returns (UploadStatus);
}
```

**Client-Side Streaming in C#:**

```csharp
using Grpc.Net.Client;
using fileupload;

using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new FileService.FileServiceClient(channel);
using var call = client.UploadFile();
foreach (var chunk in fileChunks) // Assume fileChunks is a collection of FileChunk objects.
{
    await call.RequestStream.WriteAsync(chunk);
}
await call.RequestStream.CompleteAsync();
var status = await call;
Console.WriteLine($"Upload Success: {status.Success}, Message: {status.Message}");
```

**4. Bidirectional Streaming RPC
Description:**
Bidirectional Streaming RPC allows both the client and the server to send streams of messages independently. They can read and write concurrently.

**Use Case:**
Ideal for interactive applications such as live chat systems or real-time collaborative tools, where both sides continuously exchange data.

Example:
Proto File Definition:

```proto
syntax = "proto3";

package chat;

message ChatMessage {
  string user = 1;
  string text = 2;
}

service ChatService {
  rpc Chat(stream ChatMessage) returns (stream ChatMessage);
}
```

**Client-Side Bidirectional Streaming in C#:**

```csharp
using Grpc.Net.Client;
using chat;

using var channel = GrpcChannel.ForAddress("https://localhost:5001");
var client = new ChatService.ChatServiceClient(channel);
using var call = client.Chat();

// Task to read messages from the server.
var readTask = Task.Run(async () =>
{
    await foreach (var message in call.ResponseStream.ReadAllAsync())
    {
        Console.WriteLine($"{message.User}: {message.Text}");
    }
});

// Simulate sending messages to the server.
foreach (var chatMessage in messagesToSend) // Assume messagesToSend is a list of ChatMessage objects.
{
    await call.RequestStream.WriteAsync(chatMessage);
}
await call.RequestStream.CompleteAsync();
await readTask;
```