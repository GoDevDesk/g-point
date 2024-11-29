import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PersonalPhotosComponent } from './personal-photos.component';

describe('PersonalPhotosComponent', () => {
  let component: PersonalPhotosComponent;
  let fixture: ComponentFixture<PersonalPhotosComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PersonalPhotosComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PersonalPhotosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
