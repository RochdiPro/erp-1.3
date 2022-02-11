import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
const erp = "/ERP/";
const infonet = "/INFONET/";
@Injectable({
  providedIn: 'root'
})
export class VehiculeService {
  handleError: any;
  constructor(private httpClient: HttpClient) { }

  //creation du vehicule
  public createvehicule(formData: any) {
    return this.httpClient.post(erp + 'creer-vehicule', formData).pipe(
      catchError(this.handleError)
    );
  }

  //lister toutes les vehicules
  public vehicules() {
    return this.httpClient.get(erp + 'vehicules');
  }

  //charger un vehicule specifique
  public vehicule(id: any) {
    return this.httpClient.get(erp + 'vehicule',{
      params: {
        id: id
      }
    }).pipe(catchError(this.handleError));
  }

  //mettre a jour un vehicule
  public miseajourvehicule(formData: any) {
    return this.httpClient.put(erp + 'modifier-vehicule', formData).pipe(
      catchError(this.handleError)
    );
  }

  //filtrer vehicule
  public filtrerVehicule(champ: any, valeur: any) {
    return this.httpClient.get(erp + 'filtre-vehicule', {
      params: {
        champ: champ,
        valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  //ajouter une reclamation pour un vehicule
  public reclamationvehicule(formData: any) {
    return this.httpClient.put(erp + 'reclamation-vehicule', formData).pipe(
      catchError(this.handleError)
    );
  }

  //mettre a jour le kilométrage d'un vehicule
  public miseajourkm(formData: any) {
    return this.httpClient.put(erp + 'mise-a-jour-km', formData).pipe(
      catchError(this.handleError)
    );
  }

  //supprimer un vehicule
  public supprimerVehicule(id: any) {
    return this.httpClient.delete(erp + 'supprimer-vehicule', {
      params:{
        id: id
      }, observe: 'body'
    }).pipe(
      catchError(this.handleError)
    );
  }

  // modifier kilometrage prochain entretien
  public majKilometrageEntretien(formData: any) {
    return this.httpClient.put(erp + 'mise-a-jour-kilometrage-entretien', formData).pipe(catchError(this.handleError));
  }

  //mettre à jour l'etat de vehicule
  public majEtatVehicule(formData: any) {
    this.httpClient.put(erp + 'mise-a-jour-etat-vehicule', formData).subscribe(
      (response) => console.log(response),
      (error) => console.log(error)
    )
  }

  //creer nouveau entretien
  public creerEntretien(formData: any) {
    return this.httpClient.post(erp + 'create-entretien', formData).pipe(catchError(this.handleError));
  }

  //get liste entretiens
  public getEntretiensVehicule(id: any) {
    return this.httpClient.get(erp + 'entretien-vehicule', {
      params: {
        id: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  //lister les carburants
  public carburants() {
    return this.httpClient.get(erp + 'carburants');
  }

  //creer nouveau carburant
  public creerCarburant(formData: any) {
    return this.httpClient.post(erp + 'creerCarburant', formData).pipe(
      catchError(this.handleError)
    );
  }

  //modifier carburant
  public modifierCarburant(formData: any) {
    return this.httpClient.put(erp + 'majCarburant', formData).pipe(
      catchError(this.handleError)
    );
  }

  //Ajouter un nouveau vehicule loué
  public creerVehiculeLoue(formData: any) {
    return this.httpClient.post(erp + 'creer-vehicule-loue', formData).pipe(
      catchError(this.handleError)
    );
  }

  //lister les vehicules loués
  public vehiculesLoues() {
    return this.httpClient.get(erp + 'vehicules-loues')
  }

  //importer les données d'un vehicule loué par ID
  public vehiculeLoue(id: any) {
    return this.httpClient.get(erp + 'vehicule-loue', {
      params: {
        id_vehicule_loue: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  //supprimer un vehicule loué
  public supprimerVehiculeLoue(id: any) {
    return this.httpClient.delete(erp + 'supprimer-vehicule-loue', {
      params: {
        id_vehicule_loue: id
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

  //mise a jour etat vehicule loué
  public majDateLocation(formData: any) {
    return this.httpClient.put(erp + 'mise-a-jour-date-location', formData).pipe(
      catchError(this.handleError)
    );
  }

  //filtrer vehicule
  public filtrerVehiculeLoues(champ: any, valeur: any) {
    return this.httpClient.get(erp + 'filtre-vehicule-loue', {
      params: {
        champ: champ,
        valeur: valeur
      }, observe: 'body'
    }).pipe(catchError(this.handleError));
  }

}
