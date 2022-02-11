import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanSimpleComponent } from './plan-simple.component';
import { fabric } from 'fabric';

describe('PlanSimpleComponent', () => {
  let component: PlanSimpleComponent;
  let fixture: ComponentFixture<PlanSimpleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlanSimpleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlanSimpleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


 