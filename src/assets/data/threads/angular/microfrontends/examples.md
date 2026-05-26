## Common Micro-Frontend Examples

Concrete patterns you'll encounter repeatedly in the wild. Each example shows the shell/remote split, what each MFE owns, and how they communicate.

---

## Example 1 — E-Commerce Platform

This is the most cited example because the business domains map cleanly to independent teams.

```
Shell (/)
 ├── /products     → product-catalog-mfe   (Team: Catalog)
 ├── /cart         → cart-mfe              (Team: Checkout)
 ├── /checkout     → checkout-mfe          (Team: Checkout)
 ├── /account      → account-mfe           (Team: Identity)
 └── /orders       → orders-mfe            (Team: Fulfillment)
```

**What each MFE owns:**

| MFE | State | API calls | Exposes |
|---|---|---|---|
| `product-catalog` | product list, filters, search | `GET /products` | `./CatalogModule` |
| `cart` | cart items, quantities | `GET/POST /cart` | `./CartModule` |
| `checkout` | shipping, payment form | `POST /orders` | `./CheckoutModule` |
| `account` | profile, addresses | `GET/PUT /users/:id` | `./AccountModule` |

**Cross-MFE communication — cart count in the header:**

The shell renders the header. The cart badge count must update when `cart-mfe` adds an item.

```typescript
// cart-mfe — broadcasts when cart changes
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class CartEventService {
  private channel = new BroadcastChannel('cart-events');

  notifyCartUpdated(itemCount: number) {
    this.channel.postMessage({ type: 'CART_UPDATED', itemCount });
  }
}
```

```typescript
// shell — header component listens
@Component({ selector: 'app-header', ... })
export class HeaderComponent implements OnInit, OnDestroy {
  cartCount = 0;
  private channel = new BroadcastChannel('cart-events');

  ngOnInit() {
    this.channel.onmessage = ({ data }) => {
      if (data.type === 'CART_UPDATED') {
        this.cartCount = data.itemCount;
      }
    };
  }

  ngOnDestroy() { this.channel.close(); }
}
```

---

## Example 2 — Banking / FinTech Dashboard

A common enterprise pattern. Tight security requirements mean auth is centralised in the shell; each remote simply reads from the shared store.

```
Shell (/)
 ├── /accounts     → accounts-mfe      (Team: Core Banking)
 ├── /transfers    → transfers-mfe     (Team: Payments)
 ├── /cards        → cards-mfe         (Team: Cards)
 ├── /investments  → investments-mfe   (Team: Wealth)
 └── /settings     → settings-mfe      (Team: Identity)
```

**Auth flow — shell owns it, remotes consume it:**

```typescript
// shell — registers auth state globally
@NgModule({
  imports: [
    StoreModule.forRoot({ auth: authReducer }),  // singleton — shared via Module Federation
    EffectsModule.forRoot([AuthEffects]),
  ],
})
export class AppModule {}
```

```typescript
// transfers-mfe — reads auth without owning it
export const selectCurrentUser = createSelector(
  (state: any) => state['auth'],   // slice owned by shell
  auth => auth.user
);

@Component({ ... })
export class TransferFormComponent {
  user$ = this.store.select(selectCurrentUser);
  constructor(private store: Store) {}
}
```

**Why this works:** `@ngrx/store` is declared `singleton: true` in every `webpack.config.js`. Module Federation ensures only one store instance loads — the shell's. Remotes attach to it.

---

## Example 3 — SaaS Multi-Tenant Platform

Each product feature is independently deployable. Customers can be on different versions of different features.

```
Shell (/)
 ├── /dashboard    → analytics-mfe     (Team: Data)
 ├── /projects     → projects-mfe      (Team: Core)
 ├── /team         → team-mfe          (Team: Identity)
 ├── /billing      → billing-mfe       (Team: Revenue)
 └── /reports      → reports-mfe       (Team: Data)
```

**Feature flags per remote — loading a different remote based on plan:**

```typescript
// shell/src/app/app.routes.ts
import { ConfigService } from './config/config.service';
import { inject } from '@angular/core';

export const routes: Routes = [
  {
    path: 'reports',
    loadChildren: () => {
      const cfg = inject(ConfigService);
      // cfg.plan comes from the user's subscription, set at login
      const remoteUrl = cfg.plan === 'enterprise'
        ? cfg.getRemoteUrl('reports-pro')   // advanced reporting MFE
        : cfg.getRemoteUrl('reports-basic'); // simple reporting MFE

      return loadRemoteModule({
        type: 'module',
        remoteEntry: remoteUrl,
        exposedModule: './Module',
      }).then(m => m.ReportsModule);
    },
  },
];
```

Different teams ship `reports-basic` and `reports-pro` on completely independent cycles.

---

## Example 4 — Internal Admin Portal

A common corporate use case. Multiple back-office teams own their slice of a shared portal.

```
Shell (admin.company.com/)
 ├── /users        → user-management-mfe   (Team: Identity)
 ├── /content      → cms-mfe               (Team: Content)
 ├── /inventory    → inventory-mfe          (Team: Operations)
 └── /analytics    → analytics-mfe          (Team: Data)
```

**Shared design system exposed by the shell:**

```javascript
// shell/webpack.config.js
module.exports = withModuleFederationPlugin({
  exposes: {
    // Remotes import shared UI components directly from the shell
    './DesignSystem': './src/app/shared/design-system/index.ts',
    './AuthGuard':    './src/app/core/guards/auth.guard.ts',
  },
  remotes: {
    'user-management': environment.remotes.userManagement,
    'cms':             environment.remotes.cms,
  },
  shared: { ...shareAll({ singleton: true, strictVersion: true, requiredVersion: 'auto' }) },
});
```

```typescript
// cms-mfe — imports the shell's Button component at runtime
// webpack.config.js of cms-mfe
remotes: {
  shell: environment.remotes.shell,  // the shell is also a remote for CMS
}

// cms-mfe component
import { ButtonComponent } from 'shell/DesignSystem';  // resolved at runtime
```

This guarantees one consistent design system version across all admin tools without duplicating the component library.

---

## Example 5 — What a Bad Split Looks Like (Anti-Pattern)

Splitting by technical layer instead of business domain breaks independence.

```
❌ Bad — teams are tightly coupled
Shell
 ├── /components  → components-mfe   (all shared UI)
 ├── /services    → services-mfe     (all API calls)
 └── /pages       → pages-mfe        (all page views)
```

If Pages MFE needs a new API call, it touches Services MFE. If Services MFE changes a contract, it can break Pages MFE. Both need to be deployed together — you've rebuilt a monolith.

```
✅ Good — each MFE is a full vertical slice
Shell
 ├── /surveys    → surveys-mfe    (survey UI + survey API calls + survey state)
 ├── /reports    → reports-mfe   (report UI + report API calls + report state)
```

Each team owns everything from component to API call for their domain.

---

## Quick Reference — Choosing a Communication Pattern

| Scenario | Pattern | Why |
|---|---|---|
| Cart count badge in shell header | `BroadcastChannel` | Shell and MFE are separate Angular apps |
| Auth token across all remotes | Shared NgRx store (`singleton: true`) | All remotes are Angular — one store instance |
| Navigating from one MFE to another | Shell router via `router.navigate()` passed as callback | MFEs should not import each other's router |
| Pass a selected item to a sibling MFE | URL query params or `BroadcastChannel` | Avoids direct coupling |
| MFE needs current user info | Shared NgRx auth slice or `BroadcastChannel` on login | Depends on whether remotes are same framework |
| Open a modal defined in the shell | Emit DOM custom event | Works cross-framework |
