import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router'; 
import { WmsComponent } from './wms.component';

const routes: Routes = [
        { path: '', component: WmsComponent  },
        { path: 'WMS-Reception', loadChildren: () => import('./Bon-Reception/bon-reception.module').then(m => m.BonReceptionModule) },
        { path: 'WMS-Stockage', loadChildren: () => import('./Stockage/stockage.module').then(m => m.StockageModule) },
        { path: 'WMS-Plan', loadChildren: () => import('./plan/plan.module').then(m => m.PlanModule) },
  ]  


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class WmsRoutingModule { }
