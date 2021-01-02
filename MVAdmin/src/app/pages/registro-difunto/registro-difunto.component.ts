import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild,
  ChangeDetectorRef,
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DifuntoService } from '../../services/difunto/difunto.service';
import { SectorService } from '../../services/sector/sector.service';
import { TiposepulturaService } from '../../services/tiposepultura/tiposepultura.service';
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2';
import { map, startWith } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { throwError, Observable } from 'rxjs';
import { Difunto } from '../../models/difunto.model';
import { DifuntoH } from '../../models/difunto_herencia.model';
import { RenderizareditService } from '../../services/renderizaredit/renderizaredit.service';
import { Responsable_difunto } from '../../models/responsable_difunto.model';
import { Tipo_sepultura } from '../../models/tipo_sepultura.model';
import { Sector } from '../../models/sector.model';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { CamposantoService } from 'src/app/services/servicios.index';

interface Marker {
  lat: Number;
  lng: Number;
}

@Component({
  selector: 'app-registro-difunto',
  templateUrl: './registro-difunto.component.html',
  styleUrls: ['./registro-difunto.component.css'],
})
export class RegistroDifuntoComponent implements OnInit, OnDestroy {
  @ViewChild('closebutton') closebutton;
  alertError: Boolean = false;
  lat: any = 0;
  lng: any = 0;
  latitudFinal: Number;
  longitudFinal: Number;
  markers: any[] = [];
  marker: any;
  zoom: Number = 15;
  difuntoForm: FormGroup;
  responsableForm: FormGroup;
  id: any;
  lista_sector: any;
  lista_sepultura: any;
  sepulturaOption: any;
  sectorOption: string;
  ddayOption: string;
  dmonthOption: string;
  dyearOption: string;
  bdayOption: string;
  bmonthOption: string;
  byearOption: string;
  verPuntos = false;
  submitted = false;
  nombreCamposanto: String = '';

  difunto: DifuntoH = new DifuntoH();
  fechaNacimientoInfo = '';
  fechaDefuncionInfo = '';

  sector: string;
  sepultura: string;
  responsable: Responsable_difunto = new Responsable_difunto();
  skeletonloader = true;
  editando = false;
  //verPuntos = false;
  generoOptions = ['Femenino', 'Masculino'];
  monthNames = [
    '01',
    '02',
    '03',
    '04',
    '05',
    '06',
    '07',
    '08',
    '09',
    '10',
    '11',
    '12',
  ];
  numericNumberReg = '[0-9]*';

  parentezcoOptions: Array<String> = [
    'Hijo/a',
    'Esposo/a',
    'Nieto/a',
    'Hermano/a',
    'Primo/a',
    '1',
    'nieto',
    'aaa',
    'Indefinido',
  ];
  info_difunto: any;

