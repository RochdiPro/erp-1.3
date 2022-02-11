import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgpComponent } from './ngp.component';

describe('NgpComponent', () => {
  let component: NgpComponent;
  let fixture: ComponentFixture<NgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
