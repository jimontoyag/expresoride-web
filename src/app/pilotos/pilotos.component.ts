import { Ubicacion } from '../modelo/ubicacion';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LugaresService } from '../servicios/lugares.service';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { FacebookService} from 'ng2-facebook-sdk';
import { DatePipe } from '@angular/common';
import {Message} from 'primeng/primeng';

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

  msgs: Message[] = [];

  miscupos: boolean = false;

  misEventos: FirebaseListObservable<any[]>;

  private notifica: boolean = false;

  constructor(private database: AngularFireDatabase, private lugaresService: LugaresService, private router: Router, private fb: FacebookService, private authService: AuthService,
    private datePipe: DatePipe) { }

  ngOnInit() {
    let hoy: Date = new Date();
    this.misEventos = this.database.list('/usuarios/'+this.authService.usuario.uid+'/cupos', {
                                                                query: {
                                                                  orderByChild: 'fecha',
                                                                  startAt: this.fechaSimple(hoy)
                                                                }});
  }

  lugares() : any[]{
    return this.lugaresService.lugares;
  }

  getServicioNombre(codigo:string):string{
    return this.lugaresService.getServicioNombre(codigo);
  }

  eliminarCupo(cupo){
    //console.log('/cupos/'+cupo.origen+'/'+cupo.destino+'/'+cupo.fecha+'/'+cupo.$key);
    this.database.object('/cupos/'+cupo.origen+'/'+cupo.destino+'/'+cupo.fecha+'/'+cupo.$key).remove();
    this.database.object('/usuarios/'+this.authService.usuario.uid+'/cupos/'+cupo.$key).remove();
  }

  publicarCupo(){
    if(this.validar()){
      let urlEvento = '/cupos/'+this.origen+'/'+this.destino+'/'+this.datePipe.transform(this.saleFecha, 'y/MM/dd');
      this.database.list(urlEvento)
        .push({descripcion:this.descripcion, hora:this.hora, piloto:this.authService.usuario.uid, nombrePiloto:this.authService.usuario.displayName, fotoUrl:this.authService.usuario.photoURL})
          .then(res => {
            let arr = {}, uid =res.path.o[6] ;
            arr[uid]={fecha:this.fechaSimple(this.saleFecha),origen:this.origen, destino:this.destino, hora:this.hora, descripcion:this.descripcion};
            this.database.list('/usuarios/'+this.authService.usuario.uid)
              .update('cupos',arr)
                .then(res =>{
                  this.limpiar();
                  this.show({severity:'success', summary:'Éxito', detail:'Se ha publicado correctamente el cupo (:'});
                  this.notifica = true;
                  this.database.list(urlEvento+'/notifica').subscribe(usuarios =>{
                    if(this.notifica){
                      usuarios.forEach(usuario =>{
                        this.notificaFacebook(usuario.$key);
                      });
                      this.notifica = false;
                    }
                  });
                }).catch(err => {
                  console.log(err);
                });
          }).catch(err =>{
            console.log(err);
          });
    }
  }

  fechaAsimpleDeTexto(fechaSimple: string) : string{
    let fecha = new Date(+fechaSimple.slice(0,4), (+fechaSimple.slice(5,7)-1), +fechaSimple.slice(8,10),0,0,0,0);
    return this.datePipe.transform(fecha, 'EEEE , d MMMM');
  }

  private fechaSimple (fecha:Date): string{
    return this.datePipe.transform(fecha, 'y/MM/dd');
  }

  private notificaFacebook(usuario:string){
    let fecha = this.datePipe.transform(this.saleFecha, 'EEEE , d MMMM');
    let params = {
        "recipient": {
          "id": usuario
        },
        "message": {
          "text": "Cupo disponible para el "+fecha
        }
      };
    //this.fb.api('/1375368689192856/messages?access_token=EAAaCkfilFJ0BAAy4bmZBqk7e1qEZCrZCDJ4KpCSEjSNko014efeYN6y5ZCTcrGXS94aGi38caUmCY0OGRTvXOsU3MTP78ID6RlrZBQP0HBi0BCbO7VRNJyip2D276oFCPWfXeZB9oiX1CynRaddFghtv1Nw0JnwW19XKbh7ExFuAZDZD','post', params);
    this.fb.api('/'+usuario+'/notifications?access_token=1832413313701021|54563aae7dfe0c79994ab744e643c842&href=pasajero?fecha%3D'+this.fechaSimple(this.saleFecha)+'&template=Hay un cupo disponible para el '+fecha,'post');
  }

  private validar(){
    let exito :boolean = true;
    if(!this.origen){
      exito = false;
      this.show({severity:'warn', summary:'Indica el Origen'});
    }
    if(!this.origen){
      exito = false;
      this.show({severity:'warn', summary:'Indica el Destino'});
    }
    if(!this.saleFecha){
      exito = false;
      this.show({severity:'warn', summary:'Indica la Fecha de Salida'});
    }
    if(!this.hora){
      this.hora = 0;
    }
    if(!this.descripcion){
      this.descripcion = 'Viajemos con ExpressoRide ;)';
    }
    return exito;
  }

  cambioDes(nuevo){
    if(nuevo == this.origen ){
      this.destino = null;
    }
  }

  cambioOri(nuevo){
    if(nuevo == this.destino ){
      this.origen = null;
    }
  }

  limpiar(){
    this.destino = null;
    this.origen = null;
    this.saleFecha = null;
    this.hora = null;
    this.descripcion = null;
  }

  irInicio(){
    this.router.navigate(['/inicio']);
  }

  misCupos(){
    this.miscupos = !this.miscupos;
  }

  private show(mensaje) {
    this.msgs.push(mensaje);
}

}
