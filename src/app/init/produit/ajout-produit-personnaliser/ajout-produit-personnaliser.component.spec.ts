import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutProduitPersonnaliserComponent } from './ajout-produit-personnaliser.component';

describe('AjoutProduitPersonnaliserComponent', () => {
  let component: AjoutProduitPersonnaliserComponent;
  let fixture: ComponentFixture<AjoutProduitPersonnaliserComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutProduitPersonnaliserComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutProduitPersonnaliserComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
