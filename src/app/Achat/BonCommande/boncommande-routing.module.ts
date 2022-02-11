import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterBonCommandeComponent } from './ajouter-bon-commande/ajouter-bon-commande.component';

import { BoncommandeComponent } from './boncommande.component';
import { ListerBonCommandeComponent } from './lister-bon-commande/lister-bon-commande.component';
import { ModifierBonCommandeComponent } from './modifier-bon-commande/modifier-bon-commande.component';

const routes: Routes = [{ path: '', component: BoncommandeComponent , children: [
  { path: 'Ajouter-bon-commande', component: AjouterBonCommandeComponent },
  { path: 'Modifer-bon-commande/:id', component: ModifierBonCommandeComponent },
  { path: 'Lister-bon-commande', component: ListerBonCommandeComponent } 
 ]}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BoncommandeRoutingModule { }
