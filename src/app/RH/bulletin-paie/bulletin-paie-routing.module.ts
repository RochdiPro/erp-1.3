import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjoutBulletinPaieComponent } from './ajout-bulletin-paie/ajout-bulletin-paie.component';

import { BulletinPaieComponent } from './bulletin-paie.component';
import { ListerBulletinPaieComponent } from './lister-bulletin-paie/lister-bulletin-paie.component';
import { ModifierBulletinPaieComponent } from './modifier-bulletin-paie/modifier-bulletin-paie.component';
import { VisualiserBulletinPaieComponent } from './visualiser-bulletin-paie/visualiser-bulletin-paie.component';

const routes: Routes = [{ path: '', component: BulletinPaieComponent , children: [
  { path: 'Ajouter-bulletin-paie', component: AjoutBulletinPaieComponent },
  { path: 'Modifer-bulletin-paie/:id', component: ModifierBulletinPaieComponent },
  { path: 'Lister-bulletin-paie', component: ListerBulletinPaieComponent },
  { path: 'Visualiser-bulletin-paie/:id', component: VisualiserBulletinPaieComponent } ]}]

 

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BulletinPaieRoutingModule { }
