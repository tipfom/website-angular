import { Component, OnInit } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';
import { CoronaFits, CoronaOverviewData, CoronaTestData } from 'src/app/structures/corona-structures';
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

  overviewData: Map<string, CoronaOverviewData>;
  fitData: Map<string, CoronaFits> = new Map<string, CoronaFits>();
  selectedRegion: string = "global";

  maxDateIndex: number;
  controlSettings = {
    linkGlobal: false,
    globalOverview: {
      min: 0,
      max: 1,
      resize: true
    },
    globalInfectedMap: {
      index: 0,
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

  public globalInfectedMapGraph = {
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
      staticPlot: this.deviceService.isMobile()
    }
  };

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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        automargin: true,
        range: [0, 0],
        gridcolor: this.colors.grid,
        fixedrange: true
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
      staticPlot: this.deviceService.isMobile()
    }
  };

  public localCompareGraph = {
    data: [],
    layout: {
      height: 450,
      plot_bgcolor: this.colors.background,
      paper_bgcolor: this.colors.background,
      autosize: true,
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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        type: 'log',
        tick0: 2,
        dtick: 1,
        gridcolor: this.colors.grid,
        fixedrange: true
      },
      legend: {
        x: 0.99,
        xanchor: 'right',
        y: 0.01,
        yanchor: 'bottom',
        bgcolor: '#e6e2e746',
        opacity: 0.5,
        orientation: 'h',
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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: false,
        range: [0, 0],
        automargin: true,
        gridcolor: this.colors.grid,
        fixedrange: true
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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        gridcolor: this.colors.grid,
        fixedrange: true,
        title: {
          text: "",
          standoff: 10
        },
      },
      yaxis2: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        fixedrange: true,
        overlaying: 'y',
        side: 'right',
        showgrid: false,
        title: {
          text: "",
          standoff: 10
        },
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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        gridcolor: this.colors.grid,
        fixedrange: true
      },
      yaxis2: {
        range: [0, 1],
        overlaying: 'y',
        autorange: false,
        automargin: true,
        side: 'right',
        showgrid: false,
        tickformat: ',.0%',
        fixedrange: true
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
      confirmed: { value: 0, delta: 0 },
      infected: { value: 0, delta: 0 },
      recovered: { value: 0, delta: 0 },
      dead: { value: 0, delta: 0 },
      fatalityrate: 0,
      topcountries: []
    },
    local: {
      confirmed: { value: 0, delta: 0, rank: 0 },
      infected: { value: 0, delta: 0, rank: 0 },
      recovered: { value: 0, delta: 0 },
      dead: { value: 0, delta: 0 },
      fatalityrate: 0,
      serious: { value: "0", updated: "0" },
      tests: { value: "0", updated: "0", regions: new Map<string, number>() }
    }
  }

  public localR0Graph = {
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
        fixedrange: true
      },
      yaxis: {
        rangemode: 'nonnegative',
        autorange: true,
        automargin: true,
        gridcolor: this.colors.grid,
        fixedrange: true,
        title: {
          text: 'Days',
          standoff: 10
        }
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

  constructor(private apiService: ApiService, public translateService: TranslateService, private deviceService: DeviceDetectorService, private route: ActivatedRoute) {
    this.translateService.onLangChange.subscribe(() => {
      setTimeout(() => {
        if (this.ready) this.updateAll();
        this.sortRegionSelect();
      }, 20);
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

    let mapDivs = document.getElementsByClassName("map-div");
    for (let i = 0; i < mapDivs.length; i++) {
      mapDivs.item(i).addEventListener("mousemove", (ev) => { ev.stopImmediatePropagation(); });
    }

    let loadedRegions = 0;
    let requiredRegions = [this.selectedRegion, "China", "row"];
    let partDataLoad = () => {
      if (this.overviewData != undefined && loadedRegions == requiredRegions.length) this.onDataLoaded();
    };

    this.apiService.getCoronaOverviewData().subscribe(res => {
      this.overviewData = res;
      partDataLoad();
    });
    requiredRegions.forEach(country => {
      this.apiService.getCoronaFits(country).subscribe(data => {
        this.fitData.set(country, data);
        loadedRegions += 1;
        partDataLoad();
      })
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
    let dateLength = this.overviewData.get("global").confirmed.length - 1;
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
    this.controlSettings.globalInfectedMap.index = dateLength;

    if (this.deviceService.isMobile()) {
      const mobileRange = 7 * 6;
      this.controlSettings.globalOverview.min = this.controlSettings.globalOverview.max - mobileRange;
      this.controlSettings.localOverview.min = this.controlSettings.localOverview.max - mobileRange;
      this.controlSettings.localBreakdown.min = this.controlSettings.localBreakdown.max - mobileRange;
      this.controlSettings.localGrowth.min = this.controlSettings.localGrowth.max - mobileRange;
    }
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
    this.updateGlobalInfectedMap();
    this.updateGlobalOverview();
    this.updateGlobalTests();
    this.updateGlobalStats();
    this.updateGlobalStatus();
    this.updateLocalStats();
    this.updateLocalBreakdown();
    this.updateLocalGrowth();
    this.updateLocalOverview();
    this.updateLocalCompare();
    this.updateLocalR0();
  }

  updateGlobalInfectedMap() {
    let locations = [];
    let z = [];
    let texts = [];

    let index = this.controlSettings.globalInfectedMap.index;
    let iterator = this.overviewData.entries();
    let element: IteratorResult<[string, CoronaOverviewData]>;
    while (!(element = iterator.next()).done) {
      let countryData: CoronaOverviewData = (<CoronaOverviewData>element.value[1]);
      if (countryData) {
        let value = countryData.confirmed[index] - countryData.dead[index] - countryData.recovered[index];
        locations.push(element.value[0]);
        z.push(Math.log10(value));
        texts.push(
          `</br>${this.translateService.instant("pages.corona.names." + element.value[0].replace(" ", "_"))} 
          </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.infected")}: ${Math.abs(value).toLocaleString(this.translateService.currentLang, { useGrouping: true })}
          `);
      }
    }

    this.globalInfectedMapGraph.data = [];
    this.globalInfectedMapGraph.data.push({
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
        [0 / 6, '#fff7ec'], // 0
        [3 / 6, '#fdbb84'], // 1000
        [4 / 6, '#ef6548'],// 10k
        [6 / 6, '#7f0000'], // 1m
      ],
      zmin: 0,
      zmax: 6
    });
  }

  updateGlobalOverview() {
    let newGlobalGraphData = [];
    this.buildFitTraces(this.fitData.get("global"), this.controlSettings.globalOverview.max - 15, "sig", "global", "#a4650a8C", "#a4650a46").forEach(x => newGlobalGraphData.push(x));
    this.buildFitTraces(this.fitData.get("global"), this.controlSettings.globalOverview.max - 15, "exp", "global", "#2a6d3c8C", "#2a6d3c46").forEach(x => newGlobalGraphData.push(x));
    newGlobalGraphData.push(this.buildTrace(this.overviewData.get("global").confirmed, this.controlSettings.globalOverview.max, "global", this.translateService.instant("pages.corona.names.global"), "#333333", false, "square"));

    this.globalGraph.data = newGlobalGraphData;
    if (this.controlSettings.globalOverview.resize) {
      this.globalGraph.layout.xaxis.range = [
        (this.controlSettings.globalOverview.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.globalOverview.max + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
      this.globalGraph.layout.yaxis.range = [0,
        Math.max(
          this.overviewData.get("China").confirmed[this.controlSettings.globalOverview.max],
          this.overviewData.get("row").confirmed[this.controlSettings.globalOverview.max]
        ) * 1.1];
    } else {
      this.globalGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.axisEndDate.getTime()
      ];
      this.globalGraph.layout.yaxis.range = [0,
        Math.max(
          this.overviewData.get("China").confirmed[this.maxDateIndex],
          this.overviewData.get("row").confirmed[this.maxDateIndex]
        ) * 1.1];
    }
  }

  updateGlobalTests() {
    let locations = [];
    let z = [];
    let texts = [];

    let x = this.overviewData.entries();
    let y: IteratorResult<[string, CoronaOverviewData]>;
    while (!(y = x.next()).done) {
      let countryData: CoronaTestData = (<CoronaOverviewData>y.value[1]).tests;
      if (countryData) {
        locations.push(countryData.original_name);
        z.push(Math.log10(countryData.total / countryData.confirmed_cases));
        texts.push(
          `</br>${this.translateService.instant("pages.corona.names." + y.value[0].replace(" ", "_"))} 
          </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.ratio")}: ${(countryData.total / countryData.confirmed_cases).toLocaleString(this.translateService.currentLang, { useGrouping: true, minimumFractionDigits: 1, maximumFractionDigits: 1, minimumIntegerDigits: 1 })}
          </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.tests")}: ${Math.abs(countryData.total).toLocaleString(this.translateService.currentLang, { useGrouping: true })}
          </br>${this.translateService.instant("pages.corona.global.test-map.hover-info.infected")}: ${Math.abs(countryData.confirmed_cases).toLocaleString(this.translateService.currentLang, { useGrouping: true })}
          `);
      }
    }

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
        [0, '#d73027'], [0.8 / 1.8, '#ffffbf'], [1, '#1a9850']],
      zmin: 0.2,
      zmax: 2
    });
  }

  cloroplethMapChanged(name: string) {
    try {
      let plotLayer = document.getElementById(name).getElementsByClassName("geo").item(0).children;
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
    let globalData = this.overviewData.get("global");
    this.globalDeadInfectedHealedGraph.data = [];
    this.globalDeadInfectedHealedGraph.data.push(
      this.buildDeadInfectedHealedPieChart(globalData.confirmed, globalData.dead, globalData.recovered, this.controlSettings.globalStatus.index, [this.colors.infected, this.colors.dead, this.colors.recovered])
    );
  }

  getValueDelta(current: number, previous: number) {
    let delta = (current - previous);
    return { value: current, delta: delta };
  }

  updateGlobalStats() {
    let globalData = this.overviewData.get("global");
    let date = this.controlSettings.globalStats.index;
    this.statistics.global.confirmed = this.getValueDelta(globalData.confirmed[date], globalData.confirmed[date - 1]);
    this.statistics.global.dead = this.getValueDelta(globalData.dead[date], globalData.dead[date - 1]);
    this.statistics.global.recovered = this.getValueDelta(globalData.recovered[date], globalData.recovered[date - 1]);
    this.statistics.global.infected = this.getValueDelta(
      globalData.confirmed[date] - globalData.dead[date] - globalData.recovered[date],
      globalData.confirmed[date - 1] - globalData.dead[date - 1] - globalData.recovered[date - 1]);
    this.statistics.global.fatalityrate = globalData.dead[date] / (globalData.confirmed[date]) * 100;

    let temp = [];
    let element;
    let iterator = this.overviewData.entries();
    while (!(element = iterator.next()).done) {
      if (element.value[0] == "global" ||
        element.value[0] == "row" ||
        element.value[0] == "western_pacific_region" ||
        element.value[0] == "european_region" ||
        element.value[0] == "south_east_asia_region" ||
        element.value[0] == "eastern_mediterranean_region" ||
        element.value[0] == "region_of_the_americans" ||
        element.value[0] == "african_region" ||
        element.value[0] == "other") continue;
      temp.push({ key: element.value[0], infected: element.value[1].confirmed[date] - element.value[1].dead[date] - element.value[1].recovered[date] });
    }
    temp.sort((a, b) => b.infected - a.infected);

    this.statistics.global.topcountries = [];
    for (let i = 0; i < 5; i++) {
      this.statistics.global.topcountries.push({ name: this.translateService.instant('pages.corona.names.' + temp[i].key), infected: temp[i].infected });
    }
  }

  getRankedValueDelta(name: string, date: number, evalFn: (data: CoronaOverviewData, date: number) => number) {
    let current = evalFn(this.overviewData.get(name), date);
    let previous = evalFn(this.overviewData.get(name), date - 1);
    let rank = 0;
    let element;
    let iterator = this.overviewData.entries();
    while (!(element = iterator.next()).done) {
      if (element.value[0] == "global" ||
        element.value[0] == "row" ||
        element.value[0] == "western_pacific_region" ||
        element.value[0] == "european_region" ||
        element.value[0] == "south_east_asia_region" ||
        element.value[0] == "eastern_mediterranean_region" ||
        element.value[0] == "region_of_the_americans" ||
        element.value[0] == "china" ||
        element.value[0] == "african_region" ||
        element.value[0] == "other") continue;
      if (evalFn(element.value[1], date) >= current) {
        rank++;
      }
    }

    let delta = (current - previous);
    return { value: current, delta: delta, rank: rank };
  }

  confirmedEvalFn(data: CoronaOverviewData, date: number) {
    return data.confirmed[date];
  }

  infectedEvalFn(data: CoronaOverviewData, date: number) {
    return data.confirmed[date] - data.recovered[date] - data.dead[date];
  }

  updateLocalStats() {
    let localOverviewData = this.overviewData.get(this.selectedRegion);
    let date = this.controlSettings.localStats.index;

    this.statistics.local.confirmed = this.getRankedValueDelta(this.selectedRegion, date, this.confirmedEvalFn);
    this.statistics.local.dead = this.getValueDelta(localOverviewData.dead[date], localOverviewData.dead[date - 1]);
    this.statistics.local.recovered = this.getValueDelta(localOverviewData.recovered[date], localOverviewData.recovered[date - 1]);
    this.statistics.local.infected = this.getRankedValueDelta(this.selectedRegion, date, this.infectedEvalFn);
    this.statistics.local.fatalityrate = localOverviewData.dead[date] / (localOverviewData.confirmed[date]) * 100;

    if (localOverviewData.tests != undefined) {
      let data = localOverviewData.tests;
      this.statistics.local.tests.value = data.total.toLocaleString(this.translateService.currentLang, { useGrouping: true });
      this.statistics.local.tests.updated = new Date(data.updated).toLocaleString(this.translateService.currentLang, {
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
      this.statistics.local.tests.updated = new Date(Date.now()).toLocaleString(this.translateService.currentLang, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
    }

    if (localOverviewData.serious) {
      this.statistics.local.serious.updated = localOverviewData.serious.updated.toLocaleString(this.translateService.currentLang, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      if (localOverviewData.serious.value == undefined) {
        this.statistics.local.serious.value = this.translateService.instant("pages.corona.local.serious.not-available");
      } else {
        this.statistics.local.serious.value = localOverviewData.serious.value.toLocaleString(this.translateService.currentLang, { useGrouping: true });
      }
    } else {
      this.statistics.local.serious.updated = new Date().toLocaleString(this.translateService.currentLang, {
        weekday: "short",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });
      this.statistics.local.serious.value = this.translateService.instant("pages.corona.local.serious.not-available");
    }
  }

  updateLocalCompare() {
    let localData = this.overviewData.get(this.selectedRegion);
    let threshold = 500;
    this.localCompareGraph.data = [];
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(localData.confirmed, threshold, this.translateService.instant("pages.corona.names." + this.selectedRegion), "#333333", false));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.overviewData.get("China").confirmed, threshold, this.translateService.instant("pages.corona.names.China"), "#5899DA"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.overviewData.get("US").confirmed, threshold, this.translateService.instant("pages.corona.names.US"), "#E8743B"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.overviewData.get("Italy").confirmed, threshold, this.translateService.instant("pages.corona.names.Italy"), "#19A979"));
    this.localCompareGraph.data.push(this.buildLocalCompareTrace(this.overviewData.get("Spain").confirmed, threshold, this.translateService.instant("pages.corona.names.Spain"), "#ED4A7B"));
    this.localCompareGraph.layout.xaxis.range[1] = this.localCompareGraph.data[0].x.length + 5;
    this.localCompareGraph.layout.xaxis.title = this.translateService.instant("pages.corona.local.compare.axis");
  }

  updateLocalOverview() {
    let regionOverviewData = this.overviewData.get(this.selectedRegion);
    let newData = [];
    newData.push(this.buildTrace(regionOverviewData.confirmed, this.controlSettings.localOverview.max, "none", this.translateService.instant("pages.corona.legend.total"), "#333333"));
    if (this.fitData.has(this.selectedRegion)) {
      this.buildFitTraces(this.fitData.get(this.selectedRegion), this.controlSettings.localOverview.max - 15, "exp", "exp_fit", "#a4650a8C", "#a4650a46").forEach(x => newData.push(x));
      this.buildFitTraces(this.fitData.get(this.selectedRegion), this.controlSettings.localOverview.max - 15, "sig", "sig_fit", "#2a6d3c8C", "#2a6d3c46").forEach(x => newData.push(x));
    }
    this.localOverviewGraph.data = newData;
    if (this.controlSettings.localOverview.resize) {
      this.localOverviewGraph.layout.yaxis.range = [0, regionOverviewData.confirmed[this.controlSettings.localOverview.max] * 1.2];
      this.localOverviewGraph.layout.xaxis.range = [
        (this.controlSettings.localOverview.min) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime(),
        (this.controlSettings.localOverview.max + 3) * (1000 * 60 * 60 * 24) + this.axisStartDate.getTime()
      ];
    } else {
      this.localOverviewGraph.layout.yaxis.range = [0, regionOverviewData.confirmed[this.maxDateIndex] * 1.2];
      this.localOverviewGraph.layout.xaxis.range = [
        this.axisStartDate.getTime(),
        this.axisEndDate.getTime()
      ];
    }
  }

  updateLocalBreakdown() {
    let regionData = this.overviewData.get(this.selectedRegion);
    let newData = []
    newData.push(this.buildTrace(regionData.dead, this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.dead"), this.colors.dead, true));
    newData.push(this.buildTrace(regionData.recovered, this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.recovered"), this.colors.recovered, true));
    newData.push(this.buildTrace(
      this.substract(this.substract(regionData.confirmed, regionData.recovered), regionData.dead),
      this.controlSettings.localBreakdown.max, null, this.translateService.instant("pages.corona.legend.infected"), this.colors.infected, true, "circle", "y2")
    );
    this.localDeadInfectedHealedGraph.data = newData;

    this.localDeadInfectedHealedGraph.layout.yaxis.title.text = this.translateService.instant("pages.corona.legend.dead") + ' / ' + this.translateService.instant("pages.corona.legend.recovered") + "\n ";
    this.localDeadInfectedHealedGraph.layout.yaxis2.title.text = " \n" + this.translateService.instant("pages.corona.legend.infected");

    if (this.controlSettings.localBreakdown.resize) {
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
    let regionData = this.overviewData.get(this.selectedRegion);
    this.localGrowthGraph.data = this.buildGrowthTraces(regionData.confirmed, this.controlSettings.localGrowth.max, this.colors.growth.rel, this.colors.growth.tot);
    if (this.controlSettings.localGrowth.resize) {
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

  updateLocalR0() {
    let regionData = this.overviewData.get(this.selectedRegion);
    let rollingAverage = [];
    for (var i = 0; i < regionData.confirmed.length; i++) {
      let v = regionData.confirmed[i];
      for (var k = 10; k > 0; k--) {
        if (rollingAverage.length > k) {
          for (var l = 1; l < k + 1; l++) {
            v += rollingAverage[rollingAverage.length - l];
          }
          v /= k + 1;
          break;
        }
      }
      rollingAverage.push(v);
    }

    let r0 = [];
    for (var i = 0; i < regionData.confirmed.length - 2; i++) {
      r0.push(Math.log(2) / Math.log(rollingAverage[i + 1] / rollingAverage[i]));
    }
    this.localR0Graph.data = [this.buildTrace(r0, r0.length, "", "r0", "#888888", true, "none")];
    this.localR0Graph.layout.xaxis.range = [
      this.axisStartDate.getTime(),
      this.dataEndDate.getTime()
    ];
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

  buildTrace(data: number[], count: number, group: string, name: string, color: string, line: boolean = false, marker: string = "circle", yaxis: string = "y1") {
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
      mode: line ? (marker == "none" ? 'lines' : 'lines+markers') : 'markers',
      type: 'scatter',
      name: name,
      legendgroup: group,
      yaxis: yaxis,
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

  buildFitTraces(data: CoronaFits, index: number, type: string, group: string, color: string, fill: string, sampleCount: number = 100.0) {
    let fit = data.cachedFits.get(type + index);
    if (!fit) return [];

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
      this.updateLocalR0();
    };
    if (this.fitData.has(this.selectedRegion)) {
      update();
    } else {
      this.apiService.getCoronaFits(this.selectedRegion).subscribe(d => {
        this.fitData.set(this.selectedRegion, d);
        update();
      });
    }
  }

  linkAllGlobal(index: number) {
    this.controlSettings.globalOverview.max = index;
    this.controlSettings.globalStatus.index = index;
    this.controlSettings.globalStats.index = index;
    this.controlSettings.globalInfectedMap.index = index;

    this.updateGlobalOverview();
    this.updateGlobalStats();
    this.updateGlobalStatus();
    this.updateGlobalInfectedMap();
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
    this.updateLocalR0();
  };

  onDateSliderChange(name: string): void {
    switch (name) {
      case "globaloverview":
        if (this.controlSettings.linkGlobal && !this.globalAnimateInterval) this.linkAllGlobal(this.controlSettings.globalOverview.max);
        else this.updateGlobalOverview();
        break;
      case "globalinfectedmap":
        if (this.controlSettings.linkGlobal && !this.globalAnimateInterval) this.linkAllGlobal(this.controlSettings.globalInfectedMap.index);
        else this.updateGlobalInfectedMap();
        break;
        break;
      case "globalstatus":
        if (this.controlSettings.linkGlobal && !this.globalAnimateInterval) this.linkAllGlobal(this.controlSettings.globalStatus.index);
        else this.updateGlobalStatus();
        break;
      case "globalstats":
        if (this.controlSettings.linkGlobal && !this.globalAnimateInterval) this.linkAllGlobal(this.controlSettings.globalStats.index);
        else this.updateGlobalStats();
        break;
      case "localstats":
        if (this.controlSettings.linkLocal && !this.localAnimateInterval) this.linkAllLocal(this.controlSettings.localStats.index);
        else this.updateLocalStats();
        break;
      case "localoverview":
        if (this.controlSettings.linkLocal && !this.localAnimateInterval) this.linkAllLocal(this.controlSettings.localOverview.max);
        else this.updateLocalOverview();
        break;
      case "localbreakdown":
        if (this.controlSettings.linkLocal && !this.localAnimateInterval) this.linkAllLocal(this.controlSettings.localBreakdown.max);
        else this.updateLocalBreakdown();
        break;
      case "localgrowth":
        if (this.controlSettings.linkLocal && !this.localAnimateInterval) this.linkAllLocal(this.controlSettings.localGrowth.max);
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

  selectedScopeChanged(name: string) {
    if (name == "infected") {
      this.globalInfectedMapGraph.layout.geo.scope = (<HTMLSelectElement>document.getElementById("infected-scope-select")).value;
      delete this.globalInfectedMapGraph.layout.geo["center"];
      PlotlyModule.plotlyjs.react(document.getElementById("global-infected-plot").children.item(0), this.globalInfectedMapGraph.data, this.globalInfectedMapGraph.layout);
    } else if (name == "tests") {
      this.globalTestsGraph.layout.geo.scope = (<HTMLSelectElement>document.getElementById("tests-scope-select")).value;
      delete this.globalTestsGraph.layout.geo["center"];
      PlotlyModule.plotlyjs.react(document.getElementById("global-tests-plot").children.item(0), this.globalTestsGraph.data, this.globalTestsGraph.layout);
    }
  }
}
