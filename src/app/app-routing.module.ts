import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MenuComponent } from './menu/menu.component';
 

const routes: Routes = [
  { path: '', redirectTo: 'cnx', pathMatch: 'full' },
  {
    path: 'Menu', component: MenuComponent, children: [      
      { path: 'WMS', loadChildren: () => import('./wms/wms.module').then(m => m.WmsModule) },
      { path: 'Menu-init', loadChildren: () => import('./init/init.module').then(m => m.InitModule) },
      { path: 'Menu-vente', loadChildren: () => import('./vente/vente.module').then(m => m.VenteModule) },    
      { path: 'Menu-achat', loadChildren: () => import('./achat/achat.module').then(m => m.AchatModule) },    
      { path: 'Menu-RH', loadChildren: () => import('./rh/rh.module').then(m => m.RhModule) },
      { path: 'Menu_Colisage', loadChildren: () => import('./colisage/colisage.module').then(m => m.ColisageModule) },
      { path: 'TMS', loadChildren: () => import('./tms/tms.module').then(m => m.TmsModule) },
    ]
  },
  { path: 'cnx', loadChildren: () => import('./connexion/connexion/connexion.module').then(m => m.ConnexionModule) },
  { path: 'Page404', loadChildren: () => import('./connexion/page404/page404.module').then(m => m.Page404Module) },
  { path: 'wms/plan', loadChildren: () => import('./wms/plan/plan.module').then(m => m.PlanModule) },
 
] 


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
