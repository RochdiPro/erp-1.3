import { DatePipe } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { FournisseurServiceService } from '../Service/fournisseur-service.service';

@Component({
  selector: 'app-modifier-fournisseur',
  templateUrl: './modifier-fournisseur.component.html',
  styleUrls: ['./modifier-fournisseur.component.scss']
})
export class ModifierFournisseurComponent implements OnInit {
  chargement = true;
  Identifiant_Fournisseur: any;
  Fichier_image_Fournisseur: any;
  FournisseurData: any;
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
  Fichier_image: any;
  date_livraison_Cin: any;
  debut_exoneration_tva: any;
  fin_exoneration_tva: any;
  constructor(public dialog: MatDialog, public serviceFournisseur: FournisseurServiceService, private fb: FormBuilder, private route: ActivatedRoute, private router: Router) {
    this.Identifiant_Fournisseur = this.route.snapshot.params.id;

    //fournisseur recuperé de la base 
    this.Fournisseur();

    //image recuperée de la base 
    this.Image_Fournisseur();

    // premiere formulaire contenant les informations generales du fournisseur avec les récupérer sur les champs
    this.Informations_Generales_Form = this.fb.group({
      Nom_Fournisseur: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      Categorie_Fournisseur: [''],
      Categorie_Fiscale: [''],
      Identification_Fiscale: ['', [Validators.minLength(13), Validators.maxLength(15)]],
      Representant: ['', [Validators.minLength(3), Validators.maxLength(30)]],
      Type_Piece_Identite: [''],
      N_Piece_Identite: ['', [Validators.minLength(8), Validators.maxLength(15)]],
      Date_Livraison_Identite: [],
      Description: [''],
      N_Attestation_Exoneration: [''],
      Etablie_Le: [],
      Valable_Au: [],
      Taux_Reduction_Tva: []
    });
    // deuxieme formulaire contenant les informations financieres du fournisseur avec les récupérer sur les champs

    this.Informations_Banques_Form = this.fb.group({
      Banque1: [''],
      Rib1: ['', [Validators.minLength(20), Validators.maxLength(20)]],
      Banque2: [''],
      Rib2: ['', [Validators.minLength(20), Validators.maxLength(20)]],
      Solde_Facture: [],
      Risque: [],
      Plafond: [],
      Bloque_Achat: [],
      Timbre_Fiscal: []
    });
    // troisieme formulaire contenant les contacts du fournisseur avec les récupérer sur les champs

    this.ContactForm = this.fb.group({
      Pays: [''],
      Region: [''],
      Ville: [''],
      Email: ['', [Validators.email]],
      Tel1: [''],
      Tel2: [''],
      Fax: [''],
      Site_Web: [''],
      Contact: [''],
      Adresse: [''],
      Image: ['']
    });
    // liste des categories fournisseurs
    this.Categorie_Fournisseur();

    // liste Categorie piece d'identité
    this.Categorie_Piece_Identite();

    // liste Categorie fiscale
    this.Categorie_fiscale();

    // liste banques 
    this.Categorie_Banques();

    // liste pays
    this.Categorie_pays();
  }
  // recuperer la liste des pays
  Categorie_pays() {
    this.serviceFournisseur.ListerPays().subscribe((response: Response) => {

      this.categorie_pays = response;
    });
  }
  // recuperer la liste des categories banques 
  Categorie_Banques() {
    this.serviceFournisseur.ListerBanques().subscribe((response: Response) => {

      this.categorie_banque = response;
    });
  }
  // recuperer la liste des categories fiscale
  Categorie_fiscale() {
    this.serviceFournisseur.ListerCategorieFiscale().subscribe((response: Response) => {

      this.categorie_fiscale = response;
    });
  }
  // recuperer la liste des categories piece d'identité
  Categorie_Piece_Identite() {
    this.serviceFournisseur.ListerCategoriePiece().subscribe((response: Response) => {

      this.categorie_piece = response;
    });
  }
  // recuperer la liste des categories fournisseurs
  Categorie_Fournisseur() {
    this.serviceFournisseur.ListerCategorieFournisseur().subscribe((response: Response) => {

      this.categorie_fournisseur = response;
    });
  }
  //recuperer image de la base
  Image_Fournisseur() {
    this.serviceFournisseur.Image_Fournisseur(this.route.snapshot.params.id)
      .subscribe((baseImage: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.Fichier_image = reader.result;
          this.Fichier_image_Fournisseur = this.Fichier_image;
          this.Fichier_image = new File([baseImage], 'image_fournisseur', { type: 'image/png' });

        }
        reader.readAsDataURL(baseImage);

      });
  }
  Fournisseur() {
    // récuperer les données du fournisseur par son identifiant
    this.serviceFournisseur.Fournisseur(this.Identifiant_Fournisseur).subscribe((response: Response) => {
      
      this.FournisseurData = response;
      if (this.FournisseurData.date_Livraison_Identite > '1900-01-30') {
        this.date_livraison_Cin = new Date(this.FournisseurData.date_Livraison_Identite);
      }
    
      if (this.FournisseurData.debut_Exoneration > '1900-01-30') {
        this.debut_exoneration_tva = new Date(this.FournisseurData.debut_Exoneration);
      }
      if (this.FournisseurData.fin_Exoneration > '1900-01-30') {
        this.fin_exoneration_tva = new Date(this.FournisseurData.fin_Exoneration);
      }


      // afficher ville selon pays
      this.serviceFournisseur.ListerVille(this.FournisseurData.pays).subscribe((response: Response) => {

        this.categorie_ville = response;

      });
      this.serviceFournisseur.ListerRegion(this.FournisseurData.ville).subscribe((response: Response) => {

        this.categorie_region = response;

      });
      this.chargement = false;

    });
  }
  //fonction activé lors de choix d'une image 
  choixImage() {
    const reader = new FileReader();
    reader.onloadend = () => {
      this.Fichier_image = reader.result;

      this.Fichier_image = btoa(this.Fichier_image);


      this.Fichier_image = atob(this.Fichier_image);

      this.Fichier_image = this.Fichier_image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.Fichier_image = new File([this.FournisseurData.image], 'image_Fournisseur', { type: 'image/png' });
    }
    reader.readAsDataURL(this.ContactForm.get('Image').value);

  }
  afficherImage(id): void {
    const dialogRef = this.dialog.open(VisualiserImageFournisseur, {

      data: { id_Fr: id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }
  // fonction activée lors de choix du categorie fiscale
  CategorieFiscaleSelectionner(event: MatSelectChange) {
    this.choix_Categorie_Fiscale = event.value;

  }
  // fonction activée lors de choix du pays
  ChoixPays(event: MatSelectChange) {
    this.pays = event.value;
    // recuperer la liste des ville du pays choisi
    this.serviceFournisseur.ListerVille(this.pays).subscribe((response: Response) => {

      this.categorie_ville = response;

    });
  }
  // fonction activée lors de choix du ville
  ChoixVille(event: MatSelectChange) {
    this.ville = event.value;
    // recuperer la liste des regions du ville choisie

    this.serviceFournisseur.ListerRegion(this.ville).subscribe((response: Response) => {
      this.categorie_region = response;
    });
  }
  // message d'erreur losque le nom saisi ne respecte pas les conditions prédifinis
  MessageErreurNom() {


    if (this.Informations_Generales_Form.get('Nom_Fournisseur').hasError('minlength')) {
      return 'Nom du fournisseur non valide! (Min 3 caractères)';
    }
    if (this.Informations_Generales_Form.get('Nom_Fournisseur').hasError('maxlength')) {
      return 'Nom du fournisseur non valide! (Max 30 caractères)';
    }
  }
  // message d'erreur losque le representant saisi ne respecte pas les conditions prédifinis
  MessageErreurRepresentant() {

    if (this.Informations_Generales_Form.get('Representant').hasError('minlength')) {
      return 'Representant non valide! (Min 3 caractères)';
    }
    if (this.Informations_Generales_Form.get('Representant').hasError('maxlength')) {
      return 'Representant non valide! (Max 30 caractères)';
    }
  }
  // message d'erreur losque l'identifiant fiscal saisi ne respecte pas les conditions prédifinis
  MessageErreurIdentificationFiscale() {

    if (this.Informations_Generales_Form.get('Identification_Fiscale').hasError('minlength')) {
      return 'Identification Fiscale non valide! (Min 13 caractères)';
    }
    if (this.Informations_Generales_Form.get('Identification_Fiscale').hasError('maxlength')) {
      return 'Identification Fiscale non valide! (Max 15 caractères)';
    }
  }
  // message d'erreur losque le numero de piece d'identité saisi ne respecte pas les conditions prédifinis
  MessageErreurNPieceIdentite() {

    if (this.Informations_Generales_Form.get('N_Piece_Identite').hasError('minlength')) {
      return 'Numéro de pièce identité non valide! (Min 8 caractères)';
    }
    if (this.Informations_Generales_Form.get('N_Piece_Identite').hasError('maxlength')) {
      return 'Numéro de pièce identité non valide! (Max 15 caractères)';
    }
  }

  // message d'erreur losque Rib1 saisi ne respecte pas les conditions prédifinis
  MessageErreurRib() {

    if (this.Informations_Banques_Form.get('Rib1').hasError('minlength')) {
      return 'Rib non valide! (20 numéro)';
    }
    if (this.Informations_Banques_Form.get('Rib1').hasError('maxlength')) {
      return 'Rib non valide! (20 numéro)';
    }
  }
  // message d'erreur losque le contact saisi ne respecte pas les conditions prédifinis
  MessageErreurContact() {

    if (this.ContactForm.get('Contact').hasError('minlength')) {
      return 'Contact non valide! (3 caractères)';
    }
    if (this.ContactForm.get('Contact').hasError('maxlength')) {
      return 'Contact non valide! (30 caractères)';
    }
  }
  // message d'erreur losque l'adresse saisi ne respecte pas les conditions prédifinis
  MessageErreurAdresse() {

    if (this.ContactForm.get('Adresse').hasError('minlength')) {
      return 'Adresse non valide! (3 caractères)';
    }
    if (this.ContactForm.get('Adresse').hasError('maxlength')) {
      return 'Adresse non valide! (30 caractères)';
    }
  }
  // message d'erreur losque l'email' saisi ne respecte pas les conditions prédifinis
  MessageErreurEmail() {

    if (this.ContactForm.get('Email').hasError('email')) {
      return 'saisir un email valide!';
    }
  }
  // fonction activer en cliquant sur le button valider pour modifier un fournisseur
  ModifierFournisseur() {
    //recuperation de l'identifiant du fournisseur
    this.Identifiant_Fournisseur = this.route.snapshot.params.id;
    var formData: any = new FormData();
    formData.append('Id_Fr', this.Identifiant_Fournisseur);

    formData.append('Nom_Fournisseur', this.Informations_Generales_Form.get('Nom_Fournisseur').value);
    formData.append('Categorie_Fournisseur', this.Informations_Generales_Form.get('Categorie_Fournisseur').value);
    formData.append('Categorie_Fiscale', this.Informations_Generales_Form.get('Categorie_Fiscale').value);
    formData.append('Code_Tva', this.Informations_Generales_Form.get('Identification_Fiscale').value);
    formData.append('Type_Piece_Identite', this.Informations_Generales_Form.get('Type_Piece_Identite').value);
    formData.append('N_Piece_Identite', this.Informations_Generales_Form.get('N_Piece_Identite').value);
    if (this.Informations_Generales_Form.get('Date_Livraison_Identite').value == null) {
      formData.append('Date_Livraison_Identite', '01/01/1900');
    } else formData.append('Date_Livraison_Identite', this.Informations_Generales_Form.get('Date_Livraison_Identite').value);
    formData.append('Representant', this.Informations_Generales_Form.get('Representant').value);
    formData.append('Description', this.Informations_Generales_Form.get('Description').value);
    if (this.Informations_Generales_Form.get('N_Attestation_Exoneration').value.length == 0) {
      formData.append('N_Attestation_Exoneration', this.FournisseurData.n_Attestation_Exoneration);
    } else formData.append('N_Attestation_Exoneration', this.Informations_Generales_Form.get('N_Attestation_Exoneration').value);
    if (this.Informations_Generales_Form.get('Etablie_Le').value == null) {
      formData.append('Debut_Exoneration', '01/01/1900');
    } else formData.append('Debut_Exoneration', this.Informations_Generales_Form.get('Etablie_Le').value);
    if (this.Informations_Generales_Form.get('Valable_Au').value == null) {
      formData.append('Fin_Exoneration', '01/01/1900');
    } else formData.append('Fin_Exoneration', this.Informations_Generales_Form.get('Valable_Au').value);
    if (this.Informations_Generales_Form.get('Taux_Reduction_Tva').value == null) {
      formData.append('Reduction_Tva', this.FournisseurData.reduction_Tva);
    } else formData.append('Reduction_Tva', this.Informations_Generales_Form.get('Taux_Reduction_Tva').value);
    formData.append('Banque1', this.Informations_Banques_Form.get('Banque1').value);
    formData.append('Rib1', this.Informations_Banques_Form.get('Rib1').value);
    formData.append('Banque2', this.Informations_Banques_Form.get('Banque2').value);
    formData.append('Rib2', this.Informations_Banques_Form.get('Rib2').value);
    formData.append('Timbre_Fiscal', this.Informations_Banques_Form.get('Timbre_Fiscal').value);
    formData.append('Bloque_Achat', this.Informations_Banques_Form.get('Bloque_Achat').value);
    formData.append('Solde_Facture', this.Informations_Banques_Form.get('Solde_Facture').value);
    formData.append('Risque', this.Informations_Banques_Form.get('Risque').value);
    formData.append('Plafond', this.Informations_Banques_Form.get('Plafond').value);
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
    formData.append('Image', this.Fichier_image);
    //demande de confirmation de la modification
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifiez-le',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {
        this.serviceFournisseur.ModifierFournisseur(formData).subscribe(data => {
          //lorsque la modification est realisé redirection à la page lister-fournisseur
          this.router.navigate(['/Menu/Menu-init/Menu-fournisseur/Lister-fournisseur'])
          Swal.fire(
            'Fournisseur modifié avec succés!',
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
        this.router.navigate(['Menu/Menu-fournisseur/Lister-fournisseur'])
      }
    })
  }

  ngOnInit(): void {
  }

}

@Component({
  selector: 'visualiser-image-fournisseur',
  templateUrl: 'visualiser-image-Fournisseur.html',
})
export class VisualiserImageFournisseur {
  photo: any;

  constructor(private serviceFournisseur: FournisseurServiceService,
    public dialogRef: MatDialogRef<VisualiserImageFournisseur>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.serviceFournisseur.Image_Fournisseur(data.id_Fr)
      .subscribe((baseImage: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.photo = reader.result;

        }
        reader.readAsDataURL(baseImage);

      });


  }
  Fermer(): void {
    this.dialogRef.close();
  }
}