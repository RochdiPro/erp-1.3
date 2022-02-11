import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulletinPaieComponent } from './bulletin-paie.component';

describe('BulletinPaieComponent', () => {
  let component: BulletinPaieComponent;
  let fixture: ComponentFixture<BulletinPaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BulletinPaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BulletinPaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
