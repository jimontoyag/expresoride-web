import { Injectable } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';

@Injectable()
export class LugaresService {

  lugares: any[];
  valorNombre: any[];
  valorUrl: any[];

  constructor(private database: AngularFireDatabase) {
    this.database.list('/lugares').subscribe(lugares => {
      this.lugares = [];
      this.valorNombre = [];
      this.valorUrl = [];
      
      lugares.forEach(lugar => {
        this.lugares.push({label:lugar.nombre, value: lugar.$key, urlBandera: lugar.urlBandera});
        this.valorNombre[lugar.$key] = lugar.nombre;
        this.valorUrl[lugar.$key] = lugar.urlBandera;
      });
    });
  }

  getServicioNombre(codigo:string) :string{
    return this.valorNombre[codigo];
  }
  getServicioUrl(codigo:string) :string{
    return this.valorUrl[codigo];
  }

}
