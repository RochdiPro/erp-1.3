import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonentreeRoutingModule } from './bonentree-routing.module';
 import { AjouterBonEntreeComponent} from './ajouter-bon-entree/ajouter-bon-entree.component';
import { ModifierBonEntreeComponent } from './modifier-bon-entree/modifier-bon-entree.component';
import { ListerBonEntreeComponent } from './lister-bon-entree/lister-bon-entree.component';


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
import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatDialogModule ,} from '@angular/material/dialog';
  

@NgModule({
  declarations: [ 
    AjouterBonEntreeComponent,
    ModifierBonEntreeComponent,
    ListerBonEntreeComponent,
    
    ],
  imports: [
    CommonModule,
    BonentreeRoutingModule,
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
    MatCheckboxModule,
    MatDialogModule,
  ]
})
export class BonentreeModule { }
