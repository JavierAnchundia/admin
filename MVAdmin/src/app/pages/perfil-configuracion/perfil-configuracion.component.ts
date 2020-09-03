import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ValidationContrasenaService } from "../../services/validation-contrasena/validation-contrasena.service";
import { faEdit } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-perfil-configuracion',
  templateUrl: './perfil-configuracion.component.html',
  styleUrls: ['./perfil-configuracion.component.css']
})
export class PerfilConfiguracionComponent implements OnInit {
  faEdit = faEdit; 
  formEnable = false;

  public form_p_configuracion: FormGroup;
  permisoList: string[] = ['leer', 'escribir'];
  constructor(
    private fb: FormBuilder,
    private _match_contrasena : ValidationContrasenaService
  ) { }

  ngOnInit(): void {
    this.form_p_configuracion = this.fb.group({
      nombre: [null, Validators.compose([Validators.required])],
      apellido: [null, Validators.compose([Validators.required])],
      usuario: [null, Validators.compose([Validators.required])],
      correo: [null, Validators.compose([Validators.required, Validators.email])],
      contrasena: ["", Validators.compose([Validators.required])],
      conf_contrasena: ["", Validators.compose([Validators.required])],
      telefono: [null, Validators.compose([Validators.required])],
      rol: {value: null, disabled: true}
    },
    {
      validator: this._match_contrasena.validateMatchContrasena(
        "contrasena",
        "conf_contrasena"
      )
    }
    );
    this.form_p_configuracion.disable();
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
