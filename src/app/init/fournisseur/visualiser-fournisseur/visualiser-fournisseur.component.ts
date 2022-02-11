import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { FournisseurServiceService } from '../Service/fournisseur-service.service';
 
@Component({
  selector: 'app-visualiser-fournisseur',
  templateUrl: './visualiser-fournisseur.component.html',
  styleUrls: ['./visualiser-fournisseur.component.scss']
})
export class VisualiserFournisseurComponent implements OnInit {
  categorie_ville: any;
  categorie_region: any;
  Informations_Banques: FormGroup;
  Informations_Generales: FormGroup;
  Identification_Fiscale: FormGroup;
  Vente: FormGroup;
  id_fournisseur: any;
  fournisseur: any;
  date_livraison_Cin: any;
  debut_exoneration_tva: any;
  fin_exoneration_tva: any
  constructor(private datePipe: DatePipe, public dialog: MatDialog, private http: HttpClient, private serviceFournisseur: FournisseurServiceService, private router: Router, private fb: FormBuilder, private route: ActivatedRoute) {
    this.Informations_Generales = this.fb.group({
    
    });
    this.Identification_Fiscale = this.fb.group({
  
      Timbre_Fiscal: []
    });
    this.Informations_Banques = this.fb.group({
   
    });
    this.Vente = this.fb.group({
     
      Bloque_Vente: [],

    });
    this.id_fournisseur = this.route.snapshot.params.id;
    this.Fournisseur();
  }
  Fournisseur() {
    this.serviceFournisseur.Fournisseur(this.id_fournisseur).subscribe((resp: any) => {
      this.fournisseur = resp;
      this.date_livraison_Cin = new Date(this.fournisseur.date_Livraison_Identite);
      this.debut_exoneration_tva = new Date(this.fournisseur.debut_Exoneration);
      this.debut_exoneration_tva = this.datePipe.transform(this.debut_exoneration_tva, 'dd-MM-yyyy');
      this.fin_exoneration_tva = new Date(this.fournisseur.fin_Exoneration);
      this.fin_exoneration_tva = this.datePipe.transform(this.fin_exoneration_tva, 'dd-MM-yyyy');

      //afficher ville selon pays
      this.serviceFournisseur.ListerVille(this.fournisseur.pays).subscribe((response: Response) => {

        this.categorie_ville = response;
      });
      this.serviceFournisseur.ListerRegion(this.fournisseur.ville).subscribe((response: Response) => {

        this.categorie_region = response;
      });
    });
  }
  afficherImage(id): void {
    const dialogRef = this.dialog.open(VisualiserImageFournisseur, {

      data: { id_Fr: id }
    });

    dialogRef.afterClosed().subscribe(result => {

    });
  }

  ngOnInit(): void {
  }

}
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