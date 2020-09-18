import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Validators } from '@angular/forms';
import { DifuntoService } from '../../services/difunto/difunto.service';
import { SectorService } from '../../services/sector/sector.service';
import { TiposepulturaService } from '../../services/tiposepultura/tiposepultura.service';
import { GeolocalizacionService } from '../../services/geolocalizacion/geolocalizacion.service'
import { throwError, Observable } from 'rxjs';
import { MouseEvent } from '@agm/core';
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
import {catchError, map, startWith} from 'rxjs/operators';

@Component({
  selector: 'app-registro-difunto',
  templateUrl: './registro-difunto.component.html',
  styleUrls: ['./registro-difunto.component.css']
})
export class RegistroDifuntoComponent implements OnInit {
  @ViewChild('closebutton') closebutton;
  alertError: Boolean = false;
  lat: any = 0;
  lng: any = 0;
  latitudFinal: Number;
  longitudFinal: Number;
  markers: Marker[] = [];
  marker: Marker;
  zoom: Number = 15;
  difuntoForm: FormGroup;
  responsableForm: FormGroup;
  id: any;
  lista_sector: any;
  lista_sepultura: any;
  sepulturaOption:any;
  sectorOption: string;
  ddayOption: string;
  dmonthOption: string;
  dyearOption: string;
  bdayOption: string;
  bmonthOption: string;
  byearOption: string;
  verPuntos = false;
  submitted = false;
  generoOptions = ["Femenino", "Masculino"]
  monthNames = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
  numericNumberReg= '[0-9]*';

  constructor(
    public _difunto: DifuntoService, 
    public _sector: SectorService, 
    public _sepultura: TiposepulturaService,
    private _servicioGeo : GeolocalizacionService,
    private router:Router
  ) { }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    console.log(this.id);
    this.cargarSector();
    this.cargarSepultura();

    this.difuntoForm = new FormGroup({
      firstName: new FormControl(null, Validators.required),
      lastName: new FormControl(null, Validators.required),
      generoDropdown: new FormControl(null, Validators.required),
      cedula: new FormControl('', [Validators.required, Validators.minLength(9),Validators.maxLength(10),Validators.pattern(this.numericNumberReg)]),
      birthPlace: new FormControl(null, Validators.required),
      deathPlace: new FormControl(null, Validators.required),
      dayBirth: new FormControl(null, Validators.required),
      monBirth: new FormControl(null, Validators.required),
      yearBirth: new FormControl(null, Validators.required),
      dayDeath: new FormControl(null, Validators.required),
      monDeath: new FormControl(null, Validators.required),
      yearDeath: new FormControl(null, Validators.required),
      tipoSepultura: new FormControl(null, Validators.required),
      sector: new FormControl(null, Validators.required),
      lapida: new FormControl(null, Validators.required),
    });

    this.responsableForm = new FormGroup({
      NombreRes: new FormControl(null, Validators.required),
      ApellidoRes: new FormControl(null, Validators.required),
      telefono: new FormControl(null, [Validators.required, Validators.maxLength(9),Validators.minLength(9),Validators.pattern(this.numericNumberReg)]),
      celular: new FormControl(null, [Validators.required, Validators.maxLength(10),Validators.minLength(10),Validators.pattern(this.numericNumberReg)]),
      correo: new FormControl('', [Validators.email]),
      parentesco: new FormControl(null, Validators.required),
      direccion: new FormControl(null, Validators.required),
      otro: new FormControl(null)
    })

    this.fillBirthYear();
    this.fillBirthDays();
    this.fillDeathDays();
    this.fillDeathYear();

    this.cargarPuntosGeoMapa(this.id.camposanto);

    this.filteredOptions_nacimiento = this.difuntoForm.get('birthPlace').valueChanges
      .pipe(
        startWith(''),
        map(value => this._filter_nacimiento(value))
      );

