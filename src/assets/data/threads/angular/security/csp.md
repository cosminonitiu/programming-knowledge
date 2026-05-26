## Content Security Policy (CSP) for Angular Apps

CSP is an HTTP security header that tells the browser which sources are trusted for scripts, styles, and other resources — the last line of defense against XSS.

---

## 1. What CSP Does

Without CSP, if an attacker injects `<script>alert('xss')</script>` into your page, the browser executes it.

With CSP:
```
Content-Security-Policy: default-src 'self'; script-src 'self'
```
The browser refuses to load any script not from your own origin — injected scripts are blocked.

---

## 2. The Angular/CSP Challenge

Angular's template compiler generates `style` tags at runtime for component styles. This creates a tension with strict CSP rules that block `unsafe-inline`:

```
# Strict CSP that blocks Angular component styles:
Content-Security-Policy: style-src 'self'  ← breaks Angular
```

**Solutions:**

### Option A: Use a nonce (recommended)

```typescript
// Server sets a random nonce per request:
// Content-Security-Policy: style-src 'self' 'nonce-{RANDOM_VALUE}'

// Angular reads it via the CSP_NONCE token:
bootstrapApplication(AppComponent, {
  providers: [
    { provide: CSP_NONCE, useValue: (window as any).__CSP_NONCE__ }
  ]
});
```

```html
<!-- Server renders this into index.html per request -->
<meta name="csp-nonce" content="abc123" />
<script>window.__CSP_NONCE__ = 'abc123';</script>
```

### Option B: Hash-based CSP (build-time)

Angular CLI can generate a hash of inline styles at build time:
```bash
ng build --inline-style-language css
```
Then add the hashes to your CSP header — only practical for static deployments.

### Option C: `unsafe-inline` with strict `script-src` (acceptable compromise)

```
Content-Security-Policy: 
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.googleapis.com;
  connect-src 'self' https://api.yourdomain.com;
```

Allowing `unsafe-inline` for styles only is much lower risk than for scripts — CSS injection attacks are much harder to exploit.

---

## 3. Recommended CSP for Angular Apps

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self' 'nonce-{NONCE}';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self' https://fonts.gstatic.com;
  connect-src 'self' https://api.yourdomain.com wss://api.yourdomain.com;
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
```

---

## 4. Setting CSP Headers

### In Angular SSR (`server.ts`)

```typescript
// server.ts — add to Express middleware
app.use((req, res, next) => {
  const nonce = generateSecureNonce(); // crypto.randomBytes(16).toString('base64')
  res.setHeader('Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'nonce-${nonce}'; style-src 'self' 'unsafe-inline'; ` +
    `connect-src 'self' https://api.yourdomain.com; frame-ancestors 'none';`
  );
  res.locals.cspNonce = nonce;
  next();
});
```

### In nginx (static deployment)

```nginx
add_header Content-Security-Policy "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; connect-src 'self' https://api.yourdomain.com; frame-ancestors 'none';" always;
```

### Meta tag (fallback, limited)

```html
<meta http-equiv="Content-Security-Policy" content="default-src 'self'">
```
Note: Meta tag CSP doesn't cover `frame-ancestors`, `sandbox`, or `report-uri`.

---

## 5. Other Security Headers for Angular

```
X-Content-Type-Options: nosniff
X-Frame-Options: DENY                      (or use frame-ancestors in CSP)
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: geolocation=(), camera=(), microphone=()
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

---

## 6. Testing CSP

```typescript
// Use report-only mode first — logs violations without blocking
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /csp-report

// Angular has a built-in dev tool for finding violations:
// Open browser console — CSP violations appear as red errors
```

---

## Architect Notes

- **Start with `report-only` mode** — collect violations before enforcing. Enforcing immediately will break things.
- Angular's biggest CSP challenge is component styles. The nonce approach is cleanest for SSR apps.
- `frame-ancestors 'none'` prevents clickjacking — always set it.
- `object-src 'none'` blocks Flash/plugin injection — always set it (plugins are dead, but CSP still needs to say so).
- For SPAs deployed behind CDN, CSP headers in nginx/CloudFront are simpler than nonce approaches.
