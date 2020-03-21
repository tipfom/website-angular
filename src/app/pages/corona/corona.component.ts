import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoronaFit, CoronaData, CoronaDataContainer } from 'src/app/structures/corona-structures';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.sass']
})
export class CoronaComponent implements OnInit {

  startDate: Date = new Date(2020, 0, 22);
  endDate: Date = new Date(2020, 2, 23);
  data: CoronaDataContainer;
  selectedDate: Date = this.endDate;

  public globalGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      font: {
        family: '"Roboto", sans-serif',
        size: 12
      },
      xaxis: {
        range: [this.startDate.getTime(), this.endDate.getTime()],
        tickmode: 'linear',
        tick0: this.startDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true
      },
      legend: {
        x: 0.01,
        xanchor: 'left',
        bgcolor: '#e6e2e7',
        borderradius: 3
      },
      margin: { l: 30, r: 30, t: 0, b: 30 }
    },
    config: {
      responsive: true,
      scrollZoom: false,
      editable: false
    }
  };

  public localGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      font: {
        family: '"Roboto", sans-serif',
        size: 12
      },
      xaxis: {
        range: [this.startDate.getTime(), this.endDate.getTime()],
        tickmode: 'linear',
        tick0: this.startDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true
      },
      legend: {
        x: 0.01,
        xanchor: 'left',
        bgcolor: '#e6e2e7',
        borderradius: 3
      },
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
      this.data = c;
      this.updateGlobalGraph();
    });
  }

  substract(a1: number[], a2: number[]) {
    let r = [];
    for (var i = 0; i < a1.length; i++) {
      r.push(a1[i] - a2[i]);
    }
    return r;
  }

  updateGlobalGraph() {
    let dateDiff = (this.selectedDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24) - 1;
    this.globalGraph.data = [];
    this.buildFitTraces(this.data.fits["china"][dateDiff - 17], "sig", "china", "in China", "5899DA8C", "5899DA46").forEach(x => this.globalGraph.data.push(x));
    this.buildFitTraces(this.data.fits["row"][dateDiff - 17], "exp", "row", "outside China", "E8743B8C", "E8743B46").forEach(x => this.globalGraph.data.push(x));
    this.globalGraph.data.push(this.buildTrace(this.data.confirmed.by_region["china"], dateDiff, "china", "Cases in China", "#1866b4"));
    this.globalGraph.data.push(this.buildTrace(this.substract(this.data.confirmed.total, this.data.confirmed.by_region["china"]), dateDiff, "row", "Cases outside China", "#cc4300"));
  }

  buildTrace(data: number[], count: number, group: string, name: string, color: string) {
    let x = []
    let y: number[] = []
    for (var i = 0; i < count; i++) {
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
      name: name,
      legendgroup: group,
      marker: {
        color: color,
        size: 7,
        symbol: "diamond"
      }
    }

    return trace;
  }

  getRelativeDate(x: Date) {
    return (x.getTime() - this.startDate.getTime()) / (60 * 60 * 24 * 1000);
  }

  getExpErrormargins(a, b, da, db, x: Date[]) {
    let delta = (x: Date) => {
      let rel = this.getRelativeDate(x);
      return Math.sqrt(
        Math.pow(Math.exp(b * rel) * da, 2) +
        Math.pow(a * Math.exp(b * rel) * db, 2)
      );
    }
    let err = [];
    for (var i = 0; i < x.length; i++) {
      err.push(delta(x[i]));
    }
    return err;
  }

  getSigErrormargins(a, b, c, da, db, dc, x: Date[]) {
    let delta = (x: Date) => {
      let rel = this.getRelativeDate(x);
      return Math.sqrt(
        Math.pow(1 / (1 + Math.exp(-b * (rel - c))) * da, 2) +
        Math.pow(-a / Math.pow((1 + Math.exp(-b * (rel - c))), 2) * (c - rel) * Math.exp(-b * (rel - c)) * db, 2) +
        Math.pow(-a / Math.pow((1 + Math.exp(-b * (rel - c))), 2) * b * Math.exp(-b * (rel - c)) * dc, 2)
      );
    }
    let err = [];
    for (var i = 0; i < x.length; i++) {
      err.push(delta(x[i]));
    }
    return err;
  }

  buildFitTraces(fit: CoronaFit, type: string, group: string, name: string, color: string, fill: string, sampleCount: number = 300.0) {
    let x: Date[] = [];
    let y = [];
    let yLower = [], yUpper = [];
    for (var i = 0; i < sampleCount; i++) {
      let date = new Date(this.startDate);
      date.setDate(this.startDate.getDate() + i / sampleCount * this.getRelativeDate(this.endDate));
      x.push(date);
    }

    switch (type) {
      case "exp": {
        let a = fit.param[0], b = fit.param[1];
        let da = 2 * fit.err[0], db = 2 * fit.err[1];
        let err = this.getExpErrormargins(a, b, da, db, x);
        for (var i = 0; i < sampleCount; i++) {
          let cy = a * Math.exp(b * this.getRelativeDate(x[i]));
          y.push(cy);
          yLower.push(cy - err[i]);
          yUpper.push(cy + err[i]);
        }
      } break;
      case "sig": {
        let a = fit.param[0], b = fit.param[1], c = fit.param[2];
        let da = 2 * fit.err[0], db = 2 * fit.err[1], dc = 2 * fit.err[2];
        let err = this.getSigErrormargins(a, b, c, da, db, dc, x);
        for (var i = 0; i < sampleCount; i++) {
          let cy = a / (1 + Math.exp(-b * (this.getRelativeDate(x[i]) - c)));
          y.push(cy);
          yLower.push(cy - err[i]);
          yUpper.push(cy + err[i]);
        }
      } break;
    }

    var trace = {
      x: x,
      y: y,
      mode: 'line',
      type: 'scatter',
      name: type == "sig" ? 'Sigmoidal fit' : 'Exponential fit',
      line: {
        color: color,
        width: 4
      },
      legendgroup: group
    };

    var errorBandLower = {
      x: x,
      y: yLower,
      fill: 'toself',
      type: 'scatter',
      mode: 'none',
      fillcolor: 'transparent',
      showlegend: false,
    };

    var errorBandUpper = {
      x: x,
      y: yUpper,
      fill: 'tonexty',
      type: 'scatter',
      mode: 'none',
      name: 'Error margin',
      fillcolor: fill,
      opacity: 0.7,
      legendgroup: group
    }

    return [trace, errorBandLower, errorBandUpper];
  }

  selectedRegionChanged(): void {
    let region = <HTMLSelectElement>document.getElementById("region-select");
    this.localGraph.data = [];
    this.localGraph.data.push(this.buildTrace(this.data.confirmed.by_region[region.value], this.data.confirmed.by_region[region.value].length, "none", "a", "FA23aE"));
  }

  onSliderChange(): void {
    let slider = <HTMLInputElement>document.getElementById("date-slider");
    this.selectedDate = new Date(this.startDate);
    this.selectedDate.setDate(this.selectedDate.getDate() + Number(slider.value));
    this.updateGlobalGraph();
  }
}
