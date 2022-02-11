import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanRoutingModule } from './plan-routing.module';
import { PlanComponent } from './plan.component';
import { PlanSimpleComponent } from './plan-simple/plan-simple.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatStepperModule } from '@angular/material/stepper';
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
import { ajouter_hall, DialogueComponent } from './dialogue/dialogue.component';

@NgModule({
  declarations: [PlanComponent, PlanSimpleComponent, DialogueComponent,ajouter_hall],
  imports: [
    CommonModule,
    PlanRoutingModule,
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
export class PlanModule { }
