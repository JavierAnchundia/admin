import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, FormArray } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { Validators } from '@angular/forms';
import {MustMatchService} from '../../services/must-match/must-match.service'
import {DashboardService} from '../../services/dashboard/dashboard.service'
import {Camposanto} from '../../models/camposanto.model';
import { UsuarioService } from '../../services/usuario/usuario.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { throwError } from 'rxjs';

@Component({
  selector: 'app-crear-admin',
  templateUrl: './crear-admin.component.html',
  styleUrls: ['./crear-admin.component.css']
})
export class CrearAdminComponent implements OnInit {

  adminForm: FormGroup;
  submitted = false;
  cementerios: Array<Camposanto>;
  generoOptions = ["Femenino", "Masculino"]
  monthNames = ["Ene", "Feb", "Mar", "Abr", "May", "Jun",
    "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];
  permisoPaginas = false;
  variable:Boolean= true;
  disabled = true;
  id:any;
  constructor(private fb: FormBuilder, public mustMatchService: MustMatchService, 
    public dashboardService: DashboardService, public _usuario: UsuarioService,
    public router: Router) { 
    this.cementerios = dashboardService.cementerios;
  }
  
  ngOnInit(): void {
    this.id = localStorage.getItem('camposanto');
    
    console.log(this.id.camposanto)
    this.adminForm = this.fb.group({
      usuario: [null, Validators.compose([Validators.required])],
      correo: [null, Validators.compose([Validators.required, Validators.email])],
      firstName: [null, Validators.required],
      lastName: [null, Validators.required],
      contrasena: [null, [Validators.required, Validators.minLength(6)]],
      repetirContrasena: [null, Validators.required],
      telefono: [null, Validators.required],
      tipoAdmin: [null, Validators.required],
      cementerio: [null, Validators.required],
      permisoToggle: [null],
      crearAdmin: [null, ],
      subirHomenaje: [null, ],
      crearTarifasHomenaje: [null, ],
      registrarDifunto: [null, ],
      eliminarHomenajes: [null, ],
      editarRolesUsuarios: [null,],
      mostrarTipsRecyNot: [null, ],}, 
      {
        validator: this.mustMatchService.MustMatch('contrasena', 'repetirContrasena')
      });

 
  }


  get f() { return this.adminForm.controls; }

  get usuario() {return this.adminForm.get('usuario');}
  get correo() {return this.adminForm.get('correo');}
  get firstName() {return this.adminForm.get('firstName');}
  get lastName() {return this.adminForm.get('lastName');}
  get contrasena() {return this.adminForm.get('contrasena');}
  get repetirContrasena() {return this.adminForm.get('repetirContrasena');}
  get telefono() {return this.adminForm.get('telefono');}
  get tipoAdmin() {return this.adminForm.get('tipoAdmin');}
  get cementerio() {return this.adminForm.get('cementerio');}
  get crearAdmin() {return this.adminForm.get('crearAdmin');}
  get subirHomenaje() {return this.adminForm.get('subirHomenaje');}
  get crearTarifasHomenaje() {return this.adminForm.get('crearTarifasHomenaje');}
  get registrarDifunto() {return this.adminForm.get('registrarDifunto');}
  get eliminarHomenajes() {return this.adminForm.get('eliminarHomenajes');}
  get editarRolesUsuarios() {return this.adminForm.get('editarRolesUsuarios');}
  get mostrarTipsRecyNot() {return this.adminForm.get('mostrarTipsRecyNot');}
  get permisoToggle() {return this.adminForm.get('permisoToggle');}



  onChange(){
    this.disabled= !this.permisoToggle.value;
    console.log(this.permisoToggle.value);
  }


  onSubmit() {
    this.submitted = true;
    if (this.adminForm.valid ) {
      Swal.showLoading()
      this.registrarAdministrador();
    } else {
      
        console.log(this.adminForm.invalid)
        console.log(this.adminForm.value)
        return;
      
    }
  }

  get hasDropDownError() {
    return (
      this.adminForm.get('generoDropdown').touched &&
      this.adminForm.get('generoDropdown').errors &&
      this.adminForm.get('generoDropdown').errors.required
    )
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
    formData.append('id_camposanto', this.adminForm.value.cementerio);
    formData.append('tipo_usuario',this.adminForm.value.tipoAdmin);

    
    
    this._usuario.crearUsuario(formData)
                        .subscribe(
                          (resp:any)=>{
                            console.log(resp);
                            Swal.close()
                            Swal.fire('¡Registro Exitoso!')
                            this.router.navigate(['/inicio/administradores']);

                            return true;
                          },
                          error => {
                            console.error('Error:' + error);
                            Swal.close()
                            Swal.fire("Hubo un error al guardar los datos, intentelo de nuevo");
                    
                            return throwError(error);
                          }
                        );
    
    
   
    console.log('Forma valida', this.adminForm.valid)
    
   
  }

}
