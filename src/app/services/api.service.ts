import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse, HttpHeaders } from '@angular/common/http';
import { tap, map } from 'rxjs/operators';
import { LoginToken } from '../structures/login-token';
import { Observable } from 'rxjs';
import { ResourceEntry } from '../structures/resource-entry';
import { ArticleEntry } from '../structures/article-entry';
import { environment } from 'src/environments/environment';
import { CoronaOverviewData, CoronaFits } from '../structures/corona-structures';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private useProductionApiServerInDebug = true;
  private apiServerAddress = (environment.production || this.useProductionApiServerInDebug) ? "https://api.timpokart.de/" : "http://localhost:5764/";
  private coronadataServerAddress = (environment.production || this.useProductionApiServerInDebug) ? "https://coronadata.timpokart.de/" : "http://localhost:5764/";

  constructor(private httpClient: HttpClient) {
  }

  getAllArticles() {
    return this.httpClient.get<Map<string, ArticleEntry>>(this.apiServerAddress + 'articles', { responseType: "json" });
  }

  getArticleContentUrl(file: string) {
    return this.apiServerAddress + 'article_file/' + file;
  }

  getCoronaOverviewData(): Observable<Map<string, CoronaOverviewData>> {
    return this.httpClient.get<any>(this.coronadataServerAddress).pipe(map(r => {
      let res = new Map<string, CoronaOverviewData>();
      Object.entries(r).forEach(e => {
        res.set(e[0], new CoronaOverviewData(e[1]));
      });
      return res;
    }));
  }

  getCoronaFits(id: string): Observable<CoronaFits> {
    return this.httpClient.get<CoronaFits>(this.coronadataServerAddress + id).pipe(map(raw => {
      return new CoronaFits(raw);
    }));
  }

  sendMail(mail: string, name: string, content: string) {
    return this.httpClient.post(this.apiServerAddress + 'contactform?name=' + name + "&mail=" + mail, content, { responseType: "text" });
  }
}
