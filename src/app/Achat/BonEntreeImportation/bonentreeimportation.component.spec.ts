import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonentreeimportationComponent } from './bonentreeimportation.component';

describe('BonentreeimportationComponent', () => {
  let component: BonentreeimportationComponent;
  let fixture: ComponentFixture<BonentreeimportationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonentreeimportationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonentreeimportationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
