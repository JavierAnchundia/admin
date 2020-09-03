import { Injectable } from '@angular/core';
import {Camposanto} from '../../models/camposanto.model'

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  cementerios: Array<Camposanto> =[]
  constructor() {

    /* this.cementerios=[{nombre:"Parque de la Paz - La Aurora",direccion:"La Aurora- Av. León Febres Cordero Km. 13 ½, Daule", imagenURL:"../../../assets/parquedelapaz.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"},
                      {nombre:"Cementerio General", direccion:"José Mascote 101 y, Guayaquil 090313 ", imagenURL:"../../../assets/cementeriogeneral.jpg"} ]
 */
   }
}
