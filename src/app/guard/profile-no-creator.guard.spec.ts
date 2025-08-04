import { TestBed } from '@angular/core/testing';

import { ProfileNoCreatorGuard } from './profile-no-creator.guard';

describe('ProfileNoCreatorGuard', () => {
  let guard: ProfileNoCreatorGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(ProfileNoCreatorGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
