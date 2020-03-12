import { Component, OnInit } from '@angular/core';
import { ArticleEntry } from '../../../structures/article-entry';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-content-spotlight',
  templateUrl: './content-spotlight.component.html',
  styleUrls: ['./content-spotlight.component.sass']
})
export class ContentSpotlightComponent implements OnInit {

  spotlightArticles : Observable<ArticleEntry[]>;

  constructor(private apiService: ApiService) { 
    this.spotlightArticles = apiService.getSpotlightArticles();
  }

  ngOnInit(): void {
  }

}
