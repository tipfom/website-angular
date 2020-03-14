import { Component, OnInit, ViewChild } from '@angular/core';
import { MilestoneEntry } from 'src/app/structures/milestone-entry'
import { Observable } from 'rxjs';
import { TranslateService, LangChangeEvent } from '@ngx-translate/core';

declare function weatherwidget_io_invoke(): any;


@Component({
  selector: 'app-content-aboutme',
  templateUrl: './content-aboutme.component.html',
  styleUrls: ['./content-aboutme.component.sass']
})
export class ContentAboutmeComponent implements OnInit {
  index = 0;

  additionalMilestones: MilestoneEntry[] = [
    { name: 'Wissenschaftliche Hilfskraft am Fraunhofer IWS', timespan: 'März - August 2019' },
    { name: 'Teil der deutschen Mannschaft zur Internationalen Physikolympiade 2018', timespan: '21. - 29. Juli 2018' },
    { name: 'Abitur am Max-Steenbeck-Gymnasium', timespan: '22.06.2018' },
    { name: 'Landessieger bei der Brandenburger Physikolympiade', timespan: '2014, 2015, 2016, 2018' },
  ];
  headerHeight: string;

  constructor(public translateService: TranslateService) {
    setInterval(() => {
      if (document.hasFocus()) {
        this.index++;
        if (this.index == this.additionalMilestones.length) this.index = 0;
        this.scrollToIndex();
      }
    }, 10000);
  }

  ngOnInit(): void {
    this.translateService.onLangChange.subscribe((e: LangChangeEvent) => this.updateWeatherWidget());
    this.updateWeatherWidget();
  }

  updateWeatherWidget(){
      let lang = this.translateService.currentLang;
      if (lang == undefined) lang = this.translateService.defaultLang;
      (<HTMLLinkElement>document.getElementsByClassName("weatherwidget-io")[0]).href = "https://forecast7.com/" + lang + "/51d0513d74/dresden/";
      weatherwidget_io_invoke();
  }

  scrollToIndex(): void {
    let x = document.getElementById("shuffleeventsdiv");
    let start_scroll = x.scrollLeft;
    let target_scroll = (<HTMLDivElement>x.getElementsByClassName("shuffleentrydiv")[this.index]).offsetLeft - x.offsetLeft;
    let animation_time = 1000;
    let animation_speed = 5;
    let progress = 0;
    let timer = setInterval(() => {
      progress += animation_speed / animation_time;
      if (progress < 1) {
        let scroll = start_scroll + this.scrollProgress(progress) * (target_scroll - start_scroll);
        x.scrollTo(scroll, 0);
      } else {
        x.scrollTo(target_scroll, 0);
        clearInterval(timer);
      }
    }, animation_speed);
  }

  scrollProgress(progress: number): number {
    return 0.5 * (1 - Math.cos(progress * Math.PI));
  }
}
