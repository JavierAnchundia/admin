import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RecuperarContrasenaService {

  constructor(
    public http: HttpClient,
    public router: Router,
  ) { }

  recuperarContrasena(username){

    let url = URL_SERVICIOS.recuperar_contrasena + username + '/';
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': "*",
      })
    }
    
    return this.http.get(url, httpOptions);

  }
}
