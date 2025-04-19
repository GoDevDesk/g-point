import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreatePlanModalComponent } from './create-plan-modal.component';

describe('CreatePlanModalComponent', () => {
  let component: CreatePlanModalComponent;
  let fixture: ComponentFixture<CreatePlanModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreatePlanModalComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CreatePlanModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
