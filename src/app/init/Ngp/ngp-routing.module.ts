import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AjouterComponent } from './ajouter/ajouter.component';
import { ListerngpComponent } from './listerngp/listerngp.component';
 import { ModifierComponent } from './modifier/modifier.component';
import { NgpComponent } from './ngp.component';

const routes: Routes = [{ path: '', component: NgpComponent , children: [
  { path: 'Ajouter-ngp', component: AjouterComponent  },
  { path: 'Modifer-ngp/:Nom', component: ModifierComponent },
  { path: 'Lister-ngp', component: ListerngpComponent },
 ]}];

  

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NgpRoutingModule { }
