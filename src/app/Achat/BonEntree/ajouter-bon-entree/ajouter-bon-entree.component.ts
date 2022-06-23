import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import 'sweetalert2/src/sweetalert2.scss';
import { MatDialog } from '@angular/material/dialog';
import { interval } from 'rxjs';
import { AjouterArticlesComponent, DialogOverview4gDialog, DialogOverviewArticleDialog, DialogOverviewChargeDialog, DialogOverviewSerieDialog, DialogOverviewSimpleDialog, DialogOverview_nlot } from '../../dialogue-achat/dialogue-achat.component';
import { BonEntreeService } from '../Service/bon-entree.service';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatStepper } from '@angular/material/stepper';

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ajouter-bon-entree',
  templateUrl: './ajouter-bon-entree.component.html',
  styleUrls: ['./ajouter-bon-entree.component.scss']
})


export class AjouterBonEntreeComponent implements OnInit {
  lineaire = true;
  @ViewChild('stepperbonEntree') private myStepper: any = MatStepper;

  InformationsGeneralesForm: any = FormGroup;
  ChargeForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  locals: any = [];
  fournisseurs: any = [];
  produits: any = [];
  Id_Produit: any;
  Ref_FR: any;
  N_Facture: any;
  Quantite: any = 0;
  Remise: any = 0;
  Prix: any = 0;
  IdProduit: any;
  produitData: any;
  Montant_TVA: any = 0;
  prix: any = 0;
  ref_FR: any;
  quantite: any = 0;
  id_produit: any;
  tva: any = 0;
  fodec: any = 0;
  Totale_TTC: any = 0;
  bonEntreeLocals: any = [];
  categorie_paiement: any;
  fieldArray: Array<any> = [];
  newAttribute: any = {};
  Totale_Facture: any = 0;
  Totale_Facture_TTC: any = 0;
  Total_HT: any = 0;
  totalMontantTVA: any = 0;
  totalMontantFodec: any = 0;
  totalHT: any = 0;
  totalHTBrut: any = 0;
  totalRHT: any = 0;
  totalRemise: any = 0;
  totalFodec: any = 0;
  totalPorcentageFodec: any = 0;
  totalTTc: any = 0;
  totalRTTC: any = 0;
  Ch_Globale: any = 0;
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  Ch: any = 0;
  totalChGlobale: any = 0;
  PrixRevientU: any = 0;
  index: any = 0;
  data3: any = "";
  data4: any = "";
  cocher: any;
  click: boolean = true;
  totalPourcentCh: any;
  verifTotal: boolean = true;
  EntreeForm: any = FormGroup;
  showStyle: boolean;
  tableTotal_HT: any;
  Montant_Fodec: any = 0;
  Prix_U_TTC: any = 0;
  EtatEntree: any;
  fichierEtat: any;
  verif: boolean = true;
  valide: any;
  date_de_jour = new Date();
  table: number[] = [];
  tableIndex: number[] = [];
  tableCh: number[] = [];
  tvaType: any;
  assiette: any = 0;
  Montant: any = 0;
  assiette19: any = 0;
  assiette7: any = 0;
  assiette13: any = 0;
  Montant19: any = 0;
  Montant7: any = 0;
  Montant13: any = 0;
  assiettetva19 = 0;
  Montanttva19 = 0;
  assiettetva7 = 0;
  Montanttva7 = 0;
  assiettetva13 = 0;
  Montanttva13 = 0;
  fournisseur: any;
  signaler_probleme: boolean;
  Ref_FR_article: any;

