import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialogue',
  templateUrl: './dialogue.component.html',
  styleUrls: ['./dialogue.component.scss']
})
export class DialogueComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}


//ajouter hall 
@Component({
  selector: 'ajouter-hall',
  templateUrl: 'ajouter-hall.html',
})
export class ajouter_hall {
  obj: any
  constructor(public dialogRef: MatDialogRef<ajouter_hall>, @Inject(MAT_DIALOG_DATA) public data: any,) {
    this.obj = data.obj
    this.obj.couleur = "#e66465"

  }

  Ajouter() {   
    
    this.dialogRef.close();
  }
  close() {
    this.dialogRef.close();
  }

  getx(ev: any) {
    this.obj.x = ev.target.value
  }
  gety(ev: any) {
    this.obj.y = ev.target.value
  }
  getl(ev: any) {
    this.obj.l = ev.target.value
  }
  getp(ev: any) {
    this.obj.p = ev.target.value
  }
  getcouleur(ev: any) {
     
    this.obj.couleur = ev.target.value
  }
  gettitre(ev: any) {

    this.obj.titre = ev.target.value
    
  }


}