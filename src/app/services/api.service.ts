import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';
import { Observable } from 'rxjs';
import { ResourceEntry } from '../structures/resource-entry';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private server_address = "http://localhost:5764/";

  constructor(private httpClient: HttpClient) { }

  login(password: string) {
    return this.httpClient.post<LoginToken>(this.server_address + 'login', { password })
      .pipe(tap(res => {
        localStorage.setItem("token", res.token);
      }));
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token == null) return new Observable<boolean>(observer => observer.next(false));

    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.get(this.server_address + 'authorized', { headers: headers, responseType: "text" }).pipe(
      map<string, boolean>(s => s == "True")
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  postResource(type: string, files: string[]) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.server_address + 'resource', { type, files }, { headers: headers, responseType: "text" });
  }

  getResources(id: string) {
    return this.httpClient.get<ResourceEntry[]>(this.server_address + 'resource/' + id, { responseType: "json" });
  }

  getImage(id: string) {
    return this.httpClient.get(this.server_address + 'file/' + id, { observe: "response", responseType: "blob" });
  }

  getDownloadLink(id: string) {
    return this.server_address + 'file/' + id;
  }

  uploadFile(file: File, wishname: string) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.server_address + 'upload/?n=' + wishname + '&e=' + file.name.split(".").pop() + '&t=' + file.type, file, { headers: headers, responseType: "text" });
  }
}