  constructor(private datePipe: DatePipe, private http: HttpClient, public bonEntreeService: BonEntreeService, private router: Router, private fb: FormBuilder, public dialog: MatDialog) {
    this.cocher = true;
    this.valide = true;
    this.signaler_probleme = false;
   
    this.bonEntreeService.obtenirCategoriePaiement().subscribe((response: Response) => {
      this.categorie_paiement = response;
    });
    this.Locals();
    this.Fournisseurs();
    this.Produits();
    this.BonEntreeLocals();
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: [, Validators.required],
      N_Facture: ['', Validators.required],
      Totale_Facture: [0 ,Validators.required],
      Totale_Facture_TTC: [0,],
      Local: ['', Validators.required],
      Ag_Ttransport: [''],
      Mode_Paiement: ['', Validators.required],
      Type: ['', Validators.required],
      Fournisseur: [''],
      ChargeTransport: [0],
      Autre_Charge_Fixe: [0],
    });
    this.ListeArticleForm = this.fb.group({
      IdProduit: [''],
      Ref_FR: [''],
      Quantite: [, Validators.min(0.1)],
      Prix: [''],
      Id_Produit: [''],
      Ref_fournisseur: [''],
      Qte: [''],
      Prix_U: [''],
      TVA: [''],
      M_TVA: [''],
      Fodec: [''],
      Prix_HT: [''],
      Totale_TTC: [''],
    });
    this.ChargeForm = this.fb.group({
      Id_article: [''],
      Ref_fournisseur: [''],
      Qte: [''],
      Prix_U: [''],
      TVA: [''],
      M_TVA: [''],
      Fodec: [''],
      Prix_HT: [''],
      Totale_TTC: [''],
      PrixRevientU: [''],
      totalRemise: [''],
      Ch: [
        "",
        [
          Validators.min(0),
          Validators.max(100)
        ]
      ],
      Ch_Globale: ['']
    });
    this.EntreeForm = this.fb.group({
      IdProduit: [''],
      Quantite: [],
      Id_Produit: [''],
      Qte: [''],
      EtatEntree: []
    });
    this.chargementModel();
    this.modelePdfBase64();

    sessionStorage.setItem('Utilisateur', "rochdi");
  }
   
  activerCalcul() { 
      this.calcul();
      this.calculAssiette();
      this.verificationCh("");
      this.testCheck(true);
  }
  
  //activer/desactiver la step entree
  verificationCh(event: any) {
    let total1 = 0;
    for (let i = 0; i < this.fieldArray.length; i++) {
      this.verif = this.fieldArray[i].verifCh;
      total1 += Number(this.fieldArray[i].Ch);
      if (total1 != 100.000 || total1 != 100) {
        this.fieldArray[i].verifCh = true;
      }
      else {
        this.fieldArray[i].verifCh = false;
      }
    }
  }

  //dialogue modifier ligne table articles
  ouvreDialogueArticle(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewArticleDialog, {
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
      fieldArray.Quantite = result.qte_modifier;
      fieldArray.PrixU = result.prixU_modifier;
      fieldArray.Remise = result.remise_modifier;
      fieldArray.Montant_HT = ((Number(fieldArray.PrixU) * Number(fieldArray.Quantite)) * (1 - (Number(fieldArray.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (fieldArray.Montant_HT * fieldArray.Fodec) / 100;
      fieldArray.Montant_Fodec = Number(this.Montant_Fodec);
      this.Montant_TVA = ((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec)) * fieldArray.Tva) / 100;
      fieldArray.Montant_TVA = Number(this.Montant_TVA);
      fieldArray.Prix_U_TTC = (((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec) + Number(fieldArray.Montant_TVA))) / Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Total_TVA = ((Number(fieldArray.Montant_TVA)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.Montant_TTC = Number(fieldArray.Prix_U_TTC) * Number(fieldArray.Quantite);
      fieldArray.Ch = ((((Number(fieldArray.PrixU)) / Number(fieldArray.TotalFacture)) * 100) * Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Ch_Piece = (((((Number(fieldArray.ChargeTr) + Number(fieldArray.AutreCharge)) * Number(fieldArray.Ch)) / 100)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.PrixRevientU = (Number(fieldArray.PrixU) + Number(fieldArray.Ch_Piece)).toFixed(3);
      this.activerCalcul();     
      this.actiververifCh();
    });
  }
  //dialogue modifier ligne table charge
  ouvreDialogCharge(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewChargeDialog, {
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
      fieldArray.Quantite = result.qte_modifier_ch;
      fieldArray.PrixU = result.prixU_modifier_ch;
      fieldArray.Remise = result.remise_modifier_ch;
      fieldArray.Montant_HT = ((Number(fieldArray.PrixU) * Number(fieldArray.Quantite)) * (1 - (Number(fieldArray.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (fieldArray.Montant_HT * fieldArray.Fodec) / 100;
      fieldArray.Montant_Fodec = Number(this.Montant_Fodec);
      this.Montant_TVA = ((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec)) * fieldArray.Tva) / 100;
      fieldArray.Montant_TVA = Number(this.Montant_TVA);
      fieldArray.Prix_U_TTC = (((Number(fieldArray.Montant_HT) + Number(fieldArray.Montant_Fodec) + Number(fieldArray.Montant_TVA))) / Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Total_TVA = ((Number(fieldArray.Montant_TVA)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.Montant_TTC = Number(fieldArray.Prix_U_TTC) * Number(fieldArray.Quantite);
      fieldArray.Ch = ((((Number(fieldArray.PrixU)) / Number(fieldArray.TotalFacture)) * 100) * Number(fieldArray.Quantite)).toFixed(3);
      fieldArray.Ch_Piece = (((((Number(fieldArray.ChargeTr) + Number(fieldArray.AutreCharge)) * Number(fieldArray.Ch)) / 100)) / (Number(fieldArray.Quantite))).toFixed(3);
      fieldArray.PrixRevientU = (Number(fieldArray.PrixU) + Number(fieldArray.Ch)).toFixed(3);
      this.activerCalcul();     
      this.actiververifCh();
    }
    
    );
  }
  //dialogue produit type simple
  ouvreDialogSimple(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewSimpleDialog, {
      width: '400px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //dialogue produit type serie
  ouvreDialogSerie(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewSerieDialog, {
      width: '480px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }

  //dialogue produit type o n_lot
  ouvreDialogn_lot(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverview_nlot, {
      width: '1000px',
     
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {

    });
  }

  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  modele: any;modele2: any;
  // conversion de modele de pdf  en base 64 
  async modelePdfBase64() {
    await this.delai(2000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele);

    await this.delai(2000);
    const lecteur2 = new FileReader();
    lecteur2.onloadend = () => {
      this.modeleSrc2 = lecteur2.result;
      this.modeleSrc2 = btoa(this.modeleSrc2);
      this.modeleSrc2 = atob(this.modeleSrc2);
      this.modeleSrc2 = this.modeleSrc2.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur2.readAsDataURL(this.modele2);
  }
  // récupération de modele pour créer le pdf
  async chargementModel() {
    this.http.get('./../../assets/images/bel.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
    this.http.get('./../../assets/images/annexe.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele2 = reponse;
      return this.modele;
    }, err => console.error(err))
  }

  //dialogue produit type 4G
  ouvreDialog4g(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverview4gDialog, {
      width: '800px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {
    });
  }
  //Selon type produit l'ouverture du dialogue 
  testerType(index: any) {

    if (this.fieldArray[index].N_Imei == "true") {

      this.ouvreDialog4g(index, this.fieldArray[index], this.fieldArray);
    }
    else if (this.fieldArray[index].N_Serie == "true") {
      this.ouvreDialogSerie(index, this.fieldArray[index], this.fieldArray);
    }
    else if (this.fieldArray[index].N_Lot == "true") {
      this.ouvreDialogn_lot(index, this.fieldArray[index], this.fieldArray);
    }
    else {
      this.ouvreDialogSimple(index, this.fieldArray[index], this.fieldArray);
    }

  }
  ngOnInit(): void {
  }
  //modifier charge
  modifCharge(event: any, index: any) {
    if (event.checked == false) {
      this.fieldArray[index].valide = false;
      this.table = [];
      this.tableIndex.push(index);
      for (let i = 0; i < this.fieldArray.length; i++) {
        for (let j = 0; j < this.tableIndex.length; j++)
          if (i != this.tableIndex[j]) {
            this.tableCh.push(i);
          }
      }
    }
  }
  //Calculer charge par piéce
  calculChPiece(index: any) {
    let PourcentageCh: any = 0;
    let TotalFact: any = 0;
    this.fieldArray[index].PrixRevientU = (Number(this.fieldArray[index].PrixU) + Number(this.fieldArray[index].Ch_Piece)).toFixed(3);
    this.fieldArray[index].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[index].Ch)) / 100)) / (Number(this.fieldArray[index].Quantite))).toFixed(3);
    this.modifCharge(event, index);
    PourcentageCh = Number(this.fieldArray[index].Ch);
    TotalFact = (Number(this.fieldArray[index].PrixU) * (Number(this.fieldArray[index].Quantite)));
    for (let j of this.tableCh) {
      this.fieldArray[j].Ch = ((((Number(this.fieldArray[j].PrixU)) / (Number(this.InformationsGeneralesForm.get('Totale_Facture').value) - TotalFact)) * (100 - PourcentageCh)) * Number(this.fieldArray[j].Quantite)).toFixed(3);
      this.fieldArray[j].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[j].Ch)) / (100 - PourcentageCh))) / (Number(this.fieldArray[j].Quantite))).toFixed(3);
      this.fieldArray[j].PrixRevientU = (Number(this.fieldArray[j].PrixU) + Number(this.fieldArray[j].Ch_Piece)).toFixed(3);
    }
  }
  //calculer les totaux
  calcul() {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    for (var i = 0; i < this.fieldArray.length; i++) {
      total1 += (Number(this.fieldArray[i].Montant_TVA))
      this.totalMontantTVA = total1.toFixed(3);
      total2 += (Number(this.fieldArray[i].Montant_HT));
      this.totalHT = total2.toFixed(3);
      total3 += (Number(this.fieldArray[i].Prix_U_TTC)) * (Number(this.fieldArray[i].Quantite));
      this.totalTTc = total3.toFixed(3);
      total4 += Number(this.fieldArray[i].Ch_Globale);
      this.totalChGlobale = total4;
      total5 += (Number(this.fieldArray[i].Remise) * Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite)) / 100;
      this.totalRemise = total5.toFixed(3);
      total9 += (Number(this.fieldArray[i].Fodec) * (Number(this.fieldArray[i].Quantite)));
      this.totalPorcentageFodec = total9;
      total6 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)));
      this.totalRHT = total6.toFixed(3);
      total7 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)) + Number(this.fieldArray[i].Montant_TVA) + Number(this.fieldArray[i].Montant_Fodec));
      this.totalRTTC = total7.toFixed(3);
      total8 += Number(this.fieldArray[i].Ch);
      this.totalPourcentCh = total8;
      this.newAttribute.totalPourcentCh = this.totalPourcentCh;
      total10 += this.fieldArray[i].Montant_Fodec;
      total11 += (Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite));
      this.totalHTBrut = total11.toFixed(3);
      this.totalMontantFodec = total10.toFixed(3);
      this.totalMontantTVA = total1.toFixed(3);
 
    }
  }
  //Récuperer tous locaux
  Locals() {
    this.bonEntreeService.Locals().subscribe((data: any) => {
      this.locals = data;
    });
  }
  //Récuperer tous fournisseurs
  Fournisseurs() {
    this.bonEntreeService.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }
  //Récuperer fournisseur par id
  Fournisseur() {
    this.bonEntreeService.Fournisseur((this.InformationsGeneralesForm.get('Fournisseur').value)).subscribe((data: any) => {
      this.fournisseur = data;
    });
  }
  //Récuperer tous produits
  Produits() {
    this.bonEntreeService.Produits().subscribe((data: any) => {
      this.produits = data;
    });
  }
  //Récuperer tous produits
  BonEntreeLocals() {
    this.bonEntreeService.BonEntreeLocals().subscribe((data: any) => {
      this.bonEntreeLocals = data;
    });
  }
  //Récuperer la valeur entrée Ref_FR
  Ref_FR_Valeur(event: any) {
    this.Ref_FR = event.target.value;
  }
  //Récuperer la valeur entrée Quantite
  Quantite_Valeur(event: any) {
    this.Quantite = event.target.value;
    if (event.target.value == 0) {
      this.click = true;
    } else {
      this.click = false;
    }
  }

  resultat_dialog: any;
  table_articles: any = [];
  //** open Dialog */
  openDialog() {
    const dialogRef = this.dialog.open(AjouterArticlesComponent, {
      height: '600px', data: {
        fromPage: this.table_articles,
        // local: this.local
      }
    });
    dialogRef.afterClosed().subscribe(res => {

      this.resultat_dialog = res.data
       if (res != undefined) {
        for (let i = 0; i < this.resultat_dialog.length; i++) {
          let test = "0";
          for (let j = 0; j < this.fieldArray.length; j++) {
            if (this.fieldArray[j].Id_Produit + "" == this.resultat_dialog[i].id_Produit + "") {
              test = "1";
            }
          }
          if (test == "0") { this.ajouter(this.resultat_dialog[i].id_Produit, this.resultat_dialog[i].prix, this.resultat_dialog[i].qte, this.resultat_dialog[i].remise); }
        }
         this.activerCalcul();     
         this.actiververifCh();
      }
    });
  }

  //Récuperer la valeur entrée Remise
  Remise_Valeur(event: any) {
    if (event.target.value == '') {
      this.Remise = 0;
    }
    this.Remise = event.target.value;
  }
  //message erreur quantité
  MessageErreurQte() {
    if (this.ListeArticleForm.get('Quantite').hasError('min')) {
      return 'La quantité ne doit pas être nulle!';
    }
    else {
      return '';
    }
  }
  //message erreur type
  MessageErreurType() {
    if (this.InformationsGeneralesForm.get('Type').hasError('required')) {
      return 'Vous devez entrer le type!';
    }
    else {
      return '';
    }
  }
  //message erreur agence
  MessageErreurAgence() {
    if (this.InformationsGeneralesForm.get('Ag_Ttransport').hasError('required')) {
      return "Vous devez entrer l'agence transport!";
    }
    else {
      return '';
    }
  }
  //message erreur local
  MessageErreurLocal() {
    if (this.InformationsGeneralesForm.get('Local').hasError('required')) {
      return 'Vous devez entrer le local!';
    }
    else {
      return '';
    }
  }
  //message erreur fournisseur
  MessageErreurFournisseur() {
    if (this.InformationsGeneralesForm.get('Fournisseur').hasError('required')) {
      return 'Vous devez entrer le fournisseur!';
    }
    else {
      return '';
    }
  }
  //message erreur date
  MessageErreurDate() {
    if (this.InformationsGeneralesForm.get('DateEntree').hasError('required')) {
      return 'Vous devez entrer la date !';
    }
    else {
      return '';
    }
  }
  //message erreur mode paiement
  MessageErreurMode() {
    if (this.InformationsGeneralesForm.get('Mode_Paiement').hasError('required')) {
      return 'Vous devez entrer la mode de paiement !';
    }
    else {
      return '';
    }
  }
  //message erreur charge
  MessageErreurCharge() {
    if (this.InformationsGeneralesForm.get('ChargeTransport').hasError('required')) {
      return 'Vous devez entrer la charge !';
    }
    else {
      return '';
    }
  }
  //message d'erreur pourcentage charge
  MessageErreurPourcentageCharge() {
    if (this.ChargeForm.get('Ch').hasError('required')) {
      return 'Vous devez entrer la pourcentage charge !';
    }
    if (this.ChargeForm.get('Ch').hasError('max')) {
      return 'Invalide : Max 100% !';
    }
    return this.ChargeForm.get('Ch').hasError('min') ?
      'Invalide : Min 0% !' : '';
  }
  //message erreur quantité
  MessageErreurQuantite() {
    if (this.ListeArticleForm.get('Quantite').hasError('required')) {
      return 'Vous devez entrer la quantité !';
    }
    return this.ListeArticleForm.get('Quantite').hasError('min') ?
      'Invalide : Min 0 !' : '';
  }
  //message erreur prix
  MessageErreurPrix() {
    if (this.ListeArticleForm.get('Prix').hasError('required')) {
      return 'Vous devez entrer le prix !';
    }
    else {
      return '';
    }
  }
  //message erreur prix HT
  MessageErreurPrixHT() {
    if (this.ListeArticleForm.get('Prix_HT').hasError('required')) {
      return 'Vous devez entrer le prix HT !';
    }
    else {
      return '';
    }
  }
  //message erreur n° facture
  MessageErreurNFacture() {
    if (this.InformationsGeneralesForm.get('N_Facture').hasError('required')) {
      return 'Vous devez entrer le numéro de facture !';
    }
    else {
      return '';
    }
  }
  //message erreur totale facture
  MessageErreurTotaleFacture() {
    if (this.InformationsGeneralesForm.get('Totale_Facture').hasError('required')) {
      return 'Vous devez entrer le total facture !';
    }
    else {
      return '';
    }
  }
  //ajouter article 
  ajouter(id: any, prix: any, qte: any, remise: any) {
    this.click = !this.click;
    this.bonEntreeService.Produit(id).subscribe((response: Response) => {
      this.produitData = response;
      this.newAttribute.Id_Produit = id;
      this.newAttribute.Id_produit = id;
      this.newAttribute.des = this.produitData.caracteristique_Technique;
      this.newAttribute.Nom_Produit = this.produitData.nom_Produit;
      this.newAttribute.N_Imei = this.produitData.n_Imei;
      this.newAttribute.N_Serie = this.produitData.n_Serie;
      this.newAttribute.N_Lot = "false"
      if (this.produitData.n_Lot + "" == "true") { this.newAttribute.N_Lot = "true" }
      this.newAttribute.Tva = this.produitData.tva;
      this.tva = this.newAttribute.Tva;
      this.newAttribute.Ch = this.Ch;
      this.newAttribute.ChargeTr = this.ChargeTransport;
      this.newAttribute.AutreCharge = this.Autre_Charge_Fixe;
      if (this.produitData.fodec == "Sans_Fodec") {
        this.newAttribute.Fodec = 0;
      }
      else {
        this.newAttribute.Fodec = 1;
      }
      this.fodec = this.newAttribute.Fodec;
      this.newAttribute.PrixU = Number(prix).toFixed(3);
      this.newAttribute.Quantite = Number(qte);
      this.newAttribute.Ref_FR = this.Ref_FR_article;
      this.newAttribute.Remise = Number(remise);
      this.Totale_TTC = (Number(this.newAttribute.PrixU) / (1 + (Number(this.newAttribute.Tva)) / 100)).toFixed(3);
      Number(this.newAttribute.PrixU).toFixed(3);
      this.newAttribute.Montant_HT = ((Number(this.newAttribute.PrixU) * Number(this.newAttribute.Quantite)) * (1 - (Number(this.newAttribute.Remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (this.newAttribute.Montant_HT * this.newAttribute.Fodec) / 100;
      this.Total_HT = Number(this.Totale_TTC) * Number((1 / this.Montant_TVA));
      this.newAttribute.Montant_Fodec = Number(this.Montant_Fodec);

      this.Montant_TVA = ((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec)) * this.newAttribute.Tva) / 100;
      this.newAttribute.Montant_TVA = Number(this.Montant_TVA);
      this.newAttribute.Prix_U_TTC = (((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec) + Number(this.newAttribute.Montant_TVA))) / Number(this.newAttribute.Quantite)).toFixed(3);
      this.newAttribute.Montant_TTC = Number(this.newAttribute.Prix_U_TTC) * Number(this.newAttribute.Quantite);
      this.newAttribute.Total_TVA = ((Number(this.newAttribute.Montant_TVA)) / (Number(this.newAttribute.Quantite))).toFixed(3);
      this.newAttribute.Totale_TTC = Number(this.Totale_TTC);
      this.newAttribute.Total_HT = Number(this.Total_HT).toFixed(3);
      this.newAttribute.Ch_Globale = Number(this.Ch_Globale);
      this.newAttribute.TotalFacture = Number(this.InformationsGeneralesForm.get('Totale_Facture').value);
      this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
      this.newAttribute.verifCh = this.verif;
      this.newAttribute.valide = this.valide;
      this.newAttribute.signaler_probleme = this.signaler_probleme;
      this.newAttribute.FichierSimple = "";
      this.newAttribute.detail = []
      this.newAttribute.PrixRevientU = (Number(this.newAttribute.Montant_HT) + ((Number(this.Ch / 100)) * (Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe))) / Number(qte)).toFixed(3)
      console.log(this.newAttribute.PrixRevientU)
      //this.newAttribute.Ch_Piece = (((((Number(this.newAttribute.ChargeTr) + Number(this.newAttribute.AutreCharge)) * Number(this.newAttribute.Ch)) / 100)) / (Number(this.newAttribute.Quantite))).toFixed(3);

      this.fieldArray.push(this.newAttribute);
      this.calcul();
      this.testCheck(true)
      this.newAttribute = {};
    });
  }
  // clacule 
  calcule() {
    let total1 = 0;
    let total2 = 0;
    let total3 = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    //   this.newAttribute.PrixRevientU = (Number(this.newAttribute.Montant_HT) + ((Number(this.Ch / 100)) * (Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe))) / Number(this.Quantite)).toFixed(3)    
    for (let i = 0; i < this.fieldArray.length; i++) {
      this.fieldArray[i].Ch = this.Ch;
      this.fieldArray[i].Ch_Globale = this.Ch_Globale;
    }
    this.testCheck(event);
    for (var i = 0; i < this.fieldArray.length; i++) {
      total1 += (Number(this.fieldArray[i].Montant_TVA));
      this.totalMontantTVA = total1.toFixed(3);
      total2 += (Number(this.fieldArray[i].Montant_HT));
      this.totalHT = total2.toFixed(3);
      this.newAttribute.totaleHT = this.totalHT;
      total3 += (Number(this.fieldArray[i].Prix_U_TTC)) * (Number(this.fieldArray[i].Quantite));
      this.totalTTc = total3.toFixed(3);
      total4 += Number(this.fieldArray[i].Ch_Globale);
      this.totalChGlobale = total4;
      total5 += ((Number(this.fieldArray[i].Remise) * Number(this.newAttribute.PrixU) * Number(this.fieldArray[i].Quantite)) / 100);
      this.totalRemise = total5.toFixed(3);
      total9 += (Number(this.fieldArray[i].Fodec) * (Number(this.fieldArray[i].Quantite)));
      this.totalPorcentageFodec = total9;
      total6 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)));
      this.totalRHT = total6.toFixed(3);
      total7 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)) + Number(this.fieldArray[i].Total_TVA));
      this.totalRTTC = total7.toFixed(3);
      total8 += Number(this.fieldArray[i].Ch);
      this.totalPourcentCh = total8;
      this.newAttribute.totalPourcentCh = this.totalPourcentCh;
      total10 += this.fieldArray[i].Montant_Fodec;
      total11 += (Number(this.fieldArray[i].PrixU) * Number(this.fieldArray[i].Quantite));
      this.totalHTBrut = total11.toFixed(3);
      this.totalMontantFodec = total10.toFixed(3);
      this.totalMontantTVA = total1.toFixed(3);
    }
    this.assiettefonction();
    this.tableAssiette();
  }


  //Table Tva/assiette/montant
  assiettefonction() {
    let tvaTable: number[] = [];
    tvaTable.push(this.fieldArray[0].Tva);
    for (let i = 0; i < this.fieldArray.length; i++) {
      for (let j = 0; j < tvaTable.length; j++) {
        if (this.fieldArray[i].Tva != tvaTable[j]) {
          tvaTable.push(this.fieldArray[i].Tva);
        }
      }
    }
    this.tvaType = tvaTable.filter(function (elem, index, self) {
      return index === self.indexOf(elem);
    })
    this.tvaType.sort();
  }
  tableAssiette() {
    if (this.newAttribute.Tva == 19) {
      this.assiettetva19 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva19 += (Number(Number(this.newAttribute.Total_TVA)) * Number(this.newAttribute.Quantite));
      this.assiette19 = this.assiettetva19.toFixed(3);
      this.Montant19 = this.Montanttva19.toFixed(3);
    }
    else if (this.newAttribute.Tva == 7) {
      this.assiettetva7 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva7 += (Number(Number(this.newAttribute.Total_TVA) * Number(this.newAttribute.Quantite)));
      this.assiette7 = this.assiettetva7.toFixed(3);
      this.Montant7 = this.Montanttva7.toFixed(3);
    }
    else if (this.newAttribute.Tva == 13) {
      this.assiettetva13 += (Number(Number(this.newAttribute.Montant_HT) + Number(this.totalMontantFodec)));
      this.Montanttva13 += (Number(Number(this.newAttribute.Total_TVA) * Number(this.newAttribute.Quantite)));
      this.assiette13 = this.assiettetva13.toFixed(3);
      this.Montant13 = this.Montanttva13.toFixed(3);
    }
  }
  //activer/desactiver charge automatique
  testCheck(event: any) {
    if (event.checked == false) {
      this.Ch = 0;
      this.Ch_Globale = 0;
      for (let i = 0; i < this.fieldArray.length; i++) {
        this.fieldArray[i].Ch = this.Ch;
        this.fieldArray[i].Ch_Globale = this.Ch_Globale;
        this.fieldArray[i].Ch_Piece = 0;
        this.fieldArray[i].PrixRevientU = this.fieldArray[i].PrixU;
      }
    }
    else {
      for (let i = 0; i < this.fieldArray.length; i++) {
        this.fieldArray[i].Ch = ((((Number(this.fieldArray[i].PrixU)) / Number(this.InformationsGeneralesForm.get('Totale_Facture').value)) * 100) * Number(this.fieldArray[i].Quantite)).toFixed(3);
        this.fieldArray[i].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[i].Ch)) / 100)) / (Number(this.fieldArray[i].Quantite))).toFixed(3);
        this.fieldArray[i].PrixRevientU = (Number(this.fieldArray[i].PrixU) + Number(this.fieldArray[i].Ch_Piece)).toFixed(3);
      }
    }
  }
  //calcul assiettes tva
  calculAssiette() {
    if (this.fieldArray.length == 0) {
      this.tvaType = [];
      this.assiettetva19 = 0;
      this.Montanttva19 = 0
      this.assiettetva7 = 0
      this.Montanttva7 = 0
      this.assiettetva13 = 0;
      this.Montanttva13 = 0;
    } else {
      this.assiettetva19 = 0;
      this.Montanttva19 = 0;
      this.assiettetva7 = 0;
      this.Montanttva7 = 0;
      this.assiettetva13 = 0;
      this.Montanttva13 = 0;
      for (let i = 0; i < this.fieldArray.length; i++) {
        if (this.fieldArray[i].Tva == 19) {
          this.assiettetva19 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva19 += (Number(Number(this.fieldArray[i].Total_TVA)) * (Number(this.fieldArray[i].Quantite)));
          this.assiette19 = this.assiettetva19.toFixed(3);
          this.Montant19 = this.Montanttva19.toFixed(3);
        }
        else if (this.fieldArray[i].Tva == 7) {
          this.assiettetva7 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva7 += (Number(Number(this.fieldArray[i].Total_TVA) * Number(this.fieldArray[i].Quantite)));
          this.assiette7 = this.assiettetva7.toFixed(3);
          this.Montant7 = this.Montanttva7.toFixed(3);
        }
        else if (this.fieldArray[i].Tva == 13) {
          this.assiettetva13 += (Number(Number(this.fieldArray[i].Montant_HT) + Number(this.totalMontantFodec)));
          this.Montanttva13 += (Number(Number(this.fieldArray[i].Total_TVA) * Number(this.fieldArray[i].Quantite)));
          this.assiette13 = this.assiettetva13.toFixed(3);
          this.Montant13 = this.Montanttva13.toFixed(3);
        }
      }
    }
  }
  //supprimer article 
  deleteFieldValue(index: any) {
    let table: number[] = [];
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.fieldArray[index].Quantite = 0;
        this.fieldArray[index].Ch = 0;
        this.fieldArray[index].PrixU = 0;
        this.fieldArray[index].PrixRevientU = 0;
        this.fieldArray[index].Montant_TVA = 0;
        this.fieldArray[index].Montant_Fodec = 0;
        this.fieldArray[index].Remise = 0;
        this.fieldArray[index].Montant_HT = 0;
        this.fieldArray[index].Tva = 0;
        this.fieldArray[index].Fodec = 0;
        this.fieldArray[index].Total_TVA = 0;
        this.calcul();
        this.fieldArray.splice(index, 1);
        this.calculAssiette()
        Swal.fire(
          'Article Supprimé avec succés!',
          '',
          'success'
        )
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })
  }
  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  reponseajout: any
  //ajouter bon entree local sous forme d'in fichier
  ajouterFicheBonEntreeLocal() {
    this.Fournisseur();
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      this.verifTotal = true;
      Swal.fire(
        'Attention! Vérifier S.V.P',
        'Total_HT_Facture # Total_HT_Calculé! ',
        'error'
      )
    }
    this.verifTotal = false;
    var formData: any = new FormData();


    var doc = document.implementation.createDocument("Bon_Entree", "", null);

    var BEl = doc.createElement("Bon_Entree_Local");
    var InformationsGenerales = doc.createElement("Informations-Generales");
    var Etat = doc.createElement("Etat"); Etat.innerHTML = "en cours"
    var Type = doc.createElement("Type"); Type.innerHTML = this.InformationsGeneralesForm.get('Type').value
    var Id_Fr = doc.createElement("Id_Fr"); Id_Fr.innerHTML = this.InformationsGeneralesForm.get('Fournisseur').value
    var Local = doc.createElement("Local"); Local.innerHTML = this.InformationsGeneralesForm.get('Local').value
    var Charge_Transport = doc.createElement("Charge_Transport"); Charge_Transport.innerHTML = this.InformationsGeneralesForm.get('ChargeTransport').value
    var Mode_Paiement = doc.createElement("Mode_Paiement"); Mode_Paiement.innerHTML = this.InformationsGeneralesForm.get('Mode_Paiement').value
    var Autre_Charge_Fixe = doc.createElement("Autre_Charge_Fixe"); Autre_Charge_Fixe.innerHTML = this.InformationsGeneralesForm.get('Autre_Charge_Fixe').value
    var Date = doc.createElement("Date"); Date.innerHTML = this.InformationsGeneralesForm.get('DateEntree').value
    var Ag_Transport = doc.createElement("Ag_Transport"); Ag_Transport.innerHTML = this.InformationsGeneralesForm.get('Ag_Ttransport').value
    var Description = doc.createElement("Description"); Description.innerHTML = this.InformationsGeneralesForm.get('Des').value
    var Total_Facture_HT = doc.createElement("Total_Facture_HT"); Total_Facture_HT.innerHTML = this.InformationsGeneralesForm.get('Totale_Facture').value
    var Total_Facture_TTC = doc.createElement("Total_Facture_TTC"); Total_Facture_TTC.innerHTML = this.InformationsGeneralesForm.get('Totale_Facture_TTC').value
    var N_Facture = doc.createElement("N_Facture"); N_Facture.innerHTML = this.InformationsGeneralesForm.get('N_Facture').value

    InformationsGenerales.appendChild(Etat);
    InformationsGenerales.appendChild(Type);
    InformationsGenerales.appendChild(Id_Fr);
    InformationsGenerales.appendChild(Local);
    InformationsGenerales.appendChild(Charge_Transport);
    InformationsGenerales.appendChild(Mode_Paiement);
    InformationsGenerales.appendChild(Autre_Charge_Fixe);

    InformationsGenerales.appendChild(Date);
    InformationsGenerales.appendChild(Ag_Transport);
    InformationsGenerales.appendChild(Description);
    InformationsGenerales.appendChild(Total_Facture_HT);
    InformationsGenerales.appendChild(Total_Facture_TTC);
    InformationsGenerales.appendChild(N_Facture);


    var Taxes = doc.createElement("Taxes");
    var TVA = doc.createElement("TVA");

    var TVA19 = doc.createElement("TVA19");
    var Assiette19 = doc.createElement("Assiette"); Assiette19.innerHTML = this.assiette19 + "";
    var Montant19 = doc.createElement("Montant"); Montant19.innerHTML = this.Montanttva19 + "";
    TVA19.appendChild(Assiette19); TVA19.appendChild(Montant19); TVA.appendChild(TVA19)

    var TVA7 = doc.createElement("TVA7");
    var Assiette7 = doc.createElement("Assiette"); Assiette7.innerHTML = this.assiette7 + "";
    var Montant7 = doc.createElement("Montant"); Montant7.innerHTML = this.Montanttva7 + "";
    TVA7.appendChild(Assiette7); TVA7.appendChild(Montant7); TVA.appendChild(TVA7)

    var TVA13 = doc.createElement("TVA13");
    var Assiette13 = doc.createElement("Assiette"); Assiette13.innerHTML = this.assiette13 + "";
    var Montant13 = doc.createElement("Montant"); Montant13.innerHTML = this.Montanttva13 + "";
    TVA13.appendChild(Assiette13); TVA13.appendChild(Montant13); TVA.appendChild(TVA13)


    var Fodec = doc.createElement("Fodec"); Fodec.innerHTML = this.totalMontantFodec

    Taxes.appendChild(TVA); Taxes.appendChild(Fodec);


    var Total = doc.createElement("Total");
    var TotalHTBrut = doc.createElement("TotalHTBrut"); TotalHTBrut.innerHTML = this.totalHTBrut;
    var TotalRemise = doc.createElement("TotalRemise"); TotalRemise.innerHTML = this.totalRemise;
    var TotalHTNet = doc.createElement("TotalHTNet"); TotalHTNet.innerHTML = this.totalHT
    var TotalFodec = doc.createElement("TotalFodec"); TotalFodec.innerHTML = this.totalMontantFodec
    var TotalTVA = doc.createElement("TotalTVA"); TotalTVA.innerHTML = this.totalMontantTVA
    var totalTTc = doc.createElement("totalTTc"); totalTTc.innerHTML = this.totalTTc
    var TotalRHT = doc.createElement("TotalRHT"); TotalRHT.innerHTML = this.totalRHT
    var TotalRTTC = doc.createElement("TotalRTTC"); TotalRTTC.innerHTML = this.totalRTTC

    Total.appendChild(TotalHTBrut); Total.appendChild(TotalRemise); Total.appendChild(TotalHTNet); Total.appendChild(TotalFodec);
    Total.appendChild(TotalTVA); Total.appendChild(totalTTc); Total.appendChild(TotalRHT); Total.appendChild(TotalRTTC);



    var Produits = doc.createElement('Produits')
    var Produits_Series = doc.createElement('Produits_Series')
    var Produits_4Gs = doc.createElement('Produits_4Gs')
    var Produits_Simples = doc.createElement('Produits_Simples')
    var Produits_N_Lot = doc.createElement('Produits_N_Lot')

    for (let i = 0; i < this.fieldArray.length; i++) {
      if (this.fieldArray[i].N_Imei == "true") {

        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_HT = doc.createElement('Prix_U_HT'); Prix_U_HT.innerHTML = this.fieldArray[i].PrixU
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.fieldArray[i].Remise
        var Fodec = doc.createElement('Fodec'); Fodec.innerHTML = this.fieldArray[i].Fodec
        var Prix_U_TTC = doc.createElement('Prix_U_TTC'); Prix_U_TTC.innerHTML = this.fieldArray[i].Prix_U_TTC
        var PrixRevientU = doc.createElement('PrixRevientU'); PrixRevientU.innerHTML = this.fieldArray[i].PrixRevientU
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].Ch
        var Ch_Piece = doc.createElement('Ch_Piece'); Ch_Piece.innerHTML = this.fieldArray[i].Ch_Piece
        var typeProduit = doc.createElement('typeProduit'); typeProduit.innerHTML = "4G"
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(PrixRevientU);
        Produit.appendChild(Charge);
        Produit.appendChild(Ch_Piece);
        Produit.appendChild(typeProduit)



        var vProduit_4Gs = doc.createElement('Produit_4Gs');
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          var Produit_4G = doc.createElement('Produit_4G');
          var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.fieldArray[i].detail[j].ns
          var E1 = doc.createElement('E1'); E1.innerHTML = this.fieldArray[i].detail[j].e1
          var E2 = doc.createElement('E2'); E2.innerHTML = this.fieldArray[i].detail[j].e2
          Produit_4G.appendChild(N_Serie);
          Produit_4G.appendChild(E1);
          Produit_4G.appendChild(E2);
          vProduit_4Gs.appendChild(Produit_4G);
        }
        Produit.appendChild(vProduit_4Gs);
        Produits_4Gs.appendChild(Produit);
      }
      else if (this.fieldArray[i].N_Serie == "true") {

        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_HT = doc.createElement('Prix_U_HT'); Prix_U_HT.innerHTML = this.fieldArray[i].PrixU
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.fieldArray[i].Remise
        var Fodec = doc.createElement('Fodec'); Fodec.innerHTML = this.fieldArray[i].Fodec
        var Prix_U_TTC = doc.createElement('Prix_U_TTC'); Prix_U_TTC.innerHTML = this.fieldArray[i].Prix_U_TTC
        var PrixRevientU = doc.createElement('PrixRevientU'); PrixRevientU.innerHTML = this.fieldArray[i].PrixRevientU
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].Ch
        var Ch_Piece = doc.createElement('Ch_Piece'); Ch_Piece.innerHTML = this.fieldArray[i].Ch_Piece
        var typeProduit = doc.createElement('typeProduit'); typeProduit.innerHTML = "Serie"
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(PrixRevientU);
        Produit.appendChild(Charge);
        Produit.appendChild(Ch_Piece);
        Produit.appendChild(typeProduit)

        var vN_Series = doc.createElement('N_Series');
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.fieldArray[i].detail[j].ns
          vN_Series.appendChild(N_Serie);
        }
        Produit.appendChild(vN_Series);
        Produits_Series.appendChild(Produit);
      }
      else if (this.fieldArray[i].N_Lot == "true") {

        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_HT = doc.createElement('Prix_U_HT'); Prix_U_HT.innerHTML = this.fieldArray[i].PrixU
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.fieldArray[i].Remise
        var Fodec = doc.createElement('Fodec'); Fodec.innerHTML = this.fieldArray[i].Fodec
        var Prix_U_TTC = doc.createElement('Prix_U_TTC'); Prix_U_TTC.innerHTML = this.fieldArray[i].Prix_U_TTC
        var PrixRevientU = doc.createElement('PrixRevientU'); PrixRevientU.innerHTML = this.fieldArray[i].PrixRevientU
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].Ch
        var Ch_Piece = doc.createElement('Ch_Piece'); Ch_Piece.innerHTML = this.fieldArray[i].Ch_Piece
        var typeProduit = doc.createElement('typeProduit'); typeProduit.innerHTML = "N_Lot"
        Produit.appendChild(id);
        Produit.appendChild(Nom);

        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(PrixRevientU);
        Produit.appendChild(Charge);
        Produit.appendChild(Ch_Piece);
        Produit.appendChild(typeProduit)

        var vN_Lots = doc.createElement('N_Lots');
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          var N_Lot = doc.createElement('N_Lot');
          var Numero = doc.createElement('Numero'); Numero.innerHTML = this.fieldArray[i].detail[j].n_Lot
          var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].detail[j].qte
          var Datev = doc.createElement('Date_Validite'); Datev.innerHTML = this.fieldArray[i].detail[j].date_validite
          var Datef = doc.createElement('Date_Fabrication'); Datef.innerHTML = this.fieldArray[i].detail[j].date_fabrication
          N_Lot.appendChild(Numero); N_Lot.appendChild(Qte); N_Lot.appendChild(Datef); N_Lot.appendChild(Datev);
          vN_Lots.appendChild(N_Lot);
        }
        Produit.appendChild(vN_Lots);
        Produits_N_Lot.appendChild(Produit);
      }
      else {

        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_HT = doc.createElement('Prix_U_HT'); Prix_U_HT.innerHTML = this.fieldArray[i].PrixU
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.fieldArray[i].Remise
        var Fodec = doc.createElement('Fodec'); Fodec.innerHTML = this.fieldArray[i].Fodec
        var Prix_U_TTC = doc.createElement('Prix_U_TTC'); Prix_U_TTC.innerHTML = this.fieldArray[i].Prix_U_TTC
        var PrixRevientU = doc.createElement('PrixRevientU'); PrixRevientU.innerHTML = this.fieldArray[i].PrixRevientU
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].Ch
        var Ch_Piece = doc.createElement('Ch_Piece'); Ch_Piece.innerHTML = this.fieldArray[i].Ch_Piece
        var typeProduit = doc.createElement('typeProduit'); typeProduit.innerHTML = "Simple"
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(PrixRevientU);
        Produit.appendChild(Charge);
        Produit.appendChild(Ch_Piece);
        Produit.appendChild(typeProduit)
        Produits_Simples.appendChild(Produit);
      }
    }

    Produits.appendChild(Produits_Simples);
    Produits.appendChild(Produits_Series);
    Produits.appendChild(Produits_4Gs);
    Produits.appendChild(Produits_N_Lot)

    Produits.setAttribute('Fournisseur', this.InformationsGeneralesForm.get('Fournisseur').value);
    Produits.setAttribute('Local', this.InformationsGeneralesForm.get('Local').value);
    BEl.appendChild(Etat);
    BEl.appendChild(InformationsGenerales);
    BEl.appendChild(Taxes);
    BEl.appendChild(Total);
    BEl.appendChild(Produits)
    doc.appendChild(BEl)
    console.log(doc)
    let url = "assets/BonEntreeLocal.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonEntreeLocal.xml");
        formData.append('Details', myFile);
        formData.append('Id_Fr', this.InformationsGeneralesForm.get('Fournisseur').value);
        formData.append('Mode_Paiement', this.InformationsGeneralesForm.get('Mode_Paiement').value);
        formData.append('Charge_Transport', this.InformationsGeneralesForm.get('ChargeTransport').value);
        formData.append('Autre_Charge_Fixe', this.InformationsGeneralesForm.get('Autre_Charge_Fixe').value);
        formData.append('Ag_Ttransport', this.InformationsGeneralesForm.get('Ag_Ttransport').value);
        formData.append('Type', this.InformationsGeneralesForm.get('Type').value);
        formData.append('N_Facture', this.InformationsGeneralesForm.get('N_Facture').value);
        formData.append('Date_BEL', this.InformationsGeneralesForm.get('DateEntree').value);
        formData.append('Etat', "en cours");
        formData.append('Description', this.InformationsGeneralesForm.get('Des').value);
        formData.append('Local', this.InformationsGeneralesForm.get('Local').value);
        formData.append('id_Responsable', '');
        formData.append('Total_HT_Brut', this.totalHTBrut);
        formData.append('Total_Remise', this.totalRemise);
        formData.append('Total_HT_Net', this.totalHT);
        formData.append('Total_Fodec', this.totalMontantFodec);
        formData.append('Total_Tva', this.totalMontantTVA);
        formData.append('Total_TTC', this.totalTTc);
        formData.append('Total_R_HT', this.totalRHT);
        formData.append('Total_R_TTC', this.totalRTTC);

        this.bonEntreeService.ajouterBonEntreeLocal(formData).subscribe((data) => {
          this.reponseajout = data
          console.log(this.reponseajout)

          Swal.fire({
            title: "Bon d'entrée local ",
            text: "Bon d'entrée local ajouté avec succés",

            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: 'green',
            denyButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Imprimer',
            cancelButtonText: 'Quitter',
            denyButtonText: 'PDF & Annexe',

          }).then((result) => {


            if (result.isConfirmed) {
              this.generatePDF(this.reponseajout.id_Bon_Entree_Local, this.reponseajout.date_Creation)

            } else if (result.isDenied) {
              this.generatePDF_annexe(this.reponseajout.id_Bon_Entree_Local, this.reponseajout.date_Creation)

            }



          })
        });
      });

      // this.router.navigate(['Menu/Menu-achat/Menu-bon-entree/Lister-bon-entree'])
  }

 
    async generatePDF_annexe(id: any, date_Creation: any) {
    var body = [];
    var obj = new Array();
    obj.push(" ");
    obj.push(" ");
    obj.push(" ");
    body.push(obj);
    for (let i = 0; i < this.fieldArray.length; i++) {
      var obj = new Array();
      obj.push("" + this.fieldArray[i].Id_Produit);
      obj.push(this.fieldArray[i].Nom_Produit + " : " + this.fieldArray[i].des);
      obj.push(this.fieldArray[i].Quantite);

      body.push(obj);
    }
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');

    let def = {
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Réception',
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [

                {
                  text: currentPage.toString() + '/' + pageCount + "                                           éditer le  " + date_edit,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: ' Bon d’Entrée Local',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 80, y: 107 },

        },
        {
          text: sessionStorage.getItem('Utilisateur'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date_Creation, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96 },

        },

        {
          text: '' + this.InformationsGeneralesForm.get('Local').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 131 }
        },
        {
          text: '' + this.InformationsGeneralesForm.get('Fournisseur').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 100, y: 154 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('N_Facture').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 100, y: 179 }
        },
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 370, y: 182 }
        },
        {
          text: ' ' + this.InformationsGeneralesForm.get('Des').value,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 60, y: 665 }
        },
      ],


      background: [

        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ],


      content: [

        {
          layout: 'lightHorizontalLines',
          table: {
            widths: [80, 410, 38],
            body: body,
          },
          fontSize: 10,
          margin: [-16, -19, 10, 300]
        }


      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'bel'+id+'.pdf' });

   
    var body_4g = [];
    var obj_4g = new Array();
    obj_4g.push("ID");
    obj_4g.push("N/S");
    obj_4g.push("IMEI 1");
    obj_4g.push("IMEI 2");
    body_4g.push(obj_4g);
   
    var body_serie = [];
    var obj_s = new Array();
    obj_s.push("ID");
    obj_s.push("N/S");     
    body_serie.push(obj_s);

    var body_lot = [];
    var obj_lot = new Array();
    obj_lot.push("ID");  
    obj_lot.push("N° lot");  
    obj_lot.push("Quantite");  
    obj_lot.push("Date F");     
    obj_lot.push("Date V");    
    body_lot.push(obj_lot);


    for (let i = 0; i < this.fieldArray.length; i++) {
    
      if (this.fieldArray[i].N_Imei == "true") {
         
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
           obj_4g = new Array();
           obj_4g.push("" + this.fieldArray[i].Id_Produit);
           obj_4g.push( this.fieldArray[i].detail[j].ns )
           obj_4g.push( this.fieldArray[i].detail[j].e1 )
           obj_4g.push(this.fieldArray[i].detail[j].e2 )
          body_4g.push(obj_4g)
        }
     
      }
      else if (this.fieldArray[i].N_Serie == "true") {        
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          var obj_s = new Array();
          obj_s.push("" + this.fieldArray[i].Id_Produit);
          obj_s.push(this.fieldArray[i].detail[j].ns )    
          body_serie.push(obj_s)   
        }
      }
      else if (this.fieldArray[i].N_Lot == "true") {
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          var obj_lot = new Array();
          obj_lot.push("" + this.fieldArray[i].Id_Produit);
          obj_lot.push( this.fieldArray[i].detail[j].n_Lot )
          obj_lot.push(this.fieldArray[i].detail[j].qte)
          obj_lot.push(this.fieldArray[i].detail[j].date_fabrication )
          obj_lot.push( + this.fieldArray[i].detail[j].date_validite )
          body_lot.push(obj_lot)   
        }
      }
      
    }
    let date_edit2 = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');

    let def2 = {
      pageMargins: [40, 200, 40, 180],
      info: {
        title: 'Fiche annexe ',
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [

                {
                  text: currentPage.toString() + '/' + pageCount + "                                           éditer le  " + date_edit2,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: ' Bon d’Entrée Local',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 80, y: 96 },

        },
        {
          text: ' '+id,
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 200, y: 96 },

        },
        {
          text: sessionStorage.getItem('Utilisateur'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date_Creation, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96 },

        },

      ],

      background: [

        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
        }
      ],


      content: [
        {
          text: 'Liste des Produits 4G'    ,
          fontSize: 12,
          color: 'black',
          bold: true, 
        }, 
        {
           
          table: {
            widths: [120, 120, 120,120],
            body: body_4g,
          },
          fontSize: 10,
        
        },
         {
          text: 'Liste des Produits Série'    ,
          fontSize: 12,
          color: 'black',
          bold: true, 
        },
        {
          
          table: {
            widths: [120, 380],
            body: body_serie,
          },
          fontSize: 10,       
        }
        ,
        {
          text: 'Liste des Produits avec N° lot'    ,
          fontSize: 12,
          color: 'black',
          bold: true, 
        },
        {
          
          table: {
            widths: [120,100,60,95,95],
            body: body_lot,
          },
          fontSize: 10,
        
        }



      ],

    };
    
    await this.delai(2000);  
    pdfMake.createPdf(def2).open({ defaultFileName: 'Annexe_bel_'+id+'.pdf'  });
  }

  modeleSrc: any;modeleSrc2: any;
  ch: any;
  generatePDF(id: any, date_Creation: any) {

    var body = [];
    var obj = new Array();
    for (let i = 0; i < this.fieldArray.length; i++) {
      obj = new Array();
      obj.push("" + this.fieldArray[i].Id_Produit );
      let v ={ text: this.fieldArray[i].Nom_Produit +" : "+this.fieldArray[i].des+"\n", colSpan: 3 }
      obj.push(v)  
      obj.push(""); obj.push("");
      obj.push(""+this.fieldArray[i].Quantite)
      body.push(obj)
       
      if (this.fieldArray[i].N_Imei == "true") {         
         for (let j = 0; j < this.fieldArray[i].detail.length; j++) { 
           let obj2 = new Array();
           if(j==0){
            obj2.push("")  
            obj2.push("N/S :"+this.fieldArray[i].detail[j].ns )
            obj2.push("IMEI 1 :"+this.fieldArray[i].detail[j].e1 )
            obj2.push("IMEI 2 :"+this.fieldArray[i].detail[j].e2 )
            obj2.push("")
            body.push(obj2)   
           }else{
           obj2.push("") 
           obj2.push(".        "+this.fieldArray[i].detail[j].ns )
           obj2.push(".            "+this.fieldArray[i].detail[j].e1 )
           obj2.push(".            "+this.fieldArray[i].detail[j].e2 )
           obj2.push("")
           body.push(obj2)          
           }
         } 
      }
      else if (this.fieldArray[i].N_Serie == "true") {        
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          let obj2 = new Array();        
          if(j==0){
            obj2.push("")  
            let v ={ text: "N/S : "+this.fieldArray[i].detail[j].ns , colSpan: 3 }
            obj2.push(v)  
            obj2.push("");obj2.push("");             
            obj2.push("")
            body.push(obj2)   
           }else{
            obj2.push("")  
            let v ={ text: ".         "+this.fieldArray[i].detail[j].ns , colSpan: 3 }
            obj2.push(v)  
            obj2.push("");obj2.push("");             
            obj2.push("")
            body.push(obj2)         
           }
        }
      }
      else if (this.fieldArray[i].N_Lot == "true") {
        for (let j = 0; j < this.fieldArray[i].detail.length; j++) {
          let obj4 = new Array();
          if(j==0){
          
          obj4.push("")  
          obj4.push("N°L : " +this.fieldArray[i].detail[j].n_Lot )         
          obj4.push("D/F : "+this.fieldArray[i].detail[j].date_fabrication )
          obj4.push("D/V : " +this.fieldArray[i].detail[j].date_validite )
          obj4.push("")  
          body.push(obj4)   
         }else{
          obj4.push("")  
          obj4.push(".         " +this.fieldArray[i].detail[j].n_Lot )         
          obj4.push(".         "+this.fieldArray[i].detail[j].date_fabrication )
          obj4.push(".         " +this.fieldArray[i].detail[j].date_validite )
          obj4.push("")  
          body.push(obj4)          
         }
      
        }
      } 
       let obj3 = new Array();
       obj3.push("__________"  ); 
       obj3.push("_____________________________")  
       obj3.push("_____________________________"); obj3.push("_______________________________");
       obj3.push("_______")
       body.push(obj3) 
    } 
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM'); 
    let def = {
      pageMargins: [40, 250, 40, 180],
      info: {
        title: 'Fiche Bon Réception',
      },

      footer: function (currentPage: any, pageCount: any) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [

                {
                  text: currentPage.toString() + '/' + pageCount + "                                           éditer le  " + date_edit,
                }
              ],
              relativePosition: { x: 250, y: 130 }
            }
          ]
        };
      },
      header: [
        {
          text: ' Bon d’Entrée Local',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 80, y: 107 },

        },
        {
          text: sessionStorage.getItem('Utilisateur'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 390, y: 96 },

        },
        {
          text: '' + this.datePipe.transform(date_Creation, 'dd/MM/yyyy'),
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 520, y: 96 },

        },

        {
          text: '' + this.InformationsGeneralesForm.get('Local').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 131 }
        },
        {
          text: '' + this.InformationsGeneralesForm.get('Fournisseur').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 100, y: 154 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('N_Facture').value + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 100, y: 179 }
        },
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 370, y: 182 }
        },
        {
          text: ' ' + this.InformationsGeneralesForm.get('Des').value,
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 60, y: 665 }
        },
      ], 
      background: [

        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
        }
      ], 
      content: [
        {
          style: 'tableExample',
          color: '#444',
          fontSize: 10,
          layout: 'noBorders',
          margin: [-16, 10, 10, 300],       
          table: {
            widths: [60, 140, 140, 155,40],         
            body: body            
          }
        }
      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName:'bel'+id+'.pdf' });

  }



  //alert en cas Total_HT_Facture # Total_HT_Calculé!
  alertDifferentTotal() {
    //this.verifierCharge(event);
    this.activerCalcul();     
    this.actiververifCh();
    
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
    
      this.verifTotal = true;
      Swal.fire(
        'Attention!',
        'Total HT Facture # Total HT Calculé! ',
        'error'
      )
    }
    else {
      this.myStepper.next();
      this.verifTotal = false;
    }
  }
  //activer/desactiver step charges selon total HT
  VerificationTotal() {
    if (this.InformationsGeneralesForm.get('Totale_Facture').value != Number(this.totalHT)) {
      this.verifTotal = true;
    }
    else {
      this.verifTotal = false;

    }
  }
  actiververifCh() {
    //chaque seconde verifier le calcul
    
      this.verificationCh(event);
      this.VerificationTotal();
     
  }
}

