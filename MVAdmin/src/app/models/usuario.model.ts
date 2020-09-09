export interface Usuario{
   
        first_name:string,
        last_name:string,
        email: string,
        username: string,
        tipo_usuario:string,
        staff?:boolean,
        telefono?: string,
        direccion?: string,
        genero?: string,
        id_camposanto?: any,
    
}