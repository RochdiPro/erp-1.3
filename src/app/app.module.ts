import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { AppComponent } from './app.component';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { MatDatepickerModule} from '@angular/material/datepicker';
import { DatePipe } from '@angular/common';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { MenuComponent } from './menu/menu.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { RouterModule } from '@angular/router';
import { MenuMenuComponent } from './menu/menu-menu/menu-menu.component';
 

@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    MenuMenuComponent 
       ],
  imports: [  
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,    
    BrowserAnimationsModule ,     
    AppRoutingModule,
    RouterModule
  ],
  providers: [MatDatepickerModule, DatePipe, { provide: MatPaginatorIntl}],

  bootstrap: [AppComponent]
})
export class AppModule { }
