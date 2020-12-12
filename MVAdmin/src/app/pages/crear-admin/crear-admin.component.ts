import { Component, OnDestroy, OnInit, ɵConsole } from '@angular/core';
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
import {RenderizareditService} from '../../services/renderizaredit/renderizaredit.service'
import {Usuario} from '../../models/usuario.model'
import {UsuarioH} from '../../models/usuario_herencia.model'
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";

@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrls: ['./crear-admin.component.css'],
})
export class CrearAdminComponent implements OnInit, OnDestroy {
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
  administrador: UsuarioH = new UsuarioH();
  admin_permisos: Array<Permiso>;
  bool_permisos: Array<boolean>=[];
  mostrar_contrasena: Boolean = true;
  editando= false;
  info_admin: any;

  constructor(
    private fb: FormBuilder,
    public mustMatchService: MustMatchService,
    public dashboardService: DashboardService,
    public _usuario: UsuarioService,
    public router: Router,
    private _permisoService: PermisosService,
    private _editar: RenderizareditService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
  ) {
    this.cementerios = dashboardService.cementerios;
    this.matIconRegistry.addSvgIcon(
      "flecha2",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/flecha2.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "inhabilitada",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/inhabilitada.svg")
    );
    this.matIconRegistry.addSvgIcon(
      "habilitada",
      this.domSanitizer.bypassSecurityTrustResourceUrl("../../../assets/icons/habilitada.svg")
    );
  }

  ngOnDestroy():void{
    //localStorage.setItem('admin_info', JSON.stringify({admin:this.info_admin.admin, permisos:this.info_admin.permisos, metodo_conexion:('PUT')}));
  }

