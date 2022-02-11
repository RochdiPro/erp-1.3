import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterBonEntreeImportationComponent } from './ajouter-bon-entree-importation/ajouter-bon-entree-importation.component';

import { BonentreeimportationComponent } from './bonentreeimportation.component';
import { ListerBonEntreeImportationComponent } from './lister-bon-entree-importation/lister-bon-entree-importation.component';
import { ModifierBonEntreeImportationComponent } from './modifier-bon-entree-importation/modifier-bon-entree-importation.component';

const routes: Routes = [{ path: '', component: BonentreeimportationComponent , children: [
  { path: 'Ajouter-bon-entree-importation', component: AjouterBonEntreeImportationComponent },
  { path: 'Modifer-bon-entree-importation/:id', component: ModifierBonEntreeImportationComponent },
  { path: 'Lister-bon-entree-importation', component: ListerBonEntreeImportationComponent },
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonentreeimportationRoutingModule { }
