import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerCongeComponent } from './lister-conge.component';

describe('ListerCongeComponent', () => {
  let component: ListerCongeComponent;
  let fixture: ComponentFixture<ListerCongeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerCongeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerCongeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
