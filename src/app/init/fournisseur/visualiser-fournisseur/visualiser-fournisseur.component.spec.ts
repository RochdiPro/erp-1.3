import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VisualiserFournisseurComponent } from './visualiser-fournisseur.component';

describe('VisualiserFournisseurComponent', () => {
  let component: VisualiserFournisseurComponent;
  let fixture: ComponentFixture<VisualiserFournisseurComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ VisualiserFournisseurComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(VisualiserFournisseurComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
