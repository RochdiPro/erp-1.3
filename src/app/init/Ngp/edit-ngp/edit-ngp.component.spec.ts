import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditNgpComponent } from './edit-ngp.component';

describe('EditNgpComponent', () => {
  let component: EditNgpComponent;
  let fixture: ComponentFixture<EditNgpComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EditNgpComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditNgpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
