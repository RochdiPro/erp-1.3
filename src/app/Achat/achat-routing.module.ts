import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { AchatComponent } from './achat.component';

const routes: Routes = [
  { path: '', component: AchatComponent },
  { path: 'Menu-bon-entree', loadChildren: () => import('./bonentree/bonentree.module').then(m => m.BonentreeModule) },
  { path: 'Menu-bon-entree-importation', loadChildren: () => import('./bonentreeimportation/bonentreeimportation.module').then(m => m.BonentreeimportationModule) },
  { path: 'Menu-bon-commande', loadChildren: () => import('./BonCommande/boncommande.module').then(m => m.BoncommandeModule) },
]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AchatRoutingModule { }
