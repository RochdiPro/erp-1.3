import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ExporterComponent } from './exporter.component';

const routes: Routes = [{ path: '', component: ExporterComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExporterRoutingModule { }
