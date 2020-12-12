import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2'
import { throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model'
import { Camposanto } from 'src/app/models/camposanto.model';
import { Empresa } from 'src/app/models/empresa.model';
import { CamposantoService } from 'src/app/services/servicios.index';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form_login: FormGroup;
  private user: any;
  private usuarioLog: any
  camposanto: Camposanto;
  empresa: Empresa;
  constructor(
    private formb: FormBuilder,
    public _usuarioService: UsuarioService,
    public router: Router,
    public _servicio: CamposantoService, 
  ) {
    this.validarSesion();
  }

  ngOnInit(): void {
    this.form_login = this.formb.group({
      username: [null, Validators.compose([Validators.required])],
      contrasena: [null, Validators.compose([Validators.required])]
    });
    this.user = {
      username: ' ',
      password: ' '
    };
  }

  async loginUser(form){
    if(form.invalid){
      
      return; 
    }
    this.user.username = form.value.username;
    this.user.password = form.value.contrasena;

    await this._usuarioService.loginUser(this.user).toPromise().then( 
      resp=>{
        Swal.close();
        let username = localStorage.getItem('username');
        console.log(username);
        this.usuarioSesion(username);
        console.log('token creado desde componente login', resp)
        
      },
      error => {
        console.error('Error:' + error);
        Swal.close();
        Swal.fire('Correo o contraseña Incorrectos','Intente nuevamente.')
        this.form_login.reset();
        return throwError(error);
      }); 

  }

  tokenGestion(token){
    const token_parts = token.split(/\./);
    const token_decoded = JSON.parse(window.atob(token_parts[1]));
    return token_decoded;
  }

  submit() {
    console.log(this.form_login.value);
    Swal.showLoading();
    this.loginUser(this.form_login);
  }

  async usuarioSesion(username){
    await this._usuarioService.getDatosUser(username).toPromise().then(
      (data) => {
        localStorage.setItem('tipo_user', data['tipo_usuario']);
        console.log(data)
        console.log(localStorage.getItem('tipo_user'))
        // console.log('///',data['id_camposanto'])
        // this.cargarCamposanto(data['id_camposanto']);
        if(data['tipo_usuario'] == 'ha'){
          this.router.navigate(['/dashboard']);
        }
        else if(data['tipo_usuario'] == 'su' || data['tipo_usuario'] == 'ad'){
          console.log(data['tipo_usuario']);
          console.log(data['id_camposanto']);
          this.router.navigate(['/inicio/perfil/'+data['id_camposanto']]);
          console.log("Sigo aqui");
        }
        else{
          localStorage.removeItem('tipo_user'); 
          localStorage.removeItem('token'); 
          localStorage.removeItem('user');
          localStorage.removeItem('username');
          localStorage.removeItem('id');
          Swal.close();
          Swal.fire('No está autorizado.','No tiene permitido acceder a está página.')
          this.form_login.reset();
        }
      }
    );
  }
  validarSesion(){
    if(this._usuarioService.isAuthenticated()){
      let username = localStorage.getItem('username');
        this.usuarioSesion(username);
    }
  }

}
