import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ProduitServiceService } from '../Service/produit-service.service';

@Component({
  selector: 'app-ajout-produit-standard',
  templateUrl: './ajout-produit-standard.component.html',
  styleUrls: ['./ajout-produit-standard.component.scss']
})
export class AjoutProduitStandardComponent implements OnInit {
  categorie_type1: any;
  categorie_type2: any;
  categorie_famille: any;
  categorie_sous_famille: any;
  categorie_unite: any;
  categorie_tva: any;
  categorie_fodec: any;
  categorie_pays: any;
  categorie_ville: any;
  categorie_region: any;
  categorie_ngp: any;
  categorie_saison: any = ['Printemps', 'Eté', 'Automne', 'Hiver']
  marque: any;
  Informations_Generales_Form: FormGroup;
  Specifications_Form: FormGroup;
  Recapitulation_Form: FormGroup;
  constructor(private http: HttpClient, private serviceProduit: ProduitServiceService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute) {
   
  
    this.Informations_Generales_Form = this.fb.group({

      Nom_Produit: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Marque: [''],
      Unite: [''],
      Valeur_Unite: [],
      Type1: [''],
      Type2: [''],
      Famille: [''],
      Sous_Famille: [''],
      Caracteristique_Technique: [''],
      Tva: [],
      Ngp: [''],
      Code_Barre: [''],
      Fodec: [''],
    });
    this.Specifications_Form = this.fb.group({
      Source: [''],
      Image: [''],
      Certificat: [''],
      Rfid: [''],
      Pays: [''],
      Ville: [''],
      Region: [''],
      Saison: [''],
      N_Imei: [],
      N_Imei2: [],
      Temperature_Max: [],
      Temperature_Min: [],
      N_Lot: [],
      Date_Fabrication: [],
      Date_Validite: [],
      N_Serie: [],
      Couleur: [''],
      Taille: [''],
      Role: [''],


    });

    this.Recapitulation_Form = this.fb.group({

    });
    //liste des ngp
    this.serviceProduit.Categorie_Ngp().subscribe((response: Response) => {

      this.categorie_ngp = response;
    });
    //liste des pays
    this.serviceProduit.ListerPays().subscribe((response: Response) => {

      this.categorie_pays = response;
    });
    //afficher type 1
    this.serviceProduit.Categorie_Type1().subscribe((response: Response) => {

      this.categorie_type1 = response;
    });
    //liste des unités
    this.serviceProduit.Categorie_Unite().subscribe((response: Response) => {

      this.categorie_unite = response;
    });
    this.serviceProduit.Categorie_Tva().subscribe((response: Response) => {

      this.categorie_tva = response;
    });
    this.serviceProduit.Categorie_Fodec().subscribe((response: Response) => {

      this.categorie_fodec = response;
    });
  }
  delay(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  ngOnInit(): void {
  }

}
