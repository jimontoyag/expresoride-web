import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LugaresService } from '../servicios/lugares.service';
import { AuthService } from '../servicios/auth.service';
import { DatePipe } from '@angular/common';
import { Router } from '@angular/router';

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
busco: boolean = false;


  constructor(private database : AngularFireDatabase, private lugaresService: LugaresService, private authService: AuthService, private datepipe: DatePipe
  , private router: Router ) { }

  ngOnInit() {
    let parametros = this.authService.parametros;
    this.authService.parametros = null;
    if(parametros){
      if(parametros['fecha'] && parametros['origen'] && parametros['destino']){
        this.origen = parametros['origen'];
        this.destino = parametros['destino'];
        let fechaSimple = parametros['fecha'];
        if(fechaSimple.length == 8){
          this.fecha = new Date(+fechaSimple.slice(0,4), (+fechaSimple.slice(4,6)-1), +fechaSimple.slice(6,8),0,0,0,0);
          this.busquedaCupo();
        }
      }
    }
  }
  lugares() : any[]{
    return this.lugaresService.lugares;
  }

  busquedaCupo(){
    this.busco = true;
    this.cupos = this.database.list('/cupos/'+'/'+this.origen+'/'+this.destino+'/'+this.datepipe.transform(this.fecha, 'y/MM/dd'));
      // this.fecha.getFullYear()+'/'+this.fecha.getMonth()+'/'+this.fecha.getDate());
  }
  getServicioNombre(codigo:string):string{
  console.log(codigo);
  console.log(this.lugaresService.getServicioNombre(codigo));
    return this.lugaresService.getServicioNombre(codigo);
  }
  getServicioUrl(codigo:string):string{
    return this.lugaresService.getServicioUrl(codigo);
  }

  irInicio(){
    this.router.navigate(['/inicio']);
  }

}
