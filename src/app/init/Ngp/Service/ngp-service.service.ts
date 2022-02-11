import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';
@Injectable({
  providedIn: 'root'
})

@Injectable({
  providedIn: 'root'
})
export class NgpServiceService {
  constructor(private http: HttpClient) { }
  //Récupérer taxe ngp  par Id
 

  liste_taxe_ngp(id: any): Observable<any> {
    return this.http.get(infonet + 'Liste_Taxe_Ngp/',  {
      params: {
        NGP: id
      },  observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

  liste_taxe_ngps( ): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ngp/',  {
        observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

   
  //Ajouter ngp
  ajouterngp(data: any)   {
        this.http.post(infonet + 'Creer_Categorie_Ngp', data).subscribe(
          (response) => console.log(response),
          (error) => console.log(error))
  }
  //supprimer ngp
  supprimerngp(data: any)   {
    this.http.delete(infonet + 'Supprimer_Categorie_Ngp', {
      params: {
        Categorie: data
      }, observe: 'response'
    }).toPromise()
      .then(response => {
        console.log(response);
      })
      .catch(console.log);
  }
  //Ajouter taxe en ngp
  ajouterngp_taxe(data: any)   {
    this.http.post(infonet + 'Creer_Liste_Taxe_Ngp', data).subscribe(
      (response) => console.log(response),
      (error) => console.log(error))
  }
  
  //Supprimer taxe du ngp
  Supprimerngp_taxe(ngp: any , taxe :any) {
    return this.http.delete<any>(infonet + 'Supprimer_Liste_Taxe_Ngp/', {
      params: {
        NGP: ngp,
        Taxe: taxe,
      }, observe: 'response'
    }).toPromise()
      .then(response => {
      })
      .catch(console.log)
  }
  //Obtenir la categorie du ngp 
  obtenirngp(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Ngp', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }

   //Obtenir la categorie du taxe 
   obtenirtaxe(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Taxe', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  
  
  //Afficher message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
}
