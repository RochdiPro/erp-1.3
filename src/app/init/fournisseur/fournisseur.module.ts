import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FournisseurRoutingModule } from './fournisseur-routing.module';
import { FournisseurComponent } from './fournisseur.component';
 import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
 import { MatTableFilterModule } from 'mat-table-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { AjoutFournisseurComponent } from './ajout-fournisseur/ajout-fournisseur.component';
import { ListerFournisseurComponent } from './lister-fournisseur/lister-fournisseur.component';
import { VisualiserFournisseurComponent } from './visualiser-fournisseur/visualiser-fournisseur.component';
import { ModifierFournisseurComponent } from './modifier-fournisseur/modifier-fournisseur.component';
import { MatFormFieldModule } from '@angular/material/form-field';
//import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';


@NgModule({
  declarations: [FournisseurComponent,AjoutFournisseurComponent,ListerFournisseurComponent,VisualiserFournisseurComponent,ModifierFournisseurComponent],
  imports: [   
    CommonModule,
    FournisseurRoutingModule,
    CommonModule,
    MatCheckboxModule,
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
     MatPaginatorModule,
     MatSortModule,
    MatSnackBarModule, 
    FormsModule, ReactiveFormsModule,    
    MatCardModule,   
    NgxMatFileInputModule,
    
   
  ]
})
export class FournisseurModule { }
