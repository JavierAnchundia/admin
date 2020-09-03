import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2'
import { throwError } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public form_login: FormGroup;
  private user: any;

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

  loginUser(form){
    if(form.invalid){
      return; 
    }
    this.user.email = form.value.email;
    this.user.password = form.value.contrasena;

    this._usuarioService.loginUser(this.user)
                        .subscribe( resp=>{
                          Swal.close();
                          console.log(resp);
                          console.log('token creado desde componente login')
                          this.router.navigate(['/inicio/dashboard']);

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
