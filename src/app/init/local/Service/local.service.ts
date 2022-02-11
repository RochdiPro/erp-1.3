import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
const infonet = '/ERP/';
@Injectable({
  providedIn: 'root'
})
export class LocalService {

  constructor(private http: HttpClient) { }
  //Récupérer local par Id
  Local(id: any): Observable<any> {
    return this.http.get(infonet + 'Local/'
      , {
        params: {
          Id_Local: id
        }, observe: 'body'
      }).pipe(catchError(this.handleError()))
  }
  //Lister tous locaux
  Locals(): Observable<any> {
    return this.http.get(infonet + 'Locals').pipe(
      catchError(this.handleError())
    );
  }
  //Ajouter local
  ajouterLocal(local: any) {
    this.http.post(infonet + 'Creer_Local', local).subscribe(
      (response) => console.log(),
      (error) => console.log(error))
  }
  //Modifier local 
  modifierLocal(local: any): Observable<any> {
    return this.http.put(infonet + 'Modifier_Local', local).pipe(
      catchError(this.handleError())
    );
  }
  //Supprimer local
  supprimerLocal(id: any) {
    return this.http.delete<any>(infonet + 'Supprimer_Local/', {
      params: {
        Id_Local: id
      }, observe: 'response'
    }).toPromise()
      .then(response => {
      })
      .catch(console.log)
  }
  //Obtenir la categorie du local 
  obtenirCategorieLocal(): Observable<any> {
    return this.http.get(infonet + 'Categorie_Local', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Obtenir la liste des champs du fiche local 
  obtenirListeChampsLocal(): Observable<any> {
    return this.http.get(infonet + 'Liste_Champs_Local', { observe: 'body' }).pipe(catchError(this.handleError())
    );
  }
  //Filtrer local par champ du type string 
  filtrerLocal(champ: any, valeur: any): Observable<any> {
    return this.http.get(infonet + 'Filtre_Fiche_Local/', {
      params: {
        Champ: champ,
        Valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError()))
  }
  //Afficher message d'erreur
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.log(`${operation} failed: ${error.message}`);
      return of(result as T);
    };
  }
  filtre_7champs (champ1 : any, valeur1 : any, champ2 : any, valeur2 : any, champ3 : any, valeur3 : any ,champ4 : any, valeur4 : any, champ5 : any, valeur5 : any, champ6 : any, valeur6 : any , champ7 : any, valeur7 : any, champ8 : any, valeur8 : any)
  {
    return this.http.get(infonet + 'Filtre_Local_8_Champs', {
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
        Champ7: champ7,
        Valeur7: valeur7,
        Champ8: champ8,
        Valeur8: valeur8,
        
      }, observe: 'body'
    }).pipe()
  }
}
