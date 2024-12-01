import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MensualSuscriptionComponent } from './mensual-suscription.component';

describe('MensualSuscriptionComponent', () => {
  let component: MensualSuscriptionComponent;
  let fixture: ComponentFixture<MensualSuscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MensualSuscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MensualSuscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
