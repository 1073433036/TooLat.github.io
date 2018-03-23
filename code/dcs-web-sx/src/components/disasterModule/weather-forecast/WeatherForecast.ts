import Vue from 'vue'
import { Component, Watch } from 'vue-property-decorator'
import { Action, Getter } from 'vuex-class'
import WithRender from './WeatherForecast.html?style=./WeatherForecast.scss'

import moment from 'moment'
import Flatpickr from "flatpickr"
import ZH from 'flatpickr/dist/l10n/zh.js'
import { Helper } from "../../../util/Helper"
import ProgressPanel from "../../commonCompt/progress-panel/ProgressPanel"
import { offset_rain, scale_rain, colors_rain } from "../../../config/rain3DConf"

let viewer: Zearth.Viewer = null
let pickingHandler: any = null

let rainData: any = {}
let rainSceneHolder: any = null

let uWindData: Array<Array<number>> = null
let vWindData: Array<Array<number>> = null
let windGridInfo: any = null
let windSceneHolder: boolean = false

@WithRender
@Component({
  components: {
    ProgressPanel
  },
})
export default class WeatherForecast extends Vue {
  @Action('systemStore/toggleOprateTip_global') toggleOprateTip_global
  @Action('systemStore/storeWindPickingValue_global') storeWindPickingValue_global
  @Action('systemStore/storeGridPickingValue_global') storeGridPickingValue_global
  @Getter('systemStore/isWeatherForecastPopupOn_global') isWeatherForecastPopupOn_global
  @Getter('systemStore/blurControl_global') blurControl_global

  isComponentAlive: boolean = true
  playingStatus: string = null
  transformY: number = 0              // 相对菜单的位置
  timeCategory: '分' | '时' = '时'

  datePicker: any = 0         // 日历
  dateString: string = ''     // 日历日期
  calendarStatus: boolean = false     // 日历开关状态

  isElementSelectionShow: boolean = false           // 元素选择框
  elementSelected: 'qpfhour' | 'wind' = 'qpfhour'
  elementSelectedString: string = '短临降雨'

  isHourSelectionShow: boolean = false              // 小时选择框
  hourSelected: number = 0
  hourSelectedString: string = '00:00'

  windRegion: 0 | 1 | 2 = 0
  seedMultiplier: number = 1     // 时间间隔

  forseeHourData = {             // 预测时间个数
    qpfhour: 3,
    wind: 56
  }
  leadTimeHolder: { wind: number[], rain: number[] } = {    // 起报时间
    wind: [0, 12],
    rain: [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]
  }
  leadTimeForRender: number[] = this.leadTimeHolder.rain

  isShowingTipDateString: boolean = false     // 播放时 时间提示框
  tipDatetimeIndex: number = 0
  tipDateString: any = { date: '', hour: '' }
  playingDateString: any = { date: '', hour: '' }

  forceStopPlaying = Date.now()
  isLoadData: boolean = false         // 用于判断数据添加是否完成


  async mounted() {
    viewer = window['viewer']

    let mainMenuY = document.querySelector('#mainMenu').getBoundingClientRect().top
    let windHeight = document.body.clientHeight
    this.transformY = windHeight - mainMenuY - document.querySelector('#weatherForecast').clientHeight - 20

    this.dateString = moment().format('YYYY-MM-DD')
    this.selectHour(Number(moment().format('HH')))

    let _this = this
    this.datePicker = new Flatpickr(document.querySelector('#weatherDatePicker'), {
      locale: ZH.zh,
      onChange(date) {
        _this.dateString = moment(date[0]).format('YYYY-MM-DD')
        _this.calendarStatus = false
      }
    })

    // 获取最新qpf预报时间
    let res = await fetch('http://10.148.83.228:2008/projshare/grid/qpf/last?leadTime=60')
    let data = await res.json()
    if (!data || !data.tagObject || !data.tagObject.startTime) return
    let startTime = data.tagObject.startTime
    this.dateString = moment(startTime).format('YYYY-MM-DD')
    this.selectHour(Number(moment(startTime).format('HH')))
  }

