import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Console } from 'console';

import Swal from 'sweetalert2';
import { BonEntreeService } from '../bonentree/Service/bon-entree.service';
//import { BonEntreeImportationServiceService } from '../BonEntreeImportation/Services/bon-entree-importation-service.service';
 
@Component({
  selector: 'app-dialogue-achat',
  templateUrl: './dialogue-achat.component.html',
  styleUrls: ['./dialogue-achat.component.scss']
})
export class DialogueAchatComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

//component dialogue en cas type produit 4g
@Component({
  selector: 'dialog-4g-modif-bon-entree-local',
  templateUrl: 'dialog-4g-modif-bon-entree-local.html',
})
export class Dialog4gModifBonEntreeLocal {
  nbrQte: any = [];
  txtValue: string = '';
  message: string = '';
  Numero_Serie: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: any = "";
  data4: any = "";
  data5: any = "";
  data4Gs: any = "";
  dataSeries: any = "";
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any = [];
  E1Stocke: any = [];
  E2Stocke: any = [];
  id: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  tableNserie: any = [];
  QuantiteArticle: any;
  verifStock: boolean = false;
  verifProduitStock: any = [];
  nom: any;
  tableConcat1: any = [];
  tableConcat2: any = [];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<Dialog4gModifBonEntreeLocal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.qte;
    dialogRef.disableClose = true;
    this.Detail_Produit();
    this.tableNserie = data.tablenumero;
    this.E1 = data.tableE1;
    this.E2 = data.tableE2;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //Vérifier si entrée stock accompli ou non
  VerifVide() {
    for (let i = 0; i < this.ligne_table.qte; i++) {
      if (this.Numero_Serie[i] == '' || this.Numero_Serie[i] == undefined) {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      else {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      this.dialogRef.close();
    }
    //  this.EntreeXml();
  }

  //Vérifier si produit en stock ou non.Si oui lire ses détails.
  Detail_Produit() {
    let N_SerieStocke: any = [];
    let E1Stocke: any = [];
    let E2Stocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].id).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].type == "4G") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].id).subscribe((detail: any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                this.DetailProduit = reader.result;
                var parseString = require('xml2js').parseString;
                parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
                  for (let k = 0; k < result.Produits.Produit_4G.length; k++) {
                    N_SerieStocke.push(result.Produits.Produit_4G[k].N_Serie.toString());
                    E1Stocke.push(result.Produits.Produit_4G[k].E1.toString());
                    E2Stocke.push(result.Produits.Produit_4G[k].E2.toString());
                  }
                })
                this.N_SerieStocke = N_SerieStocke;
                this.E1Stocke = E1Stocke;
                this.E2Stocke = E2Stocke;
              }
              reader.readAsDataURL(detail);
            })
          }
        }
      })
    }
  }
  //Vérifier si numéro série existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifN_serieProduit(event: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie();
    this.ElimineRedondance();
  }
  //Vérifier si numéro série saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.Numero_Serie.length; i++) {
      for (let j = i + 1; j < this.Numero_Serie.length; j++) {
        if (this.Numero_Serie[i] == this.Numero_Serie[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro IMEI1 existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifE1Produit(event: any) {
    const found = this.E1Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 1 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE1();
    this.ElimineRedondance();
  }
  //Vérifier si numéro IMEI1 saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceE1() {
    for (let i = 0; i < this.E1.length; i++) {
      for (let j = i + 1; j < this.E1.length; j++) {
        if (this.E1[i] == this.E1[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          else { }
          Swal.fire("Attention! Numéro IMEI 1 déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro IMEI2 existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation    
  verifE2Produit(event: any) {
    const found = this.E2Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 2 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE2();
    this.ElimineRedondance();
  }
  //Vérifier si numéro IMEI2 saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceE2() {
    for (let i = 0; i < this.E2.length; i++) {
      for (let j = i + 1; j < this.E2.length; j++) {
        if (this.E2[i] == this.E2[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro IMEI 2 déjà saisi.")
        }
      }
    }
  }
  //Vérifier si numéro saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondance() {
    this.tableConcat1 = this.E1.concat(this.E2);
    this.tableConcat2 = this.tableConcat1.concat(this.tableNserie)
    for (let i = 0; i < this.tableConcat2.length; i++) {
      if (this.tableConcat2[i] == "") {
        this.tableConcat2.splice(i, 1);
      } else { }
      for (let j = i + 1; j < this.tableConcat2.length; j++) {
        if (this.tableConcat2[i] == this.tableConcat2[j] && this.tableConcat2[i] != "") {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro déjà saisi.")
        }
      }
    }
  }
}
//component dialogue en cas type produit série
@Component({
  selector: 'dialog-serie-modif-bon-entree-local',
  templateUrl: 'dialog-serie-modif-bon-entree-local.html',
})
export class DialogSerieModifBonEntreeLocal {
  nbrQte: any = [];
  Numero_SerieS: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: string = '';
  data4: any = '';
  data5: any = [];
  data4Gs: any = '';
  dataSeries: any = [];
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any;
  verifProduitStock: any = [];
  id: any;
  nom: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  tableNserie: any = [];
  verifStock: boolean = false;
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogSerieModifBonEntreeLocal>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.tableNserie = data.tableNserie;
    this.nbrQte.length = data.ligne_tableau.qte;
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }

  //Vérifier si entrée stock accompli ou non
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_SerieS[i] != '') {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      else if (this.Numero_SerieS[i] == 'undefined') {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      this.dialogRef.close();
    }

  }
  //Vérifier si produit en stock ou non.Si oui lire ses détails.
  Detail_Produit() {
    let N_SerieStocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].id).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].type === "Serie") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].id).subscribe((detail: any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                this.DetailProduit = reader.result;
                var parseString = require('xml2js').parseString;
                parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
                  for (let k = 0; k < result.Produits.N_Serie.length; k++) {
                    N_SerieStocke.push(result.Produits.N_Serie[k].Numero.toString());
                  }
                })
                this.N_SerieStocke = N_SerieStocke;
              }
              reader.readAsDataURL(detail);
            })
          }
        }
      })
    }
  }
  //Vérifier si numéro série existe déjà en stock ou non.Si oui afficher une alerte et bloquer la validation 
  verifN_serieProduit(event: any, index: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie()
  }
  //Vérifier si numéro série saisi déjà ou non.Si oui afficher une alerte et bloquer la validation 
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.tableNserie.length; i++) {
      for (let j = i + 1; j < this.tableNserie.length; j++) {
        if (this.tableNserie[i] == this.tableNserie[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
}



//component dialogue modifier article
@Component({
  selector: 'dialog-overview-article-dialog',
  templateUrl: 'dialog-overview-article-dialog.html',
})
export class DialogOverviewArticleDialog {
  ligne_table: any;
  index_ligne_table: any;
  verif: boolean = false;
  table: any;
  Montant_TVA: any = 0;
  Montant_Fodec: any = 0;
  //test modifier article 
  form_modifier_article: any = FormGroup;
  // test modifier sans confirmer
  form_article: any = FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewArticleDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {



    this.ligne_table = data.ligne_tableau;
    this.index_ligne_table = data.index;
    this.table = data.table;
    // en cas de click sur fermer sans enregistrement on utilise cette formulaire pour garder les valeurs initiaux
    this.form_article = this.fb.group({
      qte_modifier: [this.ligne_table.Quantite],
      prixU_modifier: [this.ligne_table.PrixU],
      remise_modifier: [this.ligne_table.Remise],
      Fodec: [this.ligne_table.Fodec],
      Tva: [this.ligne_table.Tva],
      Ref_FR: [this.ligne_table.Ref_FR],
      Nom_Produit: [this.ligne_table.Nom_Produit],
      Id_Produit: [this.ligne_table.Id_Produit],
    });
    //pour modification
    this.form_modifier_article = this.fb.group({
      qte_modifier: [this.ligne_table.Quantite],
      prixU_modifier: [this.ligne_table.PrixU],
      remise_modifier: [this.ligne_table.Remise],
      Fodec: [{ value: this.ligne_table.Fodec, disabled: true }],
      Tva: [{ value: this.ligne_table.Tva, disabled: true }],
      Ref_FR: [{ value: this.ligne_table.Ref_FR, disabled: true }],
      Nom_Produit: [{ value: this.ligne_table.Nom_Produit, disabled: true }],
      Id_Produit: [{ value: this.ligne_table.Id_Produit, disabled: true }],
    });
    dialogRef.disableClose = true;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //modifier article
  editerLigneTable() {

    let test = 1;
    if (Number(this.form_modifier_article.get('prixU_modifier').value) < 0.001 || Number(this.form_modifier_article.get('qte_modifier').value) < 1) {
      test = 0
    }
    if (test == 1) {
      this.dialogRef.close(this.form_modifier_article.value);
      this.Montant_Fodec = (this.ligne_table.Montant_HT * this.ligne_table.Fodec) / 100;
      this.ligne_table.Montant_Fodec = Number(this.Montant_Fodec);
      (Number(this.ligne_table.Montant_HT)).toFixed(3);
      this.Montant_TVA = ((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec)) * this.ligne_table.Tva) / 100;
      this.ligne_table.Montant_TVA = Number(this.Montant_TVA);
      this.ligne_table.Prix_U_TTC = (((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec) + Number(this.ligne_table.Montant_TVA))) / Number(this.ligne_table.Quantite)).toFixed(3);
      this.ligne_table.Total_TVA = (Number(this.ligne_table.Montant_TVA)) / (Number(this.ligne_table.Quantite));
      this.ligne_table.Montant_TTC = Number(this.ligne_table.Prix_U_TTC) * Number(this.ligne_table.Quantite);
      this.ligne_table.Ch = ((((Number(this.ligne_table.PrixU)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.ligne_table.Quantite)).toFixed(3);
      this.ligne_table.Ch_Piece = (((((Number(this.ligne_table.ChargeTr) + Number(this.ligne_table.AutreCharge)) * Number(this.ligne_table.Ch)) / 100)) / (Number(this.ligne_table.Quantite))).toFixed(3);
      this.ligne_table.PrixRevientU = (Number(this.ligne_table.PrixU) + Number(this.ligne_table.Ch_Piece)).toFixed(3);
    } else {
      Swal.fire(
        'Attention!  ',
        'Prix && Quantite ',
        'error'
      )
    }

  }
  //calculer charge
  calculCharge(event: any) {
    this.ligne_table.Ch = ((((Number(this.ligne_table.PrixU)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.ligne_table.Quantite)).toFixed(3);
  }
}


@Component({
  selector: 'dialog-overview-charge-dialog',
  templateUrl: 'dialog-overview-charge-dialog.html',
})
export class DialogOverviewChargeDialog {
  ligne_table: any;
  index_ligne_table: any;
  verif: any;
  table: any;
  Montant_TVA: any = 0;
  Montant_Fodec: any = 0;
  //test modifier charge
  form_modifier_charge: any = FormGroup;
  // test modifier sans confirmer
  form_charge: any = FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewChargeDialog>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.index_ligne_table = data.index;
    this.table = data.table;
    // en cas de click sur fermer sans enregistrement on utilise cette formulaire pour garder les valeurs initiaux
    this.form_charge = this.fb.group({
      qte_modifier_ch: [this.ligne_table.Quantite],
      prixU_modifier_ch: [this.ligne_table.PrixU],
      remise_modifier_ch: [this.ligne_table.Remise],
      Fodec: [this.ligne_table.Fodec],
      Tva: [this.ligne_table.Tva],
      Ref_FR: [this.ligne_table.Ref_FR],
      Nom_Produit: [this.ligne_table.Nom_Produit],
      Id_Produit: [this.ligne_table.Id_Produit],
      Ch_modifier: [this.ligne_table.Ch]
    });
    //pour modification
    this.form_modifier_charge = this.fb.group({
      qte_modifier_ch: [this.ligne_table.Quantite],
      prixU_modifier_ch: [this.ligne_table.PrixU],
      remise_modifier_ch: [this.ligne_table.Remise],
      Fodec: [{ value: this.ligne_table.Fodec, disabled: true }],
      Tva: [{ value: this.ligne_table.Tva, disabled: true }],
      Ref_FR: [{ value: this.ligne_table.Ref_FR, disabled: true }],
      Nom_Produit: [{ value: this.ligne_table.Nom_Produit, disabled: true }],
      Id_Produit: [{ value: this.ligne_table.Id_Produit, disabled: true }],
      Ch_modifier: [this.ligne_table.Ch]
    });
    dialogRef.disableClose = true;

  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //modifier article
  editerLigneTable() {

    let test = 1;
    if (Number(this.form_charge.get('Ch_modifier').value) < 0  ) {
      test = 0
    }
    if (test == 1) {
    this.dialogRef.close(this.form_modifier_charge.value);
    this.ligne_table.Montant_HT = ((Number(this.ligne_table.PrixU) * Number(this.ligne_table.Quantite)) * (1 - (Number(this.ligne_table.Remise)) / 100)).toFixed(3);
    this.Montant_Fodec = (this.ligne_table.Montant_HT * this.ligne_table.Fodec) / 100;
    this.ligne_table.Montant_Fodec = Number(this.Montant_Fodec);
    this.Montant_TVA = ((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec)) * this.ligne_table.Tva) / 100;
    this.ligne_table.Montant_TVA = Number(this.Montant_TVA);
    this.ligne_table.Prix_U_TTC = (((Number(this.ligne_table.Montant_HT) + Number(this.ligne_table.Montant_Fodec) + Number(this.ligne_table.Montant_TVA))) / Number(this.ligne_table.Quantite)).toFixed(3);
    this.ligne_table.Total_TVA = (Number(this.ligne_table.Montant_TVA)) / (Number(this.ligne_table.Quantite));
    this.ligne_table.Montant_TTC = Number(this.ligne_table.Prix_U_TTC) * Number(this.ligne_table.Quantite);
    this.ligne_table.Ch_Piece = (((((Number(this.ligne_table.ChargeTr) + Number(this.ligne_table.AutreCharge)) * Number(this.ligne_table.Ch)) / 100)) / (Number(this.ligne_table.Quantite))).toFixed(3);
    this.ligne_table.PrixRevientU = (Number(this.ligne_table.PrixU) + Number(this.ligne_table.Ch_Piece)).toFixed(3);
    this.verifierCharge(event); 
  } else {
    Swal.fire(
      'Attention!  ',
      'Prix && Quantite ',
      'error'
    )
  }
}
  //calculer charge
  calculCharge(event: any) {
    this.form_modifier_charge.controls['Ch_modifier'].setValue(((((Number(this.form_modifier_charge.controls['prixU_modifier_ch'].value)) / Number(this.ligne_table.TotalFacture)) * 100) * Number(this.form_modifier_charge.controls['qte_modifier_ch'].value)));
  }
  // calcul charge automatique des autres articles
  chargeValue(event: any) {
    let table: number[] = [];
    for (let i = 0; i < this.table.length; i++) {
      if (i != this.index_ligne_table) {
        table.push(i);
      }
    }
    for (let j of table) {
      this.table[j].Ch = (Number(this.table[j].PrixU) / (Number(this.ligne_table.TotalFacture) - Number(this.table[this.index_ligne_table].PrixU * Number(this.table[this.index_ligne_table].Quantite))) * Number(this.table[j].Quantite) * (100 - this.table[this.index_ligne_table].Ch)).toFixed(3);
      this.table[j].Ch_Piece = (((((Number(this.table[j].ChargeTr) + Number(this.table[j].AutreCharge)) * Number(this.table[j].Ch)) / 100)) / (Number(this.table[j].Quantite))).toFixed(3);
    }
  }
  //verifier pourcentage charge
  verifierCharge(event: any) {
    let total1 = 0;
    this.verif = this.table.verifCh;
    for (let i = 0; i < this.table.length; i++) {
      total1 += Number(this.table[i].Ch);
      if (total1 != 100.000 || event.target.value > 100.000 || total1 != 100) {
        this.table.verifCh = true;
        Swal.fire({
          title: "Mettre à jour automatiquement la charge d'autres articles ?",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, les mettre à jour?',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {
            this.chargeValue(event);
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
          }
        })
      }
      else {
        this.table.verifCh = false;
      }
    }
    this.verif = this.table.verifCh;
  }
}
//component dialogue en cas type produit simple
@Component({
  selector: 'dialog-overview-simple-dialog',
  templateUrl: 'dialog-overview-simple-dialog.html',
})
export class DialogOverviewSimpleDialog {
  nbrQte: any = [];
  Numero_SerieS: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: any = "";
  data4: any = "";
  data5: any = "";
  data4Gs: any = "";
  dataSeries: any = "";
  typeProduit: any;
  showStyle: boolean;
  quantiteSimple: any;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewSimpleDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    //this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //verifier si entree accompli ou non 
  VerifVide() {
    this.quantiteSimple = document.getElementById("quantiteSimple");
    if (this.quantiteSimple.value == this.ligne_table.Quantite) {
      this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      this.fermerDialogue()
    }
    else {
      this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      this.fermerDialogue();
    }
  }
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

}
//component dialogue en cas type produit serie
@Component({
  selector: 'dialog-overview-serie-dialog',
  templateUrl: 'dialog-overview-serie-dialog.html',
})
export class DialogOverviewSerieDialog {

  nbrQte: any = [];
  Numero_SerieS: any = [''];
  E1: any = [''];
  E2: any = [''];
  ligne_table: any;
  table: any;
  data3: string = '';
  data4: any = '';
  data5: any = [];
  data4Gs: any = '';
  dataSeries: any = [];
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any;
  verifProduitStock: any = [];
  id: any;
  nom: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  verifStock: boolean = false;
  found3: any = [];
  found2: any = [];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogOverviewSerieDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
    for (let z = 0; z < this.ligne_table.detail.length; z++) {
      this.Numero_SerieS[z] = this.ligne_table.detail[z].ns
    }
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  //convertir blob en un fichier 
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  obj: any; detail = []
  EntreeXml() {
    this.detail = []
    this.obj = {}
    for (let i = 0; i < this.Numero_SerieS.length; i++) {
      this.obj = {};
      this.obj.ns = this.Numero_SerieS[i];
      this.detail.push(this.obj)
      console.log(this.detail)
    }
    this.ligne_table.detail = this.detail
  }

  //verifier si entree accompli ou non
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_SerieS[i] != '') {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      else if (this.Numero_SerieS[i] == 'undefined') {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      this.dialogRef.close();
    }
    this.EntreeXml();
  }
  //Récupérer détail d'un produit
  Detail_Produit() {
    let N_SerieStocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      this.bonEntreeService.ProduitEnStock(this.table[i].Id_Produit).subscribe((reponse: any) => {
        this.verifProduitStock[i] = reponse;
        if (this.table[i].N_Serie === "true") {
          if (reponse === 'oui') {
            this.bonEntreeService.Detail_Produit(this.table[i].Id_Produit).subscribe((detail: any) => {
              const reader = new FileReader();
              reader.onloadend = () => {
                this.DetailProduit = reader.result;
                var parseString = require('xml2js').parseString;
                parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
                  for (let k = 0; k < result.Produits.N_Serie.length; k++) {
                    N_SerieStocke.push(result.Produits.N_Serie[k].Numero.toString());
                  }
                })
                this.N_SerieStocke = N_SerieStocke;
              }
              reader.readAsDataURL(detail);
            })
          }
        }
      })
    }
  }
  //verifier si numero série saisi déjà ou non
  verifN_serieProduit(event: any, index: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie()
  }
  //verifier si numero saisi déjà ou non
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.Numero_SerieS.length; i++) {
      for (let j = i + 1; j < this.Numero_SerieS.length; j++) {
        if (this.Numero_SerieS[i] == this.Numero_SerieS[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
  csvContent: any
  onFileLoad(fileLoadedEvent: any) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(this.csvContent);
  }
  obj2: any = {}
  public Array: any = [];
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {

      let csvToRowArray = (fileReader.result + "").split("\n");
      for (let index = 1; index < csvToRowArray.length; index++) {
        this.obj2 = {}
        let row = csvToRowArray[index].split("\r");
        if (index - 1 < this.Numero_SerieS.length) {
          this.Numero_SerieS[index - 1] = row[0]
          this.Array.push(this.obj2);
        }

      }
    }

    fileReader.readAsText(file, "UTF-8");
    // this.check_qte()
  }
}
//component dialogue en cas type produit 4g
@Component({
  selector: 'dialog-overview-4g-dialog',
  templateUrl: 'dialog-overview-4g-dialog.html',
})
export class DialogOverview4gDialog {
  nbrQte: any = [];
  txtValue: string = '';
  message: string = '';
  Numero_Serie: any = [];
  E1: any = [];
  E2: any = [];
  ligne_table: any;
  table: any;
  data3: any = "";
  data4: any = "";
  data5: any = "";
  data4Gs: any = "";
  dataSeries: any = "";
  typeProduit: any;
  DetailProduit: any;
  N_SerieStocke: any = [];
  E1Stocke: any = [];
  E2Stocke: any = [];
  id: any;
  nom: any;
  signaler_probleme: any;
  Ref_FR: any;
  Quantite: any;
  PrixU: any;
  Remise: any;
  Fodec: any;
  Prix_U_TTC: any;
  PrixRevientU: any;
  Ch: any;
  Ch_Piece: any;
  Tva: any;
  indice: any;
  verifStock: boolean = false;
  tableConcat1: any = [];
  tableConcat2: any = [];
  constructor(public bonEntreeService: BonEntreeService,
    public dialogRef: MatDialogRef<DialogOverview4gDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    dialogRef.disableClose = true;
    if (this.ligne_table.detail.length == 0) {
      for (let z = 0; z < this.ligne_table.Quantite; z++) {
        this.Numero_Serie[z] = ""
        this.E1[z] = ""
        this.E2[z] = ""
      }

    }
    for (let z = 0; z < this.ligne_table.detail.length; z++) {
      this.Numero_Serie[z] = this.ligne_table.detail[z].ns
      this.E1[z] = this.ligne_table.detail[z].e1
      this.E2[z] = this.ligne_table.detail[z].e2
    }
    console.log(this.Numero_Serie)
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  VerifVide() {
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_Serie[i] == '' || this.Numero_Serie[i] == undefined) {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
      else {
        this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
      }
      this.dialogRef.close();
    }
    this.EntreeXml();
  }
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }
  //fichier xml entree
  obj: any; detail = []
  EntreeXml() {
    this.detail = []
    this.obj = {}
    for (let i = 0; i < this.Numero_Serie.length; i++) {
      this.obj = {};
      this.obj.ns = this.Numero_Serie[i];
      this.obj.e1 = this.E1[i];
      this.obj.e2 = this.E2[i]
      this.detail.push(this.obj)
    }
    this.ligne_table.detail = this.detail

  }
  //Récupérer détail d'un produit
  Detail_Produit() {
    let N_SerieStocke: any = [];
    let E1Stocke: any = [];
    let E2Stocke: any = [];
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].N_Imei == "true") {
        this.bonEntreeService.Detail_Produit(this.table[i].Id_Produit).subscribe((detail: any) => {
          const reader = new FileReader();
          reader.onloadend = () => {
            this.DetailProduit = reader.result;
            var parseString = require('xml2js').parseString;
            parseString(atob(this.DetailProduit.substr(28)), function (err: any, result: any) {
              for (let k = 0; k < result.Produits.Produit_4G.length; k++) {
                N_SerieStocke.push(result.Produits.Produit_4G[k].N_Serie.toString());
                E1Stocke.push(result.Produits.Produit_4G[k].E1.toString());
                E2Stocke.push(result.Produits.Produit_4G[k].E2.toString());
              }
            })
            this.N_SerieStocke = N_SerieStocke;
            this.E1Stocke = E1Stocke;
            this.E2Stocke = E2Stocke;
          }
          reader.readAsDataURL(detail);
        })
      }
    }
  }
  //verifier si numero série existe déjà en stock ou non
  verifN_serieProduit(event: any) {
    const found = this.N_SerieStocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro Série existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceN_serie();
    this.ElimineRedondance();

  }
  //verifier si numero série saisi déjà ou non
  ElimineRedondanceN_serie() {
    for (let i = 0; i < this.Numero_Serie.length; i++) {
      for (let j = i + 1; j < this.Numero_Serie.length; j++) {
        if (this.Numero_Serie[i] == this.Numero_Serie[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro Série déjà saisi.")
        }
      }
    }
  }
  //verifier si numero IMEI1 existe déjà en stock ou non
  verifE1Produit(event: any) {
    const found = this.E1Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 1 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE1();
    this.ElimineRedondance();
  }
  //verifier si numero IMEI1 saisi déjà ou non
  ElimineRedondanceE1() {
    for (let i = 0; i < this.E1.length; i++) {
      for (let j = i + 1; j < this.E1.length; j++) {
        if (this.E1[i] == this.E1[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          else { }
          Swal.fire("Attention! Numéro IMEI 1 déjà saisi.")
        }
      }
    }
  }
  //verifier si numero IMEI2 existe déjà en stock ou non
  verifE2Produit(event: any) {
    const found = this.E2Stocke.find((element: any) => element == event.target.value);
    if (found != undefined) {
      this.verifStock = true;
      Swal.fire("Attention! Numéro IMEI 2 existe déjà dans le stock.");
    }
    else {
      this.verifStock = false;
    }
    this.ElimineRedondanceE2();
    this.ElimineRedondance();
  }
  //verifier si numero IMEI2 saisi déjà ou non
  ElimineRedondanceE2() {
    for (let i = 0; i < this.E2.length; i++) {
      for (let j = i + 1; j < this.E2.length; j++) {
        if (this.E2[i] == this.E2[j]) {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro IMEI 2 déjà saisi.")
        }
      }
    }
  }
  //verifier si numero saisi déjà ou non
  ElimineRedondance() {
    this.tableConcat1 = this.E1.concat(this.E2);
    this.tableConcat2 = this.tableConcat1.concat(this.Numero_Serie)
    for (let i = 0; i < this.tableConcat2.length; i++) {
      if (this.tableConcat2[i] == "") {
        this.tableConcat2.splice(i, 1);
      }
      else { }
      for (let j = i + 1; j < this.tableConcat2.length; j++) {
        if (this.tableConcat2[i] == this.tableConcat2[j] && this.tableConcat2[i] != "") {
          if (this.verifStock == false) {
            this.verifStock = true;
          }
          Swal.fire("Attention! Numéro déjà saisi.")
        }
      }
    }
  }

  csvContent: any
  onFileLoad(fileLoadedEvent: any) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(this.csvContent);
  }

  obj2: any = {}
  public Array: any = [];
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      let csvToRowArray = (fileReader.result + "").split("\n");
      for (let index = 1; index < csvToRowArray.length; index++) {
        this.obj2 = {}
        let row2 = csvToRowArray[index].split(";");
        if (index - 1 < this.Numero_Serie.length) {
          this.Numero_Serie[index - 1] = row2[0]
          this.E1[index - 1] = row2[1]
          this.E2[index - 1] = row2[2]
        }
      }
    }

    fileReader.readAsText(file, "UTF-8");
    // this.check_qte()
  }
}

