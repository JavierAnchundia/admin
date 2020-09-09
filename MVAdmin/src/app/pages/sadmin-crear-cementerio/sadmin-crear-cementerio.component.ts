import { Component, OnInit, Input } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { faExclamationCircle, faPlusCircle, faMinusCircle, faMapMarkedAlt } from '@fortawesome/free-solid-svg-icons';
import { CargarGeolocalizacionSadminService } from '../../services/cargar-geolocalizacion-sadmin/cargar-geolocalizacion-sadmin.service'
import { CamposantoService } from '../../services/camposanto/camposanto.service';
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service';
import { RedsocialService } from '../../services/redsocial/redsocial.service'
import { Punto_geolocalizacion } from '../../models/punto_geolocalizacion.model';
import { Empresa } from '../../models/empresa.model';
import { Red_social } from '../../models/red_social.model';
declare var $: any;
import Swal from 'sweetalert2'
import { throwError } from 'rxjs';


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
  id_camposanto: Number = 0;
  id_empresa: Number;
  puntosL: { lat: number; lng: number }[] = [];
  puntoGeo: Punto_geolocalizacion;
  empresas: Empresa[] = [];
  redes: Red_social;
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
    private _servicioRed: RedsocialService
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
      telefono: [null, Validators.compose([Validators.required])],
      email: [null, Validators.compose([Validators.required, Validators.email])],
      logo: [null,],
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
    this.postRedesSociales();
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
  postCamposanto() {
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
    this._servicio.postCamposanto(camposanto).subscribe(
      (data) => {
        console.log(data);
        this.id_camposanto = data['id_camposanto']
        this.postCoordenadas();
        let lenCadena = String(this.redList.value[0].redSocial);
        if (this.redList.length > 0 || lenCadena.length > 0) {
          this.postRedesSociales();
        }
        Swal.close();
        Swal.fire("Registro existoso")
      }, error =>{
        console.error('Error:' + error);
        Swal.close()
        Swal.fire("Hubo un error al guardar los datos, intentelo de nuevo");
                    
        return throwError(error);
      })
  }
  postCoordenadas() {
    for (let punto in this.puntosL) {
      this.puntoGeo = {
        id_punto: null,
        latitud: this.puntosL[punto].lat,
        longitud: this.puntosL[punto].lng,
        id_camposanto: this.id_camposanto
      }
      this._servicioGeo.postListGeolocalizacion(this.puntoGeo).subscribe(
        (data) => {
          console.log(data);
        })
    }
  }

  postRedesSociales() {
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
              console.log(data);
            }
          )
        }
      }
    }
  }
}