import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
  styleUrls: ['./article.component.sass']
})
export class ArticleComponent implements OnInit {

  content: string = `./assets/articles/202020.md`;

  constructor() { }

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
