import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatStepper } from '@angular/material/stepper';
import { Router } from '@angular/router';
import { interval, Subscription } from 'rxjs';
import Swal from 'sweetalert2';
import { DevisService } from '../../services/devis.service';
import { DialogContentAddArticleDialogComponent } from './dialog-content-add-article-dialog/dialog-content-add-article-dialog.component';
import { UpdateDialogOverviewArticleDialogComponent } from './update-dialog-overview-article-dialog/update-dialog-overview-article-dialog.component';
import { VoirPlusDialogComponent } from './voir-plus-dialog/voir-plus-dialog.component';
//** import pdf maker */
const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ajouter-devis',
  templateUrl: './ajouter-devis.component.html',
  styleUrls: ['./ajouter-devis.component.scss'],
})

export class AjouterDevisComponent implements OnInit {
  isEditable = false;
  isLinear = false;
  infoFormGroup: FormGroup;
  addArticleFormGroup: FormGroup;
  addReglementFormGroup: FormGroup;
  modepaiement: any = [{ id: '1', name: 'Virement' }, { id: '2', name: 'Chèque' }, { id: '3', name: 'Carte Monétique' }, { id: '4', name: 'Espèces' }];
  currency: string[] = ['Euro', 'TND', 'Dollar'];
  show: number = 0;
  visibel: boolean = false;
  ligneOne: boolean = false;
  ligneTwo: boolean = false;
  currentDate = new Date();
  fournisseur: any;
  clients: any;
  clt: any = {};
  editable: boolean = false;
  articles: any = [];
  prod: any = {};
  devisArticls: any = [];
  code: string = '';
  dataArticle: any;
  Id_Produit: any;
  Ref_FR: any;
  N_Facture: any;
  Quantite: any = 1;
  Remise: any = 0;
  Prix: any = 0;
  IdProduit: any;
  Montant_TVA: any = 0;
  prix: any = 0;
  ref_FR: any;
  quantite: any = 0;
  id_produit: any;
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
  id: string = '';
  allProuduits: any;
  prodSended: any = [];
  totalMontantTVA: any = 0;
  totalMontantFodec: any = 0;
  totalHT: any = 0;
  totalHTBrut: any = 0;
  totalRemise: any = 0;
  totalFodec: any = 0;
  totalPorcentageFodec: any = 0;
  totalTTc: any = 0;
  totalChGlobale: any = 0;
  totalRHT: any = 0;
  totalRTTC: any = 0;
  totalPourcentCh: any = 0;
  subscription: Subscription;
  numDeviss: number = 1;
  isVerify: boolean = false;
  index: any = 0;
  latest_date: any;
  isError: boolean = false;
  modeleSrc: any;
  existInStoc: boolean = false;
  date: any;
  assiette: any = 0;
  montant: any = 0;
  assiette19: any = 0;
  assiette7: any = 0;
  assiette13: any = 0;
  montant19: any = 0;
  montant7: any = 0;
  montant13: any = 0;
  assiettetva19: any = 0;
  montanttva19: any = 0;
  assiettetva7: any = 0;
  montanttva7: any = 0;
  assiettetva13: any = 0;
  montanttva13: any = 0;
  etat: string = 'Dispo';
  qteStock: any;
  last_ID: any;
  verifTotal: boolean = true;
  sum = 0;
  modePaiement: any = '4';
  typeDevis: string = 'Estimatif';
  devise: any = 'TND'
  isCompleted: boolean = false;
  getProdId: boolean = false;
  getProdCode: boolean = false;
  price: any;
  secondValue: any;
  totalTTc_: any = 0
  totalTTc_reg: any = 0;
  isNull: boolean = false
  remiseDiff: any = 0;
  locals: any = []

  columns: any = ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;



  constructor(private _formBuilder: FormBuilder, private devisService: DevisService, public dialog: MatDialog, public datepipe: DatePipe, private router: Router) {
    this.latest_date = this.datepipe.transform(this.currentDate, 'dd/MM/YYYY');
    this.subscription = interval(10000).subscribe((v) => {
      this.calculTotal();
      this.calculAssiettes();
      this.modePaiement = this.infoFormGroup.get('modePaiement').value;
    });
    //this.getBase64ImageFromURL("./../../../../assets/images/vente/Devis_.jpg") 
  }

