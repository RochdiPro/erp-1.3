import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProduitRoutingModule } from './produit-routing.module';
import { ProduitComponent } from './produit.component';
import { AjoutProduitStandardComponent } from './ajout-produit-standard/ajout-produit-standard.component';
import { VisualiserProduitComponent } from './visualiser-produit/visualiser-produit.component';
import { ModifierProduitComponent } from './modifier-produit/modifier-produit.component';
import { ListerProduitComponent } from './lister-produit/lister-produit.component';
import { AjoutProduitPersonnaliserComponent } from './ajout-produit-personnaliser/ajout-produit-personnaliser.component';
import { AjoutProduitAvecContraintesComponent } from './ajout-produit-avec-contraintes/ajout-produit-avec-contraintes.component';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatTableFilterModule } from 'mat-table-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import { DialogCreationContraintes, MethodeProduitComponent } from './methode-produit/methode-produit.component';
import { MatCardModule } from '@angular/material/card';
import { MatSnackBarModule } from '@angular/material/snack-bar';
 
import {MatCheckboxModule} from '@angular/material/checkbox';
 
@NgModule({
  declarations: [ProduitComponent , 
    AjoutProduitStandardComponent,
    AjoutProduitPersonnaliserComponent,
    AjoutProduitAvecContraintesComponent,
    ModifierProduitComponent,
    VisualiserProduitComponent,
    ListerProduitComponent,
    MethodeProduitComponent,
    DialogCreationContraintes,
    
  
  ],
  imports: [
    CommonModule,
    ProduitRoutingModule,
    CommonModule,
    MatFormFieldModule,
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatTableFilterModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    ReactiveFormsModule,
    MatSortModule,
    NgxMatFileInputModule,
    PdfViewerModule,
    MatCardModule,
    MatSnackBarModule, 
    MatCheckboxModule,
    MatPaginatorModule,
    MatSortModule,

  ]
})
export class ProduitModule { }
