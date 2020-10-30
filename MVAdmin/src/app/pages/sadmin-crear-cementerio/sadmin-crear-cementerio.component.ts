import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faExclamationCircle, faPlusCircle, faMinusCircle, faMapMarkedAlt, faTimes } from '@fortawesome/free-solid-svg-icons';
import { CargarGeolocalizacionSadminService } from '../../services/cargar-geolocalizacion-sadmin/cargar-geolocalizacion-sadmin.service'
import { CamposantoService } from '../../services/camposanto/camposanto.service';
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service';
import { RedsocialService } from '../../services/redsocial/redsocial.service'
import { Punto_geolocalizacion } from '../../models/punto_geolocalizacion.model';
import { Empresa } from '../../models/empresa.model';
import { Red_social } from '../../models/red_social.model';

declare var $: any;
import Swal from 'sweetalert2'
import { Router } from '@angular/router';
import { of,throwError } from 'rxjs';
import { map,catchError } from 'rxjs/operators';

@Component({
  selector: 'app-sadmin-crear-cementerio',
  templateUrl: './sadmin-crear-cementerio.component.html',
  styleUrls: ['./sadmin-crear-cementerio.component.css']
})

export class SadminCrearCementerioComponent implements OnInit {
  archivo: File = null;
  nameLogo: string = "seleccione archivo";
  faPlusCircle = faPlusCircle;
  faMinusCircle = faMinusCircle;
  faMapMarkedAlt = faMapMarkedAlt;
  faExclamationCircle = faExclamationCircle;
  faTimes = faTimes;
  id_camposanto: Number = 0;
  id_empresa: Number;
  puntosL: { lat: number; lng: number }[] = [];
  puntoGeo: Punto_geolocalizacion;
  empresas: Empresa[] = [];
  redes: Red_social;
  numericNumberReg= '[0-9]*';
  redes_sociales: String[] = [
    "facebook",
    "twitter",
    "youtube",
    "instagram",
    "whatsapp",
    "line",
    "telegram",
    "snapchat",
  ]
  public form_cementerio: FormGroup;
  public redList: FormArray;
  // empresaHasError: Number = 1;
  // selectedValue: Number;
  constructor(
    private fb: FormBuilder,
    private cargarGeoService: CargarGeolocalizacionSadminService,
    private _servicio: CamposantoService,
    private _servicioGeo: GeolocalizacionService,
    private _servicioRed: RedsocialService,
    private router: Router
  ) { }
  selectFile(event) {
    this.archivo = event.target.files[0];
    this.nameLogo = event.target.files[0].name;
  }

  get red_socialFormGroup() {
    return this.form_cementerio.get('redes') as FormArray;
  }

  ngOnInit(): void {
    this.form_cementerio = this.fb.group({
      nombre: [null, Validators.compose([Validators.required])],
      empresa: [null, Validators.compose([Validators.required])],
      direccion: [null, Validators.compose([Validators.required])],
      telefono: [null, Validators.compose([Validators.required,Validators.minLength(7),Validators.maxLength(10),Validators.pattern(this.numericNumberReg)])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      logo: [null, Validators.compose([Validators.required])],
      redes: this.fb.array([this.createRedSocial()])
    });
    this.redList = this.form_cementerio.get('redes') as FormArray;
    this.cargarGeoService.change.subscribe(puntosLocali => {
      this.puntosL = puntosLocali;
    });
    this.cargarEmpresas();
  }
  cargarEmpresas() {
    this._servicio.getEmpresas().subscribe((data) => {
      console.log(data);
      this.empresas = data;
    });
  }
  createRedSocial(): FormGroup {
    return this.fb.group({
      redSocial: [null]
    });
  }
  addRedSocial() {
    this.redList.push(this.createRedSocial());
  }

  removeRedSocial(index) {
    this.redList.removeAt(index);
  }
  submit() {
    if (this.puntosL.length == 0) {
      $("#modalPuntosGeo").modal('show');
    }
    else {
      Swal.showLoading();
      this.postCamposanto();
    }
  }
  async postCamposanto() {
    const camposanto = new FormData();
    camposanto.append('nombre', this.form_cementerio.value.nombre);
    camposanto.append('direccion', this.form_cementerio.value.direccion);
    camposanto.append('telefono', this.form_cementerio.value.telefono);
    camposanto.append('logo', this.archivo);
    camposanto.append('id_empresa', this.form_cementerio.value.empresa);
    console.log(camposanto.get('nombre'));
    var user = JSON.stringify(camposanto);
    console.log(user);
    var object = {};
    camposanto.forEach(function (value, key) {
      object[key] = value;
    });
    var json = JSON.stringify(object);
    await this._servicio.postCamposanto(camposanto)
    .pipe(
      catchError(err => {
        
        Swal.close()
        Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]) );
        console.log(err.error[Object.keys(err.error)[0]][0]);
        return throwError(err);
    }))
    .subscribe(
      (data) => {
        console.log(data);
        this.id_camposanto = data['id_camposanto']
        this.postCoordenadas();
        let lenCadena = String(this.redList.value[0].redSocial);
        if (this.redList.length >= 0 || lenCadena.length >= 0) {
          this.postRedesSociales();
        }
        Swal.close();
        Swal.fire("Registro existoso")
      }, error =>{
        console.error('Error:' + error);
                    
        return throwError(error);
      })
  }

  errorTranslateHandler(error:String){
    switch(error) { 
      case "camposanto with this email address already exists.": { 
         return "Hubo un error al guardar los datos: Ya existe este correo, intente con otro";
      } 
      case   "camposanto with this nombre already exists."      : { 
         return "Hubo un error al guardar los datos: Ya existe este nombre de camposanto, intente con otro"      
      } 
      default: { 
         return "Hubo un error al guardar los datos"
      } 
   } 
  }
  
  async postCoordenadas() {
    for (let punto in this.puntosL) {
      this.puntoGeo = {
        id_punto: null,
        latitud: this.puntosL[punto].lat,
        longitud: this.puntosL[punto].lng,
        id_camposanto: this.id_camposanto
      }
      await this._servicioGeo.postListGeolocalizacion(this.puntoGeo);
    }
  }

  postRedesSociales() {
    if(this.redList == null){
      this.delay(400);
    }
    else{
      for (let i = 0; i < this.redList.length; i++) {
        let link = String(this.redList.value[i].redSocial);
        let linkMins = link.toLowerCase();
        for (let j = 0; j < this.redes_sociales.length; j++) {
          let red = String(this.redes_sociales[j]);
          if (linkMins.includes(red)) {
            this.redes = {
              nombre: red,
              link: link,
              estado: true,
              id_camposanto: this.id_camposanto
            }
            this._servicioRed.postRedes(this.redes).subscribe(
              (data) => {
                if(i == this.redList.length -1 ){
                  this.delay(400);
                  this.router.navigate(['/dashboard']);
                }
                console.log(data);
              }
            )
          }
        }
      }
    }
    this.router.navigate(['/dashboard']);
  }
  regresarDashboard(){
    this.router.navigate(['/dashboard']);
  }
  //sleep para mostrar el mensaje de actualizaion de los puntos
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }
}
