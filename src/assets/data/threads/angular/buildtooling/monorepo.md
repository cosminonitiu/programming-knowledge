## Monorepo Strategies: Nx vs Angular Workspace

A monorepo stores multiple applications and libraries in a single repository. Understanding the tradeoffs between Angular CLI workspaces and Nx is an architect-level decision.

---

## 1. When to Consider a Monorepo

- Multiple related apps that share UI components, utilities, or domain models
- Teams deploying separately but developing together
- You want atomic commits across app + library changes
- Micro-frontend host + remote apps developed together

---

## 2. Angular CLI Multi-Project Workspace

**Best for:** 2–4 apps, simple structure, small teams.

```
angular-workspace/
├── projects/
│   ├── main-app/
│   ├── admin-app/
│   └── shared-ui/        ← library
├── angular.json
└── package.json
```

**Limitations:**
- No build caching (rebuilds everything every time)
- No dependency graph visualization
- No lint boundary enforcement between projects
- No affected computation (can't easily run only tests affected by a change)
- Scales poorly past ~5 projects

---

## 3. Nx Monorepo

**Best for:** 5+ apps, multiple teams, micro-frontends, enterprise scale.

```bash
npx create-nx-workspace@latest my-company --preset=angular
# or add Nx to existing Angular workspace:
ng add @nx/angular
```

```
nx-workspace/
├── apps/
│   ├── customer-portal/
│   ├── admin-panel/
│   └── mobile-web/
├── libs/
│   ├── ui/                     ← shared UI components
│   │   ├── button/
│   │   └── modal/
│   ├── data-access/
│   │   ├── surveys/            ← survey API + state
│   │   └── auth/               ← auth API + state
│   ├── util/
│   │   └── formatters/         ← pure utility functions
│   └── feature/
│       ├── survey-builder/     ← lazy-loaded feature modules
│       └── dashboard/
├── nx.json
└── package.json
```

---

## 4. Nx Key Features

### Computation Caching
```bash
nx build customer-portal   # first run: builds
nx build customer-portal   # second run: restored from cache (instant)
```
Results are cached locally (and optionally in Nx Cloud for CI sharing).

### Affected Computation
```bash
# Only rebuild/retest what was affected by your change
nx affected --target=build
nx affected --target=test
```

### Dependency Graph
```bash
nx graph   # opens visual dependency graph in browser
```

### Module Boundary Enforcement
```json
// .eslintrc.json — enforce architecture boundaries
{
  "rules": {
    "@nx/enforce-module-boundaries": ["error", {
      "depConstraints": [
        { "sourceTag": "type:app",     "onlyDependOnLibsWithTags": ["type:feature", "type:ui", "type:util"] },
        { "sourceTag": "type:feature", "onlyDependOnLibsWithTags": ["type:data-access", "type:ui", "type:util"] },
        { "sourceTag": "type:ui",      "onlyDependOnLibsWithTags": ["type:util"] },
        { "sourceTag": "type:util",    "onlyDependOnLibsWithTags": [] }
      ]
    }]
  }
}
```
This prevents `ui` libraries from importing `data-access` — enforced by linting.

---

## 5. Library Tagging Strategy

```json
// project.json for a library
{
  "tags": ["type:data-access", "scope:surveys"]
}
```

Nx tags give you two dimensions of control:
- `type:` — architectural layer (app, feature, data-access, ui, util)
- `scope:` — business domain (surveys, auth, dashboard)

---

## 6. Decision Matrix

| Need | Angular CLI Workspace | Nx |
|---|---|---|
| < 4 apps | ✅ Sufficient | Over-engineered |
| Build caching | ❌ No | ✅ Yes |
| Affected tests in CI | ❌ No | ✅ Yes |
| Module boundary lint | ❌ No | ✅ Yes |
| Dependency graph | ❌ No | ✅ Yes |
| Micro-frontends | Limited | ✅ First-class |
| Learning curve | Low | Medium |

---

## Architect Notes

- Don't start with Nx unless you have real scale needs — it adds tooling complexity
- Nx pays off immediately in CI: `nx affected --target=test` can reduce CI time from 20 minutes to 2 minutes on large repos
- The **4 library types** (feature, data-access, ui, util) with Nx's boundary rules are the most important architectural pattern for large Angular apps
- Nx Cloud (paid) shares cache across developers and CI — very useful for teams with large workspaces
