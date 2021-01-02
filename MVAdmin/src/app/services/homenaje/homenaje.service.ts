import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpEvent, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UsuarioService } from '../usuario/usuario.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HomenajeService {
  private loadMemorial = new Subject<any>();
  updateData$ = this.loadMemorial.asObservable();

  constructor(
    private http: HttpClient,
    private usuarioService: UsuarioService
  ) { }
  
  getToken() {
    return localStorage.getItem('token');
  }

  bloquearHomenaje(homenaje:FormData, id_homenaje){
    let url = URL_SERVICIOS.homenajeDelete + id_homenaje + '/';
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer ' + this.getToken(),
      })
    }
    return this.http.put(url, homenaje, httpOptions);
  }
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

  recarga_Data(data: any) {
    this.loadMemorial.next(data);
  }

  updateHomenaje(id, homenaje){
    const url = URL_SERVICIOS.homenajeUpd + id + '/';
    const httpOptions = {
    headers: new HttpHeaders({
    })
  };
    return this.http.put(url, homenaje, httpOptions);
  }

  updateHImagen(id, homenaje){
    const url = URL_SERVICIOS.himagenUpd + id + '/';
    const httpOptions = {
    headers: new HttpHeaders({
    })
  };
    return this.http.put(url, homenaje, httpOptions);
  }

  updateHYoutube(id, homenaje){
    const url = URL_SERVICIOS.hyoutubeUpd + id + '/';
    const httpOptions = {
    headers: new HttpHeaders({
    })
  };
    return this.http.put(url, homenaje, httpOptions);
  }

  deleteAudio(id){
    let url = URL_SERVICIOS.del_audio + id +'/'

    return this.http.delete(url);
  }

  deleteImagen(id){
    let url = URL_SERVICIOS.del_img + id +'/'

    return this.http.delete(url);
  }

  deleteVideo(id){
    let url = URL_SERVICIOS.del_video + id +'/'

    return this.http.delete(url);
  }

  deleteMensaje(id){
    let url = URL_SERVICIOS.del_mensaje + id +'/'

    return this.http.delete(url);
  }
  
  deleteYoutube(id_youtube){
    let url = URL_SERVICIOS.del_youtube + id_youtube +'/'

    return this.http.delete(url);
  }
}
