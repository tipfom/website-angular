import { Injectable } from '@angular/core';
import { LoginService } from './login.service';
import { CanActivate, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(public loginService: LoginService, public router: Router) { }

  canActivate(): boolean {
    if (!this.loginService.isLoggedIn()) {
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
}
