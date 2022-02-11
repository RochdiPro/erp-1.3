import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BonDeLivraisonRoutingModule } from './bon-de-livraison-routing.module';
import { BonDeLivraisonComponent } from './bon-de-livraison.component';
import { NouveauBLComponent } from './nouveau-bl/nouveau-bl.component';
import { DevisBLComponent } from './devis-bl/devis-bl.component';
import { ConvertDevisToBlComponent } from './convert-devis-to-bl/convert-devis-to-bl.component';
import { AjouterBlComponent } from './ajouter-bl/ajouter-bl.component';
import { ListerBlComponent } from './lister-bl/lister-bl.component';
import { GenererBlComponent } from './generer-bl/generer-bl.component';
import { UpdateBlComponent } from './update-bl/update-bl.component';
import { InfosDialogComponent } from './nouveau-bl/infos-dialog/infos-dialog.component';
import { InfoSerieDialogComponent } from './nouveau-bl/info-serie-dialog/info-serie-dialog.component';
import { InfoSimpleDialogComponent } from './nouveau-bl/info-simple-dialog/info-simple-dialog.component';
 
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { NgSelectModule } from '@ng-select/ng-select';
import { MatPaginatorIntlCro } from '../matPaginatorIntlCro';
@NgModule({
  declarations: [BonDeLivraisonComponent,NouveauBLComponent, DevisBLComponent, ConvertDevisToBlComponent, AjouterBlComponent, ListerBlComponent, GenererBlComponent, UpdateBlComponent, InfosDialogComponent, InfoSerieDialogComponent, InfoSimpleDialogComponent],
  imports: [
    CommonModule,
    BonDeLivraisonRoutingModule,
    
    MatStepperModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSelectModule,
    MatButtonModule,
    MatProgressBarModule,
    MatTableModule,
    FormsModule,
    MatPaginatorModule,
    MatCardModule,
    ReactiveFormsModule,
    NgSelectModule

  ],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})
export class BonDeLivraisonModule { }
