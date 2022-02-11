import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BulletinPaieRoutingModule } from './bulletin-paie-routing.module';
import { BulletinPaieComponent } from './bulletin-paie.component';


@NgModule({
  declarations: [BulletinPaieComponent],
  imports: [
    CommonModule,
    BulletinPaieRoutingModule
  ]
})
export class BulletinPaieModule { }
