import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import {  Router } from '@angular/router';

 
import 'sweetalert2/src/sweetalert2.scss'
import { DatePipe } from '@angular/common';
 import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { NgpServiceService } from '../Service/ngp-service.service';
import Swal from 'sweetalert2';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ngp',
  templateUrl: './ngp.component.html',
  styleUrls: ['./ngp.component.scss']
})
export class NgpComponent implements OnInit {

  Lineaire = true;//form stepper linéaire
  Informations_Generales: any = FormGroup;
   
  Informations : any = FormGroup;
  l_NGP: any;
  l_taxe: any;
  l_taxe_ngp: any =[];
   
  constructor(private router: Router, public  Service: NgpServiceService, private http: HttpClient, private fb: FormBuilder,public datepipe:DatePipe) {
   
    this.Informations_Generales = this.fb.group({
      Nom: ["" ],
      NGP: ['', Validators.required],
           
   
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

  ajouter_Ngp ()
  {
  
    var formDataDonnees: any = new FormData();
    formDataDonnees.append('Categorie', this.Informations_Generales.get('Nom').value);
    formDataDonnees.append('Valeur', 0);    
    var t= 1 ;
    for (let i = 0; i < this.l_NGP.length; i++) {
      console.log(this.l_NGP[i].nom +"  "+this.Informations_Generales.get('Nom').value)
      
      if (this.Informations_Generales.get('Nom').value==this.l_NGP[i].nom)
      {
        Swal.fire({
          title: 'valeur Existant ',
          icon: 'warning',         
          confirmButtonText: 'ok ',      
        }) 
        t=0;
      }
    }
   
     
    if(t==1)
    {
      this.Service.ajouterngp(formDataDonnees) ;
      window.location.reload();
    }
   }
   
  ajouter_taxe ()
  {
    var formDataDonnees: any = new FormData();
    formDataDonnees.append('NGP', this.Informations_Generales.get('NGP').value);
    formDataDonnees.append('Taxe', this.Informations.get('Taxe').value);
    var t = 1 ;    
    for (let i = 0; i < this.l_taxe_ngp.length; i++) {
      
      if (this.Informations.get('Taxe').value==this.l_taxe_ngp[i])
      {
        Swal.fire({
          title: 'valeur Existant ',
          icon: 'warning',         
          confirmButtonText: 'ok ',      
        }) 
        t=0;
      }
    }  
     
    if(t==1)
    {
    this.Service.ajouterngp_taxe(formDataDonnees) ;
    this.lister();
    }
  //  window.location.reload();
  }

  Supprimer_taxe()
  {
    var n = this.Informations_Generales.get('NGP').value;
    var t = this.Informations.get('Taxe').value;
    this.Service.Supprimerngp_taxe( n,t) ;
    this.lister();
  } 
  lister ()
  {
    this.Service.liste_taxe_ngp( this.Informations_Generales.get('NGP').value).subscribe((response: Response) => {

      this.l_taxe_ngp = response;
       
    });
    
      
  }


  //Afficher message d'erreur  
  MessageErreur() {
    if (this.Informations_Generales.get('NGP').hasError('required')) {
      return 'Vous devez Selectione un NGP!';
    }
    else {
      return '';
    }
  }
    
  
  
  
}
