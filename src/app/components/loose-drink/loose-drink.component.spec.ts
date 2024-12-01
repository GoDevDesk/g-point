import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LooseDrinkComponent } from './loose-drink.component';

describe('LooseDrinkComponent', () => {
  let component: LooseDrinkComponent;
  let fixture: ComponentFixture<LooseDrinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LooseDrinkComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LooseDrinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
