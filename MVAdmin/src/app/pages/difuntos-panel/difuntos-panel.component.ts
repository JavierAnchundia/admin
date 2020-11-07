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
import Swal from 'sweetalert2'
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';

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

  cambiarMetodoConexion(){
    let info_difunto = JSON.parse(localStorage.getItem('difunto_info'));
    if(info_difunto != null){
      localStorage.setItem('difunto_info', JSON.stringify({admin: info_difunto.admin, sector: info_difunto.sector, sepultura: info_difunto.sepultura,
         responsable: info_difunto.responsable, metodo_conexion:('POST')}));
    }

    else{ localStorage.setItem('difunto_info', JSON.stringify({admin: "", sector: "", sepultura: "",
      responsable: "", metodo_conexion:('POST')}));
    }
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
  public redirectToUpdate = async (row) => {
    this.rowID = row as Difunto[];
    this._editar.setMetodoConexion('PUT');
    this._difuntos.getDifunto(this.rowID['id_difunto'])
    .subscribe( async (resp:any)=>{
      this.difunto = resp as Difunto;
      await this.cargarSector();
      
      localStorage.setItem('difunto_info', JSON.stringify({difunto:this.difunto, sector:this.sector, sepultura:this.sepultura,
      responsable:this.responsable,metodo_conexion:('PUT')}));

      this._editar.setinfoRenderizarDifunto({difunto:this.difunto, sector:this.sector, sepultura:this.sepultura, responsable:this.responsable});

    })

  }

  irARegistrarDifunto(router){
    router.navigateByUrl('inicio/registrodifunto');
  }




  public redirectToDelete = (id: string) => {
    
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  selectRow(templateRef, row) {
    this.rowID = row as Difunto[];
    this.cargarSector();
   // this.cargarSepultura();
   // this.cargarResponsable();
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

errorTranslateHandler(error: String) {
  switch (error) {
    case "usuario with this email address already exists.": {
      return "Hubo un error al guardar los datos: Ya existe este correo, intente con otro";
    }
    case "usuario with this nombre already exists.": {
      return "Hubo un error al guardar los datos: Ya existe este nombre de camposanto, intente con otro"
    }
    default: {
      return "Hubo un error al guardar los datos"
    }
  }
}

cargarSector() {
  console.log("ENTREEEE A CREAR SECTOOOOOOOOR")

  this._sector.getSector(this.rowID['id_camposanto'])
    .pipe(
      catchError(err => {

        Swal.close()
        Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]));
        console.log(err.error);
        console.log("estoy en el pipe")
        return throwError(err);
      }))
    .subscribe(
      
      
      (resp: any) => {
      console.log(resp);
      for (var i = 0; i < resp.length; i++) {
        if (resp[i]['id_sector'] == this.rowID['id_sector']) {
          this.sector = resp[i]['nombre'];
          console.log("SEEEEECCTOOOOOOORR")
          console.log(resp[i]['nombre'])
          console.log(this.sector)

        }
      }
      this.cargarSepultura();

      //return new Promise(resolve {})
    },

      error => {
        console.error('Error:' + error);
            console.log("estoy en el error")


            return throwError(error);
      }
    
    )
}

cargarSepultura() {
  console.log("ENTREEEE A CREAR SEPULTUUUURRAAAAA")

  this._sepultura.getSepultura(this.rowID['id_camposanto'])
    .pipe(
      catchError(err => {

        Swal.close()
        Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]));
        console.log(err.error);
        console.log("estoy en el pipe")
        return throwError(err);
      }))
    .subscribe(
      (resp: any) => {
        for (var i = 0; i < resp.length; i++) {

        if (resp[i]['id_tip_sepultura'] == this.rowID['id_tip_sepultura']) {
          this.sepultura = resp[i]['nombre'];
          console.log("SEPULTUUUURAAAAAAAAAAAAAAAA")
          console.log(resp[i]['nombre'])
          console.log(this.sepultura)}
          this.cargarResponsable();
      }},

        error => {
          console.error('Error:' + error);
              console.log("estoy en el error")


              return throwError(error);
        }
    
    
    )
}

cargarResponsable(){
  console.log("ENTREEEE A CREAR RESPONABLEEEEEEEEE")
  this._difuntos.getResponsable(this.rowID['id_difunto'])
  .pipe(
    catchError(err => {

      Swal.close()
      Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]));
      console.log(err.error);
      console.log("estoy en el pipe")
      return throwError(err);
    }))
  .subscribe(
    
    
    (resp:any)=>{
      console.log(resp);
      this.responsable = resp;
      console.log("REPSONAAAAABLEEEEEEEEEEEEES")
      console.log(resp)
      console.log(this.responsable)
      if(this._editar.getMetodoConexion()=='PUT'){

        localStorage.setItem('difunto_info', JSON.stringify({difunto:this.difunto, sector:this.sector, sepultura:this.sepultura,
        responsable:this.responsable,metodo_conexion:('PUT')}));

         this._editar.setinfoRenderizarDifunto({difunto:this.difunto, sector:this.sector, sepultura:this.sepultura, responsable:this.responsable});
         this.router.navigateByUrl('inicio/registrodifunto');
      }
    },

    error => {
      console.error('Error:' + error);
          console.log("estoy en el error")


          return throwError(error);
    })
}

}
