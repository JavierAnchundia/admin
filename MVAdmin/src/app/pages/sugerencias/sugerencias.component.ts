import { Component, OnInit, ViewChild } from '@angular/core';
import { faPen, faPlus } from '@fortawesome/free-solid-svg-icons';
import { MatTableDataSource } from '@angular/material/table';
import { DatePipe } from '@angular/common';
import { MatSort } from '@angular/material/sort';
import { SugerenciasService } from 'src/app/services/sugerencias/sugerencias.service';
import URL_SERVICIOS from 'src/app/config/config';
import Swal from 'sweetalert2';
import {Sugerencia} from '../../models/sugerencia.model'
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-sugerencias',
  templateUrl: './sugerencias.component.html',
  styleUrls: ['./sugerencias.component.css']
})
export class SugerenciasComponent implements OnInit {
  
  imagenZoom: any;

  id: any;
  url_backend: string = URL_SERVICIOS.url_backend;
  faPen = faPen;
  faPlus = faPlus;
  paquete: any = [];

  public displayedColumns = [
    'imagen',
    'mensaje',
    'usuario',
    'fecha',
    'delete',
  ];

  public dataSource = new MatTableDataSource<any>();
  public rowID:Sugerencia[];

  @ViewChild(MatSort) sort: MatSort;
  constructor(private _sugerencias: SugerenciasService, private datepipe: DatePipe,
    public dialog: MatDialog,
    ) {}

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarSugerencias(this.id.camposanto);

  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  };


  

  selectRow(templateRef, imagen) {
    this.imagenZoom = imagen;
     const dialogRef = this.dialog.open(templateRef,{
      height: '480px',
      width: '805px',
      });

   }

  cargarSugerencias(idCamposanto){
    console.log(this.id.camposanto)
    //Swal.showLoading();
    this._sugerencias.getSugerencias(idCamposanto).subscribe(
      (data: any) => {
        //Swal.close();
        this.dataSource.data = data.reverse() as any[];
      },
      (error) => {
        console.log(error)
        Swal.close();
        Swal.fire({
          icon: 'error',
          title: 'Error...',
          text: 'No se ha podido cargar las sugerencias!',
        });
      }
    );
  }

  public  deleteSugerencia = async (row) => {
    this.rowID = row as Sugerencia[];  

    await this._sugerencias.deleteSugerencia(this.rowID['id_contacto'])
    .then((resp:any) =>{
      this.cargarSugerencias(this.id.camposanto);
      Swal.close();
      Swal.fire('¡Sugerencia eliminada exitosamente!');
      console.log("Esto ha sido eliminado")
      console.log(resp);})
    .catch(function(error){
      Swal.close();
      Swal.fire('¡Hubo un problema, intente nuevamente!');
      console.log(error)
    })

  }


}
