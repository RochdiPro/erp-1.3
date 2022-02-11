import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutProduitAvecContraintesComponent } from './ajout-produit-avec-contraintes/ajout-produit-avec-contraintes.component';
import { AjoutProduitPersonnaliserComponent } from './ajout-produit-personnaliser/ajout-produit-personnaliser.component';
import { AjoutProduitStandardComponent } from './ajout-produit-standard/ajout-produit-standard.component';
import { ListerProduitComponent } from './lister-produit/lister-produit.component';
import { MethodeProduitComponent } from './methode-produit/methode-produit.component';
import { ModifierProduitComponent } from './modifier-produit/modifier-produit.component';

import { ProduitComponent } from './produit.component';
import { VisualiserProduitComponent } from './visualiser-produit/visualiser-produit.component';

const routes: Routes = [{ path: '', component: ProduitComponent ,children: [
  { path: 'Ajouter-produit', component: MethodeProduitComponent },
  { path: 'Ajouter-produit-standard', component: AjoutProduitStandardComponent },
  { path: 'Ajouter-produit-personnaliser', component: AjoutProduitPersonnaliserComponent },
  { path: 'Ajouter-produit-avec-contraintes/:id', component: AjoutProduitAvecContraintesComponent },
  { path: 'Modifer-produit/:id', component: ModifierProduitComponent },
  { path: 'Visualiser-produit/:id', component: VisualiserProduitComponent },
  { path: 'Lister-produit', component: ListerProduitComponent }]}]

 

 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProduitRoutingModule { }
