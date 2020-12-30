import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Sugerencia} from '../../models/sugerencia.model'
@Injectable({
  providedIn: 'root'
})
export class SugerenciasService {

  constructor(private http: HttpClient) {}

  getSugerencias(idCamposanto) {
    let url = URL_SERVICIOS.contactoCamposanto + idCamposanto + '/';
    return this.http.get(url);
  }

  async deleteSugerencia(idSugerencia){
    let url = URL_SERVICIOS.contacto + idSugerencia + "/";
    return await this.http.delete<Sugerencia[]>(url).toPromise();
  }
}
