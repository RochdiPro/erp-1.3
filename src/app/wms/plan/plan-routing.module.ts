import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanSimpleComponent } from './plan-simple/plan-simple.component';

import { PlanComponent } from './plan.component';

const routes: Routes = [{ path: '', component: PlanComponent , children: [           
  { path: 'Plan', component: PlanSimpleComponent},
  
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
  
})
export class PlanRoutingModule { }
