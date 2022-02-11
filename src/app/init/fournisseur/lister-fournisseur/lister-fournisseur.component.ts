import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 
import Swal from 'sweetalert2';
import {MatSelectChange, MatSelectModule} from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FournisseurServiceService } from '../Service/fournisseur-service.service';
declare var require: any

const pdfMake = require("pdfmake/build/pdfmake");
const pdfFonts = require("pdfmake/build/vfs_fonts");

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-lister-fournisseur',
  templateUrl: './lister-fournisseur.component.html',
  styleUrls: ['./lister-fournisseur.component.scss'],
  
})
export class ListerFournisseurComponent implements OnInit {
  chargement = true;
   entiterFiltre: any;
  fournisseurs: any
  contenu_developper: any | null;
  displayedColumns: string[] = ['editer', 'Image', 'id_Fr', 'nom_Fournisseur', 'categorie_Fournisseur', 'code_Tva', 'email', 'tel1', 'sup' ];
 
  valeurRecherche: string = '';
  filtre = '';
  liste_Filtres: any = [];
  ModeleFournisseurSrc: any;
  template_fournisseur: any;
  detailFournisseur: any;
 
  @ViewChild(MatPaginator) paginator: any = MatPaginator;
  @ViewChild(MatSort) sort: any = MatSort;
 
  form = new FormGroup({ 
    id_Fr: new FormControl(""),
   nom_Fournisseur: new FormControl(""),
   code_Tva: new FormControl(""), 
   categorie_Fournisseur: new FormControl("") ,
   email: new FormControl("") ,
   tel1: new FormControl("") ,
  });

  
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
   
