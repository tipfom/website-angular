import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private httpClient: HttpClient) { }

  login(email: string, password: string) {
    console.info("checking login");
    return this.httpClient.post<{ access_token: string }>('http://localhost:5764', { email, password }).pipe(tap(res => {
      console.info("ff login");
      localStorage.setItem('access_token', res.access_token);
    })).subscribe(()=>{
      console.info("subscrib");
    });
  }

  logout() {
    localStorage.removeItem('access_token');
  }  
}
