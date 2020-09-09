import { Component, OnInit,AfterViewInit, ViewChild  } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit,AfterViewInit  {
  id:any;
  lista_admin: any[] = [];
  public dataSource = new MatTableDataSource<Usuario>();
  public rowID:Usuario[];
  public displayedColumns = ['first_name', 'last_name','username', 'email', 'Detalle','update','delete'];



  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private _usuario: UsuarioService,
    public dialog: MatDialog,
    ) { }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarAdmin();
  }

  cargarAdmin(){
    this._usuario.getUsers()
    .subscribe((resp:any)=>{
      this.lista_admin = [];
      for (var i =0; i < resp.length; i++){
        if((resp[i]['tipo_usuario']=="ad")|| (resp[i]['tipo_usuario']=="su")){
          if(resp[i]['id_camposanto']== this.id.camposanto){
            this.lista_admin.push(resp[i]);
          }
          
        }
      }
      console.log(this.lista_admin)
      this.dataSource.data = this.lista_admin;
      console.log(this.dataSource.data)

    }
      )
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  public redirectToDetails = (id: string) => {
    
    
  }
  public redirectToUpdate = (id: string) => {
    
  }
  public redirectToDelete = (id: string) => {
    
  }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }
  
  selectRow(templateRef, row) {
    this.rowID = row as Usuario[];
   
    const dialogRef = this.dialog.open(templateRef,{
      height: '510px',
      width: '500px',
      });

   }

updateData(){

}

getRecord(row){
  console.log(row);

}

}
