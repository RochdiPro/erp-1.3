import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
//import { BEI } from '../model/bei';
const infonet = '/ERP/';



@Injectable({
  providedIn: 'root'
})


export class BonCommandeService {

  constructor(private http: HttpClient) { }

  //Lister tous fournisseurs
  Fournisseurs(): Observable<any> {
    return this.http.get(infonet + 'Fournisseurs').pipe(
      catchError(this.handleError())
    );
  }
  //Obtenir une categorie  paiement
  obtenirCategoriePaiement(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Type_Paiement', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Lister tous produits
  Produits(): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produits').pipe(
      catchError(this.handleError())
    );
  }

  //Récupérer produit par Id
  Produit(id: any): Observable<any> {
    return this.http.get(infonet + 'Fiche_Produit/'
      , {
        params: {
          Id_Produit: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))

  }

  //Récupérer Fournisseur par Id
  Fournisseur(id: any): Observable<any> {
    return this.http.get(infonet + 'Fournisseur/'
      , {
        params: {
          Id_Fr: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))

  }
  //Récupérer référence fournisseur par article 
  Ref_FR_Article(Id: any): Observable<any> {
    return this.http.get(infonet + 'Stock/'
      , {
        params: {
          Id: Id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))
  }


  //Message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {

      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      console.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  //Ajouter ajouter Bon Commande
  ajouterBonCommande(obj: any): Observable<Object> {
    return this.http.post(infonet + "/Creer_Bon_Commande", obj);
  }

  //Lister tous bons de Bon Commande
  BonCommandes(): Observable<any> {
    return this.http.get(infonet + 'Bon_Commandes').pipe(
      catchError(this.handleError())
    );
  }


  //Modifier Bon Commande
  modifierBonCommande(bonEntreeLocal: any): Observable<Object> {
    return this.http.post(infonet + 'Modifier_Bon_Commande', bonEntreeLocal);
  }
  //Supprimer Bon Commande
  supprimerBonCommande(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Bon_Commandes/', {
      params: {
        Id_Bon: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }

  // filtre 6 champs 
  filtre(champ1: any, valeur1: any, champ2: any, valeur2: any, champ3: any, valeur3: any, champ4: any, valeur4: any, champ5: any, valeur5: any ,champ6: any, valeur6: any) {
    return this.http.get(infonet + 'Filtre_Bon_Commande_6_Champs', {
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
    }).pipe(catchError(this.handleError()));
  }

  //Récupérer bon d'Commande
  Bon_Commande(id: any): Observable<any> {
    return this.http.get(infonet + 'Bon_Commande/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))
  }

}
