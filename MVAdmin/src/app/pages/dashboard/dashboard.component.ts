import { Component, OnInit } from '@angular/core';
import {Camposanto} from '../../models/camposanto.model';
import {DashboardService} from '../../services/dashboard/dashboard.service'
import { CamposantoService } from 'src/app/services/servicios.index';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  lista_camposanto: any[] = [];
  
  constructor(public _servicio: CamposantoService, private router: Router) { 
  }

  ngOnInit(): void {
    this.cargarCamposantos();
  }

  cargarCamposantos() {
    this._servicio.getCamposantos()
      .subscribe((resp: any) => {
        console.log('camposanto get')
        console.log(resp);
        this.lista_camposanto = resp;
        
      })
  }

  redirectProfile(value){
    this.router.navigate(['/inicio/perfil', value])
    console.log("id-> "+value);
  }
}