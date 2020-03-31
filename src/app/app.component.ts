import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnchorService } from './services/anchor.service';
import { NavigationEnd, Router } from '@angular/router';


declare let gtag: Function;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'website-angular';

  constructor(private translateService: TranslateService, private anchorService: AnchorService, private router: Router) {
    if (localStorage.getItem("lang")) translateService.setDefaultLang(localStorage.getItem("lang"));
    else if (navigator.language.startsWith("de")) translateService.setDefaultLang("de");
    else translateService.setDefaultLang("en");

    this.router.events.subscribe(event => {
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
