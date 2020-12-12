import { Injectable } from '@angular/core';
import { User_permiso } from '../../models/user_permisos.model'
import { Permiso } from '../../models/permiso.model'
import { HttpClient, HttpHeaders } from '@angular/common/http'
import { Observable } from 'rxjs';
import URL_SERVICIOS from 'src/app/config/config';
import { UsuarioService } from '../usuario/usuario.service';
import { Info_permiso_user } from 'src/app/models/info_permiso_user';

@Injectable({
  providedIn: 'root'
})
export class PermisosService {
  private httpOptions: any;
  lista_permisos: Permiso[] = [];
  permisos_user: any[] = [];
  misPermisos: any[] = []
  id: any;
  constructor(
    private http: HttpClient,
    private _usuarioService: UsuarioService,
  ) 
  { 
    this.httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
  }

  getPermisos():Observable<Permiso[]>{
    let url = URL_SERVICIOS.listar_permisos_general;
    return this.http.get<Permiso[]>(url);
  }

  async getInfoPermiso(id_permiso){

    let url = URL_SERVICIOS.info_permiso + id_permiso+ '/';
    console.log(url)
    return await this.http.get(url).toPromise();
  }
  async getMisPermisos(id_user){
    let url = URL_SERVICIOS.mis_user_permisos + id_user + "/";
    return await this.http.get<User_permiso[]>(url).toPromise();
  }

  async getMisPermisosInfo(id_user){
    let url = URL_SERVICIOS.info_permiso_user + id_user + "/";
    return await this.http.get<Info_permiso_user[]>(url).toPromise();
  }


  async deleteMisPermisos(id_user){
    let url = URL_SERVICIOS.mis_user_permisos + id_user + "/";
    return await this.http.delete<User_permiso[]>(url).toPromise();
  }
  async postUser_permisos(permiso: User_permiso){
    let url = URL_SERVICIOS.user_permisos_post;
    let httpOptions = {
      headers: new HttpHeaders({
        'Authorization': 'Bearer '+this._usuarioService.getToken(),
      })
    }
    return await this.http.post<User_permiso>(url, permiso, httpOptions).toPromise();
  }

  //Para obtener lista de mis permisos con user autenticado
  async obtenerPermisos(){
    let username = localStorage.getItem('username');
    await this._usuarioService.getDatosUser(username).toPromise().then(
      (data) => {
        this.id = data['id'];
        this.obtenermisPermisos(this.id);
      }
    )
  }

  async obtenermisPermisos(id){
    await this.getMisPermisos(id).then(
      (data) => {
        this.permisos_user = data;
      }
    )
  }

  async obtenerListaPermisos() {
    await this.obtenerPermisos();
    await this.getPermisos().toPromise().then((data) => {
      this.lista_permisos = data;
      for(let permiso in this.permisos_user){
        for(let l_permiso in this.lista_permisos){
          if(this.permisos_user[permiso].id_permiso == this.lista_permisos[l_permiso].id_permiso){
            this.misPermisos.push(this.lista_permisos[l_permiso].nombre);
          }
        }
      }
    });
    return this.misPermisos;
  }
}
