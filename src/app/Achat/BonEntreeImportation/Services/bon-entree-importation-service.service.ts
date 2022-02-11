import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

const infonet = '/ERP/';

 
 
@Injectable({
  providedIn: 'root'
})
export class BonEntreeImportationServiceService {
  constructor(private http: HttpClient) { }
  
  // telecharger doc banque 
  downloadFile_doc_banque(id :any): any {
		return this.http.get(infonet + 'Document_Banque_Fiche_Bon_Entree_Importation', {
      params: {
        Id_Bon: id
      }, responseType: 'blob'}).subscribe(
          (response) => {
            var mediaType = 'application/pdf';
            var blob = new Blob([response], {type: mediaType});
            var filename = 'doc-banque-'+id+'.pdf';
            saveAs(blob, filename);
          });
  }

 // telecharger doc transport 
  downloadFile_doc_transport(id :any): any {
		return this.http.get(infonet + 'Document_Transport_Fiche_Bon_Entree_Importation', {
      params: {
        Id_Bon: id
      }, responseType: 'blob'}).subscribe(
          (response) => {
            var mediaType = 'application/pdf';
            var blob = new Blob([response], {type: mediaType});
            var filename = 'doc-transport-'+id+'.pdf';
            saveAs(blob, filename);
          });
  }

 // telecharger doc transaitaire 
  downloadFile_doc_transaitaire(id :any): any {
		return this.http.get(infonet + 'Document_Transitaire_Fiche_Bon_Entree_Importation', {
      params: {
        Id_Bon: id
      }, responseType: 'blob'}).subscribe(
          (response) => {
            var mediaType = 'application/pdf';
            var blob = new Blob([response], {type: mediaType});
            var filename = 'doc-transaitaire-'+id+'.pdf';
            saveAs(blob, filename);
          });
  }

 // telecharger doc importation 
  downloadFile_doc_importation(id :any): any {
		return this.http.get(infonet + 'Document_Importation_Fiche_Bon_Entree_Importation', {
      params: {
        Id_Bon: id
      }, responseType: 'blob'}).subscribe(
          (response) => {
            var mediaType = 'application/pdf';
            var blob = new Blob([response], {type: mediaType});
            var filename = 'doc-importation-'+id+'.pdf';
            saveAs(blob, filename);
          });
  }

  


  // récupérer image du Client
  doc_banque(id) {
    return this.http.get(infonet + 'Document_Banque_Fiche_Bon_Entree_Importation', {
      params: {
        Id_Bon: id
      }, responseType: 'blob'
    });
  }


  //Obtenir la categorie du local 
  obtenirCategorieDepot(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Depot', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Lister tous locaux
  Locals(): Observable<any> {
    return this.http.get(infonet + 'Locals').pipe(
      catchError(this.handleError())
    );
  }
  Listengp(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ngp').pipe(
      catchError(this.handleError())
    );
  }

   //Lister tous les agence de transport
   Agencetransport(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Agence_Transport').pipe(
      catchError(this.handleError())
    );
  }

   //Lister tous les agence des transitaire
   Agencetransitaire(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Agence_Transitaire').pipe(
      catchError(this.handleError())
    );
  }
  
  //Lister les taxes pour un ngp 
  listetaxe (data: any ) :Observable<any> {     
    return this.http.get(infonet + 'Liste_Taxe_Ngp/'
    , {
      params: {
        NGP: data
      }, observe: 'body'
    }).pipe(catchError(this.handleError()))
  }

   //recuperer les valeurs des taxes pour le calcule  
   Valeur_des_Taxe ( ) :Observable<any> {     
    return this.http.get(infonet + 'Categorie_Taxe/', { observe: 'body' }).pipe(catchError(this.handleError()))
  }

  //Lister tous fournisseurs
  Fournisseurs(): Observable<any> {
    return this.http.get(infonet + 'Fournisseurs').pipe(
      catchError(this.handleError())
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
  //Récupérer fouenisseur par Id
  Fournisseur(id: any): Observable<any> {
    return this.http.get(infonet + 'Fournisseur/'
      , {
        params: {
          Id_Fr: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))

  }
  //Lister tous bons d'entrée  
  BonEntrees(): Observable<any> {
    return this.http.get(infonet + 'Fiche_Bon_Entree_Importations').pipe(
      catchError(this.handleError())
    );
  }
  //Récupérer bon d'entrée   par Id
  BonEntree(id: any): Observable<any> {
    return this.http.get(infonet + 'Fiche_Bon_Entree_Importation/'
      , {
        params: {
          Id_Bon: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))
  }
  //Ajouter bon d'entrée  
  ajouterBonEntree(bon :any ) {
    this.http.post(infonet + 'Creer_Fiche_Bon_Entree_Importation', bon   ).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Modifier bon d'entrée  
  modifierBonEntree(bon: any) {
    this.http.post(infonet + 'Modifier_Fiche_Bon_Entree_Importation', bon).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Supprimer bon d'entrée  
  supprimerBonEntree(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Fiche_Bon_Entree_Importation/', {
      params: {
        Id_Bon: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log()
      })
      .catch(console.log)
  }
  //recuperer détails fiche bon d'entrée  
  DetailBonEntreeLocal(id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Fiche_Bon_Entree_Importation/'
      , {
        params: {
          Id_Bon: id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError()))

  }
  //Obtenir une categorie  paiement
  obtenirCategoriePaiement(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Type_Paiement', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Obtenir la liste des champs du fiche bon entree 
  obtenirListeChampsBonEntree(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Fiche_Bon_Entree_Importation', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Filtrer bon d'entrée   par champ  
  filtrerBonEntree (champ: any, valeur: any): Observable<any> {
    return this.http.get(infonet + 'Filtre_Fiche_Bon_Entree_Importation/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError()))

  }
  //Récupérer détails produit
  Detail_Produit(Id: any): Observable<any> {

    return this.http.get(infonet + 'Detail_Produit/'
      , {
        params: {
          Id: Id
        }, responseType: 'blob'
      }).pipe(catchError(this.handleError()))
  }
  //Tester si produit en stock ou non
  ProduitEnStock(Id: any): Observable<any> {
    return this.http.get(infonet + 'Produit_en_Stock/'
      , {
        params: {
          Id: Id
        }, responseType: 'text'
      }).pipe(catchError(this.handleError()))
  }
  //Récupérer référence fournisseur par article 
  Ref_FR_Article(Id: any): Observable<any> {
    return this.http.get(infonet + 'Ref_Produit/'
      , {
        params: {
          Id: Id
        }, responseType: 'text'
      }).pipe(catchError(this.handleError()))
  }

  ngp(Id: any): Observable<any> {
    return this.http.get(infonet + 'Ngp_Produit/'
      , {
        params: {
          Id: Id
        }, responseType: 'text'
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
}
