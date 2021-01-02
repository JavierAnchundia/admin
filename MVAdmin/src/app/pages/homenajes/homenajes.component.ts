import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { faPen, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';
import { HomenajeService } from '../../services/homenaje/homenaje.service';
import Swal from 'sweetalert2'
import { MatPaginator } from '@angular/material/paginator';
import { FormControl, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap, map } from 'rxjs/operators';
import { Difunto } from 'src/app/models/difunto.model';
import { DifuntoService } from 'src/app/services/difunto/difunto.service';

@Component({
  selector: 'app-homenajes',
  templateUrl: './homenajes.component.html',
  styleUrls: ['./homenajes.component.css']
})
export class HomenajesComponent implements OnInit {
  public id;
  difuntoControl = new FormControl('', Validators.required);
  tipoControl = new FormControl('', Validators.required);

  public displayedColumns = [];
  public dataSource = new MatTableDataSource<any>();
  disableSelect = new FormControl(false);

  @ViewChild(MatSort) sort: MatSort;
  faPen = faPen;
  faPlus = faPlus;
  faSearch = faSearch;
  public memorial: any;
  public homenajes: [] = [];

  filteredDifuntos: Observable<any[]>;
  dataLoaded = false;
  @ViewChild(MatPaginator, {static: false})
  set paginator(value: MatPaginator) {
    if (this.dataSource){
      this.dataSource.paginator = value;
    }
  }

  constructor(
    private homenaje: HomenajeService,
    private difunto: DifuntoService,

  ) {
    this.initializeDifuntoFilter();
   }

  initializeDifuntoFilter(){
    this.filteredDifuntos = this.difuntoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap(val => {
        return this.filterDifuntos(val || '');
      })
    );
  }
  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

  filterDifuntos(val: any): Observable<any[]> {

    return this.difunto.getDifuntosOpt(this.id.camposanto)
      .pipe(
        map(response => response.filter(option => {
          return option.nombre.toLowerCase().indexOf(val.toLowerCase()) === 0;
        }))
      );
  }

  displayDifuntos(dif: Difunto) {
    return dif ? dif.nombre + ' ' + dif.apellido : '';
  }

  buscarHomenajes(){
    if (this.difuntoControl.value === '' || this.tipoControl.value === ''){
      Swal.fire('Complete los criterios para empezar la búsqueda');
    } else{
      this.getHomenajes();
    }
  }

  getHomenajes() {
    console.log(this.tipoControl.value);
    this.displayColumns();
    if (this.tipoControl.value === 'true'){
      this.homenaje.getHomenajesFree(this.difuntoControl.value.id_difunto).subscribe(
      (resp: any) => {
        this.homenajes = resp;
        this.homenajes.reverse();
        this.dataSource.data = this.homenajes;
        this.dataSource.paginator = this.paginator;
        Swal.close();
        this.dataLoaded = true;
        this.initializeDifuntoFilter();

      });
    }else if (this.tipoControl.value === 'false') {
      this.homenaje.getHomenajesPaid(this.difuntoControl.value.id_difunto).subscribe(
        (resp: any) => {
          this.homenajes = resp;
          this.homenajes.reverse();
          this.dataSource.data = this.homenajes;
          this.dataSource.paginator = this.paginator;
          Swal.close();
          this.dataLoaded = true;
          this.initializeDifuntoFilter();
        });
    }
  }

  displayColumns(){
  if (this.tipoControl.value === 'true'){
     this.displayedColumns = [
      'cliente',
      'mensaje',
      'difunto',
      'tipo',
      'fecha',
      'estado',
      'bloquear',
      'eliminar'
    ];
   } else if (this.tipoControl.value === 'false'){
    this.displayedColumns = [
      'cliente',
      'mensaje',
      'difunto',
      'tipo',
      'fecha',
      'estado',
      'bloquear',
      'editar',
      'eliminar'
    ];
   }
  }

  loadHomenajeModal(elemento) {
    this.memorial = elemento;
    this.homenaje.recarga_Data(this.memorial);

  }

}
