import { Injectable }       from '@angular/core';
import {
  CanActivate, Router,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,Route
}                           from '@angular/router';
import { AuthService }      from './auth.service';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private authService: AuthService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    let url: string = state.url;
    return this.checkLogin(url, route.queryParams);
  }

  checkLogin(url: string, params): boolean {
    if (this.authService.isLoggedIn) {
      this.authService.redirectUrl = null;
      return true; }

    // Store the attempted URL for redirecting
    this.authService.redirectUrl = url;
    this.authService.parametros = params;

    // Navigate to the login page with extras
    this.router.navigate(['/login']);
    return false;
  }
}


/*
Copyright 2017 Google Inc. All Rights Reserved.
Use of this source code is governed by an MIT-style license that
can be found in the LICENSE file at http://angular.io/license
*/
