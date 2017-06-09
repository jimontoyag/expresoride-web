import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class LugaresService {

  lugares: any[];
  valorNombre: any[];

  constructor(private database: AngularFireDatabase) {
    this.database.list('/lugares').subscribe(lugares => {
      this.lugares = [];
      this.valorNombre = [];
      this.lugares.push({label:'',value:null});
      lugares.forEach(lugar => {
        this.lugares.push({label:lugar.nombre, value: lugar.$key, urlBandera: lugar.urlBandera});
        this.valorNombre[lugar.$key] = lugar.nombre;
      });
    });
  }

  getServicioNombre(codigo:string) :string{
    return this.valorNombre[codigo];
  }

}
