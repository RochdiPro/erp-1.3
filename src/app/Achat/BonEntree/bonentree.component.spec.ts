import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonentreeComponent } from './bonentree.component';

describe('BonentreeComponent', () => {
  let component: BonentreeComponent;
  let fixture: ComponentFixture<BonentreeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BonentreeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BonentreeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
