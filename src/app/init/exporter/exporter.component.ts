import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
 import { saveAs } from 'file-saver';
import { SelectionModel } from '@angular/cdk/collections';
import Swal from 'sweetalert2';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ExporterImporterDonneesService } from './Service/exporter-importer-donnees.service';

@Component({
  selector: 'app-exporter',
  templateUrl: './exporter.component.html',
  styleUrls: ['./exporter.component.scss']
})
export class ExporterComponent implements OnInit {
  selection = new SelectionModel<any>(true, []);
  Liste_donnee: any = ['Fournisseurs', 'Clients', 'Produits','Employes'];
  nom_donnee: any;
  listeIdProduit: any = '';
  listeIdFournisseur: any = '';
  listeIdClient: any = '';
  listeIdEmploye: any = '';
  numeroSelectionner: any;
  exporterImporterData: any;
  colonnesFournisseur: string[] = ['Cocher',  'id_Fr', 'nom_Fournisseur', 'Exporter'];
  colonnesClients: string[] = ['Cocher', 'id_Clt', 'nom_Client', 'Exporter'];
  colonnesProduits: string[] = ['Cocher', 'id_Produit', 'nom_Produit', 'Exporter'];
  colonnesEmploye: string[] = ['Cocher', 'id_Employe', 'nom_Employe', 'Exporter'];

  chargement = true;

