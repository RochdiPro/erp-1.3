import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonentreeimportationRoutingModule } from './bonentreeimportation-routing.module';
 import { AjouterBonEntreeImportationComponent  } from './ajouter-bon-entree-importation/ajouter-bon-entree-importation.component';
 import { ListerBonEntreeImportationComponent } from './lister-bon-entree-importation/lister-bon-entree-importation.component';


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
import { ModifierBonEntreeImportationComponent } from './modifier-bon-entree-importation/modifier-bon-entree-importation.component';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';
import { MatDialogModule } from '@angular/material/dialog';
import { AjouterArticles_impoComponent } from '../dialogue-achat/dialogue-achat.component';
 

@NgModule({
  declarations: [ 
    AjouterBonEntreeImportationComponent,
    ModifierBonEntreeImportationComponent,
    ListerBonEntreeImportationComponent,   
    AjouterArticles_impoComponent,
   
  ],
  imports: [
    CommonModule,
    BonentreeimportationRoutingModule,
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
    MatDialogModule,
  ]
})
export class BonentreeimportationModule { }
