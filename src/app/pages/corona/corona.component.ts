import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoronaFit, CoronaData } from 'src/app/structures/corona-structures';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.sass']
})
export class CoronaComponent implements OnInit {

  dataStartDate: Date = new Date(2020, 0, 22);
  dataEndDate: Date = new Date(2020, 2, 20);
  axisStartDate: Date = new Date(this.dataStartDate);
  axisEndDate: Date = new Date(2020, 2, 23);

  data: Map<string, CoronaData> = new Map<string, CoronaData>();
  selectedGlobalDate: Date = new Date(this.dataEndDate);
  selectedLocalDate: Date = new Date(this.dataEndDate);
  selectedRegion: string = "global";

  public globalGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      paper_bgcolor: 'FAFAFA',
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0]
      },
      legend: {
        x: 0.01,
        xanchor: 'left',
        bgcolor: '#e6e2e7',
        bordercolor: '#21999c',
        borderwidth: 1,
        borderradius: 3
      },
      margin: { l: 30, r: 30, t: 0, b: 40 }
    },
    config: {
      responsive: true,
      scrollZoom: false,
      editable: false
    }
  };

  public globalDeadInfectedHealedGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      paper_bgcolor: 'FAFAFA',
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      legend: {
        x: 0.01,
        xanchor: 'left',
        bgcolor: '#e6e2e7',
        bordercolor: '#21999c',
        borderwidth: 1,
        borderradius: 3
      },
      margin: { l: 0, r: 0, t: 0, b: 0 }
    },
    config: {
      responsive: true,
      scrollZoom: false,
      editable: false
    }
  };

  public localOverviewGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      paper_bgcolor: 'FAFAFA',
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 12
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0]
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

  public localDeadInfectedHealedGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      paper_bgcolor: 'FAFAFA',
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 12
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
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

  public localGrowthGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFA',
      paper_bgcolor: 'FAFAFA',
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 12
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true
      },
      yaxis2: {
        range: [0, 1],
        overlaying: 'y',
        autorange: false,
        side: 'right'
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

  topcountries: Map<string, number>[];

  global = {
    confirmed: { value: 0, delta: "0" },
    infected: { value: 0, delta: "0" },
    recovered: { value: 0, delta: "0" },
    dead: { value: 0, delta: "0" },
    fatalityrate: 0,
    topcountries: []
  }

  colors = {
    infected: "#74abe2",
    confirmed: "#cc4300",
    dead: "#596468",
    recovered: "#3fb68e",
  }

  constructor(private apiService: ApiService) {
  }

  ngOnInit(): void {
    this.apiService.getCoronaData("China").subscribe(c => {
      this.data.set("China", c);
      if (this.data.has("row") && this.data.has("global") && this.topcountries != undefined) this.updateAll();
    });
    this.apiService.getCoronaData("row").subscribe(c => {
      this.data.set("row", c);
      if (this.data.has("China") && this.data.has("global") && this.topcountries != undefined) this.updateAll();
    });
    this.apiService.getCoronaData("global").subscribe(c => {
      this.data.set("global", c);
      if (this.data.has("China") && this.data.has("row") && this.topcountries != undefined) this.updateAll();
    });
    this.apiService.getCoronaTopCountries().subscribe(tc => {
      this.topcountries = tc;
      if (this.data.has("China") && this.data.has("row") && this.data.has("global")) this.updateAll();
    });
  }

  substract(a1: number[], a2: number[]) {
    let r = [];
    for (var i = 0; i < a1.length; i++) {
      r.push(a1[i] - a2[i]);
    }
    return r;
  }

  updateAll() {
    this.updateLocalGraphs();
    this.updateGlobalGraph();
  }

  updateGlobalGraph() {
    let dateDiff = (this.selectedGlobalDate.getTime() - this.dataStartDate.getTime()) / (1000 * 60 * 60 * 24);
    this.globalGraph.data = [];
    this.buildFitTraces(this.data.get("China").fits.sig[dateDiff - 15], "sig", "china", "in China", "5899DA8C", "5899DA46").forEach(x => this.globalGraph.data.push(x));
    this.buildFitTraces(this.data.get("row").fits.exp[dateDiff - 15], "exp", "row", "outside China", "E8743B8C", "E8743B46").forEach(x => this.globalGraph.data.push(x));
    this.globalGraph.data.push(this.buildTrace(this.data.get("China").confirmed, dateDiff, "china", "Cases in China", "#1866b4"));
    this.globalGraph.data.push(this.buildTrace(this.data.get("row").confirmed, dateDiff, "row", "Cases outside China", "#cc4300"));
    this.globalGraph.layout.yaxis.range = [0,
      Math.max(
        this.data.get("China").confirmed[dateDiff],
        this.data.get("row").confirmed[dateDiff]
      ) * 1.1];

    let globalData = this.data.get("global");
    this.globalDeadInfectedHealedGraph.data = [];
    this.globalDeadInfectedHealedGraph.data.push(
      this.buildDeadInfectedHealedPieChart(globalData.confirmed, globalData.dead, globalData.recovered, dateDiff, [this.colors.infected, this.colors.dead, this.colors.recovered])
    );

    this.global.confirmed = this.getValueDelta(globalData.confirmed[dateDiff], globalData.confirmed[dateDiff - 1]);
    this.global.dead = this.getValueDelta(globalData.dead[dateDiff], globalData.dead[dateDiff - 1]);
    this.global.recovered = this.getValueDelta(globalData.recovered[dateDiff], globalData.recovered[dateDiff - 1]);
    this.global.infected = this.getValueDelta(
      globalData.confirmed[dateDiff] - globalData.dead[dateDiff] - globalData.recovered[dateDiff],
      globalData.confirmed[dateDiff - 1] - globalData.dead[dateDiff - 1] - globalData.recovered[dateDiff - 1]);
    this.global.fatalityrate = globalData.dead[dateDiff] / (globalData.confirmed[dateDiff]) * 100;
    this.global.topcountries = [];
    for (var key in this.topcountries[dateDiff]) {
      this.global.topcountries.push({ name: key, infected: this.topcountries[dateDiff][key] });
    }
    this.global.topcountries.sort((a, b) => b.infected - a.infected);
  }

  getValueDelta(current: number, previous: number) {
    let delta = (current - previous);
    return { value: current, delta: delta > 0 ? "+" + delta : delta.toString() };
  }

  updateLocalGraphs() {
    let update = () => {
      let dateDiff = (this.selectedLocalDate.getTime() - this.dataStartDate.getTime()) / (1000 * 60 * 60 * 24);
      let regionData = this.data.get(this.selectedRegion);
      this.localOverviewGraph.data = [];
      this.localOverviewGraph.data.push(this.buildTrace(regionData.confirmed, dateDiff, "none", "total infections", "#333333"));
      if (regionData.fits != undefined) {
        this.buildFitTraces(regionData.fits.exp[dateDiff - 15], "exp", "exp_fit", "in China", "#a4650a8C", "#a4650a46").forEach(x => this.localOverviewGraph.data.push(x));
        this.buildFitTraces(regionData.fits.sig[dateDiff - 15], "sig", "sig_fit", "in China", "#2a6d3c8C", "#2a6d3c46").forEach(x => this.localOverviewGraph.data.push(x));
      }
      this.localOverviewGraph.layout.yaxis.range = [0, regionData.confirmed[dateDiff] * 1.2];

      this.localDeadInfectedHealedGraph.data = [];
      this.localDeadInfectedHealedGraph.data.push(this.buildTrace(regionData.dead, dateDiff, null, "Dead", "#000000", true));
      this.localDeadInfectedHealedGraph.data.push(this.buildTrace(regionData.recovered, dateDiff, null, "Recovered", "#3fb68e", true));
      this.localDeadInfectedHealedGraph.data.push(this.buildTrace(
        this.substract(this.substract(regionData.confirmed, regionData.recovered), regionData.dead),
        dateDiff, null, "Infected", "#74abe2", true)
      );

      this.localGrowthGraph.data = [];
      this.buildGrowthTraces(regionData.confirmed, dateDiff, "333333", "999999").forEach(x => this.localGrowthGraph.data.push(x));
    };
    if (this.data.has(this.selectedRegion)) {
      update();
    } else {
      this.apiService.getCoronaData(this.selectedRegion).subscribe(d => {
        this.data.set(this.selectedRegion, d);
        update();
      });
    }
  }

  buildTrace(data: number[], count: number, group: string, name: string, color: string, line: boolean = false) {
    let x = []
    let y: number[] = []
    for (var i = 0; i <= count; i++) {
      let date = new Date(this.dataStartDate);
      date.setDate(date.getDate() + i);
      x.push(date);
      y.push(data[i]);
    }

    let trace = {
      x: x,
      y: y,
      mode: line ? 'lines+markers' : 'markers',
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

  buildGrowthTraces(data: number[], count: number, totalColor: string, relativeColor: string) {
    let x = []
    let yRelative: number[] = []
    let yTotal: number[] = []
    for (var i = 1; i <= count; i++) {
      let date = new Date(this.dataStartDate);
      date.setDate(date.getDate() + i);
      x.push(date);
      yRelative.push((data[i - 1] != 0) ? (data[i] / data[i - 1] - 1) : 0);
      yTotal.push(data[i] - data[i - 1]);
    }

    let totalTrace = {
      x: x,
      y: yTotal,
      type: 'bar',
      name: "total Growth",
      marker: {
        color: totalColor,
      },
    };

    let relativeTrace = {
      x: x,
      y: yRelative,
      mode: 'lines+markers',
      type: 'scatter',
      yaxis: 'y2',
      name: "relative Growth",
      marker: {
        color: relativeColor,
        size: 7,
        symbol: "diamond"
      },
      line: {
        color: relativeColor,
      }
    };

    return [totalTrace, relativeTrace];
  }

  buildDeadInfectedHealedPieChart(confirmed: number[], dead: number[], recovered: number[], date: number, colors: string[]) {
    var piedata = {
      values: [confirmed[date] - dead[date] - recovered[date], dead[date], recovered[date]],
      labels: ['Infected', 'Dead', 'Recovered'],
      type: 'pie',
      marker: {
        colors: colors
      }
    };
    return piedata;
  }

  getRelativeDate(x: Date) {
    return (x.getTime() - this.dataStartDate.getTime()) / (60 * 60 * 24 * 1000);
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
      let date = new Date(this.axisStartDate);
      date.setDate(this.axisStartDate.getDate() + i / sampleCount * this.getRelativeDate(this.axisEndDate));
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
        dash: 'dot',
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

    return [errorBandLower, errorBandUpper, trace];
  }

  selectedRegionChanged(): void {
    this.selectedRegion = (<HTMLSelectElement>document.getElementById("region-select")).value;
    this.updateLocalGraphs();
  }

  onGlobalSliderChange(): void {
    let slider = <HTMLInputElement>document.getElementById("date-slider-global");
    this.selectedGlobalDate = new Date(this.dataStartDate);
    this.selectedGlobalDate.setDate(this.selectedGlobalDate.getDate() + Number(slider.value));
    this.updateGlobalGraph();
  }

  onLocalSliderChange(): void {
    let slider = <HTMLInputElement>document.getElementById("date-slider-local");
    this.selectedLocalDate = new Date(this.dataStartDate);
    this.selectedLocalDate.setDate(this.selectedLocalDate.getDate() + Number(slider.value));
    this.updateLocalGraphs();
  }
}
