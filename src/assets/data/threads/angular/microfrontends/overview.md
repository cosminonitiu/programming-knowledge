## Micro-Frontends: Concepts & Interview Overview

---

## 1. What Are Micro-Frontends?

Micro-frontends extend the microservices pattern to the UI layer. Instead of one monolithic Angular app, independent teams own separate frontend slices that are composed into a single user experience at runtime.

**Core principles:**
- Each micro-frontend is a self-contained, independently deployable application
- Each has its own CI/CD pipeline and release schedule
- A **shell** (host) application handles top-level routing and assembles the micro-frontends
- Teams can work in parallel without merge conflicts or coupled deployments

---

## 2. When to Use Micro-Frontends

| Good Fit | Poor Fit |
|---|---|
| Multiple teams working in parallel | Single team, one product |
| Independent deployment schedules | Tightly coupled features |
| Different tech stacks per team | Simple CRUD app / MVP |
| Enterprise platforms (Survey Platform, AI Reviewer) | Low team count |

**CV hook:** *"The AI Reviewer project and the Survey Management Platform were both enterprise-grade, multi-team systems. Micro-frontends would allow the 'pipeline analysis' team and the 'survey creation' team to deploy independently — the same philosophy I applied with Clean Architecture and feature modules at Aumovio: ship features without coupling."*

---

## 3. Deployment Models

### Build-time integration (avoid)
Remote code is packaged into the shell's bundle at build time. Defeats the purpose — teams are still coupled by deployment.

### Run-time integration (preferred)
The shell fetches remote bundles at runtime via a URL. Teams deploy independently; the shell picks up the latest version automatically.

```
User → Shell (loads at startup)
         ├── /surveys  → fetches surveys-mfe/remoteEntry.js at runtime
         ├── /reports  → fetches reports-mfe/remoteEntry.js at runtime
         └── /admin    → fetches admin-mfe/remoteEntry.js at runtime
```

---

## 4. Key Architectural Decisions

### Shell responsibilities
- Top-level routing
- Authentication and session management
- Shared layout (header, sidebar, footer)
- Loading and error boundaries for remotes

### Remote responsibilities
- Feature-specific routes
- Feature state (`StoreModule.forFeature`)
- Independent build and deployment
- Expose one or more Angular modules via Module Federation

### Communication between micro-frontends
| Method | Best For |
|---|---|
| Shared singleton service (via Module Federation) | Same-framework, same NgRx store |
| `BroadcastChannel` API | Cross-MFE, cross-framework |
| URL / query params | Shallow navigation state |
| Custom DOM events | Loosely coupled event passing |

---

## 5. Interview Talking Points

**Q: How does routing work across micro-frontends?**
> The shell owns the top-level Angular Router. Remote modules are lazy-loaded using `loadRemoteModule` from `@angular-architects/module-federation` — the shell does not need to know about remotes at build time, only at routing time.

**Q: How do you avoid shipping Angular twice?**
> Module Federation's `singleton: true` + `strictVersion: true` ensures only one copy of `@angular/core` loads across all remotes. All apps must use compatible versions declared with `requiredVersion: 'auto'`.

**Q: How do you share auth state across remotes?**
> If all remotes are Angular: share `@ngrx/store` as a singleton so remotes select from the shared auth slice. If remotes are mixed frameworks: use `BroadcastChannel` or rely on a backend session cookie.

**Q: What's the failure model if a remote is down?**
> The shell wraps each remote route in an error boundary (Angular `ErrorHandler` + `loadRemoteModule` error catch). A failed remote shows a fallback UI without taking down the entire shell.
