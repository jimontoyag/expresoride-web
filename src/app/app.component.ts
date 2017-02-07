import { Component } from '@angular/core';

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

    showDialog() {
        this.display = true;
    }
  
}
