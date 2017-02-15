import { Component } from '@angular/core';

import { AngularFire, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';
import { FacebookService, FacebookInitParams } from 'ng2-facebook-sdk';

import {database} from 'firebase';

import { Evento } from './modelo/evento';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [FacebookService]  
})
export class AppComponent {
  title = 'Schedule Rides';
  header: any;
  
  event: Evento = new Evento();
  display: boolean = false;
  displayCrear: boolean = false;
  cargando: boolean = true;
  
  private token:string;
  
  private af : AngularFire;  
  private fb: FacebookService;
  
  dispSchedule:boolean = false;  
  
  private usuario: firebase.UserInfo;    
  
  eventos: FirebaseListObservable<Evento[]>;  
  
  constructor(af: AngularFire, fb: FacebookService) {
    this.header = {
      left: 'prev,next today',
      center: 'title',
      right: 'month,agendaWeek,agendaDay'
    };
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
            this.eventos = this.af.database.list('/eventos'); 
            this.dispSchedule = true;   
            this.cargando = false;  
          }else{
            this.cargando = false;          
          }                         
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
  
  crearEvento(){
      this.peteneceAGrupo('502606019798663').then(pertenece=>{
          this.af.database.list('/eventos').push(this.event); 
          this.displayCrear=false;                      
          });  
  }
  
  preCrearEvento(){
      this.event = new Evento();
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