import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-fournisseur',
  templateUrl: './fournisseur.component.html',
  styleUrls: ['./fournisseur.component.scss']
})
export class FournisseurComponent implements OnInit {

  constructor() { }

  option1:any=false;
  option2:any=false;
  ngOnInit(): void {
  }
  fnoption1(){
    this.option1=true;
    this.option2=false
 }fnoption2(){
  this.option2=true;
  this.option1=false
 }

}
