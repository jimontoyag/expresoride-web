import { Component } from '@angular/core';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']  
})
export class AppComponent {
  title = 'Schedule Rides';
  events = [
            {
                "title": "All Day Event",
                "start": "2017-01-01"
            },
            {
                "title": "Long Event",
                "start": "2017-01-07",
                "end": "2017-01-10"
            },
            {
                "title": "Repeating Event",
                "start": "2017-01-09T16:00:00"
            },
            {
                "title": "Repeating Event",
                "start": "2017-01-16T16:00:00"
            },
            {
                "title": "Conference",
                "start": "2017-01-11",
                "end": "2017-01-13"
            }
        ];
  
  display: boolean = false;
  event: MyEvent = new MyEvent();
  af : AngularFire;
  dispSchedule:boolean = false;
  
  tituloDialogo: String;
  
    

    showDialog(event) {
        this.display = true;
        this.tituloDialogo= event.calEvent.title;
        this.event = new MyEvent();
        this.event.comment = event.calEvent.comment;
    }
  
  items: FirebaseListObservable<any[]>;
  constructor(af: AngularFire) {
    this.af = af;
    this.items = af.database.list('/eventos');   
    this.af.auth.subscribe(auth => {
      if(auth == null){
        this.dispSchedule = false;
      }else{
        this.dispSchedule = true;
      } 
    });
  }
  
   login() {
    this.af.auth.login();   
  }
  
  logout() {
     this.af.auth.logout();
  }
  
}

export class MyEvent {
    id: number;
    title: string;
    start: string;
    end: string;
    allDay: boolean = false;
    comment: string;
}
