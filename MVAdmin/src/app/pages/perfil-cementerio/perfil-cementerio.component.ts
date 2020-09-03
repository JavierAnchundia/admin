import { Component, OnInit } from '@angular/core';
import { faEraser, faMapMarkedAlt, faMapMarker } from '@fortawesome/free-solid-svg-icons';
import { CamposantoService } from 'src/app/services/servicios.index';
import { Router, ActivatedRoute } from '@angular/router';
import { RedsocialService } from '../../services/redsocial/redsocial.service';

@Component({
  selector: 'app-perfil-cementerio',
  templateUrl: './perfil-cementerio.component.html',
  styleUrls: ['./perfil-cementerio.component.css']
})
export class PerfilCementerioComponent implements OnInit {

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
  camposanto: any;
  empresa: any;
  data:any;
  redes:any;

  constructor(public _servicio: CamposantoService, public _redes: RedsocialService, public router: Router, public route: ActivatedRoute) { }
  
  
  ngOnInit(): void {
    this.data = this.route.snapshot.paramMap.get('id');
    this.cargarCamposanto();
    this.cargarRedes();
  }

  cargarCamposanto() {
    this._servicio.getCamposantoByID(this.data)
      .subscribe((resp: any) => {
        this.camposanto = resp;
         this.cargarEmpresa(resp.id_empresa);

      })
  }

  cargarEmpresa(id){
    this._servicio.getEmpresa(id).subscribe((resp: any) => {
      this.empresa = resp;
      console.log();
      localStorage.setItem('camposanto', JSON.stringify({camposanto: this.camposanto['id_camposanto'], empresa: this.empresa['id_empresa']}));
    })
  }

  cargarRedes() {
    this._redes.getRedes(this.data)
    .subscribe((resp:any)=>{
      console.log(resp);
      this.redes = resp;
    })
  }
}
