import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoronaFit, CoronaData, CoronaTestData } from 'src/app/structures/corona-structures';
import { TranslateService } from '@ngx-translate/core';
import { DeviceDetectorService } from 'ngx-device-detector';
import { ActivatedRoute } from '@angular/router';
import { PlotlyModule } from 'angular-plotly.js';
import { RangeSliderComponent } from './range-slider/range-slider.component';

declare let gtag: Function;

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
  dataOnTests: Map<string, CoronaTestData>;
  selectedRegion: string = "global";

  maxDateIndex: number;
  controlSettings = {
    linkGlobal: false,
    globalOverview: {
      min: 0,
      max: 1,
      resize: true
    },
    globalStatus: {
      index: 0,
    },
    globalStats: {
      index: 0,
    },

    linkLocal: false,
    localStats: {
      index: 0,
    },
    localOverview: {
      min: 0,
      max: 0,
      resize: true
    },
    localBreakdown: {
      min: 0,
      max: 0,
      resize: true
    },
    localGrowth: {
      min: 0,
      max: 0,
      resize: true
    }
  }

  showTestRegions: boolean = false;
  ready: boolean = false;

  globalAnimateGroup: RangeSliderComponent[] = [];
  globalAnimateInterval: any;
  localAnimateGroup: RangeSliderComponent[] = [];
  localAnimateInterval: any;

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
      displaylogo: false,
      displayModeBar: false,
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
      displaylogo: false,
      displayModeBar: false,
    }
  };

  public globalTestsGraph = {
    data: [],
    layout: {
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      font: {
        family: 'sans-serif',
        color: '#00254D',
        size: 14
      },
      geo: {
        scope: 'world',
        showland: false,
        showframe: false,
        projection: {
          type: this.deviceService.isMobile() ? 'mercator' : 'normal world',
        }
      },
      margin: { l: 0, r: 0, t: 0, b: 0 }
    },
    config: {
      responsive: true,
      editable: false,
      displaylogo: false,
      scrollZoom: false,
      displayModeBar: false,
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
        title: '',
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
      displaylogo: false,
      displayModeBar: false,
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
      displaylogo: false,
      displayModeBar: false,
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
      displaylogo: false,
      displayModeBar: false,
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
      displaylogo: false,
      displayModeBar: false,
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
      serious: { value: "0", updated: "0" },
      tests: { value: "0", updated: "0", regions: new Map<string, number>() }
    }
  }

  constructor(private apiService: ApiService, private translateService: TranslateService, private deviceService: DeviceDetectorService, private route: ActivatedRoute) {
    this.translateService.onLangChange.subscribe(() => {
      this.updateAll();
      setTimeout(() => {
        this.sortRegionSelect();
      }, 100);
    });
  }

  ngOnInit(): void {
    let options = document.getElementById("region-select").getElementsByTagName("option");
    this.route.queryParams.subscribe(params => {
      let region = params["region"];
      if (region != undefined) {
        for (let i = 0; i < options.length; i++) {
          if (options.item(i).value == region) {
            options.item(i).selected = true;
            this.selectedRegionChanged();
            break;
          }
        }
      }
    });

    let requiredRegions = ["China", "row", "global", "US", "Italy", "Spain"];
    let loadedRegions = 0;
    requiredRegions.forEach(country => {
      this.apiService.getCoronaData(country).subscribe(data => {
        this.data.set(country, data);
        loadedRegions += 1;
        if (loadedRegions == requiredRegions.length && this.topcountries != undefined && this.dataOnTests != undefined) this.onDataLoaded();
      })
    });
    this.apiService.getCoronaTopCountries().subscribe(tc => {
      this.topcountries = tc;
      if (loadedRegions == requiredRegions.length && this.dataOnTests != undefined) this.onDataLoaded();
    });
    this.apiService.getCoronaTestData().subscribe(td => {
      this.dataOnTests = td;
      if (loadedRegions == requiredRegions.length && this.topcountries != undefined) this.onDataLoaded();
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
    this.maxDateIndex = dateLength;

    this.dataEndDate = new Date(this.dataStartDate);
    this.dataEndDate.setDate(this.dataEndDate.getDate() + dateLength);
    this.axisEndDate = new Date(this.dataEndDate);
    this.axisEndDate.setDate(this.axisEndDate.getDate() + 3);

    this.controlSettings.globalOverview.max = dateLength;
    this.controlSettings.globalStatus.index = dateLength;
    this.controlSettings.globalStats.index = dateLength;
    this.controlSettings.localOverview.max = dateLength;
    this.controlSettings.localBreakdown.max = dateLength;
    this.controlSettings.localGrowth.max = dateLength;
    this.controlSettings.localStats.index = dateLength;
    this.ready = true;
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
    this.updateGlobalTests();
    this.updateGlobalStats();
    this.updateGlobalStatus();
    this.updateLocalStats();
    this.updateLocalBreakdown();
    this.updateLocalGrowth();
    this.updateLocalOverview();
    this.updateLocalCompare();
  }

  updateGlobalOverview() {
    let newGlobalGraphData = [];
    this.buildFitTraces(this.data.get("China"), this.controlSettings.globalOverview.max - 15, "sig", "china", "5899DA8C", "5899DA46").forEach(x => newGlobalGraphData.push(x));
    this.buildFitTraces(this.data.get("row"), this.controlSettings.globalOverview.max - 15, "exp", "row", "E8743B8C", "E8743B46").forEach(x => newGlobalGraphData.push(x));
    newGlobalGraphData.push(this.buildTrace(this.data.get("China").confirmed, this.controlSettings.globalOverview.max, "china", this.translateService.instant("pages.corona.legend.china"), "#1866b4", false, "square"));
    newGlobalGraphData.push(this.buildTrace(this.data.get("row").confirmed, this.controlSettings.globalOverview.max, "row", this.translateService.instant("pages.corona.legend.row"), "#cc4300"));

    this.globalGraph.data = newGlobalGraphData;
    if (this.controlSettings.globalOverview.resize) {
      this.globalGraph.layout.xaxis.range = [
        (this.controlSettings.globalOverview.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.globalOverview.max + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
      this.globalGraph.layout.yaxis.range = [0,
        Math.max(
          this.data.get("China").confirmed[this.controlSettings.globalOverview.max],
          this.data.get("row").confirmed[this.controlSettings.globalOverview.max]
        ) * 1.1];
    } else {
      this.globalGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.axisEndDate.getTime()
      ];
      this.globalGraph.layout.yaxis.range = [0,
        Math.max(
          this.data.get("China").confirmed[this.maxDateIndex],
          this.data.get("row").confirmed[this.maxDateIndex]
        ) * 1.1];
    }
  }

  updateGlobalTests() {
    let locations = [];
    let z = [];
    let texts = [];

    let keys = Object.keys(this.dataOnTests);
    keys.forEach(country => {
      let countryData: CoronaTestData = this.dataOnTests[country];
      locations.push(countryData.original_name);
      z.push(Math.log10(countryData.total / countryData.confirmed_cases));
      texts.push(
        `</br>${this.translateService.instant("pages.corona.names." + country)} 
        </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.ratio")}: ${Math.round(countryData.total / countryData.confirmed_cases)}
        </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.tests")}: ${countryData.total}
        </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.infected")}: ${countryData.confirmed_cases}
        </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.published")}: ${new Date(countryData.updated).toLocaleString(undefined, { year: "numeric", month: "2-digit", day: "2-digit" })}
        `);
    });

    this.globalTestsGraph.data.push({
      type: 'choropleth',
      locationmode: 'country names',
      hoverinfo: 'text',
      locations: locations,
      z: z,
      text: texts,
      showscale: false,
      colorbar: { showcolorbar: false, hidden: true, y: 1, yanchor: "top", orientation: "h" },
      autocolorscale: false,
      colorscale: [
        [0, '#AA00FF'], [0.8 / 2.8, '#FFD80D'], [1, '#12B313']],
      zmin: 0.2,
      zmax: 3

    });
  }

  globalTestsMapUpdated() {
    try {
      let plotLayer = document.getElementById("global-tests-plot").getElementsByClassName("geo").item(0).children;
      for (let i = 0; i < plotLayer.length; i++) {
        if (plotLayer.item(i).classList.contains("bg")) {
          for (let k = 0; k < plotLayer.item(i).children.length; k++) {
            (<HTMLElement>plotLayer.item(i).children.item(k)).style.opacity = "0";
          }
        }
      }
    } catch { }
  }

  updateGlobalStatus() {
    let globalData = this.data.get("global");
    this.globalDeadInfectedHealedGraph.data = [];
    this.globalDeadInfectedHealedGraph.data.push(
      this.buildDeadInfectedHealedPieChart(globalData.confirmed, globalData.dead, globalData.recovered, this.controlSettings.globalStatus.index, [this.colors.infected, this.colors.dead, this.colors.recovered])
    );
  }

  getValueDelta(current: number, previous: number) {
    let delta = (current - previous);
    return { value: current, delta: delta > 0 ? "+" + delta : delta.toString() };
  }

  updateGlobalStats() {
    let globalData = this.data.get("global");
    let date = this.controlSettings.globalStats.index;
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
    let date = this.controlSettings.localStats.index;

    this.statistics.local.confirmed = this.getValueDelta(localData.confirmed[date], localData.confirmed[date - 1]);
    this.statistics.local.dead = this.getValueDelta(localData.dead[date], localData.dead[date - 1]);
    this.statistics.local.recovered = this.getValueDelta(localData.recovered[date], localData.recovered[date - 1]);
    this.statistics.local.infected = this.getValueDelta(
      localData.confirmed[date] - localData.dead[date] - localData.recovered[date],
      localData.confirmed[date - 1] - localData.dead[date - 1] - localData.recovered[date - 1]);
    this.statistics.local.fatalityrate = localData.dead[date] / (localData.confirmed[date]) * 100;

    if (this.dataOnTests != undefined && this.dataOnTests[this.selectedRegion] != undefined) {
      let data = this.dataOnTests[this.selectedRegion];
      this.statistics.local.tests.value = data.total.toString();
      this.statistics.local.tests.updated = new Date(data.updated).toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      if (data.regions != undefined) {
        this.statistics.local.tests.regions = data.regions;
        this.showTestRegions = true;
      } else {
        this.statistics.local.tests.regions = new Map<string, number>();
        this.showTestRegions = false;
      }
    } else {
      this.statistics.local.tests.value = this.translateService.instant("pages.corona.local.serious.not-available");
      this.statistics.local.tests.updated = new Date(Date.now()).toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    this.apiService.getCoronaSeriousCases(this.selectedRegion).subscribe(res => {
      let data = res.split("\n");
      this.statistics.local.serious.updated = new Date(Date.parse(data[0])).toLocaleString(undefined, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      if (data[1] == "not-available") {
        this.statistics.local.serious.value = this.translateService.instant("pages.corona.local.serious.not-available");
      } else {
        this.statistics.local.serious.value = data[1];
      }
    });
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
    this.localCompareGraph.layout.xaxis.title = this.translateService.instant("pages.corona.local.compare.axis");
  }

  updateLocalOverview() {
    let regionData = this.data.get(this.selectedRegion);
    let newData = [];
    newData.push(this.buildTrace(regionData.confirmed, this.controlSettings.localOverview.max, "none", this.translateService.instant("pages.corona.legend.total"), "#333333"));
    if (regionData.fits != undefined) {
      this.buildFitTraces(regionData, this.controlSettings.localOverview.max - 15, "exp", "exp_fit", "#a4650a8C", "#a4650a46").forEach(x => newData.push(x));
      this.buildFitTraces(regionData, this.controlSettings.localOverview.max - 15, "sig", "sig_fit", "#2a6d3c8C", "#2a6d3c46").forEach(x => newData.push(x));
    }
    this.localOverviewGraph.data = newData;
    if(this.controlSettings.localOverview.resize){
      this.localOverviewGraph.layout.yaxis.range = [0, regionData.confirmed[this.controlSettings.localOverview.max] * 1.2];
      this.localOverviewGraph.layout.xaxis.range = [
        (this.controlSettings.localOverview.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.localOverview.max + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
    } else {
      this.localOverviewGraph.layout.yaxis.range = [0, regionData.confirmed[this.maxDateIndex] * 1.2];
      this.localOverviewGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.axisEndDate.getTime()
      ];
    }
  } 

  updateLocalBreakdown() {
    let regionData = this.data.get(this.selectedRegion);
    let newData = []
    newData.push(this.buildTrace(regionData.dead, this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.dead"), this.colors.dead, true));
    newData.push(this.buildTrace(regionData.recovered, this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.recovered"), this.colors.recovered, true));
    newData.push(this.buildTrace(
      this.substract(this.substract(regionData.confirmed, regionData.recovered), regionData.dead),
      this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.infected"), this.colors.infected, true)
    );
    this.localDeadInfectedHealedGraph.data = newData;
    if(this.controlSettings.localBreakdown.resize){
      this.localDeadInfectedHealedGraph.layout.xaxis.range = [
        (this.controlSettings.localBreakdown.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.localBreakdown.max + 0.5) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
    } else {
      this.localDeadInfectedHealedGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.dataEndDate.getTime()
      ];
    }
  }

  updateLocalGrowth() {
    let regionData = this.data.get(this.selectedRegion);
    this.localGrowthGraph.data = this.buildGrowthTraces(regionData.confirmed, this.controlSettings.localGrowth.max, this.colors.growth.rel, this.colors.growth.tot);
    if(this.controlSettings.localGrowth.resize) {
      this.localGrowthGraph.layout.xaxis.range = [
        (this.controlSettings.localGrowth.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.localGrowth.max + 0.5) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
    } else {
      this.localGrowthGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.dataEndDate.getTime()
      ];
    }
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

  buildFitTraces(data: CoronaData, index: number, type: string, group: string, color: string, fill: string, sampleCount: number = 100.0) {
    let fit = data.cachedFits.get(type + index);

    var trace = {
      x: fit.x,
      y: fit.y,
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
      x: fit.x,
      y: fit.lower,
      fill: 'toself',
      type: 'scatter',
      mode: 'none',
      fillcolor: 'transparent',
      showlegend: false,
    };

    var errorBandUpper = {
      x: fit.x,
      y: fit.upper,
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
    gtag("event", this.selectedRegion, { "event_category": "region_changed" });
    let update = () => {
      if (!this.ready) return;
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
    this.controlSettings.globalOverview.max = index;
    this.controlSettings.globalStatus.index = index;
    this.controlSettings.globalStats.index = index;

    this.updateGlobalOverview();
    this.updateGlobalStats();
    this.updateGlobalStatus();
  };

  linkAllLocal(index: number) {
    this.controlSettings.localStats.index = index;
    this.controlSettings.localBreakdown.max = index;
    this.controlSettings.localGrowth.max = index;
    this.controlSettings.localOverview.max = index;

    this.updateLocalStats();
    this.updateLocalOverview();
    this.updateLocalGrowth();
    this.updateLocalBreakdown();
  };

  onDateSliderChange(name: string): void {
    switch (name) {
      case "globaloverview":
        if (this.controlSettings.linkGlobal) this.linkAllGlobal(this.controlSettings.globalOverview.max);
        else this.updateGlobalOverview();
        break;
      case "globalstatus":
        if (this.controlSettings.linkGlobal) this.linkAllGlobal(this.controlSettings.globalStatus.index);
        else this.updateGlobalStatus();
        break;
      case "globalstats":
        if (this.controlSettings.linkGlobal) this.linkAllGlobal(this.controlSettings.globalStats.index);
        else this.updateGlobalStats();
        break;
      case "localstats":
        if (this.controlSettings.linkLocal) this.linkAllLocal(this.controlSettings.localStats.index);
        else this.updateLocalStats();
        break;
      case "localoverview":
        if (this.controlSettings.linkLocal) this.linkAllLocal(this.controlSettings.localOverview.max);
        else this.updateLocalOverview();
        break;
      case "localbreakdown":
        if (this.controlSettings.linkLocal) this.linkAllLocal(this.controlSettings.localBreakdown.max);
        else this.updateLocalBreakdown();
        break;
      case "localgrowth":
        if (this.controlSettings.linkLocal) this.linkAllLocal(this.controlSettings.localGrowth.max);
        else this.updateLocalGrowth();
        break;
    }
  }

  share() {
    let url = 'https://timpokart.de/corona/?region=' + this.selectedRegion + '#regional';
    let copyText = this.translateService.instant('pages.corona.local.share.text') + this.translateService.instant('pages.corona.names.' + this.selectedRegion);

    let copyToClipboard = () => {
      const copyEl = document.createElement('textarea');
      copyEl.value = 'COVID-19 Dashboard - ' + copyText + ': ' + url;
      document.body.appendChild(copyEl);
      copyEl.select();
      document.execCommand('copy');
      document.body.removeChild(copyEl);

      let popupDiv = document.getElementById("copied-div");
      popupDiv.classList.add("visible");
      setTimeout(() => {
        popupDiv.classList.remove("visible");
      }, 1000);
    };

    let anyNavigator: any = window.navigator;
    if (anyNavigator && anyNavigator.share) {
      anyNavigator.share({
        title: 'COVID-19 Dashboard',
        text: copyText,
        url: url
      })
        .then(() => console.log('success'))
        .catch(() => copyToClipboard());
    } else {
      copyToClipboard();
    }
  }

  selectedScopeChanged() {
    this.globalTestsGraph.layout.geo.scope = (<HTMLSelectElement>document.getElementById("scope-select")).value;
    delete this.globalTestsGraph.layout.geo["center"];
    PlotlyModule.plotlyjs.react(document.getElementById("global-tests-plot").children.item(0), this.globalTestsGraph.data, this.globalTestsGraph.layout);
  }
}
