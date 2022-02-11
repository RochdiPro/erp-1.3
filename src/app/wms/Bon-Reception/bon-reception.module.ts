import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonReceptionRoutingModule } from './bon-reception-routing.module';
import { BonReceptionComponent } from './bon-reception.component';
import { AjouterBonReceptionComponent, Ajouter_Bon_Rejet, Support } from './ajouter-bon-reception/ajouter-bon-reception.component';
import { ListerBonReceptionComponent } from './lister-bon-reception/lister-bon-reception.component';
import { ModifierBonReceptionComponent, Modifier_Support } from './modifier-bon-reception/modifier-bon-reception.component';
import { BonRejetComponent } from './bon-rejet/bon-rejet.component';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatSortModule } from '@angular/material/sort';


@NgModule({
  declarations: [BonReceptionComponent,
    AjouterBonReceptionComponent,
    ListerBonReceptionComponent,
 
    Ajouter_Bon_Rejet,
    ModifierBonReceptionComponent,
    BonRejetComponent,
    Support,
    Modifier_Support],
  imports: [
    CommonModule,
    BonReceptionRoutingModule,
    MatIconModule,
    MatStepperModule,
    FormsModule, ReactiveFormsModule,
    MatSelectModule,
    MatDialogModule,
    MatPaginatorModule,
    MatTableModule,
    MatFormFieldModule,
    MatInputModule ,  
    MatProgressBarModule,       
    MatDatepickerModule,
    MatNativeDateModule,
    MatButtonModule, 
    MatPaginatorModule,     
    MatSortModule
  ]
})
export class BonReceptionModule { }
