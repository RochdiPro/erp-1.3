import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BonEntreeService } from 'src/app/achat/bonentree/Service/bon-entree.service';
 import Swal from 'sweetalert2';
 import { DatePipe } from '@angular/common';
 import {   Output, ViewChild } from '@angular/core';
 import { FormBuilder, FormGroup } from '@angular/forms';
  import { Console } from 'console';
import { BonCommandeService } from '../../Service/bon-commande.service';
@Component({
  selector: 'app-dialogue-commande',
  templateUrl: './dialogue-commande.component.html',
  styleUrls: ['./dialogue-commande.component.scss']
})
export class DialogueCommandeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }
}
  // component dialogue ajouter article
@Component({
  selector: 'dialog-ajouter-article_bc',
  templateUrl: './dialog-ajouter-article_bc.html',
})
export class AjouterArticles_bcComponent implements OnInit {
  keyWord: any = [];
  prouduits: any = [];
  fromPage: any;
  prodChecked: any = [];
  dsiable: boolean = true;
  Quantite: any = 1;
  line: any = {}
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  newAttribute: any = {}
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  Montant_Fodec: any = 0;
  Total_HT: any = 0;
  Ch_Globale: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  Montant_TVA: any = 0;
  dataArticle: any;
  loading: boolean = true;
  prodInStock: any = [];
  champ: string = "Sélectionnez votre option";
  value: any;
  searchFilter: any = '';
  query: any;
  id: any = "";
  nom: any = "";
  prix: any;
  local: any;


  constructor(public Service: BonEntreeService,public boncommandeservice:BonCommandeService, public dialogRef: MatDialogRef<AjouterArticles_bcComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data;

    this.Service.Produits().subscribe((data) => {
      this.prouduits = data
      this.loading = false
    })
  }

  ngOnInit(): void {

  }

  filtre() {

    this.Service.filtre_produit_id_nom(this.id, this.nom).subscribe((data) => {
      this.prouduits = data
    })
  }


  // changer le prix de produit
  changeprix(item: any, event: any) {
    item.prix = event.target.value;
  }
  // changer le remise 
  changeremise(item: any, event: any) {
    item.remise = event.target.value;
  }

  // changer le quantite 
  changerqte(item: any, event: any) { 
    item.qte = event.target.value;
  }

  //** choix produit */
  checkCheckBoxvalue(event: any, prod: any) {
    if (event.target.checked) {
      this.dsiable = false;
      prod.prix = 0
      prod.remise = 0
      prod.qte = 1
      prod.ref_fr =""
       this.boncommandeservice.Ref_FR_Article(prod.id_Produit).subscribe((data:any)=>{
        if(data)
        {
           prod.prix=data.ancien_Prix
           prod.ref_fr=data.ref_Fr
           this.prodChecked.push(prod);
        }
        else{
          this.prodChecked.push(prod);
        }
      })
    }
    else {
      prod.prix = ""
      prod.remise = ""
      prod.qte = ""
      this.prodChecked = this.prodChecked.filter((value: any) => {
        return value.id_Produit != prod.id_Produit;
      });
    }
  }


  sendProd() {

    let test = 1;
    for (let i = 0; i < this.prodChecked.length; i++) {
      if (this.prodChecked[i].prix < 1 || this.prodChecked[i].qte < 1 || this.prodChecked[i].remise < 0) {
        test = 0
      }
    }
    if (test == 1) {

      this.dialogRef.close({ event: 'close', data: this.prodChecked });
      this.dialogRef.afterClosed().subscribe(result => {
        this.fromPage = result;
      });
      this.prodChecked = [];
    } else {
      Swal.fire(
        'Attention!  ',
        'Prix && Quantite ',
        'error'
      )
    }
  }
}

 
