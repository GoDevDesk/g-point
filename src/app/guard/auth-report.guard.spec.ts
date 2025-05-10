import { TestBed } from '@angular/core/testing';

import { AuthReportGuard } from './auth-report.guard';

describe('AuthReportGuard', () => {
  let guard: AuthReportGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(AuthReportGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
