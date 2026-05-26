## Angular Workspace Configuration & Multi-Project Setup

An Angular workspace can contain multiple applications and libraries — all sharing the same `node_modules`, `angular.json`, and tooling configuration.

---

## 1. Workspace Structure

```
my-workspace/
├── angular.json              ← all projects defined here
├── package.json
├── tsconfig.json             ← base TS config, extended per project
├── projects/
│   ├── admin-app/            ← application
│   │   ├── src/
│   │   └── tsconfig.app.json
│   ├── customer-app/         ← application
│   │   ├── src/
│   │   └── tsconfig.app.json
│   └── ui-library/           ← library (publishable)
│       ├── src/
│       └── ng-package.json
└── node_modules/             ← shared across all projects
```

---

## 2. Adding Projects

```bash
# Add a new application
ng generate application admin-app --routing --style=css

# Add a library
ng generate library ui-components --prefix=mylib
```

---

## 3. `angular.json` — Project Definitions

```json
{
  "projects": {
    "customer-app": {
      "projectType": "application",
      "root": "projects/customer-app",
      "sourceRoot": "projects/customer-app/src",
      "architect": {
        "build": {
          "builder": "@angular-devkit/build-angular:application",
          "options": { "browser": "projects/customer-app/src/main.ts" }
        },
        "serve": {
          "builder": "@angular-devkit/build-angular:dev-server",
          "options": { "buildTarget": "customer-app:build" }
        }
      }
    },
    "ui-library": {
      "projectType": "library",
      "root": "projects/ui-library",
      "architect": {
        "build": {
          "builder": "@angular-devkit/ng-packagr:build",
          "options": { "project": "projects/ui-library/ng-package.json" }
        }
      }
    }
  }
}
```

---

## 4. Running Specific Projects

```bash
ng build customer-app
ng serve admin-app --port 4201
ng test ui-library
ng lint admin-app
```

---

## 5. Library Development with `ng-packagr`

`ng-packagr` compiles a library into the Angular Package Format (APF) — the standard for publishable Angular libraries.

```json
// projects/ui-library/ng-package.json
{
  "$schema": "../../../node_modules/ng-packagr/ng-package.schema.json",
  "lib": {
    "entryFile": "src/public-api.ts"
  },
  "dest": "../../dist/ui-library"
}
```

```typescript
// src/public-api.ts — the library's public API
export * from './lib/button/button.component';
export * from './lib/modal/modal.component';
export * from './lib/shared.module';
```

```bash
ng build ui-library
# Outputs to dist/ui-library with:
# - FESM2022 bundle
# - ESM2022 bundle
# - UMD bundle (for legacy)
# - type declarations
# - package.json with exports map
```

---

## 6. Secondary Entry Points

For large libraries, split into secondary entry points so consumers can tree-shake:

```
ui-library/
├── src/
│   └── public-api.ts           ← primary entry point
├── testing/                    ← secondary entry point
│   ├── public-api.ts
│   └── ng-package.json
└── ng-package.json
```

```typescript
// Consumers import from specific entry points
import { ButtonComponent } from '@myorg/ui-library';
import { ButtonHarness } from '@myorg/ui-library/testing';
```

---

## 7. Path Aliases for Local Libraries

During development, use path aliases to import the library source directly (no need to build):

```json
// tsconfig.json
{
  "compilerOptions": {
    "paths": {
      "@myorg/ui-library": ["projects/ui-library/src/public-api.ts"],
      "@myorg/ui-library/*": ["projects/ui-library/src/*"]
    }
  }
}
```

---

## Architect Notes

- Multi-project workspaces are good for **2–5 related apps** sharing a library
- For 5+ apps or independent teams, prefer **Nx monorepo** — it adds build caching, dependency graph, and lint boundary enforcement
- Always define a `public-api.ts` barrel for libraries — never let consumers import from internal paths
- Secondary entry points keep bundle sizes small for consumers who only use part of the library
