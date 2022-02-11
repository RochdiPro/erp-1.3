import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierCongeComponent } from './modifier-conge.component';

describe('ModifierCongeComponent', () => {
  let component: ModifierCongeComponent;
  let fixture: ComponentFixture<ModifierCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierCongeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
