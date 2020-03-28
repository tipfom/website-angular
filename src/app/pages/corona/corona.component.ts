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
  axisEndDate: Date;

  data: Map<string, CoronaData> = new Map<string, CoronaData>();
  selectedRegion: string = "global";

  selectedDateIndex = {
    linkGlobal: false,
    globalOverview: 0,
    globalStatus: 0,
    globalStats: 0,

    linkLocal: false,
    localStats: 0,
    localOverview: 0,
    localBreakdown: 0,
    localGrowth: 0,
  }

  colors = {
    infected: "#74abe2",
    confirmed: "#cc4300",
    dead: "#596468",
    recovered: "#3fb68e",
    growth: {
      rel: "#945ECF",
      tot: "#13A4B4"
    },
    background: 'FAFAFA',
    grid: '#bbbbbb'
  }

  public globalGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisStartDate.getTime()],
        tickmode: 'linear',
        automargin: true,
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        gridcolor: this.colors.grid,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        automargin: true,
        range: [0, 0],
        gridcolor: this.colors.grid,
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  public globalDeadInfectedHealedGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  public localCompareGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        tickmode: 'linear',
        title: 'Days since cases went over 500',
        tick0: 0,
        dtick: 7,
        automargin: true,
        autorange: false,
        range: [0, 1],
        gridcolor: this.colors.grid,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        type: 'log',
        tick0: 2,
        dtick: 1,
        gridcolor: this.colors.grid,
      },
      legend: {
        x: 0.99,
        xanchor: 'right',
        y: 0.01,
        yanchor: 'bottom',
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  public localOverviewGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisStartDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        automargin: true,
        gridcolor: this.colors.grid,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0],
        automargin: true,
        gridcolor: this.colors.grid,
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  public localDeadInfectedHealedGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisStartDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        automargin: true,
        gridcolor: this.colors.grid,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        gridcolor: this.colors.grid,
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  public localGrowthGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      xaxis: {
        range: [this.axisStartDate.getTime(), this.axisStartDate.getTime()],
        tickmode: 'linear',
        tick0: this.axisStartDate.getTime(),
        dtick: 1000 * 60 * 60 * 24 * 7,
        automargin: true,
        gridcolor: this.colors.grid,
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        gridcolor: this.colors.grid,
      },
      yaxis2: {
        range: [0, 1],
        overlaying: 'y',
        autorange: false,
        automargin: true,
        side: 'right',
        showgrid: false,
        tickformat: ',.0%',
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
      staticPlot: this.deviceService.isMobile(),
      displaylogo: false
    }
  };

  topcountries: Map<string, number>[];

  statistics = {
    global: {
      confirmed: { value: 0, delta: "0" },
      infected: { value: 0, delta: "0" },
      recovered: { value: 0, delta: "0" },
      dead: { value: 0, delta: "0" },
      fatalityrate: 0,
      topcountries: []
    },
    local: {
      confirmed: { value: 0, delta: "0" },
      infected: { value: 0, delta: "0" },
      recovered: { value: 0, delta: "0" },
      dead: { value: 0, delta: "0" },
      fatalityrate: 0,
    }
  }

  constructor(private apiService: ApiService, private translateService: TranslateService, private deviceService: DeviceDetectorService) {
    this.translateService.onLangChange.subscribe(() => {
      this.updateAll();
      this.sortRegionSelect();
    });
  }

  ngOnInit(): void {
    let requiredRegions = ["China", "row", "global", "US", "Italy", "Spain"];
    let loadedRegions = 0;
    requiredRegions.forEach(country => {
      this.apiService.getCoronaData(country).subscribe(data => {
        this.data.set(country, data);
        loadedRegions += 1;
        if (loadedRegions == requiredRegions.length && this.topcountries != undefined) this.onDataLoaded();
      })
    });
    this.apiService.getCoronaTopCountries().subscribe(tc => {
      this.topcountries = tc;
      if (loadedRegions == requiredRegions.length) this.onDataLoaded();
    });
    setTimeout(() => {
      this.sortRegionSelect();
    }, 100);
  }

  sortRegionSelect() {
    document.getElementById("region-select").childNodes.forEach(node => {
      if (node.nodeName == "OPTGROUP") {
        let array: ChildNode[] = [];
        node.childNodes.forEach(child => array.push(child));
        array.forEach(child => node.removeChild(child));
        array.sort((a, b) => {
          return a.textContent.localeCompare(b.textContent);
        });
        array.forEach(child => node.appendChild(child));
      }
    });
  }

  onDataLoaded() {
    let dateLength = this.data.get("global").confirmed.length - 1;

    let dateSliders = document.getElementsByClassName("date-slider");
    for (let i = 0; i < dateSliders.length; i++) {
      let slider = <HTMLInputElement>dateSliders[i];
      slider.max = (dateLength).toString();
      slider.value = slider.max;
    }

    this.dataEndDate = new Date(this.dataStartDate);
    this.dataEndDate.setDate(this.dataEndDate.getDate() + dateLength);
    this.axisEndDate = new Date(this.dataEndDate);
    this.axisEndDate.setDate(this.axisEndDate.getDate() + 3);

    this.selectedDateIndex.globalOverview = dateLength;
    this.selectedDateIndex.globalStatus = dateLength;
    this.selectedDateIndex.globalStats = dateLength;
    this.selectedDateIndex.localOverview = dateLength;
    this.selectedDateIndex.localBreakdown = dateLength;
    this.selectedDateIndex.localGrowth = dateLength;
    this.selectedDateIndex.localStats = dateLength;

    this.updateAll();
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
    this.updateLocalStats();
    this.updateLocalBreakdown();
    this.updateLocalGrowth();
    this.updateLocalOverview();
    this.updateLocalCompare();
  }

  updateGlobalOverview() {
    this.globalGraph.data = [];
    this.buildFitTraces(this.data.get("China").fits.sig[this.selectedDateIndex.globalOverview - 15], "sig", "china", "5899DA8C", "5899DA46").forEach(x => this.globalGraph.data.push(x));
    this.buildFitTraces(this.data.get("row").fits.exp[this.selectedDateIndex.globalOverview - 15], "exp", "row", "E8743B8C", "E8743B46").forEach(x => this.globalGraph.data.push(x));
    this.globalGraph.data.push(this.buildTrace(this.data.get("China").confirmed, this.selectedDateIndex.globalOverview, "china", this.translateService.instant("pages.corona.legend.china"), "#1866b4", false, "square"));
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

  getValueDelta(current: number, previous: number) {
    let delta = (current - previous);
    return { value: current, delta: delta > 0 ? "+" + delta : delta.toString() };
  }

  updateGlobalStats() {
    let globalData = this.data.get("global");
    let date = this.selectedDateIndex.globalStats;
    this.statistics.global.confirmed = this.getValueDelta(globalData.confirmed[date], globalData.confirmed[date - 1]);
    this.statistics.global.dead = this.getValueDelta(globalData.dead[date], globalData.dead[date - 1]);
    this.statistics.global.recovered = this.getValueDelta(globalData.recovered[date], globalData.recovered[date - 1]);
    this.statistics.global.infected = this.getValueDelta(
      globalData.confirmed[date] - globalData.dead[date] - globalData.recovered[date],
      globalData.confirmed[date - 1] - globalData.dead[date - 1] - globalData.recovered[date - 1]);
    this.statistics.global.fatalityrate = globalData.dead[date] / (globalData.confirmed[date]) * 100;
    this.statistics.global.topcountries = [];
    for (var key in this.topcountries[date]) {
      this.statistics.global.topcountries.push({ name: this.translateService.instant('pages.corona.names.' + key), infected: this.topcountries[date][key] });
    }
    this.statistics.global.topcountries.sort((a, b) => b.infected - a.infected);
  }

  updateLocalStats() {
    let localData = this.data.get(this.selectedRegion);
    let date = this.selectedDateIndex.localStats;
    this.statistics.local.confirmed = this.getValueDelta(localData.confirmed[date], localData.confirmed[date - 1]);
    this.statistics.local.dead = this.getValueDelta(localData.dead[date], localData.dead[date - 1]);
    this.statistics.local.recovered = this.getValueDelta(localData.recovered[date], localData.recovered[date - 1]);
    this.statistics.local.infected = this.getValueDelta(
      localData.confirmed[date] - localData.dead[date] - localData.recovered[date],
      localData.confirmed[date - 1] - localData.dead[date - 1] - localData.recovered[date - 1]);
    this.statistics.local.fatalityrate = localData.dead[date] / (localData.confirmed[date]) * 100;
  }

  updateLocalCompare() {
    let localData = this.data.get(this.selectedRegion);
    let threshold = 500;
    this.localCompareGraph.data = [];
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(localData.confirmed, threshold, this.translateService.instant("pages.corona.names." + this.selectedRegion), "#333333", false));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.data.get("China").confirmed, threshold, this.translateService.instant("pages.corona.names.China"), "#5899DA"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.data.get("US").confirmed, threshold, this.translateService.instant("pages.corona.names.US"), "#E8743B"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.data.get("Italy").confirmed, threshold, this.translateService.instant("pages.corona.names.Italy"), "#19A979"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.data.get("Spain").confirmed, threshold, this.translateService.instant("pages.corona.names.Spain"), "#ED4A7B"));
    this.localCompareGraph.layout.xaxis.range[1] = this.localCompareGraph.data[0].x.length + 5;
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

  buildLocalCompareTrace(data: number[], threshold: number, name: string, color: string, dotted: boolean = true) {
    let x = []
    let y: number[] = []
    let count: number = 0;
    for (var i = 0; i < data.length; i++) {
      if (data[i] == undefined) break;
      if (data[i] < threshold) continue;
      x.push(count);
      y.push(data[i]);
      count++;
    }

    let trace = {
      x: x,
      y: y,
      mode: 'lines',
      type: 'scatter',
      name: name,
      line: {
        color: color,
        width: dotted ? 3 : 4,
        dash: dotted ? 'dot' : 'solid'
      }
    }

    return trace;
  }

  buildTrace(data: number[], count: number, group: string, name: string, color: string, line: boolean = false, marker: string = "circle") {
    let x = []
    let y: number[] = []
    for (var i = 0; i <= count; i++) {
      if (data[i] == undefined) break;
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
        size: 8,
        symbol: marker
      },
      line: {
        width: 3,
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
        size: 8,
        symbol: "diamond"
      },
      line: {
        color: relativeColor,
        width: 3
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
      this.updateLocalStats();
      this.updateLocalCompare();
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

  linkAllGlobal(index: number) {
    this.selectedDateIndex.globalOverview = index;
    this.selectedDateIndex.globalStatus = index;
    this.selectedDateIndex.globalStats = index;

    this.updateGlobalOverview();
    this.updateGlobalStats();
    this.updateGlobalStatus();
  };

  linkAllLocal(index: number) {
    this.selectedDateIndex.localStats = index;
    this.selectedDateIndex.localBreakdown = index;
    this.selectedDateIndex.localGrowth = index;
    this.selectedDateIndex.localOverview = index;

    this.updateLocalStats();
    this.updateLocalOverview();
    this.updateLocalGrowth();
    this.updateLocalBreakdown();
  };

  onDateSliderChange(name: string): void {
    switch (name) {
      case "globaloverview":
        if (this.selectedDateIndex.linkGlobal) this.linkAllGlobal(this.selectedDateIndex.globalOverview);
        else this.updateGlobalOverview();
        break;
      case "globalstatus":
        if (this.selectedDateIndex.linkGlobal) this.linkAllGlobal(this.selectedDateIndex.globalStatus);
        else this.updateGlobalStatus();
        break;
      case "globalstats":
        if (this.selectedDateIndex.linkGlobal) this.linkAllGlobal(this.selectedDateIndex.globalStats);
        else this.updateGlobalStats();
        break;
      case "localstats":
        if (this.selectedDateIndex.linkLocal) this.linkAllLocal(this.selectedDateIndex.localStats);
        else this.updateLocalStats();
        break;
      case "localoverview":
        if (this.selectedDateIndex.linkLocal) this.linkAllLocal(this.selectedDateIndex.localOverview);
        else this.updateLocalOverview();
        break;
      case "localbreakdown":
        if (this.selectedDateIndex.linkLocal) this.linkAllLocal(this.selectedDateIndex.localBreakdown);
        else this.updateLocalBreakdown();
        break;
      case "localgrowth":
        if (this.selectedDateIndex.linkLocal) this.linkAllLocal(this.selectedDateIndex.localGrowth);
        else this.updateLocalGrowth();
        break;
    }
  }

  activeAnimations: Map<string, any> = new Map<string, any>();
  animateSlider(name: string, event: MouseEvent, repeat: boolean): void {
    let slider = <HTMLInputElement>document.getElementById("date-slider-" + name);

    if (this.activeAnimations.has(name)) {
      clearInterval(this.activeAnimations.get(name));
      this.activeAnimations.delete(name);
    } else {
      if (slider.value == slider.max) slider.value = slider.min;
      let updateInterval = setInterval(async () => {
        slider.value = (Number(slider.value) + 1).toString();
        slider.dispatchEvent(new Event('input'));

        if (slider.value == slider.max) {
          if (repeat) {
            await new Promise(resolve => setTimeout(() => {
              if (slider.value == slider.max) slider.value = slider.min;
              resolve();
            }, 1000));
          } else {
            clearInterval(updateInterval);
            this.activeAnimations.delete(name);
          }
        }
      }, 200);

      this.activeAnimations.set(name, updateInterval);
    }
  }

  linkSlider(group: string, name: string, event: MouseEvent): void {
    switch (group) {
      case "local":
        this.selectedDateIndex.linkLocal = !this.selectedDateIndex.linkLocal;
        break;
      case "global":
        this.selectedDateIndex.linkGlobal = !this.selectedDateIndex.linkGlobal;
        break;
    }
    this.onDateSliderChange(name);
  }
}
