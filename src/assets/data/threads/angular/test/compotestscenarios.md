## Component Test Scenarios

Beyond the basic "does it create?" check, real-world components require tests that cover rendering, user interaction, async data, routing, child components, and more. This thread catalogs the most common scenarios.

---

## 1. Rendering from a Service

```typescript
// Mock the service
const heroServiceSpy = jasmine.createSpyObj('HeroService', ['getHeroes']);
heroServiceSpy.getHeroes.and.returnValue(of([{ id: 1, name: 'Windstorm' }]));

await TestBed.configureTestingModule({
  imports: [HeroListComponent],
  providers: [{ provide: HeroService, useValue: heroServiceSpy }],
}).compileComponents();

fixture.detectChanges(); // triggers ngOnInit → service call

const items = fixture.nativeElement.querySelectorAll('li');
expect(items.length).toBe(1);
expect(items[0].textContent).toContain('Windstorm');
```

---

## 2. Handling Empty / Loading States

```typescript
it('should show a loading spinner while data loads', () => {
  // Service returns a subject we can control
  const subject = new Subject<Hero[]>();
  heroServiceSpy.getHeroes.and.returnValue(subject.asObservable());

  fixture.detectChanges(); // ngOnInit subscribes

  expect(fixture.nativeElement.querySelector('.spinner')).toBeTruthy();

  subject.next([]);
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.spinner')).toBeNull();
});
```

---

## 3. Router Navigation

```typescript
import { RouterTestingModule } from '@angular/router/testing';
import { Router } from '@angular/router';

await TestBed.configureTestingModule({
  imports: [HeroDetailComponent, RouterTestingModule],
}).compileComponents();

const router = TestBed.inject(Router);
const navigateSpy = spyOn(router, 'navigate');

component.goBack();

expect(navigateSpy).toHaveBeenCalledWith(['/heroes']);
```

---

## 4. Activated Route Parameters

```typescript
import { ActivatedRoute } from '@angular/router';

await TestBed.configureTestingModule({
  imports: [HeroDetailComponent],
  providers: [
    {
      provide: ActivatedRoute,
      useValue: { snapshot: { paramMap: convertToParamMap({ id: '42' }) } },
    },
  ],
}).compileComponents();

fixture.detectChanges();
expect(component.heroId).toBe(42);
```

---

## 5. Child Component Interaction

When you need to verify that the parent passes the right inputs to a child:

```typescript
import { By } from '@angular/platform-browser';
import { HeroCardComponent } from './hero-card/hero-card.component';

fixture.detectChanges();

const cardDe = fixture.debugElement.query(By.directive(HeroCardComponent));
const cardInstance = cardDe.componentInstance as HeroCardComponent;

expect(cardInstance.hero.name).toBe('Windstorm');
```

To stub a child component entirely:

```typescript
@Component({ selector: 'app-hero-card', template: '' })
class StubHeroCardComponent {
  @Input() hero!: Hero;
}
```

---

## 6. Two-Way Data Binding

```typescript
it('should update model on input change', () => {
  const input: HTMLInputElement = fixture.nativeElement.querySelector('input');
  input.value = 'New Name';
  input.dispatchEvent(new Event('input'));
  fixture.detectChanges();

  expect(component.name).toBe('New Name');
});
```

---

## 7. `ngIf` / `ngFor` Conditional Rendering

```typescript
it('should hide section when flag is false', () => {
  component.showDetails = false;
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.details')).toBeNull();

  component.showDetails = true;
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.details')).toBeTruthy();
});
```

---

## 8. Async HTTP — `HttpClientTestingModule`

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

await TestBed.configureTestingModule({
  imports: [HeroListComponent, HttpClientTestingModule],
}).compileComponents();

const httpMock = TestBed.inject(HttpTestingController);

fixture.detectChanges(); // triggers HTTP call

const req = httpMock.expectOne('/api/heroes');
req.flush([{ id: 1, name: 'Magneta' }]);
fixture.detectChanges();

expect(fixture.nativeElement.querySelectorAll('li').length).toBe(1);
httpMock.verify();
```

---

## 9. Error State

```typescript
it('should display error message on HTTP failure', () => {
  const req = httpMock.expectOne('/api/heroes');
  req.flush('Server error', { status: 500, statusText: 'Internal Server Error' });
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('.error').textContent)
    .toContain('Could not load heroes');
});
```

---

## 10. Testing with `OnPush` Change Detection

`OnPush` components only re-render on new input references or explicit `markForCheck()`:

```typescript
it('should update when input reference changes', () => {
  component.hero = { id: 1, name: 'Before' };
  fixture.detectChanges();

  // Must assign a NEW object reference to trigger OnPush
  component.hero = { id: 1, name: 'After' };
  fixture.detectChanges();

  expect(fixture.nativeElement.querySelector('h2').textContent).toBe('After');
});
```