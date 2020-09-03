import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class DifuntoService {

  constructor(private http: HttpClient) { }


getDifuntos(id) {
  let url = URL_SERVICIOS.difuntos+id+'/';

  return this.http.get(url);
}

postDifunto(difunto: FormData){
  let url = URL_SERVICIOS.difunto_post
  let httpOptions = {
    headers: new HttpHeaders({
    })
  }
  return this.http.post(url, difunto, httpOptions)
}

postResponsable(responsable: FormData){
  let url = URL_SERVICIOS.responsable_post
  let httpOptions = {
    headers: new HttpHeaders({
    })
  }
  return this.http.post(url, responsable, httpOptions)
}

getResponsable(id_difunto){
  let url = URL_SERVICIOS.responsable_get+id_difunto+'/'

  return this.http.get(url);
}
  
}