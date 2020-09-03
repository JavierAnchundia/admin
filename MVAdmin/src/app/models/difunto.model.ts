export class Camposanto{
    constructor(
        public nombre:String,
        public apellido:String,
        public genero: String,
        public lugarNac: String,
        public fechaNac: any,
        public lugarDef: String,
        public fechaDef: any,
        public nolapida: Number,
        public longitud: Number,
        public latitud: Number,
        public norosas: Number,
        public estado: boolean,
        public idcamposanto?: any,
        public idtiposepultura?: any,
        public idsector?: any,
    ){

    }
}