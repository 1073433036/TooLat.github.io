import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './RainMonitor.html?style=./RainMonitor.scss'
import { offset_rain, scale_rain, colors_rain } from "../../../config/rain3DConf";
import moment from 'moment'
import { Helper } from "../../../util/Helper";
import fetchJsonp from 'fetch-jsonp'


let weatherSceneHolder = null
let pickingHandler = null
let rainData = null
let isComponentLiving: boolean = false,
  gridInfo = null,
  gridData = null,
  ncResult = null,
  fileName = null

@WithRender
@Component
export default class RainMonitor extends Vue {
  @Action('systemStore/storeGridPickingValue_global') storeGridPickingValue_global
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global

  rainFstTimeRule: number[] = [
    1, 3, 6, 12, 24, 48, 72
  ]
  rainFstTimeData: any[] = []
  isRainFstTime: boolean = false
  rainSeledTimeSelected: number = this.rainFstTimeRule[0]
  rainSelectedIndex: number = 0
  fstTimelineView: any = null
  intervalHolder: any = null
  isPlaying: boolean = false
  isTransitionOn: boolean = false

  async mounted() {
    isComponentLiving = true
    this.isRainFstTime = true
    this.rainFstTimeData = []
    this.rainFstTimeRule.forEach(el => {
      let momentHolder = moment()
      momentHolder.subtract('hours', el)
      this.rainFstTimeData.push({
        date: momentHolder.format('YY-MM-DD'),
        time: momentHolder.format('HH:mm'),
        seledTime: el
      })
    })
    let isSuccesses = await this.rainAnalysis()
    if (isSuccesses)
      this.addGridPickingValueEvent()
  }

  destroyed() {
    this.removeColorBar()
    isComponentLiving = false
    if (weatherSceneHolder)
      window['viewer']['removeGridLayer'](weatherSceneHolder)

    weatherSceneHolder = null
    this.storeGridPickingValue_global(null)
    if (pickingHandler)
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
    pickingHandler = null

    gridData = null
    gridInfo = null
    ncResult = null
    fileName = null
  }

  @Watch('rainSeledTimeSelected')
  async onrainSeledTimeSelectedChanged(val: any, oldVal: any) {
    // if (!weatherSceneHolder) return
    let isSuccesses = await this.rainAnalysis()
    if (isSuccesses && !pickingHandler) {
      this.addGridPickingValueEvent()
    }
  }

  changeRainSelectedTime(val: number) {
    this.rainSelectedIndex = val
    this.rainSeledTimeSelected = this.rainFstTimeRule[val]
  }

  togglePlaying() {
    if (!this.isPlaying) {
      if (this.rainSelectedIndex < 6) {
        this.isTransitionOn = true
        ++this.rainSelectedIndex
      } else {
        this.isTransitionOn = false
        this.rainSelectedIndex = 0
      }
      this.rainSeledTimeSelected = this.rainFstTimeRule[this.rainSelectedIndex]

      this.intervalHolder = setInterval(() => {
        if (this.rainSelectedIndex < 6) {
          this.isTransitionOn = true
          ++this.rainSelectedIndex
          this.rainSeledTimeSelected = this.rainFstTimeRule[this.rainSelectedIndex]
        } else {
          this.isTransitionOn = false
          this.clearRainInterval()
          this.isPlaying = false 
        }
      }, 3000)
    } else {
      this.isTransitionOn = false
      this.clearRainInterval()
    }
    this.isPlaying = !this.isPlaying
  }

  clearRainInterval() {
    if (this.intervalHolder) {
      clearInterval(this.intervalHolder)
      this.intervalHolder = null
    }
  }

  addGridPickingValueEvent() {
    let helper = new Helper()
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let lonlat = window['viewer'].lonlat(movement.endPosition)
      let pos = helper.getDegByWinPos(movement.endPosition)
      let rain
      try {
        // rain = window['WeatherScence'].interpModel(gridData, gridInfo, ...pos)
        rain = weatherSceneHolder.interp(lonlat.longitude, lonlat.latitude)
      }
      catch (err) {
        this.storeGridPickingValue_global(null)
        return
      }
      if (rain === null || rain < 0) {
        this.storeGridPickingValue_global(null)
        return
      }
      this.storeGridPickingValue_global({
        x: movement.endPosition.x,
        y: movement.endPosition.y,
        titleText: '降雨量',
        valText: rain.toFixed(1) + '(mm)'
      })
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }

  async rainAnalysis() {
    this.addColorBar()
    if (!gridInfo) {
      let fileUrl = 'http://10.148.83.228:9002/nc/jsonp/list/meteohist_nc'
      let res = await fetchJsonp(fileUrl)
      let data = await res.json()
      fileName = data[data.length - 1]

      let ncUrl = `http://10.148.83.228:9002/nc/jsonp/ncinfo?&modelName=meteohist_nc&fileName=${fileName}`
      res = await fetchJsonp(ncUrl)
      ncResult = await res.json()
    }
    let dataUrl = getDataUrl(fileName, this.rainSeledTimeSelected)
    let res = await fetchJsonp(dataUrl)
    let data = await res.json()

    gridData = data
    gridInfo = {
      top: ncResult.topLat,
      left: ncResult.leftLon,
      bottom: ncResult.topLat - ((ncResult.latDim - 1) * ncResult.latGap),
      right: ncResult.leftLon + ((ncResult.lonDim - 1) * ncResult.lonGap),
      xgap: ncResult.lonGap,
      ygap: ncResult.latGap,
      xdim: ncResult.lonDim,
      ydim: ncResult.latDim
    }

    if (weatherSceneHolder)
      weatherSceneHolder.evoluteData(gridData)
    else
      weatherSceneHolder = window['viewer']['addGridLayer'](gridData,
        gridInfo, "surface", colors_rain, scale_rain, offset_rain, window['Zearth'].Bounds.GuangDong)
    return true

    function getDataUrl(filename, time): string {
      return `http://10.148.83.228:9002/nc/jsonp/nc/data/area?&modelName=meteohist_nc&filepath=/home/program/model/meteohist_nc/&filename=${filename}&seledLevel=${ncResult.levels[0]}&seledTime=${time}&seledVar=rain`
    }
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
    barEl.style.backgroundImage = 'url(http://10.148.10.80:8111/discrete/colortable/pic/rain,35,300,2,1/JSONP/cache)';
    document.body.appendChild(barEl);
  }
  removeColorBar() {
    let barEl = document.getElementById('colorBar');
    if(barEl) document.body.removeChild(barEl);
  }
}