//component dialogue en cas type produit n_lot
@Component({
  selector: 'dialog-overview-n_lot',
  templateUrl: 'dialog-overview-n_lot.html',
})
export class DialogOverview_nlot {

  ligne_table: any;
  table: any;
  DetailProduit: any;
  N_SerieStocke: any = [];
  E1Stocke: any = [];
  E2Stocke: any = [];
  indice: any;
  verifStock: boolean = false;
  somme: any;
  nb_lot: any = 6
  obj: any = {}
  form: any = FormGroup;

  constructor(private datePipe: DatePipe, public bonEntreeService: BonEntreeService, private fb: FormBuilder, public dialogRef: MatDialogRef<DialogOverview_nlot>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.somme = data.ligne_tableau.Quantite
    dialogRef.disableClose = true;
    if ((this.ligne_table.detail.length) < 1) {
      this.obj = {}
      this.obj.n_Lot = ""
      this.obj.date_fabrication = ""
      this.obj.date_validite = ""
      this.obj.qte = ""
      this.ligne_table.detail.push(this.obj)
    }
  }
  savenlot(i: any, event: any) {

    this.ligne_table.detail[i].n_Lot = event.target.value
  }
  savenqte(i: any, event: any) {

    this.ligne_table.detail[i].qte = event.target.value

  }
  savendatef(index: any, event: any) {

    this.ligne_table.detail[index].date_fabrication = event.target.value
  }