  async ngOnInit(): Promise<void> {
    await this.obtenerInfo();
    await this.obtenerPermisos();
    console.log(this.info_admin.admin);
    console.log(this.info_admin.metodo_conexion)
    console.log(this.administrador)
    console.log(this.admin_permisos)
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.obtenerUsuarios();
    
    this.adminForm = this.fb.group(
      {
        usuario: [this.administrador.username, Validators.compose([Validators.required])],
        correo: [this.administrador.email, Validators.compose([Validators.required, Validators.email]),],
        firstName: [this.administrador.first_name, Validators.required],
        lastName: [this.administrador.last_name, Validators.required],
        contrasena: [null, [Validators.required, Validators.minLength(6)]],
        repetirContrasena: [null, Validators.required],
        telefono: [
          this.administrador.telefono,
          [
            Validators.required,
            Validators.minLength(7),
            Validators.maxLength(10),
            Validators.pattern(this.numericNumberReg),
          ],
        ],
        tipoAdmin: [this.administrador.tipo_usuario, Validators.required],
        //permisoToggle: [null],
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
    
    if(this.info_admin.metodo_conexion == "PUT"){
        this.adminForm.get('contrasena').disable();
        this.adminForm.get('repetirContrasena').disable();

        this.mostrar_contrasena = false;
        if(this.administrador.tipo_usuario == "su"){
          this.adminForm.patchValue({
            tipoAdmin: "Super Administrador",
          })
        }
        else {
          this.adminForm.patchValue({
            tipoAdmin: "Administrador",
          })
        }
    }
    if(this.info_admin.metodo_conexion == "PUT" && this.admin_permisos.length > 0){
      this.adminForm.addControl('permisoToggle', new FormControl(true));
    }
    else{this.adminForm.addControl('permisoToggle', new FormControl(null));}

    this.onChange();
    
  }

  //Lo que va a hacer esta funcion es que va ver los ids de la lista de permisos que tiene un usuario y aparte de alli va a crear
  // un array booleano que tomara los valores de true justo en las paginas que el usuario tiene permiso
  permisosBool(lista_permisos:Permiso[], admin_permisos:Array<Permiso>){
    let id_permisoslist:Array<number> = [];
    console.log(lista_permisos)
    console.log(this.lista_permisos)
    console.log(this.admin_permisos)
    for(let i in admin_permisos){

      let id_permiso = admin_permisos[i].id_permiso as number;
      id_permisoslist.push(id_permiso);
      //this.bool_permisos[index - 1] = true;
    }

    console.log(this.bool_permisos)
    for( let i in lista_permisos){

      if(id_permisoslist.includes(lista_permisos[i].id_permiso as number))
      {
        this.bool_permisos.push(true);
      }
      else{this.bool_permisos.push(false)}
    }

    console.log(id_permisoslist)
    console.log(this.bool_permisos);
  }



  cambiarEstadoTrue(index){
    this.bool_permisos[index] = true;
    console.log(this.bool_permisos)
  }

  cambiarEstadoFalse(index){
    this.bool_permisos[index] = false;
    console.log(this.bool_permisos)
  }
  
  async obtenerInfo(){
    this.info_admin = JSON.parse(localStorage.getItem('admin_info'));
    if(this.info_admin.metodo_conexion == 'PUT'){
     this.editando = true;
     this.administrador = this.info_admin.admin;
     this.admin_permisos = await this.info_admin.permisos;
     console.log(this.admin_permisos);
    }
  }


  
  async obtenerPermisos() {
    await this._permisoService.getPermisos().subscribe(async (data) => {
      this.lista_permisos = await data;
      console.log(data)
      //Esta parte del codigo deberia haber sido llamada desde el metodo OnInit, pero si se lo pone ahi no se obtienen los datos "a tiempo"
      //A partir de la funcion asincronica, entonces para asegurarse que se van obtener las dos listas se los pone justamente aqui
        this.permisosBool(this.lista_permisos,this.admin_permisos);
        console.log(this.bool_permisos);
        
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
      if(this.info_admin.metodo_conexion == "PUT"){
        return;
      }
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
      if(this.info_admin.metodo_conexion =="PUT"){
        return;
      }
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
    //this.permisos_admin = [];
    //let checkboxes = document.getElementsByName('permisos_Admin');
    // var checkboxesChecked = [];
    // loop over them all
    //for (let i = 0; i < checkboxes.length; i++) {
      //let checkitem = checkboxes[i] as HTMLInputElement;
      //if (checkitem.checked) {
       // this.permisos_admin.push(checkitem.value);
        //   checkboxesChecked.push(checkitem.value);
      //}
   // }
    //console.log(this.permisos_admin);
    for (let i = 0; i < this.bool_permisos.length; i++){
      if(this.bool_permisos[i]){
         console.log(this.bool_permisos[i])
         this.permisos_admin.push(this.lista_permisos[i].id_permiso)}
    }
    console.log(this.permisos_admin);
  }
  onSubmit() {
    this.obtenerChecksPermisos();
    this.submitted = true;
    if (this.adminForm.valid) {
      Swal.showLoading();
      this.registrarAdministrador();
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
    formData.append('telefono', this.adminForm.value.telefono);
    formData.append('genero', '');
    formData.append('direccion', '');
    formData.append('is_active', 'True');
    formData.append('id_camposanto', this.id.camposanto);

    if(this.adminForm.value.tipoAdmin == "Super Administrador"){
      formData.append('tipo_usuario', "su");
    }
    else{
      formData.append('tipo_usuario', "ad");
    }

    if(this.info_admin.metodo_conexion == "POST"){
      formData.append('password', this.adminForm.value.repetirContrasena);
    }
  
    
  if(this.info_admin.metodo_conexion == "PUT"){
    this._usuario
       .actualizarAdmin(formData, this.info_admin.admin.username)
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
         await this.deletePermisos(resp['id'])
         console.log(this.permisos_admin)
          this.registrarPermisos(resp['id'])
          //this._permisoService.deleteMisPermisos(resp['id'])
          //this.registrarPermisos(resp['id']);
          
          return true;
        },
        (error) => {
          console.error('Error:' + error);
          return throwError(error);
        },
        () => console.log('HTTP request completed.')
      );
    

  }

  else{
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
          console.log(resp)
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
  }
  
  async deletePermisos(id_user){
    
    await this._permisoService.deleteMisPermisos(id_user)
    .then((resp:any) =>{
      console.log("Esto ha sido eliminado")
      console.log(resp);})
    .catch(function(error){
      console.log(error)
    })

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
    if(this.info_admin.metodo_conexion == "POST"){
    Swal.fire('¡Registro Exitoso!');}
    else{
      Swal.fire('¡Actualización Exitosa!');
    }
    this.router.navigate(['/inicio/administradores']);

  }
}
