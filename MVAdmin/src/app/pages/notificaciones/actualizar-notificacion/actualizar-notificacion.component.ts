import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import Swal from 'sweetalert2';
import URL_SERVICIOS from 'src/app/config/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-actualizar-notificacion',
  templateUrl: './actualizar-notificacion.component.html',
  styleUrls: ['./actualizar-notificacion.component.css'],
})
export class ActualizarNotificacionComponent implements OnInit {
  notificacion: any;
  @ViewChild('closebuttonActualizar') closebuttonActualizar;

  public form_actualizarNotificacion: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificacionesService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form_actualizarNotificacion = this.fb.group({
      titulo: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(70),
        ]),
      ],
      mensaje: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ]),
      ],
      tipo: [null, Validators.compose([Validators.required])],
    });
    this._notificacion.updateData$.subscribe((data) => {
      this.notificacion = data;
      this.cargarNotificacion(this.notificacion);
    });
  }

  async actualizarNotificacion() {
    const data = await this.cargarData();
    await Swal.fire({
      title: '¿Está seguro que desea actualizar la Notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Actualizando...',
          onOpen: async () => {
            await Swal.showLoading();
            await this._notificacion
              .putNotificacion(data, this.notificacion['id_notificacion'])
              .subscribe(
                async (resp) => {
                  await Swal.close();
                  await this.closebuttonActualizar.nativeElement.click();
                  await Swal.fire({
                    icon: 'success',
                    title: 'Se ha actualizado con éxito el notificación',
                  });
                  this._notificacion.reload_Notificaciones('reload');
                },
                async (error) => {
                  await Swal.close();
                  await Swal.fire({
                    icon: 'error',
                    title: 'Error...',
                    text: 'No se ha podido actualizar!',
                  });
                }
              );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  cargarData() {
    const data = new FormData();
    const datosForm = this.form_actualizarNotificacion.value;
    data.append('titulo', datosForm['titulo']);
    data.append('mensaje', datosForm['mensaje']);
    data.append('estado', this.notificacion['estado']);
    data.append('fecha_created', this.getFecha());
    data.append('id_camposanto', this.notificacion['id_camposanto']);
    data.append('tipo', datosForm['tipo']);
    return data;
  }

  getFecha() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
  }

  cargarNotificacion(elemento) {
    this.form_actualizarNotificacion.controls['titulo'].setValue(
      elemento['titulo']
    );
    this.form_actualizarNotificacion.controls['mensaje'].setValue(
      elemento['mensaje']
    );
    this.form_actualizarNotificacion.controls['tipo'].setValue(
      elemento['tipo']
    );
  }
}
