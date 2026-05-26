## Environment Configuration Strategy

Managing environment-specific configuration in Angular — the right way for production apps.

---

## 1. Built-in `environment.ts` Files

Angular CLI generates environment files in `src/environments/`:

```typescript
// src/environments/environment.ts — development
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api',
  featureFlags: {
    enableAnalytics: false,
    enableBetaEditor: true,
  }
};

// src/environments/environment.prod.ts — production
export const environment = {
  production: true,
  apiUrl: 'https://api.yourdomain.com',
  featureFlags: {
    enableAnalytics: true,
    enableBetaEditor: false,
  }
};
```

```json
// angular.json — fileReplacements swap the file at build time
"configurations": {
  "production": {
    "fileReplacements": [
      { "replace": "src/environments/environment.ts", "with": "src/environments/environment.prod.ts" }
    ]
  },
  "staging": {
    "fileReplacements": [
      { "replace": "src/environments/environment.ts", "with": "src/environments/environment.staging.ts" }
    ]
  }
}
```

```bash
ng build --configuration=production
ng build --configuration=staging
ng serve --configuration=staging
```

---

## 2. `InjectionToken` for App Config — The Architecture Pattern

Importing `environment` directly couples your code to the build-time file. The architect pattern is to inject config via a token:

```typescript
// app-config.token.ts
export interface AppConfig {
  apiUrl: string;
  featureFlags: { enableAnalytics: boolean; enableBetaEditor: boolean; };
}

export const APP_CONFIG = new InjectionToken<AppConfig>('AppConfig');
```

```typescript
// app.config.ts — provide config from environment
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: APP_CONFIG, useValue: environment },
    // ... other providers
  ]
};
```

```typescript
// Any service — inject the token, not the environment file directly
@Injectable({ providedIn: 'root' })
export class SurveyApiService {
  private config = inject(APP_CONFIG);
  private http   = inject(HttpClient);

  getAll() {
    return this.http.get<Survey[]>(`${this.config.apiUrl}/surveys`);
  }
}
```

**Benefits:** Services never import `environment` directly — in tests you provide a test config token instead.

---

## 3. Testing with a Config Token

```typescript
beforeEach(() => {
  TestBed.configureTestingModule({
    providers: [
      SurveyApiService,
      HttpClientTestingModule,
      {
        provide: APP_CONFIG,
        useValue: { apiUrl: 'http://test-api', featureFlags: { enableAnalytics: false } }
      }
    ]
  });
});
```

No need to swap files or mock `environment` — just provide the token.

---

## 4. Runtime Configuration (12-Factor Apps)

For container deployments (Docker, Kubernetes), baking config into the build violates 12-factor principles. Instead, load config from the server at startup:

```typescript
// config.service.ts
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: AppConfig | null = null;

  load(): Promise<void> {
    return fetch('/assets/config/app-config.json')
      .then(res => res.json())
      .then(config => { this.config = config; });
  }

  get<K extends keyof AppConfig>(key: K): AppConfig[K] {
    if (!this.config) throw new Error('Config not loaded yet');
    return this.config[key];
  }
}
```

```typescript
// app.config.ts — load before app starts
providers: [
  provideAppInitializer(() => inject(ConfigService).load()),
]
```

```json
// public/assets/config/app-config.json — mounted via ConfigMap in Kubernetes
{
  "apiUrl": "https://api.yourdomain.com",
  "featureFlags": { "enableAnalytics": true }
}
```

**CV connection:** *"On the AI Reviewer and Survey Platform deployments in Kubernetes, we used runtime config loaded via `APP_INITIALIZER` — config.json was mounted as a ConfigMap, allowing different environments to share the same Docker image."*

---

## 5. Build Budgets — Enforcing Bundle Sizes

```json
// angular.json — fail the build if bundles exceed limits
"budgets": [
  {
    "type": "initial",
    "maximumWarning": "500kb",
    "maximumError": "1mb"
  },
  {
    "type": "anyComponentStyle",
    "maximumWarning": "4kb",
    "maximumError": "8kb"
  },
  {
    "type": "lazyChunk",
    "maximumWarning": "200kb",
    "maximumError": "400kb"
  }
]
```

Budgets fail CI builds when someone accidentally imports a heavy library — forces conscious decisions about bundle size.

---

## Architect Interview Notes

- **Never import `environment.ts` in services** — use `InjectionToken`. This single rule makes all services testable without file swapping.
- **Runtime config vs build-time config**: build-time is simpler; runtime is required for 12-factor/container deployments where one image runs in multiple environments.
- **Build budgets are a CI enforcement mechanism** — set them and let the pipeline fail rather than relying on developers to check manually.
