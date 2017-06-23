import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LugaresService } from '../servicios/lugares.service';
import { AuthService } from '../servicios/auth.service';
@Component({
  selector: 'app-pasajeros',
  templateUrl: './pasajeros.component.html',
  styleUrls: ['./pasajeros.component.css']
})
export class PasajerosComponent implements OnInit {

cupos: FirebaseListObservable<any[]>;
fecha: Date;
origen: string;
destino: string;


  constructor(private database : AngularFireDatabase, private lugaresService: LugaresService, private authService: AuthService ) { }

  ngOnInit() {
  }
  lugares() : any[]{
    return this.lugaresService.lugares;
  }

  busquedaCupo(){
  this.cupos = this.database.list('/cupos/'+'/'+this.origen+'/'+this.destino+'/'+this.fecha.getFullYear()+'/'+this.fecha.getMonth()+'/'+this.fecha.getDate());
  }
  getServicioNombre(codigo:string):string{
    return this.lugaresService.getServicioNombre(codigo);
  }

}
