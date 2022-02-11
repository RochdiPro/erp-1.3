import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import { ProduitServiceService } from '../Service/produit-service.service';
import pdfMake from "pdfmake/build/pdfmake";
import pdfFonts from "pdfmake/build/vfs_fonts";
import { HttpClient } from '@angular/common/http';
import Swal from 'sweetalert2';
pdfMake.vfs = pdfFonts.pdfMake.vfs;
@Component({
  selector: 'app-ajout-produit-personnaliser',
  templateUrl: './ajout-produit-personnaliser.component.html',
  styleUrls: ['./ajout-produit-personnaliser.component.scss']
})
export class AjoutProduitPersonnaliserComponent implements OnInit {
  image_par_defaut_blob: any;
  imageSrc: any;
  //prevention de passage au step 2 sans remplissage de step1
  isLinear = true;
  disabled = true;
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
  Informations_Generales_Form: FormGroup;
  Specifications_Form: FormGroup;
  Recapitulation_Form: FormGroup;
  checked = true;
  industriel: boolean;
  Produit_Serie: boolean;
  G4: boolean;
  Produit_frais: boolean;
  Temperature: false;
  image: any;
  N_Imei_Cocher = true;
  N_Imei2_Cocher = true;
  N_Serie_Cocher = true;
  N_Lot_Cocher = true;
  Date_Fabrication_Cocher = true;
  Date_Validite_Cocher = true;
  modele_produit: any;
  modeleSrc: any;

