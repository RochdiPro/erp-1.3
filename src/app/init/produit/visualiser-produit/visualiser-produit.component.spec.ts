import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserProduitComponent } from './visualiser-produit.component';

describe('VisualiserProduitComponent', () => {
  let component: VisualiserProduitComponent;
  let fixture: ComponentFixture<VisualiserProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualiserProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
