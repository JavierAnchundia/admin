import { Component, OnInit, Output, EventEmitter, HostListener } from '@angular/core';
import { ComunicateNavSiderService } from '../../services/comunicatens/comunicate-nav-sider.service';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit {
  nameUsuario: string = 'Administrador';
  nombreApellido: string = 'Administrador'
  id:any;
  isCollapsed = false;
  loggeduser=false;


  constructor(
    private comunicateNSService: ComunicateNavSiderService,
    private _usuario: UsuarioService,
    public router: Router
  ) { }

  
  cambiar() {
    this.comunicateNSService.toggle();
    let shand = document.getElementsByClassName('contenido') as HTMLCollectionOf<HTMLElement>;
    if(this.isCollapsed == true){
      shand[0].style.marginLeft= "100px";
    }else{
      shand[0].style.marginLeft= "218px";
    }
  }
  ngOnInit(): void {
    this.id = JSON.stringify(localStorage.getItem('id'));
    //this.getUser();
    this.getStatus();
    console.log(this.loggeduser)
  }

  getUser(){
    this._usuario.getUserId(this.id.user_id)
    .subscribe((resp:any)=>
      {
        console.log(resp)
      }
    )
  }
  getStatus(){
    this.loggeduser = this._usuario.isLoggedin;
    return this.loggeduser;
  }

  logged(){
    this.loggeduser = this._usuario.isLoggedin;
  }

  logout(){
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
        this._usuario.logoutUser();
        this.getStatus();
        this.router.navigate(['/login'])
      } else if (result.dismiss === Swal.DismissReason.cancel) {
        Swal.fire(
          'Cancelled',
          'error'
        )
      }
    })
  }
}