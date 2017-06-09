import { Injectable } from '@angular/core';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/delay';

@Injectable()
export class AuthService {
  
  //Variables de la sesion
  isLoggedIn: boolean = false;  
  usuario: firebase.UserInfo = null; 
  token:string = null;
  redirectUrl: string = null;

  login(usuario: firebase.UserInfo, token:string = null){
      this.usuario = usuario;
      this.token = token;
      this.isLoggedIn = true;
  }

  logout(): void {
    this.usuario = null;
    this.token = null;
    this.isLoggedIn = false;
  }
}
