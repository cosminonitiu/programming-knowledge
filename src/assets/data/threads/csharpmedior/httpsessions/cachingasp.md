Caching helps reduce data retrieval costs, speed up response times, and improve scalability in your applications. ASP.NET Core offers built-in support for two primary caching models:

1. **`IMemoryCache`** – An in-memory, process-local cache.  
2. **`IDistributedCache`** – A distributed cache interface for shared caches like Redis or SQL Server.

---

## 1. `IMemoryCache` Usage and Patterns

### 1.1 What Is `IMemoryCache`?
- An **in-memory cache** that stores objects within your application’s **process**.
- Best suited for **single-server** scenarios or where you can tolerate data loss on app restart.

### 1.2 Adding and Configuring
1. **Add the service** in `Program.cs` (or `Startup.cs` in older templates):

```typescript
   var builder = WebApplication.CreateBuilder(args);
   builder.Services.AddMemoryCache(); // Registers IMemoryCache

   var app = builder.Build();
   // ...
   app.Run();
```

**Inject IMemoryCache into services or controllers:**

```typescript
public class WeatherService
{
    private readonly IMemoryCache _cache;

    public WeatherService(IMemoryCache cache)
    {
        _cache = cache;
    }

    public async Task<string> GetWeatherAsync()
    {
        // Attempt to retrieve from cache
        if (!_cache.TryGetValue("weatherData", out string weatherData))
        {
            // If not in cache, fetch fresh data
            weatherData = await FetchWeatherFromApiAsync();

            // Cache the data
            _cache.Set("weatherData", weatherData, new MemoryCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            });
        }

        return weatherData;
    }

    private Task<string> FetchWeatherFromApiAsync() => Task.FromResult("Sunny");
}
```

**1.3 Common Patterns
Get or Create**

GetOrCreateAsync(key, factory): If the item doesn’t exist, create and store it using the provided delegate.

```typescript
var result = await _cache.GetOrCreateAsync("key", entry =>
{
    entry.AbsoluteExpirationRelativeToNow = TimeSpan.FromMinutes(10);
    return Task.FromResult("GeneratedValue");
});
```

**Entry Options**

Sliding Expiration: Resets the timer each time the item is accessed.

Absolute Expiration: Removes the item after a fixed time.

Priority: Determines which items are evicted first if the system needs memory (CacheItemPriority).

**Eviction**

By default, in-memory caching uses an LRU (Least Recently Used) mechanism when under memory pressure.

You can control eviction with the MemoryCacheEntryOptions (e.g., Priority, Size).

**1.4 When to Use IMemoryCache
Single-server or development setups.**

Data that is not critical or can be regenerated if lost (e.g., ephemeral results, partial calculations).

When you don’t need to share cached data across multiple instances of your application.

**2. IDistributedCache (Redis, SQL Server, etc.)
2.1 What Is IDistributedCache?**
An interface for a shared cache that multiple app instances can access.

The actual implementation could be Redis, SQL Server, NCache, or others.

Suitable for load-balanced or cloud environments where you have multiple servers handling requests.

**2.2 Adding and Configuring
Add the appropriate implementation:**

Redis (AddStackExchangeRedisCache or AddRedis)
SQL Server (AddDistributedSqlServerCache)
Third-party providers

Example: Redis

```typescript
var builder = WebApplication.CreateBuilder(args);

// Register a distributed Redis cache
builder.Services.AddStackExchangeRedisCache(options =>
{
    options.Configuration = "localhost:6379";
    options.InstanceName = "MyApp_";
});

var app = builder.Build();
// ...
app.Run();
```
**Inject IDistributedCache just like IMemoryCache:
**
```typescript
public class WeatherService
{
    private readonly IDistributedCache _distributedCache;

    public WeatherService(IDistributedCache distributedCache)
    {
        _distributedCache = distributedCache;
    }

    public async Task<string> GetWeatherAsync()
    {
        var cachedData = await _distributedCache.GetStringAsync("weatherData");
        if (string.IsNullOrEmpty(cachedData))
        {
            // Not in cache, fetch from API
            cachedData = await FetchWeatherFromApiAsync();

            // Store in distributed cache
            // Optionally with expiration
            var options = new DistributedCacheEntryOptions
            {
                SlidingExpiration = TimeSpan.FromMinutes(5)
            };

            await _distributedCache.SetStringAsync("weatherData", cachedData, options);
        }

        return cachedData;
    }

    private Task<string> FetchWeatherFromApiAsync() => Task.FromResult("Cloudy");
}
```

**2.3 Data Serialization**
SetString and GetString are convenient for simple text data.

For complex objects, you might:

Serialize to JSON or binary before storing.

Deserialize on retrieval.

**2.4 When to Use IDistributedCache**
Multiple servers (e.g., behind a load balancer).

Scalability: Redis or SQL-based caching can handle larger amounts of data, persist across restarts, and scale horizontally.

Shared state: All app instances share the same cached data, ensuring consistency.