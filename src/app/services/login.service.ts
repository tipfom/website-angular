import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(password: string) {
    return this.httpClient.post<LoginToken>('http://localhost:5764', { password })
    .pipe(tap(res => {
      localStorage.setItem("token", res.token);
    }));
  }

  isLoggedIn() : boolean {
    return localStorage.getItem('token') != null;
  }

  logout() {
    localStorage.removeItem('token');
  }  
}
