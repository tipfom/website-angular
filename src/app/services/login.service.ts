import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    console.info("checking login");
    return this.httpClient.post<LoginToken>('http://localhost:5764', { email, password }).pipe(tap(res => {
      localStorage.setItem("token", res.token);
    }));
  }

  logout() {
    localStorage.removeItem('token');
  }  
}
