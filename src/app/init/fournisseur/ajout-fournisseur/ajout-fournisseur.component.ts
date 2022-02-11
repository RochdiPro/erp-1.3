
import { FournisseurServiceService } from '../Service/fournisseur-service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import Swal from 'sweetalert2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { MatSelectChange } from '@angular/material/select';
import { Router } from '@angular/router';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-ajout-fournisseur',
  templateUrl: './ajout-fournisseur.component.html',
  styleUrls: ['./ajout-fournisseur.component.scss']
})
export class AjoutFournisseurComponent implements OnInit {
  //passage d'une étape à une autre uniquement si l'étape est validée 
  passage_etape = false;
  pays: string;
  ville: string;
  region: string;
  categorie_region: any;
  categorie_ville: any;
  categorie_pays: any;
  categorie_banque: any;
  categorie_fournisseur: any;
  categorie_piece: any;
  categorie_fiscale: any;
  choix_Categorie_Fiscale: any;
  Informations_Generales_Form: FormGroup;
  Informations_Banques_Form: FormGroup;
  ContactForm: FormGroup;
  Recapitulation_Form: FormGroup;
  modelePdfFournisseurSrc: any;
  model_Fournisseur: any;
  image_fournisseur_par_defaut_blob: any;
  imageFournisseurSrc: any;
  fournisseur_ajout: any;
  constructor(private http: HttpClient, public serviceFournisseur: FournisseurServiceService, private fb: FormBuilder ,public router: Router) {
    this.chargementImage();
    this.sansChoixImage();
    this.chargementModelFournisseur();
    this.modelFournisseurPdfBase64();

    // premiere formulaire contenant les informations generales du fournisseur avec les contrôles sur les champs
    this.Informations_Generales_Form = this.fb.group({
      Nom_Fournisseur: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(30)]],
      Categorie_Fournisseur: ['', Validators.required],
      Categorie_Fiscale: ['Assujetti_tva', Validators.required],
      Identification_Fiscale: ['', [Validators.required, Validators.minLength(13), Validators.maxLength(15)]],
      Representant: ['', ],
      Type_Piece_Identite: ['', Validators.required],
      N_Piece_Identite: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(15)]],
      Date_Livraison_Identite: [],
      Description: [''],
      N_Attestation_Exoneration: [''],
      Etablie_Le: [],
      Valable_Au: [],
      Taux_Reduction_Tva: []
    });
    // deuxieme formulaire contenant les informations financieres du fournisseur avec les contrôles sur les champs
    this.Informations_Banques_Form = this.fb.group({
      Banque1: ['', Validators.required],
      Rib1: ['', [Validators.required, Validators.minLength(20), Validators.maxLength(20)]],
      Banque2: [''],
      Rib2: ['', [Validators.minLength(20), Validators.maxLength(20)]],
      Solde_Facture: [],
      Risque: [],
      Plafond: [],
      Bloque_Achat: [false],
      Timbre_Fiscal: [false]
    });
    this.Informations_Banques_Form.controls.Rib2.disable();
    this.Informations_Banques_Form.controls.Rib1.disable();

    // troisieme formulaire contenant les contacts du fournisseur avec les contrôles sur les champs
    this.ContactForm = this.fb.group({
      Pays: ['', Validators.required],
      Region: [''],
      Ville: [''],
      Email: ['', [
        Validators.required,
        Validators.email,
      ]],
      Tel1: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(12)]],
      Tel2: [''],
      Fax: [''],
      Site_Web: [''],
      Contact: ['', [Validators.required]],
      Adresse: ['', [Validators.required]],
      Image: [''],
    });
    // formulaire affichant la recapitulation des tous les champs saisies et contenant le bouton de sauvegarde
    this.Recapitulation_Form = this.fb.group({});
    // récupérer la liste des categories fournisseurs
    this.serviceFournisseur.ListerCategorieFournisseur().subscribe((reponse: Response) => {
      this.categorie_fournisseur = reponse;
    });
    // récupérer la liste des categories piece d'identité
    this.serviceFournisseur.ListerCategoriePiece().subscribe((reponse: Response) => {
      this.categorie_piece = reponse;
    });
    // récupérer la liste des categories fiscale
    this.serviceFournisseur.ListerCategorieFiscale().subscribe((reponse: Response) => {
      this.categorie_fiscale = reponse;
    });
    // récupérer la liste des categories banques 
    this.serviceFournisseur.ListerBanques().subscribe((reponse: Response) => {
      this.categorie_banque = reponse;
    });
    // récupérer la liste des pays
    this.serviceFournisseur.ListerPays().subscribe((reponse: Response) => {
      this.categorie_pays = reponse;
    });
  }
  // fonction activée lors de choix du categorie fiscale
  CategorieFiscaleSelectionner(event: MatSelectChange) {
    this.choix_Categorie_Fiscale = event.value;
  }
  // fonction activée lors de choix du pays
  ChoixPays(event: MatSelectChange) {
    this.pays = event.value;
    this.serviceFournisseur.ListerVille(this.pays).subscribe((reponse: Response) => {
      this.categorie_ville = reponse;
    });
  }
  // fonction activée lors de choix du ville
  ChoixVille(event: MatSelectChange) {
    this.ville = event.value;
    this.serviceFournisseur.ListerRegion(this.ville).subscribe((reponse: Response) => {
      this.categorie_region = reponse;
    });
  }
  // reactiver saisi rib2
  ChoixBanque2(event: MatSelectChange) {
    this.Informations_Banques_Form.controls.Rib2.enable();
  }
  // reactiver saisi rib1

  ChoixBanque1(event: MatSelectChange) {
    this.Informations_Banques_Form.controls.Rib1.enable();
  }
  fournisseur_data :any ;
  creerFournisseur() {
    const nom_image_par_defaut = 'image_par_defaut.png';
    const Fichier_image_par_defaut = new File([this.image_fournisseur_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
    var formData: any = new FormData();

    formData.append('Nom_Fournisseur', this.Informations_Generales_Form.get('Nom_Fournisseur').value);
    formData.append('Categorie_Fournisseur', this.Informations_Generales_Form.get('Categorie_Fournisseur').value);
    formData.append('Categorie_Fiscale', this.Informations_Generales_Form.get('Categorie_Fiscale').value);
    formData.append('Code_Tva', this.Informations_Generales_Form.get('Identification_Fiscale').value);
    if (this.ContactForm.get('Image').value === '') {
      formData.append('Image', Fichier_image_par_defaut);
    } else formData.append('Image', this.ContactForm.get('Image').value);
    formData.append('Type_Piece_Identite', this.Informations_Generales_Form.get('Type_Piece_Identite').value);
    formData.append('N_Piece_Identite', this.Informations_Generales_Form.get('N_Piece_Identite').value);
    if (this.Informations_Generales_Form.get('Date_Livraison_Identite').value === null) {
      formData.append('Date_Livraison_Identite', '01/01/1900');
    } else formData.append('Date_Livraison_Identite', this.Informations_Generales_Form.get('Date_Livraison_Identite').value);
    formData.append('Representant', this.Informations_Generales_Form.get('Representant').value);
    formData.append('Description', this.Informations_Generales_Form.get('Description').value);
    formData.append('N_Attestation_Exoneration', this.Informations_Generales_Form.get('N_Attestation_Exoneration').value);

    if (this.Informations_Generales_Form.get('Etablie_Le').value === null) {
      formData.append('Debut_Exoneration', '01/01/1900');
    } else formData.append('Debut_Exoneration', this.Informations_Generales_Form.get('Etablie_Le').value);
    if (this.Informations_Generales_Form.get('Valable_Au').value === null) {
      formData.append('Fin_Exoneration', '01/01/1900');
    } else formData.append('Fin_Exoneration', this.Informations_Generales_Form.get('Valable_Au').value);
    if (this.Informations_Generales_Form.get('Taux_Reduction_Tva').value == null) {
      formData.append('Reduction_Tva', 0);
    }
    else formData.append('Reduction_Tva', this.Informations_Generales_Form.get('Taux_Reduction_Tva').value);
    formData.append('Banque1', this.Informations_Banques_Form.get('Banque1').value);
    formData.append('Rib1', this.Informations_Banques_Form.get('Rib1').value);
    formData.append('Banque2', this.Informations_Banques_Form.get('Banque2').value);
    formData.append('Rib2', this.Informations_Banques_Form.get('Rib2').value);
    formData.append('Timbre_Fiscal', this.Informations_Banques_Form.get('Timbre_Fiscal').value);
    formData.append('Bloque_Achat', this.Informations_Banques_Form.get('Bloque_Achat').value);
    if (this.Informations_Banques_Form.get('Solde_Facture').value == null) {
      formData.append('Solde_Facture', 0);
    }
    else formData.append('Solde_Facture', this.Informations_Banques_Form.get('Solde_Facture').value);
    if (this.Informations_Banques_Form.get('Risque').value == null) {
      formData.append('Risque', 0);
    }
    else formData.append('Risque', this.Informations_Banques_Form.get('Risque').value);
    if (this.Informations_Banques_Form.get('Plafond').value == null) {
      formData.append('Plafond', 0);
    }
    else formData.append('Plafond', this.Informations_Banques_Form.get('Plafond').value);
    formData.append('Contact', this.ContactForm.get('Contact').value);
    formData.append('Adresse', this.ContactForm.get('Adresse').value);
    formData.append('Region', this.ContactForm.get('Region').value);
    formData.append('Ville', this.ContactForm.get('Ville').value);
    formData.append('Pays', this.ContactForm.get('Pays').value);
    formData.append('Email', this.ContactForm.get('Email').value);
    formData.append('Site_Web', this.ContactForm.get('Site_Web').value);
    formData.append('Tel1', this.ContactForm.get('Tel1').value);
    formData.append('Tel2', this.ContactForm.get('Tel2').value);
    formData.append('Fax', this.ContactForm.get('Fax').value);
    this.serviceFournisseur.ajouterFournisseur(formData).subscribe(response => {
      this.fournisseur_data = response.body;
      
    Swal.fire(
      'success',
      'Fournisseur ajouté avec succès',
      'success'
    ).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Voulez vous imprimer ce Fournisseur',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui',
          cancelButtonText: 'Non',
        }).then((result) => {
          if (result.isConfirmed) {

            this.genererPdfFournisseur(this.fournisseur_data.id_Fr);
            
          } else if (result.isDismissed) {
            console.log('erreur  ');
          }
          this.router.navigate(['/Menu/Menu-init/Menu-fournisseur/Lister-fournisseur']);
        });
      }
     
    
    }, (err) => {



    });
  });
  }
  //fonction activé lors de choix d'une image pour la convertir en base 64
  choixImageFournisseur() {
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.imageFournisseurSrc = lecteur.result;
      this.imageFournisseurSrc = btoa(this.imageFournisseurSrc);
      this.imageFournisseurSrc = atob(this.imageFournisseurSrc);
      this.imageFournisseurSrc = this.imageFournisseurSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.ContactForm.get('Image').value);
    
  }
  // generer PDF contenant details du fournisseur ajouté  
  genererPdfFournisseur(id:any) {
    if (this.ContactForm.get('Image').value === '') {
      this.sansChoixImage();
    }

    let dd = {

      footer: function (currentPage, pageCount) {
        return {
          margin: 35,
          columns: [
            {
              fontSize: 9,
              text: [
                {
                  text: currentPage.toString() + '/' + pageCount,
                }
              ],
              alignment: 'center'
            }
          ]
        };
      },
      pageMargins: [30, 125, 40, 60],
      background: [{
        image: 'data:image/jpeg;base64,' + this.modelePdfFournisseurSrc, width: 600
      }],
      content: [
        {
          image: 'data:image/jpeg;base64,' + this.imageFournisseurSrc,
              width: 150,
              height: 170,
       
              relativePosition: {x:20, y:25}
        },
        {   text: 'Code Fournisseur   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:30}	  , },
        {   text: '' + id  , fontSize: 15,   color: 'black',    decoration :'underline',     bold: true,    relativePosition: {x:360, y:27}	  , },
        {   text: ': ' ,    fontSize: 12,   color: 'black',           relativePosition: {x:350, y:30}	  , },
        {   text: 'Nom du Fournisseur  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:55}	  , },
        {   text: '' + this.Informations_Generales_Form.get('Nom_Fournisseur').value, fontSize: 15,   color: 'black',    decoration :'underline',     bold: true,    relativePosition: {x:360, y:52}	  , },
        {   text: ': ' ,    fontSize: 12,   color: 'black',           relativePosition: {x:350, y:55}	  , },

         {   text: 'Categorie du Fournisseur : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:80}	  , },
        {   text: ': ' + this.Informations_Generales_Form.get('Categorie_Fournisseur').value, fontSize: 12,   color: 'black',       relativePosition: {x:350, y:80}	  , },

        {   text: 'Adresse   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:105}	  , },
        {   text: ': ' + this.ContactForm.get('Adresse').value , fontSize: 12,   color: 'black',     relativePosition: {x:350, y:105}	  , },
     
        {   text: ' Site Web   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:130}	  , },
        {   text: ': ' + this.ContactForm.get('Site_Web').value , fontSize: 12,   color: 'black',      relativePosition: {x:350, y:130}	  , },
      
        {   text: ' Representant   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:155}	  , },
        {   text: ': ' +  this.Informations_Generales_Form.get('Representant').value , fontSize: 12,   color: 'black',      relativePosition: {x:350, y:155}	  , },
      
        {   text: ' Tel /Fax  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:180}	  , },
        {   text: ': ' + this.ContactForm.get('Tel1').value + ' / ' + this.ContactForm.get('Tel2').value +' / '+ this.ContactForm.get('Fax').value, fontSize: 12,   color: 'black',      relativePosition: {x:350, y:180}	  , },
      

        {   text: ' Pays :  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:220}	  , },
        {   text: '' + this.ContactForm.get('Pays').value, fontSize: 12,   color: 'black',      relativePosition: {x:60, y:220}	  , },
      
        {   text: ' Ville :  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:200, y:220}	  , },
        {   text: '' + this.ContactForm.get('Ville').value , fontSize: 12,   color: 'black',      relativePosition: {x:240, y:220}	  , },
      
        {   text: ' Region  '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:350, y:220}	  , },
        {   text: ': ' +this.ContactForm.get('Region').value , fontSize: 12,   color: 'black',      relativePosition: {x:390, y:220}	  , },

        {   text: ' Type de la pièce d' + "'" + ' identité : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:255}	  , },
        {   text: '' + this.Informations_Generales_Form.get('Type_Piece_Identite').value , fontSize: 12,   color: 'black',      relativePosition: {x:180, y:255}	  , },
      
        {   text: ' Numéro de la pièce d' + "'" + ' identité   '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:255}	  , },
        {   text: ': ' +  this.Informations_Generales_Form.get('N_Piece_Identite').value , fontSize: 12,   color: 'black',      relativePosition: {x:415, y:255}	  , },

        {   text: ' Categorie Fiscale : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:290}	  , },
        {   text: '' + this.Informations_Generales_Form.get('Categorie_Fiscale').value , fontSize: 12,   color: 'black',      relativePosition: {x:140, y:290}	  , },
      
        {   text: ' Identification Fiscale  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:290}	  , },
        {   text: ': ' +  this.Informations_Generales_Form.get('Identification_Fiscale').value , fontSize: 12,   color: 'black',      relativePosition: {x:380, y:290}	  , },

        
        {   text: ' Banque 1  : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:325}	  , },
          {   text: '' +  this.Informations_Banques_Form.get('Banque1').value , fontSize: 12,   color: 'black',      relativePosition: {x:140, y:325}	  , },
        
          {   text: ' Rib 1  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:325}	  , },
          {   text: ': ' + this.Informations_Banques_Form.get('Rib1').value , fontSize: 12,   color: 'black',      relativePosition: {x:380, y:325}	  , },


          {   text: ' Banque 2  : '   ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:360}	  , },
          {   text: '' +  this.Informations_Banques_Form.get('Banque2').value, fontSize: 12,   color: 'black',      relativePosition: {x:140, y:360}	  , },
        
          {   text: ' Rib 2  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:360}	  , },
          {   text: ': ' +  this.Informations_Banques_Form.get('Rib2').value, fontSize: 12,   color: 'black',      relativePosition: {x:380, y:360}	  , },
 
          {   text: ' Contact  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:395}	  , },
          {   text: ' : ' +  this.ContactForm.get('Contact').value , fontSize: 12,   color: 'black',      relativePosition: {x:100, y:395}	  , },

          {   text: ' Email  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:250, y:395}	  , },
          {   text: ' : ' + this.ContactForm.get('Email').value, fontSize: 12,   color: 'black',      relativePosition: {x:380, y:395}	  , },
  
          
          {   text: ' Description  '  ,    fontSize: 12,   color: 'black',  relativePosition: {x:20, y:430}	  , },
          {   text: ' : ' + this.Informations_Generales_Form.get('Description').value, fontSize: 12,   color: 'black',      relativePosition: {x:100, y:430}	  , },


    
      ],
      
    };

    pdfMake.createPdf(dd).open();
  }
  // message d'erreur lorsque le nom saisi ne respecte pas les conditions prédifinis
  MessageErreurNom() {
    if (this.Informations_Generales_Form.get('Nom_Fournisseur').hasError('required')) {
      return 'Vous devez entrer le nom du fournisseur!';
    }

    if (this.Informations_Generales_Form.get('Nom_Fournisseur').hasError('minlength')) {
      return 'Nom du fournisseur non valide! (Min 3 caractères)';
    }
    if (this.Informations_Generales_Form.get('Nom_Fournisseur').hasError('maxlength')) {
      return 'Nom du fournisseur non valide! (Max 30 caractères)';
    }
  }
  // message d'erreur lorsque le representant saisi ne respecte pas les conditions prédifinis
  MessageErreurRepresentant() {
    if (this.Informations_Generales_Form.get('Representant').hasError('required')) {
      return 'Vous devez entrer le representant du fournisseur!';
    }
    if (this.Informations_Generales_Form.get('Representant').hasError('minlength')) {
      return 'Representant non valide! (Min 3 caractères)';
    }
    if (this.Informations_Generales_Form.get('Representant').hasError('maxlength')) {
      return 'Representant non valide! (Max 30 caractères)';
    }
  }
  // message d'erreur lorsque Categorie Fournisseur saisi ne respecte pas les conditions prédifinis
  MessageErreurCategorieFournisseur() {
    if (this.Informations_Generales_Form.get('Categorie_Fournisseur').hasError('required')) {
      return 'Vous devez entrer la  Categorie du fournisseur!';
    }
  }
  // message d'erreur lorsque Categorie Fiscale saisi ne respecte pas les conditions prédifinis
  MessageErreurCategorieFiscale() {
    if (this.Informations_Generales_Form.get('Categorie_Fiscale').hasError('required')) {
      return 'Vous devez entrer la  Categorie Fiscale!';
    }

  }
  // message d'erreur lorsque l'identifiant fiscal saisi ne respecte pas les conditions prédifinis
  MessageErreurIdentificationFiscale() {
    if (this.Informations_Generales_Form.get('Identification_Fiscale').hasError('required')) {
      return 'Vous devez entrer Identification Fiscale!';
    }
    if (this.Informations_Generales_Form.get('Identification_Fiscale').hasError('minlength')) {
      return 'Identification Fiscale non valide! (Min 13 caractères)';
    }
    if (this.Informations_Generales_Form.get('Identification_Fiscale').hasError('maxlength')) {
      return 'Identification Fiscale non valide! (Max 15 caractères)';
    }
  }
  // message d'erreur lorsque Categorie piece saisi ne respecte pas les conditions prédifinis
  MessageErreurCategoriePiece() {
    if (this.Informations_Generales_Form.get('Type_Piece_Identite').hasError('required')) {
      return 'Vous devez entrer le type de la piece Identité!';
    }
  }
  // message d'erreur lorsque le numero de piece d'identité saisi ne respecte pas les conditions prédifinis
  MessageErreurNPieceIdentite() {
    if (this.Informations_Generales_Form.get('N_Piece_Identite').hasError('required')) {
      return 'Vous devez entrer le numéro de pièce identité!';
    }
    if (this.Informations_Generales_Form.get('N_Piece_Identite').hasError('minlength')) {
      return 'Numéro de pièce identité non valide! (Min 8 caractères)';
    }
    if (this.Informations_Generales_Form.get('N_Piece_Identite').hasError('maxlength')) {
      return 'Numéro de pièce identité non valide! (Max 15 caractères)';
    }
  }
  MessageErreurNAttestationExoneration() {
    if (this.Informations_Generales_Form.get('N_Attestation_Exoneration').hasError('required')) {
      return 'Vous devez entrer numero attestaion!';
    }
  }
  MessageErreurEtablieLe() {
    if (this.Informations_Generales_Form.get('Etablie_Le').hasError('required')) {
      return 'Vous devez entrer date exoneration tva!';
    }
  }
  MessageErreurValableAu() {
    if (this.Informations_Generales_Form.get('Valable_Au').hasError('required')) {
      return 'Vous devez entrer date exoneration tva!';
    }
  }
  // message d'erreur lorsque Taux Reduction Tva saisi ne respecte pas les conditions prédifinis
  MessageErreurTauxReductionTva() {
    if (this.Informations_Generales_Form.get('Taux_Reduction_Tva').hasError('required')) {
      return 'Vous devez entrer Taux du Reduction tva!';
    }
  }
  // message d'erreur lorsque banque saisi ne respecte pas les conditions prédifinis
  MessageErreurBanque() {
    if (this.Informations_Banques_Form.get('Banque1').hasError('required')) {
      return 'Vous devez choisir une Banque!';
    }
  }
  // message d'erreur lorsque Rib1 saisi ne respecte pas les conditions prédifinis
  MessageErreurRib() {
    if (this.Informations_Banques_Form.get('Rib1').hasError('required')) {
      return 'Vous devez entrer Rib';
    }
    if (this.Informations_Banques_Form.get('Rib1').hasError('minlength')) {
      return 'Rib non valide! (20 numéro)';
    }
    if (this.Informations_Banques_Form.get('Rib1').hasError('maxlength')) {
      return 'Rib non valide! (20 numéro)';
    }
  }
  // message d'erreur lorsque Contact saisi ne respecte pas les conditions prédifinis
  MessageErreurContact() {
    if (this.ContactForm.get('Contact').hasError('required')) {
      return 'Vous devez saisir un contact';
    }
    if (this.ContactForm.get('Contact').hasError('minlength')) {
      return 'Contact non valide! (3 caractères)';
    }
    if (this.ContactForm.get('Contact').hasError('maxlength')) {
      return 'Contact non valide! (30 caractères)';
    }
  }
  // message d'erreur lorsque l'adresse saisi ne respecte pas les conditions prédifinis
  MessageErreurAdresse() {
    if (this.ContactForm.get('Adresse').hasError('required')) {
      return 'Vous devez entrer Adresse';
    }
    if (this.ContactForm.get('Adresse').hasError('minlength')) {
      return 'Adresse non valide! (3 caractères)';
    }
    if (this.ContactForm.get('Adresse').hasError('maxlength')) {
      return 'Adresse non valide! (30 caractères)';
    }
  }
  // message d'erreur lorsque pays saisi ne respecte pas les conditions prédifinis
  MessageErreurPays() {
    if (this.ContactForm.get('Pays').hasError('required')) {
      return 'Vous devez choisir un  Pays!';
    }
  }
  // message d'erreur lorsque l'email' saisi ne respecte pas les conditions prédifinis
  MessageErreurEmail() {
    if (this.ContactForm.get('Email').hasError('required')) {
      return 'Vous devez saisir un  email!';
    }
    if (this.ContactForm.get('Email').hasError('email')) {
      return 'saisir un email valide!';
    }
  }
  // message d'erreur lorsque tel saisi ne respecte pas les conditions prédifinis
  MessageErreurTel() {
    if (this.ContactForm.get('Tel1').hasError('required')) {
      return 'Vous devez saisir un  numero du telephone!';
    }
  }
  // temps d'attente pour le traitement de fonction 
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  // conversion de modèle de pdf  en base 64 
  async modelFournisseurPdfBase64() {
    await this.delai(3000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modelePdfFournisseurSrc = lecteur.result;
      this.modelePdfFournisseurSrc = btoa(this.modelePdfFournisseurSrc);
      this.modelePdfFournisseurSrc = atob(this.modelePdfFournisseurSrc);
      this.modelePdfFournisseurSrc = this.modelePdfFournisseurSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.model_Fournisseur);
  }
  // récupération de modele pour créer le pdf

  async chargementModelFournisseur() {
    this.http.get('./../../../assets/images/template_fournisseur.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.model_Fournisseur = resp;
      return this.model_Fournisseur;
    }, err => console.error(err),
      () => console.log(this.model_Fournisseur))
  }
  // récupération d'image par défaut de l'assets

  async chargementImage() {
    this.http.get('./../../../assets/images/image_par_defaut.jpg', { responseType: 'blob' }).subscribe((resp: any) => {
      this.image_fournisseur_par_defaut_blob = resp;
      return this.image_fournisseur_par_defaut_blob;
    }, err => console.error(err),
      () => console.log(this.image_fournisseur_par_defaut_blob))
  }
  // conversion d'image par défaut en base 64

  async sansChoixImage() {
    await this.delai(3000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.imageFournisseurSrc = lecteur.result;
      this.imageFournisseurSrc = btoa(this.imageFournisseurSrc);
      this.imageFournisseurSrc = atob(this.imageFournisseurSrc);
      this.imageFournisseurSrc = this.imageFournisseurSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.image_fournisseur_par_defaut_blob);
  }
  ngOnInit(): void {
  }

}
