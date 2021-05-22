import { Component, OnInit, Version } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ArticleEntry } from 'src/app/structures/article-entry';
import { AnchorService } from 'src/app/services/anchor.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  article: ArticleEntry;
  languageAvailable: boolean = true;
  articleContentUrl: string;
  title: string;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService,
    public translateService: TranslateService, private anchorService: AnchorService) {
    const name = this.route.snapshot.paramMap.get('name');
  
    this.apiService.getAllArticles().subscribe(r => {
      this.article = r[name];

      if (this.article == undefined) this.router.navigate(['404']);

      this.loadArticle(this.translateService.currentLang);
    }, (error) => this.router.navigate(['404']));

    this.translateService.onLangChange.subscribe((e: LangChangeEvent) => this.loadArticle(e.lang));
  }

  loadArticle(lang) : void {
    if (this.article == null) return;

    this.languageAvailable = true;
    if (this.article.translations[lang] == undefined || this.article.translations[lang].file == undefined) {
      this.languageAvailable = false;
      Object.keys(this.article.translations).forEach(k => {
        if (this.article.translations[k].file != undefined) {
          lang = k;
        }
      });
    }
    
    this.title = this.article.translations[lang].title;
    this.articleContentUrl = this.apiService.getArticleContentUrl(this.article.translations[lang].file);
  }

  ngOnInit(): void {
  }
 
  onMarkdownLoad() {
    this.anchorService.scrollToAnchor();
  }
}
