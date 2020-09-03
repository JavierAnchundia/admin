import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Red_social } from '../../models/red_social.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RedsocialService {

  constructor(private http: HttpClient) { }

  getRedes(value) {
    let url = URL_SERVICIOS.red_social+value+'/';

    return this.http.get(url);
  }

  putRedes(value, data) {
    let url = URL_SERVICIOS.red_social_put+value+'/';
    let httpOptions = {
      headers: new HttpHeaders({
      })
    }
    return this.http.put(url, data, httpOptions);
  }

  postRedes(redes:Red_social):Observable<Red_social>{
    let url = URL_SERVICIOS.red_social_post;
    let httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
      })
    }
    return this.http.post<Red_social>(url, redes)
  }
}
