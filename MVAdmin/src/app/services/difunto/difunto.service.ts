import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DifuntoService {

  constructor(private http: HttpClient) { }

opts = [];


getDifuntos(id) {
  const url = URL_SERVICIOS.difuntos + id + '/';

  return this.http.get(url);
}

getDifunto(id_difunto) {
  const url = URL_SERVICIOS.difunto + id_difunto + '/';

  return this.http.get(url);
}

getDifuntosOpt(id) {
    const url = URL_SERVICIOS.difuntos + id + '/';
    const httpOptions = {
      headers: new HttpHeaders({
      })
    };
    return this.opts.length ?
      of(this.opts) :
      this.http.get<any>(url).pipe(tap(data => this.opts = data));
  }

putDifunto(difunto: FormData, id_difunto){
  const url = URL_SERVICIOS.difunto + id_difunto + '/';
  const httpOptions = {
    headers: new HttpHeaders({
    })
  };
  return this.http.put(url, difunto, httpOptions);
}
postDifunto(difunto: FormData){
  const url = URL_SERVICIOS.difunto_post;
  const httpOptions = {
    headers: new HttpHeaders({
    })
  };
  return this.http.post(url, difunto, httpOptions);
}
putResponable(responsable: FormData, id_difunto){
  const url = URL_SERVICIOS.responsable_get + id_difunto + '/';
  const httpOptions = {
    headers: new HttpHeaders({
    })
  };
  return this.http.put(url, responsable, httpOptions);

}
postResponsable(responsable: FormData){
  const url = URL_SERVICIOS.responsable_post;
  const httpOptions = {
    headers: new HttpHeaders({
    })
  };
  return this.http.post(url, responsable, httpOptions);
}

getResponsable(id_difunto){
  const url = URL_SERVICIOS.responsable_get + id_difunto + '/';

  return this.http.get(url);
}
  
}