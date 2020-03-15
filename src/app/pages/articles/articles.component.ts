import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ArticleEntry } from 'src/app/structures/article-entry';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-articles',
  templateUrl: './articles.component.html',
  styleUrls: ['./articles.component.sass']
})
export class ArticlesComponent implements OnInit {
  articles: Observable<ArticleEntry[]>;
  constructor(private apiService: ApiService, public translateService: TranslateService) { 
    this.articles = apiService.getAllArticles();
  }

  ngOnInit(): void {
  }

}
