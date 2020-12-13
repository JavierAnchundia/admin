import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot} from '@angular/router';
import { Observable } from 'rxjs';
import {PermisosService} from '../../services/permisos/permisos.service' 
import Swal from 'sweetalert2';
import { UsuarioService } from '../../services/usuario/usuario.service'
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
      console.log("Estoy dentro");
      this.tipo_user =  localStorage.getItem('tipo_user');

      if(this.tipo_user == 'ha'){
        console.log("HiperAdmin");
        return true;
      }

      await this.auth.getDatosUser(localStorage.getItem('username'))
       .pipe(
        catchError((err) => {
          Swal.close();
          Swal.fire(
          );
          return throwError(err);
        })
      )
      .subscribe(
        async (resp: any) => {        
          console.log(resp['id_camposanto']);
          this.id_cementerio = resp['id_camposanto'];
          return true;
        },
        (error) => {
          console.error('Error:' + error);
          return throwError(error);
        },
        () => console.log('HTTP request completed.')
      );

     // this.id_cementerio = JSON.parse(localStorage.getItem('camposanto')).camposanto;
      
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

  errorTranslateHandler(error: String) {
    switch (error) {
      case 'user with this email address already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este correo, intente con otro';
      }
      case 'user with this username already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este nombre de usuario, intente con otro';
      }
      default: {
        return 'Hubo un error al guardar los datos';
      }
    }
  }
  
}

