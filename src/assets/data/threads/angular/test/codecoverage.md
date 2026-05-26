## Code Coverage in Angular

Code coverage measures how much of your source code is exercised by your tests. Angular CLI integrates **Istanbul** (via Karma) to generate coverage reports with a single flag.

---

## 1. Enabling Coverage

```bash
ng test --code-coverage
```

A `coverage/` folder is created in the project root after the run. Open `coverage/<project-name>/index.html` in a browser to view the visual report.

---

## 2. Coverage Metrics

| Metric | Meaning |
|--------|---------|
| **Statements** | Every executable statement hit at least once |
| **Branches** | Both sides of every `if`, `?:`, `&&`, `\|\|` evaluated |
| **Functions** | Every declared function/method called at least once |
| **Lines** | Every source line executed at least once |

Branches are the hardest to reach 100% on and the most valuable to cover.

---

## 3. Setting Enforcement Thresholds

In `karma.conf.js` (or `angular.json` under `coverageReporter`), you can fail the build when coverage drops below a threshold:

```javascript
// karma.conf.js
coverageReporter: {
  dir: require('path').join(__dirname, './coverage/my-app'),
  subdir: '.',
  reporters: [{ type: 'html' }, { type: 'text-summary' }],
  check: {
    global: {
      statements: 80,
      branches: 70,
      functions: 80,
      lines: 80,
    },
  },
},
```

With the Angular CLI you can also set thresholds via `angular.json`:

```json
"test": {
  "builder": "@angular-devkit/build-angular:karma",
  "options": {
    "codeCoverage": true,
    "codeCoverageExclude": ["src/environments/**"],
    ...
  }
}
```

---

## 4. Excluding Files from Coverage

Add a glob array to `codeCoverageExclude` in `angular.json`:

```json
"codeCoverageExclude": [
  "src/environments/**",
  "src/app/**/*.module.ts",
  "src/app/app.config.ts"
]
```

You can also use Istanbul inline hints inside source files:

```typescript
/* istanbul ignore next */
function legacyFallback() { ... }

/* istanbul ignore if */
if (environment.production) { ... }
```

---

## 5. Interpreting the Report

- **Green** — line/branch covered.
- **Yellow** — branch partially covered (one side not taken).
- **Red** — line or branch never executed.

Click any file in the HTML report to see line-by-line annotations.

---

## 6. Coverage vs. Quality

- 100% coverage does **not** mean the code is bug-free.
- Focus on testing **behaviours and edge cases**, not just line counts.
- Prioritise branch coverage for conditional logic.
- Avoid writing trivial tests only to boost a metric.

---

## 7. Typical Coverage Targets

| Layer | Recommended minimum |
|-------|-------------------|
| Services (business logic) | 90%+ |
| Pure pipes | 100% |
| Components (template interaction) | 75–85% |
| Guards / Resolvers | 80%+ |
| Utility functions | 100% |