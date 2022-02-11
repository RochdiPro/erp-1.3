import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
 
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
 
 import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import { CongeServiceService } from '../conge-service.service';
import { ActivatedRoute, Router } from '@angular/router';
 
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-modifier-conge',
  templateUrl: './modifier-conge.component.html',
  styleUrls: ['./modifier-conge.component.scss']
})
export class ModifierCongeComponent   {

  //passage d'une étape à une autre uniquement si l'étape est validée 
  passage_etape = true;
  
  types: any;
   
  Informations_Generales_Form: FormGroup;   
  Recapitulation_Form: FormGroup;
  modeleSrc: any;
  modele: any;
  Doc_par_defaut_blob: any;
  imageSrc: any;b: any;
  id_c :any;
  Data:any ;
  Date_d :any ;
  Date_f : any ;
constructor(private http: HttpClient, public serviceClient: CongeServiceService, private fb: FormBuilder ,private route: ActivatedRoute, private router: Router) {

  this.id_c = this.route.snapshot.params.id;

  this.serviceClient.Employe(this.id_c).subscribe((resp: any) => {
    this. Data = resp;      
     
    this.Date_d = new Date(this.Data.date_Debut);
    this.Date_f = new Date(this.Data.date_Fin);    
  });

  this.Chargement ();
  this.sansChoix(); 
  this.modelePdfBase64();

  //   formulaire contenant les informations générales   
  this.Informations_Generales_Form = this.fb.group({
    Raison: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(50)]],
    Type: ['', Validators.required],    
    Date_debut: ['', [Validators.required]],   
    Date_fin: ['', [Validators.required]],
    Description: [''],
    Nb_jour: [], 
    Image: [''],
    
  });
  this.Recapitulation_Form = this.fb.group({});
  this.serviceClient.Listetype().subscribe((reponse: Response) => {

    this.types = reponse;
  });
} 

  choixImage() {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.imageSrc = reader.result;
      this.imageSrc = btoa(this.imageSrc);
      this.imageSrc = atob(this.imageSrc);
      this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
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
  // conversion   en base 64
  async sansChoix() {
  await this.delai(4000);
  const lecteur = new FileReader();
  lecteur.onloadend = () => {
    this.imageSrc = lecteur.result;
    this.imageSrc = btoa(this.imageSrc);
    this.imageSrc = atob(this.imageSrc);
    this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
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

 
ModifierConge() { 

  const nom_image_par_defaut = 'image_par_defaut.png';
  const Fichier_image_par_defaut = new File([this.Doc_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
  var formData: any = new FormData();
  formData.append('Id', this.id_c);  
  formData.append('Type', this.Informations_Generales_Form.get('Type').value);  
  formData.append('Raison', this.Informations_Generales_Form.get('Raison').value);  
  formData.append('Etat',  'en cours' );  
  if (this.Informations_Generales_Form.get('Image').value === '') {
    formData.append('Document', Fichier_image_par_defaut);
  } else formData.append('Document', this.Informations_Generales_Form.get('Image').value);
  formData.append('NB_Jours', this.Informations_Generales_Form.get('Nb_jour').value);
  formData.append('Date_Debut', this.Informations_Generales_Form.get('Date_debut').value);  
  formData.append('Date_Fin', this.Informations_Generales_Form.get('Date_fin').value);  
  formData.append('Description', this.Informations_Generales_Form.get('Description').value);
  formData.append('Employe', "1");
  
   //demande de confirmation de la modification
   Swal.fire({
    title: 'Êtes-vous sûr?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Oui, modifiez-le',
    cancelButtonText: 'Non'
  }).then((result) => {
    if (result.value) {
      this.serviceClient.ModifierEmployes(formData).subscribe(data => {
        //lorsque la modification est realisé, redirection à la page lister-Client

        this.router.navigate(['/Menu/Menu-conge/Lister-conge'])
        Swal.fire(
          'Congé modifié avec succès!',
          '',
          'success'
        )
        return data;
      }, err => {
        Swal.fire({

          icon: 'error',
          title: 'erreur de modification !',
          showConfirmButton: false,
          timer: 1500
        });
        throw err;
      });

    } else if (result.dismiss === Swal.DismissReason.cancel) {
      Swal.fire(
        'Annulé',
        '',
        'error'
      )
      this.router.navigate(['Menu/Menu-employe/Lister-employe'])
    }
  })

}


}