    this.filteredOptions_fallecimiento = this.difuntoForm.get('deathPlace').valueChanges
    .pipe(
      startWith(''),
      map(value => this._filter_fallecimiento(value))
    );

  }


  control_nacimiento = new FormControl();
  options_nacimiento: string[] = ['Guayaquil', 'Cuenca','Quito','Portoviejo','Machala','Durán','Daule'];
  filteredOptions_nacimiento: Observable<string[]>;
  private _filter_nacimiento(value: string): string[] {
    const filterValueN = value.toLowerCase();
    return this.options_nacimiento.filter(optionN => optionN.toLowerCase().includes(filterValueN));
  }

  control_fallecimiento = new FormControl();
  options_fallecimiento: string[] = ['Guayaquil', 'Cuenca','Quito','Portoviejo','Machala','Durán','Daule'];
  filteredOptions_fallecimiento: Observable<string[]>;
  private _filter_fallecimiento(value: string): string[] {
    const filterValueF = value.toLowerCase();
    return this.options_fallecimiento.filter(optionF => optionF.toLowerCase().includes(filterValueF));
  }
  
  get f() { return this.difuntoForm.controls; }

  get r() { return this.responsableForm.controls; }

  onSubmit() {
    this.submitted = true;
    Swal.close()
    if(this.markers.length==0){
      Swal.close();
      console.log(this.verPuntos)
      console.log(this.markers.length)
      if(this.verPuntos) {this.verPuntos= false; return}
      Swal.fire("No ha escogido la ubicación del difunto");
      console.log("antes del elif")
    }else
      if(this.difuntoForm.value.yearBirth >= this.difuntoForm.value.yearDeath){
        this.submitted = false;
        Swal.fire('No se pudo guardar el registro','Existe un error con las fechas. Intente nuevamente')
      }
    
    else {if (this.difuntoForm.valid && this.responsableForm.valid) {
      Swal.showLoading();
      console.log("A punto de entrar a crear Difunto")
      this.crearDifunto();

    } else {
      if (this.difuntoForm.invalid || this.responsableForm.invalid) {
        console.log("despues del elif")

        return;
      }
    }}
  }

  puntosBoton(){
    this.verPuntos = true;
  }

  crearDifunto(){
    const formData = new FormData();
    formData.append('nombre', this.difuntoForm.value.firstName);
    formData.append('apellido', this.difuntoForm.value.lastName);
    formData.append('genero', this.difuntoForm.value.generoDropdown);
    formData.append('cedula', this.difuntoForm.value.cedula);
    formData.append('lugar_nacimiento', this.difuntoForm.value.birthPlace);
    formData.append('fecha_nacimiento', this.difuntoForm.value.yearBirth +'-'+ this.difuntoForm.value.monBirth+'-'+ this.difuntoForm.value.dayBirth);
    formData.append('lugar_difuncion', this.difuntoForm.value.birthPlace);
    formData.append('fecha_difuncion', this.difuntoForm.value.yearDeath +'-'+ this.difuntoForm.value.monDeath+'-'+ this.difuntoForm.value.dayDeath);
    formData.append('no_lapida', this.difuntoForm.value.lapida);
    formData.append('latitud', String(this.latitudFinal));
    formData.append('longitud', String(this.longitudFinal));
    formData.append('num_rosas', '0');
    formData.append('estado', 'True');
    formData.append('id_camposanto', this.id.camposanto);
    formData.append('id_tip_sepultura', this.difuntoForm.value.tipoSepultura);
    formData.append('id_sector', this.difuntoForm.value.sector);
    console.log(formData.get('fecha_nacimiento'))
    this._difunto.postDifunto(formData)
    .pipe(
      catchError(err => {
        
        Swal.close()
        Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]) );
        console.log(err.error);
        console.log("estoy en el pipe")
        return throwError(err);
    }))
    .subscribe(
      data => {
        console.log('success');
        this.crearResponsable(data['id_difunto'])
        Swal.close();
        Swal.fire("Registro exitoso")
        this.difuntoForm.reset();
        this.router.navigate(['/inicio/difuntos']);
        return true;

      },
      error => {
        console.error('Error:' + error);
        console.log("estoy en el error")
        

        return throwError(error);
      }
    );


  }

  errorTranslateHandler(error:String){
    switch(error) { 
      case "usuario with this email address already exists.": { 
         return "Hubo un error al guardar los datos: Ya existe este correo, intente con otro";
      } 
      case   "usuario with this nombre already exists."      : { 
         return "Hubo un error al guardar los datos: Ya existe este nombre de camposanto, intente con otro"      
      } 
      default: { 
         return "Hubo un error al guardar los datos"
      } 
   } 
  }
  
  crearResponsable(id){
    
    const formData = new FormData();
    formData.append('nombre', this.responsableForm.value.NombreRes);
    formData.append('apellido', this.responsableForm.value.ApellidoRes);
    formData.append('telefono', this.responsableForm.value.telefono);
    formData.append('celular', this.responsableForm.value.celular);
    formData.append('direccion', this.responsableForm.value.direccion);
    formData.append('correo', this.responsableForm.value.correo);

    if(this.responsableForm.value.parentesco != 'Otro'){
      formData.append('parentezco', this.responsableForm.value.parentesco);
    }else{
      formData.append('parentezco', this.responsableForm.value.otro);
    }

    /* if(this.responsableForm.value.correo != ''){
      formData.append('correo', this.responsableForm.value.correo);
    } */
    console.log(this.responsableForm.value.correo)
    formData.append('id_difunto',id);
    this._difunto.postResponsable(formData).subscribe(
      () => {
        console.log(this.responsableForm);

      },
      error => {
        console.error('Error:' + error);

        return throwError(error);
      }
    );


  }

  cargarSector() {
    this._sector.getSector(this.id.camposanto)
      .subscribe((resp: any) => {
        this.lista_sector = resp;
      })
  }

  cargarSepultura() {
    this._sepultura.getSepultura(this.id.camposanto)
      .subscribe((resp: any) => {
        this.lista_sepultura = resp;
      })
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
    var deathYears = document.getElementById("yearDeathSelector");
    var currentYear = (new Date()).getFullYear();

    for (var i = currentYear; i >= 1920; i--) {
      var option = document.createElement("option");
      option.innerHTML = String(i);
      option.value = String(i);
      deathYears.appendChild(option);
    }
  }

  fillBirthYear() {
    var birthYears = document.getElementById("yearBirthSelector");
    var currentYear = (new Date()).getFullYear();

    for (var i = currentYear; i >= 1920; i--) {
      var option = document.createElement("option");
      option.innerHTML = String(i);
      option.value = String(i);
      birthYears.appendChild(option);
    }
  }

  fillBirthDays() {
    var daysBirth = document.getElementById("daysBirth");

    for (var i = 1; i <= 31; i++) {
      var option = document.createElement("option");
      option.innerHTML = String(i);
      if (i< 10){
        option.value = '0'+String(i);
        daysBirth.appendChild(option);
      }else{
        option.value = String(i);
        daysBirth.appendChild(option);
      }

    }
  }

  fillDeathDays() {
    var daysDeath = document.getElementById("daysDeath");

    for (var i = 1; i <= 31; i++) {
      var option = document.createElement("option");
      option.innerHTML = String(i);
      if (i< 10){
        option.value = '0'+String(i);
        daysDeath.appendChild(option);
      }else{
        option.value = String(i);
        daysDeath.appendChild(option);
      }
    }

  }

  crearPunto($event: MouseEvent) {
    console.log($event.coords)
    if(this.markers.length<1){
      this.marker = {
        lat: $event.coords.lat,
        lng: $event.coords.lng
      }
      this.markers.push(
        this.marker
      );
    }
  }
  
  reescribirRuta(m: Marker, $event: MouseEvent) {
    this.markers[0].lat = $event.coords.lat
    this.markers[0].lng = $event.coords.lng
    console.log('dragEnd', m, $event);
  }

  cargarPuntosGeoMapa(id){
    this._servicioGeo.getListGeolocalizacion(id).subscribe(
      (data) => {
        this.lat = data[0].latitud;
        this.lng = data[0].longitud;
        console.log(data);
      }
    )
  }

  cargarPunto(){
    if(this.markers.length>0){
      this.latitudFinal = this.markers[0].lat;
      this.longitudFinal = this.markers[0].lng;
      this.closebutton.nativeElement.click();
    }
    else{
      this.alertError = true;
    }
    console.log(this.latitudFinal, this.longitudFinal);
  }

  ocultarAlertError(){
    this.alertError = false;
  }

}
interface Marker {
  lat: Number;
  lng: Number;
}
