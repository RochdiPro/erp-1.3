import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MethodeProduitComponent } from './methode-produit.component';

describe('MethodeProduitComponent', () => {
  let component: MethodeProduitComponent;
  let fixture: ComponentFixture<MethodeProduitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MethodeProduitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MethodeProduitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
