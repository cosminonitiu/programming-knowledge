## 1. Testing Reducers

### Why Test Reducers?
Reducers are pure functions that take the current state and an action to produce a new state. Testing reducers is straightforward because they are deterministic and side-effect free.

### Example: Testing a User Reducer
Assume we have a simple reducer that handles loading users:
```typescript
// user.reducer.ts
import { createReducer, on } from '@ngrx/store';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';

export interface UserState {
  users: User[];
  loading: boolean;
}

export const initialState: UserState = {
  users: [],
  loading: false,
};

export const userReducer = createReducer(
  initialState,
  on(UserActions.loadUsers, state => ({ ...state, loading: true })),
  on(UserActions.loadUsersSuccess, (state, { users }) => ({ ...state, users, loading: false })),
  on(UserActions.loadUsersFailure, state => ({ ...state, loading: false }))
);
```

```typescript
// user.reducer.spec.ts
import { userReducer, initialState, UserState } from './user.reducer';
import * as UserActions from '../actions/user.actions';
import { User } from '../models/user.model';

describe('UserReducer', () => {
  it('should set loading to true on loadUsers action', () => {
    const action = UserActions.loadUsers();
    const state = userReducer(initialState, action);
    expect(state.loading).toBe(true);
  });

  it('should load users and set loading to false on loadUsersSuccess action', () => {
    const dummyUsers: User[] = [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }];
    const action = UserActions.loadUsersSuccess({ users: dummyUsers });
    const state = userReducer({ ...initialState, loading: true }, action);
    expect(state.users).toEqual(dummyUsers);
    expect(state.loading).toBe(false);
  });

  it('should set loading to false on loadUsersFailure action', () => {
    const action = UserActions.loadUsersFailure({ error: 'Error loading users' });
    const state = userReducer({ ...initialState, loading: true }, action);
    expect(state.loading).toBe(false);
  });
}); 
```

**2. Testing Selectors
Purpose of Selectors:**
Selectors are functions that retrieve specific slices or derived data from the store. They are memoized, so it’s important to test that they return the expected results given a particular state.

Example: Testing a Selector
```typescript
// user.selectors.ts
import { createSelector } from '@ngrx/store';
import { AppState } from '../app.state';
import { UserState } from '../reducers/user.reducer';

export const selectUserState = (state: AppState) => state.users;

export const selectAllUsers = createSelector(
  selectUserState,
  (state: UserState) => state.users
); 
```
**Test for the Selector:**
```typescript
// user.selectors.spec.ts
import { selectAllUsers } from './user.selectors';
import { UserState } from '../reducers/user.reducer';
import { AppState } from '../app.state';

describe('User Selectors', () => {
  it('should select all users', () => {
    const testState: AppState = {
      users: {
        users: [{ id: '1', name: 'Alice' }, { id: '2', name: 'Bob' }],
        loading: false,
      }
    };

    const result = selectAllUsers(testState);
    expect(result.length).toBe(2);
    expect(result[0].name).toBe('Alice');
  });
}); 
```

**3. Testing Effects
Why Test Effects?**
Effects manage side effects such as API calls, so testing them involves ensuring that the correct actions are dispatched in response to incoming actions. Marble testing is often used to simulate asynchronous flows.

Example: Testing an Effect with Marble Testing
Using RxJS’s TestScheduler:

```typescript
// user.effects.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Observable, of, throwError } from 'rxjs';
import { hot, cold } from 'jasmine-marbles';
import { UserEffects } from './user.effects';
import * as UserActions from '../actions/user.actions';
import { UserService } from '../services/user.service';

describe('UserEffects', () => {
  let actions$: Observable<any>;
  let effects: UserEffects;
  let userService: jasmine.SpyObj<UserService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('UserService', ['getUsers']);

    TestBed.configureTestingModule({
      providers: [
        UserEffects,
        provideMockActions(() => actions$),
        { provide: UserService, useValue: spy }
      ]
    });

    effects = TestBed.inject(UserEffects);
    userService = TestBed.inject(UserService) as jasmine.SpyObj<UserService>;
  });

  it('should return a loadUsersSuccess action on success', () => {
    const dummyUsers = [{ id: '1', name: 'Alice' }];
    const action = UserActions.loadUsers();
    const outcome = UserActions.loadUsersSuccess({ users: dummyUsers });

    actions$ = hot('-a', { a: action });
    const response = cold('-b|', { b: dummyUsers });
    userService.getUsers.and.returnValue(response);

    const expected = cold('--c', { c: outcome });
    expect(effects.loadUsers$).toBeObservable(expected);
  });

  it('should return a loadUsersFailure action on error', () => {
    const error = 'Error loading users';
    const action = UserActions.loadUsers();
    const outcome = UserActions.loadUsersFailure({ error });

    actions$ = hot('-a', { a: action });
    const response = cold('-#|', {}, error);
    userService.getUsers.and.returnValue(response);

    const expected = cold('--c', { c: outcome });
    expect(effects.loadUsers$).toBeObservable(expected);
  });
}); 
```
Note: Marble testing uses string diagrams to simulate time. Operators like hot() and cold() come from libraries such as jasmine-marbles.

**4. Testing Facade Services
The Facade Pattern**
Facades abstract store interactions, making components simpler. Testing facades involves verifying that they dispatch the correct actions and select the correct pieces of state.

Example:
```typescript
// user.facade.spec.ts
import { TestBed } from '@angular/core/testing';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { UserFacade } from './user.facade';
import * as UserActions from '../actions/user.actions';
import { AppState } from '../app.state';

describe('UserFacade', () => {
  let facade: UserFacade;
  let store: MockStore<AppState>;
  const initialState = { users: { users: [], loading: false, selectedUserId: null } };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UserFacade, provideMockStore({ initialState })]
    });
    facade = TestBed.inject(UserFacade);
    store = TestBed.inject(MockStore);
  });

  it('should dispatch loadUsers action', () => {
    spyOn(store, 'dispatch');
    facade.loadUsers();
    expect(store.dispatch).toHaveBeenCalledWith(UserActions.loadUsers());
  }); 
});
```