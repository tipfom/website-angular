import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';
import { Observable } from 'rxjs';

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

  getResource(id: string) {
    return this.httpClient.get('http://localhost:5764/resource/' + id, { responseType: "text" });
  }

  getImage(id: string) {
    return this.httpClient.get('http://localhost:5764/file/' + id, { observe: "response", responseType: "blob" });
  }

  downloadFile(id: string){
    location.href = 'http://localhost:5764/file/' + id;
  }

  uploadFile(file: File, wishname: string) {
    return this.httpClient.post('http://localhost:5764/upload/?n=' + wishname + '&e=' + file.name.split(".").pop() + '&t=' + file.type, file, { responseType: "text" });
  }
}
