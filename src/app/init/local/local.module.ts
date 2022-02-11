import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalRoutingModule } from './local-routing.module';
import { LocalComponent } from './local.component';
import { MatStepperModule } from '@angular/material/stepper';
import { MatIconModule } from '@angular/material/icon';
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
 import { MatFormFieldModule } from '@angular/material/form-field';
 import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatInputModule } from '@angular/material/input';

import {MatCheckboxModule} from '@angular/material/checkbox';
import { MatCardModule } from '@angular/material/card';
import { NgxMatFileInputModule } from '@angular-material-components/file-input';

import { AjoutLocalComponent } from './ajout-local/ajout-local.component';
import { ModifierLocalComponent } from './modifier-local/modifier-local.component';
import { ListerLocalComponent } from './lister-local/lister-local.component';
import { VisualiserLocalComponent } from './visualiser-local/visualiser-local.component';
import { MatDatepickerModule } from '@angular/material/datepicker';

@NgModule({
  declarations: [LocalComponent,AjoutLocalComponent,ModifierLocalComponent,ListerLocalComponent,VisualiserLocalComponent],
  imports: [
    CommonModule,
    MatSnackBarModule,
    LocalRoutingModule,
    MatCheckboxModule,MatCardModule,NgxMatFileInputModule,
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
    MatSortModule
  ]
})
export class LocalModule { }
