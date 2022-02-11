import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierLocalComponent } from './modifier-local.component';

describe('ModifierLocalComponent', () => {
  let component: ModifierLocalComponent;
  let fixture: ComponentFixture<ModifierLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
