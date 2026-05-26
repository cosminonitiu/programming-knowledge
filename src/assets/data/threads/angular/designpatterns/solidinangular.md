## SOLID Principles in Angular

SOLID is not just for backend code. Applied to Angular, it produces maintainable, testable, and extensible frontend architectures.

---

## 1. Single Responsibility Principle (SRP)

**One reason to change.** Each class/component/service does one thing.

### Violation — God service
```typescript
// Bad: UserService knows about auth, HTTP, UI state, and validation
@Injectable({ providedIn: 'root' })
export class UserService {
  login() { /* auth logic */ }
  getProfile() { /* HTTP call */ }
  updateAvatar() { /* HTTP + file upload */ }
  showWelcomeToast() { /* UI notification */ }
  validateEmail(email: string) { /* business rule */ }
}
```

### Correct — Split by responsibility
```typescript
@Injectable({ providedIn: 'root' })
export class AuthService       { login() { /* ... */ } }

@Injectable({ providedIn: 'root' })
export class UserApiService    { getProfile() { /* ... */ } }

@Injectable({ providedIn: 'root' })
export class NotificationService { showToast() { /* ... */ } }
```

**Angular SRP for components:** A component should either manage state (smart) or display data (dumb) — not both.

---

## 2. Open/Closed Principle (OCP)

**Open for extension, closed for modification.**

### Pattern: `InjectionToken` + Strategy

```typescript
// Define the contract
export interface ExportStrategy {
  export(data: Survey[]): void;
}

export const EXPORT_STRATEGY = new InjectionToken<ExportStrategy>('ExportStrategy');

// Implementations (extensions) — no modification of existing code
@Injectable()
export class CsvExportStrategy implements ExportStrategy {
  export(data: Survey[]) { /* CSV logic */ }
}

@Injectable()
export class PdfExportStrategy implements ExportStrategy {
  export(data: Survey[]) { /* PDF logic */ }
}
```

```typescript
// Consumer never changes when a new format is added
@Component({ /* ... */ })
export class ExportButtonComponent {
  constructor(@Inject(EXPORT_STRATEGY) private strategy: ExportStrategy) {}

  onExport(data: Survey[]) { this.strategy.export(data); }
}
```

```typescript
// Switch strategy via DI — no component code changes
providers: [
  { provide: EXPORT_STRATEGY, useClass: PdfExportStrategy }
]
```

---

## 3. Liskov Substitution Principle (LSP)

**Subtypes must be substitutable for their base types.** In Angular, this often applies to abstract services and mock replacements.

```typescript
abstract class DataStore<T> {
  abstract getAll(): Observable<T[]>;
  abstract getById(id: string): Observable<T>;
  abstract save(item: T): Observable<T>;
}

@Injectable()
export class SurveyApiStore extends DataStore<Survey> {
  getAll() { return this.http.get<Survey[]>('/api/surveys'); }
  // ...
}

@Injectable()
export class SurveyMockStore extends DataStore<Survey> {
  getAll() { return of(MOCK_SURVEYS); }
  // ...
}

// The rest of the app only knows DataStore<Survey> — either works
```

---

## 4. Interface Segregation Principle (ISP)

**No class should be forced to depend on methods it doesn't use.** Keep interfaces narrow.

```typescript
// Violation — fat interface
interface SurveyRepository {
  getAll(): Observable<Survey[]>;
  getById(id: string): Observable<Survey>;
  create(s: Survey): Observable<Survey>;
  update(s: Survey): Observable<Survey>;
  delete(id: string): Observable<void>;
  exportToCsv(): Observable<Blob>;    // unrelated to CRUD
  sendReminders(): Observable<void>;  // unrelated to data access
}

// Correct — split by concern
interface SurveyReader    { getAll(): Observable<Survey[]>; getById(id: string): Observable<Survey>; }
interface SurveyWriter    { create(s: Survey): Observable<Survey>; update(s: Survey): Observable<Survey>; delete(id: string): Observable<void>; }
interface SurveyExporter  { exportToCsv(): Observable<Blob>; }
```

---

## 5. Dependency Inversion Principle (DIP)

**Depend on abstractions, not concretions.** In Angular, DI tokens are the mechanism.

```typescript
// Abstraction
export abstract class AnalyticsService {
  abstract track(event: string, props?: Record<string, unknown>): void;
}

// Concrete implementations
@Injectable()
export class MixpanelAnalyticsService extends AnalyticsService {
  track(event: string, props?: Record<string, unknown>) {
    mixpanel.track(event, props);
  }
}

@Injectable()
export class NoopAnalyticsService extends AnalyticsService {
  track() { /* do nothing — test environment */ }
}

// High-level component depends on the abstraction
@Component({ /* ... */ })
export class SurveyCreateComponent {
  constructor(private analytics: AnalyticsService) {}

  onSubmit() {
    this.analytics.track('survey_created', { title: this.form.value.title });
  }
}
```

```typescript
// Swap via DI — component never changes
providers: [
  { provide: AnalyticsService, useClass: environment.production ? MixpanelAnalyticsService : NoopAnalyticsService }
]
```

---

## Architect Interview Notes

- **SRP** — the single most violated principle in Angular codebases. The fix is almost always "split this service."
- **OCP via DI tokens** is the Angular superpower — you swap entire behaviours without touching consuming code.
- **DIP** is why Angular's DI system is so powerful for testing — you always inject the abstraction, and swap the concrete in tests.
- **CV connection:** *"At Aumovio and on the Survey Platform, I enforced SOLID through code review standards — particularly SRP for services and DIP for analytics, logging, and export strategies. This is what made the codebase extensible for new requirements without regression risk."*
