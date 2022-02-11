import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutCongeComponent } from './ajout-conge.component';

describe('AjoutCongeComponent', () => {
  let component: AjoutCongeComponent;
  let fixture: ComponentFixture<AjoutCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutCongeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
