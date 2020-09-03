import { Component, OnInit } from '@angular/core';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { CargarGeolocalizacionSadminService } from '../../../services/cargar-geolocalizacion-sadmin/cargar-geolocalizacion-sadmin.service';
declare const google: any;

@Component({
  selector: 'app-poligono-map',
  templateUrl: './poligono-map.component.html',
  styleUrls: ['./poligono-map.component.css']
})
export class PoligonoMapComponent implements OnInit {

  faEraser = faEraser;
  lat = 0;
  lng = 0;
  zoom = 14.4;
  pointList: { lat: number; lng: number }[] = [];
  drawingManager: any;
  selectedShape: any;
  // selectedArea = 0;

  constructor(
    private puntosLocali : CargarGeolocalizacionSadminService
  ) { }

  cargarPuntos(){
    //console.log("cargar", this.pointList)
    //this.puntosLocali.llenarPuntos(this.pointList);
  }

  ngOnInit(): void {
    this.setCurrentPosition();
  }
  onMapReady(map) {
    this.initDrawingManager(map);
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
          // Switch back to non-drawing mode after drawing a shape.
          self.drawingManager.setDrawingMode(null);
          // To hide:
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
      // this.selectedArea = 0;
      this.pointList = [];
      // To show:
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
    //console.log(this.pointList);
    // this.selectedArea = google.maps.geometry.spherical.computeArea(
    //   path
    // );
    this.puntosLocali.llenarPuntos(this.pointList);
  }
}
