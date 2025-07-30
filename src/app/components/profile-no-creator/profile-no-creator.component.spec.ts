import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProfileNoCreatorComponent } from './profile-no-creator.component';

describe('ProfileNoCreatorComponent', () => {
  let component: ProfileNoCreatorComponent;
  let fixture: ComponentFixture<ProfileNoCreatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProfileNoCreatorComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProfileNoCreatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
