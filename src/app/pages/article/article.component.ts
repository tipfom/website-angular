import { Component, OnInit, Version } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  articlehref: string;

  constructor(private route: ActivatedRoute, private apiService: ApiService) { }

  ngOnInit(): void {
    const name = this.route.snapshot.paramMap.get('name');
    this.route.queryParams.subscribe(params => {
      let versions_observer = this.apiService.getArticleVersions(name);
      versions_observer.subscribe(versions => {
        let version = +params["version"];
        if (params["version"] == undefined) version = versions.length-1;
  
        if (versions[version] != undefined) {
          this.articlehref = this.apiService.getArticleContentUrl(versions[version].file);
        } else {
          console.info("404");
        }
      });
    });
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
