import { TestBed } from '@angular/core/testing';

import { AuthProfileGuard } from './auth-profile.guard';

describe('AuthProfileGuard', () => {
  let guard: AuthProfileGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthProfileGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
