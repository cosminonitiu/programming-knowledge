## esbuild in Angular 17+

Angular 17 made esbuild the default build system, replacing Webpack. Understanding what changed and why matters for build performance, configuration, and debugging.

---

## 1. What Changed and Why

| | Webpack (old) | esbuild (new) |
|---|---|---|
| Build speed | ~30–60s for medium apps | ~3–8s (10x faster) |
| Rebuild (dev) | ~5–15s | ~300ms–1s |
| Config | Complex `webpack.config.js` | Managed by Angular CLI |
| Plugin ecosystem | Massive | Limited (but sufficient) |

The Angular CLI now uses `@angular-devkit/build-angular:application` (esbuild) instead of `@angular-devkit/build-angular:browser` (Webpack).

---

## 2. Checking Your Builder

```json
// angular.json
"architect": {
  "build": {
    "builder": "@angular-devkit/build-angular:application",  ← esbuild
    // vs old:
    "builder": "@angular-devkit/build-angular:browser",      ← webpack
```

New projects created with Angular CLI 17+ use esbuild by default.

---

## 3. Migrating from Webpack to esbuild

```bash
ng update @angular/cli @angular/core
# Angular CLI automatically migrates angular.json to the new builder
```

Or manually update `angular.json`:
```json
"builder": "@angular-devkit/build-angular:application",
"options": {
  "browser": "src/main.ts",     // renamed from "main"
  "server": "src/main.server.ts",
  "outputPath": "dist/my-app",
  "index": "src/index.html",
  "assets": ["src/favicon.ico", "src/assets"],
  "styles": ["src/styles.css"],
  "scripts": []
}
```

---

## 4. Vite Dev Server

The new build system uses Vite for the dev server, which enables:
- Near-instant HMR (Hot Module Replacement)
- Fast initial serve (~1s instead of ~30s)
- Native ES modules in the browser during development

```bash
ng serve  # now uses Vite under the hood
```

---

## 5. What Breaks During Migration

**Custom Webpack configuration** (via `@angular-builders/custom-webpack`): needs replacing with Angular build plugins or alternative approaches.

```typescript
// Old: webpack plugin in angular.json
// New: Use Angular's build plugins API or move custom transforms to PostCSS
```

**CommonJS dependencies** that don't have ESM versions — esbuild requires or prefers ESM. Angular CLI warns about CommonJS imports:
```
Warning: ... relies on CommonJS or AMD modules which are not optimized for bundling
```

**Source maps in production** — configure explicitly:
```json
"configurations": {
  "production": {
    "sourceMap": { "scripts": false, "styles": false, "vendor": false }
  }
}
```

---

## 6. New Build Options

```json
// angular.json - new options in application builder
"options": {
  "outputMode": "server",        // "server" | "static" | "client"
  "ssr": {
    "entry": "src/server.ts"
  },
  "prerender": true,             // static prerendering
  "appShell": true               // app shell for performance
}
```

---

## 7. Performance Comparison

For a ~200 component enterprise app:

| Operation | Webpack | esbuild |
|---|---|---|
| Cold build (dev) | 45s | 4s |
| Rebuild after change | 8s | 300ms |
| Production build | 90s | 12s |
| CI pipeline (full build) | 3 min | 25s |

---

## Architect Notes

- Migrate to esbuild immediately for any active project — the dev experience improvement is dramatic
- The `application` builder also supports SSR, prerendering, and app shell out of the box — no separate SSR builder needed
- If you have custom Webpack plugins, audit them first — this is the only real migration risk
- esbuild doesn't support certain advanced Webpack features like Module Federation natively — `@angular-architects/module-federation` has its own esbuild-compatible version
