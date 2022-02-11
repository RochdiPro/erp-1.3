import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/internal/operators';
const infonet = '/ERP/';

@Injectable({
  providedIn: 'root'
})
export class ProduitServiceService {
  constructor(private http: HttpClient) { }
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

  // récuperer rfid du produit
  Rfid_Produit(id) {
    return this.http.get(infonet + 'Produit_Rfid', {
      params: {
        Id_Produit: id
      }, responseType: 'blob'
    });

  }
  // récuperer certificat du produit
  Certificat_Produit(id) {
    return this.http.get(infonet + 'Produit_Certificat', {
      params: {
        Id_Produit: id
      }, responseType: 'blob'
    });
  }
  // Récuperer Image du produit
  Image_Produit(id) {
    return this.http.get(infonet + 'Produit_Image', {
      params: {
        Id_Produit: id
      }, responseType: 'blob'
    });
  }

  // Catégorie Ngp
  Categorie_Ngp(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ngp', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );

  }
  // Ajout Contrainte
  ajouterContrainte(contrainte) {
    return this.http.post(infonet + 'Creer_Contrainte', contrainte, { observe: 'body' })
  }
  // Supprimer Contrainte
  SupprimerContrainte(formData) {

    return this.http.delete(infonet + 'Supprimer_Contrainte/', {
      params: {
        Id_Contrainte: formData
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
  }

  // Récuperer Fodec
  Categorie_Fodec(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Fodec', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer tva
  Categorie_Tva(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Tva', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer l'unité
  Categorie_Unite(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Unite', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer le type 4 selon type3
  Categorie_Type4(type3): Observable<any> {
    return this.http.get(infonet + 'Categorie_Sous_Famille', {
      params: {
        Type: type3
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer le type3 selon type2
  Categorie_Type3(type2): Observable<any> {
    return this.http.get(infonet + 'Categorie_Famille', {
      params: {
        Type: type2
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer le type2 selon type1
  Categorie_Type2(type1): Observable<any> {
    return this.http.get(infonet + 'Categorie_Type2', {
      params: {
        Type: type1
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // Récuperer la categorie type1
  Categorie_Type1(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Type1', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher contrainte selon son identifient
  Contrainte(id): Observable<any> {
    return this.http.get(infonet + 'Contrainte/', {
      params: {
        Id_Contrainte: id
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // Obtenir la liste des Contraintes 
  obtenirListeContraintes(): Observable<any> {
    return this.http.get(infonet + 'Contraintes', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  // Obtenir la liste des champs du fiche produit
  obtenirListeChampsProduit(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Fiche_Produit', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  //Filtrer liste du produit
  FiltrerProduit(champ: any, valeur: any): Observable<any> {
    return this.http.get(infonet + 'Filtre_Fiche_Produit/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur))
  }
  // afficher la région  du produit
  ListerRegion(ville): Observable<any> {
    return this.http.get(infonet + 'Categorie_Region', {
      params: {
        Ville: ville
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher la ville  du produit
  ListerVille(pays): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ville', {
      params: {
        Pays: pays
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // afficher le pays  du produit
  ListerPays(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Pays', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
  //afficher la liste des produits
  ListeProduits(): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produits')
      .pipe(catchError(this.gererErreur)
      );
  }
  //afficher le produit selon son identifient
  Produit(id): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produit/', {
      params: {
        Id_Produit: id
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // ajout d'un Produit
  ajouterProduit(produit) {
    return this.http.post(infonet + 'Creer_Fiche_Produit', produit, { observe: 'body' })
  }
  // suppression d'un Produit par identifiant 
  SupprimerProduit(formData) {

    return this.http.delete(infonet + 'Supprimer_Fiche_Produit/', {
      params: {
        Id_Produit: formData
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
  }
  // modification d'un produit par id
  ModifierProduit(produit: any): Observable<any> {
    return this.http.post(infonet + 'Modifier_Fiche_Produit', produit).pipe(
      catchError(this.gererErreur)
    );
  }
  // modification d'une  Contrainte par id
  ModifierContrainte(contrainte: any): Observable<any> {
    return this.http.put(infonet + 'Modifier_Contrainte', contrainte).pipe(
      catchError(this.gererErreur)
    );
  }

  filtre_4_champs (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any ,champ4 : any, valeur4 : any)
  {
    return this.http.get(infonet + 'Filtre_Produit_4_Champs', {
      params: {
        Champ1: champ1,
        Valeur1: valeur1,
        Champ2: champ2,
        Valeur2: valeur2,
        Champ3: champ3,
        Valeur3: valeur3,
        Champ4: champ4,
        Valeur4: valeur4,
      
        
      }, observe: 'body'
    }).pipe()
  }
}
