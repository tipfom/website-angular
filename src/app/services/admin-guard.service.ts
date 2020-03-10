import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { CanActivate, Router } from '@angular/router';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AdminGuardService implements CanActivate {

  constructor(public apiService: ApiService, public router: Router) { }

  canActivate() {
    return this.apiService.isLoggedIn().pipe(map(loggedIn => {
      if (loggedIn){
        return true;
      } else {
        this.router.navigate(['login']);
        return false;
      }
    }));
  }
}