  @ViewChild(MatSort, { static: false }) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, private serviceEporterImporter: ExporterImporterDonneesService) { }
  ChoixDonnees(event: MatSelectChange) {
    this.nom_donnee = event.value;
    this.selection.clear();
    localStorage.setItem('donnee', this.nom_donnee); 
    if (this.nom_donnee == 'Produits') {
      this.ListeProduits();
    } else if (this.nom_donnee == 'Fournisseurs') {
      this.ListeFournisseurs();
    }
    else if (this.nom_donnee == 'Clients') {
      this.ListeClients();
    }
    else if (this.nom_donnee == 'Employes') {
      this.ListeEmployes();
    }
  }
  ListeFournisseurs() {
    this.chargement = true;
    this.serviceEporterImporter.ListeDonnees('Fournisseurs').subscribe((resp: any) => {
      this.exporterImporterData = new MatTableDataSource(resp);
      this.exporterImporterData.sort = this.sort;
      this.exporterImporterData.paginator = this.paginator;
      this.chargement = false;
    });
  }
  ListeClients() {
    this.chargement = true;
    this.serviceEporterImporter.ListeDonnees('Clients').subscribe((resp: any) => {
      this.exporterImporterData = new MatTableDataSource(resp);
      this.exporterImporterData.sort = this.sort;
      this.exporterImporterData.paginator = this.paginator;
      this.chargement = false;
    });
  }
  ListeEmployes() {
    this.chargement = true;
    this.serviceEporterImporter.ListeDonnees('Employes').subscribe((resp: any) => {
      this.exporterImporterData = new MatTableDataSource(resp);
      this.exporterImporterData.sort = this.sort;
      this.exporterImporterData.paginator = this.paginator;
      this.chargement = false;
    });
  }
  ListeProduits() {
    this.chargement = true;
    this.serviceEporterImporter.ListeDonnees('Fiche_Produits').subscribe((resp: any) => {
      this.exporterImporterData = new MatTableDataSource(resp);
      this.exporterImporterData.sort = this.sort;
      this.exporterImporterData.paginator = this.paginator;
      this.chargement = false;
    });
  }
  exporterFournisseur(id_Fr) {
    this.serviceEporterImporter.Exporter_Fournisseur(id_Fr).subscribe(response => {
      saveAs(response, 'xmlFournisseur');
    },
      error => {
        console.log("erreur");
      }
    );
  }
  exporterFournisseurs(ListeFournisseurs) {
    this.serviceEporterImporter.Exporter_Fournisseurs(ListeFournisseurs).subscribe(response => {
      saveAs(response, 'xmlFournisseurs');
    },
      error => {
        console.log("erreur");
      }
    );
  }
  exporterClient(id_Clt) {
    this.serviceEporterImporter.Exporter_Client(id_Clt).subscribe(response => {
      saveAs(response, 'xmlClient');
    },
      error => {
        console.log("erreur");

      }
    );

  }
  exporterClients(ListeClients) {

    this.serviceEporterImporter.Exporter_Clients(ListeClients).subscribe(response => {
      saveAs(response, 'xmlClients');

    },
      error => {
        console.log("erreur");

      }
    );
  }
  exporterEmploye(id_emp) {
    this.serviceEporterImporter.Exporter_Employe(id_emp).subscribe(response => {
      saveAs(response, 'xmlemploye');
    },
      error => {
        console.log("erreur");

      }
    );

  }
  exporterEmployes(Liste ) {

    this.serviceEporterImporter.Exporter_Employes(Liste ).subscribe(response => {
      saveAs(response, 'xmlemployes');

    },
      error => {
        console.log("erreur");

      }
    );
  }
  exporterFicheProduit(id_Produit) {
    this.serviceEporterImporter.Exporter_Fiche_Produit(id_Produit).subscribe(response => {
      saveAs(response, 'xmlProduit');
    },
      error => {
        console.log("erreur");
      }
    );

  }
  exporterFicheProduits(ListeProduits) {
    this.serviceEporterImporter.Exporter_Fiche_Produits(ListeProduits).subscribe(response => {
      saveAs(response, 'xmlProduits');

    },
      error => {
        console.log("erreur");

      }
    );
  }
  ToutSelectionner() {
    const numSelectionner = this.selection.selected.length;
    const numRows = !!this.exporterImporterData && this.exporterImporterData.data.length;
    return numSelectionner === numRows;
  }
  /** Sélectionne toutes les lignes si elles ne sont pas toutes sélectionnées; sinon une sélection claire. */
  masterToggle() {
    this.ToutSelectionner() ? this.selection.clear() : this.exporterImporterData.data.forEach(r => this.selection.select(r));
  }
  /** Le libellé de la case à cocher sur la ligne passée */
  checkboxLabel(row: any): string {
    if (!row) {
      return `${this.ToutSelectionner() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row ${row.id_Fr + 1}`;
  }
  ImporterDonnees() {
    if (!this.nom_donnee) {
      Swal.fire({
        icon: 'error',
        title: 'Vous devez choisir les données à importer avant l' + "'" + 'importation !!',
        showConfirmButton: false,
        timer: 1800
      });
    }
    else {
       if (this.nom_donnee == 'Fournisseurs') {
        const dialogueImporterFournisseurs = this.dialog.open(ImporterDonnees, {
          disableClose: true
        });
        dialogueImporterFournisseurs.afterClosed().subscribe(result => {
          this.ListeFournisseurs();
        });
      }
      else if (this.nom_donnee == 'Clients') { 
        const dialogueImporterClients = this.dialog.open(ImporterDonnees, {
          disableClose: true
        });
        dialogueImporterClients.afterClosed().subscribe(result => {
          this.ListeClients();
        });
      }
      else if (this.nom_donnee == 'Employes') {
        const dialogueImporterEmployes = this.dialog.open(ImporterDonnees, {
          disableClose: true
        });
        dialogueImporterEmployes.afterClosed().subscribe(result => {
          this.ListeEmployes();
        });
      }
      else if (this.nom_donnee == 'Produits') {
        const dialogueImporterClients = this.dialog.open(ImporterDonnees, {
          disableClose: true
        });
        dialogueImporterClients.afterClosed().subscribe(result => {
          this.ListeProduits();
        });
      }
    }
  }
  ExporterDonnees() {
    this.numeroSelectionner = this.selection.selected;
    if (this.numeroSelectionner.length > 0) {
      if (this.nom_donnee == 'Fournisseurs') {
        for (let i = 0; i < this.numeroSelectionner.length; i++) {
          this.listeIdFournisseur += this.numeroSelectionner[i].id_Fr + '/'
        }
        this.exporterFournisseurs(this.listeIdFournisseur);
      } else if (this.nom_donnee == 'Clients') {
        for (let i = 0; i < this.numeroSelectionner.length; i++) {
          this.listeIdClient += this.numeroSelectionner[i].id_Clt + '/'
        }
        this.exporterClients(this.listeIdClient);
      }
      else if (this.nom_donnee == 'Employes') {
        for (let i = 0; i < this.numeroSelectionner.length; i++) {
          this.listeIdEmploye += this.numeroSelectionner[i].id_Employe + '/'
        }
        this.exporterEmployes(this.listeIdEmploye);
      }
      else if (this.nom_donnee == 'Produits') {
        for (let i = 0; i < this.numeroSelectionner.length; i++) {
          this.listeIdProduit += this.numeroSelectionner[i].id_Produit + '/'
        }
        this.exporterFicheProduits(this.listeIdProduit);
      }
    } else {
      Swal.fire({
        icon: 'error',
        title: 'Sélectionne au moins une ligne !!',
        showConfirmButton: false,
        timer: 1500
      });
    }
  }
 
  ngOnInit(): void {
  }

}
 
@Component({
  templateUrl: './importer-donnees.html',
  styleUrls: ['./importer-donnees.scss']
})
export class ImporterDonnees {
  ImporterDonneesClient_form: FormGroup;
  donnee:any;
  constructor(
    private formBuilder: FormBuilder,
    private exporterImporterDonneesService: ExporterImporterDonneesService,
    public dialogueImporterClient: MatDialogRef<ImporterDonnees>,
    @Inject(MAT_DIALOG_DATA) public data: any) {
    this.ImporterDonneesClient_form = this.formBuilder.group({
      Fiche_Client: ['', [Validators.required]],
    });
    console.log(); // getting
    this.donnee=localStorage.getItem('donnee');
  }
  importer () {
    if (this.ImporterDonneesClient_form.invalid) {
      return;
    }
    var formData: any = new FormData();
    formData.append(''+this.donnee, this.ImporterDonneesClient_form.get('Fiche_Client').value);
    this.exporterImporterDonneesService.Importer(formData).subscribe(response => {
      Swal.fire({
        position: 'top-end',
        icon: 'success',
        title: 'fiche '+this.donnee+' ajoutée avec succés',
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
    this.dialogueImporterClient.close();

  }
  Fermer(): void {
    this.dialogueImporterClient.close();
  }
}
 
