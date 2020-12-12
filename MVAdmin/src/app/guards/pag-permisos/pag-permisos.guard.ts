import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import {PermisosService} from '../../services/permisos/permisos.service' 
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario/usuario.service'

@Injectable({
  providedIn: 'root'
})
export class PagPermisosGuard implements CanActivate {
  
  tipo_user: any;
  id_cementerio: any;
  constructor(
    private router:Router, 
    private _permisos:PermisosService,
    private auth: UsuarioService,
    ){}


  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot){
    
    let mis_permisos;
    let resultado;

    if(this.auth.isAuthenticated()){
      this.tipo_user =  localStorage.getItem('tipo_user');
      this.id_cementerio = JSON.parse(localStorage.getItem('camposanto')).camposanto;
      if(this.tipo_user == 'ha'){
        console.log("HiperAdmin");
        return true;
      }
    }
    await this._permisos.getMisPermisosInfo((JSON.parse(localStorage.getItem('user'))).user_id )
      .then((resp:any) =>{
        for(let i of Object.keys(resp)){
          resultado = (route.data.titulo == resp[i]["permiso_name"])? true:false
          if(resultado) return true;
        }
        Swal.fire('No tiene permisos para usar esa página');
        console.log("Holi")
        console.log(this.id_cementerio.camposanto);
        this.router.navigate(['/inicio/perfil/'+ this.id_cementerio]);
        return false;

      })
    
    return true;
  }
  
}

