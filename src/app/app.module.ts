import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import {ScheduleModule, DialogModule} from 'primeng/primeng';
import { AngularFireModule } from 'angularfire2';

export const firebaseConfig = {
  apiKey: 'AIzaSyBK0qd_4ojUSmXNqlTnXedoKigJkxPsPlo',
  authDomain: 'expresoride.firebaseapp.com',
  databaseURL: 'https://expresoride.firebaseio.com',
  storageBucket: 'expresoride.appspot.com',
  messagingSenderId: '741575044761'
};

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ScheduleModule,
    DialogModule,
    AngularFireModule.initializeApp(firebaseConfig)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
