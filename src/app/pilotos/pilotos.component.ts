import { Ubicacion } from '../modelo/ubicacion';
import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase, FirebaseListObservable } from 'angularfire2/database';
import { LugaresService } from '../servicios/lugares.service';
import { AuthService } from '../servicios/auth.service';
import { Router } from '@angular/router';
import { FacebookService} from 'ng2-facebook-sdk';
import { DatePipe } from '@angular/common';

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

  private notifica: boolean = false;

  constructor(private database: AngularFireDatabase, private lugaresService: LugaresService, private router: Router, private fb: FacebookService, private authService: AuthService,
    private datePipe: DatePipe) { }

  ngOnInit() {
  }

  lugares() : any[]{
    return this.lugaresService.lugares;
  }

  getServicioNombre(codigo:string):string{
    return this.lugaresService.getServicioNombre(codigo);
  }

  publicarCupo(){
    let urlEvento = '/cupos/'+this.origen+'/'+this.destino+'/'+this.saleFecha.getFullYear()+'/'+this.saleFecha.getMonth()+'/'+this.saleFecha.getDate();
    this.database.list(urlEvento)
      .push({descripcion:this.descripcion, hora:this.hora, piloto:this.authService.usuario.uid, nombrePiloto:this.authService.usuario.displayName, fotoUrl:this.authService.usuario.photoURL})
        .then(res => {
          let arr = {}, uid =res.path.o[6] ;
          arr[uid]={fecha:this.saleFecha.getFullYear()+'/'+this.saleFecha.getMonth()+'/'+this.saleFecha.getDate(),orDes:this.origen+'/'+this.destino};
          this.database.list('/usuarios/'+this.authService.usuario.uid)
            .update('cupos',arr)
              .then(res =>{
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

  private notificaFacebook(usuario:string){
    console.log('NOTIFICO A: '+usuario);
    let fecha = this.datePipe.transform(this.saleFecha, 'EEEE , d MMMM');
    let fechaSimple = this.datePipe.transform(this.saleFecha, 'yMMdd');
    this.fb.api('/'+usuario+'/notifications?access_token=1832413313701021|54563aae7dfe0c79994ab744e643c842&href=pasajero?fecha%3D'+fechaSimple+'&template=Hay un cupo disponible para el '+fecha,'post');
  }

  irInicio(){
    this.router.navigate(['/inicio']);
  }

}
