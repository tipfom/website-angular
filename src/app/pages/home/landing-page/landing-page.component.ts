import { Component, OnInit, ViewChild } from '@angular/core';
import { LanguagePopupComponent } from 'src/app/popups/language-popup/language-popup.component';

@Component({
  selector: 'app-landing-page',
  templateUrl: './landing-page.component.html',
  styleUrls: ['./landing-page.component.sass']
})
export class LandingPageComponent implements OnInit {

  @ViewChild(LanguagePopupComponent) languagePopup;

  constructor() { }

  ngOnInit(): void {
  }

  showLanguagePopup(){
    this.languagePopup.show();
  }
}
