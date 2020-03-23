import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoronaFit, CoronaData } from 'src/app/structures/corona-structures';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';

@Component({
  selector: 'app-corona',
  templateUrl: './corona.component.html',
  styleUrls: ['./corona.component.sass']
})
export class CoronaComponent implements OnInit {

  dataStartDate: Date = new Date(2020, 0, 22);
  dataEndDate: Date;
  axisStartDate: Date = new Date(this.dataStartDate);
  axisEndDate: Date = new Date(2020, 2, 25);

  data: Map<string, CoronaData> = new Map<string, CoronaData>();
  selectedRegion: string = "global";

  selectedDateIndex = {
    globalOverview: 0,
    globalStatus: 0,
    globalStats: 0,

    localOverview: 0,
    localBreakdown: 0,
    localGrowth: 0
  }

  public globalGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: 'FAFAFAFF',
      paper_bgcolor: 'FAFAFAFF',
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
        gridcolor: '#777777',
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0],
        gridcolor: '#777777',
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
      editable: false,
      staticPlot: this.deviceService.isMobile()
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
      editable: false,
      staticPlot: this.deviceService.isMobile()
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
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        gridcolor: '#777777',
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0],
        gridcolor: '#777777',
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
      editable: false,
      staticPlot: this.deviceService.isMobile()
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
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        gridcolor: '#777777',
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        gridcolor: '#777777',
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
      editable: false,
      staticPlot: this.deviceService.isMobile()
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
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisEndDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        gridcolor: '#777777',
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        gridcolor: '#777777',
      },
      yaxis2: {
        range: [0, 1],
        overlaying: 'y',
        autorange: false,
        side: 'right',
        gridcolor: '#00000000'
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
      editable: false,
      staticPlot: this.deviceService.isMobile()
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
    growth: {
      rel: "#945ECF",
      tot: "#13A4B4"
    }
  }

  constructor(private apiService: ApiService, private translateService: TranslateService, private deviceService: DeviceDetectorService) {
    this.translateService.onLangChange.subscribe(() => this.updateAll());
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
      let dateSliders = document.getElementsByClassName("date-slider");
      for (let i = 0; i < dateSliders.length; i++) {
        let slider = <HTMLInputElement>dateSliders[i];
        slider.max = (c.confirmed.length - 1).toString();
        slider.value = slider.max;
      }
      this.dataEndDate = new Date(this.dataStartDate);
      this.dataEndDate.setDate(this.dataEndDate.getDate() + c.confirmed.length - 1);

      this.selectedDateIndex.globalOverview = c.confirmed.length - 1;
      this.selectedDateIndex.globalStatus = c.confirmed.length - 1;
      this.selectedDateIndex.globalStats = c.confirmed.length - 1;
      this.selectedDateIndex.localOverview = c.confirmed.length - 1;
      this.selectedDateIndex.localBreakdown = c.confirmed.length - 1;
      this.selectedDateIndex.localGrowth = c.confirmed.length - 1;

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
    this.updateGlobalOverview();
    this.updateGlobalStats();
    this.updateGlobalStatus();
    this.updateLocalBreakdown();
    this.updateLocalGrowth();
    this.updateLocalOverview();
  }

  updateGlobalOverview() {
    this.globalGraph.data = [];
    this.buildFitTraces(this.data.get("China").fits.sig[this.selectedDateIndex.globalOverview - 15], "sig", "china", "5899DA8C", "5899DA46").forEach(x => this.globalGraph.data.push(x));
    this.buildFitTraces(this.data.get("row").fits.exp[this.selectedDateIndex.globalOverview - 15], "exp", "row", "E8743B8C", "E8743B46").forEach(x => this.globalGraph.data.push(x));
    this.globalGraph.data.push(this.buildTrace(this.data.get("China").confirmed, this.selectedDateIndex.globalOverview, "china", this.translateService.instant("pages.corona.legend.china"), "#1866b4"));
    this.globalGraph.data.push(this.buildTrace(this.data.get("row").confirmed, this.selectedDateIndex.globalOverview, "row", this.translateService.instant("pages.corona.legend.row"), "#cc4300"));
    this.globalGraph.layout.yaxis.range = [0,
      Math.max(
        this.data.get("China").confirmed[this.selectedDateIndex.globalOverview],
        this.data.get("row").confirmed[this.selectedDateIndex.globalOverview]
      ) * 1.1];
    this.globalGraph.layout.xaxis.range[1] = (this.selectedDateIndex.globalOverview + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime();
  }

  updateGlobalStatus() {
    let globalData = this.data.get("global");
    this.globalDeadInfectedHealedGraph.data = [];
    this.globalDeadInfectedHealedGraph.data.push(
      this.buildDeadInfectedHealedPieChart(globalData.confirmed, globalData.dead, globalData.recovered, this.selectedDateIndex.globalStatus, [this.colors.infected, this.colors.dead, this.colors.recovered])
    );
  }

  updateGlobalStats() {
    let getValueDelta = (current: number, previous: number) => {
      let delta = (current - previous);
      return { value: current, delta: delta > 0 ? "+" + delta : delta.toString() };
    }
    let globalData = this.data.get("global");
    let date = this.selectedDateIndex.globalStats;
    this.global.confirmed = getValueDelta(globalData.confirmed[date], globalData.confirmed[date - 1]);
    this.global.dead = getValueDelta(globalData.dead[date], globalData.dead[date - 1]);
    this.global.recovered = getValueDelta(globalData.recovered[date], globalData.recovered[date - 1]);
    this.global.infected = getValueDelta(
      globalData.confirmed[date] - globalData.dead[date] - globalData.recovered[date],
      globalData.confirmed[date - 1] - globalData.dead[date - 1] - globalData.recovered[date - 1]);
    this.global.fatalityrate = globalData.dead[date] / (globalData.confirmed[date]) * 100;
    this.global.topcountries = [];
    for (var key in this.topcountries[date]) {
      this.global.topcountries.push({ name: key, infected: this.topcountries[date][key] });
    }
    this.global.topcountries.sort((a, b) => b.infected - a.infected);
  }

  updateLocalOverview() {
    let regionData = this.data.get(this.selectedRegion);
    this.localOverviewGraph.data = [];
    this.localOverviewGraph.data.push(this.buildTrace(regionData.confirmed, this.selectedDateIndex.localOverview, "none", this.translateService.instant("pages.corona.legend.total"), "#333333"));
    if (regionData.fits != undefined) {
      this.buildFitTraces(regionData.fits.exp[this.selectedDateIndex.localOverview - 15], "exp", "exp_fit", "#a4650a8C", "#a4650a46").forEach(x => this.localOverviewGraph.data.push(x));
      this.buildFitTraces(regionData.fits.sig[this.selectedDateIndex.localOverview - 15], "sig", "sig_fit", "#2a6d3c8C", "#2a6d3c46").forEach(x => this.localOverviewGraph.data.push(x));
    }
    this.localOverviewGraph.layout.yaxis.range = [0, regionData.confirmed[this.selectedDateIndex.localOverview] * 1.2];
    this.localOverviewGraph.layout.xaxis.range[1] = (this.selectedDateIndex.localOverview + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime();
  }

  updateLocalBreakdown() {
    let regionData = this.data.get(this.selectedRegion);
    this.localDeadInfectedHealedGraph.data = [];
    this.localDeadInfectedHealedGraph.data.push(this.buildTrace(regionData.dead, this.selectedDateIndex.localBreakdown, null, this.translateService.instant("pages.corona.legend.dead"), this.colors.dead, true));
    this.localDeadInfectedHealedGraph.data.push(this.buildTrace(regionData.recovered, this.selectedDateIndex.localBreakdown, null, this.translateService.instant("pages.corona.legend.recovered"), this.colors.recovered, true));
    this.localDeadInfectedHealedGraph.data.push(this.buildTrace(
      this.substract(this.substract(regionData.confirmed, regionData.recovered), regionData.dead),
      this.selectedDateIndex.localBreakdown, null, this.translateService.instant("pages.corona.legend.infected"), this.colors.infected, true)
    );
    this.localDeadInfectedHealedGraph.layout.xaxis.range[1] = (this.selectedDateIndex.localBreakdown + 0.5) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime();
  }

  updateLocalGrowth() {
    let regionData = this.data.get(this.selectedRegion);
    this.localGrowthGraph.data = [];
    this.buildGrowthTraces(regionData.confirmed, this.selectedDateIndex.localGrowth, this.colors.growth.rel, this.colors.growth.tot).forEach(x => this.localGrowthGraph.data.push(x));
    this.localGrowthGraph.layout.xaxis.range[1] = (this.selectedDateIndex.localGrowth + 0.5) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime();
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
      name: this.translateService.instant("pages.corona.legend.tot-growth"),
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
      name: this.translateService.instant("pages.corona.legend.rel-growth"),
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
      labels: [
        this.translateService.instant('pages.corona.legend.infected'),
        this.translateService.instant('pages.corona.legend.dead'),
        this.translateService.instant('pages.corona.legend.recovered')],
      type: 'pie',
      sort: false,
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

  buildFitTraces(fit: CoronaFit, type: string, group: string, color: string, fill: string, sampleCount: number = 300.0) {
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
      name: this.translateService.instant(type == "sig" ? 'pages.corona.legend.sig-fit' : 'pages.corona.legend.exp-fit'),
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
      name: this.translateService.instant('pages.corona.legend.error'),
      fillcolor: fill,
      opacity: 0.7,
      legendgroup: group
    }

    return [errorBandLower, errorBandUpper, trace];
  }

  selectedRegionChanged(): void {
    this.selectedRegion = (<HTMLSelectElement>document.getElementById("region-select")).value;
    let update = () => {
      this.updateLocalOverview();
      this.updateLocalBreakdown();
      this.updateLocalGrowth();
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

  onDateSliderChange(name: string): void {
    let slider = <HTMLInputElement>document.getElementById("date-slider-" + name);
    let index = Number(slider.value);
    switch (name) {
      case "globaloverview":
        this.selectedDateIndex.globalOverview = index;
        this.updateGlobalOverview();
        break;
      case "globalstatus":
        this.selectedDateIndex.globalStatus = index;
        this.updateGlobalStatus();
        break;
      case "globalstats":
        this.selectedDateIndex.globalStats = index;
        this.updateGlobalStats();
        break;
      case "localoverview":
        this.selectedDateIndex.localOverview = index;
        this.updateLocalOverview();
        break;
      case "localbreakdown":
        this.selectedDateIndex.localBreakdown = index;
        this.updateLocalBreakdown();
        break;
      case "localgrowth":
        this.selectedDateIndex.localGrowth = index;
        this.updateLocalGrowth();
        break;
    }
  }

  activeAnimations: Map<string, any> = new Map<string, any>();
  animateSlider(name: string, event: MouseEvent): void {
    let button = <HTMLButtonElement>event.target;
    let slider = <HTMLInputElement>document.getElementById("date-slider-" + name);

    if (button.classList.contains("play")) {
      button.classList.remove("play");
      button.classList.add("pause");

      if (slider.value == slider.max) slider.value = slider.min;
      let updateInterval = setInterval(() => {
        slider.value = (Number(slider.value) + 1).toString();
        slider.dispatchEvent(new Event('input'));
        
        if (Number(slider.value) == Number(slider.max)) {
          clearInterval(updateInterval);
          button.classList.remove("pause");
          button.classList.add("play");              
        }
      }, 200);

      this.activeAnimations.set(name, updateInterval);
    } else {
      button.classList.remove("pause");
      button.classList.add("play");

      clearInterval(this.activeAnimations.get(name));
      this.activeAnimations.delete(name);
    }
  }
}
