import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnchorService } from './services/anchor.service';
import { NavigationEnd, Router, NavigationStart } from '@angular/router';
import { environment } from 'src/environments/environment';


declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'website-angular';

  constructor(private translateService: TranslateService, private anchorService: AnchorService, private router: Router) {
    translateService.setDefaultLang("en");
    if (localStorage.getItem("lang")) translateService.use(localStorage.getItem("lang"));
    else if (navigator.language.startsWith("de")) translateService.use("de");

    this.router.events.subscribe(event => {
      if (!environment.production && event instanceof NavigationStart) console.log(event);
      if (event instanceof NavigationEnd) {
        gtag('config', 'UA-162304129-1', { 'page_path': event.urlAfterRedirects });
      }
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.anchorService.interceptClick(event);
  }
}
