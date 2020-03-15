import { Component, OnInit, ViewChild } from '@angular/core';
import { LanguagePopupComponent } from '../popups/language-popup/language-popup.component';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.sass']
})
export class NavigationBarComponent implements OnInit {

  @ViewChild(LanguagePopupComponent) languagePopup;

  constructor() { }

  ngOnInit(): void {
  }

  gotoContact(): void {
    location.href = "#contact";
  }

  showLanguagePopup(){
    this.languagePopup.show();
  }
}
