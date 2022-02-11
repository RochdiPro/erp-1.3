import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutBulletinPaieComponent } from './ajout-bulletin-paie.component';

describe('AjoutBulletinPaieComponent', () => {
  let component: AjoutBulletinPaieComponent;
  let fixture: ComponentFixture<AjoutBulletinPaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutBulletinPaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutBulletinPaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
