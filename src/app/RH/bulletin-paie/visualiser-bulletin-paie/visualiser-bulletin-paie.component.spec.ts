import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserBulletinPaieComponent } from './visualiser-bulletin-paie.component';

describe('VisualiserBulletinPaieComponent', () => {
  let component: VisualiserBulletinPaieComponent;
  let fixture: ComponentFixture<VisualiserBulletinPaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualiserBulletinPaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserBulletinPaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
