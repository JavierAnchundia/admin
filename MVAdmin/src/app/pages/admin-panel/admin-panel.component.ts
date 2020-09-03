import { Component, OnInit } from '@angular/core';
import { UsuarioService } from '../../services/usuario/usuario.service';

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {
  id:any;
  lista_admin: any[] = [];
  constructor(private _usuario: UsuarioService) { }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarAdmin();
  }

  cargarAdmin(){
    this._usuario.getUsers()
    .subscribe((resp:any)=>{
      this.lista_admin = [];
      for (var i =0; i < resp.length; i++){
        if((resp[i]['tipo_usuario']=="ad")|| (resp[i]['tipo_usuario']=="su")){
          if(resp[i]['id_camposanto']== this.id.camposanto){
            this.lista_admin.push(resp[i]);

          }
          
        }
      }
    })
  }

}
