import { Injectable } from '@angular/core';
import { FormGroup, AbstractControl } from "@angular/forms";

@Injectable({
  providedIn: 'root'
})
export class ValidationContrasenaService {

  constructor() { }
  validateMatchContrasena(contrasena: string, conf_contrasena: string) {
    return (formGroup: FormGroup) => {
      const contrasenaControl = formGroup.controls[contrasena];
      const conf_contrasenaControl = formGroup.controls[conf_contrasena];

      if (!contrasenaControl || !conf_contrasenaControl) {
          return null;
      }
      if (contrasenaControl.errors && !conf_contrasenaControl.errors.passwordMismatch) {
          return null;
      }
      if (contrasenaControl.value !== conf_contrasenaControl.value) {
          conf_contrasenaControl.setErrors({ passwordMismatch: true });
      }
      else {
          contrasenaControl.setErrors(null);
      }
    };
  }
}
