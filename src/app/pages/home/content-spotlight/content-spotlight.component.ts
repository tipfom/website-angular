import { Component, OnInit } from '@angular/core';
import { ArticleEntry } from '../../../structures/article-entry';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-content-spotlight',
  templateUrl: './content-spotlight.component.html',
  styleUrls: ['./content-spotlight.component.sass']
})
export class ContentSpotlightComponent implements OnInit {

  spotlightArticles : Observable<Map<string, ArticleEntry>>;

  constructor(private apiService: ApiService, public translateService: TranslateService) { 
    this.spotlightArticles = this.apiService.getAllArticles();
    // this.spotlightArticles = apiService.getSpotlightArticles();
  }

  ngOnInit(): void {
  }

}
