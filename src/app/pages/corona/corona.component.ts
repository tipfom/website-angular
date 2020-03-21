import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { sample } from 'rxjs/operators';
import { start } from 'repl';
import { CoronaFit } from 'src/app/structures/corona-structures';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.sass']
})
export class CoronaComponent implements OnInit {

  public startDate: Date = new Date(2020, 0, 22);
  public endDate: Date = new Date(2020, 2, 23);


  public graph = {
    data: [],
    layout: {
      height: 450,
      xaxis: {
        range: [this.startDate.getTime(), this.endDate.getTime()],
      },
      yaxis: {
        autorange: true
      },
      legend: { x: 0.4, y: 1.2 },
      margin: { l: 30, r: 30, t: 0, b: 30 }
    },
    config: {
      responsive: true,
      scrollZoom: false,
      editable: false
    }
  };

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getCoronaData().subscribe(c => {
      this.graph.data.push(this.buildTrace(c.confirmed.by_region[0], "China"));
      this.graph.data.push(this.buildTrace(this.substract(c.confirmed.total, c.confirmed.by_region[0]), "Outside China"));
      this.graph.data.push(this.buildFitTraces(c.fits["china"][c.fits["china"].length - 1], "sig", "China Fits"));
      this.graph.data.push(this.buildFitTraces(c.fits["row"][c.fits["row"].length - 1], "exp", "Row Fits"));
    });
  }

  substract(a1: number[], a2: number[]) {
    let r = [];
    for (var i = 0; i < a1.length; i++) {
      r.push(a1[i] - a2[i]);
    }
    return r;
  }

  buildTrace(data: number[], name: string) {
    let x = []
    let y: number[] = []
    for (var i = 0; i < data.length; i++) {
      let date = new Date(this.startDate);
      date.setDate(date.getDate() + i);
      x.push(date);
      y.push(data[i]);
    }

    let trace = {
      x: x,
      y: y,
      mode: 'markers',
      type: 'scatter',
      name: name
    }

    return trace;
  }

  buildFitTraces(fit: CoronaFit, type: string, name: string, sampleCount: number = 300.0) {
    let x: Date[] = [];
    let y = [];
    let timeConv = (60 * 60 * 24 * 1000);
    for (var i = 0; i < sampleCount; i++) {
      let date = new Date(this.startDate);
      date.setDate(this.startDate.getDate() + i / sampleCount * (this.endDate.getTime() - this.startDate.getTime()) / timeConv);
      x.push(date);
    }

    switch (type) {
      case "exp": {
        let a = fit.param[0];
        let b = fit.param[1];
        for (var i = 0; i < sampleCount; i++) {
          y.push(a * Math.exp(b * (x[i].getTime() - this.startDate.getTime()) / timeConv));
        }
      } break;
      case "sig": {
        let a = fit.param[0];
        let b = fit.param[1];
        let c = fit.param[2];
        for (var i = 0; i < sampleCount; i++) {
          y.push(a / (1 + Math.exp(-b * ((x[i].getTime() - this.startDate.getTime()) / timeConv - c))));
        }
      } break;
    }

    var trace = {
      x: x,
      y: y,
      mode: 'line',
      type: 'scatter',
      name: name
    };

    return trace;
  }

  onSliderEnd(): void {
    console.info("now")
  }
}
