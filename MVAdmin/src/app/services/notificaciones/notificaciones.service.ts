import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NotificacionesService {
  private _reloadData = new Subject<string>();
  reloadNotificacion$ = this._reloadData.asObservable();

  private _loadNotificacion = new Subject<any>();
  updateData$ = this._loadNotificacion.asObservable();

  constructor(private http: HttpClient) {}

  getNotificaciones(id) {
    let url = URL_SERVICIOS.notificacion_list + id + '/';
    return this.http.get(url);
  }

  deleteNotificacion(id) {
    let url = URL_SERVICIOS.notificacion_put_del + id + '/';
    return this.http.delete(url);
  }

  putNotificacion(data: FormData, id) {
    let url = URL_SERVICIOS.notificacion_put_del + id + '/';
    return this.http.put(url, data);
  }

  postNotificacion(data: FormData) {
    let url = URL_SERVICIOS.notificacion_add;
    return this.http.post(url, data);
  }

  sendPushNotification(id) {
    let url = URL_SERVICIOS.enviarNotificacionPush + id + '/';
    return this.http.get(url);
  }

  reload_Notificaciones(message: string) {
    this._reloadData.next(message);
  }

  recarga_Data(data: any) {
    this._loadNotificacion.next(data);
  }
}
