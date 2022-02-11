import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


import 'sweetalert2/src/sweetalert2.scss'
import { DatePipe } from '@angular/common';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NgpServiceService } from '../Service/ngp-service.service';
import Swal from 'sweetalert2';
import { MatStepper } from '@angular/material/stepper';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-ajouter',
  templateUrl: './ajouter.component.html',
  styleUrls: ['./ajouter.component.scss']
})
export class AjouterComponent implements OnInit {
  Lineaire = true;//form stepper linéaire
  Informations_Generales: any = FormGroup;
  @ViewChild('stepper') private myStepper: any = MatStepper;
  Informations: any = FormGroup;
  l_NGP: any;
  l_taxe: any;
  l_taxe_ngp: any = [];
  table: any = [];
  loading=false
  constructor(private router: Router, public Service: NgpServiceService, private http: HttpClient, private fb: FormBuilder, public datepipe: DatePipe) {

    this.Informations_Generales = this.fb.group({
      Nom: ["", Validators.required],
    });
    this.Informations = this.fb.group({
      Taxe: [''],
    });


    this.Service.obtenirngp().subscribe((response: Response) => {

      this.l_NGP = response;
    });

    this.Service.obtenirtaxe().subscribe((response: Response) => {

      this.l_taxe = response;

    });
  }




  ngOnInit() {
  }
  // ajouter un taxe x ou ngp y
  ajouter_taxe_au_Ngp(ngp: any, taxe: any) {

    var formDataDonnees: any = new FormData();
    formDataDonnees.append('NGP', ngp);
    formDataDonnees.append('Taxe', taxe);
    this.Service.liste_taxe_ngp(formDataDonnees)


  }
 // ajouter un taxe x ou ngp y
 ajouter_taxe_en_Ngp(  taxe: any) {
  this.loading=true
  var formDataDonnees: any = new FormData();
  formDataDonnees.append('NGP', this.Informations_Generales.get('Nom').value);
  formDataDonnees.append('Taxe', taxe);
  this.Service.ajouterngp_taxe(formDataDonnees);
  this.loading=false
}

  // ajouter taxe au tableaux
  obj: any
  ajouter_taxe() {
    var t = 1;
    for (let i = 0; i < this.table.length; i++) {
      if (this.table[i].nom + "" == this.Informations.get('Taxe').value + "") {
        t = 0;
      }
    }
    if (t == 1) {
      this.obj = {}
      this.obj.nom = this.Informations.get('Taxe').value;
      this.table.push(this.obj)
      this.ajouter_taxe_en_Ngp(this.Informations.get('Taxe').value)      
    }
    else {
      Swal.fire({
        title: 'valeur Existant ',
        icon: 'warning',
        confirmButtonText: 'ok ',
      })
    }




  }
  // supprimer taxe 
  sup(i: any) {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, garde le'
    }).then((result) => {
      if (result.value) {
        this.Service.Supprimerngp_taxe( this.Informations_Generales.get('Nom').value,this.table[i]) ;
        this.table.splice(i, 1);
      }
    })
  }

  //tester si le ngp exsiste ou non 
  test_ngp() {
    let r= "0"
    for ( let i = 0 ; i<this.l_NGP.length ; i++)
    {
     
      if (this.l_NGP[i].nom+""==this.Informations_Generales.get('Nom').value){
        r="1"
      }
  
    }
    console.log(r)
    if (r=="1")
    {
      Swal.fire({
        title: 'ngp existe déjà ',
        icon: 'warning',
        confirmButtonText: 'ok ',
      })
    }else{ this.ajouter_ngp ();this.myStepper.next();}
  }
 
 

  //Afficher message d'erreur  
  MessageErreur() {
    if (this.Informations_Generales.get('Nom').hasError('required')) {
      return 'Nom !';
    }
    else {
      return '';
    }
  }

  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async ajouter_ngp() {

    var formDataDonnees: any = new FormData();
    formDataDonnees.append('Categorie', this.Informations_Generales.get('Nom').value);
    formDataDonnees.append('Valeur', 0);
    this.Service.ajouterngp(formDataDonnees);
  }
  valider()
  {     
    this.router.navigate(['/Menu/Menu-init/Menu-ngp/Lister-ngp']);
  }




}

