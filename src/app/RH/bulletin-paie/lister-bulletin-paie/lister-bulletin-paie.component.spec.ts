import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerBulletinPaieComponent } from './lister-bulletin-paie.component';

describe('ListerBulletinPaieComponent', () => {
  let component: ListerBulletinPaieComponent;
  let fixture: ComponentFixture<ListerBulletinPaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerBulletinPaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerBulletinPaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
