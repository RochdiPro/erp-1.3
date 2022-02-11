import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutFournisseurComponent } from './ajout-fournisseur/ajout-fournisseur.component';

import { FournisseurComponent } from './fournisseur.component';
import { ListerFournisseurComponent } from './lister-fournisseur/lister-fournisseur.component';
import { ModifierFournisseurComponent } from './modifier-fournisseur/modifier-fournisseur.component';
import { VisualiserFournisseurComponent } from './visualiser-fournisseur/visualiser-fournisseur.component';

const routes: Routes = [{ path: '', component: FournisseurComponent ,  children: [ 
  { path: 'Ajouter-fournisseur', component: AjoutFournisseurComponent },
  { path: 'Modifer-fournisseur/:id', component: ModifierFournisseurComponent },
  { path: 'Lister-fournisseur', component: ListerFournisseurComponent },
  { path: 'Visualiser-fournisseur/:id', component: VisualiserFournisseurComponent }]}]

 
@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class FournisseurRoutingModule { }
