import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BonRetourComponent } from './bon-retour/bon-retour.component';
import { BonSortieComponent } from './bon-sortie/bon-sortie.component';
import { BonTransfertComponent } from './bon-transfert/bon-transfert.component';
import { EntreeBonReceptionComponent } from './entree/entree-bon-reception/entree-bon-reception.component';
import { ListerBonRetourComponent } from './lister-bon-retour/lister-bon-retour.component';
import { ListerBonSortieComponent } from './lister-bon-sortie/lister-bon-sortie.component';
import { ListerBonTransfertComponent } from './lister-bon-transfert/lister-bon-transfert.component';

import { StockageComponent } from './stockage.component';

const routes: Routes = [{ path: '', component: StockageComponent  , children:[
{ path: 'Entree', component: EntreeBonReceptionComponent},
{ path: 'Bon_Sortie', component: BonSortieComponent},
{ path: 'Lister_Bon_Sortie', component: ListerBonSortieComponent},
{ path: 'Bon_Transfert', component: BonTransfertComponent},
{ path: 'Lister_Bon_Transfert', component: ListerBonTransfertComponent},
{ path: 'Bon_Retour', component: BonRetourComponent},
{ path: 'Lister_Bon_Retour', component: ListerBonRetourComponent},
]}]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StockageRoutingModule { }
