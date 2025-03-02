import { TestBed } from '@angular/core/testing';

import { PersonalPhotosService } from './personal-photos.service';

describe('PersonalPhotosService', () => {
  let service: PersonalPhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PersonalPhotosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
