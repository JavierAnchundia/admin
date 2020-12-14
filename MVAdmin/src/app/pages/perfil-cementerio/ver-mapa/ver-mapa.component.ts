import { Component, OnInit} from '@angular/core';
import { GeolocalizacionService} from '../../../services/geolocalizacion/geolocalizacion.service';
import Swal from 'sweetalert2'
import { Router } from '@angular/router';

@Component({
  selector: 'app-ver-mapa',
  templateUrl: './ver-mapa.component.html',
  styleUrls: ['./ver-mapa.component.css'],
})
export class VerMapaComponent implements OnInit {
  
  marker: Marker;
  id: any;
  zoom: number = 14;
  // inicializar punto central del mapa
  lat: any;
  lng: any;
  markers: Marker[] = [];
  show: Boolean = false;
  loaded:boolean = false;
  constructor(
    private _servicioGeo : GeolocalizacionService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    let url = this.router.url.split("/");
    let idCamposanto = url[url.length - 1];
    
    if(url[url.length - 2] == "perfil"){
      console.log(url[url.length - 2], idCamposanto)
      this.cargarPuntosGeoMapa(idCamposanto);
    }
    // this.id = JSON.parse(localStorage.getItem('camposanto'));
    // this.cargarPuntosGeoMapa(this.id['camposanto']);
  }
  
  async cargarPuntosGeoMapa(id){
    await this._servicioGeo.getListGeolocalizacion(id).subscribe(
      (data) => {
        this.show = true;
        
        for(let punto in data){
          this.marker = {
            lat : data[punto].latitud,
            lng: data[punto].longitud
          }
          this.markers.push(this.marker);
        }
        this.loaded = true;
        this.lat = data[0].latitud;
        this.lng = data[0].longitud;
        console.log(data);
      }
    )
  }
}
interface Marker {
  lat: Number;
  lng: Number;
}
