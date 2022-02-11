import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListerFournisseurComponent } from './lister-fournisseur.component';

describe('ListerFournisseurComponent', () => {
  let component: ListerFournisseurComponent;
  let fixture: ComponentFixture<ListerFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListerFournisseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListerFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
