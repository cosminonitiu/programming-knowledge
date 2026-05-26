## Angular CLI Build Configuration & Production Optimizations

Understanding `ng build` options, production configuration, and build optimizations is essential for deploying performant Angular applications.

---

## 1. Build Configurations

```json
// angular.json
"configurations": {
  "production": {
    "budgets": [
      { "type": "initial", "maximumWarning": "500kb", "maximumError": "1mb" },
      { "type": "anyComponentStyle", "maximumWarning": "4kb" }
    ],
    "outputHashing": "all",          // cache-busting hash on filenames
    "optimization": true,            // minification, dead code elimination
    "sourceMap": false,              // no source maps in prod
    "namedChunks": false,
    "extractLicenses": true,
    "vendorChunk": false
  },
  "staging": {
    "extends": "production",
    "sourceMap": true,               // keep source maps for debugging staging
    "fileReplacements": [
      { "replace": "src/environments/environment.ts", "with": "src/environments/environment.staging.ts" }
    ]
  },
  "development": {
    "optimization": false,
    "sourceMap": true,
    "namedChunks": true
  }
}
```

```bash
ng build                            # uses development config
ng build --configuration=production
ng build --configuration=staging
ng build -c production              # shorthand
```

---

## 2. What `optimization: true` Does

- **Minification**: removes whitespace, shortens variable names
- **Tree-shaking**: removes unused code (esbuild does this by default)
- **Dead code elimination**: removes unreachable code paths
- **Template inlining**: inlines component templates and styles
- **WASM optimization**: optimizes WebAssembly modules

Can be configured granularly:
```json
"optimization": {
  "scripts": true,
  "styles": { "minify": true, "inlineCritical": true },
  "fonts": { "inline": true }
}
```

---

## 3. Output Hashing

```json
"outputHashing": "all"    // hash on all files (scripts, styles, assets)
"outputHashing": "none"   // no hashing (avoid for production)
"outputHashing": "media"  // only media files (images)
"outputHashing": "bundles" // only JS/CSS bundles
```

Hashing enables long-lived cache headers (`Cache-Control: max-age=31536000, immutable`) — files change names when content changes, so browsers always get fresh versions.

---

## 4. Bundle Analysis

```bash
# Install bundle analyzer
npm install --save-dev webpack-bundle-analyzer

# Build with stats
ng build --stats-json

# Analyze
npx webpack-bundle-analyzer dist/my-app/browser/stats.json
```

For esbuild-based builds:
```bash
ng build --configuration=production
# Check dist/ sizes directly — esbuild reports sizes in build output
```

---

## 5. Source Map Strategies

| Environment | Recommendation |
|---|---|
| Development | `"sourceMap": true` |
| Staging | `"sourceMap": { "scripts": true, "styles": false }` |
| Production | `"sourceMap": false` or use hidden source maps uploaded to Sentry |

**Hidden source maps** (not served publicly but used by error tracking):
```json
"sourceMap": { "scripts": true, "hidden": true }
```

---

## 6. Differential Loading & Modern Output

Angular targets ES2022+ by default. Ensure `tsconfig.json` targets match:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ES2022",
    "lib": ["ES2022", "dom"]
  }
}
```

---

## 7. Asset Configuration

```json
"assets": [
  "src/favicon.ico",
  "src/assets",
  {
    "glob": "**/*",
    "input": "node_modules/some-lib/assets",
    "output": "/lib-assets"
  }
]
```

---

## 8. `ng build` vs `ng build --watch`

```bash
ng build --watch    # rebuild on file changes (no dev server)
ng serve            # dev server with HMR (Vite-based in Angular 17+)
```

---

## Architect Notes

- **Always set build budgets** — they fail CI when a developer accidentally imports a heavy library
- **`outputHashing: "all"` + long cache headers** is the right production caching strategy — index.html should have `no-cache`, all hashed assets should have long expiry
- Analyze your bundle at least once per major release — lazy chunks that should be lazy sometimes get accidentally imported in the main bundle
- For SSR apps, check both the browser and server bundle sizes — server bundles can be very large if you accidentally import browser-only libraries