  constructor(
    public _difunto: DifuntoService,
    public _sector: SectorService,
    public _sepultura: TiposepulturaService,
    private _servicioGeo: GeolocalizacionService,
    private router: Router,
    private _editar: RenderizareditService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private _servCamposanto: CamposantoService
  ) {
    this.matIconRegistry.addSvgIcon(
      'flecha2',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/icons/flecha2.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'inhabilitada',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/icons/inhabilitada.svg'
      )
    );
    this.matIconRegistry.addSvgIcon(
      'habilitada',
      this.domSanitizer.bypassSecurityTrustResourceUrl(
        '../../../assets/icons/habilitada.svg'
      )
    );
  }

  ngOnDestroy(): void {}

  ngOnInit(): void {
    //Aqui se puede revisar el servicios y si aun no se han cargado los datos, entonces ponerle un wait here or something like that
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarSector();
    this.cargarSepultura();
    console.log(this.responsable.parentezco);
    this.cargarPuntosGeoMapa(this.id.camposanto);
    if (this.id) {
      this.setNombreCamposanto(this.id['camposanto']);
    }

    console.log(this.responsable.parentezco);

    this.difuntoForm = new FormGroup({
      firstName: new FormControl('', Validators.required),
      lastName: new FormControl('', Validators.required),
      generoDropdown: new FormControl('', Validators.required),
      cedula: new FormControl('9999999999', [
        Validators.required,
        Validators.minLength(9),
        Validators.maxLength(10),
        Validators.pattern(this.numericNumberReg),
      ]),
      birthPlace: new FormControl('Indefinido', Validators.required),
      deathPlace: new FormControl('Indefinido', Validators.required),
      dayBirth: new FormControl('', Validators.required),
      monBirth: new FormControl('', Validators.required),
      yearBirth: new FormControl('', Validators.required),
      dayDeath: new FormControl('', Validators.required),
      monDeath: new FormControl('', Validators.required),
      yearDeath: new FormControl('', Validators.required),
      tipoSepultura: new FormControl('', Validators.required),
      sector: new FormControl('', Validators.required),
      lapida: new FormControl('', Validators.required),
    });

    this.responsableForm = new FormGroup({
      NombreRes: new FormControl('', Validators.required),
      ApellidoRes: new FormControl('', Validators.required),
      telefono: new FormControl(9999999999, [
        Validators.required,
        Validators.maxLength(9),
        Validators.minLength(9),
        Validators.pattern(this.numericNumberReg),
      ]),
      celular: new FormControl(9999999999, [
        Validators.required,
        Validators.maxLength(10),
        Validators.minLength(10),
        Validators.pattern(this.numericNumberReg),
      ]),
      correo: new FormControl('', [Validators.email]),
      parentesco: new FormControl('Indefinido', Validators.required),
      direccion: new FormControl('', Validators.required),
      otro: new FormControl(null),
    });
    this.obtenerInfo();

    //Campos del formulario que toman un valor en funcion de si el parentezco esta dentro de las opciones o pertenece a "Otro"
    if (this.parentezcoOptions.includes(this.responsable.parentezco)) {
      this.responsableForm.addControl(
        'parentesco',
        new FormControl(this.responsable.parentezco, Validators.required)
      );
      this.responsableForm.addControl('otro', new FormControl(null));

      console.log('Se anadio a Parentezco');
    } else {
      this.responsableForm.addControl(
        'parentesco',
        new FormControl('Otro', Validators.required)
      );
      this.responsableForm.addControl(
        'otro',
        new FormControl(this.responsable.parentezco)
      );
      console.log('Se anadio a Otros');
    }

    console.log('Fechas de Muerte');
    console.log(this.difuntoForm.value.dayBirth);
    console.log(this.difuntoForm.value.monBirth);
    console.log(this.difuntoForm.value.yearBirth);
    console.log(this.difuntoForm.value.dayDeath);
    console.log(this.difuntoForm.value.monDeath);
    console.log(this.difuntoForm.value.yearDeath);

    this.fillBirthYear();
    this.fillBirthDays();
    this.fillDeathDays();
    this.fillDeathYear();

    console.log('Filto:');
    this.filteredOptions_nacimiento = this.difuntoForm
      .get('birthPlace')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter_nacimiento(value))
      );

    this.filteredOptions_fallecimiento = this.difuntoForm
      .get('deathPlace')
      .valueChanges.pipe(
        startWith(''),
        map((value) => this._filter_fallecimiento(value))
      );

    console.log('Fin Filtros');
  }

  control_nacimiento = new FormControl();
  options_nacimiento: string[] = [
    'Guayaquil',
    'Cuenca',
    'Quito',
    'Portoviejo',
    'Machala',
    'Durán',
    'Daule',
    'Indefinido',
  ];
  filteredOptions_nacimiento: Observable<string[]>;
  private _filter_nacimiento(value: string): string[] {
    const filterValueN = value.toLowerCase();
    return this.options_nacimiento.filter((optionN) =>
      optionN.toLowerCase().includes(filterValueN)
    );
  }

  control_fallecimiento = new FormControl();
  options_fallecimiento: string[] = [
    'Guayaquil',
    'Cuenca',
    'Quito',
    'Portoviejo',
    'Machala',
    'Durán',
    'Daule',
    'Indefinido',
  ];
  filteredOptions_fallecimiento: Observable<string[]>;
  private _filter_fallecimiento(value: string): string[] {
    const filterValueF = value.toLowerCase();
    return this.options_fallecimiento.filter((optionF) =>
      optionF.toLowerCase().includes(filterValueF)
    );
  }

  get f() {
    return this.difuntoForm.controls;
  }

  get r() {
    return this.responsableForm.controls;
  }

  puntosBoton() {
    this.verPuntos = true;
  }

  setNombreCamposanto(id) {
    this._servCamposanto.getCamposantoByID(id).subscribe((resp) => {
      this.nombreCamposanto = resp['nombre'];

      if (this.info_difunto.metodo_conexion != 'PUT') {
        this.responsableForm.patchValue({
          NombreRes: this.nombreCamposanto,
          ApellidoRes: this.nombreCamposanto,
          correo: this.nombreCamposanto.split(' ').join('') + '@correo.com',
          direccion: this.nombreCamposanto,
        });
      }
      console.log(this.nombreCamposanto);
    });
  }
  /* Esto era usado para la conversion al formato del DifuntoForm en las fechas
  conversionFecha(valor: number){
    let val = valor/10;
    if(val <1){
      return "0"+ valor;
    }
    else {
    return valor};
  }*/
  onSubmit() {
    this.submitted = true;
    Swal.close();
    if (
      this.markers.length == 0 &&
      this.info_difunto.metodo_conexion != 'PUT'
    ) {
      Swal.close();
      console.log(this.verPuntos);
      console.log(this.markers.length);
      if (this.verPuntos) {
        this.verPuntos = false;
        return;
      }
      Swal.fire('No ha escogido la ubicación del difunto');
      console.log('antes del elif');
    }
    if (this.verPuntos) {
      this.verPuntos = false;
      return;
    }

    if (this.difuntoForm.value.yearBirth >= this.difuntoForm.value.yearDeath) {
      this.submitted = false;
      Swal.fire(
        'No se pudo guardar el registro',
        'Existe un error con las fechas. Intente nuevamente'
      );
      console.log('Validacion de Fechas');
    } else {
      if (this.difuntoForm.valid && this.responsableForm.valid) {
        Swal.showLoading();
        console.log('A punto de entrar a crear Difunto');
        this.crearDifunto();
      } else {
        if (this.difuntoForm.invalid || this.responsableForm.invalid) {
          console.log('despues del elif');

          return;
        }
      }
    }
  }

  obtenerInfo() {
    this.info_difunto = JSON.parse(localStorage.getItem('difunto_info'));
    if (this.info_difunto.metodo_conexion == 'PUT') {
      this.editando = true;
      this.difunto = this.info_difunto.difunto;
      this.sector = this.info_difunto.sector;
      this.sepultura = this.info_difunto.sepultura;
      this.responsable = this.info_difunto.responsable;
      this.fechaDefuncionInfo = (this.difunto
        .fecha_difuncion as unknown) as string;
      this.latitudFinal = this.difunto.latitud;
      this.longitudFinal = this.difunto.longitud;
      this.skeletonloader = false;

      if (this.markers.length < 1) {
        this.marker = {
          lat: this.latitudFinal,
          lng: this.longitudFinal,
        };
        this.markers.push(this.marker);
      }
      console.log(this.difunto);
      console.log(this.sector);
      console.log(this.sepultura);
      console.log(this.responsable);
      console.log(this.fechaDefuncionInfo);
      console.log(this.latitudFinal);
      console.log(this.longitudFinal);
      console.log(this.skeletonloader);

      this.editarForms();
    } else {
      this.setearGeoLocation();
    }
  }

  editarForms() {
    this.difuntoForm.setValue({
      firstName: this.difunto.nombre,
      lastName: this.difunto.apellido,
      generoDropdown: this.difunto.genero,
      cedula: this.difunto.cedula,
      birthPlace: this.difunto.lugar_nacimiento,
      deathPlace: this.difunto.lugar_difuncion,
      dayBirth: String(this.difunto.fecha_nacimiento).split('-')[2],
      monBirth: String(this.difunto.fecha_nacimiento).split('-')[1],
      yearBirth: String(this.difunto.fecha_nacimiento).split('-')[0],
      dayDeath: String(this.difunto.fecha_difuncion).split('-')[2],
      monDeath: String(this.difunto.fecha_difuncion).split('-')[1],
      yearDeath: String(this.difunto.fecha_difuncion).split('-')[0],
      tipoSepultura: this.sepultura,
      sector: this.sector,
      lapida: this.difunto.no_lapida,
    });

    console.log(this.responsable);
    this.responsableForm.patchValue({
      NombreRes: this.responsable.nombre,
      ApellidoRes: this.responsable.apellido,
      telefono: this.responsable.telefono,
      celular: this.responsable.celular,
      correo: this.responsable.correo,
      // parentesco: new FormControl(this.responsable.parentezco, Validators.required),
      direccion: this.responsable.direccion,
      //otro: new FormControl(null)
    });

    console.log(this.responsable.parentezco);
    console.log(this.parentezcoOptions.includes(this.responsable.parentezco));

    if (this.parentezcoOptions.includes(this.responsable.parentezco)) {
      console.log(this.responsable.parentezco);
      console.log(this.parentezcoOptions.includes(this.responsable.parentezco));
      this.responsableForm.patchValue({
        parentesco: this.responsable.parentezco,
        otro: '',
      });
      // this.responsableForm.addControl('parentesco', new FormControl(this.responsable.parentezco, Validators.required));
      // this.responsableForm.addControl('otro', new FormControl(null));

      console.log('Se anadio a Parentezco');
    } else {
      this.responsableForm.patchValue({
        parentesco: 'Otro',
        otro: this.responsable.parentezco,
      });
      // this.responsableForm.addControl('parentesco', new FormControl("Otro", Validators.required));
      // this.responsableForm.addControl('otro', new FormControl(this.responsable.parentezco));
      // console.log("Se anadio a Otros");
    }
  }
  obtenerID(lista: any, valor) {
    for (let i of lista) {
      console.log('Estoy en obtenerID');
      console.log(i);
      var val = (i as unknown) as Tipo_sepultura;
      console.log(val);
      console.log(val.nombre);
      console.log(valor);

      if (val.nombre == valor) {
        console.log(val[Object.keys(val)[0]]);
        return val[Object.keys(val)[0]];
      }
    }
  }
  crearDifunto() {
    console.log('Estoy en crear difunto');
    const formData = new FormData();
    formData.append('nombre', this.difuntoForm.value.firstName);
    formData.append('apellido', this.difuntoForm.value.lastName);
    formData.append('genero', this.difuntoForm.value.generoDropdown);
    formData.append('cedula', this.difuntoForm.value.cedula);
    formData.append('lugar_nacimiento', this.difuntoForm.value.birthPlace);
    formData.append(
      'fecha_nacimiento',
      this.difuntoForm.value.yearBirth +
        '-' +
        this.difuntoForm.value.monBirth +
        '-' +
        this.difuntoForm.value.dayBirth
    );
    formData.append('lugar_difuncion', this.difuntoForm.value.deathPlace);
    formData.append(
      'fecha_difuncion',
      this.difuntoForm.value.yearDeath +
        '-' +
        this.difuntoForm.value.monDeath +
        '-' +
        this.difuntoForm.value.dayDeath
    );
    formData.append('no_lapida', this.difuntoForm.value.lapida);
    formData.append('latitud', String(this.latitudFinal));
    formData.append('longitud', String(this.longitudFinal));
    formData.append('estado', 'True');
    formData.append('id_camposanto', this.id.camposanto);
    formData.append(
      'id_tip_sepultura',
      this.obtenerID(this.lista_sepultura, this.difuntoForm.value.tipoSepultura)
    );
    formData.append(
      'id_sector',
      this.obtenerID(this.lista_sector, this.difuntoForm.value.sector)
    );

    if (this.info_difunto.metodo_conexion == 'PUT') {
      console.log('Esto es un metodo PUT');
      this._difunto
        .putDifunto(formData, this.difunto.id_difunto)
        .pipe(
          catchError((err) => {
            Swal.close();
            Swal.fire(
              this.errorTranslateHandler(
                err.error[Object.keys(err.error)[0]][0]
              )
            );
            console.log(err.error);
            console.log('estoy en el pipe');
            return throwError(err);
          })
        )
        .subscribe(
          (data) => {
            console.log('success');
            console.log(this.difunto.id_difunto);
            this.crearResponsable(this.difunto.id_difunto);
            Swal.close();
            Swal.fire('¡Actualización exitosa!');
            this.difuntoForm.reset();
            this.router.navigate(['/inicio/difuntos']);
            return true;
          },
          (error) => {
            console.error('Error:' + error);
            console.log('estoy en el error');

            return throwError(error);
          }
        );
    } else {
      this._difunto
        .postDifunto(formData)
        .pipe(
          catchError((err) => {
            Swal.close();
            Swal.fire(
              this.errorTranslateHandler(
                err.error[Object.keys(err.error)[0]][0]
              )
            );
            console.log(err.error);
            console.log('estoy en el pipe');
            return throwError(err);
          })
        )
        .subscribe(
          (data) => {
            console.log('success');
            this.crearResponsable(data['id_difunto']);
            Swal.close();
            Swal.fire('Registro exitoso');
            this.difuntoForm.reset();
            this.router.navigate(['/inicio/difuntos']);
            return true;
          },
          (error) => {
            console.error('Error:' + error);
            console.log('estoy en el error');

            return throwError(error);
          }
        );
    }
  }

  errorTranslateHandler(error: String) {
    switch (error) {
      case 'usuario with this email address already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este correo, intente con otro';
      }
      case 'usuario with this nombre already exists.': {
        return 'Hubo un error al guardar los datos: Ya existe este nombre de camposanto, intente con otro';
      }
      default: {
        return 'Hubo un error al guardar los datos';
      }
    }
  }

  crearResponsable(id) {
    console.log('Crear Responsable:' + id);
    const formData = new FormData();
    formData.append('nombre', this.responsableForm.value.NombreRes);
    formData.append('apellido', this.responsableForm.value.ApellidoRes);
    formData.append('telefono', this.responsableForm.value.telefono);
    formData.append('celular', this.responsableForm.value.celular);
    formData.append('direccion', this.responsableForm.value.direccion);
    formData.append('correo', this.responsableForm.value.correo);

    if (this.responsableForm.value.parentesco != 'Otro') {
      formData.append('parentezco', this.responsableForm.value.parentesco);
    } else {
      formData.append('parentezco', this.responsableForm.value.otro);
    }

    /* if(this.responsableForm.value.correo != ''){
      formData.append('correo', this.responsableForm.value.correo);
    } */
    console.log(this.responsableForm.value.correo);
    formData.append('id_difunto', id);

    console.log('Estoy revisando los datos del formData');
    console.log(formData.get('celular'));
    console.log(formData.get('nombre'));
    console.log(formData.get('apellido'));
    console.log(formData.get('telefono'));
    console.log(formData.get('direccion'));
    console.log(this.difunto.id_difunto);

    if (this.info_difunto.metodo_conexion == 'PUT') {
      this._difunto.putResponable(formData, this.difunto.id_difunto).subscribe(
        () => {
          console.log(this.responsableForm);
        },
        (error) => {
          console.error('Error:' + error);

          return throwError(error);
        }
      );
    } else {
      this._difunto.postResponsable(formData).subscribe(
        () => {
          console.log(this.responsableForm);
        },
        (error) => {
          console.error('Error:' + error);

          return throwError(error);
        }
      );
    }
  }

  cargarSector() {
    this._sector.getSector(this.id.camposanto).subscribe((resp: any) => {
      this.lista_sector = resp;
    });
  }

  cargarSepultura() {
    this._sepultura.getSepultura(this.id.camposanto).subscribe((resp: any) => {
      this.lista_sepultura = resp;
      console.log(this.lista_sepultura);
    });
  }

  onChangeSepultura(value) {
    this.sepulturaOption = value;
    console.log(this.sepulturaOption);
  }

  onChangeSector(value) {
    this.sectorOption = value;
    console.log(this.sectorOption);
  }

  onChangeBirthDay(value) {
    this.bdayOption = value;
    console.log(this.bdayOption);
  }
  onChangeBirthMonth(value) {
    this.bmonthOption = value;
    console.log(this.bmonthOption);
  }
  onChangeBirthYear(value) {
    this.byearOption = value;
    console.log(this.byearOption);
  }
  onChangeDeathDay(value) {
    this.ddayOption = value;
    console.log(this.ddayOption);
  }
  onChangeDeathMonth(value) {
    this.dmonthOption = value;
    console.log(this.dmonthOption);
  }
  onChangeDeathYear(value) {
    this.dyearOption = value;
    console.log(this.dyearOption);
  }
  fillDeathYear() {
    var deathYears = document.getElementById('yearDeathSelector');
    var currentYear = new Date().getFullYear();

    for (var i = currentYear; i >= 1920; i--) {
      var option = document.createElement('option');
      option.innerHTML = String(i);
      option.value = String(i);
      deathYears.appendChild(option);
    }
  }

  fillBirthYear() {
    var birthYears = document.getElementById('yearBirthSelector');
    var currentYear = new Date().getFullYear();

    for (var i = currentYear; i >= 1920; i--) {
      var option = document.createElement('option');
      option.innerHTML = String(i);
      option.value = String(i);
      birthYears.appendChild(option);
    }
  }

  fillBirthDays() {
    var daysBirth = document.getElementById('daysBirth');

    for (var i = 1; i <= 31; i++) {
      var option = document.createElement('option');
      option.innerHTML = String(i);
      if (i < 10) {
        option.value = '0' + String(i);
        daysBirth.appendChild(option);
      } else {
        option.value = String(i);
        daysBirth.appendChild(option);
      }
    }
  }

  fillDeathDays() {
    var daysDeath = document.getElementById('daysDeath');

    for (var i = 1; i <= 31; i++) {
      var option = document.createElement('option');
      option.innerHTML = String(i);
      if (i < 10) {
        option.value = '0' + String(i);
        daysDeath.appendChild(option);
      } else {
        option.value = String(i);
        daysDeath.appendChild(option);
      }
    }
  }

  crearPunto($event: MouseEvent) {
    if (this.markers.length < 1) {
      this.marker = {
        lat: $event.coords.lat,
        lng: $event.coords.lng,
      };
      this.markers.push(this.marker);
    }
  }

  setearGeoLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position: any) => {
          console.log(position);
          const marker = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markers.push(marker);
          this.latitudFinal = this.markers[0].lat;
          this.longitudFinal = this.markers[0].lng;
          this.cdRef.detectChanges();
        },
        () => {
          console.log('error');
        }
      );
    }
  }
  reescribirRuta(m: Marker, $event: MouseEvent) {
    this.markers[0].lat = $event.coords.lat;
    this.markers[0].lng = $event.coords.lng;
    console.log('dragEnd', m, $event);
  }

  cargarPuntosGeoMapa(id) {
    this._servicioGeo.getListGeolocalizacion(id).subscribe((data) => {
      this.lat = data[0].latitud;
      this.lng = data[0].longitud;
      console.log(data);
    });
  }

  cargarPunto() {
    if (this.markers.length > 0) {
      this.latitudFinal = this.markers[0].lat;
      this.longitudFinal = this.markers[0].lng;
      this.closebutton.nativeElement.click();
    } else {
      this.alertError = true;
    }
    console.log(this.latitudFinal, this.longitudFinal);
  }

  ocultarAlertError() {
    this.alertError = false;
  }
}
