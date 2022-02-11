import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerngpComponent } from './listerngp.component';

describe('ListerngpComponent', () => {
  let component: ListerngpComponent;
  let fixture: ComponentFixture<ListerngpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerngpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerngpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
