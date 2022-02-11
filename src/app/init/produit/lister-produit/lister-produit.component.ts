 
import { ProduitServiceService } from '../Service/produit-service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
pdfMake.vfs = pdfFonts.pdfMake.vfs;
 
 import { MatTableFilter } from 'mat-table-filter';
  import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component,   ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
 
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import Swal from 'sweetalert2';
import {MatSelectChange} from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';

export class table {
  id_Produit: string;
  nom_Produit: string;
  marque: string;
  tva: string;
}
@Component({
  selector: 'app-lister-produit',
  templateUrl: './lister-produit.component.html',
  styleUrls: ['./lister-produit.component.scss']
})
export class ListerProduitComponent {
  produits: any;
  displayedColumns: string[] = ['editer', 'Image', 'id_Produit', 'nom_Produit', 'marque', 'tva',     'supprimer'];
  @ViewChild(MatSort, { static: false }) sort: MatSort ;
   @ViewChild(MatPaginator) paginator: MatPaginator;


 //@ViewChild(MatPaginator) paginator: any = MatPaginator;
//  @ViewChild(MatSort) sort: any = MatSort;
  detailProduit: any;
  valeurRecherche: string = '';
  filtre = '';
  categorie_unite: any;
  categorie_tva: any;
  categorie_fodec: any;
  categorie_ngp: any;
  liste_Filtres: any = [];
  base64Image: any;
  modele_produit: any;
  modeleSrc: any;
  typeFiltre: MatTableFilter;
  EntiterFiltre: any;
  chargementEnCours: any;
  sortDirection: 'desc'  ;
  dataSource = new MatTableDataSource<table>();

 
  form = new FormGroup({ 
    id_Produit: new FormControl(""),
    nom_Produit: new FormControl(""),
    marque: new FormControl(""), 
    tva: new FormControl("") ,
     
  });
  constructor(private datePipe: DatePipe, private _snackBar: MatSnackBar, private http: HttpClient, private serviceProduit: ProduitServiceService) {
    this.ouvrirMessageChargement();
    this.chargementModeleProduit();
    
    this.ListerProduits();
    this.ListeChamps();
    this.CategorieFodec();
    this.CategorieNgp();
    this.CategorieTva();
    this.CategorieUnite();
    this.modelePdfBase64();

  }

