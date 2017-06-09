import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

@Component({
  selector: 'app-inicio',
  templateUrl: './inicio.component.html',
  styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }
  
  piloto(){
    this.router.navigate(['/piloto']);
  }
  
  pasajero(){
    this.router.navigate(['/pasajero']);
  }

}
