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
    if (navigator.language.startsWith("de")) translateService.setDefaultLang("de");
    else translateService.setDefaultLang("en");
  }
}
