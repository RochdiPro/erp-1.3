import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';
import { Inject } from '@angular/core';

//import { BEI } from './../../model/bei';
import 'sweetalert2/src/sweetalert2.scss';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { from, interval, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { AjouterArticlesComponent, AjouterArticles_impoComponent, DialogOverview4gDialog, DialogOverviewChargeDialog, DialogOverviewSerieDialog, DialogOverviewSimpleDialog, DialogOverview_nlot } from '../../dialogue-achat/dialogue-achat.component';
import { BonEntreeImportationServiceService } from '../Services/bon-entree-importation-service.service';
 

@Component({
  selector: 'app-ajouter-bon-entree-importation',
  templateUrl: './ajouter-bon-entree-importation.component.html',
  styleUrls: ['./ajouter-bon-entree-importation.component.scss']
})
export class AjouterBonEntreeImportationComponent implements OnInit {
  lineaire = false;
  liste_des_ngp_declare: Array<any> = [];
  InformationsGeneralesForm: any = FormGroup;
  InformationsBanquesForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  TaxeDouaneForm: any = FormGroup;
  ChargeGlobaleForm: any = FormGroup;
  locals: any = []; Lngp: any = [];
  liste_Agence_Transport: any = [];
  liste_Agence_Transitaire: any = [];
  fournisseurs: any = [];
  produits: any = [];
  produits_serie: any = [];
  produits_emie: any = [];
  produits_simple: any;
  public Taxes: any = [];
  Valeur_Taxes: any = [];
  newAttribute: any = {};
  elem_ngp: any = {};
  categorie_paiement: any;
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
  totaltva: any = 0;
  totalPorcentageFodec: any = 0;
  sommeRTTC: any = 0; sommeRHT: any = 0; sommetva: any = 0; sommefodec: any = 0; sommedeclare: any = 0; sommedv: any = 0; sommetaxe: any = 0; sommecharge: any = 0; sommechargeimpo: any = 0;
  subscription: Subscription;
  Ch_Globale: any = 0;
  ChargeTransport: any = 0;
  Autre_Charge_Fixe: any = 0;
  fieldArray: Array<any> = [];
  ChargeForm: any = FormGroup;
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
  date_bl= new Date();
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
  NGP: any;
  Prix_dec: any;
  cours: any;
  Total_taxe: any;
  taxe: any;
  taxe_ngp: any; V_taxe: any; charge: any;
  ch_Transport: any; ch_Transitaire: any; ch_Banque: any; ch_Penalite: any; ch_Magasinage: any; ch_AutreCharge: any; Totalttc: any = 0; Totalht: any = 0;
  TotaleFacturedv: any = 0; totaletaxe: any = 0;
 // public model: BEI = new BEI();
  f: File;
 
  transport_impo: any = 0;
  ngp_declare: any = [];
  sommengp: any = 0;
  xml_seri: any = [];
  xml_4g: any = [];
  xml_simple: any = [];

  image_defaut_blob:any;
  image :any ;
  constructor(public bonEntreeService: BonEntreeImportationServiceService, private http: HttpClient, private fb: FormBuilder, private router: Router, public dialog: MatDialog) {
    this.Locals();
    this.Fournisseurs();
    this.Produits();
    this.Agence_Transport();
    this.Listengp();
    this.Agence_Transitaire();
  

    //récupérer la liste des catégories des données
    this.bonEntreeService.obtenirCategoriePaiement().subscribe((response: Response) => {
      this.categorie_paiement = response;
    });
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      DateEntree: ['', Validators.required],
      DateLivraison: ['', Validators.required],
      DatePaiement: ['', Validators.required],
      DateProforma: ['', Validators.required],
      DateFacture: ['', Validators.required],
      N_Facture: ['', Validators.required],
      N_Proforma: ['', Validators.required],
      Transport_Importation_DV: [0],
      Cours: ['2.7798'],
      Devise: [''],
      Inclut: ['false'],
      Local: ['', Validators.required],
      Ag_Transport: [''],
      Ag_Transitaire: [''],
      Assurance_Importation_DT: [0],
      Mode_Paiement: ['', Validators.required],
      Mode_Livraison: ['', Validators.required],
      Type: ['', Validators.required],
      Type_Livraison: ['', Validators.required],
      Fournisseur: [''],
    });
    this.InformationsBanquesForm = this.fb.group({
      Titre: [''],
      LC: [''],
      Transfert: [''],
      FED: [''],
      Transport: ['0'],
      Totale_Facture: ['21537.86'],
      Totale_declare: ['100'],
      Transitaire: ['0'],
      Banque: ['100'],
      Penalite: ['0'],
      Magasinage: ['0'],
      AutreCharge: ['0'],
      Document_Banque: [''],
      Document_Importation: [''],
      Document_Transitaire: [''],
      Document_Transport: ['']
    });
     
    this.ListeArticleForm = this.fb.group({
      IdProduit: [''],
      Ref_FR: [''],
      Quantite: ['1', Validators.min(0.1)],
      Prix: ['1'],
      Id_Produit: [''],
      Ref_fournisseur: [''],
      Qte: ['1'],
      Prix_U: ['0'],
      TVA: ['0'],
      M_TVA: ['0'],
      Fodec: ['0'],
      Prix_HT: ['0'],
      Totale_TTC: ['0'],

    });
    this.TaxeDouaneForm = this.fb.group({
      T001: [''],
      T105: [''],
      T094: [''],
      T093: [''],
      T473: [''],
      AutreTaxe: ['']
    });
    this.ChargeGlobaleForm = this.fb.group({
    });
  }

  ngOnInit(): void {
  }
   // temps d'attente pour le traitement de fonction 
   delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  async chargementImage() {
    this.http.get('.././assets/images/image_par_defaut.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.image_defaut_blob = resp;
      return this.image_defaut_blob;
    }, err => console.error(err),
      () => console.log(this.image_defaut_blob))
  }
  async sansChoixImage() {
    await this.delai(3000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.image  = lecteur.result;
      this.image= btoa(this.image);
      this.image = atob(this.image);
      this.image = this.image.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.image_defaut_blob);
  }


  //Récupérer tous locaux
  Locals() {
    this.bonEntreeService.Locals().subscribe((data: any) => {
      this.locals = data;
    });
  }
  //Récupérer tous ngp
  Listengp() {
    this.bonEntreeService.Listengp().subscribe((data: any) => {
      this.Lngp = data;
    });
  }

  //Récupérer tous les agence des transport
  Agence_Transport() {
    this.bonEntreeService.Agencetransport().subscribe((data: any) => {
      this.liste_Agence_Transport = data;
    });
  }

  //Récupérer tous les agence des transitaire 
  Agence_Transitaire() {
    this.bonEntreeService.Agencetransitaire().subscribe((data: any) => {
      this.liste_Agence_Transitaire = data;
    });
  }

  //Récupérer tous fournisseurs
  Fournisseurs() {
    this.bonEntreeService.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }

  //Récuperer tous produits
  Produits() {
    this.bonEntreeService.Produits().subscribe((data: any) => {
      this.produits = data;
    });
  }

  liste_des_taxe() {
    this.bonEntreeService.ngp(this.Id_Produit).subscribe((data: any) => {
      this.NGP = data;
      this.bonEntreeService.listetaxe(data).subscribe((data: any) => {
        this.Taxes = data;
      });
    });
  }
  valeur_des_taxe_ngp() {
    this.bonEntreeService.Valeur_des_Taxe().subscribe((data: any) => {
      this.Valeur_Taxes = data;

    });
  }

  clacule_taxe_ngp() {
    var s = Number(this.newAttribute.Prix_declare);
    this.liste_des_taxe()
    this.valeur_des_taxe_ngp()
    this.TaxeDouaneForm.T001 = 0;
    this.TaxeDouaneForm.T105 = 0;
    this.TaxeDouaneForm.T094 = 0;
    this.TaxeDouaneForm.T093 = 0;
    this.TaxeDouaneForm.T473 = 0;
    this.ajouter()
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

        this.calcule_toto();
        this.fieldArray.splice(index, 1);
        this.getngp();
        this.calcule_toto();

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

   // ajouter produit a partire du boite du dialogue
   ajouter2(id  :any,  prix :any ,  qte ,ngp) {
       this.click = !this.click;
       this.bonEntreeService.Produit(id).subscribe((response: Response) => {
         this.produitData = response;
         this.newAttribute.N_Lot = "false"
         if (this.produitData.n_Lot + "" == "true") { this.newAttribute.N_Lot = "true" }
         this.newAttribute.Id_Produit = id;
         this.newAttribute.Nom_Produit = this.produitData.nom_Produit;
         this.newAttribute.N_Imei = this.produitData.n_Imei;
         this.newAttribute.N_Serie = this.produitData.n_Serie;
      //   this.newAttribute.PrixU = Number(prix);
         this.newAttribute.Quantite = Number(qte);
         this.newAttribute.Ref_FR = this.Ref_FR_article;
          this.newAttribute.NGP = ngp
         this.newAttribute.PrixU_dv = Number(prix);
         this.newAttribute.Prix_t_dv = Number(prix) * Number(qte);
         var cours = Number(this.InformationsGeneralesForm.get('Cours').value);
         this.newAttribute.listetaxes = this.Taxes;
         this.newAttribute.Valeur_Taxes = this.Valeur_Taxes
         this.newAttribute.cours = cours;
         this.newAttribute.Prix_declare = 0;
         var y = Number(this.newAttribute.Quantite)
         this.newAttribute.Tva = 0
 
         this.newAttribute.listetaxes = this.Taxes;
         this.newAttribute.Valeur_Taxes = this.Valeur_Taxes
         this.newAttribute.Taxe_U = 0;
         this.newAttribute.p = 0;
         this.newAttribute.Totaltaxe = 0;
         this.newAttribute.Valeur_U_TTC = 0
         this.newAttribute.Totalt105 = 0;
         this.newAttribute.Totalt093 = 0;
         this.newAttribute.Montant_Fodec = 0;
         this.newAttribute.M_TVA = 0;
         this.newAttribute.M_TVA_19 = 0;
         this.newAttribute.M_TVA_13 = 0;
         this.newAttribute.M_TVA_7 = 0;
         this.ch_Transport = this.InformationsBanquesForm.get('Transport').value;
         this.ch_Transitaire = this.InformationsBanquesForm.get('Transitaire').value;
         this.ch_Banque = this.InformationsBanquesForm.get('Banque').value;
         this.ch_Penalite = this.InformationsBanquesForm.get('Penalite').value + 0;
         this.ch_Magasinage = this.InformationsBanquesForm.get('Magasinage').value;
         this.ch_AutreCharge = this.InformationsBanquesForm.get('AutreCharge').value;
         this.charge = Number(this.ch_Transitaire) + Number(this.ch_Banque) + Number(this.ch_Penalite) + Number(this.ch_Magasinage) + Number(this.ch_AutreCharge);
         this.newAttribute.charge = Number(this.charge);
         this.newAttribute.TotalFacture = Number(this.InformationsBanquesForm.get('Totale_Facture').value);
         this.newAttribute.porcentage_Ch = Number(((this.newAttribute.Prix_t_dv) / (this.newAttribute.TotalFacture)) * 100).toFixed(3);
         this.newAttribute.valeur_ch = Number(((this.newAttribute.porcentage_Ch * this.charge) / 100)).toFixed(3);
         this.newAttribute.total_valeur_ch = Number(((this.newAttribute.porcentage_Ch * this.charge) / 100)).toFixed(3);
         this.newAttribute.charge_U = Number(Number(Number(this.newAttribute.total_valeur_ch)) / y).toFixed(3);
         this.newAttribute.Prix_rev_ht = 0;
         this.newAttribute.Total_rev_ht = 0;
         this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
         this.newAttribute.FichierSimple = "";
         this.newAttribute.FichierSerie = "";
         this.newAttribute.Fichier4G = "";
         this.newAttribute.ProduitsSeries = "";
         this.newAttribute.Produits4g = "";
         this.newAttribute.tableaux_produits_serie = this.produits_serie;
         this.newAttribute.tableaux_produits_emie = this.produits_emie;
         this.newAttribute.produits_simple = this.produits_simple;
         this.newAttribute.detail = []
         this.fieldArray.push(this.newAttribute);
         this.newAttribute = {};
         this.getngp();
         this.calcule_toto();
       });
 
      
   }

  // ajouter produit selon les ngp 
  ajouter( ) {

    if ((this.newAttribute.Quantite) == undefined || Number(this.newAttribute.Quantite) < 1) {
      Swal.fire({
        title: 'Quantité doit être supérieur ou égal à 1',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ok',
      });

    }
    else if ((this.newAttribute.PrixU_dv) == undefined) {
      Swal.fire({
        title: 'Prix SVP',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'ok',

      });
    }
    else {
      this.click = !this.click;

      this.bonEntreeService.Produit(this.Id_Produit).subscribe((response: Response) => {
        this.produitData = response;
        this.newAttribute.Id_Produit = this.Id_Produit;
        this.newAttribute.Nom_Produit = this.produitData.nom_Produit;
        this.newAttribute.N_Imei = this.produitData.n_Imei;
        this.newAttribute.N_Serie = this.produitData.n_Serie;
  //      this.newAttribute.PrixU = Number(this.Prix);
        this.newAttribute.N_Lot = "false"
        if (this.produitData.n_Lot + "" == "true") { this.newAttribute.N_Lot = "true" }
        this.newAttribute.Quantite = Number(this.newAttribute.Quantite);
        this.newAttribute.Ref_FR = this.Ref_FR_article;
        this.newAttribute.NGP = this.NGP
        this.newAttribute.PrixU_dv = Number(this.newAttribute.PrixU_dv);
        this.newAttribute.Prix_t_dv = Number(this.newAttribute.PrixU_dv) * Number(this.newAttribute.Quantite);
        var cours = Number(this.InformationsGeneralesForm.get('Cours').value);
        this.newAttribute.listetaxes = this.Taxes;
        this.newAttribute.Valeur_Taxes = this.Valeur_Taxes
        this.newAttribute.cours = cours;
        this.newAttribute.Prix_declare = 0;
        var y = Number(this.newAttribute.Quantite)
        this.newAttribute.Tva = 0
        this.newAttribute.listetaxes = this.Taxes;
        this.newAttribute.Valeur_Taxes = this.Valeur_Taxes
        this.newAttribute.Taxe_U = 0;
        this.newAttribute.p = 0;
        this.newAttribute.Totaltaxe = 0;
        this.newAttribute.Valeur_U_TTC = 0
        this.newAttribute.Totalt105 = 0;
        this.newAttribute.Totalt093 = 0;
        this.newAttribute.Montant_Fodec = 0;
        this.newAttribute.M_TVA = 0;
        this.newAttribute.M_TVA_19 = 0;
        this.newAttribute.M_TVA_13 = 0;
        this.newAttribute.M_TVA_7 = 0;
        this.ch_Transport = this.InformationsBanquesForm.get('Transport').value;
        this.ch_Transitaire = this.InformationsBanquesForm.get('Transitaire').value;
        this.ch_Banque = this.InformationsBanquesForm.get('Banque').value;
        this.ch_Penalite = this.InformationsBanquesForm.get('Penalite').value + 0;
        this.ch_Magasinage = this.InformationsBanquesForm.get('Magasinage').value;
        this.ch_AutreCharge = this.InformationsBanquesForm.get('AutreCharge').value;
        this.charge = Number(this.ch_Transitaire) + Number(this.ch_Banque) + Number(this.ch_Penalite) + Number(this.ch_Magasinage) + Number(this.ch_AutreCharge);
        this.newAttribute.charge = Number(this.charge);
        this.newAttribute.TotalFacture = Number(this.InformationsBanquesForm.get('Totale_Facture').value);
        this.newAttribute.porcentage_Ch = Number(((this.newAttribute.Prix_t_dv) / (this.newAttribute.TotalFacture)) * 100).toFixed(3);
        this.newAttribute.valeur_ch = Number(((this.newAttribute.porcentage_Ch * this.charge) / 100)).toFixed(3);
        this.newAttribute.total_valeur_ch = Number(((this.newAttribute.porcentage_Ch * this.charge) / 100)).toFixed(3);
        this.newAttribute.charge_U = Number(Number(Number(this.newAttribute.total_valeur_ch)) / y).toFixed(3);
        this.newAttribute.Prix_rev_ht = 0;
        this.newAttribute.Total_rev_ht = 0;
        this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
        this.newAttribute.FichierSimple = "";
        this.newAttribute.FichierSerie = "";
        this.newAttribute.Fichier4G = "";
        this.newAttribute.ProduitsSeries = "";
        this.newAttribute.Produits4g = "";
        this.newAttribute.tableaux_produits_serie = this.produits_serie;
        this.newAttribute.tableaux_produits_emie = this.produits_emie;
        this.newAttribute.produits_simple = this.produits_simple;
        this.newAttribute.detail = []
        this.fieldArray.push(this.newAttribute);
        this.newAttribute = {};
        this.getngp();
        this.calcule_toto();
      });

    }
  }

  resultat_dialog: any;
  table_articles: any = [];
   //** open Dialog */
   openDialog() {
    const dialogRef = this.dialog.open(AjouterArticles_impoComponent, {
      height: '600px', data: {
       //  fromPage: this.table_articles,
        // local: this.local
      }
    });
    dialogRef.afterClosed().subscribe(res => {

      this.resultat_dialog = res.data
      console.log(this.resultat_dialog)
      if (res != undefined) {
        for (let i = 0; i < this.resultat_dialog.length; i++) {
          let test = "0";
          for (let j = 0; j < this.fieldArray.length; j++) {
            if (this.fieldArray[j].Id_Produit + "" == this.resultat_dialog[i].id_Produit + "") {
              test = "1";
            }
          }
          if (test == "0") { this.ajouter2(this.resultat_dialog[i].id_Produit, this.resultat_dialog[i].prix, this.resultat_dialog[i].qte,this.resultat_dialog[i].ngp); }
        }
       
      }
    });
  }

  // chercher les ngp pour une liste des articles 
  getngp() {
    var t = -1;
    this.ngp_declare = [];
    for (let i = 0; i < this.fieldArray.length; i++) {
      var t = -1;
      for (let j = 0; j < this.ngp_declare.length; j++) {
        if ((this.ngp_declare[j] === this.fieldArray[i].NGP)) {
          t = i;
        }
      }

      if (t === -1) {
        this.ngp_declare.push(this.fieldArray[i].NGP)
        this.sommengp = this.sommengp + this.fieldArray[i].prixngp;
      }
    }

    this.liste_des_ngp_declare = [];
    for (let j = 0; j < this.ngp_declare.length; j++) {
      var s = 0;
      for (let i = 0; i < this.fieldArray.length; i++) {
        if ((this.ngp_declare[j] === this.fieldArray[i].NGP)) {
          s = s + this.fieldArray[i].Prix_t_dv;

        }
      }

      this.elem_ngp.ngp = this.ngp_declare[j];
      this.elem_ngp.total = Number(s);
      this.elem_ngp.prix = 0;
      this.liste_des_ngp_declare.push(this.elem_ngp);
      this.elem_ngp = {};
    }
    this.fieldArray.sort((a, b) => (a.NGP > b.NGP) ? 1 : -1);
  }


  mise_a_jour_charge(i: any, filed: any) {
    this.calcule_toto()
  }


  //calculer les totaux
  calcule_toto() {
    var vsommedeclare = 0
    var vsommedv = 0;
    var vsommetaxe = 0;
    var vsommetva = 0;
    var vsommefodec = 0;
    var vsommeRHT = 0;
    var vsommecharge = 0;
    var vsomme7 = 0;
    var vsomme13 = 0;
    var vsomme19 = 0;


    this.charge = Number(this.ch_Transport) + Number(this.ch_Transitaire) + Number(this.ch_Banque) + Number(this.ch_Penalite) + Number(this.ch_Magasinage) + Number(this.ch_AutreCharge);



    for (let i = 0; i < this.fieldArray.length; i++) {

      var val = 0; var prix;
      for (let h = 0; h < this.liste_des_ngp_declare.length; h++) {
        if (this.fieldArray[i].NGP === this.liste_des_ngp_declare[h].ngp) {
          val = this.liste_des_ngp_declare[h].total;
          prix = this.liste_des_ngp_declare[h].prix;

        }
      }

      var p = Number(Number(this.fieldArray[i].Prix_t_dv) / Number(val))
      this.fieldArray[i].p = p
      
   
      
      // var x = Number(p) * prix;
      var x = Number(prix);
      this.fieldArray[i].Prix_declare = Number(p) * prix
    
    
      
      var s = 0; var v = 0; var t001 = 0; var t093 = 0; var t094 = 0; var t105 = 0; var t473 = 0; var tva = 0; var t7 = 0; var t13 = 0; var t19 = 0;
      this.Taxes = this.fieldArray[i].listetaxes
      this.Valeur_Taxes = this.fieldArray[i].Valeur_Taxes

      for (let i = 0; i < this.Taxes.length; i++) {
        for (let j = 0; j < this.Valeur_Taxes.length; j++) {
          this.taxe = (this.Valeur_Taxes[j]);
          if (this.taxe.nom == this.Taxes[i]) {
            switch (this.taxe.nom) {
              case "Taxe001-30":
                v = Number(this.taxe.valeur);
                v = v / 100;
                t001 = ((x * v));
                s = s + (x * v);

                break;
              case "Taxe001-15":
                v = Number(this.taxe.valeur);
                v = v / 100;
                s = s + (x * v);
                t001 = ((x * v));
                break;
              case "Taxe093":
                v = Number(this.taxe.valeur);
                v = v / 100;
                t093 = ((x * v));
                s = s + (x * v);

                break;
              case "Taxe094":
                v = Number(this.taxe.valeur);
                v = v / 100;
                t094 = ((x * v));
                s = s + (x * v);

                break;
              case "Taxe105-7":
                var totale_facture = 0;
                totale_facture = Number(t001) + Number(t093) + Number(t094) + x;
                v = Number(this.taxe.valeur);
                v = v / 100;
                t105 = ((totale_facture * v));
                s = s + (totale_facture * v);
                tva = 7;
                t7 = Number(totale_facture * v);

                break;
              case "Taxe105-13":
                var totale_facture = 0;
                totale_facture = Number(t001) + Number(t093) + Number(t094) + x;
                v = Number(this.taxe.valeur);
                v = v / 100;
                t105 = ((totale_facture * v));
                s = s + (totale_facture * v);
                tva = 13;
                t13 = Number(totale_facture * v);
                break;
              case "Taxe105-19":
                var totale_facture = 0;
                totale_facture = Number(t001) + Number(t093) + Number(t094) + x;
                v = Number(this.taxe.valeur);
                v = v / 100;
                t105 = ((totale_facture * v));
                s = s + (totale_facture * v);
                tva = 19;
                t19 = Number(totale_facture * v);

                break;
              case "Taxe473":
                v = Number(this.taxe.valeur);
                v = v / 100;
                var rr = s * v;
                if (rr < 10) { rr = 10; }
                t473 = rr;
                s = s + rr;

                break;
              default:
                v = Number(this.taxe.valeur);
                v = v / 100;
                s = s + (s * v);
                break;

            }
          }
        }
      }
      s = Number(s * Number(p));

      var y = this.fieldArray[i].Quantite;
     
      this.fieldArray[i].Tva = tva 
      this.fieldArray[i].Taxe_U = s / y;
      this.fieldArray[i].Totaltaxe = s;
     
      this.fieldArray[i].prixrectifier =  Number( Number(this.fieldArray[i].Prix_declare) / Number(y)).toFixed(3);//******** */
     
      this.fieldArray[i].Totalt105 = Number(t105 * Number(p));
      this.fieldArray[i].Totalt093 = Number(t093 * Number(p));
      this.fieldArray[i].Montant_Fodec = Number(t093 * Number(p) / y);
      this.fieldArray[i].M_TVA = Number(Number(t105 * Number(p)) / y).toFixed(3);
      this.fieldArray[i].M_TVA19 = Number(Number(t19) * Number(p))
      this.fieldArray[i].M_TVA13 = Number(Number(t13) * Number(p))
      this.fieldArray[i].M_TVA7 = Number(Number(t7) * Number(p))


      var y = this.fieldArray[i].Quantite

      this.fieldArray[i].total_valeur_ch = Number(((Number(this.fieldArray[i].porcentage_Ch) * this.charge) / 100)).toFixed(3);
      this.fieldArray[i].charge_U = Number((Number(this.fieldArray[i].total_valeur_ch) / y) +  Number(this.fieldArray[i].Taxe_U )).toFixed(3);
 
      this.fieldArray[i].Prix_rev_ht = Number(Number(this.fieldArray[i].charge_U) + Number(this.fieldArray[i].prixrectifier)).toFixed(3);
      this.fieldArray[i].Total_rev_ht = Number((Number(this.fieldArray[i].Prix_rev_ht) * y)).toFixed(3);

    }

    for (let i = 0; i < this.fieldArray.length; i++) {

      vsommedv = vsommedv + (Number(this.fieldArray[i].Prix_t_dv));
      vsommetaxe = vsommetaxe + (Number(this.fieldArray[i].Totaltaxe));
      vsommetva = vsommetva + (Number(this.fieldArray[i].Totalt105));
      vsommefodec = vsommefodec + (Number(this.fieldArray[i].Totalt093));
      vsommeRHT = vsommeRHT + (Number(this.fieldArray[i].Total_rev_ht));
      vsommecharge = vsommecharge + (Number(this.fieldArray[i].total_valeur_ch));
      vsomme19 = vsomme19 + (Number(this.fieldArray[i].M_TVA19));
      vsomme13 = vsomme13 + (Number(this.fieldArray[i].M_TVA13));
      vsomme7 = vsomme7 + (Number(this.fieldArray[i].M_TVA7));
      vsommedeclare = vsommedeclare + Number(this.fieldArray[i].Prix_declare);

    }

    this.sommedeclare = Number(vsommedeclare).toFixed(3);
    this.sommedv = Number(vsommedv).toFixed(3);
    this.sommetaxe = (Number(vsommetaxe)).toFixed(3);
    this.sommetva = Number(vsommetva).toFixed(3);
    this.sommefodec = Number(vsommefodec).toFixed(3);
    this.sommeRHT = Number(vsommeRHT).toFixed(3);
    this.sommecharge = Number(vsommecharge).toFixed(3);
    this.assiette19 = Number(vsomme19).toFixed(3);
    this.assiette13 = Number(vsomme13).toFixed(3);
    this.assiette7 = Number(vsomme7).toFixed(3);
  }

  //Lister les taxe apartire d'un NGP
  liste_des_taxes() {
    this.bonEntreeService.Valeur_des_Taxe().subscribe((data: any) => {
      this.Valeur_Taxes = data;
      return this.Valeur_Taxes;
    });
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
        this.fieldArray[i].Ch = ((((Number(this.fieldArray[i].PrixU)) / Number(this.InformationsBanquesForm.get('Totale_Facture').value)) * 100) * Number(this.fieldArray[i].Quantite)).toFixed(3);
        this.fieldArray[i].Ch_Piece = (((((Number(this.ChargeTransport) + Number(this.Autre_Charge_Fixe)) * Number(this.fieldArray[i].Ch)) / 100)) / (Number(this.fieldArray[i].Quantite))).toFixed(3);
        this.fieldArray[i].PrixRevientU = (Number(this.fieldArray[i].PrixU) + Number(this.fieldArray[i].Ch_Piece)).toFixed(3);
      }
    }
  }



  // fonction activée lors de choix du produit              
  ProduitSelectionner(event: any) {

    this.Id_Produit = event.value;
    if (event == null) {
      this.click = true;
    }
    else {
      this.click = false;
      let j = 0;

      this.bonEntreeService.Ref_FR_Article(this.Id_Produit).subscribe((data: any) => {
        this.Ref_FR_article = data;
        for (var i = 0; i < this.fieldArray.length; i++) {
          if (this.fieldArray[i].Id_Produit == this.Id_Produit) {
            j = i;
            Swal.fire({
              title: 'Article existe déja! Le Mettre à jour?',
              icon: 'warning',
              showCancelButton: true,
              confirmButtonText: 'Oui, modifier-le',
              cancelButtonText: 'Non'
            }).then((result) => {
              if (result.value) {
                this.ouvreDialogCharge(j, this.fieldArray[j], this.fieldArray);

              } else if (result.dismiss === Swal.DismissReason.cancel) {
                Swal.fire(
                  'Annulé',
                  '',
                  'error'
                )
              }

            })
          }
        }
      })
    };

    this.liste_des_taxe()
    this.valeur_des_taxe_ngp()
  }
  // changer le ngp pour calculer le montant des taxes
  changer_ngp(event: any) {

    this.valeur_des_taxe_ngp()
    this.NGP = event.value;
    this.bonEntreeService.listetaxe(event.value).subscribe((data: any) => {
      this.Taxes = data;
    });
  }



  Ajouterbon() {

    
    var doc = document.implementation.createDocument("Bon_Entree_Importation", "", null);

    var BEI = doc.createElement("Bon_Entree_Importation");
    var Etat = doc.createElement("Etat"); Etat.innerHTML = "en cours"
    var Ag_Transitaire = doc.createElement("Ag_Transitaire"); Ag_Transitaire.innerHTML = this.InformationsGeneralesForm.get('Ag_Transitaire').value;
    var Type_Livraison = doc.createElement("Type_Livraison"); Type_Livraison.innerHTML = this.InformationsGeneralesForm.get('Type_Livraison').value;
    var Titre = doc.createElement("Titre"); Titre.innerHTML = this.InformationsBanquesForm.get('Titre').value;
    var Transfert = doc.createElement("Transfert"); Transfert.innerHTML = this.InformationsBanquesForm.get('Transfert').value;
    var Lc = doc.createElement("Lc"); Lc.innerHTML = this.InformationsBanquesForm.get('LC').value;
    var Fed = doc.createElement("Fed"); Fed.innerHTML = this.InformationsBanquesForm.get('FED').value;

    var InformationsGenerales = doc.createElement("Informations-Generales");
    var Type = doc.createElement("Type"); Type.innerHTML = this.InformationsGeneralesForm.get('Type').value
    var Id_Fr = doc.createElement("Id_Fr"); Id_Fr.innerHTML = this.InformationsGeneralesForm.get('Fournisseur').value;
    var Local = doc.createElement("Local"); Local.innerHTML = this.InformationsGeneralesForm.get('Local').value;
    var Charge_Transport = doc.createElement("Charge_Transport"); Charge_Transport.innerHTML = this.InformationsBanquesForm.get('Transport').value;
    var Mode_Paiement = doc.createElement("Mode_Paiement"); Mode_Paiement.innerHTML = this.InformationsGeneralesForm.get('Mode_Livraison').value;
    var Autre_Charge_Fixe = doc.createElement("Autre_Charge_Fixe"); Autre_Charge_Fixe.innerHTML = this.InformationsBanquesForm.get('AutreCharge').value;

    var Ag_Transport = doc.createElement("Ag_Transport"); Ag_Transport.innerHTML = this.InformationsGeneralesForm.get('Ag_Transport').value;
    var Description = doc.createElement("Description"); Description.innerHTML = this.InformationsGeneralesForm.get('Des').value;
    var Total_Facture_HT = doc.createElement("Totale_declare"); Total_Facture_HT.innerHTML = this.InformationsBanquesForm.get('Totale_declare').value;
    var Total_Facture_TTC = doc.createElement("Totale_Facture"); Total_Facture_TTC.innerHTML = this.InformationsBanquesForm.get('Totale_Facture').value;
    var N_Facture = doc.createElement("N_Facture"); N_Facture.innerHTML = this.InformationsGeneralesForm.get('N_Proforma').value;


    var Datebl = doc.createElement("Date_Be"); Datebl.innerHTML = this.InformationsGeneralesForm.get('DateEntree').value;
    var Date_Proforma = doc.createElement("Date_Proforma"); Date_Proforma.innerHTML = this.InformationsGeneralesForm.get('DateProforma').value;
    var Date_Facture = doc.createElement("Date_Facture"); Date_Facture.innerHTML = this.InformationsGeneralesForm.get('DateFacture').value;
    var Date_Livraison = doc.createElement("Date_Livraison"); Date_Livraison.innerHTML = this.InformationsGeneralesForm.get('DateLivraison').value;
    var Date_Paiement = doc.createElement("Date_Paiement"); Date_Paiement.innerHTML = this.InformationsGeneralesForm.get('DatePaiement').value;




    InformationsGenerales.appendChild(Type);
    InformationsGenerales.appendChild(Id_Fr);
    InformationsGenerales.appendChild(Local);
    InformationsGenerales.appendChild(Charge_Transport);
    InformationsGenerales.appendChild(Mode_Paiement);
    InformationsGenerales.appendChild(Autre_Charge_Fixe);
    
    InformationsGenerales.appendChild(Ag_Transport);
    InformationsGenerales.appendChild(Description);
    InformationsGenerales.appendChild(Total_Facture_HT);
    InformationsGenerales.appendChild(Total_Facture_TTC);
    InformationsGenerales.appendChild(N_Facture);

    InformationsGenerales.appendChild(Ag_Transitaire);
    InformationsGenerales.appendChild(Type_Livraison);
    InformationsGenerales.appendChild(Titre);
    InformationsGenerales.appendChild(Transfert);
    InformationsGenerales.appendChild(Lc);
    InformationsGenerales.appendChild(Fed);


    InformationsGenerales.appendChild(Datebl);
    InformationsGenerales.appendChild(Date_Proforma);
    InformationsGenerales.appendChild(Date_Facture);
    InformationsGenerales.appendChild(Date_Livraison);
    InformationsGenerales.appendChild(Date_Paiement);

    var Datebl = doc.createElement("Date_Be"); Datebl.innerHTML = this.InformationsGeneralesForm.get('DateEntree').value;
    var Date_Proforma = doc.createElement("Date_Proforma"); Date_Proforma.innerHTML = this.InformationsGeneralesForm.get('DateProforma').value;
    var Date_Facture = doc.createElement("Date_Facture"); Date_Facture.innerHTML = this.InformationsGeneralesForm.get('DateFacture').value;
    var Date_Livraison = doc.createElement("Date_Livraison"); Date_Livraison.innerHTML = this.InformationsGeneralesForm.get('DateLivraison').value;
    var Date_Paiement = doc.createElement("Date_Paiement"); Date_Paiement.innerHTML = this.InformationsGeneralesForm.get('DatePaiement').value;


    var Taxes = doc.createElement("Taxes");
    var TVA = doc.createElement("TVA");

    var TVA19 = doc.createElement("TVA19"); TVA19.innerHTML = this.assiette19;
    var TVA7 = doc.createElement("TVA7"); TVA7.innerHTML = this.assiette7;
    var TVA13 = doc.createElement("TVA13"); TVA13.innerHTML = this.assiette13;
    var Fodec = doc.createElement("Fodec"); Fodec.innerHTML = this.sommefodec
    var tax = doc.createElement("Taxe_Globale"); tax.innerHTML = this.sommetaxe

    
    TVA.appendChild(TVA19);
    TVA.appendChild(TVA13);
    TVA.appendChild(TVA7);

    Taxes.appendChild(TVA);
    Taxes.appendChild(Fodec);
    Taxes.appendChild(tax);


    var Total = doc.createElement("Total");
    var TotalHTNet = doc.createElement("TotalDT"); TotalHTNet.innerHTML = this.sommedeclare
    var TotalTVA = doc.createElement("TotalTVA"); TotalTVA.innerHTML = this.sommetva
    var TotalRHT = doc.createElement("TotalRHT"); TotalRHT.innerHTML = this.sommeRHT
    Total.appendChild(TotalHTNet);
    Total.appendChild(TotalTVA);
    Total.appendChild(TotalRHT);
    var Produits = doc.createElement('Produits')
    var Produits_Series = doc.createElement('Produits_Series')
    var Produits_4Gs = doc.createElement('Produits_4Gs')
    var Produits_N_Lot = doc.createElement('Produits_N_Lot')
    var Produits_Simples  = doc.createElement('Produits_Simples')
    var ngps  = doc.createElement('NGPS')
    
    for (let i = 0; i < this.liste_des_ngp_declare.length; i++) {       
      
        var code = doc.createElement('code');code.innerHTML = this.liste_des_ngp_declare[i].ngp
        var prix = doc.createElement('valeur'); prix.innerHTML = this.liste_des_ngp_declare[i].prix
        var ngp = doc.createElement('ngp');

        ngp.appendChild( code )
        ngp.appendChild( prix )              
        ngps.appendChild( ngp )
             
    }

    for (let i = 0; i < this.fieldArray.length; i++) {
      if (this.fieldArray[i].N_Imei == "true") {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
       
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.fieldArray[i].N_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.fieldArray[i].N_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.fieldArray[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_DV = doc.createElement('Prix_U_DV'); Prix_U_DV.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_Total_DV = doc.createElement('Prix_Total_DV'); Prix_Total_DV.innerHTML = this.fieldArray[i].Prix_t_dv
        var NGP = doc.createElement('NGP'); NGP.innerHTML = this.fieldArray[i].NGP
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.fieldArray[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.fieldArray[i].Montant_Fodec
        var Prix_Revient_U = doc.createElement('Prix_Revient_U'); Prix_Revient_U.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht = doc.createElement('Prix_Revient_Total'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].porcentage_Ch
        var Charge_Piece = doc.createElement('Charge_Piece'); Charge_Piece.innerHTML = this.fieldArray[i].charge_U
        var EtatEntree = doc.createElement('EtatEntree'); EtatEntree.innerHTML = this.fieldArray[i].EtatEntree 

        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU
        var PrixU_dv =doc.createElement('PrixU_dv'); PrixU_dv.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_t_dv = doc.createElement('Prix_t_dv'); Prix_t_dv.innerHTML = this.fieldArray[i].Prix_t_dv
        var listetaxes = doc.createElement('listetaxes'); listetaxes.innerHTML = this.fieldArray[i].listetaxes
        var cours = doc.createElement('cours'); cours.innerHTML = this.fieldArray[i].cours
        var Prix_declare = doc.createElement('Prix_declare'); Prix_declare.innerHTML = this.fieldArray[i].Prix_declare 
        var Taxe_U = doc.createElement('PrixU'); Taxe_U.innerHTML = this.fieldArray[i].Taxe_U
        var p = doc.createElement('p'); p.innerHTML = this.fieldArray[i].p
        var Totaltaxe = doc.createElement('Totaltaxe'); Totaltaxe.innerHTML = this.fieldArray[i].Totaltaxe
        var Valeur_U_TTC = doc.createElement('Valeur_U_TTC'); Valeur_U_TTC.innerHTML = this.fieldArray[i].Valeur_U_TTC
        var Totalt105 = doc.createElement('Totalt105'); Totalt105.innerHTML = this.fieldArray[i].Totalt105
        var Totalt093 = doc.createElement('Totalt093'); Totalt093.innerHTML = this.fieldArray[i].Totalt093
        var M_TVA = doc.createElement('M_TVA'); M_TVA.innerHTML = this.fieldArray[i].M_TVA
        var M_TVA_19 = doc.createElement('M_TVA_19'); M_TVA_19.innerHTML = this.fieldArray[i].M_TVA_19
        var M_TVA_13 = doc.createElement('M_TVA_13'); M_TVA_13.innerHTML = this.fieldArray[i].M_TVA_13
        var M_TVA_7 = doc.createElement('M_TVA_7'); M_TVA_7.innerHTML = this.fieldArray[i].M_TVA_7
        var charge = doc.createElement('charge'); charge.innerHTML = this.fieldArray[i].charge
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.fieldArray[i].TotalFacture
        var porcentage_Ch = doc.createElement('porcentage_Ch'); porcentage_Ch.innerHTML = this.fieldArray[i].porcentage_Ch
        var valeur_ch = doc.createElement('valeur_ch'); valeur_ch.innerHTML = this.fieldArray[i].valeur_ch
        var total_valeur_ch = doc.createElement('total_valeur_ch'); total_valeur_ch.innerHTML = this.fieldArray[i].total_valeur_ch
        var charge_U = doc.createElement('charge_U'); charge_U.innerHTML = this.fieldArray[i].charge_U
        var Prix_rev_ht = doc.createElement('Prix_rev_ht'); Prix_rev_ht.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht =  doc.createElement('Total_rev_ht'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht       
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU 
        var vProduit_4Gs = doc.createElement('Produit_4Gs');
        for (let j = 0; j < this.fieldArray[i].tableaux_produits_emie.length; j++) {
          var Produit_4G = doc.createElement('Produit_4G');
          var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.fieldArray[i].detail[j].ns
          var E1 = doc.createElement('E1'); E1.innerHTML = this.fieldArray[i].detail[j].e1
          var E2 = doc.createElement('E2'); E2.innerHTML = this.fieldArray[i].detail[j].e2
          Produit_4G.appendChild(N_Serie);
          Produit_4G.appendChild(E1);
          Produit_4G.appendChild(E2);
          vProduit_4Gs.appendChild(Produit_4G);
        }
       

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        
        Produit.appendChild(EtatEntree);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_DV);
        Produit.appendChild(Prix_Total_DV);
        Produit.appendChild(NGP);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(Charge_Piece);
        Produit.appendChild(Prix_Revient_U);
        Produit.appendChild(Total_rev_ht);
        Produit.appendChild(vProduit_4Gs);

        Produit.appendChild(  PrixU)
        Produit.appendChild( PrixU_dv )
        Produit.appendChild(Prix_t_dv )
        Produit.appendChild( listetaxes )
      
        Produit.appendChild( cours )
        Produit.appendChild( Prix_declare )
       
 

        Produit.appendChild( Taxe_U )
        Produit.appendChild( p )
        Produit.appendChild( Totaltaxe )
        Produit.appendChild( Valeur_U_TTC )
        Produit.appendChild( Totalt105 )
        Produit.appendChild( Totalt093 )
        Produit.appendChild( M_TVA )
        Produit.appendChild( M_TVA_19 )
        Produit.appendChild( M_TVA_13 )
        Produit.appendChild( M_TVA_7 )
        
        Produit.appendChild( charge )
        Produit.appendChild( TotalFacture )
        Produit.appendChild( porcentage_Ch )
        Produit.appendChild( valeur_ch)
        Produit.appendChild( total_valeur_ch )
        Produit.appendChild( charge_U )
        Produit.appendChild( Prix_rev_ht )
        Produit.appendChild( Total_rev_ht )
        Produit.appendChild( PrixU )
        Produits_4Gs.appendChild(Produit);
      }
      else if (this.fieldArray[i].N_Serie == "true") {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit        
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.fieldArray[i].N_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.fieldArray[i].N_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.fieldArray[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_DV = doc.createElement('Prix_U_DV'); Prix_U_DV.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_Total_DV = doc.createElement('Prix_Total_DV'); Prix_Total_DV.innerHTML = this.fieldArray[i].Prix_t_dv
        var NGP = doc.createElement('NGP'); NGP.innerHTML = this.fieldArray[i].NGP
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.fieldArray[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.fieldArray[i].Montant_Fodec
        var Prix_Revient_U = doc.createElement('Prix_Revient_U'); Prix_Revient_U.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht = doc.createElement('Prix_Revient_Total'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].porcentage_Ch
        var Charge_Piece = doc.createElement('Charge_Piece'); Charge_Piece.innerHTML = this.fieldArray[i].charge_U
        var EtatEntree = doc.createElement('EtatEntree'); EtatEntree.innerHTML = this.fieldArray[i].EtatEntree 
        
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU
        var PrixU_dv =doc.createElement('PrixU_dv'); PrixU_dv.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_t_dv = doc.createElement('Prix_t_dv'); Prix_t_dv.innerHTML = this.fieldArray[i].Prix_t_dv
        var listetaxes = doc.createElement('listetaxes'); listetaxes.innerHTML = this.fieldArray[i].listetaxes
        var cours = doc.createElement('cours'); cours.innerHTML = this.fieldArray[i].cours
        var Prix_declare = doc.createElement('Prix_declare'); Prix_declare.innerHTML = this.fieldArray[i].Prix_declare 
        var Taxe_U = doc.createElement('PrixU'); Taxe_U.innerHTML = this.fieldArray[i].Taxe_U
        var p = doc.createElement('p'); p.innerHTML = this.fieldArray[i].p
        var Totaltaxe = doc.createElement('Totaltaxe'); Totaltaxe.innerHTML = this.fieldArray[i].Totaltaxe
        var Valeur_U_TTC = doc.createElement('Valeur_U_TTC'); Valeur_U_TTC.innerHTML = this.fieldArray[i].Valeur_U_TTC
        var Totalt105 = doc.createElement('Totalt105'); Totalt105.innerHTML = this.fieldArray[i].Totalt105
        var Totalt093 = doc.createElement('Totalt093'); Totalt093.innerHTML = this.fieldArray[i].Totalt093
        var M_TVA = doc.createElement('M_TVA'); M_TVA.innerHTML = this.fieldArray[i].M_TVA
        var M_TVA_19 = doc.createElement('M_TVA_19'); M_TVA_19.innerHTML = this.fieldArray[i].M_TVA_19
        var M_TVA_13 = doc.createElement('M_TVA_13'); M_TVA_13.innerHTML = this.fieldArray[i].M_TVA_13
        var M_TVA_7 = doc.createElement('M_TVA_7'); M_TVA_7.innerHTML = this.fieldArray[i].M_TVA_7
        var charge = doc.createElement('charge'); charge.innerHTML = this.fieldArray[i].charge
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.fieldArray[i].TotalFacture
        var porcentage_Ch = doc.createElement('porcentage_Ch'); porcentage_Ch.innerHTML = this.fieldArray[i].porcentage_Ch
        var valeur_ch = doc.createElement('valeur_ch'); valeur_ch.innerHTML = this.fieldArray[i].valeur_ch
        var total_valeur_ch = doc.createElement('total_valeur_ch'); total_valeur_ch.innerHTML = this.fieldArray[i].total_valeur_ch
        var charge_U = doc.createElement('charge_U'); charge_U.innerHTML = this.fieldArray[i].charge_U
        var Prix_rev_ht = doc.createElement('Prix_rev_ht'); Prix_rev_ht.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht =  doc.createElement('Total_rev_ht'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht       
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU

        var vN_Series = doc.createElement('N_Series');
        for (let j = 0; j < this.fieldArray[i].tableaux_produits_serie.length; j++) {

          var N_Serie = doc.createElement('N_Serie'); N_Serie.innerHTML = this.fieldArray[i].detail[j].ns 
          vN_Series.appendChild(N_Serie);
        }
        

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(EtatEntree);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_DV);
        Produit.appendChild(Prix_Total_DV);
        Produit.appendChild(NGP);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(Charge_Piece);
        Produit.appendChild(Prix_Revient_U);
        Produit.appendChild(Total_rev_ht);
        console.log(vN_Series)
        Produit.appendChild(vN_Series);
        
        Produit.appendChild(  PrixU)
        Produit.appendChild( PrixU_dv )
        Produit.appendChild(Prix_t_dv )
        Produit.appendChild( listetaxes )
      
        Produit.appendChild( cours )
        Produit.appendChild( Prix_declare )
       
 

        Produit.appendChild( Taxe_U )
        Produit.appendChild( p )
        Produit.appendChild( Totaltaxe )
        Produit.appendChild( Valeur_U_TTC )
        Produit.appendChild( Totalt105 )
        Produit.appendChild( Totalt093 )
        Produit.appendChild( M_TVA )
        Produit.appendChild( M_TVA_19 )
        Produit.appendChild( M_TVA_13 )
        Produit.appendChild( M_TVA_7 )
        
        Produit.appendChild( charge )
        Produit.appendChild( TotalFacture )
        Produit.appendChild( porcentage_Ch )
        Produit.appendChild( valeur_ch)
        Produit.appendChild( total_valeur_ch )
        Produit.appendChild( charge_U )
        Produit.appendChild( Prix_rev_ht )
        Produit.appendChild( Total_rev_ht )
        
      
        Produit.appendChild( PrixU )

        Produits_Series.appendChild(Produit);
      }
      else if (this.fieldArray[i].N_Lot == "true"){
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit        
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.fieldArray[i].N_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.fieldArray[i].N_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.fieldArray[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_DV = doc.createElement('Prix_U_DV'); Prix_U_DV.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_Total_DV = doc.createElement('Prix_Total_DV'); Prix_Total_DV.innerHTML = this.fieldArray[i].Prix_t_dv
        var NGP = doc.createElement('NGP'); NGP.innerHTML = this.fieldArray[i].NGP
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.fieldArray[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.fieldArray[i].Montant_Fodec
        var Prix_Revient_U = doc.createElement('Prix_Revient_U'); Prix_Revient_U.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht = doc.createElement('Prix_Revient_Total'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].porcentage_Ch
        var Charge_Piece = doc.createElement('Charge_Piece'); Charge_Piece.innerHTML = this.fieldArray[i].charge_U
        var EtatEntree = doc.createElement('EtatEntree'); EtatEntree.innerHTML = this.fieldArray[i].EtatEntree 
        
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU
        var PrixU_dv =doc.createElement('PrixU_dv'); PrixU_dv.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_t_dv = doc.createElement('Prix_t_dv'); Prix_t_dv.innerHTML = this.fieldArray[i].Prix_t_dv
        var listetaxes = doc.createElement('listetaxes'); listetaxes.innerHTML = this.fieldArray[i].listetaxes
        var cours = doc.createElement('cours'); cours.innerHTML = this.fieldArray[i].cours
        var Prix_declare = doc.createElement('Prix_declare'); Prix_declare.innerHTML = this.fieldArray[i].Prix_declare 
        var Taxe_U = doc.createElement('PrixU'); Taxe_U.innerHTML = this.fieldArray[i].Taxe_U
        var p = doc.createElement('p'); p.innerHTML = this.fieldArray[i].p
        var Totaltaxe = doc.createElement('Totaltaxe'); Totaltaxe.innerHTML = this.fieldArray[i].Totaltaxe
        var Valeur_U_TTC = doc.createElement('Valeur_U_TTC'); Valeur_U_TTC.innerHTML = this.fieldArray[i].Valeur_U_TTC
        var Totalt105 = doc.createElement('Totalt105'); Totalt105.innerHTML = this.fieldArray[i].Totalt105
        var Totalt093 = doc.createElement('Totalt093'); Totalt093.innerHTML = this.fieldArray[i].Totalt093
        var M_TVA = doc.createElement('M_TVA'); M_TVA.innerHTML = this.fieldArray[i].M_TVA
        var M_TVA_19 = doc.createElement('M_TVA_19'); M_TVA_19.innerHTML = this.fieldArray[i].M_TVA_19
        var M_TVA_13 = doc.createElement('M_TVA_13'); M_TVA_13.innerHTML = this.fieldArray[i].M_TVA_13
        var M_TVA_7 = doc.createElement('M_TVA_7'); M_TVA_7.innerHTML = this.fieldArray[i].M_TVA_7
        var charge = doc.createElement('charge'); charge.innerHTML = this.fieldArray[i].charge
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.fieldArray[i].TotalFacture
        var porcentage_Ch = doc.createElement('porcentage_Ch'); porcentage_Ch.innerHTML = this.fieldArray[i].porcentage_Ch
        var valeur_ch = doc.createElement('valeur_ch'); valeur_ch.innerHTML = this.fieldArray[i].valeur_ch
        var total_valeur_ch = doc.createElement('total_valeur_ch'); total_valeur_ch.innerHTML = this.fieldArray[i].total_valeur_ch
        var charge_U = doc.createElement('charge_U'); charge_U.innerHTML = this.fieldArray[i].charge_U
        var Prix_rev_ht = doc.createElement('Prix_rev_ht'); Prix_rev_ht.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht =  doc.createElement('Total_rev_ht'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht       
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU

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
       

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(EtatEntree);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_DV);
        Produit.appendChild(Prix_Total_DV);
        Produit.appendChild(NGP);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(Charge_Piece);
        Produit.appendChild(Prix_Revient_U);
        Produit.appendChild(Total_rev_ht);
        Produit.appendChild(vN_Series);
        
        Produit.appendChild(  PrixU)
        Produit.appendChild( PrixU_dv )
        Produit.appendChild(Prix_t_dv )
        Produit.appendChild( listetaxes )
      
        Produit.appendChild( cours )
        Produit.appendChild( Prix_declare )
       
 

        Produit.appendChild( Taxe_U )
        Produit.appendChild( p )
        Produit.appendChild( Totaltaxe )
        Produit.appendChild( Valeur_U_TTC )
        Produit.appendChild( Totalt105 )
        Produit.appendChild( Totalt093 )
        Produit.appendChild( M_TVA )
        Produit.appendChild( M_TVA_19 )
        Produit.appendChild( M_TVA_13 )
        Produit.appendChild( M_TVA_7 )
        
        Produit.appendChild( charge )
        Produit.appendChild( TotalFacture )
        Produit.appendChild( porcentage_Ch )
        Produit.appendChild( valeur_ch)
        Produit.appendChild( total_valeur_ch )
        Produit.appendChild( charge_U )
        Produit.appendChild( Prix_rev_ht )
        Produit.appendChild( Total_rev_ht )
        
      
        Produit.appendChild( PrixU )
        Produits_N_Lot.appendChild(Produit);
       
      }
      else {
        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        
        var dn_Imei = doc.createElement('n_Imei'); dn_Imei.innerHTML = this.fieldArray[i].N_Imei;
        var dn_Serie = doc.createElement('n_Serie'); dn_Serie.innerHTML = this.fieldArray[i].N_Serie;
        var produits_simple = doc.createElement('produits_simple');  produits_simple.innerHTML = this.fieldArray[i].produits_simple;
        var Signaler_probleme = doc.createElement('Signaler_probleme'); Signaler_probleme.innerHTML = this.fieldArray[i].signaler_probleme
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_DV = doc.createElement('Prix_U_DV'); Prix_U_DV.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_Total_DV = doc.createElement('Prix_Total_DV'); Prix_Total_DV.innerHTML = this.fieldArray[i].Prix_t_dv
        var NGP = doc.createElement('NGP'); NGP.innerHTML = this.fieldArray[i].NGP
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var m_Tva = doc.createElement('Montant_Tva'); m_Tva.innerHTML = this.fieldArray[i].M_TVA
        var fodec = doc.createElement('fodec'); fodec.innerHTML = this.fieldArray[i].Montant_Fodec
        var Prix_Revient_U = doc.createElement('Prix_Revient_U'); Prix_Revient_U.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht = doc.createElement('Prix_Revient_Total'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht
        var Charge = doc.createElement('Charge'); Charge.innerHTML = this.fieldArray[i].porcentage_Ch
        var Charge_Piece = doc.createElement('Charge_Piece'); Charge_Piece.innerHTML = this.fieldArray[i].charge_U
        var EtatEntree = doc.createElement('EtatEntree'); EtatEntree.innerHTML = this.fieldArray[i].EtatEntree 
       
        var  PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU
        var PrixU_dv =doc.createElement('PrixU_dv'); PrixU_dv.innerHTML = this.fieldArray[i].PrixU_dv
        var Prix_t_dv = doc.createElement('Prix_t_dv'); Prix_t_dv.innerHTML = this.fieldArray[i].Prix_t_dv
        var listetaxes = doc.createElement('listetaxes'); listetaxes.innerHTML = this.fieldArray[i].listetaxes
        var cours = doc.createElement('cours'); cours.innerHTML = this.fieldArray[i].cours
        var Prix_declare = doc.createElement('Prix_declare'); Prix_declare.innerHTML = this.fieldArray[i].Prix_declare 
        var Taxe_U = doc.createElement('PrixU'); Taxe_U.innerHTML = this.fieldArray[i].Taxe_U
        var p = doc.createElement('p'); p.innerHTML = this.fieldArray[i].p
        var Totaltaxe = doc.createElement('Totaltaxe'); Totaltaxe.innerHTML = this.fieldArray[i].Totaltaxe
        var Valeur_U_TTC = doc.createElement('Valeur_U_TTC'); Valeur_U_TTC.innerHTML = this.fieldArray[i].Valeur_U_TTC
        var Totalt105 = doc.createElement('Totalt105'); Totalt105.innerHTML = this.fieldArray[i].Totalt105
        var Totalt093 = doc.createElement('Totalt093'); Totalt093.innerHTML = this.fieldArray[i].Totalt093
        var M_TVA = doc.createElement('M_TVA'); M_TVA.innerHTML = this.fieldArray[i].M_TVA
        var M_TVA_19 = doc.createElement('M_TVA_19'); M_TVA_19.innerHTML = this.fieldArray[i].M_TVA_19
        var M_TVA_13 = doc.createElement('M_TVA_13'); M_TVA_13.innerHTML = this.fieldArray[i].M_TVA_13
        var M_TVA_7 = doc.createElement('M_TVA_7'); M_TVA_7.innerHTML = this.fieldArray[i].M_TVA_7
        var charge = doc.createElement('charge'); charge.innerHTML = this.fieldArray[i].charge
        var TotalFacture = doc.createElement('TotalFacture'); TotalFacture.innerHTML = this.fieldArray[i].TotalFacture
        var porcentage_Ch = doc.createElement('porcentage_Ch'); porcentage_Ch.innerHTML = this.fieldArray[i].porcentage_Ch
        var valeur_ch = doc.createElement('valeur_ch'); valeur_ch.innerHTML = this.fieldArray[i].valeur_ch
        var total_valeur_ch = doc.createElement('total_valeur_ch'); total_valeur_ch.innerHTML = this.fieldArray[i].total_valeur_ch
        var charge_U = doc.createElement('charge_U'); charge_U.innerHTML = this.fieldArray[i].charge_U
        var Prix_rev_ht = doc.createElement('Prix_rev_ht'); Prix_rev_ht.innerHTML = this.fieldArray[i].Prix_rev_ht
        var Total_rev_ht =  doc.createElement('Total_rev_ht'); Total_rev_ht.innerHTML = this.fieldArray[i].Total_rev_ht       
        var PrixU = doc.createElement('PrixU'); PrixU.innerHTML = this.fieldArray[i].PrixU




        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(dn_Serie);
        Produit.appendChild(dn_Imei);
        Produit.appendChild(produits_simple);
        Produit.appendChild(EtatEntree);
        Produit.appendChild(Signaler_probleme);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_DV);
        Produit.appendChild(Prix_Total_DV);
        Produit.appendChild(NGP);
        Produit.appendChild(m_Tva);
        Produit.appendChild(fodec);
        Produit.appendChild(Charge);
        Produit.appendChild(Charge_Piece);
        Produit.appendChild(Prix_Revient_U);
        Produit.appendChild(Total_rev_ht);
        Produit.appendChild(  PrixU)
        Produit.appendChild( PrixU_dv )
        Produit.appendChild(Prix_t_dv )
        Produit.appendChild( listetaxes )
      
        Produit.appendChild( cours )
        Produit.appendChild( Prix_declare )
       
 

        Produit.appendChild( Taxe_U )
        Produit.appendChild( p )
        Produit.appendChild( Totaltaxe )
        Produit.appendChild( Valeur_U_TTC )
        Produit.appendChild( Totalt105 )
        Produit.appendChild( Totalt093 )
        Produit.appendChild( M_TVA )
        Produit.appendChild( M_TVA_19 )
        Produit.appendChild( M_TVA_13 )
        Produit.appendChild( M_TVA_7 )
        
        Produit.appendChild( charge )
        Produit.appendChild( TotalFacture )
        Produit.appendChild( porcentage_Ch )
        Produit.appendChild( valeur_ch)
        Produit.appendChild( total_valeur_ch )
        Produit.appendChild( charge_U )
        Produit.appendChild( Prix_rev_ht )
        Produit.appendChild( Total_rev_ht )
        
      
        Produit.appendChild( PrixU )

        Produits_Simples.appendChild(Produit);
      }
    }

    Produits.appendChild(Produits_Simples);
    Produits.appendChild(Produits_Series);
    Produits.appendChild(Produits_4Gs);
    Produits.appendChild(Produits_N_Lot);
    
    Produits.setAttribute('Fournisseur',this.InformationsGeneralesForm.get('Fournisseur').value);
    Produits.setAttribute('Local', this.InformationsGeneralesForm.get('Local').value);
    BEI.appendChild(Etat);
    BEI.appendChild(InformationsGenerales);
    BEI.appendChild(Taxes);
    BEI.appendChild(Total);
    BEI.appendChild(Produits)
    BEI.appendChild(ngps)
    doc.appendChild(BEI)
    
    var formData: any = new FormData();

    let url = "assets/BonEntreeLocal.xml";
    fetch(url)
      .then(response => response.text())
      .then(data => {
        let xml2string = new XMLSerializer().serializeToString(doc.documentElement);
        var myBlob = new Blob([xml2string], { type: 'application/xml' });
        var myFile = this.convertBlobFichier(myBlob, "assets/BonEntreeLocal.xml");
        formData.append('Details', myFile);
        var nb = 5;
        formData.append('Id_Fr', this.InformationsGeneralesForm.get('Fournisseur').value);
        formData.append('Mode_Paiement', this.InformationsGeneralesForm.get('Mode_Paiement').value);
        formData.append('Ag_Transport', this.InformationsGeneralesForm.get('Ag_Transport').value);
        formData.append('Type', this.InformationsGeneralesForm.get('Type').value);
        formData.append('N_Facture', this.InformationsGeneralesForm.get('N_Facture').value);
        formData.append('N_Preforma', this.InformationsGeneralesForm.get('N_Proforma').value);
        formData.append('Description', this.InformationsGeneralesForm.get('Des').value);
        formData.append('Devise', this.InformationsGeneralesForm.get('Devise').value);
        formData.append('Local', this.InformationsGeneralesForm.get('Local').value);
        formData.append('Ag_Transitaire', this.InformationsGeneralesForm.get('Ag_Transitaire').value);
        formData.append('Mode_Livraison', this.InformationsGeneralesForm.get('Mode_Livraison').value);
        formData.append('Type_Livraison', this.InformationsGeneralesForm.get('Type_Livraison').value);
        formData.append('Titre', this.InformationsBanquesForm.get('Titre').value);
        formData.append('Transfert', this.InformationsBanquesForm.get('Transfert').value);
        formData.append('Lc', this.InformationsBanquesForm.get('LC').value);
        formData.append('Fed', this.InformationsBanquesForm.get('FED').value);
        formData.append('Charge_Transitaire', this.InformationsBanquesForm.get('Transitaire').value);
        formData.append('Charge_Banque', this.InformationsBanquesForm.get('Banque').value);
        formData.append('Charge_Magasin', this.InformationsBanquesForm.get('Magasinage').value);
        formData.append('Pinalite', this.InformationsBanquesForm.get('Penalite').value);
        formData.append('Totale_Declare',this.sommedeclare);    
        formData.append('Total_R_HT', this.sommeRHT);     
        formData.append('Total_Fodec', this.sommefodec);
        formData.append('Total_Tva', this.sommetva);
        formData.append('Etat', "en cours");
        formData.append('Charge_Assurance_Importation', this.InformationsGeneralesForm.get('Assurance_Importation_DT').value);
        formData.append('Transport_Inclut', this.InformationsGeneralesForm.get('Inclut').value);
        formData.append('Charge_Transport_Importation', this.InformationsGeneralesForm.get('Transport_Importation_DV').value);
        formData.append('Court', this.InformationsGeneralesForm.get('Cours').value);
        formData.append('Charge_Transport', this.InformationsBanquesForm.get('Transport').value);
        formData.append('Autre_Charge_Fixe', this.InformationsBanquesForm.get('AutreCharge').value);      
        formData.append('Id_Responsable', "res");
        formData.append('Totale_Taxe', this.sommetaxe);     
        formData.append('Date_Proforma' , new Date( this.InformationsGeneralesForm.get('DateProforma').value) );
        formData.append('Date_Facture', new Date( this.InformationsGeneralesForm.get('DateFacture').value));
        formData.append('Date_Livraison',new Date( this.InformationsGeneralesForm.get('DateLivraison').value));
        formData.append('Date_Paiement', new Date( this.InformationsGeneralesForm.get('DatePaiement').value));
        formData.append('Date_Be', new Date(  this.InformationsGeneralesForm.get('DateEntree').value));
        const nom_image_par_defaut = 'image_par_defaut.png';
        const Fichier_image_par_defaut = new File([this.image_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
        if  (this.InformationsBanquesForm.get('Document_Banque').value === '') {
          formData.append('Doc_Banque', Fichier_image_par_defaut);
        } else formData.append('Doc_Banque', this.InformationsBanquesForm.get('Document_Banque').value);
       
        if  (this.InformationsBanquesForm.get('Document_Importation').value === '') {
          formData.append('Doc_Importation', Fichier_image_par_defaut);
        } else formData.append('Doc_Importation', this.InformationsBanquesForm.get('Document_Importation').value);

        if  (this.InformationsBanquesForm.get('Document_Transitaire').value === '') {
          formData.append('Doc_Transitaire', Fichier_image_par_defaut);
        } else formData.append('Doc_Transitaire', this.InformationsBanquesForm.get('Document_Transitaire').value);

        if  (this.InformationsBanquesForm.get('Document_Transport').value === '') {
          formData.append('Doc_Transport', Fichier_image_par_defaut);
        } else formData.append('Doc_Transport', this.InformationsBanquesForm.get('Document_Transport').value);

      
        formData.append('Details', myFile);        
        this.bonEntreeService.ajouterBonEntree(formData);
        this.router.navigate(['Menu/Menu-bon-entree-importation/Lister-bon-entree-importation'])

        this.bonEntreeService.ajouterBonEntree(formData).subscribe((data) => {
          
 
          Swal.fire({
            title: "Bon d'entrée  ",
            text: "Bon d'entrée   ajouté avec succés",

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
           //   this.generatePDF(this.reponseajout.id_Bon_Entree_Local, this.reponseajout.date_Creation)

            } else if (result.isDenied) {
            //  this.generatePDF_annexe(this.reponseajout.id_Bon_Entree_Local, this.reponseajout.date_Creation)

            }



          })
        });
      });      

  }

  public blobToFile = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    //A Blob() is almost a File() - it's just missing the two properties below which we will add
    b.lastModifiedDate = new Date();
    b.name = fileName;

    //Cast to a File() type
    return <File>theBlob;
  }


  //convertir blob à un fichier  
  convertBlobFichier = (theBlob: Blob, fileName: string): File => {
    var b: any = theBlob;
    b.lastModifiedDate = new Date();
    b.name = fileName;
    return <File>theBlob;
  }


  choixdoc_banque(){
    const lecteur = new FileReader();
    let doc ;
    lecteur.onloadend = () => {
       doc = lecteur.result;
       doc = btoa( doc);
       doc = atob(doc);
       doc = doc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
   
    lecteur.readAsDataURL(this.InformationsBanquesForm.get('Document_Banque').value);
  }
  choixdoc_transitaire(){
    
  }
  choixdoc_importation(){
    
  }
  choixdoc_transport(){
    
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

  //message erreur mode livraison
  MessageErreurModelivraison() {
    if (this.InformationsGeneralesForm.get('Mode_Livraison').hasError('required')) {
      return 'Vous devez entrer la mode de Livrision !';
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

  //message erreur totale facture
  MessageErreurTotaleFacture() {
    if (this.InformationsBanquesForm.get('Totale_Facture').hasError('required')) {
      return 'Vous devez entrer le total facture !';
    }
    else {
      return '';
    }
  }

  //message erreur totale declare
  MessageErreurTotaledeclare() {
    if (this.InformationsBanquesForm.get('Totale_Facture').hasError('required')) {
      return 'Vous devez entrer le total déclaration !';
    }
    else {
      return '';
    }
  }


  //message erreur type
  MessageErreurTypelivraison() {
    if (this.InformationsGeneralesForm.get('Type_Livraison').hasError('required')) {
      return 'Vous devez entrer un Type de Livraison!';
    }
    else {
      return '';
    }
  }


  //dialogue modifier ligne table charge
  ouvreDialogCharge(indice: any, fieldArray: any, field: any): void {
    const dialogRef = this.dialog.open(DialogOverviewChargeDialog , {
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {  
      this.getngp()
      this.calcule_toto();
    });

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
      width: '500px',
      data: { index: indice, ligne_tableau: fieldArray, table: field }
    });
    dialogRef.afterClosed().subscribe(result => {


    });
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
 //dialogue produit type o n_lot
 ouvreDialogn_lot(indice: any, fieldArray: any, field: any): void {
  const dialogRef = this.dialog.open(DialogOverview_nlot, {
    width: '1000px',
   
    data: { index: indice, ligne_tableau: fieldArray, table: field }
  });
  dialogRef.afterClosed().subscribe(result => {

  });
}

  //Selon type produit l'ouverture du dialogue 
  testerType(index: any) {
    
    if (this.fieldArray[index].N_Imei == "true") {
               //  console.log(this.fieldArray[index], this.fieldArray)
       this.ouvreDialog4g(index, this.fieldArray[index], this.fieldArray);
    }
    else if (this.fieldArray[index].N_Serie == "true") {
     // console.log(this.fieldArray[index],this.fieldArray)
      this.ouvreDialogSerie(index, this.fieldArray[index], this.fieldArray);      
    }
    else if (this.fieldArray[index].N_Lot == "true") {
      this.ouvreDialogn_lot(index, this.fieldArray[index], this.fieldArray);
    }
    else {
      this.ouvreDialogSimple(index, this.fieldArray[index], this.fieldArray);
    }
  }

}
/*
//component dialogue en cas type produit simple
@Component({
  selector: './dialog-overview-simple-dialog-impo',
  templateUrl: './dialog-overview-simple-dialog-impo.html',
})
export class DialogOverviewSimpleDialogimpo {
  nbrQte: any = [];
  //Numero_SerieS: any = [''];
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
    public dialogRef: MatDialogRef<DialogOverviewSimpleDialogimpo>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    this.quantiteSimple = data.ligne_tableau.produits_simple;
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
    this.ligne_table.produits_simple = (this.quantiteSimple.value)
  }


}



//component dialogue en cas type produit serie
@Component({
  selector: 'dialog-overview-serie-dialog-impo',
  templateUrl: 'dialog-overview-serie-dialog-impo.html',
})
export class DialogOverviewSerieDialogimpo {
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
  test: any = 0;
  constructor(public bonEntreeService: BonEntreeImportationService,
    public dialogRef: MatDialogRef<DialogOverviewSerieDialogimpo>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    this.Numero_Serie = data.ligne_tableau.tableaux_produits_serie
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }

  VerifVide() {
    this.test = 0
    this.ligne_table.EtatEntree = [];
    this.ligne_table.tableaux_produits_serie = [];
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_Serie[i] == '' || this.Numero_Serie[i] == undefined) {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
        this.test = 1;
      }
      this.ligne_table.tableaux_produits_serie.push(this.Numero_Serie[i])
    }
    if (this.test == 0) { this.ligne_table.EtatEntree = "Entrée Stock Vérifié"; }
    this.dialogRef.close();
  }


  //Récupérer détail d'un produit
  Detail_Produit() {
    let N_SerieStocke: any = [];

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

              }
            })
            this.N_SerieStocke = N_SerieStocke;

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
  //verifier si numero saisi déjà ou non
  ElimineRedondance() {

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
}
 
//component dialogue en cas type produit 4g
@Component({
  selector: './dialog-overview-4g-dialog-impo',
  templateUrl: './dialog-overview-4g-dialog-impo.html',
})
export class DialogOverview4gDialogimpo {
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
  all: any = [];
  tableConcat2: any = [];
  test: any = 0;
  elem_4g: any = {};
  constructor(public bonEntreeService: BonEntreeImportationService,
    public dialogRef: MatDialogRef<DialogOverview4gDialogimpo>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.table = data.table;
    this.indice = data.index;
    this.nbrQte.length = data.ligne_tableau.Quantite;
    this.all = data.ligne_tableau.tableaux_produits_emie;
    console.log(this.all)
    if (this.all.length > 0) {
      for (let i = 0; i < this.nbrQte.length; i++) {
        if (this.all[i] != undefined ){ 
          let x = this.all[i]
          if (x.n_serie != undefined ){this.Numero_Serie[i] = x.n_serie;}
          if (x.e1 != undefined ){this.E1[i] = x.e1;}
          if (x.e2!= undefined ){this.E2[i] = x.e2;}
        }
      }
    }
    dialogRef.disableClose = true;
    this.Detail_Produit();
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close();
  }
  VerifVide() {
    this.test = 0
    this.ligne_table.EtatEntree = [];
    this.ligne_table.tableaux_produits_emie = []
    for (let i = 0; i < this.nbrQte.length; i++) {
      if (this.Numero_Serie[i] == '' || this.Numero_Serie[i] == undefined) {
        this.ligne_table.EtatEntree = "Entrée Stock Non Accompli";
        this.test = 1;
      }

    }
    if (this.test == 0) { this.ligne_table.EtatEntree = "Entrée Stock Vérifié"; }

    for (let i = 0; i < this.Numero_Serie.length; i++) {
      this.elem_4g.n_serie = this.Numero_Serie[i]
      this.elem_4g.e1 = this.E1[i];
      this.elem_4g.e2 = this.E2[i];
      this.ligne_table.tableaux_produits_emie.push(this.elem_4g)
      this.elem_4g = {};
    }
    this.dialogRef.close();
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
}
 
//component dialogue modifier charge article
@Component({
  selector: './dialog-overview-charge-dialog-impo',
  templateUrl: './dialog-overview-charge-dialog-impo.html',
})
export class DialogOverviewChargeDialogimpo {
  ligne_table: any;
  index_ligne_table: any;
  verif: any;
  table: any;
  Montant_TVA: any = 0;
  Montant_Fodec: any = 0;
  Taxes: any[]; Valeur_Taxes: any[]; taxe: any;
  val: any = 0;
  x: any = 0;
  porcentage_ngp: any = 0;
  prixngp: any = 0;
  nprix: any = 0;

  //test modifier charge
  form_modifier_charge: any = FormGroup;
  // test modifier sans confirmer
  form_charge: any = FormGroup;
  constructor(
    public dialogRef: MatDialogRef<DialogOverviewChargeDialogimpo>,
    private fb: FormBuilder,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ligne_table = data.ligne_tableau;
    this.index_ligne_table = data.index;
    this.table = data.table;

    //pour modification
    this.form_modifier_charge = this.fb.group({
      qte_modifier_ch: [this.ligne_table.Quantite],
      Ref_FR: [this.ligne_table.Ref_FR],
      prixngp: [this.ligne_table.prixngp],  
      PrixU: [this.ligne_table.PrixU_dv],
      Nom_Produit: [{ value: this.ligne_table.Nom_Produit, disabled: true }],
      Id_Produit: [{ value: this.ligne_table.Id_Produit, disabled: true }],
      cours: [this.ligne_table.cours]
    });
  }
  //fermer dialogue
  fermerDialogue() {
    this.dialogRef.close(this.form_charge.value);
  }
   modifier_ligne() {  
    this.dialogRef.close(this.form_modifier_charge.value);
    this.ligne_table.Quantite = this.form_modifier_charge.controls['qte_modifier_ch'].value;
    this.ligne_table.PrixU_dv = this.form_modifier_charge.controls['PrixU'].value;
    this.ligne_table.Prix_t_dv = this.form_modifier_charge.controls['PrixU'].value * this.form_modifier_charge.controls['qte_modifier_ch'].value
     
  }
   
  
}
*/