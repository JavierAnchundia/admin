import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { PaquetesService } from 'src/app/services/paquetes/paquetes.service';
import Swal from 'sweetalert2';
import URL_SERVICIOS from 'src/app/config/config';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-paquete',
  templateUrl: './crear-paquete.component.html',
  styleUrls: ['./crear-paquete.component.css'],
})
export class CrearPaqueteComponent implements OnInit {
  archivo: File = null;
  id: any;
  nameLogo: string = 'seleccione archivo';
  url_backend: string = URL_SERVICIOS.url_backend;
  @ViewChild('closebuttonAgregar') closebuttonAgregar;
  public form_crearPaquete: FormGroup;

  constructor(
    private fb: FormBuilder,
    private _paquete: PaquetesService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.form_crearPaquete = this.fb.group({
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
      imagen: [null, Validators.compose([Validators.required])],
    });
  }

  selectFile(event) {
    this.archivo = event.target.files[0];
    this.nameLogo = event.target.files[0].name;
  }

  async agregarPaquete() {
    let data = await this.cargarData();
    let retorno;
    await Swal.fire({
      title: '¿Está seguro que desea crear el paquete?',
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
            await this._paquete.postPaquete(data).subscribe(
              async (resp) => {
                await Swal.close();
                await this.closebuttonAgregar.nativeElement.click();
                await Swal.fire(
                  'Se ha creado con éxito el paquete',
                  '',
                  'success'
                );
                await this.resetForm();
                this._paquete.reload_Paquetes('reload');
              },
              async (error) => {
                await Swal.close();
                await Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: 'No se ha podido crear el paquete!',
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
    let datosForm = this.form_crearPaquete.value;
    data.append('nombre', datosForm['nombre']);
    data.append('descripcion', datosForm['descripcion']);
    data.append('precio', datosForm['precio']);
    data.append('fecha_created', this.getFecha());
    data.append('id_camposanto', this.id.camposanto);
    data.append('imagen', this.archivo);
    return data;
  }

  getFecha() {
    let date = new Date();
    let latest_date = this.datepipe.transform(date, 'yyyy-MM-dd');
    return latest_date;
  }

  resetForm() {
    this.form_crearPaquete.reset();
    this.nameLogo = '';
  }
}
