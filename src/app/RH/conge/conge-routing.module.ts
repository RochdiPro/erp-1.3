import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutCongeComponent } from './ajout-conge/ajout-conge.component';

import { CongeComponent } from './conge.component';
import { ListerCongeComponent } from './lister-conge/lister-conge.component';
import { ModifierCongeComponent } from './modifier-conge/modifier-conge.component';
import { VisualiserCongeComponent } from './visualiser-conge/visualiser-conge.component';

const routes: Routes = [{ path: '', component: CongeComponent , children: [
  { path: 'Ajouter-conge', component: AjoutCongeComponent },
  { path: 'Modifer-conge/:id', component: ModifierCongeComponent },
  { path: 'Lister-conge', component: ListerCongeComponent },
  { path: 'Visualiser-conge/:id', component: VisualiserCongeComponent }]}];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CongeRoutingModule { }
