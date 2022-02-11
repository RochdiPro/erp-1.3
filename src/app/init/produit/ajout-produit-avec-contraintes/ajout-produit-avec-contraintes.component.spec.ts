import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutProduitAvecContraintesComponent } from './ajout-produit-avec-contraintes.component';

describe('AjoutProduitAvecContraintesComponent', () => {
  let component: AjoutProduitAvecContraintesComponent;
  let fixture: ComponentFixture<AjoutProduitAvecContraintesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutProduitAvecContraintesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutProduitAvecContraintesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
