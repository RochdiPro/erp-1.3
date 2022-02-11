import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import {  VisualiserImage } from '../modifier-produit/modifier-produit.component';
import { ProduitServiceService } from '../Service/produit-service.service';

@Component({
  selector: 'app-visualiser-produit',
  templateUrl: './visualiser-produit.component.html',
  styleUrls: ['./visualiser-produit.component.scss']
})
export class VisualiserProduitComponent implements OnInit {
  aggrandirImage: any;
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
  id_produit: any;
  produitData: any;
  parDefaut: any;
  Fichier_image: any;
  Fichier_certificat: any;
  Fichier_rfid: any;

  constructor(private router: Router, public dialog: MatDialog, private serviceProduit: ProduitServiceService, private fb: FormBuilder, private route: ActivatedRoute) {
    this.parDefaut = "-";
    this.id_produit = this.route.snapshot.params.id;
    this.Produit();

    this.ImageProduit();
    this.RfidProduit();
    this.CertificatProduit();
  }
  
  CertificatProduit() {
    this.serviceProduit.Certificat_Produit(this.id_produit)
      .subscribe((baseCertificat: any) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          this.Fichier_certificat = reader.result;


        }
        reader.readAsDataURL(baseCertificat);
      

      });
  }
  
  imprimerCertificat() {

    this.serviceProduit.Certificat_Produit(this.id_produit).subscribe(res => {
      if (res.size) {
        const fileURL = URL.createObjectURL(res);
     
        window.open(fileURL, '_blank');
      } else {
        Swal.fire({
          title: 'Ce produit n' + "'" + 'a pas certificat, voulez-vous ajouter?',

          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Oui, Ajoutez',
          cancelButtonText: 'Non'
        }).then((result) => {
          if (result.value) {

            // lorsque la modification est realisé redirection à la page lister-fournisseur
            this.router.navigate(['/Menu/Menu-produit/Modifer-produit/'+this.id_produit])



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
  imprimerRfid() {

    this.serviceProduit.Rfid_Produit(this.id_produit).subscribe(res => {
      if (res.size) {
        const fileURL = URL.createObjectURL(res);
        window.open(fileURL, '_blank');
    
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
            this.router.navigate(['/Menu/Menu-produit/Modifer-produit/'+this.id_produit])
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
  //rfid recuperé de la base 
  RfidProduit() {

    this.serviceProduit.Rfid_Produit(this.id_produit)
      .subscribe((baseRfid: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.Fichier_rfid = lecteur.result;
        }
        lecteur.readAsDataURL(baseRfid);

      });
  }
  //image recuperée de la base 
  ImageProduit() {

    this.serviceProduit.Image_Produit(this.id_produit)
      .subscribe((baseImage: any) => {
        const lecteur = new FileReader();
        lecteur.onloadend = () => {
          this.Fichier_image = lecteur.result;
        }
        lecteur.readAsDataURL(baseImage);

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
      this.serviceProduit.ListerRegion(this.produitData.ville).subscribe((reponse: Response) => {

        this.categorie_region = reponse;

      });
      this.tva = this.produitData.tva.toString();

    }, err => console.error(err),
      () => console.log(this.produitData)

    );
  }

  ngOnInit(): void {
  }
  aggrandir() {
    this.aggrandirImage = 'aggrandir';
  }
  afficherImage(id : any ): void {
    const dialogImage = this.dialog.open(VisualiserImage, {

      data: { id_produit: id }
    });

    dialogImage.afterClosed().subscribe(result => {


    });
  }


}
