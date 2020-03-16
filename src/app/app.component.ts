import { Component, HostListener } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AnchorService } from './services/anchor.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'website-angular';

  constructor(private translateService: TranslateService, private anchorService: AnchorService) {
    if (localStorage.getItem("lang")) translateService.setDefaultLang(localStorage.getItem("lang"));
    else if (navigator.language.startsWith("de")) translateService.setDefaultLang("de");
    else translateService.setDefaultLang("en");
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event) {
    this.anchorService.interceptClick(event);
  }
}
