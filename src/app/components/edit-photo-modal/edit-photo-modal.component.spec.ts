import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPhotoModalComponent } from './edit-photo-modal.component';

describe('EditPhotoModalComponent', () => {
  let component: EditPhotoModalComponent;
  let fixture: ComponentFixture<EditPhotoModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditPhotoModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditPhotoModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
