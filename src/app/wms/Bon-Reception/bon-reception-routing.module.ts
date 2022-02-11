import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterBonReceptionComponent } from './ajouter-bon-reception/ajouter-bon-reception.component';

import { BonReceptionComponent } from './bon-reception.component';
import { BonRejetComponent } from './bon-rejet/bon-rejet.component';
import { ListerBonReceptionComponent } from './lister-bon-reception/lister-bon-reception.component';
import { ModifierBonReceptionComponent } from './modifier-bon-reception/modifier-bon-reception.component';

const routes: Routes = [{ path: '', component: BonReceptionComponent , children: [           
  { path: 'Lister', component: ListerBonReceptionComponent},
  { path: 'Ajouter', component: AjouterBonReceptionComponent},   
  { path: 'Rejet', component: BonRejetComponent},   
  { path: 'Modifier/:id', component: ModifierBonReceptionComponent},   
] }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BonReceptionRoutingModule { }
