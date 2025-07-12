import { TestBed } from '@angular/core/testing';

import { BlockedUsersService } from './blocked-users.service';

describe('BlockedUsersService', () => {
  let service: BlockedUsersService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BlockedUsersService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