  constructor(private http: HttpClient, private serviceProduit: ProduitServiceService, private fb: FormBuilder) {
    this.chargementImage();
    this.sansChoixImage();
    this.chargementModeleImage();
    this.modelPdfBase64();
    this.Informations_Generales_Form = this.fb.group({
      industriel: false,
      Produit_Serie: false,
      G4: false,
      Produit_frais: false,
      Temperature: false,
      Nom_Produit: ['', [Validators.required]],
      Marque: [''],
      Type1: [''],
      Type2: [''],
      Famille: [''],
      Sous_Famille: [''],
      Tva: [],
      Ngp: [''],
      Caracteristique_Technique: [''],

    });
    this.Specifications_Form = this.fb.group({
      Image: [''],
      Certificat: [''],
      Rfid: [''],
      Unite: [''],
      Valeur_Unite: [],
      Code_Barre: [''],
      Fodec: [''],
      Source: [''],
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
    this.Recapitulation_Form = this.fb.group({});
    //liste des ngp
    this.serviceProduit.Categorie_Ngp().subscribe((reponse: Response) => {
      this.categorie_ngp = reponse;
    });
    //liste des pays
    this.serviceProduit.ListerPays().subscribe((reponse: Response) => {
      this.categorie_pays = reponse;
    });
    //afficher type 1
    this.serviceProduit.Categorie_Type1().subscribe((reponse: Response) => {
      this.categorie_type1 = reponse;
    });
    //liste des unités
    this.serviceProduit.Categorie_Unite().subscribe((reponse: Response) => {
      this.categorie_unite = reponse;
    });
    this.serviceProduit.Categorie_Tva().subscribe((reponse: Response) => {
      this.categorie_tva = reponse;
    });
    this.serviceProduit.Categorie_Fodec().subscribe((reponse: Response) => {
      this.categorie_fodec = reponse;
    });
  }
  //afficher type 2 selon type1 choisis lors de la modification
  ChoixType1(event: MatSelectChange) {
    this.serviceProduit.Categorie_Type2(event.value).subscribe((reponse: Response) => {
      this.categorie_type2 = reponse;
    });
  }
  //afficher type 3 selon type2 choisis lors de la modification
  ChoixType2(event: MatSelectChange) {
    this.serviceProduit.Categorie_Type3(event.value).subscribe((reponse: Response) => {
      this.categorie_famille = reponse;
    });
  }
  //afficher type 4 selon type3 choisis lors de la modification
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
  ngOnInit(): void {
  }
  // creation du produit
  creerProduit() {
    //image par defaut du produit
    const nom_image_par_defaut = 'image_par_defaut.png';
    const Fichier_image_par_defaut = new File([this.image_par_defaut_blob], nom_image_par_defaut, { type: 'image/png' });
    //pdf par defaut
    const pdf__par_defaut_base64 = '';
    const nom_pdf_par_defaut = 'pdf_par_defaut.pdf';
    const pdfBlobDefaut = this.ConvertirURIAuBlob(pdf__par_defaut_base64);
    const Fichier_pdf_par_defaut = new File([pdfBlobDefaut], nom_pdf_par_defaut, { type: 'application/pdf' });
    // txt rfid 
    var rfid = this.Specifications_Form.get('Rfid').value;
    var rfid_texte = new Blob([rfid], { type: 'text/plain' });

    var formData: any = new FormData();
    formData.append('Nom_Produit', this.Informations_Generales_Form.get('Nom_Produit').value);
    if (this.Informations_Generales_Form.get('Marque').value === '') {
      formData.append('Marque', '-');
    } else formData.append('Marque', this.Informations_Generales_Form.get('Marque').value);
    if (this.Specifications_Form.get('Unite').value === '') {
      formData.append('Unite', '-');
    } else formData.append('Unite', this.Specifications_Form.get('Unite').value);
    if (this.Specifications_Form.get('Valeur_Unite').value === null) {
      formData.append('Valeur_Unite', 0);
    } else formData.append('Valeur_Unite', this.Specifications_Form.get('Valeur_Unite').value);
    if (this.Informations_Generales_Form.get('Type1').value === '') {
      formData.append('Type1', '-');
    } else formData.append('Type1', this.Informations_Generales_Form.get('Type1').value);
    if (this.Informations_Generales_Form.get('Type2').value === '') {
      formData.append('Type2', '-');
    } else formData.append('Type2', this.Informations_Generales_Form.get('Type2').value);
    if (this.Informations_Generales_Form.get('Famille').value === '') {
      formData.append('Famille', '-');
    } else formData.append('Famille', this.Informations_Generales_Form.get('Famille').value);
    if (this.Informations_Generales_Form.get('Sous_Famille').value === '') {
      formData.append('Sous_Famille', '-');
    } else formData.append('Sous_Famille', this.Informations_Generales_Form.get('Sous_Famille').value);
    if (this.Informations_Generales_Form.get('Caracteristique_Technique').value === '') {
      formData.append('Caracteristique_Technique', '-');
    } else formData.append('Caracteristique_Technique', this.Informations_Generales_Form.get('Caracteristique_Technique').value);
    if (this.Informations_Generales_Form.get('Tva').value === null) {
      formData.append('Tva', 1);
    } else formData.append('Tva', this.Informations_Generales_Form.get('Tva').value);
    if (this.Informations_Generales_Form.get('Ngp').value === '') {
      formData.append('Ngp', '-');
    } else formData.append('Ngp', this.Informations_Generales_Form.get('Ngp').value);
    if (this.Specifications_Form.get('Code_Barre').value === '') {
      formData.append('Code_Barre', '-');
    } else formData.append('Code_Barre', this.Specifications_Form.get('Code_Barre').value);
    if (this.Specifications_Form.get('Fodec').value === '') {
      formData.append('Fodec', 'Sans_Fodec');
    } else formData.append('Fodec', this.Specifications_Form.get('Fodec').value);
    if (this.Specifications_Form.get('Source').value === '') {
      formData.append('Source', '-');
    } else formData.append('Source', this.Specifications_Form.get('Source').value);
    if (this.Specifications_Form.get('Pays').value === '') {
      formData.append('Pays', '-');
    } else formData.append('Pays', this.Specifications_Form.get('Pays').value);
    if (this.Specifications_Form.get('Ville').value === '') {
      formData.append('Ville', '-');
    } else formData.append('Ville', this.Specifications_Form.get('Ville').value);
    if (this.Produit_frais) {
      if (this.Specifications_Form.get('Region').value === '') {
        formData.append('Region', '-');
      } else formData.append('Region', this.Specifications_Form.get('Region').value);
    }
    else formData.append('Region', 'n');
    if (this.Produit_frais) {
      if (this.Specifications_Form.get('Saison').value === '') {
        formData.append('Saison', '-');
      } else formData.append('Saison', this.Specifications_Form.get('Saison').value);
    }
    else formData.append('Saison', 'n');
    if (this.G4) {
      if (this.Specifications_Form.get('N_Imei').value === null) {
        formData.append('N_Imei', '-');
      } else formData.append('N_Imei', this.Specifications_Form.get('N_Imei').value);
    } else formData.append('N_Imei', 'n');
    if (this.G4) {
      if (this.Specifications_Form.get('N_Imei2').value === null) {
        formData.append('N_Imei2', '-');
      } else formData.append('N_Imei2', this.Specifications_Form.get('N_Imei2').value);
    } else formData.append('N_Imei2', 'n');
    if (this.G4 || this.Produit_Serie) {
      if (this.Specifications_Form.get('N_Serie').value === null) {
        formData.append('N_Serie', '-');
      } else formData.append('N_Serie', this.Specifications_Form.get('N_Serie').value);
    } else formData.append('N_Serie', 'n');
    if (this.Temperature || this.Produit_frais) {
      if (this.Specifications_Form.get('Temperature_Max').value === null) {
        formData.append('Temperature_Max', 1111);
      } else formData.append('Temperature_Max', this.Specifications_Form.get('Temperature_Max').value);
    } else formData.append('Temperature_Max', 9999);
    if (this.Temperature || this.Produit_frais) {
      if (this.Specifications_Form.get('Temperature_Min').value === null) {
        formData.append('Temperature_Min', 1111);
      } else formData.append('Temperature_Min', this.Specifications_Form.get('Temperature_Min').value);
    } else formData.append('Temperature_Min', 9999);
    if (this.industriel || this.Produit_frais) {
      if (this.Specifications_Form.get('Date_Fabrication').value === false) {
        formData.append('Date_Fabrication', '02/01/1900');
      } else formData.append('Date_Fabrication', '01/01/1900');
    } else formData.append('Date_Fabrication', '03/01/1900');
    if (this.industriel || this.Produit_frais) {
      if (this.Specifications_Form.get('Date_Validite').value === false) {
        formData.append('Date_Validite', '02/01/1900');
      } else formData.append('Date_Validite', '01/01/1900');
    } else formData.append('Date_Validite', '03/01/1900');
    if (this.industriel) {
      if (this.Specifications_Form.get('N_Lot').value === null) {
        formData.append('N_Lot', '-');
      } else formData.append('N_Lot', this.Specifications_Form.get('N_Lot').value);
    } else formData.append('N_Lot', 'n');
    if (this.Specifications_Form.get('Couleur').value === '') {
      formData.append('Couleur', '-');
    } else formData.append('Couleur', this.Specifications_Form.get('Couleur').value);
    if (this.Specifications_Form.get('Taille').value === '') {
      formData.append('Taille', '-');
    } else formData.append('Taille', this.Specifications_Form.get('Taille').value);
    if (this.Specifications_Form.get('Role').value === '') {
      formData.append('Role', '-');
    } else formData.append('Role', this.Specifications_Form.get('Role').value);
    if (this.Specifications_Form.get('Certificat').value === '') {
      formData.append('Certificat', Fichier_pdf_par_defaut);
    } else formData.append('Certificat', this.Specifications_Form.get('Certificat').value);
    if (this.Specifications_Form.get('Image').value === '') {
      formData.append('Image', Fichier_image_par_defaut);
    } else formData.append('Image', this.Specifications_Form.get('Image').value);
    formData.append('Rfid', rfid_texte);

    this.serviceProduit.ajouterProduit(formData).subscribe(response => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'Produit ajouté avec succés',
        showConfirmButton: false,
        timer: 1500
      })
      return response;
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

  //convertir chemin d'image au blob
  ConvertirURIAuBlob(dataURI) {
    const chaine_octet = window.atob(dataURI);
    const tableau_d_octet = new ArrayBuffer(chaine_octet.length);
    const int8Array = new Uint8Array(tableau_d_octet);
    for (let i = 0; i < chaine_octet.length; i++) {
      int8Array[i] = chaine_octet.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: 'image/png' });
    return blob;
  }
  genererPdfProduit() {
    var tva_pdf, marque_pdf, unite_pdf, valeur_Unite_pdf, type1_pdf, type2_pdf, famille_pdf, sous_famille_pdf, caracteristique_Technique_pdf, code_barre_pdf, fodec_pdf, source_pdf, pays_pdf, ville_pdf, region_pdf, couleur_pdf, taille_pdf, role_pdf;

    if (this.Specifications_Form.get('Role').value === '') {
      role_pdf = " -"
    } else role_pdf = this.Specifications_Form.get('Role').value;
    if (this.Specifications_Form.get('Taille').value === '') {
      taille_pdf = " -"
    } else taille_pdf = this.Specifications_Form.get('Taille').value;
    if (this.Specifications_Form.get('Couleur').value === '') {
      couleur_pdf = " -"
    } else couleur_pdf = this.Specifications_Form.get('Couleur').value;
    if (this.Specifications_Form.get('Pays').value === '') {
      pays_pdf = " -"
    } else pays_pdf = this.Specifications_Form.get('Pays').value;
    if (this.Specifications_Form.get('Ville').value === '') {
      ville_pdf = " -"
    } else ville_pdf = this.Specifications_Form.get('Ville').value;
    if (this.Specifications_Form.get('Region').value === null) {
      region_pdf = " -"
    } else region_pdf = this.Specifications_Form.get('Region').value;
    if (this.Specifications_Form.get('Source').value === '') {
      source_pdf = " -"
    } else source_pdf = this.Specifications_Form.get('Source').value;
    if (this.Specifications_Form.get('Fodec').value === '') {
      fodec_pdf = " -"
    } else fodec_pdf = this.Specifications_Form.get('Fodec').value;
    if (this.Specifications_Form.get('Code_Barre').value === '') {
      code_barre_pdf = " -"
    } else code_barre_pdf = this.Specifications_Form.get('Code_Barre').value;

    if (this.Informations_Generales_Form.get('Tva').value === null) {
      tva_pdf = " -"
    } else tva_pdf = this.Informations_Generales_Form.get('Tva').value;
    if (this.Informations_Generales_Form.get('Marque').value === '') {
      marque_pdf = " -"
    } else marque_pdf = this.Informations_Generales_Form.get('Marque').value;
    if (this.Specifications_Form.get('Unite').value === '') {
      unite_pdf = " -"
    } else unite_pdf = this.Specifications_Form.get('Unite').value;
    if (this.Specifications_Form.get('Valeur_Unite').value === null) {
      valeur_Unite_pdf = " -"
    } else valeur_Unite_pdf = this.Specifications_Form.get('Valeur_Unite').value;
    if (this.Informations_Generales_Form.get('Type1').value === '') {
      type1_pdf = " -"
    } else type1_pdf = this.Informations_Generales_Form.get('Type1').value;
    if (this.Informations_Generales_Form.get('Type2').value === '') {
      type2_pdf = " -"
    } else type2_pdf = this.Informations_Generales_Form.get('Type2').value;
    if (this.Informations_Generales_Form.get('Famille').value === '') {
      famille_pdf = " -"
    } else famille_pdf = this.Informations_Generales_Form.get('Famille').value;
    if (this.Informations_Generales_Form.get('Sous_Famille').value === '') {
      sous_famille_pdf = " -"
    } else sous_famille_pdf = this.Informations_Generales_Form.get('Sous_Famille').value;
    if (this.Informations_Generales_Form.get('Caracteristique_Technique').value === '') {
      caracteristique_Technique_pdf = " -"
    } else caracteristique_Technique_pdf = this.Informations_Generales_Form.get('Caracteristique_Technique').value;

    if (this.Specifications_Form.get('Image').value === '') {
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

      pageMargins: [40, 125, 40, 70],
      background: [
        {
          image: 'data:image/jpeg;base64,' + this.modeleSrc, width: 600

        }
      ],
      content: [
        {
          columns: [

            {

              image: 'data:image/jpeg;base64,' + this.imageSrc,
              width: 150,
              height: 170
            },
            {
              width: '80%',
              text: 'Désignation du produit : ' + this.Informations_Generales_Form.get('Nom_Produit').value + '\n\n' +
                'Marque : ' + marque_pdf + '\n\n' + 'Tva : ' +
                tva_pdf + '\n\n' + 'Unité : ' + unite_pdf + '\t' + 'Valeur par unité : ' + valeur_Unite_pdf + '\n\n' + 'Code à barre : ' + code_barre_pdf


            },


          ], columnGap: 50,

        },
        {
          columns: [

            {


              width: '50%',
              text: '\n\n' + 'Type du produit : ' + type1_pdf +

                '\n\n' + 'Famille du produit : ' + famille_pdf + '\n\n' + 'Role du produit : ' + role_pdf
                + '\n\n' + 'Pays du produit : ' + pays_pdf + '\n\n' + 'Region du produit : ' + region_pdf
                + '\n\n' + 'Couleur du produit : ' + couleur_pdf
            },
            {
              width: '50%',
              text: '\n\n' + 'Sous-Type du produit : ' + type2_pdf + '\n\n' + 'Sous-Famille du produit : ' + sous_famille_pdf + '\n\n' + 'Fodec du produit : ' + fodec_pdf
                + '\n\n' + 'Source du produit : ' + source_pdf + '\n\n' + 'Ville du produit : ' + ville_pdf + '\n\n' + 'Taille du produit : ' + taille_pdf
            },

          ], columnGap: 20,

        },
        {
          text: '\n\n' + 'Caracteristiques techniques : ' + caracteristique_Technique_pdf
        }
      ]
    };

    pdfMake.createPdf(dd).open();


  }

  // message d'erreur lorsque la certificat saisi ne respecte pas les conditions prédifinis
  MessageErreurCertificat() {
    if (this.Specifications_Form.get('Certificat').hasError('required')) {
      return 'Vous devez choisir une  Certificat!';
    }
  }
  // message d'erreur lorsque l'image saisi ne respecte pas les conditions prédifinis
  MessageErreurImage() {
    if (this.Specifications_Form.get('Image').hasError('required')) {
      return 'Vous devez choisir une  image!';
    }
  }
  // message d'erreur lorsque rfid saisi ne respecte pas les conditions prédifinis
  MessageErreurRfid() {
    if (this.Specifications_Form.get('Rfid').hasError('required')) {
      return 'Vous devez choisir Rfid!';
    }
  }
  // message d'erreur lorsque la Temperature_Max saisi ne respecte pas les conditions prédifinis
  MessageErreurTemperature_Min() {
    if (this.Specifications_Form.get('Temperature_Min').hasError('required')) {
      return 'Vous devez saisir une  Temperature minimale!';
    }
  }
  // message d'erreur lorsque la Temperature_Max saisi ne respecte pas les conditions prédifinis
  MessageErreurTemperature_Max() {
    if (this.Specifications_Form.get('Temperature_Max').hasError('required')) {
      return 'Vous devez saisir une  Temperature maximale!';
    }
  }
  // message d'erreur lorsque la taille saisi ne respecte pas les conditions prédifinis
  MessageErreurTaille() {
    if (this.Specifications_Form.get('Taille').hasError('required')) {
      return 'Vous devez saisir une  taille!';
    }
  }
  // message d'erreur lorsque la couleur saisi ne respecte pas les conditions prédifinis
  MessageErreurCouleur() {
    if (this.Specifications_Form.get('Couleur').hasError('required')) {
      return 'Vous devez saisir une  couleur!';
    }
  }
  // message d'erreur lorsque le role saisi ne respecte pas les conditions prédifinis
  MessageErreurRole() {
    if (this.Specifications_Form.get('Role').hasError('required')) {
      return 'Vous devez saisir un role!';
    }
  }
  // message d'erreur lorsque le saison saisi ne respecte pas les conditions prédifinis
  MessageErreurSaison() {
    if (this.Specifications_Form.get('Saison').hasError('required')) {
      return 'Vous devez choisir un saison!';
    }
  }
  // message d'erreur lorsque la source saisi ne respecte pas les conditions prédifinis
  MessageErreurSource() {
    if (this.Specifications_Form.get('Source').hasError('required')) {
      return 'Vous devez saisir une  source!';
    }
  }
  MessageErreurNomProduit() {
    if (this.Informations_Generales_Form.get('Nom_Produit').hasError('required')) {
      return 'Vous devez entrer le nom du produit!';
    }
  }
  // message d'erreur lorsque la marque saisi ne respecte pas les conditions prédifinis
  MessageErreurMarque() {
    if (this.Informations_Generales_Form.get('Marque').hasError('required')) {
      return 'Vous devez saisir une  Marque!';
    }
  }
  // message d'erreur lorsque l'unitée saisie ne respecte pas les conditions prédifinis
  MessageErreurUnite() {
    if (this.Informations_Generales_Form.get('Unite').hasError('required')) {
      return 'Vous devez choisir une  Unite!';
    }
  }
  // message d'erreur lorsque la valeur saisie ne respecte pas les conditions prédifinis
  MessageErreurValeurUnite() {
    if (this.Informations_Generales_Form.get('Valeur_Unite').hasError('required')) {
      return 'Vous devez saisir une  valeur ';
    }
  }
  // message d'erreur lorsque type ne respecte pas les conditions prédifinis
  MessageErreurType1() {
    if (this.Informations_Generales_Form.get('Type1').hasError('required')) {
      return 'Vous devez choisir un  Type ';
    }
  }
  // message d'erreur lorsque type ne respecte pas les conditions prédifinis
  MessageErreurType2() {
    if (this.Informations_Generales_Form.get('Type2').hasError('required')) {
      return 'Vous devez choisir un  Type ';
    }
  }
  // message d'erreur lorsque famille ne respecte pas les conditions prédifinis
  MessageErreurFamille() {
    if (this.Informations_Generales_Form.get('Famille').hasError('required')) {
      return 'Vous devez choisir une  Famille ';
    }
  }
  // message d'erreur lorsque sous famille ne respecte pas les conditions prédifinis
  MessageErreurSous_Famille() {
    if (this.Informations_Generales_Form.get('Sous_Famille').hasError('required')) {
      return 'Vous devez choisir une  Sous Famille ';
    }
  }
  // message d'erreur lorsque Code_Barre ne respecte pas les conditions prédifinis
  MessageErreurCode_Barre() {
    if (this.Informations_Generales_Form.get('Code_Barre').hasError('required')) {
      return 'Vous devez saisir une  Code à Barre ';
    }
  }
  // message d'erreur lorsque Ngp ne respecte pas les conditions prédifinis
  MessageErreurNgp() {
    if (this.Informations_Generales_Form.get('Ngp').hasError('required')) {
      return 'Vous devez choisir un Ngp ';
    }
  }
  // message d'erreur lorsque Fodec ne respecte pas les conditions prédifinis
  MessageErreurFodec() {
    if (this.Informations_Generales_Form.get('Fodec').hasError('required')) {
      return 'Vous devez choisir un Fodec ';
    }
  }
  // message d'erreur lorsque Tva ne respecte pas les conditions prédifinis
  MessageErreurTva() {
    if (this.Informations_Generales_Form.get('Tva').hasError('required')) {
      return 'Vous devez choisir un Tva ';
    }
  }
  // message d'erreur lorsque caracteristique ne respecte pas les conditions prédifinis
  MessageErreurCaracteristique_Technique() {
    if (this.Informations_Generales_Form.get('Caracteristique_Technique').hasError('required')) {
      return 'Vous devez saisir un Caracteristique Technique ';
    }
  }
  // message d'erreur lorsque pays saisi ne respecte pas les conditions prédifinis
  MessageErreurPays() {
    if (this.Specifications_Form.get('Pays').hasError('required')) {
      return 'Vous devez choisir un  Pays!';
    }
  }
  // message d'erreur lorsque pays saisi ne respecte pas les conditions prédifinis
  MessageErreurVille() {
    if (this.Specifications_Form.get('Ville').hasError('required')) {
      return 'Vous devez choisir un  Ville!';
    }
  }
  // message d'erreur lorsque pays saisi ne respecte pas les conditions prédifinis
  MessageErreurRegion() {
    if (this.Specifications_Form.get('Region').hasError('required')) {
      return 'Vous devez choisir un  Region!';
    }
  }
  delai(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  //definir image par defaut pour pdf 
  async sansChoixImage() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.imageSrc = lecteur.result;
      this.imageSrc = btoa(this.imageSrc);
      this.imageSrc = atob(this.imageSrc);
      this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.image_par_defaut_blob);

  }
  //definir model pour pdf 
  async modelPdfBase64() {
    await this.delai(4000);
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.modeleSrc = lecteur.result;
      this.modeleSrc = btoa(this.modeleSrc);
      this.modeleSrc = atob(this.modeleSrc);
      this.modeleSrc = this.modeleSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.modele_produit);
  }
  async chargementModeleImage() {
    this.http.get('.././assets/images/template_produit.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.modele_produit = reponse;
      return this.modele_produit;

    }, err => console.error(err),
      () => console.log(this.modele_produit))
  }
  async chargementImage() {


    this.http.get('.././assets/images/image_par_defaut.jpg', { responseType: 'blob' }).subscribe((reponse: any) => {
      this.image_par_defaut_blob = reponse;
      return this.image_par_defaut_blob;

    }, err => console.error(err),
      () => console.log(this.image_par_defaut_blob))



  }
  //fonction activé lors de choix d'une image pour la convertir en base 64
  choixImage() {
    const lecteur = new FileReader();
    lecteur.onloadend = () => {
      this.imageSrc = lecteur.result;
      this.imageSrc = btoa(this.imageSrc);

      this.imageSrc = atob(this.imageSrc);
      this.imageSrc = this.imageSrc.replace(/^data:image\/[a-z]+;base64,/, "");
    }
    lecteur.readAsDataURL(this.Specifications_Form.get('Image').value);
  }
}
