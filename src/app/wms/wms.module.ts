import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { WmsRoutingModule } from './wms-routing.module';
import { WmsComponent } from './wms.component';
  

@NgModule({
  declarations: 
  [WmsComponent],
  imports: [
    CommonModule,
    WmsRoutingModule,
   
      
    ], 
})
export class WmsModule { }
