import { Component, OnInit, ViewChild } from '@angular/core';
import { DifuntoService } from '../../../services/difunto/difunto.service';
import { UsuarioService } from '../../../services/usuario/usuario.service';
import { Difunto } from '../../../models/difunto.model';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import {
  startWith,
  debounceTime,
  distinctUntilChanged,
  switchMap,
  map,
  catchError,
} from 'rxjs/operators';
import { Usuario } from '../../../models/usuario.model';
import { HomenajeService } from '../../../services/homenaje/homenaje.service';
import Swal from 'sweetalert2';
import { throwError } from 'rxjs/internal/observable/throwError';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-crear-homenaje',
  templateUrl: './crear-homenaje.component.html',
  styleUrls: ['./crear-homenaje.component.css'],
})
export class CrearHomenajeComponent implements OnInit {
  public id: any;
  public difuntosList: any;
  public date;
  archivo: File = null;
  imageName = '-Seleccione un archivo-';
  @ViewChild('closebuttonAgregar') closebuttonAgregar;
  difuntoControl = new FormControl('', Validators.required);
  filteredDifuntos: Observable<any[]>;
  usuarioControl = new FormControl('', Validators.required);
  filteredUsuarios: Observable<any[]>;

  public homenaje: FormGroup;

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
    this.homenaje = new FormGroup({
      cliente: this.usuarioControl,
      difunto: this.difuntoControl,
      tipo: new FormControl(null, Validators.required),
      contenido: new FormControl(null, Validators.required),
      mensaje: new FormControl(null),
    });
  }

  initializeDifuntoFilter(){
    this.filteredDifuntos = this.difuntoControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
      distinctUntilChanged(),
      switchMap((val) => {
        return this.filterDifuntos(val || '');
      })
    );

  }

  intializeClientFilter(){
    this.filteredUsuarios = this.usuarioControl.valueChanges.pipe(
      startWith(''),
      debounceTime(400),
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

  onSubmit() {
    Swal.showLoading();
    if (this.homenaje.value.mensaje.length > 200){
      this.getVideoID(this.homenaje.value.contenido);
      Swal.fire('Error en la publicación', 'Los mensajes sólo pueden ser de hasta 200 caracteres.', 'error');
    } else{
    if (this.homenaje.value.tipo === '1') {
      this.postImagen();
    } else if (this.homenaje.value.tipo === '2'){
      this.postYotube();
    }
  }
  }

  postHomenaje(homenaje) {
    this.homenajes.postHomenaje(homenaje).subscribe((resp: any) => {
      Swal.close();
      this.closebuttonAgregar.nativeElement.click();
      this.initializeDifuntoFilter();
      this.intializeClientFilter();
      this.homenaje.patchValue({
        tipo: null,
        contenido: null,
        mensaje: null,
      });
      Swal.fire('¡Publicación exitosa!');
      console.log('success');
    });
  }

  async postImagen() {
    const Himagen = new FormData();
    Himagen.append('mensaje', this.homenaje.value.mensaje as string);
    Himagen.append('imagen', this.archivo);
    Himagen.append('img_base64', 'none');
    await this.homenajes
      .postImagen(Himagen)
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
          const fecha = this.getFechaPublicacion();
          const id_usuario = this.homenaje.value.cliente.id;
          const id_difunto = this.homenaje.value.difunto.id_difunto;
          const homenajePost = new FormData();

          homenajePost.append('id_usuario', id_usuario as string);
          homenajePost.append('id_difunto', id_difunto as string);
          homenajePost.append('fecha_publicacion', fecha as string);
          homenajePost.append('estado', 'True');
          homenajePost.append('gratuito', 'False');
          homenajePost.append('likes', '0');
          homenajePost.append('id_imagecontent', data['id_imagen']);

          this.postHomenaje(homenajePost);
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

  async postYotube() {
    console.log('aqui yt');
    const homenajeYT = new FormData();
    homenajeYT.append('mensaje', this.homenaje.value.mensaje);
    homenajeYT.append('video', this.getVideoID(this.homenaje.value.contenido));

    await this.homenajes
      .postYoutube(homenajeYT)
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
          const fecha = this.getFechaPublicacion();
          const IDusuario = this.homenaje.value.cliente.id;
          const IDdifunto = this.homenaje.value.difunto.id_difunto;
          const homenajePost = new FormData();

          homenajePost.append('id_usuario', IDusuario as string);
          homenajePost.append('id_difunto', IDdifunto as string);
          homenajePost.append('fecha_publicacion', fecha as string);
          homenajePost.append('estado', 'True');
          homenajePost.append('gratuito', 'False');
          homenajePost.append('likes', '0');
          homenajePost.append('id_youtube', data['id_youtube']);

          this.postHomenaje(homenajePost);
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

  getFechaPublicacion() {
    this.date = new Date();

    let latest_date = this.datepipe.transform(this.date, 'yyyy-MM-dd HH:mm');
    console.log(latest_date);
    return latest_date;
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
}
