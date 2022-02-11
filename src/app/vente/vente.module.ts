import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { VenteRoutingModule } from './vente-routing.module';
import { VenteComponent } from './vente.component';
 
@NgModule({
  declarations: [VenteComponent],
  imports: [
    CommonModule,
    VenteRoutingModule,   
  ]
})
export class VenteModule { }
