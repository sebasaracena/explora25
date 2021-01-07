import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MapaComponent } from './componentes/mapa/mapa.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MapaService } from './servicio/mapa.service';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import {  MatPaginatorModule
  , MatTableModule } from "@angular/material";
import { FooterComponent } from './paginas/footer/footer.component';
import { NavComponent } from './paginas/nav/nav.component';
import { GraficosComponent } from './componentes/graficos/graficos.component';
import { ChartsModule } from 'ng2-charts';
import { CncytComponent } from './componentes/cncyt/cncyt.component';


@NgModule({
  declarations: [
    AppComponent,
    MapaComponent,
    FooterComponent,
    NavComponent,
    GraficosComponent,
    CncytComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule,
    BrowserAnimationsModule,
    MatDialogModule,
    MatTableModule,
    ChartsModule,
    MatPaginatorModule
  ],
  providers: [MapaService],
  bootstrap: [AppComponent]
})
export class AppModule { }
