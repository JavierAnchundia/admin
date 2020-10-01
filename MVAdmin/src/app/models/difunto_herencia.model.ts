import {Difunto} from '../models/difunto.model'

export class DifuntoH implements Difunto{
    nombre:string;
    apellido:string;
    genero: string;
    cedula:string;
    lugar_nacimiento: string;
    fecha_nacimiento: Date;
    lugar_difuncion: string;
    fecha_difuncion: Date;
    no_lapida: Number;
    longitud: Number;
    latitud: Number;
    num_rosas: Number;
    estado: boolean;
    id_camposanto?: any;
    id_difunto?:any;
    id_tip_sepultura?: any;
    id_sector?: any;

    constructor(){
        this.nombre='';
        this.apellido='';
        this.genero=null;
        this.cedula='';
        this.lugar_nacimiento='';
        this.fecha_nacimiento=new Date("0000-00-00");
        this.lugar_difuncion='';
        this.fecha_difuncion= new Date("0000-00-00");
        this.no_lapida= null;
        this.longitud=null;
        this.latitud=null;
        this.num_rosas=0;
        this.estado=false;
     
    }

}
