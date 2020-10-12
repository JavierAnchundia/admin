import {Usuario} from '../models/usuario.model'

export class UsuarioH implements Usuario{
    first_name:string;
    last_name:string;
    email: string;
    username: string;
    tipo_usuario:string;
    staff?:boolean;
    telefono?: string;
    direccion?: string;
    genero?: string;
    id_camposanto?: any;

    constructor(){
        this.first_name='';
        this.last_name='';
        this.email='';
        this.username='';
        this.tipo_usuario='';
        this.telefono='';
        this.direccion= '';
        this.genero='';
        
     
    }

}
