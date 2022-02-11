import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AjoutProduitStandardComponent } from './ajout-produit-standard.component';

describe('AjoutProduitStandardComponent', () => {
  let component: AjoutProduitStandardComponent;
  let fixture: ComponentFixture<AjoutProduitStandardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AjoutProduitStandardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AjoutProduitStandardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
