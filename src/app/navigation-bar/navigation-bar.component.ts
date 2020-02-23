import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.sass']
})
export class NavigationBarComponent implements OnInit {

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
