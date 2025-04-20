import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchaseSuscriptionComponent } from './purchase-suscription.component';

describe('PurchaseSuscriptionComponent', () => {
  let component: PurchaseSuscriptionComponent;
  let fixture: ComponentFixture<PurchaseSuscriptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PurchaseSuscriptionComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PurchaseSuscriptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
