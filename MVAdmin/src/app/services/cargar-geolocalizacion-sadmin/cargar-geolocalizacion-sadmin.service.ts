import { Injectable, Output, EventEmitter} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CargarGeolocalizacionSadminService {

  constructor() { }
  @Output() change: EventEmitter<{ lat: number; lng: number }[]> = new EventEmitter();
  llenarPuntos(puntosGeo: { lat: number; lng: number }[]){
    this.change.emit(puntosGeo);
  }
}
