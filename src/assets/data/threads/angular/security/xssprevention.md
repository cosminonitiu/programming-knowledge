## Angular Security: XSS Prevention

Cross-Site Scripting (XSS) is the most common web vulnerability. Angular has strong built-in defences, but they can be bypassed if used incorrectly.

---

## 1. Angular's Automatic Sanitization

Angular **automatically sanitizes** all values bound to the DOM. It treats every value as untrusted by default.

```html
<!-- Angular escapes this — safe, no XSS -->
<p>{{ userInput }}</p>
<p [textContent]="userInput"></p>

<!-- Angular sanitizes HTML — strips dangerous tags/attrs -->
<div [innerHTML]="userGeneratedHtml"></div>
```

Sanitization contexts:
| Context | What Angular sanitizes |
|---|---|
| HTML (`[innerHTML]`) | Strips script tags, event handlers, dangerous attributes |
| Style (`[style]`) | Removes CSS expressions |
| URL (`[href]`, `[src]`) | Blocks `javascript:` and `data:` URLs |
| Resource URL (`[src]` on scripts) | Only allows trusted URLs |

---

## 2. `DomSanitizer` — Bypassing Sanitization (Use with Extreme Care)

Sometimes you need to render HTML from a trusted source (e.g., a rich-text editor you control). Use `DomSanitizer` to mark values as trusted **only when you are certain the source is safe**.

```typescript
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({ /* ... */ })
export class RichTextComponent {
  safeContent: SafeHtml;

  constructor(private sanitizer: DomSanitizer) {
    // ONLY use this for content you fully control/sanitize server-side
    this.safeContent = this.sanitizer.bypassSecurityTrustHtml(trustedHtmlFromServer);
  }
}
```

```html
<div [innerHTML]="safeContent"></div>
```

### `bypassSecurityTrust*` methods — never use with user input

| Method | Context |
|---|---|
| `bypassSecurityTrustHtml` | HTML content |
| `bypassSecurityTrustStyle` | CSS |
| `bypassSecurityTrustUrl` | URLs (`href`, `src`) |
| `bypassSecurityTrustResourceUrl` | Script/iframe `src` |
| `bypassSecurityTrustScript` | JavaScript |

**Rule:** If the content comes from a user or external API, sanitize it server-side before calling any `bypassSecurityTrust*` method. Never pass raw user input.

---

## 3. Template Injection (Server-Side Rendering Risk)

With SSR (Angular Universal), never render user-controlled data directly into Angular templates on the server:

```typescript
// DANGEROUS — server-side template injection
const html = `<app-root>${userControlledData}</app-root>`;

// SAFE — pass data via TransferState, not template content
transferState.set(DATA_KEY, sanitizedData);
```

---

## 4. `innerHTML` vs `textContent` — Know the Difference

```html
<!-- Always use textContent for plain text — no sanitization risk -->
<span [textContent]="userComment"></span>

<!-- Use innerHTML only when you need to render HTML structure -->
<div [innerHTML]="articleBody"></div>
<!-- Angular sanitizes [innerHTML] automatically, but bypassSecurityTrustHtml skips it -->
```

---

## 5. Avoiding `ElementRef` and Direct DOM Manipulation

Accessing the DOM directly bypasses Angular's sanitization:

```typescript
// RISKY — bypasses Angular sanitization
constructor(private el: ElementRef) {}
ngOnInit() {
  this.el.nativeElement.innerHTML = this.userInput; // XSS if userInput is malicious
}

// SAFE — use Angular bindings instead
// In template: <div [innerHTML]="userInput"></div>
```

If you must use `ElementRef`, use `Renderer2` instead of direct DOM access:

```typescript
constructor(private renderer: Renderer2, private el: ElementRef) {}

ngOnInit() {
  // Renderer2 is safer — doesn't bypass security checks for text
  this.renderer.setProperty(this.el.nativeElement, 'textContent', this.userInput);
}
```

---

## 6. Content Security Policy (CSP) with Angular

Angular apps work best with a strict CSP. Add these headers server-side:

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: https:;
  font-src 'self';
  connect-src 'self' https://api.yourdomain.com;
  frame-ancestors 'none';
```

**Note:** Angular's built-in styles require `'unsafe-inline'` for styles unless you use nonce-based CSP or extract styles to external files.

---

## Architect Interview Notes

- Angular's sanitization is your first line of defence, but **never rely on it alone** for security — validate and sanitize on the server too.
- The biggest XSS risk in Angular is **misuse of `bypassSecurityTrust*`** — it should appear almost never in a codebase and always be code-reviewed carefully.
- For SSR apps, be extra careful about server-side template injection — user data in page titles, meta tags, and JSON-LD payloads must be escaped.
- Set `X-Frame-Options: DENY` and `X-Content-Type-Options: nosniff` headers alongside CSP for defence in depth.
