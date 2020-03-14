import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass']
})
export class AppComponent {
  title = 'website-angular';

  constructor(private translateService: TranslateService) {
    if (localStorage.getItem("lang")) translateService.setDefaultLang(localStorage.getItem("lang"));
    else if (navigator.language.startsWith("de")) translateService.setDefaultLang("de");
    else translateService.setDefaultLang("en");
  }
}
