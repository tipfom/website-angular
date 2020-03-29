import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';
import { Observable } from 'rxjs';
import { ResourceEntry } from '../structures/resource-entry';
import { ArticleEntry } from '../structures/article-entry';
import { isDevMode } from '@angular/core';
import { environment } from 'src/environments/environment';
import { ArticleFile } from '../structures/article-file';
import { CoronaData } from '../structures/corona-structures';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private useProductionApiServerInDebug = true;
  private serverAddress = (environment.production || this.useProductionApiServerInDebug) ? "https://api.timpokart.de/" : "http://localhost:5764/";

  constructor(private httpClient: HttpClient) {
  }

  login(password: string) {
    return this.httpClient.post<LoginToken>(this.serverAddress + 'login', { password })
      .pipe(tap(res => {
        localStorage.setItem("token", res.token);
      }));
  }

  isLoggedIn() {
    let token = localStorage.getItem('token');
    if (token == null) return new Observable<boolean>(observer => observer.next(false));

    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.get(this.serverAddress + 'authorized', { headers: headers, responseType: "text" }).pipe(
      map<string, boolean>(s => s == "True")
    );
  }

  logout() {
    localStorage.removeItem('token');
  }

  postResource(type: string, files: string[]) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.serverAddress + 'resource', { type, files }, { headers: headers, responseType: "text" });
  }

  getResources(id: string) {
    return this.httpClient.get<ResourceEntry[]>(this.serverAddress + 'resource/' + id, { responseType: "json" });
  }

  getImage(id: string) {
    return this.httpClient.get(this.serverAddress + 'file/' + id, { observe: "response", responseType: "blob" });
  }

  getDownloadLink(id: string) {
    return this.serverAddress + 'file/' + id;
  }

  uploadFile(file: File, wishname: string) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.serverAddress + 'upload/?n=' + wishname + '&e=' + file.name.split(".").pop() + '&t=' + file.type, file,
      { headers: headers, responseType: "text", reportProgress: true, observe: "events" });
  }

  getAllArticles() {
    return this.httpClient.get<ArticleEntry[]>(this.serverAddress + 'articles/all', { responseType: "json" });
  }

  getSpotlightArticles() {
    return this.httpClient.get<ArticleEntry[]>(this.serverAddress + 'articles/spotlight', { responseType: "json" });
  }

  getArticle(name: string) {
    return this.httpClient.get<ArticleEntry>(this.serverAddress + 'articles/detail/' + name, { responseType: "json" });
  }

  getArticleContentUrl(file: string) {
    return this.serverAddress + 'articles/content/' + file;
  }

  getArticleContent(file: string) {
    return this.httpClient.get(this.getArticleContentUrl(file), { responseType: "text" });
  }

  uploadNewArticle(name: string, title_de: string, description_de: string, title_en: string, description_en: string, lang: string, file: File) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.serverAddress + 'article/?name=' + name + "&title_de=" + title_de + "&description_de=" + description_de + "&title_en=" + title_en + "&description_en=" + description_en + "&lang=" + lang, file,
      { headers: headers, responseType: "text" });
  }

  uploadArticle(name: string, lang: string, file: File) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.serverAddress + 'article/?name=' + name + "&lang=" + lang, file,
      { headers: headers, responseType: "text" });
  }

  attachArticleVersion(name: string, lang: string, version_id: string, file: File) {
    let headers = new HttpHeaders();
    headers = headers.append("LOGIN-TOKEN", localStorage.getItem('token'));
    return this.httpClient.post(this.serverAddress + 'article/?name=' + name + "&lang=" + lang + "&version_id=" + version_id, file,
      { headers: headers, responseType: "text" });
  }

  getCoronaData(id: string): Observable<CoronaData> {
    return this.httpClient.get<CoronaData>(this.serverAddress + 'corona/' + id);
  }

  getCoronaTopCountries(): Observable<Map<string, number>[]> {
    return this.httpClient.get<Map<string, number>[]>(this.serverAddress + 'coronatop');
  }

  getCoronaDataFromWorldometers(region: string) {
    let headers = new HttpHeaders();
    headers.set("Access-Control-Allow-Origin", "*");
    return this.httpClient.get("https://www.worldometers.info/coronavirus/country/" + region.toLowerCase() + "/", { headers: headers });
  }
}
