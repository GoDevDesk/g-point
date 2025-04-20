import { TestBed } from '@angular/core/testing';

import { AuthPurchaseSuscriptionGuard } from './auth-purchase-suscription.guard';

describe('AuthPurchaseSuscriptionGuard', () => {
  let guard: AuthPurchaseSuscriptionGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthPurchaseSuscriptionGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
