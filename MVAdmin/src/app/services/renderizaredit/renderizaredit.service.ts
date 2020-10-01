import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class RenderizareditService {

  metodoConexion: String = 'POST';
  infoRenderizar:{difunto:any,sector:any,sepultura:any,responsable:any};


  constructor() {
   }


  getinfoRenderizar(){
    return this.infoRenderizar;
  }
  setinfoRenderizar(infoRenderizar:{difunto:any,sector:any,sepultura:any,responsable:any}){
    this.infoRenderizar=infoRenderizar;
  }

  getMetodoConexion(){
    return this.metodoConexion;
  }

  setMetodoConexion(metodoConexion:String){
    this.metodoConexion = metodoConexion;
  }
}
