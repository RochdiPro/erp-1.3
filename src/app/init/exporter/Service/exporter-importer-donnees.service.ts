import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { bindNodeCallback, Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
const infonet = '/ERP/';


@Injectable({
  providedIn: 'root'
})
export class ExporterImporterDonneesService {
  donnee:any;
  private handleError(error: HttpErrorResponse): any {
    if (error.error instanceof ErrorEvent) {
      console.error('An error occurred:', error.error.message);
    } else {
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    return throwError(
      'Something bad happened; please try again later.');
  }
  //ajouter fiche fournisseurs
  Importer_Fournisseurs(Fournisseurs) {
    return this.http.post(infonet + 'Importer_Fournisseurs', Fournisseurs, { observe: "response", responseType: 'text' })
  }
 //ajouter fiche clients
  Importer (data) {
      this.donnee=localStorage.getItem('donnee');
      return this.http.post(infonet + 'Importer_'+this.donnee+'', data, { observe: "response", responseType: 'text' })
  }   
 
  // enregistrer fiche fournisseurs 
  Exporter_Fournisseurs(liste) {
    return this.http.get(infonet + 'Exporter_Fournisseurs', {
      params: {
        Liste: liste
      }, responseType: 'blob'
    });
  }
  // enregistrer fiche clients
  Exporter_Clients(liste) {
    return this.http.get(infonet + 'Exporter_Clients', {
      params: {
        Liste: liste
      }, responseType: 'blob'
    });
  }
   // enregistrer fiche clients
   Exporter_Employes(liste) {
    return this.http.get(infonet + 'Exporter_Employes', {
      params: {
        Liste: liste
      }, responseType: 'blob'
    });
  }
  //enregistrer fiche produits
  Exporter_Fiche_Produits(liste) {
    return this.http.get(infonet + 'Exporter_Fiche_Produits', {
      params: {
        Liste: liste
      }, responseType: 'blob'
    });
  }
   // enregistrer fiche client
   Exporter_Fiche_Produit(id) {
    return this.http.get(infonet + 'Exporter_Fiche_Produit', {
      params: {
        Id_Produit: id
      }, responseType: 'blob'
    });
  }
  // enregistrer fiche client
  Exporter_Client(id) {
    return this.http.get(infonet + 'Exporter_Client', {
      params: {
        Id_Clt: id
      }, responseType: 'blob'
    });
  }
  
  Exporter_Employe(id) {
    return this.http.get(infonet + 'Exporter_Employe', {
      params: {
        Id: id
      }, responseType: 'blob'
    });
  }
  // enregistrer fiche fournisseur
  Exporter_Fournisseur(id) {
    return this.http.get(infonet + 'Exporter_Fournisseur', {
      params: {
        Id_Fr: id
      }, responseType: 'blob'
    });
  }
  ListeDonnees(nom_donnee): Observable<any> {
    return this.http.get(infonet + nom_donnee)
      .pipe(catchError(this.handleError)
      );
  }
  constructor(private http: HttpClient) { }
}
