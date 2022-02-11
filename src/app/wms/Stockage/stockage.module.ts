import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { StockageRoutingModule } from './stockage-routing.module';
import { StockageComponent } from './stockage.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
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
import { BonTransfertComponent } from './bon-transfert/bon-transfert.component';
import { ListerBonTransfertComponent } from './lister-bon-transfert/lister-bon-transfert.component';
import { BonRetourComponent } from './bon-retour/bon-retour.component';
import { ListerBonRetourComponent } from './lister-bon-retour/lister-bon-retour.component';
import { EntreeBonReceptionComponent } from './entree/entree-bon-reception/entree-bon-reception.component';
import { ListerBonSortieComponent } from './lister-bon-sortie/lister-bon-sortie.component';
import { BonSortieComponent } from './bon-sortie/bon-sortie.component';
import { AjouterArticlesComponent } from './dialog/ajouter-articles/ajouter-articles.component';


@NgModule({
  declarations: [StockageComponent,BonTransfertComponent,ListerBonTransfertComponent,BonRetourComponent,ListerBonRetourComponent
  ,EntreeBonReceptionComponent,ListerBonSortieComponent,BonSortieComponent,AjouterArticlesComponent],
  imports: [
    CommonModule,
    StockageRoutingModule,
    MatIconModule,
    MatStepperModule,
    ReactiveFormsModule, ReactiveFormsModule,
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
    MatSortModule,
    FormsModule  ,
     MatDatepickerModule,
    MatNativeDateModule,
    MatProgressBarModule,
  ]
})
export class StockageModule { }
