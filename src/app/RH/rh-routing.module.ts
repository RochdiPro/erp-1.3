import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RhComponent } from './rh.component';

const routes: Routes = [{ path: '', component: RhComponent },
{ path: 'Menu-employee', loadChildren: () => import('./employe/employe.module').then(m => m.EmployeModule) },
{ path: 'Menu-conge', loadChildren: () => import('./conge/conge.module').then(m => m.CongeModule) },
 { path: 'Menu-bulletin-paie', loadChildren: () => import('./bulletin-paie/bulletin-paie.module').then(m => m.BulletinPaieModule) },


 ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class RhRoutingModule { }
