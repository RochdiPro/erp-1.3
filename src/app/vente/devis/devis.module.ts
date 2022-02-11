import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DevisRoutingModule } from './devis-routing.module';
import { DevisComponent } from './devis.component';
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
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatPaginatorIntlCro } from '../matPaginatorIntlCro';
import { AjouterDevisComponent } from './ajouter-devis/ajouter-devis.component';
import { ListerDevisComponent } from './lister-devis/lister-devis.component';
import { DialogContentAddArticleDialogComponent } from './ajouter-devis/dialog-content-add-article-dialog/dialog-content-add-article-dialog.component';
import { UpdateDialogOverviewArticleDialogComponent } from './ajouter-devis/update-dialog-overview-article-dialog/update-dialog-overview-article-dialog.component';
import { UpdateDevisComponent } from './update-devis/update-devis.component';
import { VoirPlusDialogComponent } from './ajouter-devis/voir-plus-dialog/voir-plus-dialog.component';
import { SearchFilterPipe } from './search-filter-pipe/search-filter.pipe';

@NgModule({
  declarations: [DevisComponent ,AjouterDevisComponent, ListerDevisComponent, DialogContentAddArticleDialogComponent, UpdateDialogOverviewArticleDialogComponent, UpdateDevisComponent, VoirPlusDialogComponent, SearchFilterPipe],
  imports: [
    CommonModule,
    DevisRoutingModule, 
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
    ReactiveFormsModule,
    MatSortModule
  ],
  exports: [
    MatSortModule,],
  providers: [{ provide: MatPaginatorIntl, useClass: MatPaginatorIntlCro }]
})
export class DevisModule { }