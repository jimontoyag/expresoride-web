import { Component, OnInit } from '@angular/core';

import { AngularFire, FirebaseListObservable, FirebaseAuthState, FirebaseObjectObservable } from 'angularfire2';
import { FacebookService, FacebookInitParams } from 'ng2-facebook-sdk';

import {database} from 'firebase';

import { Evento } from './modelo/evento';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FacebookService]  
})
export class AppComponent implements OnInit{
  title = 'Schedule Rides';
  header: any;
  
  event: Evento = new Evento();
  display: boolean = false;
  displayCrear: boolean = false;
  cargando: boolean = true;
  lugares: any[];
  msgs:any;

  private sinFiltro:Evento[];
  filtroEnd: Date;
  filtroStart: Date;
  filtroOrigen: string;
  filtroDestino:string;
  
  private token:string;
  
  private af : AngularFire;  
  private fb: FacebookService;
  
  dispSchedule:boolean = false;  
  
  usuario: firebase.UserInfo;    
  
  eventos: Evento[];
  misEventos: Evento[];  

  private eventosObs: FirebaseListObservable<any>; 
  
  constructor(af: AngularFire, fb: FacebookService) {
    this.af = af;    
    this.fb = fb;
    let fbParams: FacebookInitParams = {
                                   appId: '1832413313701021',
                                   version: 'v2.8'                                   
                                   };
    this.fb.init(fbParams);
    this.fb.getLoginStatus().then(res => {
      if (res.status === 'connected') {
        this.token = res.authResponse.accessToken;
        this.af.auth.subscribe(auth => {
          this.cambiaEstadoSesion(auth, res.authResponse.userID);
        });
        } else{
        this.estadoFuera();
      }  
    }); 
  }

