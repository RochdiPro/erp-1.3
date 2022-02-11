import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserLocalComponent } from './visualiser-local.component';

describe('VisualiserLocalComponent', () => {
  let component: VisualiserLocalComponent;
  let fixture: ComponentFixture<VisualiserLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualiserLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
