import { Component, OnInit } from '@angular/core';
import {Camposanto} from '../../models/camposanto.model';
import {DashboardService} from '../../services/dashboard/dashboard.service'
import { CamposantoService } from 'src/app/services/servicios.index';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import URL_SERVICIOS from 'src/app/config/config';
import Swal from 'sweetalert2'
import { faTimesCircle } from '@fortawesome/free-solid-svg-icons';
import { faUserTag } from '@fortawesome/free-solid-svg-icons';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lista_camposanto: any[] = [];
  url_backend: String = URL_SERVICIOS.url_backend;
  nameUsuario: string = 'Administrador';
  tipoUsuario: string = 'Administrador'
  id: any;
  loggeduser = false;
  faTimesCircle = faTimesCircle;
  faUserTag = faUserTag;

  constructor(
    public _servicio: CamposantoService, 
    private router: Router,
    private _usuarioService : UsuarioService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    ) { 

      this.matIconRegistry.addSvgIcon(
        "pointer_verde",
        this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/pointer_verde.svg")
      );
  }

  ngOnInit(): void {
    this._usuarioService.loadStorage();
    this.cargarCamposantos();
    this.id = JSON.stringify(localStorage.getItem('id'));
    //this.getUser();
    let tipo = localStorage.getItem('tipo_user');
    this.verificarTipoUser(tipo);
  }

  verificarTipoUser(tipo){
    if(tipo == 'ha'){
      this.tipoUsuario = 'Hyper Administrador';
    }
    else if(tipo == 'su'){
      this.tipoUsuario = 'Super Administrador'
    }
    else if(tipo == 'ad'){
      this.tipoUsuario = 'Administrador'
    }
    // this.getStatus();
    this.nameUsuario = localStorage.getItem('username');
  }

  // getStatus() {
  //   this.loggeduser = this._usuarioService.isLoggedin;
  //   return this.loggeduser;
  // }


  logout() {
    Swal.fire({
      title: '¿Está seguro que desea salir?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No'
    }).then((result) => {
      if (result.value) {
        Swal.fire(
          '¡Se ha cerrado sesión!',
          'Sesión cerrada exitosamente'
        )
        this._usuarioService.logoutUser();
        this.router.navigate(['/login'])
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelado',
          'El cierre de sesión se ha cancelado'
        )
      }
    })
  }

  cargarCamposantos() {
    this._servicio.getCamposantos()
      .subscribe((resp: any) => {
        console.log('camposanto get')
        console.log(resp);
        this.lista_camposanto = resp;
        
      })
  }

  redirectProfile(value){
    this.router.navigate(['/inicio/perfil', value])
    console.log("id-> "+value);
  }
}