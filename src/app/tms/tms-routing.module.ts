import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuTmsComponent } from './menu-tms/menu-tms.component';
import { ParcTransportComponent } from './parc-transport/parc-transport.component';
import { PlanChargementComponent } from './plan-chargement/plan-chargement.component';

const routes: Routes = [
  { path: 'home', component: MenuTmsComponent },
  { path: 'Parc', component: ParcTransportComponent, loadChildren: () => import('./parc-transport/parc-transport.module').then(m => m.ParcTransportModule) },
  { path: 'plan-chargement', loadChildren: () => import('./plan-chargement/plan-chargement.module').then(m => m.PlanChargementModule) }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TmsRoutingModule { }
