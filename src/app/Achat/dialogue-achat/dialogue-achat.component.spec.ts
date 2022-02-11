import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DialogueAchatComponent } from './dialogue-achat.component';

describe('DialogueAchatComponent', () => {
  let component: DialogueAchatComponent;
  let fixture: ComponentFixture<DialogueAchatComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DialogueAchatComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DialogueAchatComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
