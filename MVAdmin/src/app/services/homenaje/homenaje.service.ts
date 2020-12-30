import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class HomenajeService {

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }

  getHomenajesFree(id) {
    const url = URL_SERVICIOS.homenajesFree + id + '/';

    return this.http.get(url);
  }

  getHomenajesPaid(id) {
    const url = URL_SERVICIOS.homenajesPaid + id + '/';

    return this.http.get(url);
  }

  postImagen(imagen): Observable<FormData>{
    const url = URL_SERVICIOS.himagen_post;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.usuarioService.getToken(),
      })
    };
    return this.http.post<FormData>(url, imagen, httpOptions);

  }

  postYoutube(video){
    const url = URL_SERVICIOS.hyoutube_post;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.usuarioService.getToken(),
      })
    };
    return this.http.post(url, video, httpOptions);

  }

  postHomenaje(homenaje): Observable<FormData>{
    const url = URL_SERVICIOS.homenaje_post;
    const httpOptions = {
      headers: new HttpHeaders({
        Authorization: 'Bearer ' + this.usuarioService.getToken(),
      })
    };
    return this.http.post<FormData>(url, homenaje, httpOptions);
  }
}
