import { NgModule }             from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PasajerosComponent } from '../pasajeros/pasajeros.component';
import { PilotosComponent } from '../pilotos/pilotos.component';

const routes: Routes = [
  { path: 'pasajero', component: PasajerosComponent },
  { path: 'piloto', component: PilotosComponent }
];

@NgModule({
  imports: [ RouterModule.forRoot(routes) ],
  exports: [ RouterModule ]
})
export class AppRoutingModule {}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
