## 1. HTTP Methods

### What are HTTP Methods?
HTTP methods (also called **verbs**) specify the desired action to be performed on a resource (e.g., a web page, an API endpoint). Below are some common methods:

1. **GET**  
   - **Purpose**: Retrieve data or resources.  
   - **Idempotent**: Repeated requests do not change state.  
   - **Caching**: Often cacheable.

2. **POST**  
   - **Purpose**: Submit data to create a new resource or trigger server-side processing.  
   - **Not Idempotent**: Multiple requests can create duplicate resources or perform repeated actions.

3. **PUT**  
   - **Purpose**: Update or replace an existing resource entirely (or create it if it doesn’t exist).  
   - **Idempotent**: A second PUT with the same data yields no additional changes.

4. **PATCH**  
   - **Purpose**: Partially update an existing resource (change only certain fields).  
   - **Not Always Idempotent**: Depends on the patch instructions.

5. **DELETE**  
   - **Purpose**: Remove a resource.  
   - **Idempotent**: Deleting an already deleted resource typically has no further effect.

6. **HEAD**  
   - **Purpose**: Same as GET, but **no response body** is returned—only headers.  
   - Useful for checking resource existence or last-modified timestamps.

7. **OPTIONS**  
   - **Purpose**: Describe the communication options for the target resource (which methods are supported, etc.).

### How to Use Methods in C# with `HttpClient`

```typescript
using System;
using System.Net.Http;
using System.Threading.Tasks;

public class HttpMethodsExample
{
    private static readonly HttpClient _client = new HttpClient();

    public static async Task RunAsync()
    {
        // GET example
        var response = await _client.GetAsync("https://example.com/api/resource");
        var content = await response.Content.ReadAsStringAsync();
        
        // POST example
        var postContent = new StringContent("{\"name\":\"New Item\"}", System.Text.Encoding.UTF8, "application/json");
        var postResponse = await _client.PostAsync("https://example.com/api/resource", postContent);

        // PUT example
        var putContent = new StringContent("{\"name\":\"Updated Item\"}", System.Text.Encoding.UTF8, "application/json");
        var putResponse = await _client.PutAsync("https://example.com/api/resource/123", putContent);

        // Delete example
        var deleteResponse = await _client.DeleteAsync("https://example.com/api/resource/123");
    }
}
```

**2. Status Codes and Reason Phrases**
HTTP status codes inform the client about the outcome of a request. Each code belongs to a category (1xx, 2xx, 3xx, 4xx, or 5xx).

Common Categories
1xx Informational

Indicates a provisional response (e.g., 100 Continue).

2xx Success

Request succeeded; e.g., 200 OK, 201 Created.

3xx Redirection

Further actions need to be taken to complete the request; e.g., 301 Moved Permanently, 302 Found.

4xx Client Error

The request contains bad syntax or cannot be fulfilled; e.g., 400 Bad Request, 404 Not Found.

5xx Server Error

The server failed to fulfill a valid request; e.g., 500 Internal Server Error, 503 Service Unavailable.

Example Reason Phrases
200 OK

The request has succeeded.

201 Created

A new resource has been successfully created.

400 Bad Request

The server cannot process the request due to client error (e.g., malformed JSON).

401 Unauthorized

Authentication is required or has failed.

403 Forbidden

The user is authenticated but does not have permission.

404 Not Found

The requested resource doesn’t exist.

500 Internal Server Error

A generic error occurred on the server.

**Handling Status Codes in C#**
```typescript
var response = await _client.GetAsync("https://example.com/api/resource");
if (response.IsSuccessStatusCode) 
{
    // 2xx codes
    var data = await response.Content.ReadAsStringAsync();
    Console.WriteLine("Success! Data: " + data);
}
else
{
    switch ((int)response.StatusCode)
    {
        case 400:
            Console.WriteLine("Bad Request");
            break;
        case 404:
            Console.WriteLine("Resource not found");
            break;
        case 500:
            Console.WriteLine("Server error");
            break;
        default:
            Console.WriteLine("Unhandled status code: " + response.StatusCode);
            break;
    }
}
```

**3. Headers and Their Significance**
Headers provide metadata about the request or response, guiding how the server or client should handle the message.

Common Request Headers
Host

The domain name of the server (used for virtual hosting).

User-Agent

Identifies the client application (e.g., browser, custom HTTP client).

Accept / Accept-*

Informs the server of the media types the client can handle. Example: Accept: application/json.

Authorization

Carries credentials (e.g., Bearer <token>, Basic <base64>).

Content-Type

Describes the media type of the request body (e.g., application/json, text/html).

Common Response Headers
Content-Type

Media type of the response body (e.g., application/json).

Content-Length

Size of the response body in bytes.

Cache-Control

How the client or intermediate proxies should cache the response.

Server

Identifies the server software (e.g., Server: Kestrel or Server: Apache).

Set-Cookie

Sets cookies in the client’s browser or client store.

```Adding Custom Headers in C#
csharp
using System.Net.Http.Headers;

_client.DefaultRequestHeaders.Add("User-Agent", "MyCustomClient/1.0");
_client.DefaultRequestHeaders.Authorization 
    = new AuthenticationHeaderValue("Bearer", "my-jwt-token");
_client.DefaultRequestHeaders.Accept
    .Add(new MediaTypeWithQualityHeaderValue("application/json"));
```