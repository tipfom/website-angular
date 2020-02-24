import { Component, OnInit } from '@angular/core';

declare function weatherwidget_io_invoke(): any;

@Component({
  selector: 'app-content-aboutme',
  templateUrl: './content-aboutme.component.html',
  styleUrls: ['./content-aboutme.component.sass']
})
export class ContentAboutmeComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    weatherwidget_io_invoke();
  }
}
