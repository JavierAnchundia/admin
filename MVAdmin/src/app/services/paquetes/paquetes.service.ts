import { Injectable } from '@angular/core';
import URL_SERVICIOS from 'src/app/config/config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PaquetesService {
  private _reloadData = new Subject<string>();
  reloadPaquetes$ = this._reloadData.asObservable();

  private _loadPaquete = new Subject<any>();
  updateData$ = this._loadPaquete.asObservable();

  constructor(private http: HttpClient) {}

  getPaquetes(id) {
    let url = URL_SERVICIOS.paquetes_list + id + '/';
    return this.http.get(url);
  }

  deletePaquete(id) {
    let url = URL_SERVICIOS.paquete_put_del + id + '/';
    return this.http.delete(url);
  }

  putPaquete(data: FormData, id) {
    let url = URL_SERVICIOS.paquete_put_del + id + '/';
    return this.http.put(url, data);
  }

  postPaquete(data: FormData) {
    let url = URL_SERVICIOS.paquete_add;
    return this.http.post(url, data);
  }

  reload_Paquetes(message: string) {
    this._reloadData.next(message);
  }

  recarga_Data(data: any) {
    this._loadPaquete.next(data);
  }
}
