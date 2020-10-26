import { Component, OnInit, ViewChild } from '@angular/core';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { GeolocalizacionService} from '../../../services/geolocalizacion/geolocalizacion.service';
import { Punto_geolocalizacion } from '../../../models/punto_geolocalizacion.model'
import { Router } from '@angular/router';
import Swal from 'sweetalert2'
declare const google: any;

@Component({
  selector: 'app-editar-mapa',
  templateUrl: './editar-mapa.component.html',
  styleUrls: ['./editar-mapa.component.css']
})
export class EditarMapaComponent implements OnInit {
  @ViewChild('closebutton') closebutton;

  faEraser = faEraser;
  lat = 0;
  lng = 0;
  zoom = 14.4;
  id: any;
  alertError: Boolean = false;
  puntosGeo: Punto_geolocalizacion[] = [];
  punto: Punto_geolocalizacion;
  pointList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  loaded:boolean = false;

  constructor(
    private _servicioGeo : GeolocalizacionService,
    private router: Router,
  ) {
    //this.id = JSON.parse(localStorage.getItem('camposanto'));
    //this.cargarPuntosGeoMapa(this.id.camposanto)
  }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.setCurrentPosition();
  }

  cargarPuntosGeoMapa(id){
    this._servicioGeo.getListGeolocalizacion(id).subscribe(
      (data) => {
        this.puntosGeo = data;
        this.eliminarPuntos();
        this.crearNuevosPuntos();
        this._servicioGeo.getListGeolocalizacion(id).subscribe(
          data=> {
            console.log('linea 50', data)
          }
        )
        
      }
    )
  }

  actualizarPuntos(){
    Swal.showLoading();
    console.log(this.puntosGeo)
    Swal.showLoading()
    this.cargarPuntosGeoMapa(this.id.camposanto);
  }

  redirectProfile(value){
    this.router.navigate(['/inicio/perfil', value])
    console.log("id-> "+value);
  }

  eliminarPuntos(){
    for(let punto in this.puntosGeo){
      let idPunt = this.puntosGeo[punto].id_punto;
      this._servicioGeo.deletePointGeolocalizacion(idPunt).subscribe(
        resp => {
          console.log(resp.status);
        }
      )
    }
  }

  async crearNuevosPuntos(){
    console.log('linea74',this.pointList);
    if(this.pointList.length > 0){
      for(let punt = 0; punt < this.pointList.length; punt++ ){
        this.punto = {
          id_punto: null,
          latitud: this.pointList[punt].lat,
          longitud:  this.pointList[punt].lng,
          id_camposanto: this.id.camposanto
        }
        await this._servicioGeo.postListGeolocalizacion(this.punto);
        this.closebutton.nativeElement.click();
        if(punt == this.pointList.length-1 ){
          Swal.close();
          Swal.fire("Actualización exitosa de los puntos del Mapa");
          await this.delay(500);
          window.location.reload()
        }
      }
    }
    else{
      this.alertError = true;
    }
  }
  //sleep para mostrar el mensaje de actualizaion de los puntos
  delay(ms: number) {
      return new Promise( resolve => setTimeout(resolve, ms) );
  }

  onMapReady(map) {
    this.initDrawingManager(map);
    this.loaded= true;
  }

  initDrawingManager = (map: any) => {
    const self = this;
    const options = {
      drawingControl: true,
      drawingControlOptions: {
        drawingModes: ['polygon'],
      },
      polygonOptions: {
        draggable: true,
        editable: true,
      },
      drawingMode: google.maps.drawing.OverlayType.POLYGON,
    };
    this.drawingManager = new google.maps.drawing.DrawingManager(options);
    this.drawingManager.setMap(map);
    google.maps.event.addListener(
      this.drawingManager,
      'overlaycomplete',
      (event) => {
        if (event.type === google.maps.drawing.OverlayType.POLYGON) {
          const paths = event.overlay.getPaths();
          for (let p = 0; p < paths.getLength(); p++) {
            google.maps.event.addListener(
              paths.getAt(p),
              'set_at',
              () => {
                if (!event.overlay.drag) {
                  self.updatePointList(event.overlay.getPath());
                }
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'insert_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
            google.maps.event.addListener(
              paths.getAt(p),
              'remove_at',
              () => {
                self.updatePointList(event.overlay.getPath());
              }
            );
          }
          self.updatePointList(event.overlay.getPath());
        }
        if (event.type !== google.maps.drawing.OverlayType.MARKER) {
          self.drawingManager.setDrawingMode(null);
          self.drawingManager.setOptions({
            drawingControl: false,
          });

          // set selected shape object
          const newShape = event.overlay;
          newShape.type = event.type;
          this.setSelection(newShape);

        }
      }
    );
  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.lat = position.coords.latitude;
        this.lng = position.coords.longitude;
      });
    }
  }
  clearSelection() {
    if (this.selectedShape) {
      this.selectedShape.setEditable(false);
      this.selectedShape = null;
      this.pointList = [];
    }
  }
  setSelection(shape) {
    this.clearSelection();
    this.selectedShape = shape;
    shape.setEditable(true);
  }

  deleteSelectedShape() {
    if (this.selectedShape) {
      this.selectedShape.setMap(null);
      this.pointList = [];
      this.drawingManager.setOptions({
        drawingControl: true,
      });
    }
  }

  updatePointList(path) {
    this.pointList = [];
    const len = path.getLength();
    for (let i = 0; i < len; i++) {
      this.pointList.push(
        path.getAt(i).toJSON()
      );
    }
  }
}
