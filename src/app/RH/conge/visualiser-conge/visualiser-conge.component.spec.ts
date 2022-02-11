import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserCongeComponent } from './visualiser-conge.component';

describe('VisualiserCongeComponent', () => {
  let component: VisualiserCongeComponent;
  let fixture: ComponentFixture<VisualiserCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualiserCongeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
