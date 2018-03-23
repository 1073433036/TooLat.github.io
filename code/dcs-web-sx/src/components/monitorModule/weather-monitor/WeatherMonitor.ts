import Vue from 'vue'
import { Component, Watch, Prop } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WeatherMonitor.html?style=./WeatherMonitor.scss'

import { MeteoMonitor } from '../../../util/MeteoMonitor'
import { Helper } from '../../../util/Helper'
import { StationClient, GeographyClient } from '../../../util/clientHelper'
import windHelper from '../../../util/windHelper'
import moment from 'moment'
let viewer: Zearth.Viewer = window['viewer']
@WithRender
@Component
export default class WeatherMonitor extends Vue {
  @Getter('systemStore/region_global') region_global
  @Getter('systemStore/datetime_global') datetime_global
  @Action('monitorStore/changeRealPopup_global') changeRealPopup_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/changeWeatherEleTime_global') changeWeatherEleTime_global
  @Prop({ default: false }) isWaterMonitorOn: boolean
  @Prop({ default: false }) isVideoMonitorOn: boolean

  isComponentAlive: boolean = true
  optionSelected: any = {
    station: false,
    cappi: false,
    clound: false
  }
  stationReal: any = {}
  townCollection: any[] = []
  towns: any = {}
  townGeometry: any[] = []
  townGeometryKey: string = null
  townHandler: any = null
  realPopup: any = {
    show: false,
    detail: true,
    name: '',
    address: '',
    elements: {
      temp: { text: '气温', value: '', unit: '℃' },
      ps: { text: '气压', value: '', unit: 'hpa' },
      rh: { text: '湿度', value: '', unit: '%' },
      windVelLevel: { text: '风力等级', value: '', unit: '级' },
      windvel: { text: '风力风速', value: '', unit: 'm/s' },
      windDirLevel: { text: '风向', value: '', unit: '' },
      winddir: { text: '风向', value: '', unit: '°' },
      rain: { text: '6分钟雨量', value: '', unit: 'mm' },
      rain1h: { text: '1小时雨量', value: '', unit: 'mm' },
      rain3h: { text: '3小时雨量', value: '', unit: 'mm' },
      rain12h: { text: '12小时雨量', value: '', unit: 'mm' },
    },
    pos: {
      top: 0,
      left: 0
    },
    className: null
  }
  layers: any = {}

  mounted() {
    this.selectOption('station')
  }

