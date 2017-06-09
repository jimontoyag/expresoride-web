import { Ubicacion } from '../modelo/ubicacion';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LugaresService } from '../servicios/lugares.service';

@Component({
  selector: 'app-pilotos',
  templateUrl: './pilotos.component.html',
  styleUrls: ['./pilotos.component.css']
})
export class PilotosComponent implements OnInit {

  destino: string;
  origen: string;
  saleFecha: Date;
  hora: number;
  descripcion: string;

  constructor(private database: AngularFireDatabase, private lugaresService: LugaresService) { }

  ngOnInit() {
  }

  lugares() : any[]{
    return this.lugaresService.lugares;
  }

  getServicioNombre(codigo:string):string{
    return this.lugaresService.getServicioNombre(codigo);
  }

}
