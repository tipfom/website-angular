import { Component, OnInit } from '@angular/core';
import { ArticleEntry } from '../../../structures/article-entry';

@Component({
  selector: 'app-content-spotlight',
  templateUrl: './content-spotlight.component.html',
  styleUrls: ['./content-spotlight.component.sass']
})
export class ContentSpotlightComponent implements OnInit {

  spotlightArticles = [
    {
      name: "beispiel-artikel",
      title: "Beispiel Artikel",
      subtitle: "Hier werden alle möglichen Formattierungen eines Artikels aufgezeigt"
    },
    {
      name: "about-this-site",
      title: "Über diese Website",
      subtitle: "Eine Beschreibung des Aufbaus der Website"
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
