import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationContrasenaService } from "../../services/validation-contrasena/validation-contrasena.service";
import { faEdit } from '@fortawesome/free-solid-svg-icons';
import { UsuarioService } from '../../services/usuario/usuario.service'
import { of, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { PermisosService } from '../../services/permisos/permisos.service';
import { Permiso } from '../../models/permiso.model'

@Component({
  selector: 'app-perfil-configuracion',
  templateUrl: './perfil-configuracion.component.html',
  styleUrls: ['./perfil-configuracion.component.css']
})
export class PerfilConfiguracionComponent implements OnInit {

  submitted = false;
  faEdit = faEdit; 
  formEnable = false;
  public form_p_configuracion: FormGroup;
  permisoList: string[] = ['leer', 'escribir'];
  id: any;
  username: string;
  id_user: any;
  infoPermisos:Array<Permiso> = [];
  numericNumberReg = '[0-9]*';

  constructor(
    private fb: FormBuilder,
    private _match_contrasena : ValidationContrasenaService,
    private _serviceUser : UsuarioService,
    public _usuario: UsuarioService,
    public _usuarioService: UsuarioService,
    private _permiso: PermisosService,

  ) { }


  ngOnInit(): void {
    this.form_p_configuracion = this.fb.group({
      nombre: [null, Validators.compose([Validators.required])],
      apellido: [null, Validators.compose([Validators.required])],
      usuario: [null, Validators.compose([Validators.required])],
      correo: [null, Validators.compose([Validators.required, Validators.email])],
      contrasena: ["******"],
      conf_contrasena: ["******"],
      telefono: [null,[
        Validators.required,
        Validators.minLength(7),
        Validators.maxLength(10),
        Validators.pattern(this.numericNumberReg),
      ],
    ],
      rol: {value: null, disabled: true}
    },
    {
      validator: [this._match_contrasena.validateMatchContrasena(
        "contrasena",
        "conf_contrasena"
      ),
      this.min_len_Pass(),
      ]
    }
    );
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.username = localStorage.getItem('username');
    this.obtenerDatos(this.username);
    this.form_p_configuracion.disable();
  }


  obtenerDatos(username){
    this._serviceUser.getDatosUser(username).subscribe(
      async (resp) => {
        console.log(resp);

        let rol: string;
        if(resp['tipo_usuario'] == 'ha'){
          rol = 'Hyper Admin';
        }
        else if(resp['tipo_usuario'] == 'su'){
          rol = 'Super Admin'
        }
        else if(resp['tipo_usuario'] == 'ad'){
          rol = 'Admin'
        }
        this.id_user = resp['id'];
        this.form_p_configuracion.patchValue({
          nombre: resp['first_name'],
          apellido: resp['last_name'],
          usuario: resp['username'],
          correo: resp['email'], 
          telefono: resp['telefono'],
          rol: rol, 
          
        });

        let misPermisos:{};
        console.log(this.id_user);
        await this._permiso.getMisPermisos(this.id_user)
        .then(async (resp:any)=>{
          misPermisos = resp;
          console.log(resp);
          console.log(typeof(resp));
          
          for(let i of Object.keys(misPermisos)){
            console.log(misPermisos[i]["id_permiso"])
            await this._permiso.getInfoPermiso(((misPermisos[i])["id_permiso"]))
            .then((resp:any) =>{
              console.log(resp);
              this.infoPermisos.push(resp);
            })
          }
          console.log(this.infoPermisos)

        })
        
        

      }
    )
  }

  get f() {
    return this.form_p_configuracion.controls;
  }

  get contrasena(){
    return this.form_p_configuracion.get('contrasena');
  }

  min_len_Pass() {
    // let username = this.adminForm.value.usuario;
    // username = String(username);
    return (formGroup: FormGroup) =>{
      
      const contrasenaControl = formGroup.controls['contrasena'];
      if (contrasenaControl.errors && ! contrasenaControl.errors.min_len_Pass) {
        // return if another validator has already found an error on the matchingControl
        return;
      }
      if ((contrasenaControl.value).length < 6) {
        console.log("Estoy harto")
        contrasenaControl.setErrors({ min_len_Pass: true });
      } else {
        contrasenaControl.setErrors(null);
      }
    }
  }
  editarDatos() {
    const formData = new FormData();
    formData.append('first_name', this.form_p_configuracion.value.nombre);
    formData.append('last_name', this.form_p_configuracion.value.apellido);
    formData.append('username', this.form_p_configuracion.value.usuario);
    formData.append('email', this.form_p_configuracion.value.correo);
    formData.append('telefono', this.form_p_configuracion.value.telefono);
    formData.append('genero', '');
    formData.append('direccion', '');
    formData.append('is_active', 'True');
    formData.append('id_camposanto', this.id.camposanto);

    if(this.form_p_configuracion.value.conf_contrasena != "******"){
    formData.append('password', this.form_p_configuracion.value.conf_contrasena);
    console.log(formData.get('password'));
  }
    
    
    this._usuario
       .actualizarAdmin(formData, this.username)
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
        async (resp: any) => {

          if(localStorage.getItem('username') != formData.get('username')){
            localStorage.setItem('username', this.form_p_configuracion.value.usuario);     
            this.username = localStorage.getItem('username');
          }
          
          window.location.reload();
          Swal.close();
          Swal.fire("Cambios realizados satisfactoriamente");
          return true;
        },
        (error) => {
          console.error('Error:' + error);
          return throwError(error);
        },
        () => console.log('HTTP request completed.')
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
 
  onSubmit() {
    this.submitted = true;
    if (this.form_p_configuracion.valid) {
      Swal.showLoading();
      this.editarDatos();

    } else {
      return;
    }
  }

  edForm(){
    if(!this.formEnable){
      this.form_p_configuracion.enable();
      this.formEnable = true;
      this.form_p_configuracion.controls['rol'].disable();
    }
    else{
      this.form_p_configuracion.disable();
      this.formEnable = false;
      this.form_p_configuracion.controls['rol'].disable();
    }
  }
  submit() {
    console.log(this.form_p_configuracion.value);
  }
}
