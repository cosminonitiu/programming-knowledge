## Angular Service Workers & PWA

The `@angular/service-worker` package adds offline capability, background sync, and push notifications to Angular apps with minimal configuration.

---

## 1. Setup

```bash
ng add @angular/pwa --project my-app
```

This adds:
- `@angular/service-worker` to dependencies
- `ngsw-config.json` — caching configuration
- `manifest.webmanifest` — PWA metadata (name, icons, theme color)
- Registers the service worker in `app.config.ts`

```typescript
// app.config.ts
import { provideServiceWorker } from '@angular/service-worker';
import { isDevMode } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),           // disabled in development
      registrationStrategy: 'registerWhenStable:30000'  // register after app is stable, within 30s
    })
  ]
};
```

---

## 2. `ngsw-config.json` — Caching Strategies

```json
{
  "$schema": "./node_modules/@angular/service-worker/config/schema.json",
  "index": "/index.html",
  "assetGroups": [
    {
      "name": "app",
      "installMode": "prefetch",
      "resources": {
        "files": ["/favicon.ico", "/index.html", "/*.css", "/*.js"]
      }
    },
    {
      "name": "assets",
      "installMode": "lazy",
      "updateMode": "prefetch",
      "resources": {
        "files": ["/assets/**", "/*.(svg|cur|jpg|jpeg|png|apng|webp|avif|gif|otf|ttf|woff|woff2)"]
      }
    }
  ],
  "dataGroups": [
    {
      "name": "api-freshness",
      "urls": ["/api/surveys"],
      "cacheConfig": {
        "strategy": "freshness",    // try network first, fall back to cache
        "maxSize": 100,
        "maxAge": "1h",
        "timeout": "10s"
      }
    },
    {
      "name": "api-performance",
      "urls": ["/api/countries", "/api/roles"],
      "cacheConfig": {
        "strategy": "performance",  // serve from cache, update in background
        "maxSize": 50,
        "maxAge": "24h"
      }
    }
  ]
}
```

### Caching Strategies

| Strategy | Behavior | Use For |
|---|---|---|
| `freshness` | Network first, cache fallback | Dynamic data (surveys, user data) |
| `performance` | Cache first, background update | Reference data (countries, config) |

---

## 3. App Update Handling

Service workers cache app files. When you deploy a new version, users need to be notified to reload:

```typescript
@Injectable({ providedIn: 'root' })
export class AppUpdateService {
  private updates = inject(SwUpdate);
  private snackBar = inject(MatSnackBar);

  constructor() {
    if (!this.updates.isEnabled) return;

    // Check for updates every 6 hours
    interval(6 * 60 * 60 * 1000).subscribe(() => {
      this.updates.checkForUpdate();
    });

    // React to available updates
    this.updates.versionUpdates.pipe(
      filter(e => e.type === 'VERSION_READY')
    ).subscribe(() => {
      const snack = this.snackBar.open('New version available!', 'Reload', {
        duration: 0
      });
      snack.onAction().subscribe(() => {
        this.updates.activateUpdate().then(() => {
          document.location.reload();
        });
      });
    });

    // Handle unrecoverable state (cached version no longer available)
    this.updates.unrecoverable.subscribe(() => {
      this.snackBar.open('App state is unrecoverable. Reloading...', '', { duration: 3000 });
      setTimeout(() => document.location.reload(), 3000);
    });
  }
}
```

---

## 4. Push Notifications

```typescript
import { SwPush } from '@angular/service-worker';

@Injectable({ providedIn: 'root' })
export class PushNotificationService {
  private swPush = inject(SwPush);
  private http = inject(HttpClient);

  async subscribe(publicKey: string): Promise<void> {
    const subscription = await this.swPush.requestSubscription({
      serverPublicKey: publicKey  // VAPID public key from your server
    });

    // Send subscription to your backend
    await firstValueFrom(
      this.http.post('/api/push/subscribe', subscription)
    );
  }
}
```

---

## 5. Testing Service Workers

Service workers are disabled in development. Test in a production build:

```bash
ng build
npx http-server dist/my-app -p 8080
```

Then open `http://localhost:8080` and check the Application → Service Workers tab in DevTools.

---

## 6. SSR + Service Worker Considerations

Service workers and SSR can conflict — the service worker intercepts requests that SSR should handle:

- Service workers only intercept after the first load
- SSR renders the first page server-side; subsequent navigation is client-side
- Use `NavigationStrategy: freshness` for index.html to always get the latest HTML from the server

---

## Architect Notes

- **Don't add a service worker unless you need offline capability or push notifications** — they add significant update complexity
- The `VERSION_READY` update flow is critical — if you don't implement it, users can run an old version for days
- The `unrecoverable` state happens when the server removes cached chunks during deployment — handle it or users will get white screens
- Service workers work only over HTTPS (and localhost) — plan your deployment accordingly
