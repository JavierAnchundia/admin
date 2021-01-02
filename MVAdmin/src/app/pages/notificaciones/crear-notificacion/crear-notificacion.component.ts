import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import Swal from 'sweetalert2';
import URL_SERVICIOS from 'src/app/config/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-notificacion',
  templateUrl: './crear-notificacion.component.html',
  styleUrls: ['./crear-notificacion.component.css'],
})
export class CrearNotificacionComponent implements OnInit {
  id: any;
  @ViewChild('closebuttonAgregar') closebuttonAgregar;
  public form_crearNotificacion: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _notificacion: NotificacionesService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.form_crearNotificacion = this.fb.group({
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
          Validators.maxLength(100),
        ]),
      ],
      tipo: [null, Validators.compose([Validators.required])],
    });
  }

  async agregarNotificacion() {
    const data = await this.cargarData();
    await Swal.fire({
      title: '¿Está seguro que desea crear la notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Guardando...',
          onOpen: async () => {
            await Swal.showLoading();
            await this._notificacion.postNotificacion(data).subscribe(
              async (resp) => {
                await Swal.close();
                await this.closebuttonAgregar.nativeElement.click();
                await Swal.fire(
                  'Se ha creado con éxito la notificación',
                  '',
                  'success'
                );
                await this.resetForm();
                this._notificacion.reload_Notificaciones('reload');
              },
              async (error) => {
                await Swal.close();
                await Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: 'No se ha podido crear la notificación!',
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
    const datosForm = this.form_crearNotificacion.value;
    data.append('titulo', datosForm['titulo']);
    data.append('mensaje', datosForm['mensaje']);
    data.append('estado', 'no_enviada');
    data.append('fecha_created', this.getFecha());
    data.append('id_camposanto', this.id.camposanto);
    data.append('tipo', datosForm['tipo']);
    return data;
  }

  getFecha() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
  }

  resetForm() {
    this.form_crearNotificacion.reset();
  }
}
