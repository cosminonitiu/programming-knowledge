Sessions in ASP.NET Core allow you to store temporary user-specific data across multiple requests. However, this data doesn’t persist indefinitely. You can control how **long** a session remains active with **expiration** settings. You also have the option to **clear** or **abandon** sessions when they’re no longer needed.

---

## 1. Sliding vs. Absolute Expiration

### 1.1 Sliding Expiration

- **Definition**: The session expiration time resets **each time** the user makes a request.  
- **Behavior**: If the user is actively interacting with the application, their session remains alive. However, if no requests occur within the specified **IdleTimeout** window, the session expires.

```typescript
// Example in Program.cs (ASP.NET Core 6+)
builder.Services.AddSession(options =>
{
    // Session will expire after 20 minutes of inactivity.
    options.IdleTimeout = TimeSpan.FromMinutes(20);

    // By default, session uses "sliding" expiration in ASP.NET Core.
    // Each valid request refreshes the expiration time.
});
```

User logs in at 10:00 AM → Session starts, expires at ~10:20 AM if no further requests.
User makes a new request at 10:10 AM → Session expiration “slides” to 10:30 AM.
No more requests → Session expires at 10:30 AM.

**1.2 Absolute Expiration**
Definition: The session has a fixed lifetime, regardless of user activity. After that time, it always expires.

Use Cases: Highly secure applications where you want a hard cutoff on session lifetime, even if the user is active.

Configuration: ASP.NET Core’s built-in session handling focuses primarily on sliding expiration. For absolute expiration, you generally need to combine a sliding timeout with additional logic or custom middlewares to enforce a hard cutoff.

**Workaround Approach**
Use options.IdleTimeout for the sliding expiration window.

Track an absolute start time (e.g., store in session a “StartTime” or “IssuedAt”).

Check on each request if the total session age has exceeded your absolute limit. If so, terminate the session or force reauthentication.

**2. Clearing and Abandoning Sessions
2.1 Clearing Session Data**
HttpContext.Session.Clear() removes all keys and values from the session but does not remove the session cookie.

Use Case: If you want to reset the user’s data within the current session but don’t necessarily want to issue a brand-new session ID.

```typescript
public IActionResult LogOut()
{
    HttpContext.Session.Clear(); // Clear session data
    return RedirectToAction("Index", "Home");
}
```

**2.2 Abandoning Session (ASP.NET Core vs. ASP.NET)**
In classic ASP.NET (pre-Core), you had Session.Abandon() to fully end the session, which also triggered a new session ID on the next request.

In ASP.NET Core, there’s no direct Abandon method. Instead:

Clear the session to remove all data (Session.Clear()).

Remove the session cookie or invalidate it by overwriting it with an expired expiration date. This can be done in your logout or session handling logic if you want to effectively “abandon” the session.

**Example Cookie Removal**
```typescript
public IActionResult LogOut()
{
    // 1. Clear session data
    HttpContext.Session.Clear();

    // 2. Expire the session cookie (default name is .AspNetCore.Session)
    if (Request.Cookies.ContainsKey(".AspNetCore.Session"))
    {
        Response.Cookies.Delete(".AspNetCore.Session");
    }

    return RedirectToAction("Index", "Home");
}
```