  ngOnInit(): void {
    //** init*/  
    this.getAllClient();
    this.getLocals();
    //** end */

    this.infoFormGroup = this._formBuilder.group({
      numDevis: [''],
      dateDevis: [''],
      local: ['', Validators.required],
      modePaiement: ['', Validators.required],
      typeDevis: ['', Validators.required],
      custemerName: ['', Validators.required],
      devise: ['', Validators.required],
      adresse: ['', Validators.required],
    });
    this.addArticleFormGroup = this._formBuilder.group({
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
      lengthTableDevis: [null, [Validators.required, Validators.min(1)]]
    });
    this.addReglementFormGroup = this._formBuilder.group({
      typeRegOne: ['', Validators.required],
      typeRegTwo: ['',],
      typeRegTree: ['',],
      valueOne: ['0', Validators.required],
      valueTwo: ['0',],
      valueTree: ['0',],
      note: ['',]
    });
  }
  // Get Locals 
  getLocals() {
    this.devisService.getLocals().subscribe((res: any) => {
      this.locals = res
    })
  }
  changeLocal(event: any) {
    // Delete table content if the location changes
    if (event.value) {
      this.devisArticls = [];
      this.totalHTBrut = 0;
      this.remiseDiff = 0;
      this.totalHT = 0;
      this.totalMontantFodec = 0;
      this.totalMontantTVA = 0;
      this.totalTTc = 0
    }
  }
  // viewPlus 
  viewPlus(prod: any) {
    const dialogRef = this.dialog.open(VoirPlusDialogComponent, {
      width: '100%', height: '700px', data: {
        formPage: prod, local: this.infoFormGroup.get('local').value.nom_Local, locals: this.locals
      }
    });
    dialogRef.afterClosed().subscribe(() => {
      console.log('Closed');

    })
  }
  //** Convert the Image in base64  */
  getBase64ImageFromURL(url: any) {
    return new Promise((resolve, reject) => {
      var img = new Image();
      img.setAttribute("crossOrigin", "anonymous");
      img.onload = () => {
        var canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        var ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        var dataURL = canvas.toDataURL("image/png");
        resolve(dataURL);
      };
      img.onerror = error => {
        reject(error);
      };
      img.src = url;
    });
  }
  //** Calcul */
  calculTotal() {
    let total1 = 0;
    let total2 = 0;
    let total3: any = 0;
    let total4 = 0;
    let total5 = 0;
    let total6 = 0;
    let total7 = 0;
    let total8 = 0;
    let total9 = 0;
    let total10 = 0;
    let total11 = 0;
    let total12 = 0;

    for (var i = 0; i < this.devisArticls.length; i++) {
      if (isNaN(this.devisArticls[i].montant_TVA) === false) {
        total1 += Number(this.devisArticls[i].montant_TVA)
        total2 += Number(this.devisArticls[i].montant_HT);
        this.totalHT = total2.toFixed(3);

        total4 += Number(this.devisArticls[i].ch_Globale);
        this.totalChGlobale = Number(total4).toFixed(3);
        total3 += Number(this.devisArticls[i].totale_TTC);
        this.totalTTc = Number(total3).toFixed(3);
        // totale ttc with remise
        total5 += Number(this.devisArticls[i].totale_TTC) - ((this.devisArticls[i].prixU * (Number(this.devisArticls[i].remise)) / 100) * this.devisArticls[i].quantite)
        this.totalRemise = Number(total5).toFixed(3);
        this.totalTTc_ = this.totalTTc;
        // ***
        total9 += (Number(this.devisArticls[i].fodec) * (Number(this.devisArticls[i].quantite)));
        this.totalPorcentageFodec = Number(total9).toFixed(3);
        total6 += ((Number(this.devisArticls[i].prixRevientU)) * (Number(this.devisArticls[i].quantite)));
        this.totalRHT = Number(total6).toFixed(3);
        total7 += ((Number(this.devisArticls[i].prixRevientU)) * (Number(this.devisArticls[i].quantite)) + Number(this.devisArticls[i].montant_TVA) + Number(this.devisArticls[i].montant_Fodec));
        this.totalRTTC = Number(total7).toFixed(3);
        total8 += Number(this.devisArticls[i].ch);
        this.totalPourcentCh = Number(total8).toFixed(3);
        this.newAttribute.totalPourcentCh = this.totalPourcentCh;
        total10 += Number(this.devisArticls[i].montant_Fodec);
        total11 += (Number(this.devisArticls[i].prixU) * Number(this.devisArticls[i].quantite));
        this.totalHTBrut = Number(total11).toFixed(3);
        this.totalMontantFodec = Number(total10).toFixed(3);
        this.totalMontantTVA = Number(total1).toFixed(3);
      }
      total12 = Number(this.totalTTc - this.totalRemise)
      this.remiseDiff = total12.toFixed(3)
    }

  }
  //** Calcul Assiettes TVA */
  calculAssiettes() {
    if (this.devisArticls.length == 0) {
      this.assiettetva19 = 0;
      this.montanttva19 = 0
      this.assiettetva7 = 0
      this.montanttva7 = 0
      this.assiettetva13 = 0;
      this.montanttva13 = 0;
    } else {
      this.assiettetva19 = 0;
      this.montanttva19 = 0;
      this.assiettetva7 = 0;
      this.montanttva7 = 0;
      this.assiettetva13 = 0;
      this.montanttva13 = 0;
      for (let i = 0; i < this.devisArticls.length; i++) {
        if (isNaN(this.devisArticls[i].montant_HT) === false) {
          if (this.devisArticls[i].tva == '19') {
            this.assiettetva19 += (Number(Number(this.devisArticls[i].montant_HT)));
            this.montanttva19 += Number(Number(Number(this.devisArticls[i].montant_TVA)) * (this.devisArticls[i].quantite));
            this.assiette19 = this.assiettetva19.toFixed(3);
            this.montant19 = this.montanttva19.toFixed(3);
          }
          else if (this.devisArticls[i].tva == '7') {
            this.assiettetva7 += Number(Number(this.devisArticls[i].montant_HT));
            this.montanttva7 += Number(Number(Number(this.devisArticls[i].montant_TVA) * Number(this.devisArticls[i].quantite)));
            this.assiette7 = this.assiettetva7.toFixed(3);
            this.montant7 = this.montanttva7.toFixed(3);
          }
          else if (this.devisArticls[i].tva == '13') {
            this.assiettetva13 += (Number(Number(this.devisArticls[i].montant_HT)));
            this.montanttva13 += (Number(Number(this.devisArticls[i].montant_TVA) * Number(this.devisArticls[i].quantite)));
            this.assiette13 = this.assiettetva13.toFixed(3);
            this.montant13 = this.montanttva13.toFixed(3);
          }
        }
      }
    }
  }