  savendatev(index: any, event: any) {

    this.ligne_table.detail[index].date_validite = event.target.value
  }
  supp(index: any) {
    this.ligne_table.detail.splice(index, 1);
  }

  add() {

    this.obj = {}
    this.obj.n_Lot = ""
    this.obj.date_fabrication = ""
    this.obj.date_validite = ""
    this.obj.qte = ""
    this.ligne_table.detail.push(this.obj)
  }
  s: any = 0;
  valide() {
    this.s = 0;
    this.ligne_table.EtatEntree = "Entrée Stock Vérifié";
    for (let i = 0; i < this.ligne_table.detail.length; i++) {
      this.s = Number(this.s + Number(this.ligne_table.detail[i].qte))
      if (this.ligne_table.detail[i].n_Lot == '' || this.ligne_table.detail[i].qte == '' || this.ligne_table.detail[i].date_validite == '' || this.ligne_table.detail[i].date_fabrication == '') {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
      }
    }
    if (this.somme + "" != this.s + "") { this.ligne_table.EtatEntree = "Entrée Stock Non Accompli"; }
    this.dialogRef.close();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  csvContent: any
  onFileLoad(fileLoadedEvent: any) {
    const textFromFileLoaded = fileLoadedEvent.target.result;
    this.csvContent = textFromFileLoaded;
    // alert(this.csvContent);
  }
  obj2: any = {}
  public Array: any = [];
  d1: any
  d2: any
  onFileSelected(event: any) {
    const file: File = event.target.files[0];
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      let csvToRowArray = (fileReader.result + "").split("\n");
      for (let index = 1; index < csvToRowArray.length; index++) {
        let row2 = csvToRowArray[index].split(";");
        this.ligne_table.detail[index - 1].n_Lot = row2[0]
        this.ligne_table.detail[index - 1].qte = row2[1]
        this.d1 = new Date(row2[2])
        this.d2 = new Date(row2[3])
        this.ligne_table.detail[index - 1].date_fabrication = this.datePipe.transform(this.d1, "yyyy-MM-dd")
        this.ligne_table.detail[index - 1].date_validite = this.datePipe.transform(this.d2, "yyyy-MM-dd")
      }
    }
    fileReader.readAsText(file, "UTF-8");
  }
}

