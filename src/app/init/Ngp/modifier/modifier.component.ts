import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatStepper } from '@angular/material/stepper';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { NgpServiceService } from '../Service/ngp-service.service';

@Component({
  selector: 'app-modifier',
  templateUrl: './modifier.component.html',
  styleUrls: ['./modifier.component.scss']
})
export class ModifierComponent implements OnInit {

  Lineaire = true;//form stepper linéaire
  Informations_Generales: any = FormGroup;
  @ViewChild('stepper') private myStepper: any = MatStepper;
  Informations: any = FormGroup;
  l_NGP: any;
  l_taxe: any;
  l_taxe_ngp: any = [];
  table: any = [];
  loading=false
  nom:any
  constructor(private router: Router, public Service: NgpServiceService,private route: ActivatedRoute, private http: HttpClient, private fb: FormBuilder, public datepipe: DatePipe) {
    this.nom = this.route.snapshot.params.Nom
  
    this.Informations = this.fb.group({
      Taxe: [''],
    });
     this.table=[];

    this.Service.liste_taxe_ngp(this.nom).subscribe((response: Response) => {
      
      this.l_NGP = response;
      for(let i = 0 ; i<this.l_NGP.length;i++)
      {
        this.obj={}
        this.obj.nom=this.l_NGP[i]
        console.log(this.obj)
        this.table.push(this.obj)
      } 
    });

    this.Service.obtenirtaxe().subscribe((response: Response) => {
      this.l_taxe = response;
    });
  }




  ngOnInit() {
  }
  // ajouter un taxe x ou ngp y
  ajouter_taxe_au_Ngp(  taxe: any) {
    this.loading=true
    var formDataDonnees: any = new FormData();
    formDataDonnees.append('NGP', this.nom);
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
      this.ajouter_taxe_au_Ngp(this.Informations.get('Taxe').value);
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
        this.Service.Supprimerngp_taxe( this.nom,this.table[i].nom) ;
        this.table.splice(i, 1); 
      }
    })
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

  




}

