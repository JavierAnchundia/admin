import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Punto_geolocalizacion } from '../../models/punto_geolocalizacion.model'
import URL_SERVICIOS from 'src/app/config/config';

@Injectable({
  providedIn: 'root'
})
export class GeolocalizacionService {

  constructor(
    private http: HttpClient
  ) { }

  getListGeolocalizacion(id):Observable<Punto_geolocalizacion[]>{
    let url = URL_SERVICIOS.geolocalizacion_camp + String(id) + '/';
    return this.http.get<Punto_geolocalizacion[]>(url);
  }

  async postListGeolocalizacion(listGeo: Punto_geolocalizacion){
    let url = URL_SERVICIOS.geolocalizacion_post;
    let httpOptions = {
      headers: new HttpHeaders({
          'Content-Type': 'application/json',
        })
    }
    return await this.http.post<Punto_geolocalizacion>(url, listGeo,httpOptions).toPromise();
  }

  deletePointGeolocalizacion(id:Number){
    let url = URL_SERVICIOS.geolocalizacion_del + id +'/';
    return this.http.delete(url, {observe: 'response'});
  }
}
