import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';

@Injectable({
  providedIn: 'root'
})
export class PerfilCementerioGuard implements CanActivate {
  constructor(
    private auth: UsuarioService,
  ){ 
    
  }
  user: any;
  async canActivate(){
    await this.auth.getDatosUser(localStorage.getItem('username')).toPromise().then(
      (data) => {
        console.log(data)
        this.user = data
      }
    );
      if(this.user){
        return true;
      }
      else {
        return false;
      }
    
  }
  
}
