import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ToolbarFooterComponent } from './toolbar-footer.component';

describe('ToolbarFooterComponent', () => {
  let component: ToolbarFooterComponent;
  let fixture: ComponentFixture<ToolbarFooterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ToolbarFooterComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ToolbarFooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
