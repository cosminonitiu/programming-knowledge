The evolution from HTTP/1.1 to HTTP/2 and HTTP/3 aims to address long-standing performance and security challenges in web communication. Both **HTTP/2** and **HTTP/3** introduce significant improvements over HTTP/1.1.

---

## 1. HTTP/2 Overview

### Multiplexing
- **Definition**: Multiplexing allows multiple requests and responses to be sent simultaneously over a single TCP connection.
- **Why It Matters**:  
  - In HTTP/1.1, a single TCP connection can process only one request-response pair at a time (pipelining was possible but had issues).  
  - HTTP/2 eliminates the need for multiple TCP connections or complex workarounds (like domain sharding).
- **Streams**: Each request/response is mapped to a **stream**, identified by a stream ID. These streams share one TCP connection, but they operate independently.

### Server Push
- **Definition**: Server push allows a server to send additional resources to a client **before** the client explicitly requests them.
- **Example**:  
  - A browser requests `index.html`.  
  - The server “pushes” `styles.css` and `app.js` immediately, without waiting for separate requests.
- **Benefit**: Reduces latency by preemptively supplying resources the server knows the client will need.

### Header Compression
- **HPACK**: HTTP/2 uses the **HPACK** algorithm to compress headers, reducing overhead.
- **Why It Matters**: HTTP headers can be quite large, especially with repeated cookies, user agents, etc. Compressing them improves performance on high-latency connections.

### In .NET (Kestrel and HttpClient)
- **Kestrel**:  
  - Supports HTTP/2 by default in ASP.NET Core if TLS ALPN negotiation succeeds and the client supports HTTP/2.
  - No extra code is required, but you can configure it in `appsettings.json` or `Program.cs`.
- **HttpClient**:  
  - Automatically negotiates HTTP/2 when connecting to servers that support it, if TLS ALPN is available.
  - Ensure you’re running on a platform version that supports ALPN (e.g., Windows 10+ or the latest Linux distros).

---
## 2. HTTP/3 Overview

### QUIC-Based Transport
- **Definition**: HTTP/3 replaces TCP+TLS with a new protocol called **QUIC**, built on top of UDP.
- **Why QUIC?**  
  - **Faster Handshakes**: QUIC combines TLS encryption and transport handshakes into fewer round trips.  
  - **Better Performance Under Packet Loss**: QUIC streams handle packet loss more gracefully, reducing head-of-line blocking issues common in TCP.
- **Security**: QUIC is encrypted by default, incorporating TLS 1.3 within its handshake.

### Benefits of HTTP/3
1. **Reduced Latency**: Shorter handshake (often just 1-RTT or 0-RTT) means faster secure connections, especially on mobile networks.  
2. **No Head-of-Line Blocking at the Transport Layer**: If one packet is lost, only the affected stream is delayed, not every active stream on that connection (as can happen with TCP).
3. **Connection Migration**: QUIC can seamlessly move a session across networks (e.g., from Wi-Fi to cellular) without dropping the connection.

### In .NET (Kestrel and HttpClient)
- **Kestrel** (as of .NET 6/.NET 7+):  
  - Experimental or in-progress support for HTTP/3 and QUIC.  
  - May require specific configuration flags or environment variables to enable.  
  - TLS certificates must support TLS 1.3 for QUIC.
- **HttpClient**:  
  - .NET continues to add HTTP/3 support behind flags or in preview versions.  
  - Check Microsoft Docs or release notes for the latest guidance on enabling HTTP/3 in your environment.

---