import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';

@Injectable({
  providedIn: 'root'
})
export class CongeServiceService {

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

  // récupérer image du Client
  Image_Employe(id) {
    return this.http.get(infonet + 'Image_Employe', {
      params: {
        Id_Clt: id
      }, responseType: 'blob'
    });
  }
  // Obtenir la liste des champs du fiche Employes
  obtenirListeChampsClient(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Conge', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }

  // Filtrer liste du Employes
  filtrerEmployes(champ: any, valeur: any): Observable<any> {

    return this.http.get(infonet + 'Filtre_Client/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur))

  }
 
  Listetype(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Conge', { observe: 'body' }).pipe(catchError(this.gererErreur)
    );
  }
 
  // récupérer la liste des Employes
  ListerConge(): Observable<any> {
    return this.http.get(infonet + 'Conges')
      .pipe(catchError(this.gererErreur)
      );
  }
  //  récupérer le Client selon son identifient
  Employe(id): Observable<any> {   
    return this.http.get(infonet + 'Conge', {
      params: {
        Id: id
      }, observe: 'body'
    }).pipe(catchError(this.gererErreur)
    );
  }
  // ajouter un Client 
  ajouterConge(conge) {

    return this.http.post(infonet + 'Creer_Conge', conge, { observe: "response" })
  }

  // suppression d'un employé par identifiant 
  SupprimerConge(formData) {

    return this.http.delete(infonet + 'Supprimer_Conge/', {
      params: {
        Id: formData
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
  }

  // modification d'un employé par id
  ModifierEmployes(data: any): Observable<any> {  
       
    return this.http.post(infonet + 'Modifier_Conge', data).pipe(
      catchError(this.gererErreur)
    );
  }


  Changer_Etat (formData): Observable<any>  
  {

    return this.http.post(infonet + 'Changer_Etat_Conge', formData
      
    ).pipe(catchError(this.gererErreur))
     
  } 

  


}

