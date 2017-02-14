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
    this.af.auth.subscribe(auth => {
      this.cambiaEstadoSesion(auth);
    });
  }
  
  private cambiaEstadoSesion(auth:FirebaseAuthState){
    if(auth == null){
        this.usuario = null;
        this.dispSchedule = false;
        this.eventos = null;
        this.fb.logout().then(rel => {});
      }else{
        this.fb.login().then(res => {
        this.usuario = auth.facebook;
        this.peteneceAGrupo('502606019798663').then(pertenece=>{
          this.af.database.list('/usuarios').update(this.usuario.uid, { 
            nombre: this.usuario.displayName,
            fotoUrl:this.usuario.photoURL});
          this.eventos = this.af.database.list('/eventos'); 
          this.dispSchedule = true;                    
          });                        
        });         
      } 
  }
  
  private peteneceAGrupo(grupo:string): Promise<boolean>{
    return this.fb.api('/'+grupo+'/members?limit=100000').then(res => {
      var pertenece: boolean = false;
      res.data.forEach(member =>{
        if(this.usuario.uid == member.id) return true;  
      });
      return false;
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
  
  logout() {
     this.af.auth.logout();
  }
  
}