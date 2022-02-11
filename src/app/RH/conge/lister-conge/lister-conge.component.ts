 
import { animate, state, style, transition, trigger } from '@angular/animations';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'; 
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableFilter } from 'mat-table-filter';
import { DatePipe } from '@angular/common';
import { CongeServiceService } from '../conge-service.service';
 @Component({
  selector: 'app-lister-conge',
  templateUrl: './lister-conge.component.html',
  styleUrls: ['./lister-conge.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),

  ], 
})
export class ListerCongeComponent   {

 
  typeFiltre: MatTableFilter;
  entiterFiltre: any;
  Employes: MatTableDataSource<any>;
  colonnesTableauEmploye: string[] = ['editer', 'employe', 'etat', 'type','nb_jour', 'raison','visualiser', 'Supprimer' ];
  
  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  contenu_developper: any | null;
  detailClient: any;
  recherche: any;
  valeurRecherche: string = '';
  filtre = '';
  liste_Filtres: any = [];
  base64Image: any;
  modele_Client: any;
  modeleClientSrc: any;
  chargementEnCours: any;

  constructor(private datePipe: DatePipe, private _snackBar: MatSnackBar, private http: HttpClient, private serviceClient: CongeServiceService, private router: Router) {
    this.ouvrirMessageChargement();
 
    this.ListerEmployes();
     
    this.typeFiltre = MatTableFilter.ANYWHERE;
    this.Employes = new MatTableDataSource();
    this.FiltresClient();

  }
  // message indiquant chargement de page
  ouvrirMessageChargement() {
    this._snackBar.open('Chargement!!', '', {
      duration: 500,
      horizontalPosition: 'center',
      verticalPosition: 'top',
    });
  }
  // liste des champs de Employes
  FiltresClient() {
    //recuperer la liste des champs du Employes
    this.serviceClient.obtenirListeChampsClient().subscribe((reponse: Response) => {
      this.liste_Filtres = reponse;
    });
  }
 // récuperer valeur du filtre choisi
 ChoixFiltre(event: MatSelectChange) {
  this.filtre = event.value;
  this.valeurRecherche = '';
}

  // récuperer la liste des Employes
  ListerEmployes(): void {
    this.chargementEnCours = true;
    this.serviceClient.ListerConge().subscribe(list => {
      this.Employes = new MatTableDataSource(list);
      this.Employes.sort = this.sort;
      this.Employes.paginator = this.paginator;
      this.chargementEnCours = false;
    });

  }
  // filter liste clients par date
  filtrerClientParDate() {
    this.valeurRecherche = this.datePipe.transform(this.valeurRecherche, 'yyyy-MM-dd');
    this.chargementEnCours = true;
    this.serviceClient.filtrerEmployes(this.filtre, this.valeurRecherche).subscribe((reponse: any) => {
      this.Employes = new MatTableDataSource(reponse);
      this.Employes.sort = this.sort;
      this.Employes.paginator = this.paginator;
      this.chargementEnCours = false;
    });
  }
  //supprimer Client par son identifiant
  supprimerconge(element) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.serviceClient.SupprimerConge(element);
       this.ListerEmployes();
        Swal.fire(
          'Congé Supprimé avec succès!',
          '',
          'success'
        )
        this.ListerEmployes();
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