  dataSource = new MatTableDataSource<table>();

  
  constructor(private datePipe: DatePipe, private _snackBar: MatSnackBar, private http: HttpClient, private serviceFournisseur: FournisseurServiceService) {
    this.ChargementModeleFournisseur();   
    this.ListerFournisseurs();
    this.ModeleFournisseurPdfBase64();
     this.ouvrirMessageChargement();
     this.FiltresFournisseur();
    sessionStorage.setItem('Utilisateur', "rochdi");

  }
  ouvrirMessageChargement() {
    this._snackBar.open('Chargement!!', '', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // récuperer la liste des champs du fournisseur
  FiltresFournisseur() {
    this.chargement = true;
    this.serviceFournisseur.obtenirListeChampsFournisseur().subscribe((reponse: Response) => {
      this.liste_Filtres = reponse;
      this.chargement = false;
    });
  }
  // récuperer la liste des fournisseurs
  ListerFournisseurs(): void {
    this.chargement = true;
    this.serviceFournisseur.ListeFournisseurs().subscribe((data: any) => {
      this.fournisseurs = data;
      this.fournisseurs = this.fournisseurs.sort((a:any, b:any) => a.id_Fr > b.id_Fr ? -1 : 1);
      this.dataSource.data = data as table[];
      this.fournisseurs.paginator = this.paginator;
      this.chargement = false; 
      if(this.fournisseurs.length ==0){
        Swal.fire({
          title: 'aucun résultat trouvé',
          icon: 'warning', 
          
        })
      }
    });
  }
  // filtrer liste des fournisseurs par date
  filtrerFournisseurParDate() {
    this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');
    this.chargement = true;
    this.serviceFournisseur.filtrerFournisseur(this.filtre, this.valeurRecherche).subscribe((data: any) => {
      this.fournisseurs = data;
      this.fournisseurs = this.fournisseurs.sort((a:any, b:any) => a.id_Fr > b.id_Fr ? -1 : 1);
      this.dataSource.data = data as table[];
 
      this.fournisseurs.paginator = this.paginator;
      this.chargement = false;
      if(this.fournisseurs.length ==0){
        Swal.fire({
          title: 'aucun résultat trouvé',
          icon: 'warning', 
          
        })
      }
    });
  }
  //supprimer fournisseur par son identifiant
  supprimerFournisseur(element) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {      

      if (result.value) {
        this.serviceFournisseur.SupprimerFournisseur(element);
        this.ListerFournisseurs();
        Swal.fire(
          'Fournisseur Supprimé avec succès!',
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
      this.ListerFournisseurs();
    })

  }
  // récuperer valeur du filtre choisi
  ChoixFiltre(event: MatSelectChange) {
    this.filtre = event.value;
    this.valeurRecherche = '';
  }
  validerRechercheTimbreFiscal(event: MatSelectChange) {
    this.valeurRecherche = event.value;
    if (this.filtre != '') {
      this.chargement = true;
      this.serviceFournisseur.filtrerFournisseur(this.filtre, this.valeurRecherche).subscribe((reponse: any) => {
        this.fournisseurs = new MatTableDataSource(reponse);
        this.fournisseurs.sort = this.sort;
        this.fournisseurs.paginator = this.paginator;
      });
      this.chargement = false;
      if(this.fournisseurs.length ==0){
        Swal.fire({
          title: 'aucun résultat trouvé',
          icon: 'warning', 
          
        })
      }
    }

  }
  validerRechercheBloqueAchat(event: MatSelectChange) {
    this.valeurRecherche = event.value;
    if (this.filtre != '') {
      this.chargement = true;
      this.serviceFournisseur.filtrerFournisseur(this.filtre, this.valeurRecherche).subscribe((reponse: any) => {
        this.fournisseurs = new MatTableDataSource(reponse);
        this.fournisseurs.sort = this.sort;
        this.fournisseurs.paginator = this.paginator;
      });
      this.chargement = false;
      if(this.fournisseurs.length ==0){
        Swal.fire({
          title: 'aucun résultat trouvé',
          icon: 'warning', 
          
        })
      }
    }

  }
  //filtrer la liste du fournisseur
  filtrerFournisseur() {
    if (this.filtre == '') {
      Swal.fire({
        icon: 'error',
        text: 'Vous devez choisir un filtre de recherche!'
      }
      )
      this.ListerFournisseurs();
    }
    else if (this.valeurRecherche == '') {
      Swal.fire({
        icon: 'error',
        text: 'Vous n' + "'" + 'avez pas saisi une valeur de recherche!'
      }
      )
      this.ListerFournisseurs();
    }
    else if (this.valeurRecherche == null) {
      Swal.fire({
        icon: 'error',
        text: 'Vous n' + "'" + 'avez pas saisi une valeur de recherche!'
      }
      )
      this.ListerFournisseurs();
    }
    else {
      if (this.filtre == 'date_livraison_identite' || this.filtre == 'debut_exoneration' || this.filtre == 'fin_exoneration'
        || this.filtre == 'date_creation') {
        this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');;
      }
      this.serviceFournisseur.filtrerFournisseur(this.filtre, this.valeurRecherche).subscribe((reponse: any) => {
        this.fournisseurs = new MatTableDataSource(reponse);
        this.fournisseurs.sort = this.sort;
        this.fournisseurs.paginator = this.paginator;
        if(this.fournisseurs.length ==0){
          Swal.fire({
            title: 'aucun résultat trouvé',
            icon: 'warning', 
            
          })
        }
      });
    }
  }

  //filtre activer par keyup
  filtrerFournisseurParLettre() {
    if (this.valeurRecherche != '' && (this.filtre == '')) {
      Swal.fire({
        icon: 'error',
        text: 'Vous devez choisir un filtre de recherche!'
      }
      )
      this.ListerFournisseurs();
    }
    if (this.filtre != '' && this.valeurRecherche != '') {
      this.serviceFournisseur.filtrerFournisseur(this.filtre, this.valeurRecherche).subscribe((data: any) => {
        this.fournisseurs = data;
        this.fournisseurs = this.fournisseurs.sort((a:any, b:any) => a.id_Fr > b.id_Fr ? -1 : 1);
        this.dataSource.data = data as table[];
   
        this.fournisseurs.paginator = this.paginator;
        if(this.fournisseurs.length ==0){
          Swal.fire({
            title: 'aucun résultat trouvé',
            icon: 'warning', 
            
          })
        }

      });
    }
  }
  // generer PDF contenant details du fournisseurs    
  genererPdfFournisseur(id) {
    setTimeout(() => { 
    this.serviceFournisseur.Fournisseur(id).subscribe((reponse: any) => {
      this.detailFournisseur = reponse;
      let dd = {
        footer: function (currentPage, pageCount) {
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
        background: [{
          image: 'data:image/jpeg;base64,' + this.ModeleFournisseurSrc, width: 600
        }],
        content: [
          {
            image: 'data:image/jpeg;base64,' + this.detailFournisseur.image,
                width: 150,
                height: 170,
         
                relativePosition: {x:20, y:25}
          },
          {   text: 'Code Fournisseur   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:30}	  , },
          {   text: '' + this.detailFournisseur.id_Fr  , fontSize: 15,   color: 'black',    decoration :'underline',     bold: true,    relativePosition: {x:360, y:27}	  , },
          {   text: ': ' ,    fontSize: 12,   color: 'black',           relativePosition: {x:350, y:30}	  , },
          {   text: 'Nom du Fournisseur  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:55}	  , },
          {   text: '' + this.detailFournisseur.nom_Fournisseur , fontSize: 15,   color: 'black',    decoration :'underline',     bold: true,    relativePosition: {x:360, y:52}	  , },
          {   text: ': ' ,    fontSize: 12,   color: 'black',           relativePosition: {x:350, y:55}	  , },

           {   text: 'Categorie du Fournisseur : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:80}	  , },
          {   text: ': ' + this.detailFournisseur.categorie_Fournisseur, fontSize: 12,   color: 'black',       relativePosition: {x:350, y:80}	  , },

          {   text: 'Adresse   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:105}	  , },
          {   text: ': ' + this.detailFournisseur.adresse , fontSize: 12,   color: 'black',     relativePosition: {x:350, y:105}	  , },
       
          {   text: ' Site Web   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:130}	  , },
          {   text: ': ' + this.detailFournisseur.site_Web , fontSize: 12,   color: 'black',      relativePosition: {x:350, y:130}	  , },
        
          {   text: ' Representant   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:155}	  , },
          {   text: ': ' + this.detailFournisseur.representant , fontSize: 12,   color: 'black',      relativePosition: {x:350, y:155}	  , },
        
          {   text: ' Tel /Fax  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:180}	  , },
          {   text: ': ' +  this.detailFournisseur.tel1 + ' / ' + this.detailFournisseur.tel2 +' / '+ this.detailFournisseur.fax, fontSize: 12,   color: 'black',      relativePosition: {x:350, y:180}	  , },
        

          {   text: ' Pays :  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:220}	  , },
          {   text: '' + this.detailFournisseur.pays , fontSize: 12,   color: 'black',      relativePosition: {x:60, y:220}	  , },
        
          {   text: ' Ville :  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:220}	  , },
          {   text: '' + this.detailFournisseur.ville , fontSize: 12,   color: 'black',      relativePosition: {x:240, y:220}	  , },
        
          {   text: ' Region  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:350, y:220}	  , },
          {   text: ': ' + this.detailFournisseur.region , fontSize: 12,   color: 'black',      relativePosition: {x:390, y:220}	  , },

          {   text: ' Type de la pièce d' + "'" + ' identité : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:255}	  , },
          {   text: '' + this.detailFournisseur.type_Piece_Identite , fontSize: 12,   color: 'black',      relativePosition: {x:180, y:255}	  , },
        
          {   text: ' Numéro de la pièce d' + "'" + ' identité   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:255}	  , },
          {   text: ': ' +  this.detailFournisseur.n_Piece_Identite , fontSize: 12,   color: 'black',      relativePosition: {x:415, y:255}	  , },

          {   text: ' Categorie Fiscale : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:290}	  , },
          {   text: '' + this.detailFournisseur.categorie_Fiscale , fontSize: 12,   color: 'black',      relativePosition: {x:140, y:290}	  , },
        
          {   text: ' Identification Fiscale  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:290}	  , },
          {   text: ': ' +  this.detailFournisseur.code_Tva , fontSize: 12,   color: 'black',      relativePosition: {x:380, y:290}	  , },

          
          {   text: ' Banque 1  : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:325}	  , },
          {   text: '' +  this.detailFournisseur.banque1 , fontSize: 12,   color: 'black',      relativePosition: {x:140, y:325}	  , },
        
          {   text: ' Rib 1  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:325}	  , },
          {   text: ': ' +  this.detailFournisseur.rib1 , fontSize: 12,   color: 'black',      relativePosition: {x:380, y:325}	  , },


          {   text: ' Banque 2  : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:360}	  , },
          {   text: '' +  this.detailFournisseur.banque2 , fontSize: 12,   color: 'black',      relativePosition: {x:140, y:360}	  , },
        
          {   text: ' Rib 2  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:360}	  , },
          {   text: ': ' +  this.detailFournisseur.rib2 , fontSize: 12,   color: 'black',      relativePosition: {x:380, y:360}	  , },
 
          {   text: ' Contact  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:395}	  , },
          {   text: ' : ' +  this.detailFournisseur.contact , fontSize: 12,   color: 'black',      relativePosition: {x:100, y:395}	  , },

          {   text: ' Email  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:395}	  , },
          {   text: ' : ' +          this.detailFournisseur.email, fontSize: 12,   color: 'black',      relativePosition: {x:380, y:395}	  , },
  
          
          {   text: ' Description  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:430}	  , },
          {   text: ' : ' +  this.detailFournisseur.description , fontSize: 12,   color: 'black',      relativePosition: {x:100, y:430}	  , },

 
      
        ]
      };
      pdfMake.createPdf(dd).open();
    });
    
  }, 1000);
  }

  ngOnInit(): void {

  }
// temps d'attente 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ModeleFournisseurPdfBase64() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.ModeleFournisseurSrc = lecteur.result;
      this.ModeleFournisseurSrc = btoa(this.ModeleFournisseurSrc);
      this.ModeleFournisseurSrc = atob(this.ModeleFournisseurSrc);
      this.ModeleFournisseurSrc = this.ModeleFournisseurSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.template_fournisseur);
  }
  async ChargementModeleFournisseur() {
    this.http.get('.././assets/images/template_fournisseur.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.template_fournisseur = reponse;
      return this.template_fournisseur;

    }, err => console.error(err),
      () => console.log(this.template_fournisseur))
  }

  filtre_fr(){
    
    this.serviceFournisseur.filtre_6champs(
      "id_Fr", this.form.get('id_Fr')?.value,
     "nom_Fournisseur", this.form.get('nom_Fournisseur')?.value,
      "categorie_Fournisseur", this.form.get('categorie_Fournisseur')?.value,
      "code_Tva", this.form.get('code_Tva')?.value,
      "email", this.form.get('email')?.value,
      "email", this.form.get('email')?.value,).subscribe((data) => {
      this.dataSource.data = data as table[];
      this.fournisseurs = data;
      this.fournisseurs = this.fournisseurs.sort((a:any, b:any) => a.id_Fr > b.id_Fr ? -1 : 1);
      this.dataSource.data = data as table[];
 
      this.fournisseurs.paginator = this.paginator;
      if(this.fournisseurs.length ==0){
        Swal.fire({
          title: 'aucun résultat trouvé',
          icon: 'warning', 
          
        })
      }

    });
  }
}


export class table {
  id_Fr: string;
  nom_Fournisseur: string;
  categorie_Fournisseur: string;
  code_Tva: string;
  email: string;
  tel1: string;
}