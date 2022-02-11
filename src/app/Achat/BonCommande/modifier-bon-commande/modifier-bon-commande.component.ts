import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BonCommandeService } from '../Service/bon-commande.service';
import { AjouterArticles_bcComponent } from '../dialogue/dialogue-commande/dialogue-commande.component';
import { DatePipe } from '@angular/common';
import { MatSelectChange } from '@angular/material/select';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-modifier-bon-commande',
  templateUrl: './modifier-bon-commande.component.html',
  styleUrls: ['./modifier-bon-commande.component.scss']
})
export class ModifierBonCommandeComponent implements OnInit {

  isLinearBE = false;
  InformationsGeneralesForm: any = FormGroup;
  ListeArticleForm: any = FormGroup;
  sommeRTTC: any = 0; sommeRHT: any = 0; sommetva: any = 0; sommefodec: any = 0; sommedeclare: any = 0; sommedv: any = 0; sommetaxe: any = 0; sommecharge: any = 0; sommechargeimpo: any = 0;
  fieldArray: Array<any> = [];
  Ref_FR_article: any;
  lineaire = false;
  fournisseurs: any = [];
  produits: any = []; date_de_jour = new Date();
  newAttribute: any = {};
  Id_Produit: any;
  click: any;
  produitData: any;
  categorie_paiement: any;
  ancien_prix: any;
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
  Totale_TTC: any;
  Montant_TVA: any;
  type_bc: any = true;
  modele2: any; modele: any;
  data_bc:any;
  constructor(private http: HttpClient, private fb: FormBuilder,  private route: ActivatedRoute ,private Service: BonCommandeService, public dialog: MatDialog, private datePipe: DatePipe) {
    this.Fournisseurs();
    this.Service.Bon_Commande(this.route.snapshot.params.id).subscribe((databc:any)=>{
    this.data_bc=databc;
    })
    this.InformationsGeneralesForm = this.fb.group({
      Des: [''],
      Datecom: ['', Validators.required],
      Devise: ['DT'],
      Type: ['', Validators.required],
      Fournisseur: [''],
      contact: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Email: ['', [
        Validators.required,
        Validators.email,
      ]],
      DateLivraison: ['', Validators.required],
      reglement: ['', Validators.required],
      lieu_livraison: ['', Validators.required],
      mode_livraison: ['', Validators.required],

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
      Prix_HT: ['0'],
      Totale_TTC: ['0'],

    });
    this.chargementModel();
    this.modelePdfBase64();
  }
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
    lecteur.onloadend = () => {
      this.modeleSrc2 = lecteur.result;
      this.modeleSrc2 = btoa(this.modeleSrc2);
      this.modeleSrc2 = atob(this.modeleSrc2);
      this.modeleSrc2 = this.modeleSrc2.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele2);
  }


  // récupération de modele pour créer le pdf
  async chargementModel() {
    this.http.get('./../../assets/images/bc.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele = reponse;
      return this.modele;
    }, err => console.error(err))
    this.http.get('./../../assets/images/bc_local.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele2 = reponse;
      return this.modele2;
    }, err => console.error(err))

  }
  resultat_dialog: any;
  table_articles: any = [];
  //** open Dialog */
  openDialog() {
    const dialogRef = this.dialog.open(AjouterArticles_bcComponent, {
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
          if (test == "0") { this.ajouter(this.resultat_dialog[i]); }
        }
        this.calcul();
      }
    });
  }

  //choix  type bc 
  choix_type(event: MatSelectChange) {
    if (event.value == "DT") {
      this.type_bc = true
    }
    else {
      this.type_bc = false

    }
  }

  nom_fr:any;code_fr:any;
  //choix de fournisseur 
  choix_fr(event: MatSelectChange) {
    this.Service.Fournisseur(event.value).subscribe((data:any)=>{
         this.nom_fr=data.nom_Fournisseur
         this.code_fr=data.id_Fr
    })
     
  }


  //ajouter article 
  ajouter(obj: any) {
    this.click = !this.click;

    this.newAttribute.Id_Produit = obj.id_Produit;
    this.newAttribute.Id_produit = obj.id_Produit;
    this.newAttribute.des = obj.caracteristique_Technique;
    this.newAttribute.Nom_Produit = obj.nom_Produit;
    this.newAttribute.remise = obj.remise;
    this.newAttribute.Tva = obj.tva;
    if (obj.fodec == "Sans_Fodec") {
      this.newAttribute.Fodec = 0;
    }
    else {
      this.newAttribute.Fodec = 1;
    }
    this.newAttribute.PrixU = Number(obj.prix).toFixed(3);
    this.newAttribute.Prix_avec_remise = (Number(obj.prix) * (1 - (Number(obj.remise)) / 100)).toFixed(3);
    this.newAttribute.Quantite = Number(obj.qte);
    this.newAttribute.Ref_FR = obj.ref_fr;

    this.newAttribute.Montant_HT = Number(Number(this.newAttribute.Prix_avec_remise) * Number(this.newAttribute.Quantite))
    this.Totale_TTC = (Number(this.newAttribute.Prix_avec_remise) / (1 + (Number(this.newAttribute.Tva)) / 100)).toFixed(3);
    this.Montant_Fodec = (this.newAttribute.Montant_HT * this.newAttribute.Fodec) / 100;
    this.newAttribute.Montant_Fodec = Number(this.Montant_Fodec);

    this.Montant_TVA = ((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec)) * this.newAttribute.Tva) / 100;
    this.newAttribute.Montant_TVA = Number(this.Montant_TVA);
    this.newAttribute.Prix_U_TTC = (((Number(this.newAttribute.Montant_HT) + Number(this.newAttribute.Montant_Fodec) + Number(this.newAttribute.Montant_TVA))) / Number(this.newAttribute.Quantite)).toFixed(3);
    this.newAttribute.Montant_TTC = Number(this.newAttribute.Prix_U_TTC) * Number(this.newAttribute.Quantite);
    this.newAttribute.Total_TVA = ((Number(this.newAttribute.Montant_TVA)) / (Number(this.newAttribute.Quantite))).toFixed(3);
    this.newAttribute.Totale_TTC = Number(this.Totale_TTC);
    this.newAttribute.Total_HT = Number(this.newAttribute.Prix_avec_remise * this.newAttribute.Quantite).toFixed(3);
    console.log(this.newAttribute)
    this.fieldArray.push(this.newAttribute);
    this.calcul();
    this.newAttribute = {};

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


  a: any;
  // modifer catégorie 
  modifer_prix_remise(i: any, id: any, nom: any) {

    Swal.fire({
      title: 'Utilisateur',
      html:
        '<table>' +
        '<tr><td>Prix U</td><td> <input id="swal-input1" value="' + this.fieldArray[i].PrixU + '" class="swal2-input"  ></td></tr>' +
        '<tr><td>% Remise</td><td><input id="swal-input2" value="' + this.fieldArray[i].remise + '" class="swal2-input"   >  </td></tr>' +
        '</table>',
      focusConfirm: false,
      preConfirm: () => {
        return [(<HTMLInputElement>document.getElementById('swal-input1')).value,
        (<HTMLInputElement>document.getElementById('swal-input2')).value,


        ]
      },
      allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
      this.a = result.value

      if (result.isConfirmed) {
        this.fieldArray[i].PrixU = this.a[0]
        this.fieldArray[i].remise = this.a[1]
        this.calcul();
      }

    })
  }