  selectOption(type: string) {
    this.optionSelected[type] = !this.optionSelected[type];
  }
  //自动站
  async initReal() {
    let time: any = new Date(this.datetime_global);
    let minute = time.getMinutes();
    time = time.getTime() - minute % 5 * 60000 - 10 * 60000;
    time = moment(time).format('YYYY-MM-DD HH:mm:00');
    let data = await StationClient.getStationReal(time);
    if (data && data.length) {
      let obj = {};
      for (let info of data) {
        info.windVelLevel = info.windvel ? windHelper.getVelLevel(info.windvel) : null;
        info.windDirLevel = info.winddir ? windHelper.getDirLevel(info.winddir) : null;
        obj[info.townId] = info;
      }
      this.stationReal = { ...obj }
      this.changeWeatherEleTime_global({ type: '自动站', time, value: true })
    } else {
      this.stationReal = {}
      this.changeWeatherEleTime_global({ type: '自动站', time, value: false })
    }
  }
  async initTown() {
    let countyId = this.region_global.countyId;
    let towns = await GeographyClient.getTownsBound(countyId);
    if (!towns) return;
    let helper = new Helper();
    for (let town of towns) {
      this.towns[town.townId] = town;
      for(let boundary of town.boundary) {
        let pos = [];
        for (let info of boundary) {
          pos.push(info.x);
          pos.push(info.y);
        }
        let polygon = helper.addPolygonGeometry(pos, town.townId + '_' + town.name, new Zearth.ColorGeometryInstanceAttribute(1.0, 1.0, 1.0, .1));
        this.townCollection.push(polygon);
      }
    }
    this.towns = { ...this.towns };
    helper = null;
  }
  removeTown() {
    let helper = new Helper();
    if (!this.townCollection) return;
    for (let town of this.townCollection)
      helper.removeCollection(town);
    this.townCollection = [];
    helper = null;
  }
  initTownEvent() {
    let helper = new Helper();
    if (!this.townHandler) this.townHandler = helper.getNewHandler();
    let realPopup = this.realPopup;
    
    this.townHandler.setInputAction(movement => {
      let position = window['viewer'].scene.pick(movement.endPosition);
      if (Zearth.defined(position)) {
        if(typeof position.id !== 'string' || position.id.indexOf('_') === -1) {
          realPopup.show = false;
          this.changeRealPopup_global(realPopup);
          return;
        }

        realPopup.show = true;
        let h = window.innerHeight;
        let w = window.innerWidth;
        let y = movement.endPosition.y;
        let x = movement.endPosition.x;
        realPopup.pos.top = y;
        realPopup.pos.left = x;
        if(h - y < 174 && w - x < 200) {
          realPopup.className = 'both';
        } else if (h - y < 174 && w - x >= 200) {
          realPopup.className = 'tp';
        } else if(h - y >= 174 && w - x < 200) {
          realPopup.className = 'lf';          
        } else {
          realPopup.className = null;
        }

        let townId = position.id.split('_')[0];
        let real = this.stationReal[townId];
        let townName = position.id.split('_')[1];    
        realPopup.name = townName;

        const addTown = () => {
          this.townGeometryKey = position.id;
          for(let boundary of this.towns[townId].boundary) {
            let pos = [];
            for (let info of boundary) {
              pos.push(info.x);
              pos.push(info.y);
            }
            let polygon = helper.addPolygonGeometry(pos, position.id);
            this.townGeometry.push(polygon);
          }
        }
        if(this.townGeometryKey) {
          if(this.townGeometryKey !== position.id) {
            this.removeTownGeometry();
            addTown();
          }
        } else {
          addTown();
        }

        if(real) {
          for(let key in realPopup.elements) {
            let val
            if (Math.abs(real[key]) > 8888 || (key === 'ps' && real[key] < 900)) val = 0
            else val = real[key]
            realPopup.elements[key].value = val
          }
        } else {
          for(let key in realPopup.elements) {
            realPopup.elements[key].value = 0
          }
        }
        this.changeRealPopup_global(realPopup);
      } else {
        this.removeTownGeometry();
        realPopup.show = false;
        this.changeRealPopup_global(realPopup);
      }
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE);
  }
  removeTownEvent() {
    if (!this.townHandler) return;
    let helper = new Helper();
    helper.removeAction(this.townHandler, 'mouseOver');
    helper = null;
  }
  removeTownGeometry() {
    if(this.townGeometryKey) {
      let helper = new Helper();
      for(let geometry of this.townGeometry)
        helper.removeCollection(geometry);
      this.townGeometry = [];
      this.townGeometryKey = null;
      helper = null;
    }
  }


  //雷达 云图
  addLayer(type, layer) {
    let helper = new Helper();
    if (type in this.layers) {
      helper.removeImgLayer(this.layers[type]);
    }
    if ((type === 'cappi_3' && this.optionSelected.cappi && this.isComponentAlive) || (type === 'VIS' && this.optionSelected.clound && this.isComponentAlive))
      this.layers[type] = helper.addImgLayer(layer.imgUrl, layer);
    helper = null;
  }
  addCappiProduct(type) {
    let _meteo = new MeteoMonitor;
    let time: any = new Date(this.datetime_global);
    let minute = time.getMinutes();
    time = time.getTime() - minute % 6 * 60000;
    time = moment(time).format('YYYY-MM-DD HH:mm:00');
    // _meteo.getSwanProduct(type, time)
    _meteo.getCappiProduct(time)
      .then((layer: any) => {
        this.addLayer(type, layer);
        if (this.optionSelected.cappi && this.isComponentAlive)
          this.changeWeatherEleTime_global({ type: '雷达拼图', time: layer.datetime, value: true })
        else
          this.changeWeatherEleTime_global({ type: '雷达拼图' })
      })
      .catch(e => {
        let helper = new Helper()
        if (type in this.layers)
          helper.removeImgLayer(this.layers[type])
        helper = null
        if (this.optionSelected.cappi && this.isComponentAlive)
          this.changeWeatherEleTime_global({ type: '雷达拼图', time: e, value: false })
        else
          this.changeWeatherEleTime_global({ type: '雷达拼图' })
        // this.toggleOprateTip_global({ tip: true, text: '当前时段雷达获取失败' })
      })
    _meteo = null;
  }
  addColorBar() {
    let barEl;
    if(!document.getElementById('colorBar')) {
      barEl = document.createElement('div');
      barEl.id = 'colorBar';
      barEl.style.position = 'absolute';
      barEl.style.top = 'calc(42% - 150px)';
      barEl.style.left = '20px';
      barEl.style.width = '45px';
      barEl.style.height = '310px';
      barEl.style.backgroundColor = 'rgba(255, 255, 255, 0.5)';
      barEl.style.backgroundPosition = 'center';
      barEl.style.backgroundRepeat = 'no-repeat';
    } else {
      barEl = document.getElementById('colorBar');
    }
    barEl.style.backgroundImage = 'url(http://10.148.10.80:8111/discrete/colortable/pic/radar,35,300,2,1/JSONP/cache)';
    document.body.appendChild(barEl);
  }
  removeColorBar() {
    let barEl = document.getElementById('colorBar');
    if(barEl) document.body.removeChild(barEl);
  }
  addCloudLayer(type) {
    let _meteo = new MeteoMonitor;
    let time = moment(this.datetime_global).format('YYYY-MM-DD HH:00:00');
    _meteo.getCloudImage(type, time)
      .then((layer: any) => {
        this.addLayer(type, layer);
        if (this.optionSelected.clound && this.isComponentAlive)
          this.changeWeatherEleTime_global({ type: '云图', time: layer.datetime, value: true })
        else
          this.changeWeatherEleTime_global({ type: '云图' })
      })
      .catch(e => {
        this.removeMeteoLayer(type);
        if (this.optionSelected.clound && this.isComponentAlive)
          this.changeWeatherEleTime_global({ type: '云图', time: e, value: false })
        else
          this.changeWeatherEleTime_global({ type: '云图' })
        // this.toggleOprateTip_global({ tip: true, text: '当前时段云图获取失败' })
      });
    _meteo = null;
  }
  removeMeteoLayer(type) {
    let helper = new Helper();
    helper.removeImgLayer(this.layers[type]);
    delete this.layers[type];
    helper = null;
  }


  @Watch('optionSelected.station')
  async onStationChanged(val: any, oldVal: any) {
    if (val) {
      await this.initReal();
      await this.initTown();
      this.initTownEvent();
    }
    else {
      this.removeTown();
      this.removeTownEvent();
      if(this.realPopup.show) {
        this.realPopup.show = false;
        this.changeRealPopup_global(this.realPopup);
      }
      this.removeTownGeometry();
      this.changeWeatherEleTime_global({ type: '自动站' })
    }
  }

  @Watch('optionSelected.cappi')
  onCappiChanged(val: any, oldVal: any): void {
    const type = 'cappi_3';
    if (val) {
      this.addCappiProduct(type);
      this.addColorBar()
    } else {
      this.removeMeteoLayer(type);
      this.removeColorBar()
      this.changeWeatherEleTime_global({ type: '雷达拼图' })
    }
  }

  @Watch('optionSelected.clound')
  onCloundChanged(val: any, oldVal: any): void {
    const type = 'VIS';
    if (val)
      this.addCloudLayer(type);
    else {
      this.removeMeteoLayer(type);
      this.changeWeatherEleTime_global({ type: '云图' })
    }
  }

  @Watch('datetime_global')
  async ondatetime_globalChanged(val: any, oldVal: any) {
    if (this.optionSelected.station) {
      this.initReal();
    }
    if (this.optionSelected.cappi) {
      const type = 'cappi_3';
      this.addCappiProduct(type);
    }
    if (this.optionSelected.clound) {
      const type = 'VIS';
      this.addCloudLayer(type);
    }
  }

  beforeDestroy() {
    this.isComponentAlive = false
    if (this.optionSelected.station) {
      this.removeTown();
      this.removeTownEvent();
      if(this.realPopup.show) {
        this.realPopup.show = false;
        this.changeRealPopup_global(this.realPopup);
      }
      this.removeTownGeometry();
      this.changeWeatherEleTime_global({ type: '自动站' })
    }
    if (this.optionSelected.cappi) {
      const type = 'cappi_3';
      this.removeMeteoLayer(type);
      this.removeColorBar()
      this.changeWeatherEleTime_global({ type: '雷达拼图' })
    }
    if (this.optionSelected.clound) {
      const type = 'VIS';
      this.removeMeteoLayer(type);
      this.changeWeatherEleTime_global({ type: '云图' })
    }
  }
}