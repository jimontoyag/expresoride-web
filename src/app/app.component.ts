import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable, FirebaseAuthState } from 'angularfire2';

import { Evento } from './modelo/evento';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent {
  title = 'Schedule Rides';
  
  event: Evento = new Evento();
  display: boolean = false;
  
  af : AngularFire;  
  
  dispSchedule:boolean = false;  
  
  usuario: firebase.UserInfo;    

    showDialog(event) {
        this.display = true;
        this.event = new Evento();
        this.event = event.calEvent;
    }
  
  eventos: FirebaseListObservable<Evento[]>;
  constructor(af: AngularFire) {
    this.af = af;    
    this.af.auth.subscribe(auth => {
      this.cambiaEstadoSesion(auth);
    });
  }
  
  private cambiaEstadoSesion(auth:FirebaseAuthState){
    if(auth == null){
        this.usuario = null;
        this.dispSchedule = false;
        this.eventos = null;
      }else{
        this.usuario = auth.facebook;
        this.eventos = this.af.database.list('/eventos');  
        this.dispSchedule = true;
      } 
  }
  
   login() {
    this.af.auth.login();   
  }
  
  logout() {
     this.af.auth.logout();
  }
  
}