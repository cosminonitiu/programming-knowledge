Socket programming in .NET is primarily done using the classes in the `System.Net.Sockets` namespace. Two of the most common protocols for network communication are TCP (Transmission Control Protocol) and UDP (User Datagram Protocol), each serving different needs:

- **TCP:**  
  A connection-oriented protocol that ensures reliable, ordered, and error-checked delivery of data. It is best suited for applications where data integrity and order are critical (e.g., web servers, file transfers).

- **UDP:**  
  A connectionless protocol that sends data without establishing a connection. It offers lower latency and less overhead at the cost of reliability and order, making it ideal for real-time applications such as gaming, VoIP, or streaming.

---
## 1. TCP Socket Programming

### Key Classes
- **Socket:**  
  The core class for low-level socket programming.
- **TcpClient / TcpListener:**  
  Higher-level wrappers that simplify client-server communication over TCP.

### Basic TCP Server Example
```typescript
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public class TcpServer
{
    public async Task StartAsync(int port)
    {
        var listener = new TcpListener(IPAddress.Any, port);
        listener.Start();
        Console.WriteLine($"TCP Server started on port {port}.");

        while (true)
        {
            // Accept a client asynchronously.
            TcpClient client = await listener.AcceptTcpClientAsync();
            _ = HandleClientAsync(client); // Fire-and-forget handling.
        }
    }

    private async Task HandleClientAsync(TcpClient client)
    {
        Console.WriteLine("Client connected.");
        using (client)
        {
            var stream = client.GetStream();
            byte[] buffer = new byte[1024];
            int bytesRead;

            // Read data until the client disconnects.
            while ((bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length)) > 0)
            {
                string receivedText = Encoding.UTF8.GetString(buffer, 0, bytesRead);
                Console.WriteLine($"Received: {receivedText}");

                // Echo the data back to the client.
                await stream.WriteAsync(buffer, 0, bytesRead);
            }
        }
        Console.WriteLine("Client disconnected.");
    }
}

// Usage:
// var server = new TcpServer();
// await server.StartAsync(5000);
```

**Basic TCP Client Example**
```typescript
using System;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public class TcpClientExample
{
    public async Task RunAsync(string server, int port)
    {
        using (var client = new TcpClient())
        {
            await client.ConnectAsync(server, port);
            Console.WriteLine("Connected to TCP server.");
            var stream = client.GetStream();

            // Send a message.
            string message = "Hello, TCP Server!";
            byte[] data = Encoding.UTF8.GetBytes(message);
            await stream.WriteAsync(data, 0, data.Length);

            // Read the response.
            byte[] buffer = new byte[1024];
            int bytesRead = await stream.ReadAsync(buffer, 0, buffer.Length);
            string response = Encoding.UTF8.GetString(buffer, 0, bytesRead);
            Console.WriteLine($"Received from server: {response}");
        }
    }
}

// Usage:
// var clientExample = new TcpClientExample();
// await clientExample.RunAsync("localhost", 5000);
```

**2. UDP Socket Programming
Key Classes
UdpClient:**
A simplified class for UDP communication.

**Socket:**
For more advanced scenarios, the Socket class can also be used for UDP.

**Basic UDP Server Example**
```typescript
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public class UdpServer
{
    public async Task StartAsync(int port)
    {
        using (var udpClient = new UdpClient(port))
        {
            Console.WriteLine($"UDP Server started on port {port}.");

            while (true)
            {
                // Receive UDP datagram.
                UdpReceiveResult result = await udpClient.ReceiveAsync();
                string receivedText = Encoding.UTF8.GetString(result.Buffer);
                Console.WriteLine($"Received: {receivedText}");

                // Optionally, echo the data back to the sender.
                byte[] response = Encoding.UTF8.GetBytes("Echo: " + receivedText);
                await udpClient.SendAsync(response, response.Length, result.RemoteEndPoint);
            }
        }
    }
}

// Usage:
// var server = new UdpServer();
// await server.StartAsync(5001);
```
**Basic UDP Client Example**
```typescript
using System;
using System.Net;
using System.Net.Sockets;
using System.Text;
using System.Threading.Tasks;

public class UdpClientExample
{
    public async Task RunAsync(string server, int port)
    {
        using (var udpClient = new UdpClient())
        {
            udpClient.Connect(server, port);
            string message = "Hello, UDP Server!";
            byte[] data = Encoding.UTF8.GetBytes(message);
            
            // Send message to the UDP server.
            await udpClient.SendAsync(data, data.Length);
            Console.WriteLine("Message sent to UDP server.");

            // Receive a response.
            UdpReceiveResult result = await udpClient.ReceiveAsync();
            string response = Encoding.UTF8.GetString(result.Buffer);
            Console.WriteLine($"Received from server: {response}");
        }
    }
}

// Usage:
// var clientExample = new UdpClientExample();
// await clientExample.RunAsync("localhost", 5001);
```

**3. Key Differences and Considerations
TCP vs. UDP
TCP (Transmission Control Protocol):**

**Connection-Oriented:**
Requires establishing a connection before data transfer.

**Reliable:**
Guarantees delivery, ordering, and error checking.

**Overhead:**
Higher overhead due to connection management and error correction.

**UDP (User Datagram Protocol):

Connectionless:**
Data is sent without establishing a connection.

**Unreliable:**
No guarantee of delivery, ordering, or error correction.

**Performance:**
Lower latency and overhead, making it suitable for real-time applications.

**Memory and Performance Considerations
Buffer Management:**
For both TCP and UDP, appropriate buffer sizes should be chosen to optimize network performance. Overly large buffers may waste memory, while too small buffers might cause frequent I/O operations.

**Asynchronous Operations:**
Asynchronous methods (ReadAsync, WriteAsync, ReceiveAsync, SendAsync) prevent blocking threads and improve scalability, especially under high network load.

**Error Handling:**
Robust error handling is crucial. TCP’s reliability means that connection issues must be handled gracefully, while UDP requires additional logic to detect and recover from lost or out-of-order packets.

**Scalability:**
In high-performance applications, consider how many concurrent connections or datagrams your server can handle and optimize your architecture (e.g., using asynchronous processing, connection pooling, etc.).