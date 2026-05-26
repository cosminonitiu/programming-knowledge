## Deploying Micro-Frontends with Docker

Each micro-frontend is an independent Angular app that builds to static files and runs behind its own nginx container. The shell and every remote are separate Docker images — built, versioned, and deployed independently.

---

## 1. The Mental Model

```
                        ┌─────────────────────────────────────┐
                        │         nginx reverse proxy          │
                        │          (one public port)           │
                        └────┬──────────────┬──────────────────┘
                             │              │
              ┌──────────────▼──┐    ┌──────▼──────────┐
              │   shell:80      │    │  surveys-mfe:80  │
              │  (Angular app)  │    │  (Angular app)   │
              └─────────────────┘    └─────────────────-┘
                                     ┌──────▼──────────┐
                                     │  reports-mfe:80  │
                                     └─────────────────-┘
```

The reverse proxy sits in front of everything and routes by path prefix. This means:
- All remotes are reachable under one domain — no CORS issues
- Remote URLs become simple paths: `/surveys-mfe/remoteEntry.js`
- Each MFE image is oblivious to the others

---

## 2. Dockerfile — Same Pattern for Every MFE

```dockerfile
# apps/surveys-mfe/Dockerfile
# ── Stage 1: Build ────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
# In an Nx monorepo this is: npx nx build surveys-mfe --configuration=production
RUN npm run build -- surveys-mfe --configuration=production

# ── Stage 2: Serve ────────────────────────────────────────────
FROM nginx:1.27-alpine
COPY --from=builder /app/dist/surveys-mfe /usr/share/nginx/html
COPY apps/surveys-mfe/nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
```

```nginx
# apps/surveys-mfe/nginx.conf
server {
    listen 80;
    root /usr/share/nginx/html;

    # Angular routing — let the app handle unknown paths
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Static assets — aggressive caching
    location ~* \.(js|css|png|jpg|woff2)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
}
```

The shell uses exactly the same Dockerfile pattern, just a different build target.

---

## 3. Runtime Remote URLs — The Core Problem

**The problem:** Module Federation bakes remote URLs into the bundle at build time. But in Docker the URL depends on the environment (local, staging, prod). You can't rebuild the image per environment.

**The solution:** fetch a config JSON at app startup and use it to resolve remote URLs dynamically.

### Step 1 — Config service (shell only)

```typescript
// shell/src/app/config/config.service.ts
import { Injectable } from '@angular/core';

interface RemoteConfig {
  [remoteName: string]: string; // name → remoteEntry URL
}

@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config: RemoteConfig = {};

  load(): Promise<void> {
    return fetch('/assets/config/remotes.json')
      .then(r => r.json())
      .then(cfg => { this.config = cfg; });
  }

  getRemoteUrl(name: string): string {
    return this.config[name];
  }
}
```

### Step 2 — Load config before Angular bootstraps

```typescript
// shell/src/app/app.config.ts
import { ApplicationConfig, APP_INITIALIZER } from '@angular/core';
import { ConfigService } from './config/config.service';

export function initConfig(cfg: ConfigService) {
  return () => cfg.load(); // returns a Promise — Angular waits for it
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    {
      provide: APP_INITIALIZER,
      useFactory: initConfig,
      deps: [ConfigService],
      multi: true,
    },
  ],
};
```

### Step 3 — Use config in the router

```typescript
// shell/src/app/app.routes.ts
import { inject } from '@angular/core';
import { loadRemoteModule } from '@angular-architects/module-federation';
import { ConfigService } from './config/config.service';

export const routes: Routes = [
  {
    path: 'surveys',
    loadChildren: () => {
      const cfg = inject(ConfigService);
      return loadRemoteModule({
        type: 'module',
        remoteEntry: cfg.getRemoteUrl('surveys'),  // resolved at runtime
        exposedModule: './Module',
      }).then(m => m.SurveysModule);
    },
  },
];
```

### Step 4 — Docker entrypoint writes the config from ENV vars

```bash
#!/bin/sh
# shell/docker-entrypoint.sh
# Generates remotes.json from environment variables at container start

cat > /usr/share/nginx/html/assets/config/remotes.json <<EOF
{
  "surveys": "${SURVEYS_REMOTE_URL}",
  "reports": "${REPORTS_REMOTE_URL}"
}
EOF

exec nginx -g 'daemon off;'
```

