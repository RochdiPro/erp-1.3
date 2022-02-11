import { Component, OnInit } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalService } from '../init/local/Service/local.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {
nom:any;acces:any;vente:number;achat:number;tms:number;wms:number;config:number;rh:number
  constructor( ) {   
    this.nom = sessionStorage.getItem('Utilisateur'); 
    this.acces = sessionStorage.getItem('Acces'); 
    const numToSeparate = this.acces;
    const arrayOfDigits = Array.from(String(numToSeparate), Number);              
    this.vente = Number( arrayOfDigits[1])
    this.achat = Number( arrayOfDigits[2])
    this.tms = Number( arrayOfDigits[3])
    this.wms = Number( arrayOfDigits[4])
    this.config = Number( arrayOfDigits[5])
    this.rh = Number( arrayOfDigits[6])   
   }

  ngOnInit(): void {
   
  }

}
