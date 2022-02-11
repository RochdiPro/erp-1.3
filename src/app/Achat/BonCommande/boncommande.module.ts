import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BoncommandeRoutingModule } from './boncommande-routing.module';
 import { MatSortModule } from '@angular/material/sort';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableFilterModule } from 'mat-table-filter';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTableModule } from '@angular/material/table';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatPaginatorModule } from '@angular/material/paginator';
import { AjouterBonCommandeComponent } from './ajouter-bon-commande/ajouter-bon-commande.component';
import { ListerBonCommandeComponent } from './lister-bon-commande/lister-bon-commande.component';
import { ModifierBonCommandeComponent } from './modifier-bon-commande/modifier-bon-commande.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AjouterArticles_bcComponent, DialogueCommandeComponent } from './dialogue/dialogue-commande/dialogue-commande.component';
import { MatCheckboxModule } from '@angular/material/checkbox';



@NgModule({
  declarations: [
    AjouterBonCommandeComponent,
    ListerBonCommandeComponent,
    ModifierBonCommandeComponent,
     DialogueCommandeComponent,AjouterArticles_bcComponent],
  imports: [
    CommonModule,
    BoncommandeRoutingModule,
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
    MatDialogModule,
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
export class BoncommandeModule { }