  destroyed() {
    this.isComponentAlive = false
    this.storeWindPickingValue_global(null)
    this.storeGridPickingValue_global(null)
    if (pickingHandler)
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
    if (rainSceneHolder) {        // 删除降雨
      viewer['removeGridLayer'](rainSceneHolder)
      rainSceneHolder = null
    }
    viewer['weather']('none')     // 降雨 风
    if (windSceneHolder) windSceneHolder = false
  }

  // 用于播放回调
  toggleLoadData() {
    this.isLoadData = false
  }

  openCalendar() {
    if (this.calendarStatus)
      this.datePicker.close()
    else
      this.datePicker.open()
    this.calendarStatus = !this.calendarStatus
  }

  @Watch('blurControl_global')
  onblurControl_globalChanged(val: any, oldVal: any): void {
    this.datePicker.close()
    this.isElementSelectionShow = false
    this.isHourSelectionShow = false
    this.calendarStatus = false
  }

  // 元素选择
  selectElement(element, string: string) {
    this.elementSelected = element
    this.elementSelectedString = string
    this.isElementSelectionShow = false
    if (element.includes('wind')) {
      this.leadTimeForRender = this.leadTimeHolder.wind
      switch (element) {
        case 'wind0': this.windRegion = 0; break;
        case 'wind1': this.windRegion = 1; break;
        case 'wind2': this.windRegion = 2; break;
        default: this.windRegion = 0; break;
      }
    }
    else
      this.leadTimeForRender = this.leadTimeHolder.rain

    if (this.elementSelected.includes('wind')) {
      this.hourSelected = this.leadTimeForRender[0]
      this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).add(8, 'hours')
        .format('HH:00')
    } else
      this.selectHour(Number(moment().format('HH')))
  }

  // 元素切换
  @Watch('elementSelected')
  onelementSelectedChanged(val: any, oldVal: any): void {
    this.forceStopPlaying = Date.now()
    if (val === 'qpfhour') {
      this.seedMultiplier = 1
      this.timeCategory = '时'
    } else if (val === 'wind') {
      this.seedMultiplier = 3
      this.timeCategory = '时'
    }
    if (oldVal === 'qpfhour') {
      this.storeGridPickingValue_global(null)
      if (pickingHandler)
        pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      if (rainSceneHolder) {
        viewer['removeGridLayer'](rainSceneHolder)
        rainSceneHolder = null
      }
      viewer['weather']('none')
    } else if (oldVal === 'wind') {
      this.storeWindPickingValue_global(null)
      if (pickingHandler)
        pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      viewer['weather']('none')
      if(windSceneHolder)
        windSceneHolder = false
    }
  }
  
  // 切换显示小时面板
  toggleHourSelection() {
    this.isHourSelectionShow = !this.isHourSelectionShow
    if (this.isHourSelectionShow)
      this.$nextTick(() => { 
        document.querySelector('#weatherForecast .hour-selection').scrollTop = (this.hourSelected - 1) * 22 
      })
  }
  
  // 小时选择
  selectHour(hour) {
    this.hourSelected = hour
    if (this.elementSelected.includes('wind'))
      this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).add(8, 'hours')
        .format('HH:00')
    else
      this.hourSelectedString = moment(`${this.dateString} ${this.hourSelected}:00`).format('HH:00')
    this.isHourSelectionShow = false
  }

  // 播放状态改变
  onPlaying(val) {
    this.playingStatus = val
  }

  // 初始播放事件
  async onPlayingStart(val) {
    this.playingDateString = this.computeDateTimeString(val)

    let isSuccessGotTheData = false
    if (this.elementSelected === 'qpfhour') {
      isSuccessGotTheData = await this.getRainData(val)
    } else {
      isSuccessGotTheData = await this.drawWindField(viewer, val)
    }

    if (!isSuccessGotTheData) {
      this.isLoadData = true
      return
    }

    if (this.elementSelected === 'qpfhour') {
      await this.drawRainParticle(viewer)
      this.addGridPickingValueEvent()
    } else {
      this.addWindPickingValueEvent()
    }
  }

  // 播放事件
  async onPlayingChange(val: any, oldVal: any) {
    this.playingDateString = this.computeDateTimeString(val)
    if (this.elementSelected === 'qpfhour') {
      let isSuccessGettingDate = await this.getRainData(val)
      if (!isSuccessGettingDate) {
        this.isLoadData = true
        return
      }
      this.drawRainParticle(viewer)
    } else if (this.elementSelected.includes('wind')) {
      let isSuccessGettingDate = this.drawWindField(viewer, val)
      if (!isSuccessGettingDate) {
        this.isLoadData = true
      }
    }
  }

  // 终止播放事件
  async onPlayingStop(val: number, oldVal: number) {
    viewer['weather']('none')
    if(windSceneHolder)
      windSceneHolder = false
    if (pickingHandler) {
      pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      pickingHandler = null
    }
    if (rainSceneHolder) {
      viewer['removeGridLayer'](rainSceneHolder)
      rainSceneHolder = null
    }
    this.storeWindPickingValue_global(null)
    this.storeGridPickingValue_global(null)
  }

  onForseeHourOver(el) {
    this.tipDateString = this.computeDateTimeString(el)
  }

  computeDateTimeString(playingSeed) {
    let date
    if (this.elementSelected.includes('wind')) {
      date = moment(`${this.dateString} ${this.hourSelected === 0 ? '00' : 12}:00:00`)
      date.add(8, 'hours')
      date.add(playingSeed * this.seedMultiplier, 'hours')
    }
    else if (this.elementSelected === 'qpfhour') {
      date = moment(`${this.dateString} ${this.hourSelected}:00:00`)
      date.add(playingSeed * this.seedMultiplier, 'hours')
    }
    else {
      date = moment(`${this.dateString} ${this.hourSelected}:00:00`)
      date.add(playingSeed * this.seedMultiplier, 'minutes')
    }

    return {
      date: date.format('YYYY-MM-DD'),
      hour: date.format('HH:mm')
    }
  }

  /***** 数据 *****/
  getDateStringForFetch() {
    let dateObj = moment(`${this.dateString} ${this.hourSelected}:00`)
    if (this.elementSelected.includes('wind'))
      return dateObj.subtract(12, 'hours').format('YYYY-MM-DD HH:mm:00')
    else
      return dateObj.format('YYYY-MM-DD HH:00:00')
  }

  // 获取风数据 绘制
  async drawWindField(viewer: Zearth.Viewer, playingSeed): Promise<boolean> {
    // let res = await fetch(`http://10.148.83.228:8086/forecast/grapes/uvwind/user/post/,/post?datetime=${this.playingDateString.date} ${this.playingDateString.hour}:00&cache=${new Date().getTime()}`, {
    let res = await fetch(`http://10.148.83.228:2008/projshare/grid/grapes/uv/zh?datetime=${this.playingDateString.date} ${this.playingDateString.hour}:00&cache=${new Date().getTime()}`, {
      cache: 'no-cache',
      method: 'get',
      mode: 'cors'
    })
    let data = await res.json()
    if (data.result !== 'S_OK')
      this.toggleOprateTip_global({ tip: true, text: '选中时次无数据' })
    if (!this.isComponentAlive || this.playingStatus === 'stop' || data.result !== 'S_OK') {
      if (pickingHandler)
        pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      viewer['weather']('none')
      windSceneHolder = false
      return false
    }
    windGridInfo = data.tagObject.gridinfo
    // windGridInfo.xgap = windGridInfo.xgrap
    // windGridInfo.ygap = windGridInfo.ygrap
    uWindData = data.tagObject.u10m
    vWindData = data.tagObject.v10m
    if (!windSceneHolder) {
      viewer['weather']('wind', 'line', uWindData, vWindData, windGridInfo, null)
      viewer['getWeatherScence']().blur = true
      windSceneHolder = true
    } else {
      viewer['getWeatherScence']().evoluteData(uWindData, vWindData)
    }
    this.isLoadData = true
    return true
  }

  // 风场数据获取 鼠标移动事件
  addWindPickingValueEvent() {
    let helper = new Helper()
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let pos = helper.getDegByWinPos(movement.endPosition)
      let u = window['WeatherScence'].interpModel(uWindData,
        windGridInfo, ...pos)
      let v = window['WeatherScence'].interpModel(vWindData,
        windGridInfo, ...pos)
      let val = window['WeatherScence'].getVel(u, v)
      if (val > 300) {
        this.storeWindPickingValue_global(null)
        return
      }
      let dir = window['WeatherScence'].getDir(u, v)
      this.storeWindPickingValue_global({
        x: movement.endPosition.x,
        y: movement.endPosition.y, dir, val
      })
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }

  // 获取短临降雨数据
  async getRainData(playingSeed) {
    rainData = {}
    let res, data, dateTime = this.getDateStringForFetch()
    if (Date.now() % 3600000 < 600000)
      dateTime = moment(dateTime).subtract(6, 'minutes').format('YYYY-MM-DD HH:mm:00')
    try {
      // res = await fetch(`http://10.148.83.228:8086/forecast/rtdata/user/post/,/post?&start=${dateTime}&leadtime=${playingSeed * this.seedMultiplier * 60}&cache=` + new Date().getTime(), {
      res = await fetch(`http://10.148.83.228:2008/projshare/grid/qpf?startTime=${dateTime}&leadTime=${playingSeed * this.seedMultiplier * 60}&cache=` + new Date().getTime(), {      
        mode: 'cors',
        method: 'GET',
        cache: 'no-cache'
      })
      data = await res.json()
    }
    catch (err) {
      if (rainSceneHolder) {
        viewer['removeGridLayer'](rainSceneHolder)
        rainSceneHolder = null
      }
      viewer['weather']('none')
      this.toggleOprateTip_global({ tip: true, text: '选中时次没有数据' })
      return
    }
    if (data.result !== 'S_OK') {
      if (rainSceneHolder) {
        viewer['removeGridLayer'](rainSceneHolder)
        rainSceneHolder = null
      }
      viewer['weather']('none')
      this.toggleOprateTip_global({ tip: true, text: '选中时次没有数据' })
      return false
    }
    rainData = data.tagObject
  
    // rainData.gridinfo.xgap = data.tagObject.gridinfo.xgrap
    // rainData.gridinfo.ygap = data.tagObject.gridinfo.ygrap
    return true
  }

  // 绘制降雨
  async drawRainParticle(viewer: Zearth.Viewer): Promise<boolean> {
    if (rainData['rain'][0][0] === null)
      this.toggleOprateTip_global({ tip: true, text: '当前时间没有数据!' })
    if (!this.isComponentAlive || this.playingStatus === 'stop' || rainData['rain'][0][0] === null) {
      if (pickingHandler)
        pickingHandler.removeInputAction(Zearth.ScreenSpaceEventType.MOUSE_MOVE)
      viewer['weather']('none')
      if (rainSceneHolder) {
        viewer['removeGridLayer'](rainSceneHolder)
        rainSceneHolder = null
      }
      return false
    }
    if (!rainSceneHolder) {
      rainSceneHolder = viewer['addGridLayer'](rainData.rain, rainData.gridinfo, "surface", colors_rain, scale_rain, offset_rain)
      viewer['weather']('auto', null, rainData.rain, rainData.t2mm, rainData.gridinfo)
    } else {
      rainSceneHolder.evoluteData(rainData['rain'])
      viewer['weather']('auto', null, rainData.rain, rainData.t2mm, rainData.gridinfo)
    }
    this.isLoadData = true
    return true
  }

  // 雨量详细数据获取
  addGridPickingValueEvent() {
    let helper = new Helper()
    pickingHandler = new Zearth.ScreenSpaceEventHandler()
    pickingHandler.setInputAction(movement => {
      let pos = helper.getDegByWinPos(movement.endPosition)
      let grid
      try {
        grid = window['WeatherScence'].interpModel(rainData.rain, rainData.gridinfo, ...pos)
      }
      catch (err) {
        this.storeGridPickingValue_global(null)
        return
      }
      if (grid < 0) {
        this.storeGridPickingValue_global(null)
        return
      }
      this.storeGridPickingValue_global({
        x: movement.endPosition.x,
        y: movement.endPosition.y,
        valText: grid.toFixed(1) + '(mm)',
        titleText: '降雨量'
      })
    }, Zearth.ScreenSpaceEventType.MOUSE_MOVE)
  }

}

interface forseeDate {
  dateString: string
  hourString: string
  isValidateSeed: boolean
  color: string | null
}