  //** open Dialog */
  openDialog() {
    const dialogRef = this.dialog.open(DialogContentAddArticleDialogComponent, {
      width: '100%',
      height: '700px', data: {
        fromPage: this.devisArticls,
        local: this.infoFormGroup.get('local').value.nom_Local
      }
    });
    dialogRef.afterClosed().subscribe(res => {

      //** Check if the product is in the previous table  */
      if (res != undefined) {
        for (let i = 0; i < res.data.length; i++) {
          let index = this.devisArticls.findIndex(((x: any) => parseInt(x.id_Produit) === parseInt(res.data[i].id_Produit)));

          if (index != -1) {
            this.devisArticls[index].quantite = parseInt(this.devisArticls[index].quantite);
            this.devisArticls[index].quantite += 1;
            this.devisArticls[index].prixU = Number(this.devisArticls[index].prixU).toFixed(3);
            this.devisArticls[index].finalPrice = (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)
            this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
            this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
            this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
            this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
            this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva) / 100);
            this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
            this.Total_HT = Number(this.devisArticls[index].finalPrice) * this.devisArticls[index].quantite;
            this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec) / this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
            this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
            this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
            this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC * this.devisArticls[index].quantite)).toFixed(3)
            this.devisArticls[index].totale_TTC = this.Totale_TTC;
            this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);
            this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);

            this.calculTotal();
            this.calculAssiettes();
            // Check availibility  
            this.devisService.quentiteProdLocal(res.data[i].id_Produit, this.infoFormGroup.get('local').value.nom_Local).subscribe((result: any) => {
              this.qteStock = result.body
              if (this.qteStock < this.devisArticls[index].quantite) {
                this.devisArticls[index].etat = 'Non Dispo.';
                this.typeDevis = 'Estimatif'
              } else {
                this.devisArticls[index].etat = 'Dispo.';
              }
            });

          } else {
            this.devisService.quentiteProdLocal(res.data[i].id_Produit, this.infoFormGroup.get('local').value.nom_Local).subscribe((result: any) => {
              this.qteStock = result.body

              if (this.qteStock < res.data[i].quantite) {
                res.data[i].etat = 'Non Dispo.';
                this.typeDevis = 'Estimatif'
              } else {
                res.data[i].etat = 'Dispo.';
              }
            });
            this.devisArticls.push(res.data[i]);
            this.calculTotal();
            this.calculAssiettes();
          }

        }
      }
    });
  }

  //** Plz choose at least one product in the next step */
  nextStep(stepper: MatStepper) {
    this.isNull = false;
    if ((this.totalTTc != 0)) {
      let totalTTc_reg = 0;
      for (let i = 0; i < this.devisArticls.length; i++) {
        totalTTc_reg += Number(this.devisArticls[i].totale_TTC);
      }
      this.totalTTc_reg = Number(totalTTc_reg).toFixed(3)
      this.addArticleFormGroup.controls['lengthTableDevis'].setValue(this.devisArticls.length);
      this.goForward(stepper);
      this.isNull = true;
    } else {
      this.isNull = false;
      Swal.fire(
        'Veuillez choisir au moins un produit');
    }
  }
  //** Go Forward  */
  goForward(stepper: MatStepper) {
    stepper.next();
  }
  //** Ckeck Total TTC in the reglement step */
  checkTotalTTC(stepper: MatStepper) {
    this.isCompleted = false;
    this.sum = (Number((this.addReglementFormGroup.get('valueOne').value)) + Number((this.addReglementFormGroup.get('valueTwo').value)) + Number((this.addReglementFormGroup.get('valueTree').value)));
    if (Number(this.sum).toFixed(3) != Number(this.totalTTc).toFixed(3)) {
      this.isCompleted = false;
      Swal.fire(
        'Attention! vérifiez le totale',
        'Total TTC!',
        'error');
    } else {
      this.isCompleted = true;
      this.goForward(stepper)
    }
  }
  // get price of the Reglement one 
  getvalueModePaiement(ev: any) {
    this.price = Number(ev).toFixed(3)
    if (this.price != undefined) {
      let rest
      this.visibel = true;
      if (parseInt(this.price) <= parseInt(this.totalTTc)) {
        rest = Number(this.totalTTc - this.price).toFixed(3);
        this.secondValue = rest;
        this.addReglementFormGroup.controls['valueTwo'].setValue(rest);

      } else {
        this.visibel = false;
      }
    }
  }
  //** Get the Second value */
  getvalueModePaiementTwo(ev: any) {
    this.secondValue = ev
    let rest_Two;
    this.ligneTwo = true;
    rest_Two = Number((this.totalTTc) - (this.price) - (this.secondValue)).toFixed(3);
    this.addReglementFormGroup.controls['valueTree'].setValue(rest_Two);
  }
  //** addReglement */
  addReglement() {
    let rest;
    (this.show < 0) ? this.show = 0 : console.log(this.sum);
    this.show++;
    if (this.show == 1) {
      this.ligneOne = true;
      if (parseInt(this.price) <= parseInt(this.totalTTc)) {
        rest = Number(this.totalTTc - this.price).toFixed(3);
        this.addReglementFormGroup.controls['valueTwo'].setValue(rest);
      } else {
        Swal.fire(
          'Attention! vérifiez le totale',
          'Total TTC!',
          'error');
      }
    }
    if (this.show == 2) {
      let rest_Two;
      this.ligneTwo = true;
      rest_Two = Number((this.totalTTc) - (this.price) - (this.secondValue)).toFixed(3);
      this.addReglementFormGroup.controls['valueTree'].setValue(rest_Two);
    }
  }
  // * DeleteReglement */
  deleteReglement(l: string) {
    if (l == '1') {
      this.ligneOne = false;
      this.isCompleted = false;
      this.sum -= Number((this.addReglementFormGroup.get('valueTwo').value));
      this.addReglementFormGroup.controls['valueTwo'].setValue(0);
      this.addReglementFormGroup.controls['typeRegTwo'].setValue('');
      (this.sum == this.totalTTc) ? this.isCompleted = true : this.isCompleted = false;
    }
    if (l == '2') {
      this.ligneTwo = false;
      this.sum -= Number((this.addReglementFormGroup.get('valueTree').value));
      this.addReglementFormGroup.controls['valueTree'].setValue(0);
      this.addReglementFormGroup.controls['typeRegTree'].setValue('');
      (this.sum == this.totalTTc) ? this.isCompleted = true : this.isCompleted = false;
    }
    if ((this.ligneOne == false) || (this.ligneTwo == false)) this.show--;
  }
  //** Error Message

  ErrorMessage(field: string) {
    if (this.infoFormGroup.get(field).hasError('required')) {
      return 'Vous devez entrer ';
    }
    else {
      return '';
    }
  }

  //** Get All Client  */
  getAllClient() {
    this.devisService.getAllClient().subscribe(res => {
      this.clients = res;
    });
  }
  //** Get Client by ID */
  getClientId(event: any) {
    this.devisService.getClientById(event.id_Clt.toString()).subscribe(res => {
      this.clt = res.body;
    });
    this.editable = true;
  }

  //** Product is in stock  */
  isInStock(id: any) {
    this.devisService.quentiteProdLocal(id, this.infoFormGroup.get('local').value.nom_Local).subscribe((res: any) => {
      var existInStoc = false;
      if (res.body != null) {
        existInStoc = true;
      } else {
        existInStoc = false;
      }
      this.existInStoc = existInStoc;
    });
  }
  //** Get Article By ID */
  async getProuduitById() {
    this.getProdId = true;
    this.newAttribute = {};
    let idProd = this.id;
    this.last_ID = this.id;
    let index = this.devisArticls.findIndex(((x: any) => parseInt(x.id_Produit) === parseInt(this.last_ID)));
    //** Fetch if this product is exist in devisArticls or not  */ 
    if ((index === -1) && (idProd != undefined)) {
      this.devisService.getArticleById(idProd).subscribe((res) => {
        if (res.body === null) {
          Swal.fire({
            title: 'Il n\'y a pas de produit avec ce code!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ok',
          });
          this.getProdId = false;
        } else {
          if (parseInt(res.body.tva) === 0) {
            Swal.fire({
              title: 'Désolé, vous ne pouvez pas ajouter ce produit! avec TVA = 0',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Ok',
            });
            this.getProdId = false;
          } else {
            this.dataArticle = res.body;
            this.newAttribute.id_Produit = idProd;
            this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
            this.newAttribute.n_Imei = this.dataArticle.n_Imei;
            this.newAttribute.n_Serie = this.dataArticle.n_Serie;
            this.newAttribute.tva = this.dataArticle.tva;
            this.tva = this.newAttribute.tva;
            this.newAttribute.ch = this.Ch;
            this.newAttribute.chargeTr = this.ChargeTransport;
            this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
            this.newAttribute.quantite = Number(this.Quantite);
            this.newAttribute.remise = Number(this.Remise);
            if (this.dataArticle.fodec == "Sans_Fodec") {
              this.newAttribute.fodec = 0;
            }
            else {
              this.newAttribute.fodec = 1;
            }
            this.fodec = this.newAttribute.fodec;
            // get Prix U from stocks 
            this.devisService.getInfoProductByIdFromStock(idProd).subscribe((res: any) => {
              // if not exist in the table stocks 
              if ((res.body) === null) {
                Swal.fire({
                  title: "Entrez le prix!",
                  input: 'text',
                  showCancelButton: true
                }).then((result) => {
                  if (result.value) {
                    this.newAttribute.prixU = Number(result.value).toFixed(3);
                    this.newAttribute.finalPrice = (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)

                    this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                    this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                    this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                    this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
                    // Montant Tva u = (prix*tva)/100
                    this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva) / 100);
                    this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                    // Total ht = prix * qt
                    this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite);
                    this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                    //  prix u ttc = prix u  + montant tva u 
                    this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec) / this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);

                    this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                    //  total ttc = prix u ttc * qte
                    this.Totale_TTC = Number((this.newAttribute.prix_U_TTC * this.newAttribute.quantite)).toFixed(3);
                    this.newAttribute.totale_TTC = this.Totale_TTC;

                  } else {
                    this.devisArticls.pop();
                  }
                });
                this.devisArticls.push(this.newAttribute);
                this.calculTotal();
                this.calculAssiettes();
                this.devisArticls.sort = this.sort;
                this.devisArticls.paginator = this.paginator;
                this.typeDevis = 'Estimatif'
                this.newAttribute.etat = 'Non Dispo.'
                this.qteStock = 0;
              }
              else {
                this.devisService.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any) => {
                  this.qteStock = ress.body;
                  this.newAttribute.prixU = Number(res.body.prix).toFixed(3);
                  this.newAttribute.finalPrice = (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)

                  this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                  this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                  this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                  this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);

                  // Montant Tva u = (prix*tva)/100
                  this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva) / 100);
                  this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                  // Total ht = prix * qt
                  this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite);
                  this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                  //  prix u ttc = prix u  + montant tva u 
                  this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec) / this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);;

                  this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  //  total ttc = prix u ttc * qte
                  this.Totale_TTC = Number(this.newAttribute.prix_U_TTC * this.newAttribute.quantite).toFixed(3);
                  this.newAttribute.totale_TTC = this.Totale_TTC;

                  this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                  this.newAttribute.ch_Globale = Number(this.Ch_Globale);

                  this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                  this.newAttribute.fichierSimple = "";
                  this.newAttribute.fichierSerie = "";
                  this.newAttribute.fichier4G = "";
                  this.newAttribute.produitsSeries = "";
                  this.newAttribute.produits4g = "";
                  // check availability

                  if (this.qteStock < this.newAttribute.quantite) {
                    this.newAttribute.etat = 'Non Dispo.';
                    this.typeDevis = 'Estimatif'
                  } else {
                    this.newAttribute.etat = 'Dispo.'
                  }
                  this.devisArticls.push(this.newAttribute);
                  this.calculTotal();
                  this.calculAssiettes();
                  this.devisArticls.sort = this.sort;
                  this.devisArticls.paginator = this.paginator;
                });
              }
              this.last_ID = this.id;
              this.id = '';
            });
          }
          this.getProdId = false;
        }
      }, (err: any) => {
        console.log(err);

        Swal.fire({
          title: 'Il n\'y a pas de produit avec ce code!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ok',
        });
        this.getProdId = false;
      });
    } // if this product exist 
    else {
      this.devisService.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any) => {
        this.qteStock = ress.body;
        this.devisArticls[index].quantite = parseInt(this.devisArticls[index].quantite);
        this.devisArticls[index].quantite += 1;
        this.devisArticls[index].prixU = Number(this.devisArticls[index].prixU).toFixed(3);
        this.devisArticls[index].finalPrice = (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)

        this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
        this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
        this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
        this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);

        this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva) / 100);
        this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);

        this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);
        this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec) / this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
        this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
        this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
        this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC * this.devisArticls[index].quantite)).toFixed(3)
        this.devisArticls[index].totale_TTC = this.Totale_TTC;
        this.Total_HT = Number(this.devisArticls[index].finalPrice * this.devisArticls[index].quantite);
        this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);
        this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);

        // Check availibility 
        if (this.qteStock < this.devisArticls[index].quantite) {
          this.devisArticls[index].etat = 'Non Dispo.';
          this.typeDevis = 'Estimatif'
        } else {
          this.devisArticls[index].etat = 'Dispo.';
        }
        this.calculTotal();
        this.calculAssiettes();
        this.getProdId = false;
      });
    }

  }

  //** Get Article By Code A Bare */
  async getProuduitByCode() {
    this.getProdCode = true;
    this.devisService.getArrByCodeBare(this.code).subscribe((res: any) => {
      if ((res.body === null) || (this.code = undefined)) {
        Swal.fire({
          title: 'Il n\'y a pas de produit avec ce code!',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Ok',
        });
        this.getProdCode = false;
      }
      else {
        if (parseInt(res.body.tva) === 0) {
          Swal.fire({
            title: 'Désolé, vous ne pouvez pas ajouter ce produit! avec TVA = 0',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Ok',
          });
          this.getProdCode = false;
        } else {
          this.newAttribute = {};
          this.last_ID = res.body.id_Produit;
          let index = this.devisArticls.findIndex(((x: any) => parseInt(x.id_Produit) === parseInt(this.last_ID)));
          if (index === -1) {
            let idProd = res.body.id_Produit;
            this.devisService.getArticleById(idProd).subscribe((res) => {
              this.dataArticle = res.body;
              this.newAttribute.id_Produit = idProd;
              this.newAttribute.nom_Produit = this.dataArticle.nom_Produit;
              this.newAttribute.n_Imei = this.dataArticle.n_Imei;
              this.newAttribute.n_Serie = this.dataArticle.n_Serie;
              this.newAttribute.tva = this.dataArticle.tva;
              this.tva = this.newAttribute.tva;
              this.newAttribute.ch = this.Ch;
              this.newAttribute.chargeTr = this.ChargeTransport;
              this.newAttribute.autreCharge = this.Autre_Charge_Fixe;
              this.newAttribute.quantite = Number(this.Quantite);
              this.newAttribute.remise = Number(this.Remise);

              if (this.dataArticle.fodec == "Sans_Fodec") {
                this.newAttribute.fodec = 0;
              }
              else {
                this.newAttribute.fodec = 1;
              }
              this.fodec = this.newAttribute.fodec;
              // get Prix U HT
              this.devisService.getInfoProductByIdFromStock(idProd).subscribe((res: any) => {
                if ((res.body) === null) {
                  Swal.fire({
                    title: "Entrez le prix!",
                    input: 'text',
                    showCancelButton: true
                  }).then((result) => {
                    if (result.value) {
                      this.newAttribute.prixU = Number(result.value).toFixed(3);
                      this.newAttribute.finalPrice = (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)

                      this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                      this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                      this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                      this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);
                      // Montant Tva u = (prix*tva)/100
                      this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva) / 100);
                      this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                      // Total ht = prix * qt
                      this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite);
                      this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                      //  prix u ttc = prix u  + montant tva u 
                      this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec) / this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);;

                      this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                      this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                      //  total ttc = prix u ttc * qte / remise
                      this.Totale_TTC = Number(this.newAttribute.prix_U_TTC * this.newAttribute.quantite * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3)
                      this.newAttribute.totale_TTC = this.Totale_TTC;
                    } else {
                      this.devisArticls.pop();
                    }
                  });
                  this.devisArticls.push(this.newAttribute);
                  this.calculTotal();
                  this.calculAssiettes();

                  this.devisArticls.sort = this.sort;
                  this.devisArticls.paginator = this.paginator;
                  this.typeDevis = 'Estimatif'
                  this.newAttribute.etat = 'Non Dispo.'
                  this.qteStock = 0;
                }
                else {
                  this.devisService.quentiteProdLocal(idProd, this.infoFormGroup.get('local').value.nom_Local).subscribe((ress: any) => {
                    this.qteStock = ress.body;

                    this.newAttribute.prixU = Number(res.body.prix).toFixed(3);
                    this.newAttribute.finalPrice = (this.newAttribute.prixU - (this.newAttribute.prixU * (Number(this.newAttribute.remise)) / 100)).toFixed(3)

                    this.newAttribute.montant_HT = ((Number(this.newAttribute.prixU) * Number(this.newAttribute.quantite)) * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3);
                    this.newAttribute.qprixU = Number(this.Prix).toFixed(3);
                    this.Montant_Fodec = (this.newAttribute.montant_HT * this.newAttribute.fodec) / 100;
                    this.newAttribute.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);

                    // Montant Tva u = (prix*tva)/100
                    this.Montant_TVA = Number(this.newAttribute.finalPrice) * Number((this.newAttribute.tva) / 100);
                    this.newAttribute.montant_TVA = Number(this.Montant_TVA).toFixed(3);
                    // Total ht = prix * qt
                    this.Total_HT = Number(this.newAttribute.finalPrice * this.newAttribute.quantite);
                    this.newAttribute.total_HT = Number(this.Total_HT).toFixed(3);
                    //  prix u ttc = prix u  + montant tva u 
                    this.newAttribute.prix_U_TTC = (((Number(this.newAttribute.finalPrice) + Number((this.newAttribute.montant_Fodec) / this.newAttribute.quantite) + Number(this.newAttribute.montant_TVA)))).toFixed(3);;

                    this.newAttribute.montant_TTC = Number(this.newAttribute.prix_U_TTC) * Number(this.newAttribute.quantite);
                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                    //  total ttc = prix u ttc * qte / remise
                    this.Totale_TTC = Number(this.newAttribute.prix_U_TTC * this.newAttribute.quantite * (1 - (Number(this.newAttribute.remise)) / 100)).toFixed(3)
                    this.newAttribute.totale_TTC = this.Totale_TTC;

                    this.newAttribute.total_TVA = ((Number(this.newAttribute.montant_TVA)) / (Number(this.newAttribute.quantite))).toFixed(3);
                    this.newAttribute.ch_Globale = Number(this.Ch_Globale);

                    this.newAttribute.etatEntree = "Entrée Stock Non Accompli";
                    this.newAttribute.fichierSimple = "";
                    this.newAttribute.fichierSerie = "";
                    this.newAttribute.fichier4G = "";
                    this.newAttribute.produitsSeries = "";
                    this.newAttribute.produits4g = "";
                    // check availability
                    if (this.qteStock < this.newAttribute.quantite) {
                      this.newAttribute.etat = 'Non Dispo.';
                      this.typeDevis = 'Estimatif'
                    } else {
                      this.newAttribute.etat = 'Dispo.'
                    }
                    this.devisArticls.push(this.newAttribute);
                    this.calculTotal();
                    this.calculAssiettes();
                    this.devisArticls.sort = this.sort;
                    this.devisArticls.paginator = this.paginator;
                  });
                }
              });
              this.getProdCode = false;
            });
            this.code = '';
            // if this product exist
          } else {
            this.devisArticls[index].quantite = parseInt(this.devisArticls[index].quantite);
            this.devisArticls[index].quantite += 1;
            this.devisArticls[index].prixU = Number(this.devisArticls[index].prixU).toFixed(3);
            this.devisArticls[index].finalPrice = (this.devisArticls[index].prixU - (this.devisArticls[index].prixU * (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)

            this.devisArticls[index].montant_HT = ((Number(this.devisArticls[index].prixU) * Number(this.devisArticls[index].quantite)) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3);
            this.devisArticls[index].qprixU = Number(this.Prix).toFixed(3);
            this.Montant_Fodec = (this.devisArticls[index].montant_HT * this.devisArticls[index].fodec) / 100;
            this.devisArticls[index].montant_Fodec = Number(this.Montant_Fodec).toFixed(3);

            this.Montant_TVA = Number(this.devisArticls[index].finalPrice) * Number((this.devisArticls[index].tva) / 100);
            this.devisArticls[index].montant_TVA = Number(this.Montant_TVA).toFixed(3);

            this.devisArticls[index].prix_U_TTC = (((Number(this.devisArticls[index].finalPrice) + Number((this.devisArticls[index].montant_Fodec) / this.devisArticls[index].quantite) + Number(this.devisArticls[index].montant_TVA)))).toFixed(3);;
            this.devisArticls[index].montant_TTC = Number(this.devisArticls[index].prix_U_TTC) * Number(this.devisArticls[index].quantite);
            this.devisArticls[index].total_TVA = ((Number(this.devisArticls[index].montant_TVA)) / (Number(this.devisArticls[index].quantite))).toFixed(3);
            this.Totale_TTC = Number((this.devisArticls[index].prix_U_TTC * this.devisArticls[index].quantite) * (1 - (Number(this.devisArticls[index].remise)) / 100)).toFixed(3)
            this.devisArticls[index].totale_TTC = this.Totale_TTC;

            this.Total_HT = Number(this.devisArticls[index].finalPrice) * this.devisArticls[index].quantite;
            this.devisArticls[index].total_HT = Number(this.Total_HT).toFixed(3);
            this.devisArticls[index].ch_Globale = Number(this.Ch_Globale);
            // Check availibility 
            if (this.qteStock < this.devisArticls[index].quantite) {
              this.devisArticls[index].etat = 'Non Dispo.';
              this.typeDevis = 'Estimatif'
            } else {
              this.devisArticls[index].etat = 'Dispo.';
            }
            this.calculTotal();
            this.calculAssiettes();
            this.getProdCode = false;
          }
        }

      }
    }, (err: any) => {
      console.log(err);
      Swal.fire({
        title: 'Il n\'y a pas de produit avec ce code!',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Ok',
      });
      this.getProdCode = false;
    }
    );
  }
  //** Delete Item from the Table */
  deleteItemValue(index: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez le',
      cancelButtonText: 'Non, garde le'
    }).then((res) => {
      if (res.value) {
        this.devisArticls.splice(index, 1);
        this.calculTotal();
        this.calculAssiettes();
      } else if (res.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    }
    );
    this.calculTotal();
    this.calculAssiettes();
  }
  //** Update item from the Table  */
  async ouvreDialogueArticle(index: number, item: any, table: any) {
    const dialogRef = this.dialog.open(UpdateDialogOverviewArticleDialogComponent, {
      width: '100%', height: '300px',
      data: { index: index, ligne: item, table: table }
    });
    dialogRef.afterClosed().subscribe(res => {
      this.isInStock(item.id_Produit);
      item.quantite = res.qte_modifier;
      item.quantite = parseInt(item.quantite);
      item.prixU = res.prixU_modifier;
      item.remise = res.remise_modifier;
      item.finalPrice = (item.prixU - (item.prixU * (Number(item.remise)) / 100)).toFixed(3)
      item.montant_HT = ((Number(item.prixU) * Number(item.quantite)) * (1 - (Number(item.remise)) / 100)).toFixed(3);
      this.Montant_Fodec = (item.montant_HT * item.fodec) / 100;
      item.montant_Fodec = Number(this.Montant_Fodec).toFixed(3);

      this.Montant_TVA = Number(item.finalPrice) * Number((item.tva) / 100);
      item.montant_TVA = Number(this.Montant_TVA).toFixed(3);
      item.prix_U_TTC = (((Number(item.finalPrice) + Number((item.montant_Fodec) / item.quantite) + Number(item.montant_TVA)))).toFixed(3);;

      item.total_TVA = ((Number(item.montant_TVA)) / (Number(item.quantite))).toFixed(3);

      item.montant_TTC = Number(item.prix_U_TTC) * Number(item.quantite);
      item.ch = ((((Number(item.PrixU)) / Number(item.totalFacture)) * 100) * Number(item.quantite)).toFixed(3);
      item.ch_Piece = (((((Number(item.chargeTr) + Number(item.autreCharge)) * Number(item.ch)) / 100)) / (Number(item.quantite))).toFixed(3);
      item.prixRevientU = (Number(item.prixU) + Number(item.ch_Piece)).toFixed(3);

      item.total_HT = Number(item.finalPrice * item.quantite).toFixed(3);
      this.Totale_TTC = Number(((Number(item.prix_U_TTC) * item.quantite))).toFixed(3)
      item.totale_TTC = this.Totale_TTC;

      if (this.qteStock < item.quantite) {
        item.etat = 'Non Dispo.';
      } else {
        item.etat = 'Dispo.'
      }
      this.calculTotal();
      this.calculAssiettes();
    });
    this.calculTotal();
    this.calculAssiettes();
  }

  contenuTable(data: any, columns: any) {
    var body = [];

    body.push(columns);
    this.devisArticls.forEach((row: any) => {
      var dataRow: any = [];
      // ['id_Produit', 'nom_Produit', 'prixU', 'remise', 'quantite', 'tva', 'total_HT']   
      this.columns.forEach((column: any) => {
        dataRow.push(row[column]);
      });
      body.push(dataRow);
    });
    return body;
  }
  //** Generate a table */
  generateTable(data: any, columns: any) {
    return {
      table: {
        headerRows: 1,
        bold: true,
        body: this.contenuTable(data, columns),
        alignment: "center"
      }, layout: 'headerLineOnly',
    };
  }

  //** The XML structure */
  createXMLStructure(url: string, data: any) {
    let typeRegUn: any;
    let typeRegDeux: any;
    let typeRegTrois: any;
    if (this.addReglementFormGroup.get('typeRegOne').value == '4')
      typeRegUn = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegOne').value == '1') {
      typeRegUn = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegOne').value == '2') {
      typeRegUn = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegOne').value == '3') {
      typeRegUn = 'Monétique';
    }
    if (this.addReglementFormGroup.get('typeRegTwo').value == '4')
      typeRegDeux = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegTwo').value == '1') {
      typeRegDeux = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegTwo').value == '2') {
      typeRegDeux = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegTwo').value == '3') {
      typeRegDeux = 'Monétique';
    }
    if (this.addReglementFormGroup.get('typeRegTree').value == '4')
      typeRegTrois = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegTree').value == '1') {
      typeRegTrois = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegTree').value == '2') {
      typeRegTrois = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegTree').value == '3') {
      typeRegTrois = 'Monétique';
    }
    var doc = document.implementation.createDocument(url, 'Devis', null);
    var etatElement = doc.createElement("Etat");
    var infoElement = doc.createElement("Informations-Generales");
    var total = doc.createElement('Total');
    var typeElement = doc.createElement("Type");
    var idFrElement = doc.createElement("Id_Fr");
    var idCLTElement = doc.createElement("Id_Clt");
    var typeDevise = doc.createElement('Devise')
    var adress = doc.createElement("Local");
    var depot = doc.createElement("Depot");
    var modepaiement = doc.createElement("Mode_Paiement");
    var totalHTBrut = doc.createElement("TotalHTBrut");
    var totalRemise = doc.createElement("TotalRemise");
    var totalHTNet = doc.createElement("TotalHTNet");
    var totalFodec = doc.createElement("TotalFodec");
    var totalTVA = doc.createElement("TotalTVA");
    var totalTTC = doc.createElement("TotalTTC");
    var Produits = doc.createElement('Produits')
    var Produits_Series = doc.createElement('Produits_Series')
    var Produits_4Gs = doc.createElement('Produits_4Gs')
    var Produits_Simples = doc.createElement('Produits_Simples')
    var signaler_Probleme = doc.createElement("Signaler_Probleme");

    //** TVA* */
    var Taxes = doc.createElement("Taxes");
    var TVA = doc.createElement("TVA");

    var TVA19 = doc.createElement("TVA19");
    var Assiette19 = doc.createElement("Assiette"); Assiette19.innerHTML = this.assiette19;
    var Montant_TVA19 = doc.createElement("Montant"); Montant_TVA19.innerHTML = this.montant19;
    TVA19.appendChild(Assiette19);
    TVA19.appendChild(Montant_TVA19);

    var TVA7 = doc.createElement("TVA7");
    var Assiette7 = doc.createElement("Assiette"); Assiette7.innerHTML = this.assiette7;
    var Montant_TVA7 = doc.createElement("Montant"); Montant_TVA7.innerHTML = this.montant7;
    TVA7.appendChild(Assiette7);
    TVA7.appendChild(Montant_TVA7);

    var TVA13 = doc.createElement("TVA13");
    var Assiette13 = doc.createElement("Assiette"); Assiette13.innerHTML = this.assiette13;
    var Montant_TVA13 = doc.createElement("Montant"); Montant_TVA13.innerHTML = this.montant13;
    TVA13.appendChild(Assiette13);
    TVA13.appendChild(Montant_TVA13);


    var Fodec = doc.createElement("Fodec"); Fodec.innerHTML = this.totalFodec

    TVA.appendChild(TVA19);
    TVA.appendChild(TVA13);
    TVA.appendChild(TVA7);

    Taxes.appendChild(TVA);
    Taxes.appendChild(Fodec);

    //** Type de reglements  */
    var Type_Reglement = doc.createElement("Reglements");
    //Reglement_Un 
    var reglementUn = doc.createElement("Reglement");
    var codeTypaRegOne = doc.createElement("code_Type_Reglement_Un"); codeTypaRegOne.innerHTML = this.addReglementFormGroup.get('typeRegOne').value;
    var typeRegOne = doc.createElement("Type_Reglement_Un"); typeRegOne.innerHTML = typeRegUn;
    var valueRegOne = doc.createElement("Value_Reglement_Un"); valueRegOne.innerHTML = this.price;
    reglementUn.appendChild(codeTypaRegOne);
    reglementUn.appendChild(typeRegOne);
    reglementUn.appendChild(valueRegOne);
    Type_Reglement.appendChild(reglementUn);
    // Reglement_Deux
    var reglementDeux = doc.createElement("Reglement");
    if (typeRegDeux != undefined) {
      var codeTypaRegTwo = doc.createElement("code_Type_Reglement_Deux"); codeTypaRegTwo.innerHTML = this.addReglementFormGroup.get('typeRegTwo').value;
      var typeRegTwo = doc.createElement("Type_Reglement_Deux"); typeRegTwo.innerHTML = typeRegDeux;
      var valueRegTwo = doc.createElement("Value_Reglement_Deux"); valueRegTwo.innerHTML = this.addReglementFormGroup.get('valueTwo').value;
      reglementDeux.appendChild(codeTypaRegTwo);
      reglementDeux.appendChild(typeRegTwo);
      reglementDeux.appendChild(valueRegTwo);
      Type_Reglement.appendChild(reglementDeux);
    }

    // Reglement_Trois
    var reglementTrois = doc.createElement("Reglement");

    if (typeRegTrois != undefined) {
      var codeTypaRegTree = doc.createElement("code_Type_Reglement_Trois"); codeTypaRegTree.innerHTML = this.addReglementFormGroup.get('typeRegTree').value;
      var typeRegTwo = doc.createElement("Type_Reglement_Trois"); typeRegTwo.innerHTML = typeRegTrois;
      var valueRegTwo = doc.createElement("Value_Reglement_Trois"); valueRegTwo.innerHTML = this.addReglementFormGroup.get('valueTree').value;
      reglementTrois.appendChild(codeTypaRegTree)
      reglementTrois.appendChild(typeRegTwo);
      reglementTrois.appendChild(valueRegTwo);
      Type_Reglement.appendChild(reglementTrois);
    }





    //******* */

    Produits.setAttribute('Client', this.infoFormGroup.get('custemerName').value.nom_Client);
    Produits.setAttribute('Local', this.infoFormGroup.get('local').value.nom_Local);

    var nameEtat = "En cours";
    var typeName = "Devis";
    var devise = this.infoFormGroup.get('devise').value;
    var locale_depot = this.infoFormGroup.get('local').value.id_Local;
    var signaler_Prob = doc.createTextNode("True");
    var modepaiementName = doc.createTextNode(this.infoFormGroup.get('modePaiement').value)
    var adressName = doc.createTextNode(this.infoFormGroup.get('adresse').value)
    var id_Clt = doc.createTextNode(this.infoFormGroup.get('custemerName').value.id_Clt);
    var id_Fr = doc.createTextNode('1');


    var totalHTBrutName = doc.createTextNode(this.totalHTBrut);
    var totalRemisetName = doc.createTextNode(this.remiseDiff);
    var totalHTNetName = doc.createTextNode(this.totalHT);
    var totalFodecName = doc.createTextNode(this.totalMontantFodec);
    var totalTVAName = doc.createTextNode(this.totalMontantTVA);
    var totalTTCName = doc.createTextNode(this.totalTTc);
    //******* */
    signaler_Probleme.appendChild(signaler_Prob)
    etatElement.innerHTML = nameEtat;
    idCLTElement.appendChild(id_Clt);
    idFrElement.appendChild(id_Fr);
    typeElement.innerHTML = typeName;
    typeDevise.innerHTML = devise
    adress.appendChild(adressName);
    modepaiement.appendChild(modepaiementName);
    depot.innerHTML = locale_depot;

    totalHTBrut.appendChild(totalHTBrutName);
    totalRemise.appendChild(totalRemisetName);
    totalHTNet.appendChild(totalHTNetName);
    totalFodec.appendChild(totalFodecName);
    totalTVA.appendChild(totalTVAName);
    totalTTC.appendChild(totalTTCName);

    infoElement.appendChild(idCLTElement);
    infoElement.appendChild(idFrElement);
    infoElement.appendChild(typeElement);
    infoElement.appendChild(adress);
    infoElement.appendChild(modepaiement);
    infoElement.appendChild(typeDevise);
    infoElement.appendChild(depot);

    total.appendChild(totalHTBrut);
    total.appendChild(totalRemise);
    total.appendChild(totalHTNet);
    total.appendChild(totalTVA);
    total.appendChild(totalTTC);
    total.appendChild(totalFodec);

    //** Add Produits */
    for (let i = 0; i < this.devisArticls.length; i++) {
      if (this.devisArticls[i].n_Imei == "true") {
        this.devisArticls[i].signaler_probleme = true;
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.devisArticls[i].totale_TTC
        var vProduit_4Gs = doc.createElement('Produit_4Gs');
        var Prix_U_TTC = doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML = this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT'); Total_HT.innerHTML = this.devisArticls[i].total_HT;


        if (this.devisArticls[i].tableaux_produits_emie != undefined) {
          for (let j = 0; j < this.devisArticls[i].tableaux_produits_emie.length; j++) {
            var Produit_4G = doc.createElement('Produit_4G');
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].n_serie
            var E1 = doc.createElement('E1'); E1.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].e1
            var E2 = doc.createElement('E2'); E2.innerHTML = this.devisArticls[i].tableaux_produits_emie[j].e2
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
          }
        } else {
          for (let j = 0; j < this.devisArticls[i].quantite; j++) {
            let tableaux_produits_emie: any = {};
            var Produit_4G = doc.createElement('Produit_4G');
            tableaux_produits_emie.n_serie = '0',
              tableaux_produits_emie.e1 = '0';
            tableaux_produits_emie.e2 = '0';
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = tableaux_produits_emie.n_serie
            var E1 = doc.createElement('E1'); E1.innerHTML = tableaux_produits_emie.e1
            var E2 = doc.createElement('E2'); E2.innerHTML = tableaux_produits_emie.e2
            Produit_4G.appendChild(N_Serie);
            Produit_4G.appendChild(E1);
            Produit_4G.appendChild(E2);
            vProduit_4Gs.appendChild(Produit_4G);
          }
        }


        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat)
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(vProduit_4Gs);
        Produit.appendChild(PrixU)
        Produit.appendChild(TotalFacture)
        Produit.appendChild(PrixU)
        Produits_4Gs.appendChild(Produit);
      }
      else if (this.devisArticls[i].n_Serie == "true") {
        this.devisArticls[i].signaler_probleme = true;
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit;
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise;
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.devisArticls[i].totale_TTC
        var vN_Series = doc.createElement('N_Series');
        var Prix_U_TTC = doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML = this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT'); Total_HT.innerHTML = this.devisArticls[i].total_HT;


        if (this.devisArticls[i].tableaux_produits_serie != undefined) {
          for (let j = 0; j < this.devisArticls[i].tableaux_produits_serie.length; j++) {
            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.devisArticls[i].tableaux_produits_serie[j]
            vN_Series.appendChild(N_Serie);
          }
        } else {
          for (let j = 0; j < this.devisArticls[i].quantite; j++) {
            let n_serie = '0'

            var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = n_serie
            vN_Series.appendChild(N_Serie);
          }
        }


        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(vN_Series)
        Produit.appendChild(PrixU)
        Produit.appendChild(TotalFacture)

        Produits_Series.appendChild(Produit);
      }
      else {
        this.devisArticls[i].signaler_probleme = true;
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.devisArticls[i].id_Produit;
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.devisArticls[i].nom_Produit;
        var Etat = doc.createElement('Etat'); Etat.innerHTML = this.devisArticls[i].etat;
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.devisArticls[i].remise;
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.devisArticls[i].n_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.devisArticls[i].n_Serie;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.devisArticls[i].signaler_probleme
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.devisArticls[i].quantite
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.devisArticls[i].tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.devisArticls[i].montant_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.devisArticls[i].fodec
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.devisArticls[i].prixU
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.devisArticls[i].totale_TTC
        var Prix_U_TTC = doc.createElement('PrixUTTC'); Prix_U_TTC.innerHTML = this.devisArticls[i].prix_U_TTC;
        var Total_HT = doc.createElement('Total_HT'); Total_HT.innerHTML = this.devisArticls[i].total_HT;



        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Etat);
        Produit.appendChild(Prix_U_TTC);
        Produit.appendChild(Total_HT);
        Produit.appendChild(Remise);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Qte);
        Produit.appendChild(Tva);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(TotalFacture)
        Produit.appendChild(PrixU)

        Produits_Simples.appendChild(Produit);
      }
    }
    Produits.appendChild(Produits_Simples);
    Produits.appendChild(Produits_Series);
    Produits.appendChild(Produits_4Gs);


    //******* */
    doc.documentElement.appendChild(etatElement);
    doc.documentElement.appendChild(infoElement);
    doc.documentElement.appendChild(total);
    doc.documentElement.appendChild(signaler_Probleme);
    doc.documentElement.appendChild(Produits);
    doc.documentElement.appendChild(Taxes);
    doc.documentElement.appendChild(Type_Reglement);
    return doc
  }

  convertFileXml(theBlob: Blob, fileName: string): File {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }

  mf: any; client2: any; type_Piece_Identite: any
  //** Generate the PDF file  */
  async generatePDF(id: any) {
    
    // check type de reglement 
    let typeRegOne: any;
    let typeRegTwo: any;
    let typeRegTree: any;
    if (this.addReglementFormGroup.get('typeRegOne').value == '4')
      typeRegOne = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegOne').value == '1') {
      typeRegOne = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegOne').value == '2') {
      typeRegOne = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegOne').value == '3') {
      typeRegOne = 'Monétique';
    }
    if (this.addReglementFormGroup.get('typeRegTwo').value == '4')
      typeRegTwo = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegTwo').value == '1') {
      typeRegTwo = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegTwo').value == '2') {
      typeRegTwo = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegTwo').value == '3') {
      typeRegTwo = 'Monétique';
    }
    if (this.addReglementFormGroup.get('typeRegTree').value == '4')
      typeRegTree = 'Espèces';
    else if (this.addReglementFormGroup.get('typeRegTree').value == '1') {
      typeRegTree = 'Virement';
    } else if (this.addReglementFormGroup.get('typeRegTree').value == '2') {
      typeRegTree = 'Chèque';
    } else if (this.addReglementFormGroup.get('typeRegTree').value == '3') {
      typeRegTree = 'Monétique';
    }
    // check if this "Devis" is Proforma or "simple/estimatif"
    let imgUrl: string;
    if (this.typeDevis === 'Estimatif') {
      imgUrl = "./../../../../assets/images/vente/Devis_.jpg"
    } else {
      imgUrl = "./../../../../assets/images/vente/proforma_.jpg"
    }
    this.devisService.getQuoteByID(id).subscribe((res: any) => {
      this.date = this.datepipe.transform(res.body.date_Creation, 'dd/MM/YYYY');
    });
    setTimeout(async () => {
      //** Generate the pdf file */ 
      var body: any = [];
      var obj = new Array();
      obj.push(" ");
      obj.push(" ");
      obj.push(" ");
      obj.push(" ");
      obj.push(" ");
      obj.push(" ");
      body.push(obj);
      for (let i = 0; i < this.devisArticls.length; i++) {
        var obj = new Array();
        obj.push(".      " + this.devisArticls[i].id_Produit);
        let ch3="\n"
        let ch = "" + this.devisArticls[i].nom_Produit + " : " + this.devisArticls[i].nom_Produit + "\n\n"
        let ch2 = "\n"
        ch3 = ch3 + "TVA "+this.devisArticls[i].tva+" % \n"; ch2 = ch2 + " + " + this.devisArticls[i].montant_TVA + "\n ";

        if (this.devisArticls[i].montant_Fodec > 0) { 
          ch3 = ch3 + "Fodec 1 %  \n"; ch2 = ch2 + " + " + this.devisArticls[i].montant_Fodec + "\n" ;ch=ch+"\n"
        }
        let m_remise = ((this.devisArticls[i].prixU * (Number(this.devisArticls[i].remise)) / 100) * this.devisArticls[i].quantite).toFixed(3)
        if (this.devisArticls[i].remise > 0) { 
          ch = ch + "Remise " + this.devisArticls[i].remise + " %"; ch2 = ch2 + " -  " + m_remise + "\n" 
        }

        ch2 = ch2 + "\n  " + this.devisArticls[i].totale_TTC + " "+this.infoFormGroup.get('devise').value +""
        obj.push(ch);
        obj.push(this.devisArticls[i].quantite);
        obj.push(this.devisArticls[i].prixU);
        obj.push(ch3);
        obj.push(ch2);



        body.push(obj);
      }


      let pdf_devis = {
        pageMargins: [40, 250, 40, 180],
        footer: function (currentPage: any, pageCount: any) {
          return {
            margin: 35,
            columns: [
              {
                fontSize: 9,
                text: [

                  {
                    text: currentPage.toString() + '/' + pageCount,
                  }
                ],
                relativePosition: { x: 250, y: 130 }
              }
            ]
          };
        },
        header: [
          {
            text: '' + id + '\n\n',
            fontSize: 15,
            color: 'black',
            bold: true,
            relativePosition: { x: 430, y: 186 }
          },
          {
            text: '' + this.infoFormGroup.get('custemerName').value.id_Clt + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 75, y: 105 }
          },
          {
            text: '' +  this.mf  + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 230, y: 107 }
          },
          /********************************************** */
          {
            text: '' + this.infoFormGroup.get('custemerName').value.nom_Client + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 85, y: 133 }
          },
          {
            text: '' + this.type_Piece_Identite + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 210, y: 133 }
          },

          {
            text: '' + this.infoFormGroup.get('custemerName').value.adresse + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 75, y: 156 }
          },


          {
            text: '' + this.infoFormGroup.get('custemerName').value.contact + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 75, y: 181 }
          },
          {
            text: '' + this.infoFormGroup.get('custemerName').value.tel1 + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 185, y: 181 }
          },

          {
            text: 'rochdi' + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 390, y: 95 }
          },

          {
            text: '' + this.date + '\n\n',
            fontSize: 11,
            color: 'black',
            bold: false,
            relativePosition: { x: 520, y: 95 }
          },
          {
            text: '' + this.assiette7 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 798 }
          },
          {
            text: '' + this.montant7 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 510, y: 798 }
          },
          {
            text: '' + this.assiette13 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 784 }
          },
          {
            text: '' + this.montant13 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 510, y: 784 }
          },
          {
            text: '' + this.assiette19 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 772 }
          },
          {
            text: '' + this.montant19 + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 510, y: 772 }
          },
          {
            text: '' + this.totalTTc + " " + this.infoFormGroup.get('devise').value + '\n\n',
            fontSize: 16,
            color: 'white',
            bold: true,
            relativePosition: { x: 460, y: 638 }
          },
          {
            text: '0.600',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 520, y: 614 }
          },
          {
            text: '' + this.totalHT + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 720 }
          },


          {
            text: '' + this.remiseDiff + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 746 }
          },

          {
            text: '' + this.totalMontantFodec + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 759 }
          },
          {
            text: '' + this.totalMontantTVA + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 365, y: 733 }
          },
          {
            text: ' ' + this.addReglementFormGroup.get('note').value + '\n\n',
            fontSize: 9,
            color: 'black',
            bold: false,
            relativePosition: { x: 55, y: 685 }
          }


        ],



        background: [
          {
            image: await this.getBase64ImageFromURL(imgUrl), width: 600
          }
        ],



        content: [ 
          {
            layout: 'lightHorizontalLines'
            , table: {
              widths: [40, 270, 27, 35, 42, 70],
              body: body, 
            },
            headerRows: 0,
            fontSize: 8,
            margin: [-20, -17, 10, 40]
          } 
        ],

      };
      pdfMake.createPdf(pdf_devis).open();
    }, 1000)


  }

  //** Save Data - Devis */
  saveData() {
    let frais_Livraison: any = 0
    let url = "assets/Devis.xml";
    const formData: any = new FormData();
    //** Generate the file XML */
    //** Create an XmlHttpRequest */
    let doc_ = this.createXMLStructure(url, this.devisArticls);
    fetch(url).then(res => res.text).then(() => {
      let xmlFile = new XMLSerializer().serializeToString(doc_.documentElement);
      var myBlob = new Blob([xmlFile], { type: 'application/xml' });
      var myDetail = this.convertFileXml(myBlob, url);

      formData.append('Id_Responsable', 'InfoNet'); // id_admin
      formData.append('Mode_Paiement', this.infoFormGroup.get('modePaiement').value);
      formData.append('Id_Clt', this.infoFormGroup.get('custemerName').value.id_Clt);
      formData.append('Date_Creation', this.latest_date);
      formData.append('Description', this.addReglementFormGroup.get('note').value);
      formData.append('Frais_Livraison', frais_Livraison);
      formData.append('Etat', 'En cours');
      formData.append('Type', this.infoFormGroup.get('typeDevis').value);
      formData.append('Total_HT_Brut', this.totalHTBrut);
      formData.append('Total_Remise', this.remiseDiff);
      formData.append('Total_TTC', this.totalTTc);
      formData.append('Total_Fodec', this.totalMontantFodec);
      formData.append('Total_HT_Net', this.totalHT);
      formData.append('Total_Tva', this.totalMontantTVA);
      formData.append('Local', this.infoFormGroup.get('local').value);
      formData.append('Detail', myDetail);
      //** send data to the API */
      this.devisService.getClientById(this.infoFormGroup.get('custemerName').value.id_Clt).subscribe((data) => {
         this.client2 = data.body;
        this.type_Piece_Identite = this.client2.type_Piece_Identite
        this.mf = this.client2.n_Piece_Identite
   
      })
      this.devisService.createQuate(formData).subscribe((res) => {
        Swal.fire(
          {
            title: "Devis ajouté avec succés.",
          }).then((result) => {
            if (result.isConfirmed) {
              Swal.fire({
                title: 'Voulez vous imprimer le devis',
                icon: 'warning',
                showCancelButton: true,
                confirmButtonText: 'Oui',
                cancelButtonText: 'Non',
              }).then((result) => {
                if (result.isConfirmed) {
                  this.numDeviss = res.id_Devis;
                  this.generatePDF(res.id_Devis);
                  //   this.router.navigate(['Menu/Menu-Devis/Lister-devis']);
                } else if (result.isDismissed) {
                  console.log('Clicked No, File is safe!');
                  //   this.router.navigate(['Menu/Menu-Devis/Lister-devis']);
                }
              });
            }
          });
      }, (err) => {
        console.log(err)
      });
    });

  }
}
