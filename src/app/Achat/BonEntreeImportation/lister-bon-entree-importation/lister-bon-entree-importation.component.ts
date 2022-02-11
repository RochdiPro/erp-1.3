import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { ActivatedRoute, Router } from '@angular/router';
  
 
import { MatTableDataSource } from '@angular/material/table';
 import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
 import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BonEntreeImportationServiceService } from '../Services/bon-entree-importation-service.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-lister-bon-entree-importation',
  templateUrl: './lister-bon-entree-importation.component.html',
  styleUrls: ['./lister-bon-entree-importation.component.scss']
})
export class ListerBonEntreeImportationComponent implements OnInit {
  bonEntreeLocals: any = [];
  recherche: string = '';
  champ: any;
  liste_champs_bon_Entree : any;
  bonEntreeLocalDetail: any;
  detail: any;
  xmlexple: any;
  modele_BEL: any;
  modeleSrc: any;
  xmldata:any;
  newAttribute: any = {};
  fieldArray: Array<any> = [];
  displayedColumns: string[] = ['modifier', 'id_Bon_Entree_Local', 'type', 'n_Facture', 'date', 'id_Fr', 'depot', 'mode_Paiement', 'ag_Transport', 'charge_Transport', 'autre_Charge_Fixe', 'des', 'supprimer', 'Voir_pdf'];
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
  constructor(public bonEntreeService: BonEntreeImportationServiceService, private http: HttpClient, public datepipe: DatePipe) {
    this.BonEntrees();// Récupérer liste des bonEntreeLocals
    this.chargerModeleBEL();
    this.modelePdfBase64();
    //Récupérer la liste des champs du bon entrée local
    this.bonEntreeService.obtenirListeChampsBonEntree().subscribe((response: Response) => {
      this.liste_champs_bon_Entree = response;
    });
  }
  ngOnInit(): void {
  }
  //Récuperer tous bonEntrees
  BonEntrees() {
    this.bonEntreeService.BonEntrees().subscribe((data: any) => {
      this.bonEntreeLocals = new MatTableDataSource(data);
      this.bonEntreeLocals.paginator = this.paginator;
      this.bonEntreeLocals.sort = this.sort;
    });
  }
  //Supprimer bon entree  
  SupprimerBonEntree(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.bonEntreeService.supprimerBonEntree(id);

        Swal.fire(
          'Bon Entree Local Supprimé avec succés!',
          '',
          'success'
        )
      window.location.reload();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })

  }
  //Champ selectionné pour le filtre
  onOptionsSelected(value: string) {

    this.champ = value;

  }
  //filtrer Bon Entree 
  filtrerBonEntree() {
    if (this.champ == '' || this.recherche == '') {
      this.BonEntrees();
      Swal.fire("Champ vide!")
    }
    else
      this.bonEntreeService.filtrerBonEntree (this.champ, this.recherche).subscribe((response: Response) => {
        this.bonEntreeLocals = response;
        if (this.bonEntreeLocals == '') {
          Swal.fire("Bon d'entrée Importation non trouvé!")
          this.BonEntrees();
        }
      });
  }
  //Créer contenu du table pdf
  contenuTable(data: any, columns: any) {
    var body = [];
    body.push(columns);
    data.forEach(function (row: any) {
      var dataRow: any = [];
      columns.forEach(function (column: any) {
        dataRow.push(row[column]);
      })
      body.push(dataRow);
    });
    return body;
  }
  //tables pdf
  table(data: any, columns: any) {
    return {
      table: {
        headerRows: 1,
        body: this.contenuTable(data, columns),
        alignment: "right"
      }, layout: 'headerLineOnly',
    };
  }
  //Voir PDF
  visualiserPDF(ID_Bon: any ) {
    
    var be 
    var tva19,tva13,tva7;
    this.bonEntreeService.BonEntree(ID_Bon).subscribe((detail: any) => {
       be = detail;
    });

    this.bonEntreeService.DetailBonEntreeLocal(ID_Bon).subscribe((detail: any) => {
       
      var tempArr =[];
      const reader = new FileReader();
      reader.onloadend = () => {
        this.bonEntreeLocalDetail = reader.result;
        var parseString = require('xml2js').parseString;
        let data1 ;
        parseString(atob(this.bonEntreeLocalDetail.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Entree_Importation;  
          tva19=data1.Taxes[0].TVA[0].TVA19;  
          tva13=data1.Taxes[0].TVA[0].TVA13; 
          tva7=data1.Taxes[0].TVA[0].TVA7; 
        })
        this.xmldata = data1;
       
        if(data1.Produits[0].Produits_Simples[0].Produit!= undefined){
        for (let i = 0; i < data1.Produits[0].Produits_Simples[0].Produit.length; i++) 
        { 
           let Id_Produit: any =data1.Produits[0].Produits_Simples[0].Produit[i].Id;  
           let Nom_Produit: any  =data1.Produits[0].Produits_Simples[0].Produit[i].Nom;
           let Ref_FR: any =data1.Produits[0].Produits_Simples[0].Produit[i].Ref;
           let Quantite: any =data1.Produits[0].Produits_Simples[0].Produit[i].Qte ;
           let M_TVA: any  = Number (data1.Produits[0].Produits_Simples[0].Produit[i].Montant_Tva).toFixed(3);
           let Prix_rev_ht: any=Number (data1.Produits[0].Produits_Simples[0].Produit[i].Prix_Revient_U).toFixed(3);
           let Total_rev_ht: any =Number (data1.Produits[0].Produits_Simples[0].Produit[i].Total_rev_ht).toFixed(3);
           let Taxe: any =Number (data1.Produits[0].Produits_Simples[0].Produit[i].Totaltaxe).toFixed(3);
          
           tempArr.push(
            {
              ID:  Id_Produit,
              Nom:  Nom_Produit,
              Ref_FR:   Ref_FR,
              Quantité: Quantite,
              Prix_R_U_HT:  Prix_rev_ht,
              TVA:   M_TVA,
              Taxe:  Taxe,
              Total_R_TTC:  Total_rev_ht ,
            });
          
        }
         }
        if(data1.Produits[0].Produits_4Gs[0].Produit!= undefined){
        for (let i = 0; i < data1.Produits[0].Produits_4Gs[0].Produit.length; i++) 
        {   
         let Id_Produit: any = data1.Produits[0].Produits_4Gs[0].Produit[i].Id ;
          let Nom_Produit: any = data1.Produits[0].Produits_4Gs[0].Produit[i].Nom;
          let Ref_FR: any = data1.Produits[0].Produits_4Gs[0].Produit[i].Ref;
          let Quantite: any = data1.Produits[0].Produits_4Gs[0].Produit[i].Qte;
          let M_TVA: any =  Number (data1.Produits[0].Produits_4Gs[0].Produit[i].Montant_Tva).toFixed(3);
          let Prix_rev_ht: any =  Number (data1.Produits[0].Produits_4Gs[0].Produit[i].Prix_Revient_U).toFixed(3);
          let Total_rev_ht: any =  Number (data1.Produits[0].Produits_4Gs[0].Produit[i].Total_rev_ht ).toFixed(3);
          let Taxe: any =  Number (data1.Produits[0].Produits_4Gs[0].Produit[i].Totaltaxe).toFixed(3);
                          
          tempArr.push(
            {
              ID:  Id_Produit,
              Nom:  Nom_Produit,
              Ref_FR:   Ref_FR,
              Quantité: Quantite,
              Prix_R_U_HT:  Prix_rev_ht,
              TVA:   M_TVA,
              Taxe:  Taxe,
              Total_R_TTC:  Total_rev_ht,
            });
          
         
        }}
        if(data1.Produits[0].Produits_Series[0].Produit!= undefined){
        for (let i = 0; i < data1.Produits[0].Produits_Series[0].Produit.length; i++) 
        { 
          let Id_Produit: any =(data1.Produits[0].Produits_Series[0].Produit[i].Id); ;
          let Nom_Produit: any  =(data1.Produits[0].Produits_Series[0].Produit[i].Nom);;
          let Ref_FR: any =data1.Produits[0].Produits_Series[0].Produit[i].Ref ;
          let Quantite: any =data1.Produits[0].Produits_Series[0].Produit[i].Qte ;
          let M_TVA: any  =data1.Produits[0].Produits_Series[0].Produit[i].Montant_Tva;
          
          let Prix_rev_ht: any= Number (data1.Produits[0].Produits_Series[0].Produit[i].Prix_Revient_U).toFixed(3);
          let Total_rev_ht: any = Number ( data1.Produits[0].Produits_Series[0].Produit[i].Total_rev_ht ).toFixed(3);
          let Taxe: any =Number ( data1.Produits[0].Produits_Series[0].Produit[i].Totaltaxe).toFixed(3);
           
          
   
    
          tempArr.push(
            {
              ID:  Id_Produit,
              Nom:  Nom_Produit,
              Ref_FR:   Ref_FR,
              Quantité: Quantite,
              Prix_R_U_HT:  Prix_rev_ht,
              TVA:   M_TVA,
              Taxe:  Taxe,
              Total_R_TTC:  Total_rev_ht,
            }); 
          
        }}
      
      
        var dd = {
          background: [
            {
              image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
            }
          ],
          content: [
            {
              text: 'Informations Générales :' + '\n\n',
              fontSize: 15,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              columns: [
                {
                  text: 'Id Bon Entrée Importation :' + '\t' + ID_Bon + '\n\n' + 'Id Fournisseur :' + '\t' + be.id_Fr + '\n\n'
                    + 'Agence Transport :' + '\t' + be.ag_Transport + '\n\n' + 'Agence Transitaire :' + '\t' + be.ag_Transitaire + '\n\n'
                    + 'Charge Fixe :' + '\t' + be.totale_Taxe + '\n\n'
                  ,
                  fontSize: 10,
                  alignment: 'left',
                  color: 'black'
                },
                {
                  text: 'Type :' + '\t' + be.type + '\n\n' + 'Local :' + '\t' + be.local + '\n\n'
                    + 'Date :' + '\t' + this.datepipe.transform(be.date_Be, 'dd/MM/yyyy') + '\n\n' + 'Mode Paiement :' + '\t' + be.mode_Paiement + '\n\n'
                  ,
                  fontSize: 10,
                  alignment: 'left',
                  color: 'black'
                },
              ]
            },
            {
              text: 'Note :' + '\t' + be.description
              ,
              fontSize: 10,
              alignment: 'left',
              color: 'black'
            }
            ,
            {
              text: '\n\n'
            },
            {
              text: 'Détails :' + '\t',
              fontSize: 20,
              alignment: 'left',
              color: 'black',
              bold: true
            },
            {
              text: '\n\n'
            },
            this.table(tempArr, ['ID', 'Nom', 'Ref_FR', 'Quantité', 'Prix_R_U_HT', 'TVA','Taxe', 'Total_R_TTC']),
            {
              text: '\n\n\n'
            },
           , {
              columns: [
                {
                  table: {
                    alignment: 'right',
                    body: [
                      [{ text: 'T.V.A', alignment: 'left' }, 19, 13, 7],                      
                      [{ text: 'Montant', alignment: 'left' }, tva19, tva13, tva7],
                    ]
                  },
                  layout: 'lightHorizontalLines',
                  alignment: 'right',
                },
                {
                },
                {
                  style: 'tableExample',
                  table: {
                    heights: [20],
                    body: [
                      [{ text: 'Total Déclarer  ', alignment: 'left' }, { text: Number(be.totale_Declare).toFixed(3), alignment: 'right' }],
                      
                    
                      [{ text: 'Total Fodec', alignment: 'left' }, { text: Number(be.total_Fodec).toFixed(3), alignment: 'right' }],
                      [{ text: 'Total T.V.A', alignment: 'left' }, { text: Number ( be.total_Tva).toFixed(3), alignment: 'right' }],
                      
                      [{ text: 'Total R.H.T ', alignment: 'left' }, { text: Number(be.total_R_HT).toFixed(3), alignment: 'right' }],
                    
                    ]
                  },
                  layout: 'lightHorizontalLines',
                }]
            }, 
          ],
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
                  alignment: 'center'
                }
              ]
            };
          },
          pageMargins: [30, 125, 40, 60],
        };
        pdfMake.createPdf(dd).open();
      }
      reader.readAsDataURL(detail);
    });
    
  }
  //temps de charger l'image du pdf
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //definir modele pour pdf 
  async modelePdfBase64() {
    await this.delai(3000);
    const reader = new FileReader();
    reader.onloadend = () => {
      this.modeleSrc = reader.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    reader.readAsDataURL(this.modele_BEL);
  }
  //charger l'image du pdf
  async chargerModeleBEL() {
    this.http.get('.././assets/images/template_BEI.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.modele_BEL = resp;
      return this.modele_BEL;
    }, err => console.error(err),
      () => console.log())
  }
}

