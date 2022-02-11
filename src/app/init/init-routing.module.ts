import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
 
import { InitComponent } from './init.component';
 

const routes: Routes = [{ path: '', component: InitComponent },
  
  { path: 'Menu-ngp', loadChildren: () => import('./ngp/ngp.module').then(m => m.NgpModule) }, 
    {path: 'Menu-client', loadChildren:()=>import('./client/client.module').then(m=>m.ClientModule)},
   { path: 'Menu-fournisseur', loadChildren: () => import('./fournisseur/fournisseur.module').then(m => m.FournisseurModule) },
   { path: 'Menu-local', loadChildren: () => import('./local/local.module').then(m => m.LocalModule) },
   { path: 'Menu-produit', loadChildren: () => import('./produit/produit.module').then(m => m.ProduitModule) },
   { path: 'Menu-donnees', loadChildren: () => import('./donnees/donnees.module').then(m => m.DonneesModule) },
   { path: 'Menu-exporter-importer', loadChildren: () => import('./exporter/exporter.module').then(m => m.ExporterModule) },

]

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class InitRoutingModule { }
