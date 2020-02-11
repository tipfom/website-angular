import { Component, OnInit } from '@angular/core';

declare function weatherwidget_io_invoke(): any;

@Component({
  selector: 'app-content-weather',
  templateUrl: './content-weather.component.html',
  styleUrls: ['./content-weather.component.sass']
})
export class ContentWeatherComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    weatherwidget_io_invoke();
  }
}
