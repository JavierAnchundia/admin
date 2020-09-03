import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { SectorService } from 'src/app/services/sector/sector.service';
import { TiposepulturaService } from 'src/app/services/tiposepultura/tiposepultura.service';
import { DifuntoService } from '../../../services/difunto/difunto.service';

@Component({
  selector: 'app-detalle-difunto',
  templateUrl: './detalle-difunto.component.html',
  styleUrls: ['./detalle-difunto.component.css']
})
export class DetalleDifuntoComponent implements OnInit {
  @Input() difunto: any;
  sector: string;
  sepultura: string;
  responsable:any;

  constructor(
    public _sector: SectorService,
    public _sepultura: TiposepulturaService,
    public _difunto: DifuntoService
  ) { }

  ngOnInit(): void {
    console.log(this.difunto);
    this.cargarSector();
    this.cargarSepultura();
    this.cargarResponsable();
  }

  getSector() {
    console.log(this.difunto.id_sector + ',' + this.difunto.id_tip_sepultura);
  }

  cargarSector() {
    this._sector.getSector(this.difunto.id_camposanto)
      .subscribe((resp: any) => {
        console.log(resp);
        for (var i = 0; i < resp.length; i++) {
          if (resp[i]['id_sector'] == this.difunto.id_sector) {
            this.sector = resp[i]['nombre'];
            console.log(resp)
          }
        }
      })
  }

  cargarSepultura() {
    this._sepultura.getSepultura(this.difunto.id_camposanto)
      .subscribe((resp: any) => {
        for (var i = 0; i < resp.length; i++) {

        if (resp[i]['id_tip_sepultura'] == this.difunto.id_tip_sepultura) {
          this.sepultura = resp[i]['nombre'];
        }
      }
      })
  }

  cargarResponsable(){
    this._difunto.getResponsable(this.difunto.id_difunto)
    .subscribe((resp:any)=>{
      console.log(resp);
      this.responsable = resp;
    })
  }

}
