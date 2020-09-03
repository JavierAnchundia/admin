import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DifuntoService } from '../../services/difunto/difunto.service';

@Component({
  selector: 'app-difuntos-panel',
  templateUrl: './difuntos-panel.component.html',
  styleUrls: ['./difuntos-panel.component.css']
})
export class DifuntosPanelComponent implements OnInit {
  id:any;
  lista_difuntos: any[] = [];;
  data: any = {};
  difunto:[]=[];


  @Output() dataEvent = new EventEmitter();

  constructor(public _difuntos: DifuntoService) { }

  ngOnInit(): void {
    this.id = JSON.parse(localStorage.getItem('camposanto'));
    this.cargarDifuntos();
  }

  cargarDifuntos(){
    this._difuntos.getDifuntos(this.id.camposanto)
    .subscribe((resp:any)=>{
        this.lista_difuntos=resp; 
        console.log(this.lista_difuntos);       
      
    })
  }

  senddata(difunto) {
    this.difunto = difunto;
}

updateData(){

}
}
