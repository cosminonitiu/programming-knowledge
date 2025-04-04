The **`HttpClient`** class is a high-level API for sending and receiving HTTP requests and responses in .NET applications. It simplifies creating, sending, and processing HTTP requests, whether you're consuming REST APIs, web pages, or other HTTP-based services.

---

## 1. Creating and Configuring `HttpClient` Instances

### Basic Usage

```typescript
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class HttpClientExample
{
    public static async Task RunAsync()
    {
        // Creating an HttpClient instance
        using (HttpClient client = new HttpClient())
        {
            // Define a base address (optional but convenient)
            client.BaseAddress = new Uri("https://jsonplaceholder.typicode.com/");

            // Send a GET request
            HttpResponseMessage response = await client.GetAsync("posts/1");
            
            // Ensure we throw if the request failed
            response.EnsureSuccessStatusCode();
            
            // Read and process the response
            string content = await response.Content.ReadAsStringAsync();
            Console.WriteLine(content);
        } // Client is disposed here
    }
}
```

**Instantiate HttpClient (preferably once and reuse as needed — see below).**

Optionally, set a BaseAddress so you can make relative requests.

Use methods like GetAsync, PostAsync, PutAsync, DeleteAsync, or even SendAsync for custom requests.

Handle the response (status codes, headers, content).

Dispose of the client when done (via using or explicitly calling Dispose).

**Setting Default Headers**
```typescript
HttpClient client = new HttpClient();
client.DefaultRequestHeaders.Add("User-Agent", "MyCustomClient");
client.DefaultRequestHeaders.Accept
    .Add(new System.Net.Http.Headers.MediaTypeWithQualityHeaderValue("application/json"));
DefaultRequestHeaders are applied to every request sent by this client instance.
```

**2. Best Practices
Use a Single, Long-Lived HttpClient**
Why?

HttpClient manages its own connection pool under the hood. Frequently disposing and creating new HttpClient instances can lead to socket exhaustion and other performance issues.

**Typical Approach:**

Create a single, static HttpClient (e.g., in a HttpClientFactory or as a singleton in ASP.NET Core services).

**Reuse this instance throughout your application.
**
```typescript
public static class HttpClientSingleton
{
    private static readonly HttpClient _client = new HttpClient();

    public static HttpClient Client => _client;
}

// Usage
var client = HttpClientSingleton.Client;
var response = await client.GetAsync("https://example.com/api/data");
```

**IHttpClientFactory (ASP.NET Core)**
**In ASP.NET Core, the recommended approach is to use IHttpClientFactory:**

Add it in Program.cs or Startup.cs:

```typescript
builder.Services.AddHttpClient();```
**Inject or retrieve the factory:**

```typescript
public class MyService
{
    private readonly HttpClient _client;

    public MyService(IHttpClientFactory httpClientFactory)
    {
        _client = httpClientFactory.CreateClient();
    }
    // ...
}
```
**Why use IHttpClientFactory?**

Better lifetime management, logging, and resiliency policies (e.g., Polly for retries, circuit breakers).

**Avoid Blocking Calls**
Always use async methods (GetAsync, PostAsync, etc.) to avoid blocking threads, especially in UI or server scenarios.

**3. Handling Timeouts and Cancellation
Timeouts**
HttpClient.Timeout is a per-request timespan that limits how long to wait for a response before throwing a TaskCanceledException.

```typescript
HttpClient client = new HttpClient
{
    Timeout = TimeSpan.FromSeconds(30)  // Default is 100 seconds
};
```
Some requests (like streaming large files) might need longer timeouts or no timeout at all (Timeout.InfiniteTimeSpan), but be cautious with disabling timeouts entirely.

**Cancellation Tokens**
Cancellation tokens allow you to cancel an ongoing request from outside the method (e.g., user action, system event, etc.).

```typescript
public async Task<string> FetchDataAsync(HttpClient client, CancellationToken cancellationToken)
{
    var response = await client.GetAsync("https://example.com/data", cancellationToken);
    response.EnsureSuccessStatusCode();
    return await response.Content.ReadAsStringAsync(cancellationToken);
}

// Usage
var cts = new CancellationTokenSource();
string data = await FetchDataAsync(client, cts.Token);
```
If the operation takes too long or you need to stop (e.g., user clicked “Cancel”), call cts.Cancel() to throw a TaskCanceledException or OperationCanceledException.