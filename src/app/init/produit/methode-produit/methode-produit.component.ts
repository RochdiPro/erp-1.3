import { Component, Inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProduitServiceService } from '../Service/produit-service.service';
import { MatSelectChange } from '@angular/material/select';
import { FormBuilder, FormGroup } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-methode-produit',
  templateUrl: './methode-produit.component.html',
  styleUrls: ['./methode-produit.component.scss']
})
export class MethodeProduitComponent implements OnInit {
 
  constructor(private router: Router, public dialog: MatDialog) {

  }
  /*Standard() {
    //Ajouter-produit-standard
    this.router.navigate(['Menu/Menu-produit/Ajouter-produit-standard'])
  }*/

  //Ajouter-produit-personnaliser
  Personnaliser() {
    this.router.navigate(['/Menu/Menu-init/Menu-produit/Ajouter-produit-personnaliser'])

  }
  choisirContraintes(): void {
    const dialogueChoixContraintes = this.dialog.open(DialogCreationContraintes, {
      width: '1100px',
    
    });

    dialogueChoixContraintes.afterClosed().subscribe(result => {


    });

  }


  ngOnInit(): void {
  }

}
@Component({
  selector: 'dialog-creation-contraintes',
  templateUrl: 'dialog-creation-contraintes.html',
})


