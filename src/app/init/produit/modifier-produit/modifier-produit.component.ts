import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ProduitServiceService } from '../Service/produit-service.service';

@Component({
  selector: 'app-modifier-produit',
  templateUrl: './modifier-produit.component.html',
  styleUrls: ['./modifier-produit.component.scss']
})
export class ModifierProduitComponent implements OnInit {
  Fichier_image_Produit: any;
  //les valeurs non définis
  N_Imei_Cocher = true;
  N_Imei_Nn_Cocher = false;
  N_Imei2_Cocher = true;
  N_Imei2_Nn_Cocher = false;
  N_Serie_Cocher = true;
  N_Serie_Nn_Cocher = false;
  N_Lot_Cocher = true;
  N_Lot_Nn_Cocher = false;
  Date_Fabrication_Cocher = true;
  Date_Fabrication_Nn_Cocher = false;
  Date_Validite_Cocher = true;
  Date_Validite_Nn_Cocher = false;
  // valeur de champs par defaut
  parDefaut: any
  id_produit: any;
  produitData: any;
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
  tva: any;
  categorie_saison: any = ['Printemps', 'Eté', 'Automne', 'Hiver'];
  Informations_Generales_Form: FormGroup;
  Specifications_Form: FormGroup;
  base64Image: any;
  nom_image = 'image_produit.png';
  nom_certificat = 'certificat_produit.pdf';
  Fichier_image: any;
  Fichier_certificat: any;
  Fichier_rfid: any;
  constructor(public dialog: MatDialog, private serviceProduit: ProduitServiceService, private fb: FormBuilder, private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer) {

    this.id_produit = this.route.snapshot.params.id;
    this.Produit();

    this.parDefaut = "-";

    // rfid produit
    this.Rfid_Produit();

    // certificat produit
    this.Certificat_Produit();

    // image produit 
    this.Image_Produit();

    this.Informations_Generales_Form = this.fb.group({

      Nom_Produit: [''],
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

    //liste des ngp
    this.Categorie_Ngp();

    //liste des pays
    this.Categorie_Pays();

    //afficher type 1
    this.Categorie_Type1();


    //liste des unités
    this.Categorie_Unite();

    //liste des tva
    this.Categorie_Tva();

    //liste des fodec
    this.Categorie_Fodec();


  }
  //liste fodec
  Categorie_Fodec() {
    this.serviceProduit.Categorie_Fodec().subscribe((reponse: Response) => {

      this.categorie_fodec = reponse;
    });
  }
  // liste tva
  Categorie_Tva() {
    this.serviceProduit.Categorie_Tva().subscribe((reponse: Response) => {

      this.categorie_tva = reponse;
    });
  }
  // liste unité
  Categorie_Unite() {
    this.serviceProduit.Categorie_Unite().subscribe((reponse: Response) => {

      this.categorie_unite = reponse;
    });
  }
  // liste type 1
  Categorie_Type1() {
    this.serviceProduit.Categorie_Type1().subscribe((reponse: Response) => {

      this.categorie_type1 = reponse;
    });
  }
  // liste type 1
  Categorie_Pays() {
    this.serviceProduit.ListerPays().subscribe((reponse: Response) => {

      this.categorie_pays = reponse;
    });
  }
  //liste des ngp
  Categorie_Ngp() {
    this.serviceProduit.Categorie_Ngp().subscribe((reponse: Response) => {

      this.categorie_ngp = reponse;
    });
  }
  //certificat recupérée de la base
  Certificat_Produit() {

    this.serviceProduit.Certificat_Produit(this.id_produit)
      .subscribe((baseCertificat: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.Fichier_certificat = lecteur.result;
          this.Fichier_certificat = new File([baseCertificat], this.nom_certificat, { type: 'application/pdf' });

        }
        lecteur.readAsDataURL(baseCertificat);
      });
  }
  //rfid recuperé de la base 
  Rfid_Produit() {

    this.serviceProduit.Rfid_Produit(this.id_produit)
      .subscribe((baseRfid: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.Fichier_rfid = lecteur.result;
        }
        lecteur.readAsText(baseRfid);


      });
  }
  //image recuperée de la base 
  Image_Produit() {

    this.serviceProduit.Image_Produit(this.id_produit)
      .subscribe((baseImage: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.Fichier_image = lecteur.result;
          this.Fichier_image_Produit = this.Fichier_image;
          this.Fichier_image = new File([baseImage], this.nom_image, { type: 'image/png' });

        }
        lecteur.readAsDataURL(baseImage);

      });
  }

  afficherCertificat(id): void {

    this.serviceProduit.Certificat_Produit(id).subscribe(resultat => {
      if (resultat.size) {
        const fichierURL = URL.createObjectURL(resultat);

        window.open(fichierURL, '_blank').print();
      } else {
        Swal.fire({
          title: 'Ce produit n' + "'" + 'a pas certificat, voulez-vous ajouter?',

          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, Ajoutez',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {


            Swal.close();



          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
          }



        });
      }
    });

  }

  afficherRfid(id): void {
    this.serviceProduit.Rfid_Produit(id).subscribe(resultat => {
      if (resultat.size) {
        const fichierURL = URL.createObjectURL(resultat);
        window.open(fichierURL, '_blank').print();
      }
      else {
        Swal.fire({
          title: 'Ce produit n' + "'" + 'a pas Rfid, voulez-vous ajouter?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, Ajoutez',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {
            //lorsque la modification est realisé redirection à la page lister-fournisseur
            this.router.navigate(['/Menu/Menu-produit/Modifer-produit/' + id])
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
          }
        });
      }
    })

  }
  afficherImage(id): void {
    const dialogueImage = this.dialog.open(VisualiserImage, {

      data: { id_produit: id }
    });

    dialogueImage.afterClosed().subscribe(result => {


    });
  }
  //afficher type 2 selon type1
  ChoixType1(event: MatSelectChange) {
    this.serviceProduit.Categorie_Type2(event.value).subscribe((reponse: Response) => {

      this.categorie_type2 = reponse;

    });
  }
  //afficher type 3 selon type2
  ChoixType2(event: MatSelectChange) {


    this.serviceProduit.Categorie_Type3(event.value).subscribe((reponse: Response) => {

      this.categorie_famille = reponse;


    });
  }
  //afficher type 4 selon type3
  ChoixType3(event: MatSelectChange) {

    this.serviceProduit.Categorie_Type4(event.value).subscribe((reponse: Response) => {


      this.categorie_sous_famille = reponse;
    });
  }
  //liste des villes par pays
  ChoixPays(event: MatSelectChange) {

    this.serviceProduit.ListerVille(event.value).subscribe((reponse: Response) => {

      this.categorie_ville = reponse;

    });
  }
  //liste des regions par villes
  ChoixVille(event: MatSelectChange) {

    this.serviceProduit.ListerRegion(event.value).subscribe((reponse: Response) => {

      this.categorie_region = reponse;

    });
  }
  Produit(): void {

    this.serviceProduit.Produit(this.id_produit).subscribe((reponse: any) => {
      this.produitData = reponse;

      //afficher type2 selon type1 de la base 
      this.serviceProduit.Categorie_Type2(this.produitData.type1).subscribe((reponse: Response) => {
        this.categorie_type2 = reponse;
      });

      // afficher type3 selon type2 de la base
      this.serviceProduit.Categorie_Type3(this.produitData.type2).subscribe((reponse: Response) => {
        this.categorie_famille = reponse;
      });

      // afficher type4 selon type3 de la base
      this.serviceProduit.Categorie_Type4(this.produitData.famille).subscribe((reponse: Response) => {
        this.categorie_sous_famille = reponse;
      });

      //afficher ville selon pays
      this.serviceProduit.ListerVille(this.produitData.pays).subscribe((reponse: Response) => {
        this.categorie_ville = reponse;
      });

      // afficher liste des regions selon ville
      this.serviceProduit.ListerRegion(this.produitData.ville).subscribe((reponse: Response) => {
        this.categorie_region = reponse;
      });
      // convertir tva à une chaine de caractere
      this.tva = this.produitData.tva.toString();

    }, err => console.error(err),
      () => console.log(this.produitData)

    );
  }
  //fonction activé lors de choix d'une image 
  choixImage() {
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.Fichier_image = lecteur.result;
      this.Fichier_image = btoa(this.Fichier_image);
      this.Fichier_image = atob(this.Fichier_image);
      this.Fichier_image = this.Fichier_image.replace(/^data:image\/[a-z]+;base64,/, "");
      this.Fichier_image = new File([this.produitData.image], this.nom_image, { type: 'image/png' });
    }
    lecteur.readAsDataURL(this.Specifications_Form.get('Image').value);


  }
  //fonction activé lors de choix d'un certificat
  choixCertificat() {

    this.Fichier_certificat = this.Specifications_Form.get('Certificat').value;

  }
  ModifierProduit() {
    var formData: any = new FormData();
    // fichier texte rfid 
    var rfid = this.Specifications_Form.get('Rfid').value;
    var rfid_texte = new Blob([rfid], { type: 'text/plain' });
    formData.append('Id_Produit', this.id_produit);
    formData.append('Nom_Produit', this.Informations_Generales_Form.get('Nom_Produit').value);
    if (this.produitData.marque === '-' && this.Informations_Generales_Form.get('Marque').value === '') {
      formData.append('Marque', '-');
    } else if (this.produitData.marque === 'n') {
      formData.append('Marque', 'n');
    } else formData.append('Marque', this.Informations_Generales_Form.get('Marque').value);
    if (this.produitData.unite === '-' && this.Informations_Generales_Form.get('Unite').value === '') {
      formData.append('Unite', '-');
    } else if (this.produitData.unite === 'n') {
      formData.append('Unite', 'n');
    } else formData.append('Unite', this.Informations_Generales_Form.get('Unite').value);
    if (this.produitData.valeur_Unite === 0 && this.Informations_Generales_Form.get('Valeur_Unite').value === null) {
      formData.append('Valeur_Unite', 0);
    } else if (this.produitData.valeur_Unite === -1) {
      formData.append('Valeur_Unite', -1);
    } else formData.append('Valeur_Unite', this.Informations_Generales_Form.get('Valeur_Unite').value);
    if (this.produitData.type1 === '-' && this.Informations_Generales_Form.get('Type1').value === '') {
      formData.append('Type1', '-');
    } else if (this.produitData.type1 === 'n') {
      formData.append('Type1', 'n');
    } else formData.append('Type1', this.Informations_Generales_Form.get('Type1').value);
    if (this.produitData.type2 === '-' && this.Informations_Generales_Form.get('Type2').value === '') {
      formData.append('Type2', '-');
    } else if (this.produitData.type2 === 'n') {
      formData.append('Type2', 'n');
    } formData.append('Type2', this.Informations_Generales_Form.get('Type2').value);
    if (this.produitData.famille === '-' && this.Informations_Generales_Form.get('Famille').value === '') {
      formData.append('Famille', '-');
    } else if (this.produitData.famille === 'n') {
      formData.append('Famille', 'n');
    } else formData.append('Famille', this.Informations_Generales_Form.get('Famille').value);
    if (this.produitData.sous_Famille === '-' && this.Informations_Generales_Form.get('Sous_Famille').value === '') {
      formData.append('Sous_Famille', '-');
    } else if (this.produitData.sous_Famille === 'n') {
      formData.append('Sous_Famille', 'n');
    } else formData.append('Sous_Famille', this.Informations_Generales_Form.get('Sous_Famille').value);
    if (this.produitData.caracteristique_Technique === '-' && this.Informations_Generales_Form.get('Caracteristique_Technique').value === '') {
      formData.append('Caracteristique_Technique', '-');
    } else if (this.produitData.caracteristique_Technique === 'n') {
      formData.append('Caracteristique_Technique', 'n');
    } else formData.append('Caracteristique_Technique', this.Informations_Generales_Form.get('Caracteristique_Technique').value);
    if (this.produitData.tva === 0) {
      formData.append('Tva', 0);
    } else if (this.produitData.tva === 1 && this.Informations_Generales_Form.get('Tva').value === '-') {
      formData.append('Tva', 1);
    } else formData.append('Tva', this.Informations_Generales_Form.get('Tva').value);
    if (this.produitData.ngp === '-' && this.Informations_Generales_Form.get('Ngp').value === '') {
      formData.append('Ngp', '-');
    } else if (this.produitData.ngp === 'n') {
      formData.append('Ngp', 'n');
    } else formData.append('Ngp', this.Informations_Generales_Form.get('Ngp').value);
    if (this.produitData.code_Barre === '-' && this.Informations_Generales_Form.get('Code_Barre').value === '') {
      formData.append('Code_Barre', '-');
    } else if (this.produitData.code_Barre === 'n') {
      formData.append('Code_Barre', 'n');
    } else formData.append('Code_Barre', this.Informations_Generales_Form.get('Code_Barre').value);
    if (this.produitData.fodec === '-' && this.Informations_Generales_Form.get('Fodec').value === '') {
      formData.append('Fodec', '-');
    } else if (this.produitData.fodec === 'n') {
      formData.append('Fodec', 'n');
    } else formData.append('Fodec', this.Informations_Generales_Form.get('Fodec').value);
    if (this.produitData.source === '-' && this.Specifications_Form.get('Source').value === '') {
      formData.append('Source', '-');
    } else if (this.produitData.source === 'n') {
      formData.append('Source', 'n');
    } else formData.append('Source', this.Specifications_Form.get('Source').value);
    if (this.produitData.pays === '-' && this.Specifications_Form.get('Pays').value === '') {
      formData.append('Pays', '-');
    } else if (this.produitData.pays === 'n') {
      formData.append('Pays', 'n');
    } else formData.append('Pays', this.Specifications_Form.get('Pays').value);
    if (this.produitData.ville === '-' && this.Specifications_Form.get('Ville').value === '') {
      formData.append('Ville', '-');
    } else if (this.produitData.ville === 'n') {
      formData.append('Ville', 'n');
    } else formData.append('Ville', this.Specifications_Form.get('Ville').value);
    if (this.produitData.region === '-' && this.Specifications_Form.get('Region').value === '') {
      formData.append('Region', '-');
    } else if (this.produitData.region === 'n') {
      formData.append('Region', 'n');
    } else formData.append('Region', this.Specifications_Form.get('Region').value);
    if (this.produitData.saison === '-' && this.Specifications_Form.get('Saison').value === '') {
      formData.append('Saison', '-');
    } else if (this.produitData.saison === 'n') {
      formData.append('Saison', 'n');
    } else formData.append('Saison', this.Specifications_Form.get('Saison').value);
    if (this.produitData.n_Imei === '-' && this.Specifications_Form.get('N_Imei').value === null) {
      formData.append('N_Imei', '-');
    } else if (this.produitData.n_Imei === 'n') {
      formData.append('N_Imei', 'n');
    } else formData.append('N_Imei', this.Specifications_Form.get('N_Imei').value);
    if (this.produitData.n_Imei2 === '-' && this.Specifications_Form.get('N_Imei2').value === null) {
      formData.append('N_Imei2', '-');
    } else if (this.produitData.n_Imei2 === 'n') {
      formData.append('N_Imei2', 'n');
    } else formData.append('N_Imei2', this.Specifications_Form.get('N_Imei2').value);
    if (this.produitData.n_Lot === '-' && this.Specifications_Form.get('N_Lot').value === null) {
      formData.append('N_Lot', '-');
    } else if (this.produitData.n_Lot === 'n') {
      formData.append('N_Lot', 'n');
    } else formData.append('N_Lot', this.Specifications_Form.get('N_Lot').value);
    if (this.produitData.temperature_Max === 1111 && this.Specifications_Form.get('Temperature_Max').value === null) {
      formData.append('Temperature_Max', 1111);
    } else if (this.produitData.temperature_Max === 9999) {
      formData.append('Temperature_Max', 9999);
    } else formData.append('Temperature_Max', this.Specifications_Form.get('Temperature_Max').value);
    if (this.produitData.temperature_Min === 1111 && this.Specifications_Form.get('Temperature_Min').value === null) {
      formData.append('Temperature_Min', 1111);
    } else if (this.produitData.temperature_Min === 9999) {
      formData.append('Temperature_Min', 9999);
    } else formData.append('Temperature_Min', this.Specifications_Form.get('Temperature_Min').value);
    if (this.produitData.date_Fabrication === '1900-02-01T23:50:39.000+00000') {
      if (this.Specifications_Form.get('Date_Fabrication').value === false) {
        formData.append('Date_Fabrication', '02/01/1900');
      }
      else formData.append('Date_Fabrication', '01/01/1900');
    } else if (this.produitData.date_Fabrication === '1900-03-01T23:50:39.000+0000') {
      formData.append('Date_Fabrication', '03/01/1900');
    } else if (this.produitData.date_Fabrication === '1900-01-01T23:50:39.000+0000') {
      if (this.Specifications_Form.get('Date_Fabrication').value === false) {
        formData.append('Date_Fabrication', '02/01/1900');
      }
    }
    else formData.append('Date_Fabrication', '01/01/1900');
    if (this.produitData.date_Validite === '1900-02-01T23:50:39.000+00000') {
      if (this.Specifications_Form.get('Date_Validite').value === false) {
        formData.append('Date_Validite', '02/01/1900');
      }
      else formData.append('Date_Validite', '01/01/1900');
    } else if (this.produitData.date_Validite === '1900-03-01T23:50:39.000+0000') {
      formData.append('Date_Validite', '03/01/1900');
    } else if (this.produitData.date_Validite === '1900-01-01T23:50:39.000+0000') {
      if (this.Specifications_Form.get('Date_Validite').value === false) {
        formData.append('Date_Validite', '02/01/1900');
      }
    }
    else formData.append('Date_Validite', '01/01/1900');
    if (this.produitData.n_Serie === '-' && this.Specifications_Form.get('N_Serie').value === null) {
      formData.append('N_Serie', '-');
    } else if (this.produitData.n_Serie === 'n') {
      formData.append('N_Serie', 'n');
    } else formData.append('N_Serie', this.Specifications_Form.get('N_Serie').value);
    if (this.produitData.couleur === '-' && this.Specifications_Form.get('Couleur').value === null) {
      formData.append('Couleur', '-');
    } else if (this.produitData.couleur === 'n') {
      formData.append('Couleur', 'n');
    } else formData.append('Couleur', this.Specifications_Form.get('Couleur').value);
    if (this.produitData.taille === '-' && this.Specifications_Form.get('Taille').value === null) {
      formData.append('Taille', '-');
    } else if (this.produitData.taille === 'n') {
      formData.append('Taille', 'n');
    } else formData.append('Taille', this.Specifications_Form.get('Taille').value);
    if (this.produitData.role === '-' && this.Specifications_Form.get('Role').value === null) {
      formData.append('Role', '-');
    } else if (this.produitData.role === 'n') {
      formData.append('Role', 'n');
    } else formData.append('Role', this.Specifications_Form.get('Role').value);
    formData.append('Rfid', rfid_texte);
    formData.append('Image', this.Fichier_image);
    formData.append('Certificat', this.Fichier_certificat);

    //demande de confirmation de la modification
    Swal.fire({
      title: 'Êtes-vous sûr?',

      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, modifiez-le',
      cancelButtonText: 'Non'
    }).then((result) => {
      if (result.value) {
        this.serviceProduit.ModifierProduit(formData).subscribe(data => {
          //lorsque la modification est realisé redirection à la page lister-fournisseur
          this.router.navigate(['/Menu/Menu-produit/Lister-produit'])
          Swal.fire(
            'Produit modifié avec succés!',
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
        this.router.navigate(['/Menu/Menu-produit/Lister-produit'])
      }
    })
  }

  ngOnInit(): void {

  }
}

@Component({
  selector: 'visualiser-image',
  templateUrl: 'visualiser-image.html',
})
export class VisualiserImage {
  photo: any;

  constructor(private serviceProduit: ProduitServiceService, private fb: FormBuilder, private router: Router,
    public dialogueImage: MatDialogRef<VisualiserImage>,
    @Inject(MAT_DIALOG_DATA) public data: any) {

    this.serviceProduit.Image_Produit(data.id_produit)
      .subscribe((baseImage: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.photo = lecteur.result;

        }
        lecteur.readAsDataURL(baseImage);

      });


  }
  Fermer(): void {
    this.dialogueImage.close();
  }
}