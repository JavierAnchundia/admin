import { Injectable } from '@angular/core';
import {Usuario } from '../../models/usuario.model'
import {Permiso} from '../../models/permiso.model'
@Injectable({
  providedIn: 'root'
})
export class RenderizareditService {

  metodoConexion: String = 'POST';
  infoRenderizarDifunto:{difunto:any,sector:any,sepultura:any,responsable:any}; //={difunto: '',sector: '',sepultura: '',responsable: ''}
  infoRenderizarAdmin:{admin:Usuario,permisos:Array<Permiso>};

  constructor() {
   }


  getinfoRenderizarDifunto(){
    return this.infoRenderizarDifunto;
  }
  setinfoRenderizarDifunto(infoRenderizarDifunto:{difunto:any,sector:any,sepultura:any,responsable:any}){
    this.infoRenderizarDifunto=infoRenderizarDifunto;
  }
  setinfoDifuntoDifunto(difunto:any){
    this.infoRenderizarDifunto.difunto=difunto;
  }

  setinfoDifuntoSector(sector:any){
    this.infoRenderizarDifunto.sector = sector;
  }

  setinfoDifuntoSepultura(sepultura:any){
    this.infoRenderizarDifunto.sepultura=sepultura;
  }

  setinfoDifuntoResponsable(responsable:any){
    this.infoRenderizarDifunto.responsable = responsable;
  }

  getinfoRenderizarAdmin(){
    console.log(this.infoRenderizarAdmin)
    return this.infoRenderizarAdmin;
  }

  setinfoRenderizarAdmin(infoRenderizarAdmin:{admin:any,permisos:any}){
    this.infoRenderizarAdmin = infoRenderizarAdmin;
  }
  getMetodoConexion(){
    return this.metodoConexion;
  }

  setMetodoConexion(metodoConexion:String){
    this.metodoConexion = metodoConexion;
  }
}
