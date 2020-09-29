import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import { MustMatchService } from '../../services/must-match/must-match.service';
import { DashboardService } from '../../services/dashboard/dashboard.service';
import { Camposanto } from '../../models/camposanto.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { PermisosService } from '../../services/permisos/permisos.service';
import { Permiso } from '../../models/permiso.model';
import { User_permiso } from '../../models/user_permisos.model'
@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrls: ['./crear-admin.component.css'],
})
export class CrearAdminComponent implements OnInit {
  adminForm: FormGroup;
  submitted = false;
  cementerios: Array<Camposanto>;
  generoOptions = ['Femenino', 'Masculino'];
  monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic',
  ];
  permisoPaginas = false;
  variable: Boolean = true;
  disabled = true;
  id: any;
  numericNumberReg = '[0-9]*';
  usernameLista: any = [];
  emailLista: any = [];
  lista_usuarios: any = [];
  lista_permisos: Permiso[] = [];
  permisos_admin = [];
  user_permi: User_permiso;
  constructor(
    private fb: FormBuilder,
    public mustMatchService: MustMatchService,
    public dashboardService: DashboardService,
    public _usuario: UsuarioService,
    public router: Router,
    private _permisoService: PermisosService
  ) {
    this.cementerios = dashboardService.cementerios;
    this.obtenerPermisos();
  }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.obtenerUsuarios();
    this.adminForm = this.fb.group(
      {
        usuario: [null, Validators.compose([Validators.required])],
        correo: [
          null,
          Validators.compose([Validators.required, Validators.email]),
        ],
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        contrasena: [null, [Validators.required, Validators.minLength(6)]],
        repetirContrasena: [null, Validators.required],
        telefono: [
          null,
          [
            Validators.required,
            Validators.minLength(7),
            Validators.maxLength(10),
            Validators.pattern(this.numericNumberReg),
          ],
        ],
        tipoAdmin: [null, Validators.required],
        permisoToggle: [null],
      },
      {
        validator:[ this.mustMatchService.MustMatch(
          'contrasena',
          'repetirContrasena'
        ),
          this.match_username(),
          this.match_email()
        ],
      }
    );
  }

  async obtenerPermisos() {
    await this._permisoService.getPermisos().subscribe((data) => {
      this.lista_permisos = data;
    });
  }
  async obtenerUsuarios() {
    await this._usuario
      .getUsersAll()
      .toPromise()
      .then((data: any[]) => {
        this.lista_usuarios = data;
      });
    for (let i = 0; i < this.lista_usuarios.length; i++) {
      this.usernameLista.push(this.lista_usuarios[i]['username']);
      if (this.lista_usuarios[i]['id_camposanto'] == this.id.camposanto) {
        this.emailLista.push(this.lista_usuarios[i]['email']);
      }
    }
  }

  match_username() {
    // let username = this.adminForm.value.usuario;
    // username = String(username);
    return (formGroup: FormGroup) =>{
      let list_username = this.usernameLista;
      const usernameControl = formGroup.controls['usuario'];
      if (usernameControl.errors && ! usernameControl.errors.match_username) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (list_username.includes(usernameControl.value)) {
        usernameControl.setErrors({ usernameMatch: true });
      } else {
        usernameControl.setErrors(null);
      }
    }
  }

  match_email() {
    // let correo_u = this.adminForm.value.correo;
    // correo_u = String(correo_u);
    return (formGroup: FormGroup) =>{
      let list_correo = this.emailLista;
      const correoControl = formGroup.controls['correo'];
      if (correoControl.errors && ! correoControl.errors.match_email) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if (list_correo.includes(correoControl.value)) {
        correoControl.setErrors({ correoMatch: true });
      } else {
        correoControl.setErrors(null);
      }
    }
  }

  get f() {
    return this.adminForm.controls;
  }

  get usuario() {
    return this.adminForm.get('usuario');
  }
  get correo() {
    return this.adminForm.get('correo');
  }
  get firstName() {
    return this.adminForm.get('firstName');
  }
  get lastName() {
    return this.adminForm.get('lastName');
  }
  get contrasena() {
    return this.adminForm.get('contrasena');
  }
  get repetirContrasena() {
    return this.adminForm.get('repetirContrasena');
  }
  get telefono() {
    return this.adminForm.get('telefono');
  }
  get tipoAdmin() {
    return this.adminForm.get('tipoAdmin');
  }
  get permisoToggle() {
    return this.adminForm.get('permisoToggle');
  }

  onChange() {
    this.disabled = !this.permisoToggle.value;
    console.log(this.permisoToggle.value);
  }

  obtenerChecksPermisos() {
    this.permisos_admin = [];
    let checkboxes = document.getElementsByName('permisos_Admin');
    // var checkboxesChecked = [];
    // loop over them all
    for (let i = 0; i < checkboxes.length; i++) {
      let checkitem = checkboxes[i] as HTMLInputElement;
      if (checkitem.checked) {
        this.permisos_admin.push(checkitem.value);
        //   checkboxesChecked.push(checkitem.value);
      }
    }
    console.log(this.permisos_admin);
  }
  onSubmit() {
    this.obtenerChecksPermisos();
    this.submitted = true;
    if (this.adminForm.valid) {
      Swal.showLoading();
      // this.registrarAdministrador();
      if (this.permisoToggle.value) {
        if (this.permisos_admin.length == 0) {
          Swal.fire({
            title: 'No ha seleccionado ningun permiso, por favor seleccione!!',
            icon: 'warning',
          });
          return;
        } else {
          this.registrarAdministrador();
        }
      } else if(!this.permisoToggle.value) {
        this.registrarAdministrador();
      }
    } else {
      return;
    }
  }

  get hasDropDownError() {
    return (
      this.adminForm.get('generoDropdown').touched &&
      this.adminForm.get('generoDropdown').errors &&
      this.adminForm.get('generoDropdown').errors.required
    );
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
  registrarAdministrador() {
    const formData = new FormData();
    formData.append('first_name', this.adminForm.value.firstName);
    formData.append('last_name', this.adminForm.value.lastName);
    formData.append('email', this.adminForm.value.correo);
    formData.append('username', this.adminForm.value.usuario);
    formData.append('password', this.adminForm.value.repetirContrasena);
    formData.append('telefono', this.adminForm.value.telefono);
    formData.append('genero', '');
    formData.append('direccion', '');
    formData.append('estado', 'True');
    formData.append('id_camposanto', this.id.camposanto);
    formData.append('tipo_usuario', this.adminForm.value.tipoAdmin);

    this._usuario
      .crearUsuario(formData)
      .pipe(
        catchError((err) => {
          Swal.close();
          Swal.fire(
            this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0])
          );
          return throwError(err);
        })
      )
      .subscribe(
        (resp: any) => {
          this.registrarPermisos(resp['id']);
          return true;
        },
        (error) => {
          console.error('Error:' + error);
          return throwError(error);
        },
        () => console.log('HTTP request completed.')
      );
  }

  async registrarPermisos(id_user){
    if(this.permisos_admin.length > 0){
      for(let i=0; i< this.permisos_admin.length; i++){
        this.user_permi = {
          id_user : id_user,
          id_permiso : this.permisos_admin[i]
      }
        await this._permisoService.postUser_permisos(this.user_permi).then();
      }
    }
    Swal.close();
    Swal.fire('¡Registro Exitoso!');
    this.router.navigate(['/inicio/administradores']);

  }
}
