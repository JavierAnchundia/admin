import { Component, EventEmitter, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { PaquetesService } from 'src/app/services/paquetes/paquetes.service';
import URL_SERVICIOS from 'src/app/config/config';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import Swal from 'sweetalert2';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-paquetes',
  templateUrl: './paquetes.component.html',
  styleUrls: ['./paquetes.component.css'],
})
export class PaquetesComponent implements OnInit {
  id: any;
  url_backend: string = URL_SERVICIOS.url_backend;
  faPen = faPen;
  faPlus = faPlus;
  paquete: any = [];

  public displayedColumns = [
    'imagen',
    'nombre',
    'descripcion',
    'fecha',
    'precio',
    'update',
    'delete',
  ];
  public dataSource = new MatTableDataSource<any>();
  @ViewChild(MatSort) sort: MatSort;
  constructor(private _paquetes: PaquetesService, private datepipe: DatePipe) {}

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarPaquetes(this.id.camposanto);
    this._paquetes.reloadPaquetes$.subscribe((message) => {
      if (message == 'reload') {
        this.cargarPaquetes(this.id.camposanto);
      }
    });
  }

  cargarPaquetes(id) {
    Swal.showLoading();
    this._paquetes.getPaquetes(id).subscribe(
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

  async deletePaquete(id) {
    await Swal.fire({
      title: '¿Está seguro que desea eliminar el paquete?',
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
            this._paquetes.deletePaquete(id).subscribe(
              async (resp) => {
                await Swal.close();
                await Swal.fire(
                  'Se ha eliminado con éxito el paquete',
                  '',
                  'success'
                );
                this.cargarPaquetes(this.id.camposanto);
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

  cargarPaqueteModal(elemento) {
    this.paquete = elemento;
    this._paquetes.recarga_Data(this.paquete);
  }
}
