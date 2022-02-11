import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutLocalComponent } from './ajout-local/ajout-local.component';
import { ListerLocalComponent } from './lister-local/lister-local.component';

import { LocalComponent } from './local.component';
import { ModifierLocalComponent } from './modifier-local/modifier-local.component';
import { VisualiserLocalComponent } from './visualiser-local/visualiser-local.component';

const routes: Routes = [{ path: '', component: LocalComponent ,children: [
    { path: 'Ajouter-local', component: AjoutLocalComponent },
    { path: 'Modifier-local/:id', component: ModifierLocalComponent },
    { path: 'Lister-local', component: ListerLocalComponent },
    { path: 'Visualiser-local/:id', component: VisualiserLocalComponent }]}]


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LocalRoutingModule { }
