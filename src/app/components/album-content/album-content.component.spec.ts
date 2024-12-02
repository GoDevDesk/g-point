import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlbumContentComponent } from './album-content.component';

describe('AlbumContentComponent', () => {
  let component: AlbumContentComponent;
  let fixture: ComponentFixture<AlbumContentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlbumContentComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlbumContentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