// generate pdf  etranger
  modeleSrc: any; modeleSrc2: any;
  ch: any;
  generatePDF(id: any, date_Creation: any) {

    var body = [];
    var obj = new Array();
    var body = [];
    var obj = new Array();
    for (let i = 0; i < this.fieldArray.length; i++) {
      obj = new Array();
      obj.push("" + this.fieldArray[i].Id_Produit);
      obj.push("" + this.fieldArray[i].Ref_FR);
      let v = { text: this.fieldArray[i].Nom_Produit + " : " + this.fieldArray[i].des + "\n" }
      obj.push(v)
      obj.push({ text: Number(this.fieldArray[i].PrixU).toFixed(2), alignment: 'right' }); 
      obj.push({ text: this.fieldArray[i].Quantite, alignment: 'right' }); 
      obj.push({ text: Number(this.fieldArray[i].Total_HT).toFixed(2), alignment: 'right' } );
      body.push(obj)
    }
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');
    let def = {
      pageMargins: [40, 280, 40, 180],
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
          text: ''+this.code_fr,
          fontSize: 10,
          color: 'black',
          
          relativePosition: { x: 73, y: 109 },

        },
        {
          text: ''+this.nom_fr,
          fontSize: 10,
          color: 'black',
        
          relativePosition: { x: 160, y: 109 },

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
          text: 'x' + this.InformationsGeneralesForm.get('lieu_livraison').value + '\n\n',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 110, y: 157}
        },
        {
          text: ' ' + this.datePipe.transform(this.InformationsGeneralesForm.get('DateLivraison').value, 'dd/MM/yyyy') + '\n\n',
          fontSize: 10,
          color: 'black',
          
          relativePosition: { x: 100, y: 133 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('reglement').value + '\n\n',
          fontSize: 10,
          color: 'black',
        
          relativePosition: { x: 90, y: 182 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('mode_livraison').value + '\n\n',
          fontSize: 10,
          color: 'black',

          relativePosition: { x: 115, y: 207 }
        },
         
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 370, y: 210 }
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
            widths: [50,50, 260, 50,40, 50],
            body: body
          }
        }
      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'bc' + id + '.pdf' });

  }

  // generate pdf local avec tva et taxe 
  generatePDF_local(id: any, date_Creation: any) {

    var body = [];
    var obj = new Array();
    var body = [];
    var obj = new Array();
    for (let i = 0; i < this.fieldArray.length; i++) {
      obj = new Array();
      obj.push("" + this.fieldArray[i].Id_Produit);
      obj.push("" + this.fieldArray[i].Ref_FR);
      let v = { text: this.fieldArray[i].Nom_Produit + " : " + this.fieldArray[i].des + "\n" }
      obj.push(v)
      obj.push({ text: this.fieldArray[i].Quantite, alignment: 'center' }); 
      obj.push({ text: Number(this.fieldArray[i].PrixU).toFixed(3), alignment: 'right' }); 
       let ch3 =   "TVA "+this.fieldArray[i].Tva+" % \n"; let ch2 =  " + " + Number(this.fieldArray[i].Montant_TVA).toFixed(3) + "\n ";

      if (this.fieldArray[i].Montant_Fodec > 0) { 
        ch3 = ch3 + "Fodec 1 %  \n"; ch2 = ch2 + " + " + this.fieldArray[i].Montant_Fodec + "\n" ; 
      }
      let res = Number (this.fieldArray[i].PrixU) -Number( this.fieldArray[i].Prix_avec_remise )
      if (this.fieldArray[i].remise > 0) { 
        ch3 = ch3 + "Remise " + this.fieldArray[i].remise + " %"; ch2 = ch2 + " -  " +  res + "\n" 
      }
      ch2=ch2+ Number(this.fieldArray[i].Total_HT).toFixed(3 )+"\n"
      obj.push(ch3);
      obj.push(ch2)
   //   obj.push({ text: Number(this.fieldArray[i].Total_HT).toFixed(3), alignment: 'right' } );
      body.push(obj)
    }
    let date_edit = this.datePipe.transform(new Date(), 'dd/MM/yyyy  | HH:MM');
    let def = {
      pageMargins: [40, 280, 40, 180],
      info: {
        title: 'Fiche Bon Commande ',
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
          text: ''+this.code_fr,
          fontSize: 10,
          color: 'black',
          
          relativePosition: { x: 73, y: 109 },

        },
        {
          text: ''+this.nom_fr,
          fontSize: 10,
          color: 'black',
        
          relativePosition: { x: 160, y: 109 },

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
          text: 'x' + this.InformationsGeneralesForm.get('lieu_livraison').value + '\n\n',
          fontSize: 10,
          color: 'black',
          relativePosition: { x: 110, y: 157}
        },
        {
          text: ' ' + this.datePipe.transform(this.InformationsGeneralesForm.get('DateLivraison').value, 'dd/MM/yyyy') + '\n\n',
          fontSize: 10,
          color: 'black',
          
          relativePosition: { x: 100, y: 133 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('reglement').value + '\n\n',
          fontSize: 10,
          color: 'black',
        
          relativePosition: { x: 90, y: 182 }
        },

        {
          text: '' + this.InformationsGeneralesForm.get('mode_livraison').value + '\n\n',
          fontSize: 10,
          color: 'black',

          relativePosition: { x: 115, y: 207 }
        },
         
        {
          text: '' + id + '\n\n',
          fontSize: 15,
          color: 'black',
          bold: true,
          relativePosition: { x: 370, y: 210 }
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
          image: 'data:image/jpeg;base64,' + this.modeleSrc2, width: 600
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
            widths: [50,50, 180,50,45, 70,70],
            body: body
          }
        }
      ],

    };

    pdfMake.createPdf(def).open({ defaultFileName: 'bc' + id + '.pdf' });

  }

  // generate pdf 
  generatepdf (id: any, date_Creation: any)
  {
    console.log("eee")
    if (this.InformationsGeneralesForm.get('Devise').value=="DT")
    {
    
     this.generatePDF_local(id, date_Creation);
    }
    else {
       

      this.generatePDF(id, date_Creation);
    }
  }

  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
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

      total5 += (Number(this.fieldArray[i].PrixU) - (Number(this.fieldArray[i].Prix_avec_remise)) * (Number(this.fieldArray[i].Quantite)))
      this.totalRemise = total5.toFixed(3);
      total9 += (Number(this.fieldArray[i].Fodec) * (Number(this.fieldArray[i].Quantite)));
      this.totalPorcentageFodec = total9;
      total6 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)));
      this.totalRHT = total6.toFixed(3);
      total7 += ((Number(this.fieldArray[i].PrixRevientU)) * (Number(this.fieldArray[i].Quantite)) + Number(this.fieldArray[i].Montant_TVA) + Number(this.fieldArray[i].Montant_Fodec));
      this.totalRTTC = total7.toFixed(3);

      total10 += this.fieldArray[i].Montant_Fodec;
      total11 += (Number(this.fieldArray[i].Prix_avec_remise) * Number(this.fieldArray[i].Quantite));
      this.totalHTBrut = total11.toFixed(3);
      this.totalMontantFodec = total10.toFixed(3);
      this.totalMontantTVA = total1.toFixed(3);
    }
  }
  ngOnInit(): void {
  }



  reponseajout: any
  //ajouter bon commande sous forme d'in fichier
  ajouterFicheBoncommande() {


    var formData: any = new FormData();


    var doc = document.implementation.createDocument("Bon_Commande", "", null);

    var BEl = doc.createElement("Bon_Commande");
    var InformationsGenerales = doc.createElement("Informations-Generales");
    var Id_Fr = doc.createElement("Id_Fr"); Id_Fr.innerHTML = this.InformationsGeneralesForm.get('Fournisseur').value
    var lieu_livraison = doc.createElement("lieu_livraison"); lieu_livraison.innerHTML = this.InformationsGeneralesForm.get('lieu_livraison').value

    var Mode_Paiement = doc.createElement("Mode_Paiement"); Mode_Paiement.innerHTML = this.InformationsGeneralesForm.get('reglement').value
    var Date = doc.createElement("Date_Livraison"); Date.innerHTML = this.InformationsGeneralesForm.get('DateLivraison').value
    var Description = doc.createElement("Description"); Description.innerHTML = this.InformationsGeneralesForm.get('Des').value
    var Total_Facture_HT = doc.createElement("Total_HT"); Total_Facture_HT.innerHTML = this.totalHTBrut


    InformationsGenerales.appendChild(Id_Fr);
    InformationsGenerales.appendChild(Mode_Paiement);
    InformationsGenerales.appendChild(lieu_livraison);
    InformationsGenerales.appendChild(Date);
    InformationsGenerales.appendChild(Description);
    InformationsGenerales.appendChild(Total_Facture_HT);



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


    Total.appendChild(TotalHTBrut); Total.appendChild(TotalRemise); Total.appendChild(TotalHTNet); Total.appendChild(TotalFodec);
    Total.appendChild(TotalTVA); Total.appendChild(totalTTc);



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
        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);


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

        Produit.appendChild(id);
        Produit.appendChild(Nom);

        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);



        Produits_N_Lot.appendChild(Produit);
      }
      else {

        var Produit = doc.createElement('Produit')
        var id = doc.createElement('Id'); id.innerHTML = this.fieldArray[i].Id_Produit
        var Nom = doc.createElement('Nom'); Nom.innerHTML = this.fieldArray[i].Nom_Produit
        var Ref = doc.createElement('Ref'); Ref.innerHTML = this.fieldArray[i].Ref_FR
        var Qte = doc.createElement('Qte'); Qte.innerHTML = this.fieldArray[i].Quantite
        var Prix_U_HT = doc.createElement('Prix_U_HT'); Prix_U_HT.innerHTML = this.fieldArray[i].PrixU
        var Tva = doc.createElement('Tva'); Tva.innerHTML = this.fieldArray[i].Tva
        var Remise = doc.createElement('Remise'); Remise.innerHTML = this.fieldArray[i].Remise
        var Fodec = doc.createElement('Fodec'); Fodec.innerHTML = this.fieldArray[i].Fodec
        var Prix_U_TTC = doc.createElement('Prix_U_TTC'); Prix_U_TTC.innerHTML = this.fieldArray[i].Prix_U_TTC

        Produit.appendChild(id);
        Produit.appendChild(Nom);
        Produit.appendChild(Ref);
        Produit.appendChild(Qte);
        Produit.appendChild(Prix_U_HT);
        Produit.appendChild(Tva);
        Produit.appendChild(Remise);
        Produit.appendChild(Fodec);
        Produit.appendChild(Prix_U_TTC);


        Produits_Simples.appendChild(Produit);
      }
    }

    Produits.appendChild(Produits_Simples);
    Produits.appendChild(Produits_Series);
    Produits.appendChild(Produits_4Gs);
    Produits.appendChild(Produits_N_Lot)

    Produits.setAttribute('Fournisseur', this.InformationsGeneralesForm.get('Fournisseur').value);
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
        formData.append('Reglement', this.InformationsGeneralesForm.get('reglement').value);
        formData.append('Date', this.InformationsGeneralesForm.get('DateLivraison').value);
        formData.append('Description', this.InformationsGeneralesForm.get('Email').value);
        formData.append('Email', this.InformationsGeneralesForm.get('Des').value);
        formData.append('Date_Livraison', this.InformationsGeneralesForm.get('DateLivraison').value);
        formData.append('Contact', this.InformationsGeneralesForm.get('contact').value);
        formData.append('Devise', this.InformationsGeneralesForm.get('Devise').value);
        formData.append('Id_Responsable', '');

        formData.append('Lieu', this.InformationsGeneralesForm.get('lieu_livraison').value);
        formData.append('Mode_livraison', this.InformationsGeneralesForm.get('mode_livraison').value);
        formData.append('Total_HT_Brut', this.totalHTBrut);
        formData.append('Total_Remise', this.totalRemise);
        formData.append('Total_HT_Net', this.totalHT);
        formData.append('Total_Fodec', this.totalMontantFodec);
        formData.append('Total_Tva', this.totalMontantTVA);
        formData.append('Total_TTC', this.totalTTc);


        this.Service.ajouterBonCommande(formData).subscribe((data) => {
          this.reponseajout = data
          console.log(this.reponseajout)

          Swal.fire({
            title: "Bon Commande ",
            text: "Bon Commande ajouté avec succés",
            icon: 'success',
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: 'green',
            denyButtonColor: 'green',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Imprimer',
            cancelButtonText: 'Quitter',

          }).then((result) => {
            if (result.isConfirmed) {
              this.generatepdf(this.reponseajout.id_Bon_Commande, this.reponseajout.date_Creation)

            }
          })
        });
      });

    // this.router.navigate(['Menu/Menu-achat/Menu-bon-entree/Lister-bon-entree'])
  }




  //Récupérer tous fournisseurs
  Fournisseurs() {
    this.Service.Fournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
    });
  }


  // message d'erreur lorsque l'email' saisi ne respecte pas les conditions prédifinis
  MessageErreurEmail() {
    if (this.InformationsGeneralesForm.get('Email').hasError('required')) {
      return 'Vous devez saisir un  email!';
    }
    if (this.InformationsGeneralesForm.get('Email').hasError('email')) {
      return 'saisir un email valide!';
    }
  }

  // message d'erreur lorsque le representant saisi ne respecte pas les conditions prédifinis
  MessageErreurRepresentant() {
    if (this.InformationsGeneralesForm.get('contact').hasError('required')) {
      return 'Vous devez entrer le representant du fournisseur!';
    }
    if (this.InformationsGeneralesForm.get('contact').hasError('minlength')) {
      return 'Representant non valide! (Min 3 caractères)';
    }
    if (this.InformationsGeneralesForm.get('contact').hasError('maxlength')) {
      return 'Representant non valide! (Max 30 caractères)';
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

      this.Service.Ref_FR_Article(this.Id_Produit).subscribe((data: any) => {
        this.Ref_FR_article = data.ref_Fr;
        this.ancien_prix = data.ancien_Prix;
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
                // this.ouvreDialogCharge(j, this.fieldArray[j], this.fieldArray);

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
  //message erreur type
  MessageErreurType() {
    if (this.InformationsGeneralesForm.get('Type').hasError('required')) {
      return 'Vous devez entrer le type!';
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
}



