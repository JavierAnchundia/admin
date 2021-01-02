import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { NotificacionesService } from 'src/app/services/notificaciones/notificaciones.service';
import URL_SERVICIOS from 'src/app/config/config';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-notificaciones',
  templateUrl: './notificaciones.component.html',
  styleUrls: ['./notificaciones.component.css'],
})
export class NotificacionesComponent implements OnInit {
  id: any;
  faPen = faPen;
  faPlus = faPlus;
  notificacion: any = [];

  public displayedColumns = [
    'titulo',
    'mensaje',
    'fecha',
    'tipo',
    'estado',
    'update',
    'delete',
    'enviar',
  ];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  constructor(
    private _notificacion: NotificacionesService,
    private datepipe: DatePipe
  ) {}

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarNotificaciones(this.id.camposanto);
    this._notificacion.reloadNotificacion$.subscribe((message) => {
      if (message == 'reload') {
        this.cargarNotificaciones(this.id.camposanto);
      }
    });
  }

  cargarNotificaciones(id) {
    Swal.showLoading();
    this._notificacion.getNotificaciones(id).subscribe(
      (data: any) => {
        Swal.close();
        this.dataSource.data = data.reverse() as any[];
      },
      (error) => {
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'No se ha podido cargar los paquetes!',
        });
      }
    );
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };

  async deleteNotificacion(id) {
    await Swal.fire({
      title: '¿Está seguro que desea eliminar el notificación?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Eliminando...',
          onOpen: async () => {
            await Swal.showLoading();
            this._notificacion.deleteNotificacion(id).subscribe(
              async (resp) => {
                await Swal.close();
                await Swal.fire(
                  'Se ha eliminado con éxito la notificación',
                  '',
                  'success'
                );
                this.cargarNotificaciones(this.id.camposanto);
              },
              async (error) => {
                await Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: 'No se ha podido eliminar!',
                });
              }
            );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  cargarNotificacionModal(elemento) {
    this.notificacion = elemento;
    this._notificacion.recarga_Data(this.notificacion);
  }

  async sendNotificacion(id) {
    await Swal.fire({
      title: '¿Está seguro que desea enviar las notificaciones push?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí',
      cancelButtonText: 'No',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Enviando...',
          onOpen: async () => {
            await Swal.showLoading();
            this._notificacion.sendPushNotification(id).subscribe(
              async (resp) => {
                await Swal.close();
                await Swal.fire(
                  'Se ha enviado con éxito las notificaciones',
                  '',
                  'success'
                );
                this.cargarNotificaciones(this.id.camposanto);
              },
              async (error) => {
                await Swal.fire({
                  icon: 'error',
                  title: 'Error...',
                  text: 'No se ha podido enviar las notificaciones!',
                });
              }
            );
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }
}
