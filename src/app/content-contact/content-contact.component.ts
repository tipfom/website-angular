import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-content-contact',
  templateUrl: './content-contact.component.html',
  styleUrls: ['./content-contact.component.sass']
})
export class ContentContactComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

  gotoMedia(link: string): void {
    window.open(link, "_blank");
  }
}
