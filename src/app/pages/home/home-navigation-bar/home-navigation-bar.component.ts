import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home-navigation-bar',
  templateUrl: './home-navigation-bar.component.html',
  styleUrls: ['./home-navigation-bar.component.sass']
})
export class HomeNavigationBarComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  hrefClick(loc: string): void {
    location.href = "#" + loc;
  }

  gotoPaypal(): void {
    window.open("https://paypal.me/timpokart", "_blank");
  }
}