export class DialogCreationContraintes {
  contrainte: any;
  ChoixContrainte = false;
  id_Contrainte: any;
  liste_contraintes: any;
  desactiver = true;
  contraintes_Form: FormGroup;
  liste_contraintes_Form: FormGroup;
  creer_contraintes = false;
  boutonActiver = true;
  reponseAjout: any;
  etat_sous_famille = false;
  etat_famille = false;
  etat_type2 = false;
  etat_type1 = false;
  etat_region = false;
  etat_ville = false;
  checked = true;
  valeursInitiales: any;
  constructor(private serviceProduit: ProduitServiceService, private fb: FormBuilder, private router: Router,
    public dialogueContraintes: MatDialogRef<DialogCreationContraintes>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.Liste_Contraintes();
    this.liste_contraintes_Form = this.fb.group({
      liste_Contraintes: ['']
    });

    this.contraintes_Form = this.fb.group({
      Code_Barre: [false],
      Source: [false],
      Nom_Produit: [true],
      Type1: [false],
      Type2: [false],
      Famille: [false],
      Sous_Famille: [false],
      Unite: [false],
      Valeur_Unite: [false],
      Ngp: [false],
      Rfid: [false],
      Caracteristique_Technique: [false],
      Marque: [false],
      Src_Img: [false],
      Pays: [false],
      Ville: [false],
      N_Imei: [false],
      N_Imei2: [false],
      Temperature_Max: [false],
      Temperature_Min: [false],
      N_Lot: [false],
      Date_Fabrication: [false],
      Date_Validite: [false],
      Saison: [false],
      Region: [false],
      N_Serie: [false],
      Couleur: [false],
      Taille: [false],
      Role: [false],
      Tva: [false],
      Fodec: [false],
      Certificat: [false],
      Nom_Contrainte: ['']
    });
    this.valeursInitiales = this.contraintes_Form.value;
  }
  // detecter changement etat  Sous_famille lors de creation de contraintes
  Sous_famille_cocher(event: any) {
    if (event == 'sous_famille_cocher') {
      this.contraintes_Form.get('Famille').setValue(true);
      this.contraintes_Form.controls.Famille.disable();
      this.contraintes_Form.get('Type2').setValue(true);
      this.contraintes_Form.controls.Type2.disable();
      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();

    } else {
      this.contraintes_Form.get('Famille').setValue(false);
      this.contraintes_Form.controls.Famille.enable();
      this.contraintes_Form.get('Type2').setValue(false);
      this.contraintes_Form.controls.Type2.enable();
      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }

  }
  // detecter changement etat  Sous_famille lors de modification de contraintes
  Sous_famille_cocher_modif(event: any) {
    if (event == true) {
      this.contraintes_Form.get('Famille').setValue(true);
      this.contraintes_Form.controls.Famille.disable();
      this.contraintes_Form.get('Type2').setValue(true);
      this.contraintes_Form.controls.Type2.disable();
      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();

    } else {
      this.contraintes_Form.get('Famille').setValue(false);
      this.contraintes_Form.controls.Famille.enable();
      this.contraintes_Form.get('Type2').setValue(false);
      this.contraintes_Form.controls.Type2.enable();
      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }

  }
  // detecter changement etat famille lors de creation de contraintes
  Famille_cocher(event: any) {
    if (event == 'famille_cocher') {

      this.contraintes_Form.get('Type2').setValue(true);
      this.contraintes_Form.controls.Type2.disable();
      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();

    }
    else {

      this.contraintes_Form.get('Type2').setValue(false);
      this.contraintes_Form.controls.Type2.enable();
      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }
  }
  // detecter changement etat famille lors de modification de contraintes
  Famille_cocher_modif(event: any) {
    if (event == true) {

      this.contraintes_Form.get('Type2').setValue(true);
      this.contraintes_Form.controls.Type2.disable();
      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();

    }
    else {

      this.contraintes_Form.get('Type2').setValue(false);
      this.contraintes_Form.controls.Type2.enable();
      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }
  }
  // detecter changement etat type2 lors de creation de contraintes
  Type2_cocher(event: any) {
    if (event == 'type2_cocher') {

      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();
     
    }
    else {


      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }
  }
  // detecter changement etat type2 lors de modification de contraintes
  Type2_cocher_modif(event: any) {
    if (event == true) {

      this.contraintes_Form.get('Type1').setValue(true);
      this.contraintes_Form.controls.Type1.disable();

    }
    else {


      this.contraintes_Form.get('Type1').setValue(false);
      this.contraintes_Form.controls.Type1.enable();
    }
  }
  // detecter changement etat region lors de creation de contraintes
  Region_cocher(event: any) {
    if (event == 'region_cocher') {

      this.contraintes_Form.get('Ville').setValue(true);
      this.contraintes_Form.controls.Ville.disable();
      this.contraintes_Form.get('Pays').setValue(true);
      this.contraintes_Form.controls.Pays.disable();

    }
    else {
      this.contraintes_Form.get('Ville').setValue(false);
      this.contraintes_Form.controls.Ville.enable();
      this.contraintes_Form.get('Pays').setValue(false);
      this.contraintes_Form.controls.Pays.enable();
    }
  }
  // detecter changement etat region lors de modification de contraintes
  Region_cocher_modif(event: any) {
    if (event == true) {

      this.contraintes_Form.get('Ville').setValue(true);
      this.contraintes_Form.controls.Ville.disable();
      this.contraintes_Form.get('Pays').setValue(true);
      this.contraintes_Form.controls.Pays.disable();

    }
    else {
      this.contraintes_Form.get('Ville').setValue(false);
      this.contraintes_Form.controls.Ville.enable();
      this.contraintes_Form.get('Pays').setValue(false);
      this.contraintes_Form.controls.Pays.enable();
    }
  }
  // detecter changement etat ville lors de creation de contraintes
  Ville_cocher(event: any) {
    if (event == 'ville_cocher') {
      this.contraintes_Form.get('Pays').setValue(true);
      this.contraintes_Form.controls.Pays.disable();

    }
    else {
      this.contraintes_Form.get('Pays').setValue(false);
      this.contraintes_Form.controls.Pays.enable();
    }
  }
  // detecter changement etat ville lors de modification de contraintes
  Ville_cocher_modif(event: any) {
    if (event == true) {
      this.contraintes_Form.get('Pays').setValue(true);
      this.contraintes_Form.controls.Pays.disable();

    }
    else {
      this.contraintes_Form.get('Pays').setValue(false);
      this.contraintes_Form.controls.Pays.enable();
    }
  }
  // liste de contraintes de la base
  Liste_Contraintes() {
    this.serviceProduit.obtenirListeContraintes().subscribe((reponse: Response) => {

      this.liste_contraintes = reponse;

    });
  }
  ModifierContrainte() {
    this.desactiver = false;
  }
  SupprimerContrainte() {
    Swal.fire({
      title: 'Êtes-vous sûr?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Oui, supprimez-le',
      cancelButtonText: 'Non, gardez-le'
    }).then((result) => {
      if (result.value) {
        this.serviceProduit.SupprimerContrainte(this.id_Contrainte);
        this.ChoixContrainte = false;
        this.creer_contraintes = false;
        this.boutonActiver = true;
        this.Liste_Contraintes();
        Swal.fire(
          'Contrainte Supprimée avec succés!',
          '',
          'success'
        )

      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Annulé',
          '',
          'error'
        )
      }
    })
  }

  ContraintesSelectionnee(event: MatSelectChange) {
    if (event.value == '') {
      this.id_Contrainte = 0;
      this.desactiver = true;

    }
    else this.id_Contrainte = event.value;

    if (this.id_Contrainte != 0) {
      this.serviceProduit.Contrainte(this.id_Contrainte).subscribe(data => {
        this.contrainte = data;
        this.creer_contraintes = false;
        this.ChoixContrainte = true;
        this.desactiver = true;
        this.boutonActiver = false;

      }, err => console.error(err),
        () => console.log(this.contrainte)
      );
    }
  }

  Valider() {
    if (this.ChoixContrainte == false) {

      if (this.creer_contraintes == true) {
        if((this.contraintes_Form.get('Nom_Contrainte').value == undefined)||(this.contraintes_Form.get('Nom_Contrainte').value+""==""))
        {
          Swal.fire({
            icon: 'warning',
            title: " Nom Contrainte"     
          }).then((res) => {  }  );
        }else{
        var formDataAjout: any = new FormData();
        formDataAjout.append('Id_Contrainte', 0);
        formDataAjout.append('Nom_Contrainte', this.contraintes_Form.get('Nom_Contrainte').value);
        formDataAjout.append('Code_Barre', this.contraintes_Form.get('Code_Barre').value);
        formDataAjout.append('Nom_Produit', this.contraintes_Form.get('Nom_Produit').value);
        formDataAjout.append('Type1', this.contraintes_Form.get('Type1').value);
        formDataAjout.append('Type2', this.contraintes_Form.get('Type2').value);
        formDataAjout.append('Famille', this.contraintes_Form.get('Famille').value);
        formDataAjout.append('Sous_Famille', this.contraintes_Form.get('Sous_Famille').value);
        formDataAjout.append('Unite', this.contraintes_Form.get('Unite').value);
        formDataAjout.append('Valeur_Unite', this.contraintes_Form.get('Valeur_Unite').value);
        formDataAjout.append('Ngp', this.contraintes_Form.get('Ngp').value);
        formDataAjout.append('Rfid', this.contraintes_Form.get('Rfid').value);
        formDataAjout.append('Caracteristique_Technique', this.contraintes_Form.get('Caracteristique_Technique').value);
        formDataAjout.append('Marque', this.contraintes_Form.get('Marque').value);
        formDataAjout.append('Source', this.contraintes_Form.get('Source').value);
        formDataAjout.append('Src_Img', this.contraintes_Form.get('Src_Img').value);
        formDataAjout.append('Pays', this.contraintes_Form.get('Pays').value);
        formDataAjout.append('Ville', this.contraintes_Form.get('Ville').value);
        formDataAjout.append('N_Imei', this.contraintes_Form.get('N_Imei').value);
        formDataAjout.append('N_Imei2', this.contraintes_Form.get('N_Imei2').value);
        formDataAjout.append('Temperature_Max', this.contraintes_Form.get('Temperature_Max').value);
        formDataAjout.append('Temperature_Min', this.contraintes_Form.get('Temperature_Min').value);
        formDataAjout.append('N_Lot', this.contraintes_Form.get('N_Lot').value);
        formDataAjout.append('Date_Fabrication', this.contraintes_Form.get('Date_Fabrication').value);
        formDataAjout.append('Date_Validite', this.contraintes_Form.get('Date_Validite').value);
        formDataAjout.append('Saison', this.contraintes_Form.get('Saison').value);
        formDataAjout.append('Region', this.contraintes_Form.get('Region').value);
        formDataAjout.append('N_Serie', this.contraintes_Form.get('N_Serie').value);
        formDataAjout.append('Couleur', this.contraintes_Form.get('Couleur').value);
        formDataAjout.append('Taille', this.contraintes_Form.get('Taille').value);
        formDataAjout.append('Role', this.contraintes_Form.get('Role').value);
        formDataAjout.append('Tva', this.contraintes_Form.get('Tva').value);
        formDataAjout.append('Fodec', this.contraintes_Form.get('Fodec').value);
        formDataAjout.append('Certificat', this.contraintes_Form.get('Certificat').value);
        this.serviceProduit.ajouterContrainte(formDataAjout).subscribe((reponse: Response) => {
          this.reponseAjout = reponse;
          this.id_Contrainte = this.reponseAjout.id_Contrainte;
          this.dialogueContraintes.close();
          this.router.navigate(['Menu/Menu-init/Menu-produit/Ajouter-produit-avec-contraintes', this.id_Contrainte])
        });
        Swal.fire('Contrainte ajoutée avec succès.')
        this.dialogueContraintes.close();
      }
      }
    }
    if (this.ChoixContrainte) {

      if (this.desactiver == true) {
        this.dialogueContraintes.close();
        this.router.navigate(['Menu/Menu-init/Menu-produit/Ajouter-produit-avec-contraintes', this.id_Contrainte])
      }
      if (this.desactiver == false) {
        var formData: any = new FormData();
        formData.append('Id_Contrainte', this.id_Contrainte);
        formData.append('Nom_Contrainte', this.contraintes_Form.get('Nom_Contrainte').value);
        formData.append('Code_Barre', this.contraintes_Form.get('Code_Barre').value);
        formData.append('Nom_Produit', this.contraintes_Form.get('Nom_Produit').value);
        formData.append('Type1', this.contraintes_Form.get('Type1').value);
        formData.append('Type2', this.contraintes_Form.get('Type2').value);
        formData.append('Famille', this.contraintes_Form.get('Famille').value);
        formData.append('Sous_Famille', this.contraintes_Form.get('Sous_Famille').value);
        formData.append('Unite', this.contraintes_Form.get('Unite').value);
        formData.append('Valeur_Unite', this.contraintes_Form.get('Valeur_Unite').value);
        formData.append('Ngp', this.contraintes_Form.get('Ngp').value);
        formData.append('Rfid', this.contraintes_Form.get('Rfid').value);
        formData.append('Caracteristique_Technique', this.contraintes_Form.get('Caracteristique_Technique').value);
        formData.append('Marque', this.contraintes_Form.get('Marque').value);
        formData.append('Source', this.contraintes_Form.get('Source').value);
        formData.append('Src_Img', this.contraintes_Form.get('Src_Img').value);
        formData.append('Pays', this.contraintes_Form.get('Pays').value);
        formData.append('Ville', this.contraintes_Form.get('Ville').value);
        formData.append('N_Imei', this.contraintes_Form.get('N_Imei').value);
        formData.append('N_Imei2', this.contraintes_Form.get('N_Imei2').value);
        formData.append('Temperature_Max', this.contraintes_Form.get('Temperature_Max').value);
        formData.append('Temperature_Min', this.contraintes_Form.get('Temperature_Min').value);
        formData.append('N_Lot', this.contraintes_Form.get('N_Lot').value);
        formData.append('Date_Fabrication', this.contraintes_Form.get('Date_Fabrication').value);
        formData.append('Date_Validite', this.contraintes_Form.get('Date_Validite').value);
        formData.append('Saison', this.contraintes_Form.get('Saison').value);
        formData.append('Region', this.contraintes_Form.get('Region').value);
        formData.append('N_Serie', this.contraintes_Form.get('N_Serie').value);
        formData.append('Couleur', this.contraintes_Form.get('Couleur').value);
        formData.append('Taille', this.contraintes_Form.get('Taille').value);
        formData.append('Role', this.contraintes_Form.get('Role').value);
        formData.append('Tva', this.contraintes_Form.get('Tva').value);
        formData.append('Fodec', this.contraintes_Form.get('Fodec').value);
        formData.append('Certificat', this.contraintes_Form.get('Certificat').value);
        //demande de confirmation de la modification
        Swal.fire({
          title: 'Êtes-vous sûr?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, modifiez-le',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {
            this.serviceProduit.ModifierContrainte(formData).subscribe(data => {
              //lorsque la modification  est réalisée
              this.desactiver = true;
              this.dialogueContraintes.close();
              this.router.navigate(['Menu/Menu-produit/Ajouter-produit-avec-contraintes', this.id_Contrainte])
            })
            Swal.fire(
              'contrainte modifié avec succés!',
              '',
              'success'
            )
          } else if (result.dismiss === Swal.DismissReason.cancel) {
            Swal.fire(
              'Annulé',
              '',
              'error'
            )
          }
        })
      }
    }
  }

  CreerContrainte() {
    this.ChoixContrainte = false;
    this.creer_contraintes = true;
    this.boutonActiver = true;
    this.contraintes_Form.reset(this.valeursInitiales);
    //reactiver la modification des valeurs
    this.contraintes_Form.controls.Pays.enable();
    this.contraintes_Form.controls.Ville.enable();
    this.contraintes_Form.controls.Type2.enable();
    this.contraintes_Form.controls.Type1.enable();
    this.contraintes_Form.controls.Famille.enable();
    this.contraintes_Form.get('Nom_Produit').setValue(true);
    this.liste_contraintes_Form.reset();

  }
  Annuler(): void {
    this.dialogueContraintes.close();
  }

}
