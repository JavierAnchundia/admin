import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { CamposantoService } from './servicios.index';
import { GeolocalizacionService } from './geolocalizacion/geolocalizacion.service'

@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    CamposantoService,
    GeolocalizacionService
  ],

})

export class ServicioModules { }