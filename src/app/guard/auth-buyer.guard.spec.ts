import { TestBed } from '@angular/core/testing';

import { AuthBuyerGuard } from './auth-buyer.guard';

describe('AuthBuyerGuard', () => {
  let guard: AuthBuyerGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthBuyerGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
