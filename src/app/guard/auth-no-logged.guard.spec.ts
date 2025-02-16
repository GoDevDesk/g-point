import { TestBed } from '@angular/core/testing';

import { AuthNoLoggedGuard } from './auth-no-logged.guard';

describe('AuthNoLoggedGuard', () => {
  let guard: AuthNoLoggedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthNoLoggedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
