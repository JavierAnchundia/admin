export class Usuario{
    constructor(
        public nombre:String,
        public apellido:String,
        public email: String,
        public usuario: String,
        public contraseña: String,
        public estado: boolean,
        public telefono?: String,
        public direccion?: String,
        public genero?: String,
        public idcamposanto?: any,
    ){

    }
}