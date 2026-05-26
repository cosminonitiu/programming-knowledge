## Auxiliary Routes & Named Router Outlets

Angular supports multiple independent router outlets on the same page — each can display different routes simultaneously.

---

## 1. Named Outlets

```html
<!-- app.component.html -->
<router-outlet></router-outlet>                    <!-- primary outlet -->
<router-outlet name="sidebar"></router-outlet>     <!-- auxiliary outlet -->
<router-outlet name="modal"></router-outlet>       <!-- another auxiliary outlet -->
```

```typescript
// app.routes.ts
export const routes: Routes = [
  { path: 'dashboard', component: DashboardComponent },
  {
    path: 'chat',
    component: ChatPanelComponent,
    outlet: 'sidebar'    // targets the named outlet
  },
  {
    path: 'confirm',
    component: ConfirmDialogComponent,
    outlet: 'modal'
  }
];
```

---

## 2. Navigating to Auxiliary Routes

```typescript
// Navigate using routerLink
<a [routerLink]="[{ outlets: { sidebar: ['chat'], primary: ['dashboard'] } }]">
  Open Chat
</a>

// Navigate programmatically
this.router.navigate([{ outlets: { sidebar: ['chat'] } }]);

// Navigate to multiple outlets at once
this.router.navigate([
  { outlets: { primary: ['dashboard'], sidebar: ['chat'], modal: ['confirm'] } }
]);
```

---

## 3. Closing Auxiliary Outlets

```typescript
// Set the outlet to null to close it
this.router.navigate([{ outlets: { sidebar: null } }]);

<a [routerLink]="[{ outlets: { modal: null } }]">Close Modal</a>
```

---

## 4. URL Representation

Auxiliary routes appear as `(outletName:path)` in the URL:

```
/dashboard(sidebar:chat//modal:confirm)
```

- Primary route: `/dashboard`
- Sidebar outlet: `chat`
- Modal outlet: `confirm`
- Multiple auxiliary routes are separated by `//`

---

## 5. Guards on Auxiliary Routes

Guards work normally on auxiliary routes:

```typescript
{
  path: 'admin-panel',
  component: AdminPanelComponent,
  outlet: 'sidebar',
  canActivate: [() => inject(AuthService).isAdmin()]
}
```

---

## 6. Real-World Use Cases

| Pattern | Primary Outlet | Auxiliary Outlet |
|---|---|---|
| Side panel | Main content | Collapsible chat/help |
| Dialog/Modal | Page content | Confirmation dialog |
| Master-detail | Detail view | Preview panel |
| Admin layout | Dashboard | Action panel |

---

## 7. Common Pitfalls

**Problem:** Auxiliary route state persists across navigation
```typescript
// Always clear auxiliary outlets when navigating away
this.router.navigate(['dashboard', { outlets: { modal: null, sidebar: null } }]);
```

**Problem:** `routerLinkActive` doesn't work with auxiliary routes as expected — use manual route matching instead.

**Problem:** Deep linking to auxiliary routes requires the server to handle the full URL format `(outlet:path)`.

---

## Architect Notes

- Use auxiliary routes for **UI state that deserves a URL** — shareable dialogs, side panels that persist on page refresh
- Prefer Angular CDK `Dialog` or `Overlay` for transient modals that don't need deep linking
- Auxiliary routes add complexity to the router state — document their usage in team conventions
- Each named outlet has its own independent navigation history within the browser session
