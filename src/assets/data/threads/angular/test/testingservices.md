## Testing Angular Services

Services encapsulate business logic, HTTP calls, and shared state. They are usually the easiest Angular artifact to test because they have no DOM dependency.

---

## 1. Testing a Simple Service (No Dependencies)

```typescript
import { TestBed } from '@angular/core/testing';
import { CalculatorService } from './calculator.service';

describe('CalculatorService', () => {
  let service: CalculatorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculatorService);
  });

  it('should add two numbers', () => {
    expect(service.add(2, 3)).toBe(5);
  });

  it('should divide and throw on zero', () => {
    expect(() => service.divide(10, 0)).toThrowError('Division by zero');
  });
});
```

---

## 2. Mocking Dependencies with Spy Objects

```typescript
import { LoggerService } from './logger.service';
import { HeroService } from './hero.service';
import { of } from 'rxjs';

describe('HeroService', () => {
  let service: HeroService;
  let loggerSpy: jasmine.SpyObj<LoggerService>;

  beforeEach(() => {
    loggerSpy = jasmine.createSpyObj('LoggerService', ['log', 'error']);

    TestBed.configureTestingModule({
      providers: [
        HeroService,
        { provide: LoggerService, useValue: loggerSpy },
      ],
    });

    service = TestBed.inject(HeroService);
  });

  it('should log when fetching heroes', () => {
    service.getHeroes();
    expect(loggerSpy.log).toHaveBeenCalledWith('fetching heroes');
  });
});
```

---

## 3. Testing HTTP Services with `HttpClientTestingModule`

```typescript
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

describe('HeroService (HTTP)', () => {
  let service: HeroService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [HeroService],
    });

    service = TestBed.inject(HeroService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    // Verify no unexpected requests were made
    httpMock.verify();
  });

  it('should GET heroes', () => {
    const mockHeroes = [{ id: 1, name: 'Windstorm' }];

    service.getHeroes().subscribe(heroes => {
      expect(heroes.length).toBe(1);
      expect(heroes[0].name).toBe('Windstorm');
    });

    const req = httpMock.expectOne('/api/heroes');
    expect(req.request.method).toBe('GET');
    req.flush(mockHeroes); // deliver the mock response
  });

  it('should POST a new hero', () => {
    const newHero = { name: 'Magneta' };

    service.addHero(newHero).subscribe();

    const req = httpMock.expectOne('/api/heroes');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newHero);
    req.flush({ id: 2, ...newHero });
  });

  it('should handle a 404 error', () => {
    service.getHero(999).subscribe({
      next: () => fail('should have errored'),
      error: (err) => expect(err.status).toBe(404),
    });

    const req = httpMock.expectOne('/api/heroes/999');
    req.flush('Not found', { status: 404, statusText: 'Not Found' });
  });
});
```

---

## 4. `HttpTestingController` Reference

| Method | Description |
|--------|-------------|
| `expectOne(url)` | Assert exactly one pending request to this URL |
| `expectOne(match)` | Assert one request matching a `RequestMatch` object |
| `expectNone(url)` | Assert no requests were made to this URL |
| `match(url)` | Returns all pending requests matching the URL |
| `verify()` | Throw if any unexpected requests remain |

---

## 5. Testing Observable Services

```typescript
import { of, throwError } from 'rxjs';

it('should return cached result on second call', () => {
  const spy = spyOn(httpClient, 'get').and.returnValue(of([{ id: 1 }]));

  service.getHeroes().subscribe();
  service.getHeroes().subscribe();

  // HTTP called only once due to caching
  expect(spy).toHaveBeenCalledTimes(1);
});
```

---

## 6. Testing Async Services with `fakeAsync`

```typescript
import { fakeAsync, tick } from '@angular/core/testing';

it('should debounce search requests', fakeAsync(() => {
  const spy = spyOn(service, 'search').and.returnValue(of([]));

  service.searchWithDebounce('ang');
  tick(300); // simulate debounce time

  expect(spy).toHaveBeenCalledWith('ang');
}));
```

---

## 7. Testing Services with RxJS Subjects (State Services)

```typescript
describe('AuthStore', () => {
  let store: AuthStore;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [AuthStore] });
    store = TestBed.inject(AuthStore);
  });

  it('should be logged out initially', (done) => {
    store.isLoggedIn$.subscribe(val => {
      expect(val).toBeFalse();
      done();
    });
  });

  it('should emit true after login', (done) => {
    store.login({ username: 'alice', token: 'abc' });

    store.isLoggedIn$.subscribe(val => {
      expect(val).toBeTrue();
      done();
    });
  });
});
```

---

## 8. Testing Services Without `TestBed`

For pure logic services with no Angular dependencies, skip `TestBed` entirely:

```typescript
describe('FormatService (no TestBed)', () => {
  const service = new FormatService();

  it('should format currency', () => {
    expect(service.formatUSD(1234.5)).toBe('$1,234.50');
  });
});
```

This is faster and avoids Angular module overhead.