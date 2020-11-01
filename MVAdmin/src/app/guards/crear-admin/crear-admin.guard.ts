import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { PermisosService } from 'src/app/services/permisos/permisos.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class CrearAdminGuard implements CanActivate {
  user: any;
  permiso_pagina: String = 'registrar_admin';
  constructor(
    private auth: UsuarioService,
    private _permiso: PermisosService,
    public router: Router,
  ) {}
  async canActivate(){
    await this.auth.getDatosUser(localStorage.getItem('username')).toPromise().then(
      (data) => {
        console.log(data)
        this.user = data
      }
    );
    if(this.user){
      let tipo_u = localStorage.getItem('tipo_user');
      if(tipo_u != 'ha'){
        let permisos = await this._permiso.obtenerListaPermisos();
        if(permisos.includes(this.permiso_pagina)){
          return true;
        }
        else{
          Swal.fire('No tiene permisos para crear administradores');
          this.router.navigate(['/inicio/administradores']);
        }
      }
      else{
        return true;
      }
    }
    else{
      return false;
    }
  }
  
}