// component dialogue ajouter article
@Component({
  selector: 'dialog-ajouter-article',
  templateUrl: './dialog-ajouter-article.html',
})
export class AjouterArticlesComponent implements OnInit {
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


  constructor(public Service: BonEntreeService, public dialogRef: MatDialogRef<AjouterArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
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
    console.log("bhhhh")
    item.qte = event.target.value;
  }

  //** Get All Product */
  checkCheckBoxvalue(event: any, prod: any) {
    if (event.target.checked) {
      this.dsiable = false;
      prod.prix = 0
      prod.remise = 0
      prod.qte = 1
      this.prodChecked.push(prod);
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

// component dialogue ajouter article
@Component({
  selector: 'dialog-ajouter-article-impo',
  templateUrl: './dialog-ajouter-article-impo.html',
})
export class AjouterArticles_impoComponent implements OnInit {
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
  Lngp:any;

  constructor(public Service: BonEntreeService, public dialogRef: MatDialogRef<AjouterArticlesComponent>, @Inject(MAT_DIALOG_DATA) public data: any) {
    this.fromPage = data;
    this.Service.Listengp().subscribe((data: any) => {
      this.Lngp = data;
    });
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

  //** Get All Product */
  checkCheckBoxvalue(event: any, prod: any) {
    if (event.target.checked) {
      this.dsiable = false;
      prod.prix = 0
      prod.remise = 0
      prod.qte = 1
      this.prodChecked.push(prod);
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
      
      if (this.prodChecked[i].prix < 1 || this.prodChecked[i].qte < 1 || this.prodChecked[i].remise < 0 || this.prodChecked[i].ngp+"" == "-" || this.prodChecked[i].ngp == undefined) {
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
        'Prix && Quantite && NGP',
        'error'
      )
    }
  }
}
