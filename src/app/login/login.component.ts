import { AuthService } from '../servicios/auth.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFire,  FirebaseAuthState} from 'angularfire2';
import { FacebookService, FacebookInitParams } from 'ng2-facebook-sdk';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {


  cargando : boolean = true;
  msgs:any;

  private token:string;
  private usuario: firebase.UserInfo;

  constructor(private af: AngularFire, private fb: FacebookService,private router: Router, private ags: AuthService) { }

 ngOnInit() {
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
        this.ags.logout;
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
            this.ags.login(this.usuario,this.token);
            /*
              this.af.database.list('/usuarios').update(this.usuario.uid, {
              nombre: this.usuario.displayName,
              fotoUrl:this.usuario.photoURL});
              */
            this.cargando = false;
            let url = this.ags.redirectUrl;
             if(url != null){
               this.router.navigate([url]);
             }else{
              this.router.navigate(['/inicio']);
             }
          }else{
            this.cargando = false;
            this.showMsg('error',':(','Para poder acceder, debes ser mienbro del grupo Expreso Ibagué Péguese la Rodadita');
          }
          }).catch(err=>{
            this.cargando = false;
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


  private showMsg(severity:string, summary:string, detail:string) {
        this.msgs = [];
        this.msgs.push({severity:severity, summary:summary, detail:detail});
  }

   login() {
       this.af.auth.login();
  }

}