  filtre_prod()
  {
    this.serviceProduit.filtre_4_champs(  
      "id_Produit", this.form.get('id_Produit')?.value,
    "nom_Produit", this.form.get('nom_Produit')?.value,
     "marque", this.form.get('marque')?.value,
     "tva", this.form.get('tva')?.value,
   ).subscribe((data) => {
     this.dataSource.data = data as table[];
     this.produits = data;
     this.produits = this.produits.sort((a:any, b:any) => a.id_Local > b.id_Local ? -1 : 1);
     this.dataSource.data = data as table[];

     this.produits.paginator = this.paginator;
   })
  }
  // message lors de chargement de la page
  ouvrirMessageChargement() {
    this._snackBar.open('Chargement!!', '', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // liste des unités
  CategorieUnite() {
    this.serviceProduit.Categorie_Unite().subscribe((reponse: Response) => {
      this.categorie_unite = reponse;
    });
  }
  // liste tva
  CategorieTva() {
    this.serviceProduit.Categorie_Tva().subscribe((reponse: Response) => {
      this.categorie_tva = reponse;
    });
  }
  // liste des ngp
  CategorieNgp() {
    this.serviceProduit.Categorie_Ngp().subscribe((reponse: Response) => {
      this.categorie_ngp = reponse;
    });
  }
  // liste fodec
  CategorieFodec() {
    this.serviceProduit.Categorie_Fodec().subscribe((reponse: Response) => {

      this.categorie_fodec = reponse;
    });
  }
  ngOnInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }
  // récuperer la liste des champs du produit
  ListeChamps() {
    this.serviceProduit.obtenirListeChampsProduit().subscribe((reponse: Response) => {
      this.liste_Filtres = reponse;
    });
  }
  // récuperer la liste des produits
  ListerProduits(): void {
    this.chargementEnCours = true;
    this.serviceProduit.ListeProduits().subscribe(data => {
       this.produits = data;
      this.produits = this.produits.sort((a:any, b:any) => a.id_Produit > b.id_Produit ? -1 : 1);
      this.dataSource.data = data as table[];
      this.produits.paginator = this.paginator; 
      this.chargementEnCours = false;
    },
    );
   
  }
  filtrerProduitParDate() {
    this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');
    this.chargementEnCours = true;
    this.serviceProduit.FiltrerProduit(this.filtre, this.valeurRecherche).subscribe((data: any) => {
      this.produits = data;
      this.produits = this.produits.sort((a:any, b:any) => a.id_Produit > b.id_Produit ? -1 : 1);
      this.dataSource.data = data as table[];
      this.produits.paginator = this.paginator; 
      this.chargementEnCours = false;
    });
  }
  // supprimer Produit par son identifiant
  supprimerProduit(element) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.serviceProduit.SupprimerProduit(element);
        this.ListerProduits();
        Swal.fire(
          'Produit Supprimé avec succès!',
          '',
          'success'
        )
        this.ListerProduits();
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })
  }
  // recuperer valeur du filtre choisi
  ChoixFiltre(event: MatSelectChange) {

    this.filtre = event.value;
    this.valeurRecherche = '';

  }
  // recherche par valeur booleene
  validerRechercheBooleen(event: MatSelectChange) {
    this.valeurRecherche = event.value;
    if (this.filtre != '') {
      if (this.valeurRecherche == 'date_validite' || this.valeurRecherche == 'date_fabrication') {
        this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');
      }
      this.chargementEnCours = true;
      this.serviceProduit.FiltrerProduit(this.filtre, this.valeurRecherche).subscribe((data: any) => {
        this.produits = data;
        this.produits = this.produits.sort((a:any, b:any) => a.id_Produit > b.id_Produit ? -1 : 1);
        this.dataSource.data = data as table[];
        this.produits.paginator = this.paginator; 
        this.chargementEnCours = false;
      });
    }
  }
  // filtrer la liste du Produit
  filtrerProduit() {
    if (this.filtre == '') {
      Swal.fire({
        icon: 'error',
        text: 'Vous devez choisir un filtre de recherche!'
      }
      )
      this.ListerProduits();
    }
    else if (this.valeurRecherche == '' || this.valeurRecherche == null) {
      Swal.fire({
        icon: 'error',
        text: 'Vous n' + "'" + 'avez pas saisi une valeur de recherche!'
      }
      )
      this.ListerProduits();
    }
    else {

      if (this.valeurRecherche == 'date_validite' || this.valeurRecherche == 'date_fabrication'|| this.valeurRecherche=='date_creation') {
        this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');
      }
      this.chargementEnCours = true;
      this.serviceProduit.FiltrerProduit(this.filtre, this.valeurRecherche).subscribe((data: any) => {
        this.produits = data;
        this.produits = this.produits.sort((a:any, b:any) => a.id_Produit > b.id_Produit ? -1 : 1);
        this.dataSource.data = data as table[];
        this.produits.paginator = this.paginator; 
        this.chargementEnCours = false;
      });
    }
  }
  // filtre activer lettre par lettre
  filtrerProduitParLettre() {
    if (this.valeurRecherche != '' && (this.filtre == '')) {
      Swal.fire({
        icon: 'error',
        text: 'Vous devez choisir un filtre de recherche!'
      }
      )
      this.ListerProduits();
    }
    if (this.filtre != '' && this.valeurRecherche != '') {
      this.chargementEnCours = true;
      this.serviceProduit.FiltrerProduit(this.filtre, this.valeurRecherche).subscribe((data: any) => {
        this.produits = data;
        this.produits = this.produits.sort((a:any, b:any) => a.id_Produit > b.id_Produit ? -1 : 1);
        this.dataSource.data = data as table[];
        this.produits.paginator = this.paginator; 
        this.chargementEnCours = false;
      });
    }
  }
  // generer un pdf à partir de la liste 
  genererPdfProduit(id) {
    var tva_pdf, marque_pdf, unite_pdf, valeur_Unite_pdf, type1_pdf, type2_pdf, famille_pdf, sous_famille_pdf, caracteristique_Technique_pdf, code_barre_pdf, fodec_pdf, source_pdf, pays_pdf, ville_pdf, region_pdf, couleur_pdf, taille_pdf, role_pdf;

    this.serviceProduit.Produit(id).subscribe((resp: any) => {
      this.detailProduit = resp;
      if (this.detailProduit.role === 'n') {
        role_pdf = " -"
      } else role_pdf = this.detailProduit.role;
      if (this.detailProduit.taille === 'n') {
        taille_pdf = " -"
      } else taille_pdf = this.detailProduit.taille;
      if (this.detailProduit.couleur === 'n') {
        couleur_pdf = '-'
      } else couleur_pdf = this.detailProduit.couleur;
      if (this.detailProduit.pays === 'n') {
        pays_pdf = "-"
      } else pays_pdf = this.detailProduit.pays;
      if (this.detailProduit.ville === 'n') {
        ville_pdf = " -"
      } else ville_pdf = this.detailProduit.ville;
      if (this.detailProduit.region === 'n') {
        region_pdf = " -"
      } else region_pdf = this.detailProduit.region;
      if (this.detailProduit.source === 'n') {
        source_pdf = " -"
      } else source_pdf = this.detailProduit.source;
      if (this.detailProduit.fodec === 'n') {
        fodec_pdf = " -"
      } else fodec_pdf = this.detailProduit.fodec;
      if (this.detailProduit.code_Barre === 'n') {
        code_barre_pdf = " -"
      } else code_barre_pdf = this.detailProduit.code_Barre;

      if (this.detailProduit.tva === 0) {
        tva_pdf = " -"
      } else tva_pdf = this.detailProduit.tva;
      if (this.detailProduit.marque === 'n') {
        marque_pdf = " -"
      } else marque_pdf = this.detailProduit.marque;
      if (this.detailProduit.unite === 'n') {
        unite_pdf = " -"
      } else unite_pdf = this.detailProduit.unite;
      if (this.detailProduit.valeur_Unite === -1) {
        valeur_Unite_pdf = " -"
      } else valeur_Unite_pdf = this.detailProduit.valeur_Unite;
      if (this.detailProduit.type1 === 'n') {
        type1_pdf = " -"
      } else type1_pdf = this.detailProduit.type1;
      if (this.detailProduit.type2 === 'n') {
        type2_pdf = " -"
      } else type2_pdf = this.detailProduit.type2;
      if (this.detailProduit.famille === 'n') {
        famille_pdf = " -"
      } else famille_pdf = this.detailProduit.famille;
      if (this.detailProduit.sous_Famille === 'n') {
        sous_famille_pdf = " -"
      } else sous_famille_pdf = this.detailProduit.sous_Famille;
      if (this.detailProduit.caracteristique_Technique === 'n') {
        caracteristique_Technique_pdf = " -"
      } else caracteristique_Technique_pdf = this.detailProduit.caracteristique_Technique;
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
        pageMargins: [40, 120, 40, 60],
        background: [
          {
            image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600
          }
        ],
        content: [
          {
            columns: [
              {
                image: 'data:image/jpeg;base64,' + this.detailProduit.image,
                width: 150,
                height: 170
              },
              {
                width: '80%',
                text: 'Code : ' + this.detailProduit.id_Produit + '\n\n' + 'Désignation du produit : ' + this.detailProduit.nom_Produit + '\n\n' +
                  'Marque : ' + marque_pdf + '\n\n' + 'Tva : ' +
                  tva_pdf + '\n\n' + 'Unité : ' + unite_pdf + '\t' + 'Valeur par unité : ' + valeur_Unite_pdf + '\n\n' + 'Code à barre : ' + code_barre_pdf
              },
            ], columnGap: 40,
          },
          {
            columns: [
              {
                width: '50%',
                text: '\n' + 'Type du produit : ' + type1_pdf +
                  '\n\n' + 'Famille du produit : ' + famille_pdf + '\n\n' + 'Role du produit : ' + role_pdf
                  + '\n\n' + 'Pays du produit : ' + pays_pdf + '\n\n' + 'Region du produit : ' + region_pdf
                  + '\n\n' + 'Couleur du produit : ' + couleur_pdf
              },
              {
                width: '50%',
                text: '\n' + 'Sous-Type du produit : ' + type2_pdf + '\n\n' + 'Sous-Famille du produit : ' + sous_famille_pdf + '\n\n' + 'Fodec du produit : ' + fodec_pdf
                  + '\n\n' + 'Source du produit : ' + source_pdf + '\n\n' + 'Ville du produit : ' + ville_pdf + '\n\n' + 'Taille du produit : ' + taille_pdf
              },

            ], columnGap: 20,
          },
          {
            text: '\n' + 'Fiche technique : ' + caracteristique_Technique_pdf
          }
        ]

      };
      pdfMake.createPdf(dd).open();
    });
  }
  // temps d'attente avant conversion d'image
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // définir modele pour pdf 
  async modelePdfBase64() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele_produit);
  }
  //chargement de modele de pdf
  async chargementModeleProduit() {
    this.http.get('.././assets/images/template_produit.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele_produit = reponse;
      return this.modele_produit;
    }, err => console.error(err),
      () => console.log(this.modele_produit))
  }
}
