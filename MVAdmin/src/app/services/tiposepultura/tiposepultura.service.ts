import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class TiposepulturaService {

  constructor(private http: HttpClient) { }

  getSepultura(id) {
    let url = URL_SERVICIOS.sepultura + id+'/';
  
    return this.http.get(url);
  }
}
