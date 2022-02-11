import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModifierBulletinPaieComponent } from './modifier-bulletin-paie.component';

describe('ModifierBulletinPaieComponent', () => {
  let component: ModifierBulletinPaieComponent;
  let fixture: ComponentFixture<ModifierBulletinPaieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModifierBulletinPaieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModifierBulletinPaieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
