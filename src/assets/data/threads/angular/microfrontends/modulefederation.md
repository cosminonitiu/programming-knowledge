## Module Federation with Angular

Webpack 5 Module Federation is the standard mechanism for Angular micro-frontends. The `@angular-architects/module-federation` package provides Angular CLI integration.

---

## 1. Setup

```bash
# Add to the shell (host) app
ng add @angular-architects/module-federation --project shell --type host

# Add to each remote app
ng add @angular-architects/module-federation --project surveys-mfe --type remote --port 4201
ng add @angular-architects/module-federation --project reports-mfe --type remote --port 4202
```

This generates a `webpack.config.js` in each project and updates `angular.json` to use the custom webpack builder.

---

## 2. Remote Configuration

```javascript
// surveys-mfe/webpack.config.js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  name: 'surveys',

  exposes: {
    // Key is the import path used by the shell
    './Module': './src/app/features/surveys/surveys.module.ts',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

```typescript
// surveys.module.ts — the exposed module has its own routes
const routes: Routes = [
  { path: '', component: SurveyListComponent },
  { path: ':id', component: SurveyDetailComponent },
];

@NgModule({
  imports: [
    RouterModule.forChild(routes),
    StoreModule.forFeature('surveys', surveyReducer),
    EffectsModule.forFeature([SurveyEffects]),
  ],
  declarations: [SurveyListComponent, SurveyDetailComponent],
})
export class SurveysModule {}
```

---

## 3. Shell (Host) Configuration

```javascript
// shell/webpack.config.js
const { shareAll, withModuleFederationPlugin } = require('@angular-architects/module-federation/webpack');

module.exports = withModuleFederationPlugin({
  remotes: {
    // Key maps to the remote's `name` field above
    surveys: 'http://localhost:4201/remoteEntry.js',
    reports: 'http://localhost:4202/remoteEntry.js',
  },

  shared: {
    ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }),
  },
});
```

---

## 4. Lazy Loading a Remote in the Shell Router

```typescript
// shell/app-routing.module.ts
import { loadRemoteModule } from '@angular-architects/module-federation';

const routes: Routes = [
  {
    path: 'surveys',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4201/remoteEntry.js',
        exposedModule: './Module',
      }).then(m => m.SurveysModule),
  },
  {
    path: 'reports',
    loadChildren: () =>
      loadRemoteModule({
        type: 'module',
        remoteEntry: 'http://localhost:4202/remoteEntry.js',
        exposedModule: './Module',
      }).then(m => m.ReportsModule),
  },
];
```

**Key point:** The shell has no compile-time dependency on the remote bundles. It only knows the URL and the exposed module name — everything else is resolved at runtime.

---

## 5. Externalising Remote URLs (Environment Config)

Hard-coding localhost URLs only works locally. In real deployments, URLs are environment-driven.

```typescript
// shell/src/environments/environment.prod.ts
export const environment = {
  production: true,
  remotes: {
    surveys: 'https://surveys-mfe.yourdomain.com/remoteEntry.js',
    reports: 'https://reports-mfe.yourdomain.com/remoteEntry.js',
  }
};
```

```typescript
// app-routing.module.ts — environment-driven
import { environment } from '../environments/environment';

loadChildren: () =>
  loadRemoteModule({
    type: 'module',
    remoteEntry: environment.remotes.surveys,
    exposedModule: './Module',
  }).then(m => m.SurveysModule)
```

---

## 6. Shared State Between Remotes

### Option A — Shared NgRx store (same Angular version)
When `@ngrx/store` is listed as `singleton: true` in webpack config, all remotes share one store instance.

```typescript
// Remote selects from a shared auth slice registered by the shell
export const selectIsAuthenticated = createSelector(
  selectAuthState,  // registered in shell via StoreModule.forRoot
  s => !!s.token
);
```

### Option B — BroadcastChannel (cross-framework safe)

```typescript
// Shell broadcasts after login
const channel = new BroadcastChannel('auth-events');
channel.postMessage({ type: 'LOGIN', user: { id: '1', roles: ['ADMIN'] } });

// Remote listens
const channel = new BroadcastChannel('auth-events');
channel.onmessage = ({ data }) => {
  if (data.type === 'LOGIN') {
    this.store.dispatch(AuthActions.setUser({ user: data.user }));
  }
};
```

---

## 7. Error Handling for Remote Load Failures

```typescript
// app-routing.module.ts
{
  path: 'surveys',
  loadChildren: () =>
    loadRemoteModule({ /* ... */ })
      .then(m => m.SurveysModule)
      .catch(() => import('./fallback/unavailable.module').then(m => m.UnavailableModule)),
}
```

A failed remote shows a graceful "this feature is currently unavailable" page rather than crashing the entire shell.

---

## 8. Nx Monorepo for Micro-Frontends

For teams using a monorepo, Nx extends Module Federation with first-class tooling.

```bash
# Generate shell + remotes in one command
npx create-nx-workspace myorg --preset=apps
nx generate @nx/angular:host shell --remotes=surveys,reports
```

**Benefits with Nx:**
- Shared `tsconfig`, lint config, and test setup
- `nx affected` runs CI only for changed remotes
- Nx Module Federation dev server can run shell + all remotes concurrently

---

## CV Interview Hook

*"In my enterprise work — the AI Reviewer and Survey Platform — we used modular, independently deployable architectures. Module Federation is the production standard for that pattern in Angular. I've implemented feature modules with `StoreModule.forFeature` and lazy loading, which is the exact mental model you carry into micro-frontends: each remote is a lazy-loaded feature that happens to live at a different URL."*
