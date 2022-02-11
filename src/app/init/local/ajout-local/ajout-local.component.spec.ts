import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutLocalComponent } from './ajout-local.component';

describe('AjoutLocalComponent', () => {
  let component: AjoutLocalComponent;
  let fixture: ComponentFixture<AjoutLocalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutLocalComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutLocalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