```dockerfile
# shell/Dockerfile — add these lines after the COPY steps
COPY apps/shell/docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

ENTRYPOINT ["/docker-entrypoint.sh"]
```

Now the same image runs everywhere. You just change the ENV vars per environment.

---

## 4. docker-compose.yml (Local / Staging)

```yaml
# docker-compose.yml
version: '3.9'

services:
  # ── Reverse proxy ──────────────────────────────────────────
  proxy:
    image: nginx:1.27-alpine
    ports:
      - "4200:80"
    volumes:
      - ./nginx-proxy.conf:/etc/nginx/conf.d/default.conf:ro
    depends_on:
      - shell
      - surveys-mfe
      - reports-mfe

  # ── Shell ──────────────────────────────────────────────────
  shell:
    build:
      context: .
      dockerfile: apps/shell/Dockerfile
    environment:
      # Paths under the proxy — no CORS because they're same origin
      - SURVEYS_REMOTE_URL=/surveys-mfe/remoteEntry.js
      - REPORTS_REMOTE_URL=/reports-mfe/remoteEntry.js

  # ── Remote: Surveys ────────────────────────────────────────
  surveys-mfe:
    build:
      context: .
      dockerfile: apps/surveys-mfe/Dockerfile
    # NOT exposed directly — accessed only through the proxy

  # ── Remote: Reports ────────────────────────────────────────
  reports-mfe:
    build:
      context: .
      dockerfile: apps/reports-mfe/Dockerfile
```

```nginx
# nginx-proxy.conf  — routes traffic to the right container by path prefix
upstream shell_upstream     { server shell:80; }
upstream surveys_upstream   { server surveys-mfe:80; }
upstream reports_upstream   { server reports-mfe:80; }

server {
    listen 80;

    # Remotes are served under their own prefix
    location /surveys-mfe/ {
        proxy_pass http://surveys_upstream/;
    }

    location /reports-mfe/ {
        proxy_pass http://reports_upstream/;
    }

    # Everything else goes to the shell
    location / {
        proxy_pass http://shell_upstream/;
    }
}
```

---

## 5. Independent CI/CD — The Whole Point

Each MFE lives in its own pipeline. Only the changed MFE is rebuilt and redeployed.

```
Team A pushes to surveys-mfe branch
    → CI builds surveys-mfe Docker image
    → Tags as surveys-mfe:1.4.2 and surveys-mfe:latest
    → Pushes to registry
    → k8s deployment rolls out surveys-mfe:1.4.2
    → Shell still running unchanged — picks up new remoteEntry.js automatically
```

**In Kubernetes this looks like:**
```yaml
# surveys-mfe-deployment.yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: surveys-mfe
spec:
  replicas: 2
  selector:
    matchLabels:
      app: surveys-mfe
  template:
    spec:
      containers:
        - name: surveys-mfe
          image: myregistry.io/surveys-mfe:1.4.2
          ports:
            - containerPort: 80
---
apiVersion: v1
kind: Service
metadata:
  name: surveys-mfe
spec:
  selector:
    app: surveys-mfe
  ports:
    - port: 80
```

The shell Deployment does **not** change. It just talks to the `surveys-mfe` Service, which now routes to the new pods.

---

## 6. Caching Strategy for remoteEntry.js

`remoteEntry.js` is the file the shell fetches to discover the remote's chunks. **Never cache it aggressively** — it must always be the latest version.

```nginx
# In each MFE's nginx.conf
location = /remoteEntry.js {
    add_header Cache-Control "no-store, no-cache, must-revalidate";
    expires 0;
}

# All other JS/CSS chunks can be cached forever (content-hashed filenames)
location ~* \.(js|css)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

---

## 7. Checklist Before Deploying

| Concern | Solution |
|---|---|
| Remote URLs are hardcoded | Use `APP_INITIALIZER` + entrypoint script |
| CORS errors between MFEs | Put everything behind a reverse proxy |
| `remoteEntry.js` is cached | Set `no-store` on that file specifically |
| Angular loads twice | `singleton: true` + `strictVersion: true` in webpack config |
| Remote is down, shell crashes | Wrap `loadRemoteModule` in `.catch()` → fallback module |
| Images differ per environment | Inject ENV vars at container start, not at build time |
