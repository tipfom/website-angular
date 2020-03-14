import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-language-popup',
  templateUrl: './language-popup.component.html',
  styleUrls: ['./language-popup.component.sass']
})
export class LanguagePopupComponent implements OnInit {

  isVisible: boolean = false;

  constructor(private translateService: TranslateService) { }

  ngOnInit(): void {
  }

  selectLanguage(lang: string) {
    this.translateService.setDefaultLang(lang);
    this.close();
  }

  close() {
    this.isVisible = false;
  }

  catchClick(event){
    event.stopPropagation();
  }

  show() {
    this.isVisible = true;
  }
}
