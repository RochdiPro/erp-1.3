import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
 import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2'
import 'sweetalert2/src/sweetalert2.scss'
import { DatePipe } from '@angular/common';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { BonEntreeService } from '../Service/bon-entree.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

//var parseString = require('xml2js').parseString;


 
@Component({
  selector: 'app-lister-bon-entree',
  templateUrl: './lister-bon-entree.component.html',
  styleUrls: ['./lister-bon-entree.component.scss']
})
export class ListerBonEntreeComponent implements OnInit {
  bonEntreeLocals: any ;
  recherche: string = '';
  champ: any;
  liste_champs_bon_Entree_Local: any;
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;


  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  displayedColumns: string[] = ['modifier', 'id_Bon_Entree_Local', 'type', 'n_Facture', 'date' , 'Local',   'ag_Transport',  'des', 'supprimer', 'Voir_pdf'];
  dataSource = new MatTableDataSource<table>();

  
  form = new FormGroup({ id_Bon_Entree_Local: new FormControl(""), type: new FormControl(""), n_Facture: new FormControl("") ,
  etat: new FormControl(""), local: new FormControl("")});

  constructor(private datePipe: DatePipe,public bonEntreeService: BonEntreeService, private http: HttpClient, public datepipe: DatePipe) {
  //  this.BonEntreeLocals();// Récupérer liste des bonEntreeLocals
    this.bonEntreeService.obtenirListeChampsBonEntreeLocal().subscribe((response: Response) => {     
       this.liste_champs_bon_Entree_Local = response;
    });
    this.chargementModel();
    this.modelePdfBase64();

    sessionStorage.setItem('Utilisateur', "rochdi");
     
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
  ngOnInit(): void {
    this.BonEntreeLocals();
     
  }
  //Récuperer tous bonEntreeLocals
  BonEntreeLocals() {
    this.bonEntreeService.BonEntreeLocals().subscribe((data: any) => {
      this.bonEntreeLocals = data;
      this.bonEntreeLocals = this.bonEntreeLocals.sort((a:any, b:any) => a.id_Bon_Entree_Local > b.id_Bon_Entree_Local ? -1 : 1); 
      this.dataSource.data = data as table[];
    });
  }
  //Supprimer bon entree local 
  SupprimerBonEntreeLocal(id: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.bonEntreeService.supprimerBonEntreeLocal(id);

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
  //filtrer Bon Entree Local
  filtrerBonEntreeLocal() {
    if (this.champ == '' || this.recherche == '') {
      this.BonEntreeLocals();
      Swal.fire("Champ vide!")
    }
    else
      this.bonEntreeService.filtrerBonEntreeLocal(this.champ, this.recherche).subscribe((data: any) => {
        this.bonEntreeLocals = data;
        this.bonEntreeLocals = this.bonEntreeLocals.sort((a:any, b:any) => a.id_Bon_Entree_Local > b.id_Bon_Entree_Local ? -1 : 1); 
        this.dataSource.data = data as table[]; 
      });
  }
 
 // filtre 5 champs de bon entree
  filtre() {
    this.bonEntreeService.filtre("id_Bon_Entree_Local", this.form.get('id_Bon_Entree_Local')?.value, "type", this.form.get('type')?.value, "n_Facture", this.form.get('n_Facture')?.value ,"etat", this.form.get('etat')?.value,"local", this.form.get('local')?.value,).subscribe((data) => {
      this.dataSource.data = data as table[];
    });
  }
  obj: any = {};
  xmldata: any;
  bonEntreeLocalDetail: any
  bonEntreeLocalData: any
  date_creation: any;
  nom_fr: any;
  datafr: any;
  detail_produit:any=[];
  newAttribute: any = {};
  produitData: any;
  fieldArray: Array<any> = [];

   //ajouter article 
   ajouter(id: any, prix: any, qte: any, remise: any , detail:any) {
   
    this.bonEntreeService.Produit(id).subscribe((response: Response) => {
    
      this.produitData = response;
      this.newAttribute.Id_Produit = id;
      this.newAttribute.Id_produit = id;
      this.newAttribute.des = this.produitData.caracteristique_Technique;
      this.newAttribute.Nom_Produit = this.produitData.nom_Produit;
      this.newAttribute.Quantite = Number(qte); 
      this.newAttribute.detail = detail 
      this.fieldArray.push(this.newAttribute);      
      this.newAttribute = {};
    });
  }
  get_detail(id :any)
  {
    this.bonEntreeService.BonEntreeLocal( id).subscribe((data) => {
      this.bonEntreeLocalData = data
      this.date_creation = new Date(this.bonEntreeLocalData.date_Creation);
      this.bonEntreeService.Fournisseur(this.bonEntreeLocalData.id_Fr).subscribe((data7) => {
        this.datafr = data7
        this.nom_fr=this.datafr.nom_Fournisseur
         
      })     
    })  
    this.bonEntreeService.DetailBonEntreeLocal( id).subscribe((detail: any) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        this.bonEntreeLocalDetail = reader.result;
        var parseString = require('xml2js').parseString;
        let data1
        parseString(atob(this.bonEntreeLocalDetail.substr(28)), function (err: any, result: any) {
          data1 = result.Bon_Entree_Local;
        })
        this.xmldata = data1
        if (this.xmldata.Produits[0].Produits_Simples[0].Produit != undefined) {

          for (let j = 0; j < this.xmldata.Produits[0].Produits_Simples[0].Produit.length; j++) {
            this.detail_produit=[]
            this.ajouter(this.xmldata.Produits[0].Produits_Simples[0].Produit[j].Id.toString(), this.xmldata.Produits[0].Produits_Simples[0].Produit[j].Prix_U_HT.toString()
             , this.xmldata.Produits[0].Produits_Simples[0].Produit[j].Qte.toString(), this.xmldata.Produits[0].Produits_Simples[0].Produit[j].Remise , this.detail_produit)

          }
        }
        if (this.xmldata.Produits[0].Produits_4Gs[0].Produit != undefined) {
          
          for (let j = 0; j < this.xmldata.Produits[0].Produits_4Gs[0].Produit.length; j++) {  
            for (let k = 0; k < this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G.length; k++) {
              this.obj = {}
              this.obj.e1 = this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E1.toString();
              this.obj.e2 = this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].E2.toString();
              this.obj.ns = this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Produit_4Gs[0].Produit_4G[k].N_Serie.toString();
              this.detail_produit.push(this.obj)
            }         
            this.ajouter(this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Id.toString(),this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Prix_U_HT.toString()
            , this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Qte.toString(),this.xmldata.Produits[0].Produits_4Gs[0].Produit[j].Remise,this.detail_produit)
          }
          
        }
        if (this.xmldata.Produits[0].Produits_Series[0].Produit != undefined) {
          for (let j = 0; j < this.xmldata.Produits[0].Produits_Series[0].Produit.length; j++) {
            this.detail_produit = []
            for (let k = 0; k < this.xmldata.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie.length; k++) {
              this.obj = {}
              this.obj.ns = this.xmldata.Produits[0].Produits_Series[0].Produit[j].N_Series[0].N_Serie[k].toString();
              if (this.obj.ns == '') {
                this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
              }
              this.detail_produit.push(this.obj)
            }
            
            this.ajouter(this.xmldata.Produits[0].Produits_Series[0].Produit[j].Id.toString(), this.xmldata.Produits[0].Produits_Series[0].Produit[j].Prix_U_HT.toString()
            , this.xmldata.Produits[0].Produits_Series[0].Produit[j].Qte.toString(), this.xmldata.Produits[0].Produits_Series[0].Produit[j].Remise ,  this.detail_produit)
          }
        }
        if (this.xmldata.Produits[0].Produits_N_Lot[0].Produit != undefined) {
          
          for (let j = 0; j < this.xmldata.Produits[0].Produits_N_Lot[0].Produit.length; j++) {
            this.detail_produit = [] 
            for (let k = 0; k < this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].N_Lots[0].N_Lot.length; k++) {
              this.obj = {}
              this.obj.n_Lot = this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].N_Lots[0].N_Lot[k].Numero;
              this.obj.qte = this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].N_Lots[0].N_Lot[k].Qte;
              this.obj.date_fabrication = this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].N_Lots[0].N_Lot[k].Date_Fabrication;
              this.obj.date_validite = this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].N_Lots[0].N_Lot[k].Date_Validite;
              console.log(this.obj)
              if (this.obj.n_Lot == '' || this.obj.qte == '' || this.obj.date_validite == '' || this.obj.date_fabrication == '') {
                this.newAttribute.EtatEntree = "Entrée Stock Non Accompli";
              }
              this.detail_produit.push(this.obj)
            } 
            this.ajouter(this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].Id.toString(), this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].Prix_U_HT.toString()
            , this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].Qte.toString(), this.xmldata.Produits[0].Produits_N_Lot[0].Produit[j].Remise,this.detail_produit)
             
          }
        }
        
      }
      reader.readAsDataURL(detail);
    })

  }

  visualiserPDF(id :any)
  {
        this.get_detail(id)
        Swal.fire({
          title: "Bon d'entrée local ",
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
            this.generatePDF(id, this.bonEntreeLocalData.date_Creation)

          } else if (result.isDenied) {
            this.generatePDF_annexe(id,this.bonEntreeLocalData.date_Creation)

          }
        });


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
        console.log(body)
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
              text: '' + this.bonEntreeLocalData.local+ '\n\n',
              fontSize: 10,
              color: 'black',
              bold: true,
              relativePosition: { x: 65, y: 131 }
            },
            {
              text: '' + this.nom_fr + '\n\n',
              fontSize: 10,
              color: 'black',
              bold: true,
              relativePosition: { x: 100, y: 154 }
            },
    
            {
              text: '' + this.bonEntreeLocalData.n_Facture+ '\n\n',
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
              text: ' ' + this.bonEntreeLocalData.description,
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
    // temps d'attente pour le traitement de fonction 
    delai(ms: number) {
      return new Promise(resolve => setTimeout(resolve, ms));
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
          text: '' + this.bonEntreeLocalData.local + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 65, y: 131 }
        },
        {
          text: '' + this.nom_fr + '\n\n',
          fontSize: 10,
          color: 'black',
          bold: true,
          relativePosition: { x: 100, y: 154 }
        },

        {
          text: '' + this.bonEntreeLocalData.n_Facture+ '\n\n',
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
          text: ' ' + this.bonEntreeLocalData.description ,
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
}


export interface table {
  id_Bon_Entree_Local: number;
  type: string
  n_Facture: string;
  etat: string
  local: string;
  ag_Transport: string
  description: string;
  date_Creation: string
 
}