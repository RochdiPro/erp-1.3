import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

const infonet = '/ERP/';

@Injectable({
  providedIn: 'root'
})
export class FournisseurServiceService {
  private gererErreur(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('Une erreur s' + "'" + 'est produite:', error.error.message);
    } else {
      console.error(
        `Code renvoyé par le backend ${error.status}, ` +
        `le contenu était: ${error.error}`);
    }
    return throwError(
      'Veuillez réessayer plus tard.');
  }

  filtre_6champs (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any ,champ4 : any, valeur4 : any, champ5 : any, valeur5 : any, champ6 : any, valeur6 : any)
  {
    return this.http.get(infonet + 'Filtre_Forunisseur_6_Champs', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
        Champ5: champ5,
        Valeur5: valeur5,
        Champ6: champ6,
        Valeur6: valeur6,
        
      }, observe: 'body'
    }).pipe()

  }
  //recuperer image du Fournisseur
  Image_Fournisseur(id) {
    return this.http.get(infonet + 'Fournisseur_Image', {
      params: {
        Id_Fr: id
      }, responseType: 'blob'
    });
  }
  // Obtenir la liste des champs du fiche fournisseur 
  obtenirListeChampsFournisseur(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Fournisseur', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

  // Filtrer liste du fournisseur
  filtrerFournisseur(champ: any, valeur: any): Observable<any> {

    return this.http.get(infonet + 'Filtre_Fournisseur/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur))

  }
  // afficher la region  du fournisseur 
  ListerRegion(ville): Observable<any> {
    return this.http.get(infonet + 'Categorie_Region', {
      params: {
        Ville: ville
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la ville  du fournisseur 
  ListerVille(pays): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ville', {
      params: {
        Pays: pays
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher le pays  du fournisseur 
  ListerPays(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Pays', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la categorie du fournisseur 
  ListerBanques(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Banque', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la categorie du fournisseur 
  ListerCategorieFournisseur(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Fournisseur', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la categorie fiscale du fournisseur 
  ListerCategorieFiscale(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Fiscale', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la categorie de piece d'identitédu fournisseur 
  ListerCategoriePiece(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Piece', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la liste des fournisseurs
  ListeFournisseurs(): Observable<any> {
    return this.http.get(infonet + 'Fournisseurs')
      .pipe(catchError(this.gererErreur)
      );
  }
  // afficher le fournisseur selon son identifient
  Fournisseur(id): Observable<any> {
    return this.http.get(infonet + 'Fournisseur/', {
      params: {
        Id_Fr: id
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // ajout d'un fournisseur 
  ajouterFournisseur(fournisseur) {

    return this.http.post(infonet + 'Creer_Fournisseur', fournisseur, { observe: "response"})
  }

  // suppression d'un fournisseur par identifiant 
  SupprimerFournisseur(formData) {

    return this.http.delete(infonet + 'Supprimer_Fournisseur/', {
      params: {
        Id_Fr: formData
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
  }

  // modification d'un fournisseur par id
  ModifierFournisseur(fournisseur: any): Observable<any> {
    return this.http.post(infonet + 'Modifier_Fournisseur', fournisseur).pipe(
      catchError(this.gererErreur)
    );
  }

  constructor(private http: HttpClient) { }
}
