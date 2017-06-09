import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { SliderModule,DialogModule, ButtonModule, InputTextareaModule, DropdownModule, CalendarModule, TabViewModule, DataListModule, PanelModule, DataTableModule,SharedModule,GrowlModule,ToolbarModule,SpinnerModule} from 'primeng/primeng';
import { AngularFireModule, AuthProviders, AuthMethods  } from 'angularfire2';
import { LugaresService } from './servicios/lugares.service';

import { LoginComponent } from './login/login.component';
import { InicioComponent } from './inicio/inicio.component';
import { RouterModule, Routes } from '@angular/router';

import { PasajerosComponent } from './pasajeros/pasajeros.component';
import { PilotosComponent } from './pilotos/pilotos.component';
import { AuthGuard } from './servicios/auth-guard.service';
import { AuthService } from './servicios/auth.service';
import { FacebookService } from 'ng2-facebook-sdk';

const routes: Routes = [
  {
    path: 'pasajero',
    component: PasajerosComponent,
    canActivate: [AuthGuard]  },
  {
    path: 'piloto',
    component: PilotosComponent,
    canActivate: [AuthGuard] },
  {
    path: 'inicio',
    component: InicioComponent,
    canActivate: [AuthGuard] },
  {
    path: 'login',
    component: LoginComponent},
  {
    path: '',
    redirectTo:'login',
    pathMatch:'full'}
];

export const firebaseConfig = {
  apiKey: 'AIzaSyBK0qd_4ojUSmXNqlTnXedoKigJkxPsPlo',
  authDomain: 'expresoride.firebaseapp.com',
  databaseURL: 'https://expresoride.firebaseio.com',
  storageBucket: 'expresoride.appspot.com',
  messagingSenderId: '741575044761'
};

const myFirebaseAuthConfig = {
  provider: AuthProviders.Facebook,
  method: AuthMethods.Redirect
};

@NgModule({
  declarations: [
    AppComponent,
    PasajerosComponent,
    PilotosComponent,
    LoginComponent,
    InicioComponent
  ],
  imports: [
     RouterModule.forRoot(routes) ,
    BrowserModule,
    FormsModule,
    HttpModule,
    DialogModule,
    ButtonModule,
    InputTextareaModule,
    CalendarModule,
    DropdownModule,
    TabViewModule,
    DataListModule,
    PanelModule,
    DataTableModule,
    SharedModule,
    GrowlModule,
    ToolbarModule,
    SpinnerModule,
    SliderModule,
    AngularFireModule.initializeApp(firebaseConfig, myFirebaseAuthConfig )
  ],
  exports:[RouterModule],
  providers: [ AuthService, FacebookService, AuthGuard, LugaresService],
  bootstrap: [AppComponent]
})
export class AppModule { }
