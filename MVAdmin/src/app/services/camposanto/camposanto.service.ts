import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Empresa } from '../../models/empresa.model';
import URL_SERVICIOS from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Camposanto } from 'src/app/models/camposanto.model';

@Injectable({
  providedIn: 'root'
})
export class CamposantoService {

  constructor(private http: HttpClient, private _usuarioService: UsuarioService,) { }

  getCamposantos() {
    let url = URL_SERVICIOS.camposantos;
    let httpOptions = {
      headers: new HttpHeaders({
        'Access-Control-Allow-Origin': "*",
        'Authorization': 'Bearer '+ this._usuarioService.getToken(),
      })
    }
    console.log(this._usuarioService.getToken())
    return this.http.get(url,httpOptions);
  }

  getCamposantoByID(id: String) {
    let url = URL_SERVICIOS.camposanto + id + '/';

    return this.http.get(url)
  }
//'Content-Type': 'multipart/form-data; boundary=AaB03x',

  postCamposanto(camposanto):Observable<FormData>{
    let url = URL_SERVICIOS.camposantos;
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+this._usuarioService.getToken(),
      })
    }
    return this.http.post<FormData>(url, camposanto, httpOptions)
  }

  putCamposanto(camposanto){
    let url = URL_SERVICIOS.camposanto + camposanto.id_camposanto + '/';
    return this.http.put(url, camposanto);
  }

  getEmpresas():Observable<Empresa[]>{
    let url = URL_SERVICIOS.empresas;
    return this.http.get<Empresa[]>(url);
  }

  getEmpresa(id: String):Observable<Empresa>{
    let url = URL_SERVICIOS.empresa_get + id + '/';
    return this.http.get<Empresa>(url);
  }

  putEmpresa(empresa: Empresa){
    console.log(empresa)
    let url = URL_SERVICIOS.empresa_get + empresa.id_empresa + '/';
    return this.http.put<Empresa>(url, empresa);
  }
}
