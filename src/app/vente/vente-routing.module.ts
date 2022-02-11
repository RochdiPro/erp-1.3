import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VenteComponent } from './vente.component';

const routes: Routes = [{ path: '', component: VenteComponent  },

{path :'Menu-facture', loadChildren: () => import('./facture/facture.module').then(m => m.FactureModule)},
{path: 'Menu-Devis', loadChildren:()=>import('./devis/devis.module').then(m=>m.DevisModule)},
{path: 'Menu-BonLivraison', loadChildren: ()=>import('./bon-de-livraison/bon-de-livraison.module').then(m=>m.BonDeLivraisonModule)},
  ];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VenteRoutingModule { }
