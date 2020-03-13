import { Component, OnInit, Version } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  title: string;
  content: string;
  previousVersionHref: string;
  newestVersionHref: string;
  lastChanged: string;
  isOldVersion: boolean;

  constructor(private route: ActivatedRoute, private apiService: ApiService) {
    const name = this.route.snapshot.paramMap.get('name');
    this.newestVersionHref = "article/" + name;

    this.route.queryParams.subscribe(params => {
      let versions_observer = this.apiService.getArticleVersions(name);
      versions_observer.subscribe(versions => {
        let version = +this.route.snapshot.paramMap.get('version');
        if (this.route.snapshot.paramMap.get('version') == undefined) version = versions.length - 1;

        if (versions[version] != undefined) {
          this.apiService.getArticleContent(versions[version].file).subscribe(r => this.content = r);
          this.title = versions[version].title;
          this.lastChanged = versions[version].creation_time;
          this.isOldVersion = version != versions.length - 1;
          if (versions[version - 1] != undefined) {
            this.previousVersionHref = "article/" + name + "/" + (version - 1);
          }
        } else {
          console.info("404");
        }
      });
    });
  }

  ngOnInit(): void {
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
