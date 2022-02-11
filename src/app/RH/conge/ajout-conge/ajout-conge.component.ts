 import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
 import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import { CongeServiceService } from '../conge-service.service';
import { ThrowStmt } from '@angular/compiler';
 
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-ajout-conge',
  templateUrl: './ajout-conge.component.html',
  styleUrls: ['./ajout-conge.component.scss']
})
export class AjoutCongeComponent  {
 
  passage_etape = true;  
  types: any;   
  Informations_Generales_Form: FormGroup;   
  Recapitulation_Form: FormGroup;
  modeleSrc: any;
  modele: any;
  Doc_par_defaut_blob: any;
  Doc_Src: any;b: any;
  d2:any;
constructor(private http: HttpClient, public service: CongeServiceService, private fb: FormBuilder) {
  this.Chargement();
  this.sansChoix(); 
  this.modelePdfBase64();

  //   formulaire contenant les informations générales d'employé  
  this.Informations_Generales_Form = this.fb.group({
    Raison: ['',  ],
    Type: ['', Validators.required],    
    Date_debut: ['', [Validators.required]],   
    Date_fin: ['', [Validators.required]],
    Description: [''],
    Nb_jour: [], 
    Image: [''],
    
  });
  this.Recapitulation_Form = this.fb.group({});
  this.service.Listetype().subscribe((reponse: Response) => {

    this.types = reponse;
  });
}
 
  

  choixDoc() {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.Doc_Src = reader.result;
      this.Doc_Src = btoa(this.Doc_Src);
      this.Doc_Src = atob(this.Doc_Src);
      this.Doc_Src = this.Doc_Src.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    reader.readAsDataURL(this.Informations_Generales_Form.get('Image').value);                   
  }
  async Chargement() {
    this.http.get('.././assets/images/image_par_defaut.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.Doc_par_defaut_blob = reponse;
      return this.Doc_par_defaut_blob;
  
    }, err => console.error(err),
      () => console.log(this.Doc_par_defaut_blob))
  
  }
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // conversion d'image par défaut en base 64
  async sansChoix() {
  await this.delai(4000);
  const lecteur = new FileReader();
  lecteur.onloadend = () => {
    this.Doc_Src = lecteur.result;
    this.Doc_Src = btoa(this.Doc_Src);
    this.Doc_Src = atob(this.Doc_Src);
    this.Doc_Src = this.Doc_Src.replace(/^data:image\/[a-z]+;base64,/, "");
  }
  lecteur.readAsDataURL(this.Doc_par_defaut_blob);
} 


 
// conversion de modele de pdf  en base 64 
async modelePdfBase64() {
  await this.delai(4000);
  const lecteur = new FileReader();
  lecteur.onloadend = () => {
    this.modeleSrc = lecteur.result;
    this.modeleSrc = btoa(this.modeleSrc);
    this.modeleSrc = atob(this.modeleSrc);
    this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
  }
  lecteur.readAsDataURL(this.modele);
}
 
MessageErreurRaison() {
  
    if (this.Informations_Generales_Form.get('Raison').hasError('required')) {
      return 'Vous devez entrer le Raison!';
    }
  
    if (this.Informations_Generales_Form.get('Raison').hasError('minlength')) {
      return 'Raison non valide! (Min 6 caractères)';
    }
    if (this.Informations_Generales_Form.get('Raison').hasError('maxlength')) {
      return 'Raison non valide! (Max 30 caractères)';
    }
  
}

MessageErreurType() {
  if (this.Informations_Generales_Form.get('Type').hasError('required')) {
    return 'Vous devez choisir un Type!';
  }
}

MessageErreurNb_jour() {
  if (this.Informations_Generales_Form.get('Nb_jour').hasError('required')) {
    return 'Vous devez entrer le Nombre des jours!';
  }
   
}

onPercentChange (event: MatSelectChange)
{   
  this.d2= new Date( this.Informations_Generales_Form.get('Date_debut').value);
  var someDate = new Date('2014-05-14');
  this.d2.setDate(this.d2.getDate() + this.Informations_Generales_Form.get('Nb_jour').value); //number  of days to add, e.x. 15 days
  var dateFormated = someDate.toISOString().substr(0,10);  
}


//  création d' Employé
creerConge() { 

  const nom_image_par_defaut = 'image_par_defaut.png';
  const Fichier_image_par_defaut = new File([this.Doc_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
  var formData: any = new FormData();
  formData.append('Type', this.Informations_Generales_Form.get('Type').value);  
  formData.append('Raison', this.Informations_Generales_Form.get('Raison').value);   
  if (this.Informations_Generales_Form.get('Image').value === '') {
    formData.append('Document', Fichier_image_par_defaut);
  } else formData.append('Document', this.Informations_Generales_Form.get('Image').value);
  formData.append('NB_Jours', this.Informations_Generales_Form.get('Nb_jour').value);
  formData.append('Date_Debut', this.Informations_Generales_Form.get('Date_debut').value);  
  formData.append('Date_Fin', this.Informations_Generales_Form.get('Date_fin').value);  
  formData.append('Description', this.Informations_Generales_Form.get('Description').value);
  formData.append('Employe', "1");
  
  this.service.ajouterConge(formData).subscribe(reponse => {
    Swal.fire({
      position: 'top-end',
      icon: 'success',
      title: 'Congé ajouté avec succès',
      showConfirmButton: false,
      timer: 1500
    })
    return reponse;
  }, err => {
    Swal.fire({
      position: 'top-end',
      icon: 'error',
      title: 'erreur d' + "'" + 'ajout',
      showConfirmButton: false,
      timer: 1500
    });
    throw err;
  });

}


}