import { Component, OnInit,AfterViewInit, ViewChild  } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';
import { Usuario } from '../../models/usuario.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import {MatDialog} from '@angular/material/dialog';
import { PermisosService } from '../../services/permisos/permisos.service';
import { Permiso } from '../../models/permiso.model'
import {RenderizareditService} from '../../services/renderizaredit/renderizaredit.service'
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map, catchError } from 'rxjs/operators';
import { of, throwError } from 'rxjs';



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
  public displayedColumns = ['names','username', 'email', 'Detalle','update','delete'];



  @ViewChild(MatSort) sort: MatSort;
  
  constructor(
    private _usuario: UsuarioService,
    public dialog: MatDialog,
    private _permiso: PermisosService,
    private _editar: RenderizareditService,
    private router:Router,
    ) { }

  ngOnInit(): void {
    this.id = this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarAdmin();
  }

  cambiarMetodoConexion(){
    let info_admin = JSON.parse(localStorage.getItem('admin_info'));
    if(info_admin != null){
      localStorage.setItem('admin_info', JSON.stringify({admin: info_admin.admin, permisos:info_admin.permisos, metodo_conexion:('POST')}));

    }

    else{localStorage.setItem('admin_info', JSON.stringify({admin: "", permisos:"", metodo_conexion:('POST')}));
    }
  }

  cargarAdmin(){
    this._usuario.getUsers(this.id.camposanto)
    .subscribe((resp:any)=>{
      this.lista_admin = [];
      for (var i =0; i < resp.length; i++){
        
        if(((resp[i]['tipo_usuario']=="ad")|| (resp[i]['tipo_usuario']=="su")) && resp[i]['username'] != localStorage.getItem('username')){
            console.log(resp)
            this.lista_admin.push(resp[i]);
        }
      }
      this.dataSource.data = this.lista_admin;

    }
      )
  }

  public doFilter = (value: string) => {
    this.dataSource.filter = value.trim().toLocaleLowerCase();
  }


  public redirectToDetails = (id: string) => {
    
    
  }
  public redirectToUpdate = async (row) => {
    
    await this._editar.setMetodoConexion('PUT');
    this.rowID = row as Usuario[];  
    let misPermisos:{};
    let infoPermisos:Array<Permiso> = [];
    await this._permiso.getMisPermisos(this.rowID['id'])
    .then((resp:any)=>{
      misPermisos = resp;
     
      
    })
    
    for(let i of Object.keys(misPermisos)){
      console.log(misPermisos[i]["id_permiso"])
      await this._permiso.getInfoPermiso(((misPermisos[i])["id_permiso"]))
      .then((resp:any) =>{
        console.log(resp);
        infoPermisos.push(resp);
      })
      
      
    }
    
    console.log(infoPermisos);
    localStorage.setItem('admin_info', JSON.stringify({admin:this.rowID, permisos:infoPermisos, metodo_conexion:('PUT')}));
    await this._editar.setinfoRenderizarAdmin({admin:this.rowID,permisos:infoPermisos})
    this.router.navigateByUrl('inicio/create');

  }




  public redirectToDelete = async (row) => {
    this.rowID = row as Usuario[];  
    const formData = new FormData();
    formData.append('is_active', String(!Boolean(JSON.parse(this.rowID["is_active"]))));
    
    this._usuario
    .actualizarAdmin(formData, this.rowID['username'])
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0])
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      if(this.rowID["is_active"]){
        Swal.fire('¡Administrador deshabilitado exitosamente!');}
      else{
        Swal.fire('¡Administrador habilitado exitosamente!');
      }
      this.cargarAdmin();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

  ngAfterViewInit(): void {
    this.dataSource.sort = this.sort;
  }

  errorTranslateHandler(error: String) {
    switch (error) {
      case 'user with this email address already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este correo, intente con otro';
      }
      case 'user with this username already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este nombre de usuario, intente con otro';
      }
      default: {
        return 'Hubo un error al guardar los datos';
      }
    }
  }
  
  selectRow(templateRef, row) {
    this.rowID = row as Usuario[];
    console.log(this.rowID);
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
