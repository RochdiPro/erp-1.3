import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerLocalComponent } from './lister-local.component';

describe('ListerLocalComponent', () => {
  let component: ListerLocalComponent;
  let fixture: ComponentFixture<ListerLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
