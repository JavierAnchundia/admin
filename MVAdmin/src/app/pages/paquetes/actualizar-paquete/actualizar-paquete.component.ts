import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaquetesService } from 'src/app/services/paquetes/paquetes.service';
import Swal from 'sweetalert2';
import URL_SERVICIOS from 'src/app/config/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-actualizar-paquete',
  templateUrl: './actualizar-paquete.component.html',
  styleUrls: ['./actualizar-paquete.component.css'],
})
export class ActualizarPaqueteComponent implements OnInit {
  archivo: File = null;
  nameLogo: string = 'seleccione archivo';
  paquete: any;
  url_backend: string = URL_SERVICIOS.url_backend;
  @ViewChild('closebuttonActualizar') closebuttonActualizar;

  public form_actualizarPaquete: FormGroup;
  constructor(
    private fb: FormBuilder,
    private _paquete: PaquetesService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.form_actualizarPaquete = this.fb.group({
      nombre: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(5),
          Validators.maxLength(70),
        ]),
      ],
      precio: [
        null,
        Validators.compose([
          Validators.required,
          Validators.pattern(/^\d+(\.\d{0,2})?$/),
        ]),
      ],
      descripcion: [
        null,
        Validators.compose([
          Validators.required,
          Validators.minLength(10),
          Validators.maxLength(500),
        ]),
      ],
      imagen: [null, Validators.compose([])],
    });
    this._paquete.updateData$.subscribe((data) => {
      this.paquete = data;
      this.cargarPaquete(this.paquete);
    });
  }

  selectFile(event) {
    this.archivo = event.target.files[0];
    this.nameLogo = event.target.files[0].name;
  }

  async actualizarPaquete() {
    let data = await this.cargarData();
    await Swal.fire({
      title: '¿Está seguro que desea actualizar el paquete?',
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
            await this._paquete
              .putPaquete(data, this.paquete['id_paquete'])
              .subscribe(
                async (resp) => {
                  await Swal.close();
                  await this.closebuttonActualizar.nativeElement.click();
                  await Swal.fire({
                    icon: 'success',
                    title: 'Se ha actualizado con éxito el paquete',
                  });
                  this._paquete.reload_Paquetes('reload');
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
    let data = new FormData();
    let datosForm = this.form_actualizarPaquete.value;
    data.append('nombre', datosForm['nombre']);
    data.append('descripcion', datosForm['descripcion']);
    data.append('precio', datosForm['precio']);
    data.append('fecha_created', this.getFecha());
    data.append('id_camposanto', this.paquete['id_camposanto']);
    if (datosForm['imagen'] != null) {
      data.append('imagen', this.archivo);
    }
    return data;
  }

  getFecha() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
  }

  cargarPaquete(elemento) {
    this.form_actualizarPaquete.controls['nombre'].setValue(elemento['nombre']);
    this.form_actualizarPaquete.controls['precio'].setValue(elemento['precio']);
    this.form_actualizarPaquete.controls['descripcion'].setValue(
      elemento['descripcion']
    );
  }
}
