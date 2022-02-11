import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueCommandeComponent } from './dialogue-commande.component';

describe('DialogueCommandeComponent', () => {
  let component: DialogueCommandeComponent;
  let fixture: ComponentFixture<DialogueCommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogueCommandeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueCommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
