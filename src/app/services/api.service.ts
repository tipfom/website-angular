import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  constructor(private httpClient: HttpClient) { }

  login(password: string) {
    return this.httpClient.post<LoginToken>('http://localhost:5764/login', { password })
      .pipe(tap(res => {
        localStorage.setItem("token", res.token);
      }));
  }

  isLoggedIn(): boolean {
    return localStorage.getItem('token') != null;
  }

  logout() {
    localStorage.removeItem('token');
  }

  postResource(type: string, files: string[]) {
    return this.httpClient.post('http://localhost:5764/resource', { token: localStorage.getItem("token"), type, files }, { responseType: "text" });
  }

  getResource(id: string){
    return this.httpClient.get('http://localhost:5764/resource/' + id, { responseType: "text" });
  }

  uploadFile(file: File) {
    console.info(file);
    return this.httpClient.post('http://localhost:5764/upload/', file);
  }
}
