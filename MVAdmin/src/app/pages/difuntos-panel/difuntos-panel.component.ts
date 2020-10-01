import { Component, OnInit, Output, EventEmitter, AfterViewInit, ViewChild } from '@angular/core';
import { DifuntoService } from '../../services/difunto/difunto.service';
import { MatTableModule } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import  { Difunto } from '../../models/difunto.model';
import { Router } from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import { TiposepulturaService } from 'src/app/services/tiposepultura/tiposepultura.service';
import { SectorService } from 'src/app/services/sector/sector.service';
import {RenderizareditService} from 'src/app/services/renderizaredit/renderizaredit.service'

@Component({
  selector: 'app-difuntos-panel',
  templateUrl: './difuntos-panel.component.html',
  styleUrls: ['./difuntos-panel.component.css']
})
export class DifuntosPanelComponent implements OnInit, AfterViewInit {
  id:any;
  lista_difuntos: any[] = [];;
  data: any = {};
  //difunto:[]=[];
  difunto: Difunto;
  public rowID:Difunto[];
  sector: string;
  sepultura: string;
  responsable:any;
  public displayedColumns = ['nombre', 'apellido', 'cedula', 'fecha_nacimiento', 'fecha_difuncion', 'Detalle','update','delete'];
  public dataSource = new MatTableDataSource<Difunto>();
  @ViewChild(MatSort) sort: MatSort;
  @Output() dataEvent = new EventEmitter();

  constructor(
    public _difuntos: DifuntoService,
    public router: Router,
    public dialog: MatDialog,
    public _sector: SectorService,
    public _sepultura: TiposepulturaService,
    public _editar: RenderizareditService,
    ) { }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarDifuntos();
  }

  cargarDifuntos(){
    this._difuntos.getDifuntos(this.id.camposanto)
    .subscribe((resp:any)=>{
        this.lista_difuntos=resp; 
        this.dataSource.data = resp as Difunto[];
        console.log(this.lista_difuntos);       
      
    })
  }

  public redirectToDetails = (id: string) => {
    
    
  }
  public redirectToUpdate = (row) => {
    this.rowID = row as Difunto[];
    this.cargarSector();
    this.cargarSepultura();
    this.cargarResponsable();
    this._editar.setMetodoConexion('PUT');
    this._difuntos.getDifunto(this.rowID['id_difunto'])
    .subscribe((resp:any)=>{
      this.difunto = resp as Difunto;
      this._editar.setinfoRenderizar({difunto:this.difunto, sector:this.sector, sepultura:this.sepultura, responsable:this.responsable});
      console.log("info")
      console.log(typeof(resp.fecha_nacimiento));
      console.log(this._editar.getinfoRenderizar());
      this.router.navigateByUrl('inicio/registrodifunto');

    })

    
    

  }
  public redirectToDelete = (id: string) => {
    
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  selectRow(templateRef, row) {
    this.rowID = row as Difunto[];
    this.cargarSector();
    this.cargarSepultura();
    this.cargarResponsable();
    const dialogRef = this.dialog.open(templateRef,{
      height: '600px',
      width: '500px',
      });

   }

public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }

updateData(){

}

getRecord(row){
  console.log(row);

}

cargarSector() {
  this._sector.getSector(this.rowID['id_camposanto'])
    .subscribe((resp: any) => {
      console.log(resp);
      for (var i = 0; i < resp.length; i++) {
        if (resp[i]['id_sector'] == this.rowID['id_sector']) {
          this.sector = resp[i]['nombre'];
          console.log(resp)
        }
      }
    })
}

cargarSepultura() {
  this._sepultura.getSepultura(this.rowID['id_camposanto'])
    .subscribe((resp: any) => {
      for (var i = 0; i < resp.length; i++) {

      if (resp[i]['id_tip_sepultura'] == this.rowID['id_tip_sepultura']) {
        this.sepultura = resp[i]['nombre'];
      }
    }
    })
}

cargarResponsable(){
  this._difuntos.getResponsable(this.rowID['id_difunto'])
  .subscribe((resp:any)=>{
    console.log(resp);
    this.responsable = resp;
  })
}

}
