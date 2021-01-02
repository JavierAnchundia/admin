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
import { Homenaje } from 'src/app/models/homenaje.model'
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
@Component({
  selector: 'app-homenajes',
  templateUrl: './homenajes.component.html',
  styleUrls: ['./homenajes.component.css']
})
export class HomenajesComponent implements OnInit {
  public id;
  difuntoControl = new FormControl('', Validators.required);
  tipoControl = new FormControl('', Validators.required);
  public rowID:Homenaje[];

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
        //Swal.close();
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
         // Swal.close();
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

  public redirectToBloqueo = async (row) => {
    this.rowID = row as Homenaje[];  
    const formData = new FormData();
    formData.append('estado', String(!Boolean(JSON.parse(this.rowID['estado']))));
    console.log(String(JSON.parse(this.rowID['id_homenaje'])))
    console.log(String(!Boolean(JSON.parse(this.rowID["estado"]))))
    this.homenaje 
    .bloquearHomenaje(formData, String(JSON.parse(this.rowID['id_homenaje'])))
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
      if(this.rowID["estado"]){
        Swal.fire('Homenaje bloqueado exitosamente!');}
      else{
        Swal.fire('Homenaje desbloqueado exitosamente!');
      }
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

   public redirectToDelete = async (row) => {
    this.rowID = row as Homenaje[];  
    Swal.fire({
      title: '¿Está seguro que desea eliminar esto?',
      text: "¡No podrá deshacer esta acción!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar'
    }).then((result) => {
      if (result.isConfirmed) {
        if(this.rowID['id_textcontent']){this.eliminarTexto(); }
        if(this.rowID['id_imagecontent']){this.eliminarImagen(); }
        if(this.rowID['id_videocontent']){this.eliminarVideo(); }
        if(this.rowID['id_audiocontent']){this.eliminarAudio(); }
        if(this.rowID['id_youtube']){this.eliminarHYoutube(); }
      }
    })


    

   }

   public eliminarImagen = async () => {
     console.log("Entre en Imagen")
    this.homenaje 
    .deleteImagen(String(JSON.parse((this.rowID['id_imagecontent'])['id_imagen'])))
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         "Hubo un error al eliminar este Homenaje de Foto"
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      
        Swal.fire('Homenaje Eliminado exitosamente!');
      
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

   public eliminarVideo = async () => {
    console.log("Entre en Video")
    this.homenaje 
    .deleteVideo(String(JSON.parse((this.rowID['id_videocontent'])["id_video"])))
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         "Hubo un error al eliminar este Homenaje de Video"
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      
        Swal.fire('Homenaje Eliminado exitosamente!');
      
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

   public eliminarAudio = async () => {
    console.log("Entre en Audio")
    this.homenaje 
    .deleteAudio(String(JSON.parse((this.rowID['id_audiocontent'])["id_audio"])))
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         "Hubo un error al eliminar este Homenaje de Audio"
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      
        Swal.fire('Homenaje Eliminado exitosamente!');
      
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

   public eliminarTexto = async () => {
    console.log("Entre en Texto")
    this.homenaje 
    .deleteMensaje(String(JSON.parse((this.rowID['id_textcontent'])["id_mensaje"])))
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         "Hubo un error al eliminar este Homenaje de Texto"
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      
        Swal.fire('Homenaje Eliminado exitosamente!');
      
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }

   public eliminarHYoutube = async () => {
    console.log("Entre en Youtube")
    this.homenaje 
    .deleteYoutube(String(JSON.parse((this.rowID['id_youtube'])['id_youtube'])))
    .pipe(
     catchError((err) => {
       Swal.close();
       Swal.fire(
         "Hubo un error al eliminar este Homenaje de YouTube"
       );
       return throwError(err);
     })
   )
   .subscribe(
     async (resp: any) => {
      Swal.close();
      
        Swal.fire('Homenaje Eliminado exitosamente!');
      
      this.buscarHomenajes();
       return true;
     },
     (error) => {
       console.error('Error:' + error);
       return throwError(error);
     },
     () => console.log('HTTP request completed.')
   );
   }


   errorTranslateHandler(error: String) {
    switch (error) {     
      default: {
        return 'Hubo un error intente nuevamente';
      }
    }
  }


}
