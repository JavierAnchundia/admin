import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, Validators, FormGroup } from '@angular/forms';
import { Observable, throwError } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, switchMap, map, catchError } from 'rxjs/operators';
import URL_SERVICIOS from 'src/app/config/config';
import { Difunto } from 'src/app/models/difunto.model';
import { Usuario } from 'src/app/models/usuario.model';
import { DifuntoService } from 'src/app/services/difunto/difunto.service';
import { HomenajeService } from 'src/app/services/homenaje/homenaje.service';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-editar-homenaje',
  templateUrl: './editar-homenaje.component.html',
  styleUrls: ['./editar-homenaje.component.css']
})
export class EditarHomenajeComponent implements OnInit {
  public id: any;
  public memorial;
  archivo: File = null;
  imageName = 'seleccione archivo';
  homenaje: any;
  url_backend: string = URL_SERVICIOS.url_backend;
  @ViewChild('closebuttonEditar') closebuttonEditar;

  difuntoControl = new FormControl('', Validators.required);
  filteredDifuntos: Observable<any[]>;
  usuarioControl = new FormControl('', Validators.required);
  filteredUsuarios: Observable<any[]>;

  public homenajeEdit: FormGroup;

  constructor(
    private difunto: DifuntoService,
    private usuario: UsuarioService,
    private homenajes: HomenajeService,
    public datepipe: DatePipe
  ) {
    this.initializeDifuntoFilter();
    this.intializeClientFilter();
   }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.homenajeEdit = new FormGroup({
      cliente: this.usuarioControl,
      difunto: this.difuntoControl,
      tipo: new FormControl(null, Validators.required),
      contenido: new FormControl(null, Validators.required),
      mensaje: new FormControl(null),
    });
    this.homenajes.updateData$.subscribe((data) => {
      this.memorial = data;
      this.setData(this.memorial);
    });
  }

  initializeDifuntoFilter(){
    this.filteredDifuntos = this.difuntoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filterDifuntos(val || '');
      })
    );

  }

  intializeClientFilter(){
    this.filteredUsuarios = this.usuarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filterUsuarios(val || '');
      })
    );
  }

  selectFile(event) {
    this.archivo = event.target.files[0];
    this.imageName = event.target.files[0].name;
  }

  filterDifuntos(val: any): Observable<any[]> {
    return this.difunto.getDifuntosOpt(this.id.camposanto).pipe(
      map((response) =>
        response.filter((option) => {
          return option.nombre.toLowerCase().indexOf(val.toLowerCase()) === 0;
        })
      )
    );
  }

  displayDifuntos(dif: Difunto) {
    return dif ? dif.nombre + ' ' + dif.apellido : '';
  }

  filterUsuarios(val: any): Observable<any[]> {
    return this.usuario.getUsuariosOpt(this.id.camposanto).pipe(
      map((response) =>
        response.filter((option) => {
          return (
            option.first_name.toLowerCase().indexOf(val.toLowerCase()) === 0
          );
        })
      )
    );
  }

  displayUsuarios(user: Usuario) {
    return user ? user.first_name + ' ' + user.last_name : '';
  }

  getVideoID(url){
    const playlistUrl = url.includes('&list');
    const channelURL = url.includes('&');
    let videoID;
    if (playlistUrl){
      videoID = url.split('?v=')[1].split('&list')[0];
    } else if (channelURL){
      videoID = url.split('?v=')[1].split('&')[0];
    }
    else {
      videoID = url.split('?v=')[1];
    }
    console.log(videoID);
    return videoID;
  }

  setData(elemento){
    this.homenajeEdit.controls.cliente.setValue(elemento.id_usuario);
    this.homenajeEdit.controls.difunto.setValue(elemento.id_difunto);
    this.initializeDifuntoFilter();
    this.intializeClientFilter();
    if (elemento.id_youtube !== null){
      this.homenajeEdit.controls.tipo.setValue('2');
      this.homenajeEdit.controls.mensaje.setValue(elemento.id_youtube.mensaje);
      this.homenajeEdit.controls.contenido.setValue('https://www.youtube.com/watch?v=' + elemento.id_youtube.video);

    } else {
      this.homenajeEdit.controls.tipo.setValue('1');
      this.homenajeEdit.controls.mensaje.setValue(elemento.id_imagecontent.mensaje);

    }
  }



  async editarHomenaje() {
    await Swal.fire({
      title: '¿Está seguro que desea guardar los cambios?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
    }).then(async (result) => {
      if (result.isConfirmed) {
        Swal.fire({
          title: 'Guardando cambios...',
          onOpen: async () => {
            await Swal.showLoading();
            if (this.memorial.id_youtube !== null){
              this.updateHYoutube(this.memorial);
            } else {
              this.updateHimagen(this.memorial);
            }
 
          },
        });
      } else if (result.dismiss === Swal.DismissReason.cancel) {
      }
    });
  }

  async updateHimagen(elemento){
    const Himagen = new FormData();
    Himagen.append('mensaje', this.homenajeEdit.value.mensaje as string);
    if (this.homenajeEdit.value.contenido != null) {
      Himagen.append('imagen', this.archivo);
    }
    Himagen.append('img_base64', 'none');

    await this.homenajes
      .updateHImagen(elemento['id_imagecontent']['id_imagen'], Himagen)
      .pipe(
        catchError((err) => {
          console.log(err);
          Swal.fire(
            'Error en la publicación',
            'Revisar que se llenaron todos los campos. Intenta nuevamente',
            'error'
          );

          return throwError(err);
        })
      )
      .subscribe(
        (data) => {
          console.log(data);
          const id_usuario = this.homenajeEdit.value.cliente.id;
          const id_difunto = this.homenajeEdit.value.difunto.id_difunto;
          const fecha = this.getFecha();

          const homenajePost = new FormData();

          homenajePost.append('id_usuario', id_usuario as string);
          homenajePost.append('id_difunto', id_difunto as string);
          homenajePost.append('fecha_publicacion', fecha as string);
          homenajePost.append('estado', this.memorial.estado);
          homenajePost.append('gratuito', this.memorial.gratuito);
          homenajePost.append('likes', this.memorial.likes);
          homenajePost.append('id_imagecontent', elemento['id_imagecontent']['id_imagen']);

          this.updateHomenaje(elemento, homenajePost);
        },
        (error) => {
          console.error('Error:' + error);
          Swal.fire(
            'Error en la publicación',
            'Revisar que se llenaron todos los campos. Intenta nuevamente',
            'error'
          );

          return throwError(error);
        }
      );
  }

  async updateHYoutube(elemento) {
    console.log(this.memorial);
    const homenajeYT = new FormData();
    homenajeYT.append('mensaje', this.homenajeEdit.value.mensaje);
    homenajeYT.append('video', this.getVideoID(this.homenajeEdit.value.contenido));

    await this.homenajes
      .updateHYoutube(this.memorial['id_youtube']['id_youtube'], homenajeYT)
      .pipe(
        catchError((err) => {
          console.log(err);
          Swal.fire(
            'Error en la publicación',
            'Revisar que se llenaron todos los campos. Intenta nuevamente',
            'error'
          );

          return throwError(err);
        })
      )
      .subscribe(
        (data) => {
          console.log(this.usuarioControl.value.id);
          const IDusuario = this.usuarioControl.value.id + '';
          const IDdifunto = this.difuntoControl.value.id_difunto;
          const fecha = this.getFecha();
          const homenajePost = new FormData();
          console.log( IDusuario + ' ' + IDdifunto);

          homenajePost.append('id_difunto', IDdifunto as string);
          homenajePost.append('fecha_publicacion', fecha as string);
          homenajePost.append('estado', this.memorial.estado);
          homenajePost.append('gratuito', this.memorial.gratuito);
          homenajePost.append('likes', this.memorial.likes);
          homenajePost.append('id_youtube', this.memorial.id_youtube.id_youtube as string);
          homenajePost.append('id_usuario', IDusuario as string);

          this.updateHomenaje(elemento, homenajePost);
        },
        (error) => {
          console.error(error);
          Swal.fire(
            'Error en la publicación',
            'Revisar que se llenaron todos los campos. Intenta nuevamente',
            'error'
          );

          return throwError(error);
        }
      );
  }

  updateHomenaje(elemento, homenaje){
    this.homenajes.updateHomenaje(elemento.id_homenaje, homenaje).subscribe((resp: any) => {
      Swal.close();
      this.closebuttonEditar.nativeElement.click();
      this.initializeDifuntoFilter();
      this.intializeClientFilter();
    },
    (error) => {
      console.error(error);
      Swal.fire(
        'Error en la publicación',
        'Revisar que se llenaron todos los campos. Intenta nuevamente',
        'error'
      );

      return throwError(error);
    });
  }

  getFecha() {
    const date = new Date();
    const latestDate = this.datepipe.transform(date, 'yyyy-MM-dd HH:mm');
    return latestDate;
  }
}
