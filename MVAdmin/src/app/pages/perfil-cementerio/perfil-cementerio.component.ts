import { Component, OnInit,ViewChild } from '@angular/core';
import { faEraser, faMapMarkedAlt, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CamposantoService } from 'src/app/services/servicios.index';
import { Router, ActivatedRoute } from '@angular/router';
import { RedsocialService } from '../../services/redsocial/redsocial.service';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Empresa } from '../../models/empresa.model';
import { Camposanto } from '../../models/camposanto.model';
import { Red_social } from '../../models/red_social.model';
import Swal from 'sweetalert2';
import { map,catchError } from 'rxjs/operators';
import { of,throwError } from 'rxjs';
import { UsuarioService } from 'src/app/services/usuario/usuario.service';
import URL_SERVICIOS from 'src/app/config/config';


@Component({
  selector: 'app-perfil-cementerio',
  templateUrl: './perfil-cementerio.component.html',
  styleUrls: ['./perfil-cementerio.component.css']
})
export class PerfilCementerioComponent implements OnInit {
  @ViewChild('closeModalEditar') closeModalEditar;
  
  url_backend: String = URL_SERVICIOS.url_backend;
  faMapMarker = faMapMarker;
  faMapMarkedAlt = faMapMarkedAlt;
   cementerio =
  {
    "id": 1,
    "nombre": "Jardines de la esperanza - Guayaquil",
    "direccion": "av. Felipe Pezo y av. El Santuario",
    "telefono": "42595240",
    "correo": "info@jardinesdeesperanza.net",
    "web": "https://www.jardinesdeesperanza.com.ec/quienes-somos.php",
    "ruc": "0999999999999"
  } 
  camposanto: Camposanto = {
    id_camposanto: 0,
    nombre: "",
    direccion: "",
    telefono: "",
    estado: false,
    logo: "",
    id_empresa: 0
  };
  empresa: Empresa = {
    id_empresa: 0,
    nombre: "",
    correo: "",
    ruc: "",
    web: "",
    estado: false,
    direccion_matriz: ""
  }
  data:any;
  redes: Red_social[];
  public form_cementerio: FormGroup;
  constructor(
    public _servicio: CamposantoService, 
    public _redes: RedsocialService, 
    public router: Router, 
    public route: ActivatedRoute,
    private fb: FormBuilder,
    private _usuarioService : UsuarioService
    )
  {
    let ruta = String(this.router.url).split('/').slice(3,);
    let username = localStorage.getItem('username');
    this._usuarioService.getDatosUser(username).toPromise().then(
      (data) => {
        if(data['tipo_usuario'] != 'ha'){
          if(data['id_camposanto'] != ruta[0]){
            this.router.navigate(['/404']);
          }
        }
      })
  }
  
  
  ngOnInit(): void {
    this._usuarioService.loadStorage();
    this.data = this.route.snapshot.paramMap.get('id');
    this.cargarCamposanto();
    this.cargarRedes();
    this.form_cementerio = this.fb.group({
      nombre: [null,],
      direccion: [null,],
      pagina_web: [null,],
      email: [null,],
      ruc: [null, ],
      facebook: [,],
      twitter: [,],
      instagram: [, ],
      youtube: [, ]
    });
  }

  async cargarCamposanto() {
    await this._servicio.getCamposantoByID(this.data)
      .subscribe((resp: any) => {
        this.camposanto = {
          id_camposanto: resp["id_camposanto"],
          nombre: resp["nombre"],
          direccion: resp["direccion"],
          telefono: resp["telefono"],
          estado: resp["estado"],
          logo: resp["logo"],
          id_empresa: resp["id_empresa"]
        };
         this.cargarEmpresa(resp.id_empresa);

      })
  }

  async cargarEmpresa(id){
    await this._servicio.getEmpresa(id).subscribe((resp: any) => {
      this.empresa = {
          id_empresa: resp["id_empresa"],
          nombre: resp["nombre"],
          correo: resp["correo"],
          ruc: resp["ruc"],
          web: resp["web"],
          estado: resp["estado"],
          direccion_matriz: resp["direccion_matriz"]
      }
      localStorage.setItem('camposanto', JSON.stringify({camposanto: this.camposanto['id_camposanto'], empresa: this.empresa['id_empresa']}));
      this.setModalCamposanto();
    })
  }

  async cargarRedes() {
    await this._redes.getRedes(this.data)
    .subscribe((resp:any)=>{
      console.log(resp);
      this.redes = resp;
    })
  }

  setModalCamposanto(){
    let camp = {
      nombre: this.camposanto.nombre,
      direccion: this.camposanto.direccion,
      pagina_web: this.empresa.web,
      email: this.empresa.correo,
      ruc: this.empresa.ruc,
      facebook: '',
      twitter: '',
      instagram: '',
      youtube: ''
    }
    this.form_cementerio.setValue(camp);
  }
  async submit(){
    console.log(this.form_cementerio.value)
    const { nombre, direccion, pagina_web, email, ruc } =  this.form_cementerio.value;
    this.camposanto.nombre = nombre;
    this.camposanto.direccion = direccion;
    this.empresa.web = pagina_web;
    this.empresa.correo = email;
    this.empresa.ruc = ruc;
    let campo = {
      id_camposanto: this.camposanto.id_camposanto,
      nombre: this.camposanto.nombre,
      direccion: this.camposanto.direccion,
      telefono: this.camposanto.telefono,
      id_empresa: this.camposanto.id_empresa
    }
    await this._servicio.putEmpresa(this.empresa)
    
    .subscribe(
      (data) => {
        this.closeModalEditar.nativeElement.click();
        this._servicio.putCamposanto(campo)
        .pipe(
          catchError(err => {
            
            Swal.close()
            Swal.fire(this.errorTranslateHandler(err.error[Object.keys(err.error)[0]][0]) );
            console.log(err.error[Object.keys(err.error)[0]][0]);
            return throwError(err);
        }))
        .subscribe(
          (data) => {
            Swal.close();
            Swal.fire("Actualización Exitosa")
          },
          (error) =>{
          }
        )
      },
      (error) => {
        this.closeModalEditar.nativeElement.click();
      }
    )
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
}