  ngOnInit() { 
    this.limpiaFiltro();
    this.lugares = [];
    this.lugares.push({label:'', value:undefined});
    this.lugares.push({label:'Bogota', value:'bgt'});
    this.lugares.push({label:'Ibague', value:'ibg'});
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };     
   }

  private filtro(evento: Evento):boolean{
    let muestra = true;
    
    if(this.filtroStart && this.filtroStart > evento.end){
      muestra = false;
    }

    if(this.filtroEnd && this.filtroEnd < evento.start){
      muestra = false;
    }

    if(this.filtroOrigen && this.filtroOrigen != evento.origen){
      muestra = false;
    }

    if(this.filtroDestino && this.filtroDestino != evento.destino){
      muestra = false;
    }

    return muestra;
  }
  
  private estadoFuera(){
        this.usuario = null;
        this.dispSchedule = false;
        this.eventos = null;
        this.cargando = false;  
  }
  
  private cambiaEstadoSesion(auth:FirebaseAuthState, uid:string){
    if(auth == null){
        this.estadoFuera();
      }else{
        this.usuario = auth.facebook;
      if(!this.usuario.uid){
        this.usuario = auth.auth.providerData[0];      
      }
      
        this.peteneceAGrupo('502606019798663').then(pertenece=>{
          if(pertenece){
            this.af.database.list('/usuarios').update(this.usuario.uid, { 
              nombre: this.usuario.displayName,
              fotoUrl:this.usuario.photoURL});
            this.eventosObs = this.af.database.list('/eventos', {
                                                                query: {
                                                                  orderByChild: 'end',
                                                                  startAt: (new Date()).getTime()
                                                                }
                                                              });
            this.eventosObs.subscribe(eventos => {
              this.eventos = eventos;
              this.misEventos = new Array<Evento>();
              for(let i= 0; i<eventos.length; i++){
                this.af.database.object('/usuarios/'+this.eventos[i].usuario).subscribe(res => {
                  this.eventos[i].fotoUrl = res.fotoUrl;
                  this.eventos[i].nombreUsuario = res.nombre;
                  this.eventos[i].id = eventos[i].$key;
                  if(this.eventos[i].usuario == this.usuario.uid){
                    this.misEventos.push(this.eventos[i]);
                  }
                });
              }  
              this.sinFiltro = this.eventos;           
            });

            this.dispSchedule = true;   
            this.cargando = false;
          }else{
            this.cargando = false;   
            this.showMsg('error',':(','Para poder acceder, debes ser mienbro del grupo Expreso Ibagué Péguese la Rodadita');       
          }                         
          }).catch(err=>{
            this.showMsg('error',':(*****',err);
          });                        
               
      } 
  }
  
  private peteneceAGrupo(grupo:string): Promise<boolean>{
    return this.fb.api('/'+grupo+'/members?access_token='+this.token+'&limit=100000').then(res => {
      var pertenece:boolean = false;
      res.data.forEach(member =>{
        if(this.usuario.uid == member.id){
          pertenece = true;
        } 
      });
      return pertenece;
    });
  }

  private hoy():string{
    let hoy: Date = new Date(Date.now());
    return this.toStringDate(hoy);
  }

  private aMes(mes:number):string{
    mes++;
    return this.ceroAIzq(mes);
  }

  private ceroAIzq(num:number):string{
    if(num < 10){
      return '0'+num;
    }else{
      return num+'';
    }
  }

  private toStringDate(fecha:Date): string{
    return fecha.getFullYear()+'-'+this.aMes(fecha.getMonth())+'-'+this.ceroAIzq(fecha.getDate())+'T'+this.ceroAIzq(fecha.getHours())+':'+this.ceroAIzq(fecha.getMinutes())+':00';
  }

  private diaSemana(dia:number):string{
    switch (dia) {
      case 0:
        return 'Domingo';      
      case 1:
        return 'Lunes';
      case 2:
        return 'Martes';      
      case 3:
        return 'Miércoles';
      case 4:
        return 'Jueves';      
      case 5:
        return 'Viernes';
      case 6:
        return 'Sábado';
    }
  }

  private showMsg(severity:string, summary:string, detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
  }

  private dateAUTC(fecha:Date):Date{
    let fechaAux: Date = new Date();
    fechaAux.setFullYear(fecha.getUTCFullYear());
    fechaAux.setMonth(fecha.getUTCMonth());
    fechaAux.setDate(fecha.getUTCDate());
    fechaAux.setHours(fecha.getUTCHours());
    fechaAux.setMinutes(fecha.getUTCMinutes());
    return fechaAux;
  }

  filtrar(){
    this.eventos = this.sinFiltro.filter(evento => this.filtro(evento));
    if(this.eventos.length === 0){
      this.showMsg('warn','','No se encontraron cupos :(');
    }
  }

  limpiaFiltro(){
    this.filtroStart = undefined;
    this.filtroEnd = undefined;
    this.filtroOrigen = undefined;
    this.filtroDestino = undefined;
    this.eventos = this.sinFiltro;
  }

  fechaSalida(fechaStr:string):string{
    let fecha: Date = new Date(fechaStr);
    return this.diaSemana(fecha.getDay())+' '+fecha.getDate()+' - '+this.ceroAIzq(fecha.getHours())+':'+this.ceroAIzq(fecha.getMinutes())+':00';
  }
  
  crearEvento(){
    if(this.event.start.getTime() >= this.event.end.getTime()){
      this.showMsg('warn','Validación','La fecha de Salida debe ser antes de la fecha Máxima');
    }else if(this.event.destino == this.event.origen){
      this.showMsg('warn','Validación','El origen y el destino deben ser diferentes');
    }else{
      if(!this.event.descripcion){
        this.event.descripcion = '';
      }
      if(this.event.id){
            this.af.database.list('/eventos').update(this.event.id, { 
              descripcion:this.event.descripcion,
              destino:this.event.destino ,
              end:this.event.end.getTime(),
              origen:this.event.origen ,
              start:this.event.start.getTime()
             });
            this.displayCrear=false; 
          }else{
            this.event.start = this.event.start.getTime();
            this.event.end = this.event.end.getTime();
            this.event.descripcion = this.event.descripcion;
            this.af.database.list('/eventos').push(this.event); 
            this.displayCrear=false;  
          }  

    }
  }

  eliminarEvento(llave:string){
    this.af.database.list('/eventos').remove(llave); 
  }

  editarEvento(evento:Evento){
    this.event = new Evento();
    this.event.start = new Date(evento.start);
    this.event.end = new Date(evento.end);
    this.event.id = evento.id;
    this.event.allDay = evento.allDay;
    this.event.descripcion = evento.descripcion;
    this.event.destino = evento.destino;
    this.event.origen = evento.origen;
    this.event.usuario = evento.usuario;
    this.event.cupos = evento.cupos;
    this.event.fotoUrl = evento.fotoUrl;
    this.event.nombreUsuario = evento.nombreUsuario;
    this.displayCrear = true;
  }
  
  preCrearEvento(){
      this.event = new Evento();
      this.event.usuario = this.usuario.uid;
      this.event.allDay = false;
      this.event.origen = 'ibg';
      this.event.destino = 'bgt';
      this.event.start = new Date();
      this.event.end = new Date();
      this.displayCrear = true;
  }
  
  showDialog(event) {
    this.event = new Evento();
    this.event = event.calEvent;
    this.af.database.object('/usuarios/'+this.event.usuario).subscribe(res => {
        this.event.fotoUrl = res.fotoUrl;
        this.event.nombreUsuario = res.nombre;
      });
    this.display = true;
   }
  
   login() {         
       this.af.auth.login();           
  }
  
}