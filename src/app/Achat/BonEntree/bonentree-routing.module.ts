import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterBonEntreeComponent } from './ajouter-bon-entree/ajouter-bon-entree.component';

import { BonentreeComponent } from './bonentree.component';
import { ListerBonEntreeComponent } from './lister-bon-entree/lister-bon-entree.component';
import { ModifierBonEntreeComponent } from './modifier-bon-entree/modifier-bon-entree.component';

const routes: Routes = [{ path: '', component: BonentreeComponent, children: [
  { path: 'Ajouter-bon-entree', component: AjouterBonEntreeComponent },
  { path: 'Modifier-bon-entree/:id', component: ModifierBonEntreeComponent },
  { path: 'Lister-bon-entree', component: ListerBonEntreeComponent },
  // { path: 'Visualiser-bel/:id', component: Visualiser},

] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonentreeRoutingModule { }
