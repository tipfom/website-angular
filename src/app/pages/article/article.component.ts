import { Component, OnInit, Version } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';
import { ArticleFile } from 'src/app/structures/article-file';
import { ArticleEntry } from 'src/app/structures/article-entry';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  content: string;
  previousVersionHref: string;
  newestVersionHref: string;
  isOldVersion: boolean;
  article: ArticleEntry;
  articleVersion: number;
  languageAvailable: boolean = true;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: ApiService, public translateService: TranslateService) {
    const name = this.route.snapshot.paramMap.get('name');
    this.newestVersionHref = "article/" + name;

    this.apiService.getArticle(name).subscribe(r => {
      this.article = r;

      let lang = this.translateService.currentLang;
      if (lang == undefined) lang = this.translateService.defaultLang;

      if (this.route.snapshot.paramMap.get('version') == undefined) this.articleVersion = this.article.files.length - 1;
      else this.articleVersion = +this.route.snapshot.paramMap.get('version');

      this.isOldVersion = this.articleVersion != this.article.files.length - 1;

      this.loadArticle(lang);
    }, (error) => this.router.navigate(['404']));

    this.translateService.onLangChange.subscribe((e: LangChangeEvent) => this.loadArticle(e.lang));
  }

  ngOnInit(): void {
  }

  loadArticle(lang: string) {
    if (this.article.files != undefined) {
      let file = this.article.files[this.articleVersion].find(x => x.lang == lang);
      if (file == undefined) {
        file = this.article.files[this.articleVersion][0];
        this.languageAvailable = false;
      }

      this.apiService.getArticleContent(file.path).subscribe(r => this.content = r);
      if (this.article.files[this.articleVersion - 1] != undefined) {
        this.previousVersionHref = "article/" + name + "/" + (this.articleVersion - 1);
      }
    } else {
      this.router.navigate(['404']);
    }
  }

  onMarkdownLoad() {
    var childs = document.getElementById("markdowndiv").children;
    for (var i = 0; i < childs.length; i++) {
      childs[i].childNodes.forEach(child => {
        if (child.nodeName == "IMG")
          childs[i].className += "centerp"
      })
    }
  }
}
