## Route Resolvers

A resolver pre-fetches data before the component is activated. The component receives guaranteed data from `ActivatedRoute` — no loading spinners inside the component needed.

---

## 1. Why Use Resolvers?

Without a resolver, the component handles its own loading state:
```typescript
// Component-driven loading — messy
ngOnInit() {
  this.loading = true;
  this.service.getSurvey(this.route.snapshot.params['id']).subscribe(s => {
    this.survey = s;
    this.loading = false;
  });
}
```

With a resolver, the component always receives resolved data — navigation doesn't complete until the data is ready:
```typescript
ngOnInit() {
  this.survey = this.route.snapshot.data['survey']; // always defined
}
```

---

## 2. Functional Resolver (Modern Angular)

```typescript
// survey.resolver.ts
export const surveyResolver: ResolveFn<Survey> = (route) => {
  const id = route.paramMap.get('id')!;
  const service = inject(SurveyService);
  const router = inject(Router);

  return service.getById(id).pipe(
    catchError(() => {
      router.navigate(['/not-found']);
      return EMPTY; // cancel navigation
    })
  );
};
```

```typescript
// Route config
{
  path: 'survey/:id',
  component: SurveyDetailComponent,
  resolve: { survey: surveyResolver }
}
```

```typescript
// Component accesses resolved data
@Component({ /* ... */ })
export class SurveyDetailComponent {
  survey = this.route.snapshot.data['survey'] as Survey;

  constructor(private route: ActivatedRoute) {}
}
```

---

## 3. Multiple Resolvers on One Route

```typescript
{
  path: 'survey/:id/edit',
  component: SurveyEditComponent,
  resolve: {
    survey:      surveyResolver,
    departments: departmentsResolver,
    currentUser: currentUserResolver,
  }
}
```

All resolvers run **in parallel**. The route activates only when all of them complete.

---

## 4. Class-Based Resolver (Legacy)

```typescript
@Injectable({ providedIn: 'root' })
export class SurveyResolver implements Resolve<Survey> {
  constructor(private service: SurveyService, private router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<Survey> {
    return this.service.getById(route.params['id']).pipe(
      catchError(() => {
        this.router.navigate(['/not-found']);
        return EMPTY;
      })
    );
  }
}
```

---

## 5. Accessing Resolved Data in Child Routes

Resolved data is inherited by child routes by default.

```typescript
{
  path: 'survey/:id',
  resolve: { survey: surveyResolver },
  children: [
    { path: 'overview', component: SurveyOverviewComponent },
    { path: 'responses', component: SurveyResponsesComponent },
    // All children access route.snapshot.data['survey']
  ]
}
```

---

## 6. Handling Navigation During Resolution

If the resolver needs to cancel navigation (e.g. 404), return `EMPTY` after redirecting:

```typescript
export const surveyResolver: ResolveFn<Survey> = (route) => {
  return inject(SurveyService).getById(route.params['id']).pipe(
    catchError((err) => {
      if (err.status === 404) {
        inject(Router).navigate(['/not-found']);
      } else {
        inject(Router).navigate(['/error']);
      }
      return EMPTY; // returning EMPTY cancels the current navigation
    })
  );
};
```

---

## Architect Interview Notes

- **Resolver vs. component loading state**: Use resolvers when the component cannot meaningfully render without the data (edit forms, detail views). Use component-level loading for supplementary data that can appear progressively.
- **Resolvers block navigation** — if the API is slow, users see a blank screen. Consider adding a global navigation loading indicator via `Router.events`.
- **Parallel execution**: Multiple resolvers on one route run concurrently — they don't block each other.
- For **optimistic UX**, skip resolvers and use skeleton screens in the component instead.
