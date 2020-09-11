import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2'
import { throwError } from 'rxjs';
import { Usuario } from '../../models/usuario.model'
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form_login: FormGroup;
  private user: any;
  private usuarioLog: any
  constructor(
    private formb: FormBuilder,
    public _usuarioService: UsuarioService,
    public router: Router,
  ) { }

  ngOnInit(): void {
    this.form_login = this.formb.group({
      email: [null, Validators.compose([Validators.required, Validators.email])],
      contrasena: [null, Validators.compose([Validators.required])]
    });
    this.user = {
      email: ' ',
      password: ' '
    };
  }

  async loginUser(form){
    if(form.invalid){
      
      return; 
    }
    this.user.email = form.value.email;
    this.user.password = form.value.contrasena;

    await this._usuarioService.loginUser(this.user).subscribe( 
      resp=>{
        Swal.close();
        
        console.log('token creado desde componente login')
        this._usuarioService.getDatosUser(this.user.email).subscribe(
          (data) => {
            if(data['tipo_usuario'] != 'uf'){
              this.router.navigate(['/inicio/dashboard']);
            }
            else{
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
}
